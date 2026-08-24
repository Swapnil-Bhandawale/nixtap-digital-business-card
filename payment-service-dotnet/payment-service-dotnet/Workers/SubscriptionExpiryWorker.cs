using PaymentService.Services;

namespace PaymentService.Workers;

/// <summary>
/// Equivalent of the Java service's @Scheduled(cron = "0 0 1 * * ?").
/// Times are UTC — adjust ComputeInitialDelay if you want this to align with
/// a specific local timezone instead.
/// </summary>
public class SubscriptionExpiryWorker : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(24);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SubscriptionExpiryWorker> _logger;

    public SubscriptionExpiryWorker(IServiceScopeFactory scopeFactory, ILogger<SubscriptionExpiryWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var initialDelay = ComputeInitialDelay(DateTime.UtcNow, targetHourUtc: 1);
        _logger.LogInformation("SubscriptionExpiryWorker starting; first run in {Delay}", initialDelay);
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
            await paymentOrderService.DowngradeExpiredSubscriptionsAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SubscriptionExpiryWorker run failed");
        }
    }

    internal static TimeSpan ComputeInitialDelay(DateTime nowUtc, int targetHourUtc)
    {
        var todayTarget = new DateTime(nowUtc.Year, nowUtc.Month, nowUtc.Day, targetHourUtc, 0, 0, DateTimeKind.Utc);
        var nextTarget = nowUtc < todayTarget ? todayTarget : todayTarget.AddDays(1);
        return nextTarget - nowUtc;
    }
}
