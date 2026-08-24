using Microsoft.AspNetCore.Mvc;
using PaymentService.Dtos;
using PaymentService.Services;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/payment")]
public class PublicPaymentController : ControllerBase
{
    private readonly IPaymentOrderService _paymentOrderService;

    public PublicPaymentController(IPaymentOrderService paymentOrderService)
    {
        _paymentOrderService = paymentOrderService;
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<CreateOrderResult>> Checkout([FromBody] CheckoutRequest request)
    {
        var userIdString = Request.Headers["X-User-Id"].FirstOrDefault();
        var userEmail = Request.Headers["X-User-Email"].FirstOrDefault() ?? "";

        if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new { message = "Missing or invalid user identification headers." });
        }

        var command = new CreateOrderCommand
        {
            UserId = userId,
            UserEmail = userEmail,
            PlanType = request.Plan
        };

        var result = await _paymentOrderService.CreateOrderAsync(command);
        return Ok(result);
    }

    [HttpPost("verify")]
    public async Task<ActionResult<VerifyOrderResult>> Verify([FromBody] PublicVerifyRequest request)
    {
        var userIdString = Request.Headers["X-User-Id"].FirstOrDefault();

        if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new { message = "Missing or invalid user identification headers." });
        }

        var command = new VerifyOrderCommand
        {
            UserId = userId,
            GatewayOrderId = request.RazorpayOrderId,
            GatewayPaymentId = request.RazorpayPaymentId,
            GatewaySignature = request.RazorpaySignature,
            PlanType = request.Plan
        };

        var result = await _paymentOrderService.VerifyPaymentAsync(command);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}

public class CheckoutRequest
{
    [Required]
    public string Plan { get; set; } = string.Empty;
}

public class PublicVerifyRequest
{
    [Required]
    public string RazorpayOrderId { get; set; } = string.Empty;
    [Required]
    public string RazorpayPaymentId { get; set; } = string.Empty;
    [Required]
    public string RazorpaySignature { get; set; } = string.Empty;
    [Required]
    public string Plan { get; set; } = string.Empty;
}
