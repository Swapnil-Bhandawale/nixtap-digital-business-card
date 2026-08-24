using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Entities;

[Table("payments")]
public class Payment
{
    [Key]
    public long Id { get; set; }

    // No FK to a User table — digital-card owns that entity. We only ever
    // need the id (for lookups) and email (to pass to the gateway).
    [Required]
    public long UserId { get; set; }

    [Required]
    public string UserEmail { get; set; } = string.Empty;

    public long? SubscriptionId { get; set; }

    [ForeignKey(nameof(SubscriptionId))]
    public Subscription? Subscription { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "INR";

    [MaxLength(255)]
    public string? RazorpayOrderId { get; set; }

    [MaxLength(255)]
    public string? RazorpayPaymentId { get; set; }

    [MaxLength(500)]
    public string? RazorpaySignature { get; set; }

    [Required]
    [MaxLength(20)]
    public string PlanType { get; set; } = string.Empty;

    [Required]
    public PaymentStatus Status { get; set; } = PaymentStatus.Created;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum PaymentStatus
{
    Created,
    Success,
    Failed
}
