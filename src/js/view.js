// view.js - Renders UI (messages, stats, controls) - no data logic
export class View {  // Fixed: Added export, capitalized 'View'
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
        if (!this.chatWindow) return;  // Fixed: Null check
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
                p.appendChild(deleteBtn);  // Fixed: append deleteBtn, not editBtn
            }

            this.chatWindow.appendChild(p);
        });
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    updateStats(stats) {
        if (!this.stats) return;  // Null check
        this.stats.textContent = `Messages: ${stats.count} | Last Saved: ${stats.lastSaved}`;
    }

    showConfirmation(message) {
        return confirm(message);
    }

    downloadJSON(filename, data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    getFileContent(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => callback(ev.target.result);
                reader.readAsText(file);
            }
        };
        input.click();
    }

    getMessageIdForEvent(event) {
        return event.target.dataset.messageId;
    }
}