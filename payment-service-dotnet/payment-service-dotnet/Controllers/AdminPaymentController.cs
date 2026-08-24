using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;

namespace PaymentService.Controllers;

/// <summary>
/// Admin endpoints for the Nixtap Admin Panel.
/// Protected by InternalApiKeyMiddleware - bypassed for /api/v1/payment/admin/** 
/// which must only be called server-to-server (admin MVC -> payment-service).
/// </summary>
[ApiController]
[Route("api/v1/payment/admin")]
public class AdminPaymentController : ControllerBase
{
    private readonly PaymentDbContext _db;

    public AdminPaymentController(PaymentDbContext db)
    {
        _db = db;
    }

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var internalKey = Request.Headers["X-Internal-Api-Key"].FirstOrDefault();
        var expectedKey = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["InternalApiKey"] ?? string.Empty;

        if (string.IsNullOrEmpty(internalKey) || internalKey.Split(',')[0].Trim() != expectedKey.Split(',')[0].Trim())
        {
            return Unauthorized(new { message = "Admin access requires internal API key" });
        }

        var query = _db.Payments
            .Include(p => p.Subscription)
            .OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();
        var payments = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.UserId,
                p.UserEmail,
                p.Amount,
                p.Currency,
                p.PlanType,
                p.Status,
                p.RazorpayOrderId,
                p.RazorpayPaymentId,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = payments });
    }

    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var internalKey = Request.Headers["X-Internal-Api-Key"].FirstOrDefault();
        var expectedKey = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["InternalApiKey"] ?? string.Empty;

        if (string.IsNullOrEmpty(internalKey) || internalKey.Split(',')[0].Trim() != expectedKey.Split(',')[0].Trim())
        {
            return Unauthorized(new { message = "Admin access requires internal API key" });
        }

        var query = _db.Subscriptions
            .OrderByDescending(s => s.StartDate);

        var total = await query.CountAsync();
        var subs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.Id,
                s.UserId,
                s.PlanType,
                s.Status,
                s.StartDate,
                s.EndDate
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = subs });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var internalKey = Request.Headers["X-Internal-Api-Key"].FirstOrDefault();
        var expectedKey = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["InternalApiKey"] ?? string.Empty;

        if (string.IsNullOrEmpty(internalKey) || internalKey.Split(',')[0].Trim() != expectedKey.Split(',')[0].Trim())
        {
            return Unauthorized(new { message = "Admin access requires internal API key" });
        }

        var totalPayments = await _db.Payments.CountAsync();
        var successPayments = await _db.Payments.CountAsync(p => p.Status == PaymentService.Entities.PaymentStatus.Success);
        var failedPayments = await _db.Payments.CountAsync(p => p.Status == PaymentService.Entities.PaymentStatus.Failed);
        var activeSubscriptions = await _db.Subscriptions.CountAsync(s => s.Status == PaymentService.Entities.SubscriptionStatus.Active);

        return Ok(new
        {
            totalPayments,
            successPayments,
            failedPayments,
            activeSubscriptions
        });
    }
}
