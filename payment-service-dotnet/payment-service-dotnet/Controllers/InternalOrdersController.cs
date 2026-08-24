using Microsoft.AspNetCore.Mvc;
using PaymentService.Dtos;
using PaymentService.Services;

namespace PaymentService.Controllers;

/// <summary>
/// All endpoints here are internal-only, called by digital-card and
/// authenticated via InternalApiKeyMiddleware (X-Internal-Api-Key header) —
/// never exposed to browsers.
/// </summary>
[ApiController]
[Route("internal/orders")]
public class InternalOrdersController : ControllerBase
{
    private readonly IPaymentOrderService _paymentOrderService;

    public InternalOrdersController(IPaymentOrderService paymentOrderService)
    {
        _paymentOrderService = paymentOrderService;
    }

    [HttpPost]
    public async Task<ActionResult<CreateOrderResult>> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var result = await _paymentOrderService.CreateOrderAsync(command);
        return Ok(result);
    }

    [HttpPost("verify")]
    public async Task<ActionResult<VerifyOrderResult>> VerifyOrder([FromBody] VerifyOrderCommand command)
    {
        var result = await _paymentOrderService.VerifyPaymentAsync(command);
        return Ok(result);
    }
}
