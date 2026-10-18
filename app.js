// Author: 31edgar

// Showing videos on main page ---------------------------------------
const video_container = document.querySelector('#grid-videos')
const modal = document.querySelector('#video-modal')
const close_button_modal = document.querySelector('#close-button-modal')
const iframe_modal = document.querySelector('#iframe-modal')
const h3_modal = document.querySelector('#h3-modal')
const p_modal = document.querySelector('#p-modal')
const search_bar = document.querySelector('#site-search')
const form_search = document.querySelector('#form-search')



function showVideos(videos) {
    video_container.innerHTML = "";

    if (videos && videos.length > 0) {
        videos.forEach(video => {
        addCard(video.title, video.thumbnail, video.id)
        });

    } else {
        const text = document.createElement('p');
        text.textContent = "There's not any coincidence.";

        text.style.gridColumn = "1 / -1";
        text.style.textAlign = "center";

        video_container.appendChild(text);
    }
}

function addCard(title, thumbnail_link, id) {
    const card = document.createElement('div');
    const h3 = document.createElement('h3');
    const img = document.createElement('img');

    card.classList.add('card');
    card.dataset.id = id;
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



// Cool and useful functions B)
function getVideoFromID(videos, id) {
    return videos.find(video => video.id == id);
}

function getVideosFromSearch(search_text, videos) {
    return videos.filter(video => video.title.toLowerCase().includes(search_text))
}

// Search functions

function search() {

}

// Open modal window to watch an embed video
async function showWideCard(id) {
    const videos = await loadVideos();

    if (videos) {
        // Call to getVideo from json function
        const video = getVideoFromID(videos, id)

        // SHOW THE MODAL
        // set iframe
        iframe_modal.src = `https://www.youtube.com/embed/${video.embedId}?autoplay=1`;
        // set h3
        h3_modal.textContent = video.title;
        // set p
        p_modal.textContent = video.description;

        modal.showModal();
    }
}

// Main function
async function initApp() {
    const data = await loadVideos();

    if (data) showVideos(data);
}

// Listeners
document.addEventListener('DOMContentLoaded', initApp)
video_container.addEventListener('click', (e) => {
    const card = e.target.closest('.card');

    if (!card) return;

    const id = card.dataset.id;
    
    // Call to showWideCard() 
    showWideCard(id);
});

close_button_modal.addEventListener('click', () => {
    iframe_modal.src = "";
    modal.close();
})

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

form_search.addEventListener('submit', async e => {
    e.preventDefault();

    const videos = await loadVideos();

    if (videos) {
        const query = search_bar.value.trim().toLowerCase();

        const filteredVideos = getVideosFromSearch(query, videos);

        showVideos(filteredVideos);
    }
});