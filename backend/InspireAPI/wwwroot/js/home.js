/**
 * Javascript for index.html
 */


// On startup, GET and populate videos into container
async function loadVideos() {
  try {
    const response = await fetch('/api/videos');
    const videos = await response.json();

    const container = document.getElementById('video-container');
    container.innerHTML = '';

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      card.innerHTML = `
        <img src="${video.thumbnailUrl}" alt="${video.title}" class="thumbnail">
        <h3>${video.title}</h3>
        <p>${video.description}</p>
        <button onclick="viewVideo(${video.id})">Watch</button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load videos:', error);
  }
}

function viewVideo(videoId) {
  window.location.href = `/videoplayer.html?id=${videoId}`;
}

loadVideos();