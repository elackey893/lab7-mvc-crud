import { getBotResponse } from './eliza.js';

export class Controller {
    constructor(model, view) {  // Fixed: 'mode' -> 'model'
        this.model = model;  // Fixed: references correct param
        this.view = view;
    }

    init() {
        this.loadChat();

        document.addEventListener('messagesChanged', () => this.loadChat());

        this.view.chatForm.addEventListener('submit', (e) => this.handleSend(e));

        this.view.clearBtn.addEventListener('click', () => this.handleClear());
        this.view.exportBtn.addEventListener('click', () => this.handleExport());
        this.view.importBtn.addEventListener('click', () => this.handleImport());

        this.view.chatWindow.addEventListener('click', (e) => {
            if (e.target.matches('.edit-btn')) this.handleEdit(e);
            if (e.target.matches('.delete-btn')) this.handleDelete(e);
        });
    }

    loadChat() {
        const messages = this.model.getMessages();
        this.view.renderMessages(messages);
        this.view.updateStats(this.model.getStats());
    }

    handleSend(e) {
        e.preventDefault();
        const message = this.view.messageBox.value.trim();
        if (!message) return;

        this.view.messageBox.value = '';
        this.view.messageBox.focus();

        this.model.addMessage(message, true);

        const botReply = getBotResponse(message);  // Now imported
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
        if (!this.view.showConfirmation('Clear all messages?')) return;  // Fixed: "all messages"

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
                alert('Chat imported successfully!');  // Fixed: Capitalized
                this.loadChat();
            } else {
                alert('Invalid JSON file.');
            }
        });
    }
}