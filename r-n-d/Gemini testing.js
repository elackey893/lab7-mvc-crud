const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Ask for API key once and store it
let GEMINI_KEY = localStorage.getItem('geminiKey');
if (!GEMINI_KEY) {
    GEMINI_KEY = prompt('Enter your Gemini API key:');
    localStorage.setItem('geminiKey', GEMINI_KEY);
}

const FULL_ENDPOINT = `${ENDPOINT}?key=${GEMINI_KEY}`;

async function testGemini(prompt) {
    const res = await fetch(FULL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 512 }
        })
    });

    const data = await res.json();
    console.log('Full data:', data);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '(no text reply)';
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('promptInput');
    const output = document.getElementById('output');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', async () => {
        const prompt = input.value.trim();
        if (!prompt) return (output.textContent = 'Enter a prompt first.');
        output.textContent = 'Loading...';
        output.textContent = 'Reply: ' + (await testGemini(prompt));
    });
});
/**
 * This is a good free AI, but I can already foresee a big problem in that Gemini is very picky with what it responds
 * to, I don't know how I would safeguard against no text replies from Gemini.
 */