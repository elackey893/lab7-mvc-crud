// DeepSeek testing.js - Basic R&D Test for DeepSeek v3.1 via OpenRouter (Lab 8)
// Prompt for API key every time

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// Prompt for API key every time
const OPENROUTER_KEY = prompt('Enter your OpenRouter API key for DeepSeek:');
if (!OPENROUTER_KEY) {
    throw new Error('Missing API key - reload and try again');
}

async function testDeepSeek(prompt) {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3.1',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            return `Error: ${response.status} - ${errText}`;
        }
        const data = await response.json();
        console.log('Full data:', data); // Debug
        if (!data.choices || data.choices.length === 0) {
            return 'No reply - rate limit?';
        }
        const reply = data.choices[0].message.content;
        return reply;
    } catch (error) {
        console.error('DeepSeek error:', error);
        return 'Error: ' + error.message;
    }
}

// Auto-attach for testIndex
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('promptInput');
    const output = document.getElementById('output');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', async () => {
        const prompt = input.value.trim();
        if (!prompt) {
            output.textContent = 'Enter a prompt first.';
            return;
        }
        output.textContent = 'Loading...';
        const reply = await testDeepSeek(prompt);
        output.textContent = `Reply: ${reply}`;
        input.value = '';
    });
});

/**
 * I think I will go with this for the project, it does not require any card on file, it doesn't leave no text replies
 * either. It's responses are quick and have much less of a general "filter" however any mention of the events of
 * June 1989 or critical speech of the Chinese Communist Party will result in no response. So as long as the nature of
 * the conversation isn't critical of China we should be good.
 */