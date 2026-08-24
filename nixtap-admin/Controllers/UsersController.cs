using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class UsersController : Controller
    {
        private readonly GatewayApiClient _apiClient;

        public UsersController(GatewayApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<IActionResult> Index(int page = 0)
        {
            var token = User.FindFirst("jwt")?.Value;
            if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

            var response = await _apiClient.GetAdminUsersAsync(token, page, 20);
            
            // If the user logging in is NOT an admin, the Java backend will return 403, and response will be null.
            if (response == null)
            {
                return Unauthorized("You do not have permission to view this page. Super Admin role required.");
            }

            return View(response);
        }
    }
}
