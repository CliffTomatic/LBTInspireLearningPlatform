using System.Text.Json;
using InspireAPI.Models;

namespace InspireAPI.Services
{
    public class SessionFileService
    {
        private readonly string _filePath;

        public SessionFileService(IWebHostEnvironment env)
        {
            string appDataPath = Path.Combine(env.ContentRootPath, "MockServer/MockData");

            if (!Directory.Exists(appDataPath))
            {
                Directory.CreateDirectory(appDataPath);
            }

            _filePath = Path.Combine(appDataPath, "sessions.json");

            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]");
            }
        }

        public List<ViewSession> GetSessions()
        {
            string json = File.ReadAllText(_filePath);

            if (string.IsNullOrWhiteSpace(json))
            {
                return new List<ViewSession>();
            }

            return JsonSerializer.Deserialize<List<ViewSession>>(json)
                   ?? new List<ViewSession>();
        }

        public void SaveSessions(List<ViewSession> sessions)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            string json = JsonSerializer.Serialize(sessions, options);
            File.WriteAllText(_filePath, json);
        }

        public ViewSession AddSession(ViewSession session)
        {
            var sessions = GetSessions();

            int nextId = sessions.Any() ? sessions.Max(s => s.SessionId) + 1 : 1;
            session.SessionId = nextId;

            sessions.Add(session);
            SaveSessions(sessions);

            return session;
        }

        public ViewSession? GetSessionById(int sessionId)
        {
            var sessions = GetSessions();
            return sessions.FirstOrDefault(s => s.SessionId == sessionId);
        }

        public bool UpdateSession(ViewSession updatedSession)
        {
            var sessions = GetSessions();
            int index = sessions.FindIndex(s => s.SessionId == updatedSession.SessionId);

            if (index == -1)
            {
                return false;
            }

            sessions[index] = updatedSession;
            SaveSessions(sessions);

            return true;
        }
    }
}