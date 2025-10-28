// r-n-d.js - Ultra-Simple Gemini Test (Lab 8)
// Run in fresh console - One prompt, full response log

const GEMINI_KEY = 'AIzaSyDoEvoOYboEKRPmr4hSCTPyceku-K9vaUc'; // Your key
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

async function simpleTest() {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Say hello as a friendly bot.' }] }]
            })
        });
        console.log('Status:', response.status); // Should be 200
        const data = await response.json();
        console.log('Full response:', data); // Log everything for debug
        if (data.candidates && data.candidates[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            console.log('Reply:', reply);
        } else {
            console.log('No candidates - check full response above');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

simpleTest();