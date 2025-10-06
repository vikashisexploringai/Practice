import { Utils } from '../core/utils.js';
import { Timer } from '../core/timer.js';
import { CONFIG } from '../core/config.js';

export class BaseMode {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.timer = new Timer();
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.isCompleted = false;
    }

    async initialize(theme, day, mode) {
        try {
            this.theme = theme;
            this.day = day;
            this.mode = mode;
            
            const allQuestions = await Utils.loadQuestions(theme);
            this.questions = this.getQuestionsForMode(allQuestions, day, mode);
            
            if (this.questions.length === 0) {
                throw new Error('No questions available for selected day');
            }
            
            this.shuffleQuestions();
            this.setupEventListeners();
            this.startTimer();
            this.displayCurrentQuestion();
            
        } catch (error) {
            this.handleError(error.message);
        }
    }

    getQuestionsForMode(allQuestions, day, mode) {
        if (mode === 'accumulative' || CONFIG.MODES[mode]?.supportsAccumulative) {
            // Accumulative mode: all questions up to current day * 5
            const totalQuestions = Math.min(day * CONFIG.QUESTIONS_PER_DAY, allQuestions.length);
            return allQuestions.slice(0, totalQuestions);
        } else {
            // Day-wise mode: only current day's questions
            const startIndex = (day - 1) * CONFIG.QUESTIONS_PER_DAY;
            return allQuestions.slice(startIndex, startIndex + CONFIG.QUESTIONS_PER_DAY);
        }
    }

    // ... rest of the base mode methods remain the same
    shuffleQuestions() {
        this.questions = Utils.shuffleArray(this.questions);
    }

    startTimer() {
        this.timer.start((formattedTime) => {
            this.updateTimerDisplay(formattedTime);
        });
    }

    updateTimerDisplay(time) {
        const timerElement = document.getElementById('stopwatch');
        if (timerElement) timerElement.textContent = time;
    }

    updateProgress() {
        const progressElement = document.getElementById('progress-counter');
        if (progressElement) {
            progressElement.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
        }
    }

    handleAnswer(isCorrect) {
        if (isCorrect) this.score++;
        this.showFeedback(isCorrect);
    }

    showFeedback(isCorrect) {
        // To be implemented by specific modes
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeSession();
        } else {
            this.displayCurrentQuestion();
        }
    }

    completeSession() {
        this.isCompleted = true;
        this.timer.stop();
        this.showResults();
    }

    showResults() {
        // To be implemented by specific modes
    }

    setupEventListeners() {
        // To be implemented by specific modes
    }

    displayCurrentQuestion() {
        // To be implemented by specific modes
    }

    handleError(message) {
        console.error('Mode error:', message);
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="window.location.href='days.html'" class="glow">Back to Days</button>
                </div>
            `;
        }
    }

    destroy() {
        this.timer.stop();
        // Clean up any event listeners
    }
}
