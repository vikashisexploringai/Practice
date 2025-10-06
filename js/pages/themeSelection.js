import { CONFIG } from '../core/config.js';
import { Storage } from '../core/storage.js';

export class ThemeSelection {
    constructor() {
        this.container = document.getElementById('theme-buttons');
    }

    initialize() {
        if (!this.container) return;
        
        this.renderThemeButtons();
    }

    renderThemeButtons() {
        this.container.innerHTML = '';
        
        Object.entries(CONFIG.THEMES).forEach(([themeId, themeData]) => {
            const button = document.createElement('button');
            button.className = 'glow';
            button.textContent = themeData.displayName;
            button.onclick = () => this.selectTheme(themeId);
            this.container.appendChild(button);
        });
    }

    selectTheme(themeId) {
        Storage.setTheme(themeId);
        window.location.href = 'mode.html';
    }
}
