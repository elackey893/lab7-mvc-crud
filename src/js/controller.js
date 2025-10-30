/**
 * Controller module for handling user events, coordinating Model and View, and routing AI responses.
 * No direct DOM or data manipulation.
 * @module controller
 */

import { getBotResponse } from './eliza.js';
import { DeepSeekService } from './ai-service.js';

export class Controller {
    /**
     * Constructor binds model, view, and sets default mode.
     * @param {Model} model - Data layer instance.
     * @param {View} view - UI layer instance.
     */
    constructor(model, view) {
        this.model = model; // Data layer
        this.view = view; // UI layer
        this.currentMode = 'eliza'; // Default
    }

    /**
     * Initializes event listeners for forms, controls, delegation, and mode changes.
     * Loads initial chat state.
     */
    init() {
        this.loadChat();

        document.addEventListener('messagesChanged', () => this.loadChat());

        this.view.chatForm.addEventListener('submit', (e) => this.handleSend(e));

        // Controls listeners
        this.view.clearBtn.addEventListener('click', () => this.handleClear());
        this.view.exportBtn.addEventListener('click', () => this.handleExport());
        this.view.importBtn.addEventListener('click', () => this.handleImport());

        // Delegation for dynamic edit/delete buttons
        this.view.chatWindow.addEventListener('click', (e) => {
            if (e.target.matches('.edit-btn')) this.handleEdit(e);
            if (e.target.matches('.delete-btn')) this.handleDelete(e);
        });

        // AI Mode Toggle
        const aiMode = document.getElementById('aiMode');
        aiMode.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.loadChat(); // Reload if needed
            const stats = this.model.getStats();
            this.view.updateStats({ ...stats, mode: this.currentMode.toUpperCase() });
        });
    }

    /**
     * Reloads messages and updates stats with current mode.
     */
    loadChat() {
        const messages = this.model.getMessages();
        this.view.renderMessages(messages);
        const stats = this.model.getStats();
        this.view.updateStats({ ...stats, mode: this.currentMode.toUpperCase() });
    }

    /**
     * Handles form submit: Adds user message, gets AI response, adds bot message.
     * @param {Event} e - Submit event.
     */
    async handleSend(e) {  // Fixed: Added 'async' for await
        e.preventDefault();
        const message = this.view.messageBox.value.trim();
        if (!message) return;

        this.view.messageBox.value = '';
        this.view.messageBox.focus();

        this.model.addMessage(message, true);

        let botReply;
        if (this.currentMode === 'deepseek') {
            const deepSeekService = new DeepSeekService();
            botReply = await deepSeekService.getResponse(message);  // Now awaits safely
        } else {
            botReply = getBotResponse(message); // Eliza fallback
        }
        this.model.addMessage(botReply, false);

        this.loadChat();
    }

    /**
     * Handles edit button click: Prompts for new text, updates model if changed.
     * @param {Event} e - Click event.
     */
    handleEdit(e) {
        const id = this.view.getMessageIdForEvent(e);
        const msg = this.model.getMessage(id);
        if (!msg) return;

        const newText = prompt('Edit message', msg.text);
        if (newText !== null && newText.trim() !== msg.text) {
            this.model.updateMessage(id, newText.trim());
            this.loadChat();
        }
    }

    /**
     * Handles delete button click: Confirms and deletes message.
     * @param {Event} e - Click event.
     */
    handleDelete(e) {
        const id = this.view.getMessageIdForEvent(e);
        if (!this.view.showConfirmation('Delete this message?')) return;

        this.model.deleteMessage(id);
        this.loadChat();
    }

    /**
     * Handles clear button: Confirms and clears all messages.
     */
    handleClear() {
        if (!this.view.showConfirmation('Clear all messages?')) return;

        this.model.clearChat();
        this.loadChat();
    }

    /**
     * Handles export button: Exports JSON via view.
     */
    handleExport() {
        const data = this.model.exportJSON();
        this.view.downloadJSON('chat-history.json', data);
    }

    /**
     * Handles import button: Uploads JSON via view, imports if valid.
     */
    handleImport() {
        this.view.getFileContent((data) => {
            if (this.model.importJSON(data)) {
                alert('Chat imported successfully!');
                this.loadChat();
            } else {
                alert('Invalid JSON file.');
            }
        });
    }
}