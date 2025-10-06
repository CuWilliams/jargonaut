// Create the floating JargoNaut button
function createFloatingButton() {
    // Check if button already exists
    if (document.getElementById('jargonaut-float-btn')) {
        return;
    }
    
    const button = document.createElement('div');
    button.id = 'jargonaut-float-btn';
    button.innerHTML = '🚀';
    button.title = 'Click to explain tweets with JargoNaut';
    
    document.body.appendChild(button);
    
    // Button click handler
    button.addEventListener('click', function() {
        toggleTweetClickMode();
    });
}

// Track if we're in "click to explain" mode
let clickModeActive = false;
let clickListener = null;

// Toggle tweet click mode
function toggleTweetClickMode() {
    clickModeActive = !clickModeActive;
    const button = document.getElementById('jargonaut-float-btn');
    
    if (clickModeActive) {
        // Activate click mode
        button.style.transform = 'scale(1.2)';
        button.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.8)';
        showExplanationWindow('Click on any tweet to decode it! 🎯');
        
        // Add click listener to document
        clickListener = function(e) {
            const tweetElement = e.target.closest('article[data-testid="tweet"]');
            if (tweetElement) {
                e.preventDefault();
                e.stopPropagation();
                extractAndExplainTweet(tweetElement);
            }
        };
        
        document.addEventListener('click', clickListener, true);
    } else {
        // Deactivate click mode
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        
        if (clickListener) {
            document.removeEventListener('click', clickListener, true);
            clickListener = null;
        }
    }
}

// Extract tweet text and explain it
function extractAndExplainTweet(tweetElement) {
    // Find the tweet text within the article
    const tweetTextElement = tweetElement.querySelector('[data-testid="tweetText"]');
    
    if (!tweetTextElement) {
        showExplanationWindow('❌ Could not find tweet text. Try clicking directly on the tweet content.');
        return;
    }
    
    const tweetText = tweetTextElement.innerText;
    
    if (!tweetText || tweetText.trim().length === 0) {
        showExplanationWindow('❌ Tweet appears to be empty.');
        return;
    }
    
    // Show loading state
    showExplanationWindow('🔄 Analyzing tweet...\n\n' + tweetText);
    
    // Deactivate click mode
    clickModeActive = false;
    const button = document.getElementById('jargonaut-float-btn');
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    
    if (clickListener) {
        document.removeEventListener('click', clickListener, true);
        clickListener = null;
    }
    
    // Send to background script for AI processing
    chrome.runtime.sendMessage({
        action: 'explainTweet',
        tweetText: tweetText
    }, function(response) {
        if (response && response.explanation) {
            showExplanationWindow(response.explanation, tweetText);
        } else {
            showExplanationWindow('❌ AI model not ready. Click "Setup AI Model" in the extension popup first!', tweetText);
        }
    });
}

// Create or update explanation window
function showExplanationWindow(content, originalTweet = null) {
    let window = document.getElementById('jargonaut-window');
    
    if (!window) {
        window = document.createElement('div');
        window.id = 'jargonaut-window';
        document.body.appendChild(window);
    }
    
    let html = `
        <div class="jargonaut-header">
            <span>🚀 JargoNaut</span>
            <button id="jargonaut-close">✕</button>
        </div>
        <div class="jargonaut-content">
    `;
    
    if (originalTweet) {
        html += `
            <div class="jargonaut-original-tweet">
                <strong>Original Tweet:</strong>
                <p>${originalTweet}</p>
            </div>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #e5e7eb;">
        `;
    }
    
    html += `
            <div class="jargonaut-explanation">
                ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
        </div>
    `;
    
    window.innerHTML = html;
    
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