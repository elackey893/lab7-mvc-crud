# Lab 7: MVC Chat with CRUD

This repository extends the Lab 6 chat application by refactoring it into a Model-View-Controller (MVC) architecture with full CRUD operations and localStorage persistence. It demonstrates separation of concerns: Model for data management, View for UI rendering, and Controller for user interactions. The core Eliza bot from Lab 6 is preserved, with new features like editing/deleting messages, export/import JSON, and stats.

## Live Demo
View the live app on GitHub Pages: [https://evanlackey.github.io/lab7-mvc-crud](https://elackey893.github.io/lab7-mvc-crud/)  

## Project Structure
```
lab7-mvc-crud/
├── index.html          # Main app page (semantic HTML with chat UI)
├── styles.css          # Global styles (purple gradient, bubbles, buttons)
└── js/
    ├── model.js        # Data layer (CRUD, localStorage)
    ├── view.js         # UI layer (render messages/stats, file helpers)
    ├── controller.js   # Flow layer (handles send/edit/delete/export)
    ├── app.js          # Bootstrap (imports MVC, inits on DOM ready)
    └── eliza.js        # Bot logic from Lab 6 (pattern matching)
```

## MVC Architecture Overview

| Component | Responsibility | Key Methods | Notes |
|-----------|----------------|-------------|-------|
| **Model** | Data storage/retrieval (memory + localStorage) | addMessage (CREATE), getMessages (READ), updateMessage (UPDATE), deleteMessage/clearChat (DELETE), exportJSON/importJSON | Emits 'messagesChanged' event on changes; unique IDs via Date.now(); error handling for JSON/parse. |
| **View** | UI rendering/updates (DOM manipulation) | renderMessages (bubbles with edit/delete buttons for user msgs), updateStats (count/saved), showConfirmation (prompts), downloadJSON/getFileContent (export/import helpers) | Component-style (createElement/appendChild, data-message-id for delegation); no business logic. |
| **Controller** | User input coordination | init (wires listeners), handleSend (form submit + Eliza bot), handleEdit/handleDelete (delegation on buttons), handleClear/handleExport/handleImport | Intermediary: Calls Model for data, View for render; event delegation for dynamic buttons. |
| **app.js** | Initialization | DOMContentLoaded listener creates MVC instances, calls controller.init() | Simple bootstrap—no logic. |

## How It Works
1. **Load**: app.js inits Model (loads from localStorage), View (caches DOM), Controller (wires listeners).
2. **Send**: Form submit → Controller.handleSend trims input, Model.addMessage(user), Eliza bot reply, Model.addMessage(bot), View.renderMessages (bubbles + buttons), auto-scroll.
3. **Edit/Delete**: Click button on user bubble → Delegation grabs data-message-id, Controller prompts/confirms, Model updates/deletes, View re-renders.
4. **Clear/Export/Import**: Button clicks → Controller confirms/handles, Model CRUDs/saves, View updates stats/downloads/picks file.
5. **Persistence**: Model auto-saves on changes; refresh reloads via loadFromStorage.

## Reflections on MVC + CRUD
- **Separation of Concerns**: Model is pure data (no DOM), View pure UI (no logic), Controller the bridge—made refactoring Lab 6's script.js easier (split addToChatWindow to View, send to Controller).
- **Benefits**: Easy to test (Model standalone for CRUD, View for render); scalable (add IndexedDB swap in Model without touching View).
- **Trade-offs**: Re-rendering full messages on change (simple but inefficient for 1000+ msgs—virtualization tip noted for advanced).
- **From Lab 6**: Kept Eliza/send/auto-scroll; added ID/timestamp/edited for CRUD without overhauling.
