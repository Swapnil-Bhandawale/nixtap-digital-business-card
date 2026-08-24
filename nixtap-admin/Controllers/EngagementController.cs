using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;
using System.Security.Claims;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class EngagementController : Controller
    {
        private readonly GatewayApiClient _apiClient;

        public EngagementController(GatewayApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        private string GetToken() => User.FindFirst("jwt")?.Value ?? "";

        public async Task<IActionResult> Leads(long cardId)
        {
            var leads = await _apiClient.GetLeadsAsync(GetToken(), cardId);
            return View(leads);
        }

        public async Task<IActionResult> Appointments(long cardId)
        {
            var appointments = await _apiClient.GetAppointmentsAsync(GetToken(), cardId);
            return View(appointments);
        }

        public async Task<IActionResult> Feedback(long cardId)
        {
            var feedback = await _apiClient.GetFeedbackAsync(GetToken(), cardId);
            return View(feedback);
        }
    }
}
