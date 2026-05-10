namespace InspireAPI.Models.Auth;

public class AuthResponse
{
    public string Token { get; set; } = "";
    public string UserId { get; set; } = "";
    public string Email { get; set; } = "";
    public string UserName { get; set; } = "";
    public string DisplayName { get; set; } = "";
}