// model.js - Manages chat data, CRUD, and localStorage
export class Model {
    constructor() {
        this.messages = [];  // Fixed: plural to match methods
        this.lastSaved = 'Never';
    }

    saveToStorage() {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(this.messages));  // Fixed: plural
            localStorage.setItem('lastSaved', this.lastSaved);
        } catch (error) {
            console.error('save error:', error);
        }
    }

    // CREATE feature which adds the new message
    addMessage(text, isUser) {
        const message = {
            id: Date.now(),
            text: text.trim(),
            isUser,
            timestamp: new Date().toISOString(),
            edited: false
        };
        this.messages.push(message);  // Fixed: plural
        this.saveToStorage();
        this.lastSaved = new Date().toLocaleString();
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));
        return message;
    }

    // READ functions
    getMessages() {
        return [...this.messages];  // Fixed: plural
    }

    getMessage(id) {
        return this.messages.find(msg => msg.id === parseInt(id));  // Fixed: plural
    }

    getStats() {
        return {
            count: this.messages.length,  // Fixed: plural
            lastSaved: this.lastSaved
        };
    }

    // UPDATE allows user to update their message
    updateMessage(id, newText) {
        const msg = this.getMessage(id);
        if (!msg || !msg.isUser) return null; // message must exist and be from user
        msg.text = newText.trim();
        msg.edited = true;
        msg.timestamp = new Date().toISOString();
        this.saveToStorage();
        this.lastSaved = new Date().toLocaleString();
        localStorage.setItem('lastSaved', this.lastSaved);
        // let the user know
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));
        return msg;
    }

    deleteMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== parseInt(id));  // Fixed: !== to remove
        this.saveToStorage();
        this.lastSaved = new Date().toLocaleString();
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));  // Fixed: standardize event
    }

    clearChat() {
        this.messages = [];  // Fixed: plural
        this.saveToStorage();
        this.lastSaved = 'Never';
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));  // Fixed: standardize event
    }

    exportJSON() {
        return JSON.stringify(this.messages, null, 2);  // Fixed: plural
    }

    importJSON(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (!Array.isArray(imported)) throw new Error('Invalid format');
            this.messages = imported.map(msg => ({  // Fixed: plural
                ...msg,
                id: msg.id || Date.now(), // Ensure unique ID
                timestamp: msg.timestamp || new Date().toISOString(),
                edited: msg.edited || false
            }));
            this.saveToStorage();
            this.lastSaved = new Date().toLocaleString();
            localStorage.setItem('lastSaved', this.lastSaved);
            // Notify observers
            document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}