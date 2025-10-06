// Create the floating JargoNaut button
function createFloatingButton() {
    // Check if button already exists
    if (document.getElementById('jargonaut-float-btn')) {
        return;
    }
    
    const button = document.createElement('div');
    button.id = 'jargonaut-float-btn';
    button.innerHTML = '🚀';
    button.title = 'Click to explain this tweet with JargoNaut';
    
    document.body.appendChild(button);
    
    // Button click handler
    button.addEventListener('click', function() {
        // Get the tweet text (we'll build this next)
        console.log('JargoNaut button clicked!');
        showExplanationWindow();
    });
}

// Create explanation window
function showExplanationWindow() {
    // Check if window already exists
    if (document.getElementById('jargonaut-window')) {
        return;
    }
    
    const window = document.createElement('div');
    window.id = 'jargonaut-window';
    window.innerHTML = `
        <div class="jargonaut-header">
            <span>🚀 JargoNaut</span>
            <button id="jargonaut-close">✕</button>
        </div>
        <div class="jargonaut-content">
            <p>Click on any tweet to get an explanation!</p>
            <p class="jargonaut-hint">💡 Tip: Look for tweets with technical jargon</p>
        </div>
    `;
    
    document.body.appendChild(window);
    
    // Close button handler
    document.getElementById('jargonaut-close').addEventListener('click', function() {
        window.remove();
    });
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
    createFloatingButton();
}

console.log('JargoNaut content script loaded!');