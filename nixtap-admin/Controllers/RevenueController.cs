using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class RevenueController : Controller
    {
        private readonly GatewayApiClient _apiClient;

        public RevenueController(GatewayApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<IActionResult> Index(int page = 1)
        {
            var token = User.FindFirst("jwt")?.Value;
            if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

            var payments = await _apiClient.GetAdminPaymentsAsync(token, page, 20);
            var subscriptions = await _apiClient.GetAdminSubscriptionsAsync(token, 1, 10);
            
            ViewBag.Subscriptions = subscriptions?.data;
            
            if (payments == null)
            {
                return Unauthorized("Unable to access Payment Service. Verify Internal API Key.");
            }

            return View(payments);
        }
    }
}
