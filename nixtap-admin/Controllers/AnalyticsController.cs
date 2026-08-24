using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;
using Microsoft.AspNetCore.Authorization;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class AnalyticsController : Controller
    {
        private readonly GatewayApiClient _apiClient;
        public AnalyticsController(GatewayApiClient apiClient) => _apiClient = apiClient;
        private string GetToken() => User.FindFirst("jwt")?.Value ?? "";

        public async Task<IActionResult> Index(long cardId)
        {
            if (cardId == 0) return View();
            // Implement GetAnalyticsAsync if needed, or placeholder
            ViewBag.CardId = cardId;
            return View();
        }
    }
}
