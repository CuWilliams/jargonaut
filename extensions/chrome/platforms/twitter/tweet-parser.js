/**
 * JargoNaut Twitter/X Platform Parser
 * Handles extraction of tweet text from Twitter/X pages
 * Platform-specific code that won't be used for other social media
 */

class TwitterParser {
    /**
     * Get tweet text from a clicked element
     * @param {HTMLElement} clickedElement - The element that was clicked
     * @returns {string|null} - The tweet text, or null if not found
     */
    static getTweetText(clickedElement) {
        console.log('TwitterParser: Extracting tweet text...');
        
        // Find the article (tweet container)
        let article = clickedElement.closest('article');
        
        if (!article) {
            console.log('TwitterParser: No article found');
            return null;
        }

        // Twitter's tweet text is in a div with lang attribute inside the article
        let tweetTextElement = article.querySelector('div[lang]');
        
        if (!tweetTextElement) {
            console.log('TwitterParser: No tweet text element found');
            return null;
        }

        // Get the text content
        let tweetText = tweetTextElement.innerText.trim();
        
        console.log('TwitterParser: Extracted tweet text:', tweetText.substring(0, 50) + '...');
        
        return tweetText;
    }

    /**
     * Check if current page is Twitter/X
     * @returns {boolean}
     */
    static isTwitterPage() {
        return window.location.hostname === 'twitter.com' || 
               window.location.hostname === 'x.com';
    }

    /**
     * Get all tweet articles on the page
     * @returns {NodeList}
     */
    static getAllTweets() {
        return document.querySelectorAll('article');
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwitterParser;
}