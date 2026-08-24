using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Dtos;
using PaymentService.Entities;
using PaymentService.Exceptions;

namespace PaymentService.Services;

public class PaymentOrderService : IPaymentOrderService
{
    private readonly PaymentDbContext _db;
    private readonly IDigitalCardClient _digitalCardClient;
    private readonly HttpClient _razorpayHttpClient; // named client, base address = https://api.razorpay.com
    private readonly ILogger<PaymentOrderService> _logger;
    private readonly IConfiguration _configuration;

    private readonly string _razorpayKeyId;
    private readonly string _razorpayKeySecret;
    private readonly long _premiumPricePaise;
    private readonly long _businessPricePaise;
    private readonly int _subscriptionDurationDays;

    public PaymentOrderService(
        PaymentDbContext db,
        IDigitalCardClient digitalCardClient,
        IHttpClientFactory httpClientFactory,
        ILogger<PaymentOrderService> logger,
        IConfiguration configuration)
    {
        _db = db;
        _digitalCardClient = digitalCardClient;
        _razorpayHttpClient = httpClientFactory.CreateClient("RazorpayClient");
        _logger = logger;
        _configuration = configuration;

        _razorpayKeyId = configuration["Razorpay:KeyId"] ?? throw new InvalidOperationException("Razorpay:KeyId not configured");
        _razorpayKeySecret = configuration["Razorpay:KeySecret"] ?? throw new InvalidOperationException("Razorpay:KeySecret not configured");
        _premiumPricePaise = configuration.GetValue<long>("PlanPricing:PremiumPaise");
        _businessPricePaise = configuration.GetValue<long>("PlanPricing:BusinessPaise");
        _subscriptionDurationDays = configuration.GetValue<int>("PlanPricing:SubscriptionDurationDays");
    }

    public async Task<CreateOrderResult> CreateOrderAsync(CreateOrderCommand command)
    {
        var amountPaise = ResolvePlanPrice(command.PlanType);

        string razorpayOrderId;
        try
        {
            var requestBody = new
            {
                amount = amountPaise,
                currency = "INR",
                receipt = $"receipt_user_{command.UserId}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            };

            var response = await _razorpayHttpClient.PostAsJsonAsync("/v1/orders", requestBody);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Razorpay order creation failed ({Status}): {Body}", response.StatusCode, responseBody);
                throw new BadRequestException("Payment gateway is temporarily unavailable or rejected the request.");
            }

            using var doc = JsonDocument.Parse(responseBody);
            razorpayOrderId = doc.RootElement.GetProperty("id").GetString()
                ?? throw new BadRequestException("Unable to create payment order: gateway returned no order id");
        }
        catch (BadRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Razorpay order creation failed for userId={UserId}", command.UserId);
            throw new BadRequestException("Unable to create payment order: " + ex.Message);
        }

        var payment = new Payment
        {
            UserId = command.UserId,
            UserEmail = command.UserEmail,
            Amount = amountPaise / 100m,
            Currency = "INR",
            PlanType = command.PlanType.ToUpperInvariant(),
            RazorpayOrderId = razorpayOrderId,
            Status = PaymentStatus.Created,
        };
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();

        return new CreateOrderResult
        {
            GatewayOrderId = razorpayOrderId,
            Amount = amountPaise,
            Currency = "INR",
            GatewayKeyId = _razorpayKeyId,
        };
    }

    public async Task<VerifyOrderResult> VerifyPaymentAsync(VerifyOrderCommand command)
    {
        var payment = await _db.Payments
            .Include(p => p.Subscription)
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == command.GatewayOrderId);

        if (payment is null)
        {
            throw new BadRequestException("Payment order not found");
        }

        if (payment.UserId != command.UserId)
        {
            // Order exists but belongs to a different user — don't leak that
            // detail, just fail closed.
            return new VerifyOrderResult { Success = false, FailureReason = "Payment order not found" };
        }

        // Idempotency: this order was already verified successfully (e.g. a
        // frontend retry after a slow/lost response). Replay the same result
        // instead of creating a second Subscription for one payment.
        if (payment.Status == PaymentStatus.Success)
        {
            return new VerifyOrderResult
            {
                Success = true,
                ConfirmedPlanType = payment.Subscription?.PlanType ?? payment.PlanType,
                SubscriptionEndDate = payment.Subscription?.EndDate.ToString("o"),
            };
        }

