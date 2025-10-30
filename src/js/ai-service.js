/**
 * DeepSeek Service module for cloud AI integration via OpenRouter API.
 * Prompts for API key on init, falls back to Eliza on errors.
 * @module ai-service
 */

export class DeepSeekService {
    /**
     * Constructor retrieves or prompts for API key, saves to localStorage.
     * Sets getResponse fallback if no key.
     */
    constructor() {
        this.key = localStorage.getItem('deepseekkey') || prompt('Enter OpenRouter API key for DeepSeek:');
        if (!this.key) {
            console.warn('No key - fallback to Eliza');
            this.getResponse = async (message) => getBotResponse(message); // Fallback to Eliza
        } else {
            localStorage.setItem('deepseekkey', this.key);
        }
    }

    /**
     * Gets AI response via API POST request.
     * @param {string} message - User message.
     * @returns {Promise<string>} Bot response or error message.
     */
    async getResponse(message) {
        if (!this.key) return 'No key - use Eliza';
        const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.key}`
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat-v3.1',
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 1000
                })
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Error: ${response.status} - ${errText}`);
            }
            const data = await response.json();
            if (!data.choices || data.choices.length === 0) {
                throw new Error('No reply from DeepSeek');
            }
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek error:', error);
            return 'DeepSeek down - fallback to Eliza.';
        }
    }
}