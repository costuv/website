function initLoader() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Create loader HTML
    const loaderHTML = `
        <div class="loader-container">
            <div class="loader">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">COSTUV</div>
                </div>
            </div>
        </div>
    `;
    
    // Insert loader at the start of body
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    // Handle page load
    window.addEventListener('load', () => {
        const loaderContainer = document.querySelector('.loader-container');
        
        // Small delay to ensure everything is truly loaded
        setTimeout(() => {
            loaderContainer.classList.add('fade-out');
            document.body.classList.remove('loading');
            
            // Remove loader after fade
            setTimeout(() => {
                loaderContainer.remove();
            }, 500);
        }, 500);
    });
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', initLoader);
