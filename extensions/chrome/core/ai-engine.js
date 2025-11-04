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
                
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
                }
                
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

    buildPrompt(text) {
        return `You are JargoNaut, a concise tech jargon translator. Analyze this post and ONLY explain technical jargon, acronyms, and industry-specific terms that someone learning tech might not understand.

Rules:
- Keep your TOTAL response under 100 words
- Only explain technical terms, jargon, and acronyms
- Skip obvious words and general concepts everyone knows
- Use bullet points for multiple terms
- Be direct and concise
- If there's no jargon to explain, say "No technical jargon detected in this post."

Post to analyze:
"${text}"

Explain only the jargon:`;
    }

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JargoNautAI;
}
