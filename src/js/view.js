export class view {
    constructor() {
        this.chatWindow = document.getElementById('chatWindow');
        this.messageBox = document.getElementById('messageBox');
        this.chatForm = document.getElementById('chatForm');
        this.clearBtn = document.getElementById('clearBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.stats = document.getElementById('stats');
    }

    renderMessages(messages) {
        this.chatWindow.innerHTML = '';
        messages.forEach((msg) => {
            const p = document.createElement('p');
            p.className = msg.isUser ? 'User' : 'Bot';
            p.textContent = msg.text;
            if (msg.edited) p.textContent += ' (edited)';

            if (msg.isUser) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Edit';
                editBtn.dataset.messageId = msg.id;
                p.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.dataset.messageId = msg.id;
                p.appendChild(editBtn);
            }

            this.chatWindow.appendChild(p);
        });
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    updateStats(stats) {
        this.stats.textContent = `Messages: ${stats.count} | Last Saved: ${stats.lastSaved}`;
    }

    showConfirmation(message) {
        return confirm(message);
    }
}