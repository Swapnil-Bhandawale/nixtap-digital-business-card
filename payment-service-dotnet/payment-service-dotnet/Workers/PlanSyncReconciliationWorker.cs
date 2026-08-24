using PaymentService.Services;

namespace PaymentService.Workers;

/// <summary>Equivalent of the Java service's @Scheduled(cron = "0 0 * * * ?").</summary>
public class PlanSyncReconciliationWorker : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(1);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PlanSyncReconciliationWorker> _logger;

    public PlanSyncReconciliationWorker(IServiceScopeFactory scopeFactory, ILogger<PlanSyncReconciliationWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var initialDelay = ComputeInitialDelay(DateTime.UtcNow);
        _logger.LogInformation("PlanSyncReconciliationWorker starting; first run in {Delay}", initialDelay);
        await Task.Delay(initialDelay, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await RunOnceAsync();
            await Task.Delay(Interval, stoppingToken);
        }
    }

    private async Task RunOnceAsync()
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var paymentOrderService = scope.ServiceProvider.GetRequiredService<IPaymentOrderService>();
            await paymentOrderService.ReconcileFailedPlanSyncsAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PlanSyncReconciliationWorker run failed");
        }
    }

    internal static TimeSpan ComputeInitialDelay(DateTime nowUtc)
    {
        var nextHour = new DateTime(nowUtc.Year, nowUtc.Month, nowUtc.Day, nowUtc.Hour, 0, 0, DateTimeKind.Utc).AddHours(1);
        return nextHour - nowUtc;
    }
}
