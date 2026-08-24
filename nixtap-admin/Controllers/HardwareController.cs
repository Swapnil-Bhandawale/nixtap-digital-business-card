using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nixtap_admin.Controllers
{
    [Authorize]
    public class HardwareController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
