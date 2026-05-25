using InspireAPI.Models.Admin;
using InspireAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace InspireAPI.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminDashboardService _adminDashboardService;

    public AdminController(AdminDashboardService adminDashboardService)
    {
        _adminDashboardService = adminDashboardService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
    {
        var dashboard = await _adminDashboardService.GetDashboardAsync();

        return Ok(dashboard);
    }
}