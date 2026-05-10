using InspireAPI.Models;
using InspireAPI.Models.Auth;
using InspireAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace InspireAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.UserName))
        {
            return BadRequest(new
            {
                message = "Email, username, and password are required."
            });
        }

        var existingEmail = await _userManager.FindByEmailAsync(request.Email);

        if (existingEmail != null)
        {
            return Conflict(new
            {
                message = "An account with this email already exists."
            });
        }

        var user = new ApplicationUser
        {
            Email = request.Email,
            UserName = request.UserName,
            DisplayName = string.IsNullOrWhiteSpace(request.DisplayName)
                ? request.UserName
                : request.DisplayName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "Registration failed.",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        var token = await _jwtTokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email ?? "",
            UserName = user.UserName ?? "",
            DisplayName = user.DisplayName
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true
        );

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var token = await _jwtTokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email ?? "",
            UserName = user.UserName ?? "",
            DisplayName = user.DisplayName
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid token."
            });
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "User not found."
            });
        }

        return Ok(new AuthResponse
        {
            Token = "",
            UserId = user.Id,
            Email = user.Email ?? "",
            UserName = user.UserName ?? "",
            DisplayName = user.DisplayName
        });
    }
}