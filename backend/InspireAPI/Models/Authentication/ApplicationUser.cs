using Microsoft.AspNetCore.Identity;

namespace InspireAPI.Models;

/*
Custom User, fields can be customized.
Ex: Organization, 
    Department, 
    School
*/
public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = "";
}