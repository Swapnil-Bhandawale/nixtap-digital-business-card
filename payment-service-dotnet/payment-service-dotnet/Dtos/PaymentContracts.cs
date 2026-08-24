using System.Text.Json.Serialization;

namespace PaymentService.Dtos;

/// <summary>
/// Mirrors com.cdac.digitalcard.dto.payment.PaymentServiceContracts (Java) and
/// com.cdac.paymentservice.dto.PaymentContracts (the Spring Boot version of this
/// same service) field-for-field. All three must stay in sync — this is the
/// wire contract between digital-card and whichever payment-service implementation
/// is running behind it.
/// </summary>
public class CreateOrderCommand
{
    [JsonPropertyName("userId")]
    public long UserId { get; set; }

    [JsonPropertyName("userEmail")]
    public string UserEmail { get; set; } = string.Empty;

    [JsonPropertyName("planType")]
    public string PlanType { get; set; } = string.Empty;
}

public class CreateOrderResult
{
    [JsonPropertyName("gatewayOrderId")]
    public string GatewayOrderId { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public long Amount { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "INR";

    [JsonPropertyName("gatewayKeyId")]
    public string GatewayKeyId { get; set; } = string.Empty;
}

public class VerifyOrderCommand
{
    [JsonPropertyName("userId")]
    public long UserId { get; set; }

    [JsonPropertyName("gatewayOrderId")]
    public string GatewayOrderId { get; set; } = string.Empty;

    [JsonPropertyName("gatewayPaymentId")]
    public string GatewayPaymentId { get; set; } = string.Empty;

    [JsonPropertyName("gatewaySignature")]
    public string GatewaySignature { get; set; } = string.Empty;

    [JsonPropertyName("planType")]
    public string PlanType { get; set; } = string.Empty;
}

public class VerifyOrderResult
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("failureReason")]
    public string? FailureReason { get; set; }

    [JsonPropertyName("confirmedPlanType")]
    public string? ConfirmedPlanType { get; set; }

    [JsonPropertyName("subscriptionEndDate")]
    public string? SubscriptionEndDate { get; set; }
}

/// <summary>Body sent to digital-card's PATCH /api/internal/users/{id}/plan.</summary>
public class SyncPlanRequest
{
    [JsonPropertyName("planType")]
    public string PlanType { get; set; } = string.Empty;
}
