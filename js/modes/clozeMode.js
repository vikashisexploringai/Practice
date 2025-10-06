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
        document.getElementById('answer-input').focus();
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
        const userAnswer = answerInput.value.trim();
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
        answerInput.disabled = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Next Question';

        // Show feedback
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

        // Show explanation
        explanationText.textContent = this.questions[this.currentQuestionIndex].explanation || 'No explanation available.';
        
        // Display feedback
        feedbackContainer.style.display = 'block';
    }

    showResults() {
        const totalQuestions = this.questions.length;
        const accuracy = Utils.calculateAccuracy(this.score, totalQuestions);
        const time = this.timer.getFormattedTime();

        document.getElementById('score').textContent = this.score;
        document.getElementById('total').textContent = totalQuestions;
        document.getElementById('completion-time').textContent = time;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
    }
}
