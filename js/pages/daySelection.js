import { CONFIG } from '../core/config.js';
import { Storage } from '../core/storage.js';
import { Utils } from '../core/utils.js';

export class DaySelection {
    constructor() {
        this.container = document.getElementById('day-buttons');
    }

    async initialize() {
        if (!this.container) return;
        
        const theme = Storage.getTheme();
        const mode = Storage.getMode();

        if (!theme || !mode) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const questions = await Utils.loadQuestions(theme);
            this.renderDayButtons(questions, mode);
        } catch (error) {
            this.handleError(error.message);
        }
    }

    renderDayButtons(questions, mode) {
        this.container.innerHTML = '';
        const totalDays = Math.ceil(questions.length / CONFIG.QUESTIONS_PER_DAY);
        const modeConfig = CONFIG.MODES[mode];

        for (let day = 1; day <= totalDays; day++) {
            const button = document.createElement('button');
            button.className = 'glow';
            button.textContent = this.getButtonText(day, questions.length, mode);
            button.onclick = () => this.selectDay(day, modeConfig);
            this.container.appendChild(button);
        }

        this.addBackButton();
    }

    getButtonText(day, totalQuestions, mode) {
        const modeConfig = CONFIG.MODES[mode];
        
        if (mode === 'accumulative') {
            const questionCount = Math.min(day * CONFIG.QUESTIONS_PER_DAY, totalQuestions);
            return `Day ${day} (${questionCount} questions)`;
        } else {
            const questionsThisDay = Math.min(CONFIG.QUESTIONS_PER_DAY, totalQuestions - ((day - 1) * CONFIG.QUESTIONS_PER_DAY));
            return `Day ${day} (${questionsThisDay} ${modeConfig.displayName.toLowerCase().includes('flashcard') ? 'flashcards' : 'questions'})`;
        }
    }

    selectDay(day, modeConfig) {
        Storage.setDay(day);
        
        if (modeConfig.customPage) {
            window.location.href = modeConfig.customPage;
        } else {
            window.location.href = 'quiz.html';
        }
    }

    addBackButton() {
        const backButton = document.createElement('button');
        backButton.className = 'option-button';
        backButton.textContent = '← Back to Modes';
        backButton.onclick = () => {
            window.location.href = 'mode.html';
        };
        this.container.appendChild(backButton);
    }

    handleError(message) {
        this.container.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Questions</h3>
                <p>${message}</p>
                <button onclick="window.location.href='mode.html'" class="glow">Back to Modes</button>
            </div>
        `;
    }
}
