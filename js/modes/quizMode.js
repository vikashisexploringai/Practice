import { BaseMode } from './baseMode.js';
import { Utils } from '../core/utils.js';

export class QuizMode extends BaseMode {
    constructor() {
        super('quiz-container');
    }

    setupEventListeners() {
        const nextButton = document.getElementById('next-button');
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
        this.renderOptions(question);
    }

    resetUI() {
        const explanationContainer = document.getElementById('explanation-container');
        if (explanationContainer) {
            explanationContainer.style.display = 'none';
        }
    }

    renderOptions(question) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        const shuffledOptions = Utils.shuffleArray([...question.choices]);
        
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => this.checkAnswer(option, question.answer);
            optionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedOption, correctAnswer) {
        const options = document.querySelectorAll('#options-container .option-button');
        const isCorrect = selectedOption === correctAnswer;
        
        options.forEach(option => {
            option.disabled = true;
            if (option.textContent === correctAnswer) {
                option.classList.add('correct-answer');
            } else if (option.textContent === selectedOption && !isCorrect) {
                option.classList.add('wrong-answer');
            }
        });

        this.handleAnswer(isCorrect);
        this.showFeedback(isCorrect);
    }

    showFeedback(isCorrect) {
        const explanationContainer = document.getElementById('explanation-container');
        const explanationText = document.getElementById('explanation-text');
        
        explanationText.textContent = this.questions[this.currentQuestionIndex].explanation || 'No explanation available.';
        explanationContainer.style.display = 'block';
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
