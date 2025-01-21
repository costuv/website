const games = [
    { name: 'Wood Man', version: '1.0.0', description: 'An epic RPG adventure' },
    { name: 'Space Shooter', version: '1.0.0', description: 'Space shooting' },
    { name: 'Dust Racing', version: '1.0.0', description: 'A thrilling racing game' }
];

function searchGames() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gamesGrid = document.querySelector('.games-grid');
    const hero = document.getElementById('home');
    const heroContent = document.querySelector('.hero-content');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput.trim() !== '') {
        // Hide original hero content and show search results
        heroContent.style.display = 'none';
        
        if (!searchResults) {
            hero.innerHTML += `
                <div class="search-results">
                    <h2>Search Results for "${searchInput}"</h2>
                </div>
            `;
        } else {
            searchResults.innerHTML = `<h2>Search Results for "${searchInput}"</h2>`;
        }
        hero.style.height = '30vh'; // Reduce hero height
    } else {
        // Show original hero content and remove search results
        heroContent.style.display = 'flex';
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.remove();
        }
        hero.style.height = '100vh'; // Restore hero height
    }
    
    // Update games grid with correct image paths
    gamesGrid.innerHTML = '';
    games.forEach(game => {
        if (game.name.toLowerCase().includes(searchInput) || 
            game.description.toLowerCase().includes(searchInput)) {
            const imageName = game.name.toLowerCase().replace(' ', '');
            gamesGrid.innerHTML += `
                <div class="game-card">
                    <img src="img/${imageName}.png" alt="${game.name}">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <p class="version">Version: ${game.version}</p>
                    <a href="#" class="download-btn" onclick="downloadGame('${game.name}')">Download</a>
                </div>
            `;
        }
    });
}

function downloadGame(gameName) {
    const game = games.find(g => g.name === gameName);
    if (game) {
        const downloadBtn = event.target;
        downloadBtn.textContent = 'Downloading...';
        downloadBtn.style.background = '#666';

        // Simulate download progress
        setTimeout(() => {
            downloadBtn.textContent = 'Download Complete!';
            downloadBtn.style.background = '#45a049';
            
            // Create artificial download using Blob
            const dummyContent = `Game: ${game.name}\nVersion: ${game.version}\nThank you for downloading!`;
            const blob = new Blob([dummyContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${game.name.toLowerCase().replace(' ', '_')}_v${game.version}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Reset button after 2 seconds
            setTimeout(() => {
                downloadBtn.textContent = 'Download';
                downloadBtn.style.background = '#4CAF50';
            }, 2000);
        }, 1500);
    }
}

// Add event listener for Enter key
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchGames();
    }
});

// Add input event listener for real-time search
document.getElementById('searchInput').addEventListener('input', searchGames);