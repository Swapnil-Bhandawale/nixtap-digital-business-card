using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using nixtap_admin.Services.Api;
using System.Security.Claims;

namespace nixtap_admin.Controllers
{
    public class AccountController : Controller
    {
        private readonly GatewayApiClient _apiClient;

        public AccountController(GatewayApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var token = await _apiClient.LoginAsync(email, password);
            if (token == null)
            {
                ModelState.AddModelError("", "Invalid login attempt.");
                return View();
            }

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            
            // For simplicity, storing JWT in a claim for now.
            // In production, use encrypted session or other server-side storage.
            claimsIdentity.AddClaim(new Claim("jwt", token));

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return RedirectToAction("Index", "Dashboard");
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
    }
}
