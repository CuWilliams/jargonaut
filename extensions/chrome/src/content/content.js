/**
 * JargoNaut Chrome Extension - Content Script
 * Runs on Twitter/X pages and uses platform-specific parser
 */

console.log('JargoNaut content script loaded');

// Create floating button
const floatBtn = document.createElement('div');
floatBtn.id = 'jargonaut-float-btn';
floatBtn.innerHTML = '🚀';
floatBtn.title = 'Click to explain this tweet';
document.body.appendChild(floatBtn);

// Create explanation window
const explanationWindow = document.createElement('div');
explanationWindow.id = 'jargonaut-window';
explanationWindow.style.display = 'none';
explanationWindow.innerHTML = `
    <div class="jargonaut-header">
        <span>JargoNaut Explanation</span>
        <button id="jargonaut-close">✕</button>
    </div>
    <div class="jargonaut-content">
        <p class="jargonaut-hint">Click on a tweet, then click the 🚀 button to get an explanation!</p>
    </div>
`;
document.body.appendChild(explanationWindow);

// Track the last clicked element
let lastClickedElement = null;

// Listen for clicks anywhere on the page
document.addEventListener('click', function(e) {
    // Don't capture clicks on JargoNaut's own UI elements
    if (e.target.id === 'jargonaut-float-btn' || 
        e.target.closest('#jargonaut-window')) {
        return;
    }
    
    console.log('Captured click on:', e.target);
    lastClickedElement = e.target;
}, true);

// Button click handler
floatBtn.addEventListener('click', function(e) {
    // Stop the button click from being captured as lastClickedElement
    e.stopPropagation();
    
    if (!lastClickedElement) {
        showExplanation('Please click on a tweet first!');
        return;
    }
    
    // Extract tweet text from the clicked element
    const tweetText = getTweetText(lastClickedElement);
    
    if (!tweetText) {
        showExplanation('Could not find tweet text. Make sure you clicked on a tweet!');
        return;
    }
    
    showExplanation('Analyzing tweet... 🤔');
    
    // Send to background script for AI explanation
    chrome.runtime.sendMessage(
        { action: 'explainTweet', tweetText: tweetText },
        function(response) {
            if (response && response.explanation) {
                showExplanation(response.explanation);
            } else {
                showExplanation('Error getting explanation. Please try again.');
            }
        }
    );
});

// Close button handler
document.getElementById('jargonaut-close').addEventListener('click', function() {
    explanationWindow.style.display = 'none';
});

/**
 * Show explanation in the window
 */
function showExplanation(text) {
    const content = explanationWindow.querySelector('.jargonaut-content');
    content.innerHTML = `<p>${text}</p>`;
    explanationWindow.style.display = 'block';
}

/**
 * Get tweet text from clicked element
 * This is Twitter-specific logic that will be in the platform parser
 */
function getTweetText(clickedElement) {
    console.log('Extracting tweet text...');
    
    // Find the article (tweet container)
    let article = clickedElement.closest('article');
    
    if (!article) {
        console.log('No article found');
        return null;
    }

    // Twitter's tweet text is in a div with lang attribute inside the article
    let tweetTextElement = article.querySelector('div[lang]');
    
    if (!tweetTextElement) {
        console.log('No tweet text element found');
        return null;
    }

    // Get the text content
    let tweetText = tweetTextElement.innerText.trim();
    
    console.log('Extracted tweet text:', tweetText.substring(0, 50) + '...');
    
    return tweetText;
}