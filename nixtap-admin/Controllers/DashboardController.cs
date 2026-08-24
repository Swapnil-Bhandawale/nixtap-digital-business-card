using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly GatewayApiClient _apiClient;

        public DashboardController(GatewayApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<IActionResult> Index()
        {
            var token = User.FindFirst("jwt")?.Value;
            if (string.IsNullOrEmpty(token)) return RedirectToAction("Login", "Account");

            var viewModel = new SuperAdminDashboardViewModel();

            var payments = await _apiClient.GetPaymentStatsAsync(token);
            if (payments != null)
            {
                viewModel.TotalPayments = payments.totalPayments;
                viewModel.SuccessPayments = payments.successPayments;
                viewModel.ActiveSubscriptions = payments.activeSubscriptions;
            }
            
            var usersResponse = await _apiClient.GetAdminUsersAsync(token, 0, 1);
            if (usersResponse != null)
            {
                viewModel.TotalUsers = usersResponse.totalElements;
            }

            return View(viewModel);
        }
    }

    public class SuperAdminDashboardViewModel
    {
        public long TotalUsers { get; set; }
        public int TotalPayments { get; set; }
        public int SuccessPayments { get; set; }
        public int ActiveSubscriptions { get; set; }
    }
}
