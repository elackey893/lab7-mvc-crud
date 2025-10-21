export class Controller {
    contructor(mode, view) {
        this.model = model;
        this.view = view;
    }


    init() {
        this.loadChat()

        document.addEventListener('messagesChanged', () => this.loadChat());

        this.view.chatForm.addEventListener('submit', (e) => this.handleSend(e));
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

        const botReply = getBotResponse(message);
        this.model.addMessage(botReply, false);

        this.loadChat();
    }
}