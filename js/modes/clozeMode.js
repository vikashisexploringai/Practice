import { BaseMode } from './baseMode.js';
import { Utils } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

export class ClozeMode extends BaseMode {
    constructor() {
        super('quiz-container');
        this.userAnswers = [];
    }

    setupEventListeners() {
        const submitButton = document.getElementById('submit-answer');
        const answerInput = document.getElementById('answer-input');

        if (submitButton) {
            submitButton.addEventListener('click', () => this.checkAnswer());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkAnswer();
            });
        }
    }

    displayCurrentQuestion() {
        if (this.isCompleted) return;

        const question = this.questions[this.currentQuestionIndex];
        this.updateProgress();
        this.resetUI();

        document.getElementById('question-text').textContent = question.question;
        
        // Focus on input
        const answerInput = document.getElementById('answer-input');
        if (answerInput) {
            answerInput.focus();
        }
    }

    resetUI() {
        const answerInput = document.getElementById('answer-input');
        const feedbackContainer = document.getElementById('feedback-container');
        const submitButton = document.getElementById('submit-answer');

        if (answerInput) {
            answerInput.value = '';
            answerInput.disabled = false;
        }

        if (feedbackContainer) {
            feedbackContainer.style.display = 'none';
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Answer';
            submitButton.onclick = () => this.checkAnswer();
        }
    }

    checkAnswer() {
        const answerInput = document.getElementById('answer-input');
        const userAnswer = answerInput ? answerInput.value.trim() : '';
        const correctAnswer = this.questions[this.currentQuestionIndex].answer;

        if (!userAnswer) return;

        // Store user answer
        this.userAnswers[this.currentQuestionIndex] = userAnswer;

        const isCorrect = Utils.validateAnswer(userAnswer, correctAnswer);
        this.handleAnswer(isCorrect);
        this.showFeedback(isCorrect, correctAnswer);
    }

    showFeedback(isCorrect, correctAnswer) {
        const answerInput = document.getElementById('answer-input');
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackText = document.getElementById('feedback-text');
        const explanationText = document.getElementById('explanation-text');
        const submitButton = document.getElementById('submit-answer');

        // Disable input
        if (answerInput) answerInput.disabled = true;
        
        // Transform submit button into next button
        if (submitButton) {
            submitButton.disabled = false; // Keep it clickable
            submitButton.textContent = this.currentQuestionIndex === this.questions.length - 1 ? 'See Results' : 'Next Question';
            submitButton.onclick = () => this.nextQuestion(); // Change click handler
        }

        // Show feedback
        if (feedbackText) {
            if (isCorrect) {
                feedbackText.innerHTML = '<span style="color: #4CAF50;">✓ Correct!</span>';
                feedbackText.className = 'correct-feedback';
            } else {
                feedbackText.innerHTML = `
                    <span style="color: #f44336;">✗ Incorrect</span><br>
                    Correct answer: <strong>${correctAnswer}</strong>
                `;
                feedbackText.className = 'incorrect-feedback';
            }
        }

        // Show explanation
        if (explanationText) {
            explanationText.textContent = this.questions[this.currentQuestionIndex].explanation || 'No explanation available.';
        }
        
        // Display feedback
        if (feedbackContainer) {
            feedbackContainer.style.display = 'block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeSession();
        } else {
            this.displayCurrentQuestion();
        }
    }

    showResults() {
        const totalQuestions = this.questions.length;
        const accuracy = Utils.calculateAccuracy(this.score, totalQuestions);
        const time = this.timer.getFormattedTime();
        
        const themeName = CONFIG.THEMES[this.theme]?.displayName || this.theme;
        const modeName = CONFIG.MODES[this.mode]?.displayName || this.mode;

        // Update result elements
        document.getElementById('score').textContent = this.score;
        document.getElementById('total').textContent = totalQuestions;
        document.getElementById('completion-time').textContent = time;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        // Add theme and mode subtitle
        const resultContainer = document.getElementById('result-container');
        const existingSubtitle = document.getElementById('result-subtitle');
        if (existingSubtitle) {
            existingSubtitle.textContent = `${themeName} • ${modeName}`;
        } else {
            const subtitle = document.createElement('p');
            subtitle.id = 'result-subtitle';
            subtitle.style.cssText = 'color: #ccc; font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;';
            subtitle.textContent = `${themeName} • ${modeName}`;
            
            const title = resultContainer.querySelector('h2');
            if (title) {
                title.insertAdjacentElement('afterend', subtitle);
            }
        }

        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
    }
}
