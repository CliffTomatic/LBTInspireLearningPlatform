using InspireAPI.Models;
using InspireAPI.Models.Auth;
using InspireAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace InspireAPI.Controllers;

// TODO: Move logic into Service

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
        var fieldErrors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            fieldErrors["email"] = ["Email is required."];
        }

        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            fieldErrors["userName"] = ["Username is required."];
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            fieldErrors["password"] = ["Password is required."];
        }

        if (fieldErrors.Count > 0)
        {
            return BadRequest(new
            {
                success = false,
                code = "VALIDATION_ERROR",
                message = "Please fix the highlighted fields.",
                fieldErrors
            });
        }

        var normalizedEmail = request.Email.Trim();

        var existingEmail = await _userManager.FindByEmailAsync(normalizedEmail);

        if (existingEmail != null)
        {
            return Conflict(new
            {
                success = false,
                code = "EMAIL_ALREADY_EXISTS",
                message = "An account with this email already exists.",
                fieldErrors = new Dictionary<string, string[]>
                {
                    ["email"] = ["An account with this email already exists."]
                }
            });
        }

        var user = new ApplicationUser
        {
            Email = normalizedEmail,
            UserName = request.UserName.Trim(),
            DisplayName = string.IsNullOrWhiteSpace(request.DisplayName)
                ? request.UserName.Trim()
                : request.DisplayName.Trim()
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var identityFieldErrors = new Dictionary<string, List<string>>();

            foreach (var error in result.Errors)
            {
                var fieldName = error.Code switch
                {
                    "DuplicateUserName" => "userName",
                    "DuplicateEmail" => "email",

                    "PasswordTooShort" => "password",
                    "PasswordRequiresNonAlphanumeric" => "password",
                    "PasswordRequiresDigit" => "password",
                    "PasswordRequiresLower" => "password",
                    "PasswordRequiresUpper" => "password",
                    "PasswordRequiresUniqueChars" => "password",

                    _ => "general"
                };

                if (!identityFieldErrors.ContainsKey(fieldName))
                {
                    identityFieldErrors[fieldName] = new List<string>();
                }

                identityFieldErrors[fieldName].Add(error.Description);
            }

            return BadRequest(new
            {
                success = false,
                code = "REGISTRATION_FAILED",
                message = "Registration failed.",
                fieldErrors = identityFieldErrors.ToDictionary(
                    pair => pair.Key,
                    pair => pair.Value.ToArray()
                )
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
        var fieldErrors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            fieldErrors["email"] = ["Email is required."];
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            fieldErrors["password"] = ["Password is required."];
        }

        if (fieldErrors.Count > 0)
        {
            return BadRequest(new
            {
                success = false,
                code = "VALIDATION_ERROR",
                message = "Please fix the highlighted fields.",
                fieldErrors
            });
        }

        var normalizedEmail = request.Email.Trim();

        var user = await _userManager.FindByEmailAsync(normalizedEmail);

        if (user == null)
        {
            return Unauthorized(new
            {
                success = false,
                code = "INVALID_CREDENTIALS",
                message = "Invalid email or password.",
                fieldErrors = new Dictionary<string, string[]>()
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true
        );

        if (result.IsLockedOut)
        {
            return Unauthorized(new
            {
                success = false,
                code = "ACCOUNT_LOCKED",
                message = "Too many failed login attempts. Please try again later.",
                fieldErrors = new Dictionary<string, string[]>()
            });
        }

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                success = false,
                code = "INVALID_CREDENTIALS",
                message = "Invalid email or password.",
                fieldErrors = new Dictionary<string, string[]>()
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