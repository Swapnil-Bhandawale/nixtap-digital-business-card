using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using nixtap_admin.Models.Api;

namespace nixtap_admin.Services.Api
{
    public class GatewayApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _internalApiKey;

        public GatewayApiClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _internalApiKey = config["InternalApiKey"] ?? "";
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var response = await _httpClient.PostAsJsonAsync("/api/v1/auth/login", new { email, password });
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<System.Text.Json.JsonElement>>();
            if (result != null && result.Data.ValueKind != System.Text.Json.JsonValueKind.Undefined)
            {
                return result.Data.GetProperty("token").GetString();
            }
            return null;
        }

        public async Task<PaymentStatsDto?> GetPaymentStatsAsync(string token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/payment/admin/stats");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            request.Headers.Add("X-Internal-Api-Key", _internalApiKey);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            return await response.Content.ReadFromJsonAsync<PaymentStatsDto>();
        }

        public async Task<AdminUsersResponse?> GetAdminUsersAsync(string token, int page = 0, int size = 20)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/admin/users?page={page}&size={size}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<AdminUsersResponse>>();
            return result?.Data;
        }

        public async Task<AdminPaymentsResponse?> GetAdminPaymentsAsync(string token, int page = 1, int size = 20)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/payment/admin/payments?page={page}&pageSize={size}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            request.Headers.Add("X-Internal-Api-Key", _internalApiKey);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            return await response.Content.ReadFromJsonAsync<AdminPaymentsResponse>();
        }

        public async Task<AdminSubscriptionsResponse?> GetAdminSubscriptionsAsync(string token, int page = 1, int size = 20)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/payment/admin/subscriptions?page={page}&pageSize={size}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            request.Headers.Add("X-Internal-Api-Key", _internalApiKey);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            return await response.Content.ReadFromJsonAsync<AdminSubscriptionsResponse>();
        }
    }

    public class PaymentStatsDto { public int totalPayments { get; set; } public int successPayments { get; set; } public int failedPayments { get; set; } public int activeSubscriptions { get; set; } }
    
    public class AdminUsersResponse { public List<AdminUserDto> content { get; set; } = new(); public long totalElements { get; set; } }
    public class AdminUserDto { public long id { get; set; } public string? fullName { get; set; } public string? email { get; set; } public string? phone { get; set; } public string? role { get; set; } public bool isActive { get; set; } public bool isVerified { get; set; } public DateTime createdAt { get; set; } }
    
    public class AdminPaymentsResponse { public List<AdminPaymentDto> data { get; set; } = new(); public int total { get; set; } }
    public class AdminPaymentDto { public long id { get; set; } public long userId { get; set; } public string? userEmail { get; set; } public decimal amount { get; set; } public string? currency { get; set; } public string? planType { get; set; } public PaymentStatus status { get; set; } public DateTime createdAt { get; set; } }

    public class AdminSubscriptionsResponse { public List<AdminSubscriptionDto> data { get; set; } = new(); public int total { get; set; } }
    public class AdminSubscriptionDto { public long id { get; set; } public long userId { get; set; } public string? planType { get; set; } public SubscriptionStatus status { get; set; } public DateTime startDate { get; set; } public DateTime endDate { get; set; } }

    public enum PaymentStatus { Created, Success, Failed }
    public enum SubscriptionStatus { Active, Expired, Cancelled }
}