# Lab 8: MVC Chat with AI Integration

A client-side chat application built with the MVC pattern in vanilla JavaScript. Supports local (Eliza) and cloud (DeepSeek) AI modes, CRUD operations on messages, and localStorage persistence.


## Features
- **Dual AI Modes**: Switch between Eliza (local pattern-matching bot) and DeepSeek (cloud LLM via OpenRouter API).
- **CRUD Operations**: Add, read, edit, and delete user messages; bot responses are read-only.
- **Persistence**: Chat history saved to localStorage; auto-updates on changes.
- **Export/Import**: JSON-based for sharing histories.
- **UI Controls**: Mode toggle, stats display (message count, last save, mode), clear chat.

## Architecture
Follows strict MVC separation:
- **Model** (`model.js`): Manages messages array, CRUD methods, localStorage sync.
- **View** (`view.js`): Renders messages, updates stats, handles file I/O.
- **Controller** (`controller.js`): Routes events, coordinates AI responses (Eliza or DeepSeek).
- **Services**: `eliza.js` (local AI), `ai-service.js` (cloud API wrapper).

## Why DeepSeek?

DeepSeek has minimal general filter allowing most messages to have a text reply and I didn't have to put a card on file.
The only downside is that you really can't be critical of the Chinese government but for a general chatbot this
shouldn't be a concern.

Event-driven updates via custom `messagesChanged` events.

For DeepSeek: Enter OpenRouter API key on first use (saved to localStorage).

**Git Pages publish**: [Lab 7-8: MVC CRUD and AI](https://elackey893.github.io/lab7-mvc-crud/)


## Testing
Uses Playwright for E2E tests.
- Install: `npx playwright install`.
- Run: `npm run test` (headless) or `npm run test:headed` (visible).
- Coverage: Eliza response, DeepSeek toggle, message rendering.
- Reports: `./playwright-report/index.html`.

Add tests in `./tests/*.spec.js`.

## License
MIT License – see [LICENSE](LICENSE) for details.