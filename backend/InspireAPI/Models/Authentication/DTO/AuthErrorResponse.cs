namespace InspireAPI.Models.Auth;

public class AuthErrorResponse
{
    public bool Success { get; set; } = false;

    public string Code { get; set; } = "";

    public string Message { get; set; } = "";

    public Dictionary<string, string[]> FieldErrors { get; set; } = new();
}