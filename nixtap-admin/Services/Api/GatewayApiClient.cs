using System.Net.Http.Json;
using nixtap_admin.Models.Api;

namespace nixtap_admin.Services.Api
{
    public class GatewayApiClient
    {
        private readonly HttpClient _httpClient;

        public GatewayApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var response = await _httpClient.PostAsJsonAsync("/api/v1/auth/login", new { email, password });
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<Dictionary<string, string>>>();
            return result?.Data?.GetValueOrDefault("token");
        }

        public async Task<List<CardDto>?> GetCardsAsync(string token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/cards");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<CardDto>>>();
            return result?.Data;
        }

        public async Task<List<LeadDto>?> GetLeadsAsync(string token, long cardId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/cards/{cardId}/leads");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<LeadDto>>>();
            return result?.Data;
        }

        public async Task<List<AppointmentDto>?> GetAppointmentsAsync(string token, long cardId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/cards/{cardId}/appointments");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<AppointmentDto>>>();
            return result?.Data;
        }

        public async Task<List<FeedbackDto>?> GetFeedbackAsync(string token, long cardId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/cards/{cardId}/feedback");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<FeedbackDto>>>();
            return result?.Data;
        }
    }

    public class CardDto
    {
        public long id { get; set; }
        public string? fullName { get; set; }
        public string? jobTitle { get; set; }
        public bool isPublished { get; set; }
    }
}
