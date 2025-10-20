export class view {
    constructor() {
        this.chatWindow = document.getElementById('chatWindow');
        this.stats = document.getElementById('stats');
    }

    renderMessages(messages) {
        this.chatWindow.innerHTML = '';
        messages.forEach((msg) => {
            const p = document.createElement('p');
            p.className = msg.isUser ? 'User' : 'Bot';
            p.textContent = msg.text;
            if (msg.edited) p.textContent += ' (edited)';
            this.chatWindow.appendChild(p);
        });
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
}