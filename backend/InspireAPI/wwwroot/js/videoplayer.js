// Make sure to git commit the updates: 
// Updated frontpage, added video and thumbnail assets, displayed assets on
// homepage on-load through Javascript, updated MockVideoData.

// TODO: Create videoplayer webpage/template/player. Thanks :3

// Called when the page is loaded to populate clicked on video
async function loadVideo(id) {
    // Error Handling: Invaild ID
    if (!id) {
        showError("No video selected");
        return;
    }
    try {
        const response = await fetch(`/api/videos/${id}`);
        if (!response.ok) {
            showError("Invalid Video ID");
            return;
        }
        const video = await response.json();
        // Populate video template
        document.getElementById("videoTitle").textContent = video.title;
        document.getElementById("videoDescription").textContent = video.descripton;
        document.getElementById("videoPlayer").poster = video.thumbnailUrl;
        document.getElementById("videoSource").src = video.videoUrl;
        document.getElementById("videoPlayer").load();
        // Remove Loading Text
        document.getElementById("videoSource").textContent = "";
    } catch (error) {
        showError("Could not retrieve video");
    }
}

// Get URL ID
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Populate video with URL ID once HTML is done loading
document.addEventListener("DOMContentLoaded", () => {
    loadVideo(id);
});
