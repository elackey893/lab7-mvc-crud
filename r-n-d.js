// r-n-d.js - Fixed R&D Test for Google Gemini API (Lab 8)
// Run in fresh console - Model: gemini-2.5-flash (current free from quickstart)

const GEMINI_KEY = 'AIzaSyDoEvoOYboEKRPmr4hSCTPyceku-K9vaUc'; // Your key
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

async function testGemini(prompt) {
    const start = Date.now();
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 100 }
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error: ${response.status} - ${errText}`);
        }
        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No candidates in response - try again or check rate limit');
        }
        const reply = data.candidates[0].content.parts[0].text;
        const time = Date.now() - start;
        console.log(`\n--- Gemini Test ---`);
        console.log(`Prompt: ${prompt}`);
        console.log(`Reply: ${reply}`);
        console.log(`Time: ${time}ms`);
        return reply;
    } catch (error) {
        console.error('Gemini error:', error);
    }
}

// Run basic tests
testGemini('Say hello as a friendly bot.');
testGemini('Explain MVC in one sentence.');
testGemini('Write a haiku about coding.');