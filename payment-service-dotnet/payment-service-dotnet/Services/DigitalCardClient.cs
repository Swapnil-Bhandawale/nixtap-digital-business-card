using System.Net.Http.Json;
using PaymentService.Data;
using PaymentService.Dtos;
using PaymentService.Entities;

namespace PaymentService.Services;

public class DigitalCardClient : IDigitalCardClient
{
    private static readonly int[] BackoffMs = { 500, 1500, 4000 };
    private const int MaxAttempts = 3;

    private readonly HttpClient _httpClient;
    private readonly PaymentDbContext _db;
    private readonly ILogger<DigitalCardClient> _logger;

    public DigitalCardClient(HttpClient httpClient, PaymentDbContext db, ILogger<DigitalCardClient> logger)
    {
        _httpClient = httpClient;
        _db = db;
        _logger = logger;
    }

    public async Task SyncUserPlanAsync(long userId, string planType)
    {
        Exception? lastError = null;

        for (var attempt = 1; attempt <= MaxAttempts; attempt++)
        {
            try
            {
                var response = await _httpClient.PatchAsJsonAsync(
                    $"/api/internal/users/{userId}/plan",
                    new SyncPlanRequest { PlanType = planType });

                if (response.IsSuccessStatusCode)
                {
                    return; // success, nothing further to do
                }

                lastError = new HttpRequestException(
                    $"digital-card responded {(int)response.StatusCode} for userId={userId}");
            }
            catch (Exception ex)
            {
                lastError = ex;
            }

            _logger.LogWarning(
                "SyncUserPlanAsync attempt {Attempt}/{Max} failed for userId={UserId} planType={PlanType}: {Error}",
                attempt, MaxAttempts, userId, planType, lastError?.Message);

            await Task.Delay(BackoffMs[Math.Min(attempt - 1, BackoffMs.Length - 1)]);
        }

        // All retries exhausted — don't lose the update. Persist it so the
        // scheduled reconciliation worker (or an admin) can retry it later.
        _logger.LogError(
            lastError,
            "SyncUserPlanAsync giving up after {Max} attempts for userId={UserId} planType={PlanType}, recording to outbox",
            MaxAttempts, userId, planType);

        _db.FailedPlanSyncs.Add(new FailedPlanSync
        {
            UserId = userId,
            PlanType = planType,
            LastError = Truncate(lastError?.Message, 500),
            AttemptCount = MaxAttempts,
            Resolved = false,
        });
        await _db.SaveChangesAsync();
    }

    private static string? Truncate(string? s, int max) =>
        s is null ? null : (s.Length <= max ? s : s[..max]);
}
