/**
 * JargoNaut Safari Extension - Content Script
 * Runs on Twitter/X and LinkedIn pages
 */

// console.log('JargoNaut content script loaded');

// Detect which platform we're on
const isTwitter = window.location.hostname === 'twitter.com' || window.location.hostname === 'x.com';
const isLinkedIn = window.location.hostname === 'www.linkedin.com' || window.location.hostname === 'linkedin.com';

// console.log('Platform detected:', isTwitter ? 'Twitter/X' : isLinkedIn ? 'LinkedIn' : 'Unknown');

// Create floating button
const floatBtn = document.createElement('div');
floatBtn.id = 'jargonaut-float-btn';
floatBtn.style.backgroundImage = `url(${browser.runtime.getURL('icons/button-48.png')})`;
floatBtn.style.backgroundSize = 'contain';
floatBtn.style.backgroundRepeat = 'no-repeat';
floatBtn.style.backgroundPosition = 'center';
floatBtn.title = 'Click to explain this post';
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
        <p class="jargonaut-hint">Click on a ${isTwitter ? 'tweet' : 'post'}, then click the JargoNaut button to get an explanation!</p>
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
    
    // console.log('Captured click on:', e.target);
    lastClickedElement = e.target;
}, true);

// Button click handler
floatBtn.addEventListener('click', function(e) {
    // console.log('Rocket button clicked');
    // console.log('Last clicked element:', lastClickedElement);
    
    if (!lastClickedElement) {
        showExplanation('Please click on a post first!');
        return;
    }
    
    // Extract post text based on platform
    const postText = getPostText(lastClickedElement);
    
    // console.log('Extracted post text:', postText);
    
    if (!postText) {
        showExplanation(`Could not find post text. Make sure you clicked on a ${isTwitter ? 'tweet' : 'LinkedIn post'}!`);
        return;
    }
    
    showExplanation('Analyzing post... 🤔');
    
    // Send to background script for AI explanation
    chrome.runtime.sendMessage(
        { action: 'explainTweet', tweetText: postText },
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
 * Get post text from clicked element - platform-aware
 */
function getPostText(clickedElement) {
    if (isTwitter) {
        return getTwitterPostText(clickedElement);
    } else if (isLinkedIn) {
        return getLinkedInPostText(clickedElement);
    }
    return null;
}

/**
 * Get Twitter/X post text from clicked element
 */
function getTwitterPostText(clickedElement) {
    // console.log('Extracting Twitter post text...');
    
    // Find the article (tweet container)
    let article = clickedElement.closest('article');
    
    if (!article) {
        // console.log('No article found');
        return null;
    }

    // Twitter's tweet text is in a div with lang attribute inside the article
    let tweetTextElement = article.querySelector('div[lang]');
    
    if (!tweetTextElement) {
        // console.log('No tweet text element found');
        return null;
    }

    // Get the text content
    let tweetText = tweetTextElement.innerText.trim();
    
    // console.log('Extracted tweet text:', tweetText.substring(0, 50) + '...');
    
    return tweetText;
}

/**
 * Get LinkedIn post text from clicked element
 */
function getLinkedInPostText(clickedElement) {
    // console.log('LinkedInParser: Extracting post text...');
    
    // Find the post container - LinkedIn uses feed-shared-update-v2
    let postContainer = clickedElement.closest('[class*="feed-shared-update-v2"]');
    
    if (!postContainer) {
        // console.log('LinkedInParser: No post container found');
        return null;
    }

    // LinkedIn post text is in update-components-text class
    let postTextElement = postContainer.querySelector('.update-components-text');
    
    if (!postTextElement) {
        // Try alternative selector - sometimes it's in feed-shared-inline-show-more-text
        postTextElement = postContainer.querySelector('[class*="feed-shared-inline-show-more-text"]');
    }
    
    if (!postTextElement) {
        // console.log('LinkedInParser: No post text element found');
        return null;
    }

    // Get the text content and clean it up
    let postText = postTextElement.innerText.trim();
    
    // Remove "...more" or "...see more" text that LinkedIn adds
    postText = postText.replace(/\.\.\.?\s*(see\s+)?more$/i, '').trim();
    
    // console.log('LinkedInParser: Extracted post text:', postText.substring(0, 100) + '...');
    
    return postText;
}