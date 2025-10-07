/**
 * JargoNaut LinkedIn Platform Parser
 * Handles extraction of post text from LinkedIn pages
 * Platform-specific code for LinkedIn
 */

class LinkedInParser {
    /**
     * Get LinkedIn post text from a clicked element
     * @param {HTMLElement} clickedElement - The element that was clicked
     * @returns {string|null} - The post text, or null if not found
     */
    static getPostText(clickedElement) {
        console.log('LinkedInParser: Extracting post text...');
        
        // Find the post container - LinkedIn uses feed-shared-update-v2
        let postContainer = clickedElement.closest('[class*="feed-shared-update-v2"]');
        
        if (!postContainer) {
            console.log('LinkedInParser: No post container found');
            return null;
        }

        // LinkedIn post text is in update-components-text class
        let postTextElement = postContainer.querySelector('.update-components-text');
        
        if (!postTextElement) {
            // Try alternative selector - sometimes it's in feed-shared-inline-show-more-text
            postTextElement = postContainer.querySelector('[class*="feed-shared-inline-show-more-text"]');
        }
        
        if (!postTextElement) {
            console.log('LinkedInParser: No post text element found');
            return null;
        }

        // Get the text content and clean it up
        let postText = postTextElement.innerText.trim();
        
        // Remove "...more" or "...see more" text that LinkedIn adds
        postText = postText.replace(/\.\.\.?\s*(see\s+)?more$/i, '').trim();
        
        console.log('LinkedInParser: Extracted post text:', postText.substring(0, 100) + '...');
        
        return postText;
    }

    /**
     * Check if current page is LinkedIn
     * @returns {boolean}
     */
    static isLinkedInPage() {
        return window.location.hostname === 'www.linkedin.com' || 
               window.location.hostname === 'linkedin.com';
    }

    /**
     * Get all posts on the page
     * @returns {NodeList}
     */
    static getAllPosts() {
        return document.querySelectorAll('[class*="feed-shared-update-v2"]');
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinkedInParser;
}