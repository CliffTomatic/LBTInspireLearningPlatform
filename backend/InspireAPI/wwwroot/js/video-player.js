// Get URL ID
const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

let sessionId = null;
let heartbeatInterval = null;
let player = null;
let source = null;
let userName = null;
let userId = null;
// Populate video with URL ID once HTML is done loading
document.addEventListener("DOMContentLoaded", () => {
    player = document.getElementById("videoPlayer");
    source = document.getElementById("videoSource");
    loadVideo(videoId);
    player.addEventListener("play", () => { // Add all messy code to func.
        startHeartbeatLoop();
    });
    
    player.addEventListener("pause", () => {
        stopHeartbeatLoop();
    });
    
    player.addEventListener("ended", async () => {
        stopHeartbeatLoop();
        await endSession();
    });
    
    window.addEventListener("beforeunload", () => {
        endSession();
    });
});

// On-Click event when updating MOCK User
// Saves userId & Name in client local storage.
function saveUser() {
    const name = document.getElementById("userNameInput").value;
    const id = document.getElementById("userIdInput").value;

    if (!name || !id) {
        alert("Enter both name and ID");
        return;
    }

    localStorage.setItem("demoUserName", name);
    localStorage.setItem("demoUserId", id);

    console.log("Saved user:", name, id);
}

// Called when user first atarts their video watching session
async function startSession() {
    const userName = localStorage.getItem("demoUserName") || "Demo User";
    const userId = localStorage.getItem("demoUserId") || "u001";

    const response = await fetch("/api/sessions/startSession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            videoId: Number(videoId),
            userName: userName,
            userId: userId
        })
    });

    const data = await response.json();
    sessionId = data.sessionId;

    console.log("[DEVELOPER]: Session Started:", sessionId, userId);
}

// Send Heartbeat through POST to backend
async function sendHeartbeat() {
    if (!sessionId) return;
    // TODO: Double check seconds before sending assumed seconds----------------
    try {
        const response = await fetch("/api/sessions/heartbeat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionId: sessionId,
                userId: Number(userId),
                videoId: Number(videoId),
                currentTimeSeconds: Math.floor(player.currentTime),
                watchedSeconds: 15 
            })
        });

        const data = await response.json();
        console.log("Heartbeat:", data);
    } catch (error) {
        console.error("Heartbeat failed:", error);
    }
}

function startHeartbeatLoop() {
    if (heartbeatInterval) return;

    heartbeatInterval = setInterval(() => {
        if (!player.paused && !player.ended && !document.hidden) {
            sendHeartbeat();
        }
    }, 15000);
}

function stopHeartbeatLoop() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}
// Send POST to Users Session
async function endSession() {
    if (!sessionId) return;

    try {
        await fetch("/api/sessions/end", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionId: sessionId
            })
        });
    } catch (error) {
        console.error("End session failed:", error);
    }
}

// Called when the page is loaded to populate clicked on video
async function loadVideo(id) {
    // Error Handling: Invaild ID
    if (!id) {
        alert("No video selected");
        return;
    }
    try {
        const response = await fetch(`/api/videos/${id}`);
        if (!response.ok) {
            alert("Invalid Video ID");
            return;
        }
        const video = await response.json();
        // Populate video template
        document.getElementById("videoTitle").textContent = video.title;
        document.getElementById("videoDescription").textContent = video.description;
        document.getElementById("videoPlayer").poster = video.thumbnailUrl;
        document.getElementById("videoSource").src = video.videoUrl;
        document.getElementById("videoPlayer").load();
        await startSession();
    } catch (error) {
        alert("Could not retrieve video");
    }
}
