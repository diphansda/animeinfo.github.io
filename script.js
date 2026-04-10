// --- ACCURATE MANUAL DATABASE (Links & Dub Info) ---
const animeData = {
    "jujutsu kaisen": {
        hindi: true, english: true,
        platforms: [{ name: "Netflix", link: "https://www.netflix.com/title/81278456", class: "btn-netflix" }]
    },
    "demon slayer": {
        hindi: true, english: true,
        platforms: [{ name: "Netflix", link: "https://www.netflix.com/title/81036259", class: "btn-netflix" }]
    },
    "solo leveling": {
        hindi: true, english: true,
        platforms: [{ name: "Crunchyroll", link: "https://www.crunchyroll.com/series/G79H23Z8P/solo-leveling", class: "btn-crunchy" }]
    }
};

const resultsContainer = document.getElementById('results');
const animeInput = document.getElementById('animeInput');
const searchBtn = document.getElementById('searchBtn');

async function getAnime(query) {
    resultsContainer.innerHTML = "<p>Loading Information...</p>";
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=20`);
        const json = await res.json();
        render(json.data);
    } catch (e) { resultsContainer.innerHTML = "<p>Error loading data.</p>"; }
}

function render(list) {
    resultsContainer.innerHTML = "";
    list.forEach(anime => {
        const title = anime.title_english || anime.title;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${anime.images.jpg.image_url}" loading="lazy">
            <div class="card-overlay">${title}</div>
        `;
        card.onclick = () => showModal(anime);
        resultsContainer.appendChild(card);
    });
}

function showModal(anime) {
    const title = (anime.title_english || anime.title).toLowerCase();
    let verified = null;

    // Check if we have manual data
    for (let key in animeData) {
        if (title.includes(key)) { verified = animeData[key]; break; }
    }

    // Default values if NOT in our manual list
    let hindiStatus = verified && verified.hindi ? "available" : "";
    let engStatus = verified && verified.english ? "available" : "";
    let platformHTML = verified ? 
        verified.platforms.map(p => `<a href="${p.link}" target="_blank" class="watch-btn ${p.class || ''}">${p.name}</a>`).join('') :
        `<a href="https://www.google.com/search?q=watch+${encodeURIComponent(title)}" target="_blank" class="watch-btn">Search Platforms</a>`;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="m-left"><img src="${anime.images.jpg.large_image_url}"></div>
        <div class="m-right">
            <h1>${anime.title_english || anime.title}</h1>
            
            <div class="lang-row">
                <span class="lang-tag ${hindiStatus}">Hindi ${hindiStatus ? '✅' : '❌'}</span>
                <span class="lang-tag ${engStatus}">English ${engStatus ? '✅' : '❌'}</span>
                <span class="lang-tag available">Japanese ✅</span>
            </div>

            <div style="margin: 20px 0; font-size: 0.9rem;">
                <p><b>Rating:</b> ⭐ ${anime.score || 'N/A'}</p>
                <p><b>Episodes:</b> ${anime.episodes || 'TBA'}</p>
                <p><b>Status:</b> ${anime.status}</p>
            </div>

            <div class="watch-section">
                <h3>AVAILABLE ON:</h3>
                <div style="display:flex; flex-wrap:wrap;">${platformHTML}</div>
            </div>

            <h3>SYNOPSIS</h3>
            <p style="color:#aaa; line-height:1.6; font-size:0.95rem;">${anime.synopsis || 'No description found.'}</p>
        </div>
    `;
    document.getElementById('animeModal').style.display = "block";
    document.body.style.overflow = "hidden"; // Scroll freeze
}

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('animeModal').style.display = "none";
    document.body.style.overflow = "auto";
};

searchBtn.onclick = () => getAnime(animeInput.value);
getAnime('Naruto'); // Default
