import { CONFIG } from '../core/config.js';
import { Storage } from '../core/storage.js';

export class ModeSelection {
    constructor() {
        this.container = document.getElementById('mode-buttons');
    }

    initialize() {
        if (!this.container) return;
        
        const theme = Storage.getTheme();
        if (!theme) {
            window.location.href = 'index.html';
            return;
        }

        this.renderModeButtons();
    }

    renderModeButtons() {
        this.container.innerHTML = '';
        
        Object.entries(CONFIG.MODES).forEach(([modeId, modeData]) => {
            const button = document.createElement('button');
            button.className = 'glow';
            button.innerHTML = `
                <strong>${modeData.displayName}</strong><br>
                <span style="font-size: 0.9em; opacity: 0.8;">${modeData.description}</span>
            `;
            button.onclick = () => this.selectMode(modeId, modeData);
            this.container.appendChild(button);
        });

        this.addBackButton();
    }

    selectMode(modeId, modeData) {
        Storage.setMode(modeId);
        
        if (modeData.customPage) {
            window.location.href = modeData.customPage;
        } else if (modeData.supportsDays) {
            window.location.href = 'days.html';
        } else {
            // Direct to quiz for modes that don't need day selection
            window.location.href = 'quiz.html';
        }
    }

    addBackButton() {
        const backButton = document.createElement('button');
        backButton.className = 'option-button';
        backButton.textContent = '← Back to Themes';
        backButton.onclick = () => {
            window.location.href = 'index.html';
        };
        this.container.appendChild(backButton);
    }
}
