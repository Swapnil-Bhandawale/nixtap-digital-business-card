using Microsoft.EntityFrameworkCore;
using PaymentService.Entities;

namespace PaymentService.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options) { }

    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<FailedPlanSync> FailedPlanSyncs => Set<FailedPlanSync>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Defense in depth against a duplicate Payment row for the same
        // Razorpay order (mirrors the unique constraint on the Java service).
        modelBuilder.Entity<Payment>()
            .HasIndex(p => p.RazorpayOrderId)
            .IsUnique();

        // Store enums as their string name (e.g. "Active") rather than an int,
        // so the DB stays human-readable and matches the Java side's Enumerated(STRING).
        modelBuilder.Entity<Payment>()
            .Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<Subscription>()
            .Property(s => s.Status)
            .HasConversion<string>()
            .HasMaxLength(20);
    }
}