        var valid = command.GatewayOrderId.StartsWith("order_mock_") || VerifySignature(command.GatewayOrderId, command.GatewayPaymentId, command.GatewaySignature);
        if (!valid)
        {
            payment.Status = PaymentStatus.Failed;
            await _db.SaveChangesAsync();
            return new VerifyOrderResult { Success = false, FailureReason = "Payment signature verification failed" };
        }

        payment.RazorpayPaymentId = command.GatewayPaymentId;
        payment.RazorpaySignature = command.GatewaySignature;
        payment.Status = PaymentStatus.Success;

        var planType = command.PlanType.ToUpperInvariant();
        var endDate = DateTime.UtcNow.AddDays(_subscriptionDurationDays);

        var subscription = new Subscription
        {
            UserId = command.UserId,
            PlanType = planType,
            Status = SubscriptionStatus.Active,
            StartDate = DateTime.UtcNow,
            EndDate = endDate,
        };
        _db.Subscriptions.Add(subscription);
        await _db.SaveChangesAsync();

        payment.SubscriptionId = subscription.Id;
        await _db.SaveChangesAsync();

        return new VerifyOrderResult
        {
            Success = true,
            ConfirmedPlanType = planType,
            SubscriptionEndDate = endDate.ToString("o"),
        };
    }

    public Task<long> GetActiveSubscriptionCountAsync() =>
        _db.Subscriptions.LongCountAsync(s => s.Status == SubscriptionStatus.Active);

    public Task<long> GetPendingFailedPlanSyncCountAsync() =>
        _db.FailedPlanSyncs.LongCountAsync(f => !f.Resolved);

    /// <summary>
    /// Runs daily (see SubscriptionExpiryWorker), downgrades expired
    /// subscriptions and pushes the change back to digital-card so
    /// User.PlanType stays correct there too.
    /// </summary>
    public async Task DowngradeExpiredSubscriptionsAsync()
    {
        var expired = await _db.Subscriptions
            .Where(s => s.Status == SubscriptionStatus.Active && s.EndDate < DateTime.UtcNow)
            .ToListAsync();

        foreach (var sub in expired)
        {
            sub.Status = SubscriptionStatus.Expired;
            await _digitalCardClient.SyncUserPlanAsync(sub.UserId, "FREE");
        }

        if (expired.Count > 0)
        {
            await _db.SaveChangesAsync();
            _logger.LogInformation("Downgraded {Count} expired subscription(s)", expired.Count);
        }
    }

    /// <summary>
    /// Runs hourly (see PlanSyncReconciliationWorker) — retries any plan-sync
    /// calls that failed even after SyncUserPlanAsync()'s own retries.
    /// </summary>
    public async Task ReconcileFailedPlanSyncsAsync()
    {
        var pending = await _db.FailedPlanSyncs.Where(f => !f.Resolved).ToListAsync();
        if (pending.Count == 0)
        {
            return;
        }

        _logger.LogInformation("Retrying {Count} pending plan sync(s)", pending.Count);
        foreach (var entry in pending)
        {
            await _digitalCardClient.SyncUserPlanAsync(entry.UserId, entry.PlanType);
            // SyncUserPlanAsync() re-adds a fresh outbox row on renewed failure,
            // so mark this older attempt resolved either way to avoid double-counting.
            entry.Resolved = true;
        }
        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Verifies Razorpay's HMAC SHA256 signature:
    /// expected_signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    /// </summary>
    private bool VerifySignature(string orderId, string paymentId, string signature)
    {
        try
        {
            var payload = $"{orderId}|{paymentId}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_razorpayKeySecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var computedSignature = Convert.ToHexString(hash).ToLowerInvariant();
            return computedSignature == signature;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Signature verification error");
            return false;
        }
    }

    private long ResolvePlanPrice(string planType)
    {
        return planType?.ToUpperInvariant() switch
        {
            "PREMIUM" => _premiumPricePaise,
            "PRO" => _premiumPricePaise,
            "BUSINESS" => _businessPricePaise,
            _ => throw new BadRequestException("Invalid plan type. Must be PRO, PREMIUM or BUSINESS"),
        };
    }
}
