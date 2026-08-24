using Microsoft.AspNetCore.Mvc;
using PaymentService.Services;

namespace PaymentService.Controllers;

[ApiController]
[Route("internal/subscriptions")]
public class InternalSubscriptionsController : ControllerBase
{
    private readonly IPaymentOrderService _paymentOrderService;

    public InternalSubscriptionsController(IPaymentOrderService paymentOrderService)
    {
        _paymentOrderService = paymentOrderService;
    }

    [HttpGet("active-count")]
    public async Task<ActionResult<long>> GetActiveSubscriptionCount()
    {
        return Ok(await _paymentOrderService.GetActiveSubscriptionCountAsync());
    }

    [HttpGet("failed-plan-syncs-count")]
    public async Task<ActionResult<long>> GetFailedPlanSyncsCount()
    {
        return Ok(await _paymentOrderService.GetPendingFailedPlanSyncCountAsync());
    }
}
