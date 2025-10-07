/**
 * JargoNaut Core AI Engine
 * Handles communication with OpenRouter API
 * This code is reusable across all browsers and platforms
 */

class JargoNautAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'meta-llama/llama-3.2-3b-instruct:free';
    }

    /**
     * Explain technical jargon in text
     * @param {string} text - The text to explain
     * @returns {Promise<string>} - The AI explanation
     */
    async explainJargon(text) {
        if (!this.apiKey || this.apiKey.trim().length === 0) {
            throw new Error('API key not configured');
        }

        console.log('JargoNaut AI: Explaining text...');
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://jargonaut.app',
                    'X-Title': 'JargoNaut'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildPrompt(text)
                        }
                    ]
                })
            });

            console.log('JargoNaut AI: Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('JargoNaut AI: API Error:', errorText);
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            console.log('JargoNaut AI: Received explanation');
            
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('JargoNaut AI: Error:', error);
            throw error;
        }
    }

    /**
     * Build the AI prompt for explaining jargon
     * @param {string} text - The text to explain
     * @returns {string} - The formatted prompt
     */
    buildPrompt(text) {
        return `Explain this text in simple terms for someone learning to code. Break down any technical jargon or acronyms:\n\n${text}`;
    }

    /**
     * Test if the API key is valid
     * @returns {Promise<boolean>} - True if valid, false otherwise
     */
    async validateApiKey() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://jargonaut.app',
                    'X-Title': 'JargoNaut'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: 'Test' }]
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('JargoNaut AI: Validation error:', error);
            return false;
        }
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JargoNautAI;
}