let allSessions = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadSummary();
    await loadSessions();

    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("columnFilter").addEventListener("change", applyFilters);
});

async function loadSummary() {
    try {
        const response = await fetch("/api/admin/summary");
        const summary = await response.json();

        document.getElementById("totalSessions").textContent = summary.totalSessions ?? 0;
        document.getElementById("activeSessions").textContent = summary.activeSessions ?? 0;
        document.getElementById("totalWatchTime").textContent = formatSeconds(summary.totalWatchSeconds ?? 0);
    } catch (error) {
        console.error("Failed to load summary:", error);
    }
}

async function loadSessions() {
    try {
        const response = await fetch("/api/admin/sessions");
        allSessions = await response.json();

        renderTable(allSessions);
    } catch (error) {
        console.error("Failed to load sessions:", error);
        document.getElementById("sessionsTableBody").innerHTML = `
            <tr><td colspan="7">Failed to load sessions.</td></tr>
        `;
    }
}

function applyFilters() {
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const column = document.getElementById("columnFilter").value;

    const filtered = allSessions.filter(session => {
        if (!searchText) return true;

        if (column === "all") {
            return Object.values(session).some(value =>
                String(value ?? "").toLowerCase().includes(searchText)
            );
        }

        return String(session[column] ?? "").toLowerCase().includes(searchText);
    });

    renderTable(filtered);
}

function renderTable(sessions) {
    const body = document.getElementById("sessionsTableBody");

    if (!sessions.length) {
        body.innerHTML = `<tr><td colspan="7">No matching sessions found.</td></tr>`;
        return;
    }

    body.innerHTML = "";

    sessions.forEach(session => {
        const row = document.createElement("tr");
        row.tabIndex = 0;

        row.innerHTML = `
            <td>${session.sessionId}</td>
            <td>${escapeHtml(session.userName ?? "")}</td>
            <td>${session.videoId}</td>
            <td>${formatDate(session.startedAt)}</td>
            <td>${formatDate(session.endedAt)}</td>
            <td>${formatSeconds(session.totalWatchedSeconds ?? 0)}</td>
            <td>${session.isActive ? "Yes" : "No"}</td>
        `;

        row.addEventListener("click", () => {
            selectRow(row);
            renderDetails(session);
        });

        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectRow(row);
                renderDetails(session);
            }
        });

        body.appendChild(row);
    });
}

function selectRow(row) {
    document.querySelectorAll("#sessionsTableBody tr").forEach(r => {
        r.classList.remove("selected-row");
    });

    row.classList.add("selected-row");
}

function renderDetails(session) {
    const detail = document.getElementById("detailContent");

    detail.innerHTML = `
        <div class="detail-item">
            <strong>Session ID</strong>
            <span>${session.sessionId}</span>
        </div>

        <div class="detail-item">
            <strong>User Name</strong>
            <span>${escapeHtml(session.userName ?? "")}</span>
        </div>

        <div class="detail-item">
            <strong>Video ID</strong>
            <span>${session.videoId}</span>
        </div>

        <div class="detail-item">
            <strong>Started At</strong>
            <span>${formatDate(session.startedAt)}</span>
        </div>

        <div class="detail-item">
            <strong>Ended At</strong>
            <span>${formatDate(session.endedAt)}</span>
        </div>

        <div class="detail-item">
            <strong>Total Watched Time</strong>
            <span>${formatSeconds(session.totalWatchedSeconds ?? 0)}</span>
        </div>

        <div class="detail-item">
            <strong>Last Known Video Time</strong>
            <span>${formatSeconds(session.lastKnownVideoTimeSeconds ?? 0)}</span>
        </div>

        <div class="detail-item">
            <strong>Status</strong>
            <span class="badge ${session.isActive ? "active" : "inactive"}">
                ${session.isActive ? "Active" : "Inactive"}
            </span>
        </div>
    `;
}

function formatSeconds(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleString();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}