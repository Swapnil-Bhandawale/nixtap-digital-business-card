namespace PaymentService.Services;

public interface IDigitalCardClient
{
    /// <summary>
    /// Pushes an entitlement change to digital-card, which owns User.PlanType.
    /// Used after successful activation and after expiry/cancellation.
    /// Retries internally; if all retries fail, persists to the outbox
    /// (FailedPlanSync) instead of losing the update.
    /// </summary>
    Task SyncUserPlanAsync(long userId, string planType);
}
