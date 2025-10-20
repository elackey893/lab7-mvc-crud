export class Model {
    constructor() {
        this.message = [];
        this.lastSaved = 'Never';
    }


    loadFromStorage() {
        try {
            const data = localStorage.getItem('chatHistory');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Load error: ', error);
            return null;
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(this.messages));
            localStorage.setItem('lastSaved', this.lastSaved);
        } catch (error) {
            console.error('save error:' , error);
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
        this.message.push(message);
        this.saveToStorage();
        this.lastSaved = new Date().toLocaleString();
        localStorage.setItem('lastSaved', this.lastSaved);
        document.dispatchEvent(new CustomEvent('messagesChanged', { detail: { messages: this.getMessages() } }));
        return message;
    }

    // READ functions
    getMessages() {
        return [...this.messages];
    }

    getMessage(id) {
        return this.messages.find(msg => msg.id === parseInt(id));
    }



    // UPDATE allows user to update their message
    updateMessage(id, newText) {
        const msg = this.getMessage(id);
        if (!msg || !msg.isUser) return null; //message must exist and be from user
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
}