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
}