namespace InspireAPI.Common;

public enum ServiceErrorType
{
    None,
    NotFound,
    Unauthorized,
    BadRequest,
    Conflict,
    Forbidden,
    Gone,
    ServerError
}