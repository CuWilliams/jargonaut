/**
 * JargoNaut Chrome Extension - Background Script
 * Uses core modules for AI functionality
 */

// Import core modules (copied into extension folder)
importScripts('../../core/config.js');
importScripts('../../core/ai-engine.js');

console.log('JargoNaut background script loaded - v' + JargoNautConfig.version);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received:', request);
    
    if (request.action === 'setupModel') {
        handleSetupModel(request.apiKey, sendResponse);
        return true;
    }
    
    if (request.action === 'explainTweet') {
        explainTweet(request.tweetText, sendResponse);
        return true;
    }
    
    return false;
});

/**
 * Handle API key setup
 */
async function handleSetupModel(apiKey, sendResponse) {
    if (!apiKey || apiKey.trim().length === 0) {
        sendResponse({ success: false, error: 'Please enter an API key' });
        return;
    }
    
    try {
        // Create AI instance to validate key
        const ai = new JargoNautAI(apiKey);
        const isValid = await ai.validateApiKey();
        
        if (isValid) {
            await chrome.storage.local.set({ 
                [JargoNautConfig.storage.apiKey]: apiKey,
                [JargoNautConfig.storage.modelSetup]: true 
            });
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: 'Invalid API key' });
        }
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

/**
 * Explain tweet text using AI
 */
async function explainTweet(tweetText, sendResponse) {
    try {
        // Get stored API key
        const result = await chrome.storage.local.get([
            JargoNautConfig.storage.apiKey, 
            JargoNautConfig.storage.modelSetup
        ]);
        
        if (!result[JargoNautConfig.storage.modelSetup] || !result[JargoNautConfig.storage.apiKey]) {
            sendResponse({ 
                explanation: 'Please set up your API key first in the extension popup.' 
            });
            return;
        }
        
        // Create AI instance and get explanation
        const ai = new JargoNautAI(result[JargoNautConfig.storage.apiKey]);
        const explanation = await ai.explainJargon(tweetText);
        
        sendResponse({ explanation: explanation });
        
    } catch (error) {
        console.error('Error:', error);
        sendResponse({ 
            explanation: 'Error: ' + error.message 
        });
    }
}