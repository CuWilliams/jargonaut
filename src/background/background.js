// Background service worker with OpenRouter API integration

console.log('JargoNaut background script loaded');

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

async function handleSetupModel(apiKey, sendResponse) {
    if (!apiKey || apiKey.trim().length === 0) {
        sendResponse({ success: false, error: 'Please enter an API key' });
        return;
    }
    
    try {
        await chrome.storage.local.set({ 
            apiKey: apiKey,
            modelSetup: true 
        });
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function explainTweet(tweetText, sendResponse) {
    try {
        const result = await chrome.storage.local.get(['apiKey', 'modelSetup']);
        
        if (!result.modelSetup || !result.apiKey) {
            sendResponse({ 
                explanation: 'Please set up your API key first in the extension popup.' 
            });
            return;
        }
        
        console.log('Calling OpenRouter API...');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + result.apiKey,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://jargonaut.app',
                'X-Title': 'JargoNaut'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Explain this tweet in simple terms for someone learning to code. Break down any technical jargon or acronyms:\n\n' + tweetText
                    }
                ]
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error('API returned status ' + response.status);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        const explanation = data.choices[0].message.content;
        sendResponse({ explanation: explanation });
        
    } catch (error) {
        console.error('Error:', error);
        sendResponse({ 
            explanation: 'Error: ' + error.message 
        });
    }
}