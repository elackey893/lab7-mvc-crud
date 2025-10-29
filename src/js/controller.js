// controller.js - Handles input, coordinates Model/View - no DOM or data direct
import { getBotResponse } from './eliza.js';
import { DeepSeekService } from './ai-service.js';

export class Controller {
    constructor(model, view) {
        this.model = model; // Data layer
        this.view = view; // UI layer
        this.currentMode = 'eliza'; // Default
    }

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

    loadChat() {
        const messages = this.model.getMessages();
        this.view.renderMessages(messages);
        const stats = this.model.getStats();
        this.view.updateStats({ ...stats, mode: this.currentMode.toUpperCase() });
    }

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

    handleDelete(e) {
        const id = this.view.getMessageIdForEvent(e);
        if (!this.view.showConfirmation('Delete this message?')) return;

        this.model.deleteMessage(id);
        this.loadChat();
    }

    handleClear() {
        if (!this.view.showConfirmation('Clear all messages?')) return;

        this.model.clearChat();
        this.loadChat();
    }

    handleExport() {
        const data = this.model.exportJSON();
        this.view.downloadJSON('chat-history.json', data);
    }

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