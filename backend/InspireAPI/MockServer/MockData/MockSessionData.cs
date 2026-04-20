using InspireAPI.Models;

namespace InspireAPI.MockData
{
    public static class MockSessionData
    {
        public static List<ViewSession> Sessions { get; set; } = new();
        public static int NextSessionId { get; set; } = 1;
    }
}