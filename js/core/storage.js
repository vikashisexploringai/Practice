// Storage management
export const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    // Specific getters for app state
    getTheme() {
        return this.get('selectedTheme');
    },

    getDay() {
        return parseInt(this.get('selectedDay')) || 0;
    },

    getMode() {
        return this.get('quizMode');
    },

    setTheme(theme) {
        return this.set('selectedTheme', theme);
    },

    setDay(day) {
        return this.set('selectedDay', day);
    },

    setMode(mode) {
        return this.set('quizMode', mode);
    }
};
