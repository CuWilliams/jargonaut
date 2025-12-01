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

    /**
     * Build the AI prompt for explaining jargon
     * Optimized for Llama 3.2 3B with example-driven approach
     * @param {string} text - The text to explain
     * @returns {string} - The formatted prompt
     */
    buildPrompt(text) {
        // DESIGN RATIONALE:
        // 1. Use examples instead of rules (better for smaller models)
        // 2. Remove "unclear reference" escape hatch (forces explanation)
        // 3. Simple structure: examples → task → input
        // 4. Positive framing: "explain X" not "don't explain Y"
        // 5. Clear format template via examples

        return `You are JargoNaut, helping beginners understand tech posts. Explain technical terms they wouldn't know.

EXAMPLES:

Post: "Just deployed our app with Docker containers on K8s"
Response:
• Docker: Software that packages applications in containers (isolated environments)
• K8s: Short for Kubernetes, a system that manages containers at scale

Post: "This new framework is so much better and faster"
Response: No technical jargon detected.

Post: "The LLM keeps hallucinating during RAG operations"
Response:
• LLM: Large Language Model, an AI trained on massive text data
• Hallucinating: When AI generates false information confidently
• RAG: Retrieval Augmented Generation, technique to give AI external knowledge

YOUR TASK:
Analyze this post and explain technical terms (acronyms, programming concepts, tools, frameworks). Ignore common words. Keep it under 75 words. If no jargon exists, respond: "No technical jargon detected."

Post: "${text}"

Your explanation:`;
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