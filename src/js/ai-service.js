// ai-service.js - DeepSeek Service (Lab 8 - Cloud AI)
// Handles OpenRouter DeepSeek v3.1 - Prompt for key on init

export class DeepSeekService {
    constructor() {
        this.key = localStorage.getItem('deepseekkey') || prompt('Enter OpenRouter API key for DeepSeek:');
        if (!this.key) {
            console.warn('No key - fallback to Eliza');
            this.getResponse = async (message) => getBotResponse(message); // Fallback to Eliza
        } else {
            localStorage.setItem('deepseekkey', this.key);
        }
    }

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
                    max_tokens: 100
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