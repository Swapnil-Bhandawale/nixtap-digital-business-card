using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Entities;

/// <summary>
/// Outbox row for a SyncUserPlanAsync() call to digital-card that failed even
/// after immediate retries. A scheduled worker periodically retries these so a
/// transient digital-card outage never permanently loses a plan change.
/// </summary>
[Table("failed_plan_syncs")]
public class FailedPlanSync
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long UserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string PlanType { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? LastError { get; set; }

    public int AttemptCount { get; set; } = 1;

    public bool Resolved { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastAttemptAt { get; set; } = DateTime.UtcNow;
}
