// Author: 31edgar

const video_container = document.querySelector('#grid-videos')

function showVideos(videos) {
    videos.forEach(video => {
        // ITERA IJOMIO ITERA
        addCard(video.title, video.thumbnail)
    });
}

function addCard(title, thumbnail_link) {
    const card = document.createElement('div');
    const h3 = document.createElement('h3');
    const img = document.createElement('img');

    card.classList.add('card');
    h3.textContent = title;
    img.src = thumbnail_link;

    card.appendChild(img);
    card.appendChild(h3);

    video_container.appendChild(card);
}


async function loadVideos() {
    try {
        const reply = await fetch('link_management/videos.json');
        if (!reply.ok) throw new Error('Request error');
        const videos = await reply.json();
        return videos;
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function initApp() {
    const data = await loadVideos();

    if (data) showVideos(data);
}

document.addEventListener("DOMContentLoaded", initApp)