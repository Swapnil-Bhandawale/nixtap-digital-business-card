using PaymentService.Dtos;

namespace PaymentService.Services;

public interface IPaymentOrderService
{
    Task<CreateOrderResult> CreateOrderAsync(CreateOrderCommand command);
    Task<VerifyOrderResult> VerifyPaymentAsync(VerifyOrderCommand command);
    Task<long> GetActiveSubscriptionCountAsync();
    Task<long> GetPendingFailedPlanSyncCountAsync();

    /// <summary>Called by SubscriptionExpiryWorker — downgrades lapsed subscriptions.</summary>
    Task DowngradeExpiredSubscriptionsAsync();

    /// <summary>Called by PlanSyncReconciliationWorker — retries the outbox.</summary>
    Task ReconcileFailedPlanSyncsAsync();
}
