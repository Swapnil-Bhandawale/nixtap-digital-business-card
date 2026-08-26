using Microsoft.AspNetCore.Mvc;
using PaymentService.Data;
using PaymentService.Entities;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/payment/webhook")]
public class WebhookController : ControllerBase
{
    private readonly PaymentDbContext _db;
    private readonly ILogger<WebhookController> _logger;
    private readonly string _webhookSecret;
    private readonly int _subscriptionDurationDays;

    public WebhookController(PaymentDbContext db, IConfiguration configuration, ILogger<WebhookController> logger)
    {
        _db = db;
        _logger = logger;
        _webhookSecret = configuration["Razorpay:WebhookSecret"] ?? string.Empty;
        _subscriptionDurationDays = configuration.GetValue<int>("PlanPricing:SubscriptionDurationDays");
    }

    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var json = await reader.ReadToEndAsync();

        var signature = Request.Headers["X-Razorpay-Signature"].FirstOrDefault();
        if (string.IsNullOrEmpty(signature))
        {
            return BadRequest("Missing signature");
        }

        if (!VerifyWebhookSignature(json, signature))
        {
            _logger.LogWarning("Invalid webhook signature received");
            return BadRequest("Invalid signature");
        }

        try
        {
            var document = JsonDocument.Parse(json);
            var eventName = document.RootElement.GetProperty("event").GetString();

            if (eventName == "order.paid" || eventName == "payment.captured")
            {
                var payload = document.RootElement.GetProperty("payload");
                var paymentElement = payload.GetProperty("payment").GetProperty("entity");
                var orderId = paymentElement.GetProperty("order_id").GetString();
                var paymentId = paymentElement.GetProperty("id").GetString();

                if (string.IsNullOrEmpty(orderId))
                {
                    return Ok();
                }

                var payment = await _db.Payments
                    .Include(p => p.Subscription)
                    .FirstOrDefaultAsync(p => p.RazorpayOrderId == orderId);

                if (payment != null && payment.Status != PaymentStatus.Success)
                {
                    payment.Status = PaymentStatus.Success;
                    payment.RazorpayPaymentId = paymentId;

                    var endDate = DateTime.UtcNow.AddDays(_subscriptionDurationDays);

                    if (payment.Subscription != null)
                    {
                        payment.Subscription.EndDate = endDate;
                        payment.Subscription.PlanType = payment.PlanType;
                        payment.Subscription.Status = SubscriptionStatus.Active;
                    }
                    else
                    {
                        payment.Subscription = new Subscription
                        {
                            UserId = payment.UserId,
                            PlanType = payment.PlanType,
                            StartDate = DateTime.UtcNow,
                            EndDate = endDate,
                            Status = SubscriptionStatus.Active
                        };
                    }

                    // Schedule a sync with the digital card service
                    _db.FailedPlanSyncs.Add(new FailedPlanSync
                    {
                        UserId = payment.UserId,
                        PlanType = payment.PlanType,
                        CreatedAt = DateTime.UtcNow
                    });

                    await _db.SaveChangesAsync();
                    _logger.LogInformation("Webhook marked order {OrderId} as success for user {UserId}", orderId, payment.UserId);
                }
            }
            
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook");
            return StatusCode(500);
        }
    }

    private bool VerifyWebhookSignature(string payload, string signature)
    {
        if (string.IsNullOrEmpty(_webhookSecret))
        {
            _logger.LogCritical("Webhook secret is not configured. Rejecting webhook for security.");
            return false;
        }

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_webhookSecret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        var hex = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();

        return hex == signature.ToLowerInvariant();
    }
}


