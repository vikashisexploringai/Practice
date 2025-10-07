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
        
        if (explanationText) {
            explanationText.textContent = this.questions[this.currentQuestionIndex].explanation || 'No explanation available.';
        }
        if (explanationContainer) {
            explanationContainer.style.display = 'block';
        }

        // Update next button text for last question
        const nextButton = document.getElementById('next-button');
        if (nextButton && this.currentQuestionIndex === this.questions.length - 1) {
            nextButton.textContent = 'See Results';
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
    
    // Get theme and mode display names
    const themeName = CONFIG.THEMES[this.theme]?.displayName || this.theme;
    const modeName = CONFIG.MODES[this.mode]?.displayName || this.mode;

    console.log('Showing results:', { score: this.score, total: totalQuestions, accuracy, time });

    // Update result elements
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

    // Add theme and mode subtitle
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

    if (questionContainer) questionContainer.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'block';
}

    // Override completeSession to ensure results are shown
    completeSession() {
        this.isCompleted = true;
        this.timer.stop();
        this.showResults();
    }
}
