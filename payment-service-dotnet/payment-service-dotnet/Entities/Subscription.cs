using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Entities;

[Table("subscriptions")]
public class Subscription
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long UserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string PlanType { get; set; } = string.Empty; // PREMIUM or BUSINESS

    [Required]
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}

public enum SubscriptionStatus
{
    Active,
    Expired,
    Cancelled
}
