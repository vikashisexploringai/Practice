import { BaseMode } from './baseMode.js';
import { Utils } from '../core/utils.js';

export class ClozeMode extends BaseMode {
    constructor() {
        super('quiz-container');
        this.userAnswers = [];
    }

    setupEventListeners() {
        const submitButton = document.getElementById('submit-answer');
        const answerInput = document.getElementById('answer-input');
        const nextButton = document.getElementById('next-button');

        if (submitButton) {
            submitButton.addEventListener('click', () => this.checkAnswer());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkAnswer();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
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
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Next Question';
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

    showResults() {
        const totalQuestions = this.questions.length;
        const accuracy = Utils.calculateAccuracy(this.score, totalQuestions);
        const time = this.timer.getFormattedTime();

        // Update result elements safely
        const scoreElement = document.getElementById('score');
        const totalElement = document.getElementById('total');
        const timeElement = document.getElementById('completion-time');
        const accuracyElement = document.getElementById('accuracy');
        const questionContainer = document.getElementById('question-container');
        const resultContainer = document.getElementById('result-container');

        if (scoreElement) scoreElement.textContent = this.score;
        if (totalElement) totalElement.textContent = totalQuestions;
        if (timeElement) timeElement.textContent = time;
        if (accuracyElement) accuracyElement.textContent = `${accuracy}%`;

        if (questionContainer) questionContainer.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';
    }

    // Override to handle empty answers better
    nextQuestion() {
        // Only proceed if answer was submitted
        const answerInput = document.getElementById('answer-input');
        if (answerInput && !answerInput.disabled && answerInput.value.trim() === '') {
            // If no answer submitted, don't proceed
            return;
        }
        
        super.nextQuestion();
    }
}
