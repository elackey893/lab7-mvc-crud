/**
 * Model module for managing chat data, CRUD operations, and localStorage persistence.
 * Handles messages as an array of objects with id, text, isUser, timestamp, edited properties.
 * @module model
 */

export class Model {
    /**
     * Constructor initializes empty messages array and lastSaved timestamp.
     */
    constructor() {
        this.messages = [];  // Fixed: plural to match methods
        this.lastSaved = 'Never';
    }

    /**
     * Saves messages and lastSaved to localStorage.
     */
    saveToStorage() {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(this.messages));  // Fixed: plural
            localStorage.setItem('lastSaved', this.lastSaved);
        } catch (error) {
            console.error('save error:', error);
        }
    }

    /**
     * CREATE: Adds a new message object and saves to storage.
     * Dispatches 'messagesChanged' event.
     * @param {string} text - Message content.
     * @param {boolean} isUser - True if user message, false if bot.
     * @returns {Object} The added message object.
     */
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

    /**
     * READ: Returns a copy of all messages.
     * @returns {Array<Object>} Immutable copy of messages array.
     */
    getMessages() {
        return [...this.messages];  // Fixed: plural
    }

    /**
     * READ: Finds and returns a single message by ID.
     * @param {number} id - Message ID.
     * @returns {Object|null} The message or null if not found.
     */
    getMessage(id) {
        return this.messages.find(msg => msg.id === parseInt(id));  // Fixed: plural
    }

    /**
     * READ: Returns stats object with count and lastSaved.
     * @returns {Object} Stats { count: number, lastSaved: string }.
     */
    getStats() {
        return {
            count: this.messages.length,  // Fixed: plural
            lastSaved: this.lastSaved
        };
    }

    /**
     * UPDATE: Edits a user message if it exists.
     * Marks as edited, updates timestamp, saves, dispatches event.
     * @param {number} id - Message ID.
     * @param {string} newText - Updated text.
     * @returns {Object|null} Updated message or null if invalid.
     */
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

    /**
     * DELETE: Removes a message by ID and saves.
     * Dispatches 'messagesChanged' event.
     * @param {number} id - Message ID to delete.
     */
    deleteMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== parseInt(id));  // Fixed: !== to remove
        this.saveToStorage();
        this.lastSaved = new Date().toLocaleString();
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));  // Fixed: standardize event
    }

    /**
     * DELETE: Clears all messages, resets lastSaved, saves, dispatches event.
     */
    clearChat() {
        this.messages = [];  // Fixed: plural
        this.saveToStorage();
        this.lastSaved = 'Never';
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));  // Fixed: standardize event
    }

    /**
     * Exports messages as formatted JSON string.
     * @returns {string} JSON string of messages.
     */
    exportJSON() {
        return JSON.stringify(this.messages, null, 2);  // Fixed: plural
    }

    /**
     * Imports messages from JSON string, validates array format.
     * Updates timestamps/IDs if needed, saves, dispatches event.
     * @param {string} jsonString - JSON string to parse.
     * @returns {boolean} True if successful, false on error.
     */
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