import { BaseMode } from './baseMode.js';
import { Utils } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

export class FlashcardMode extends BaseMode {
    constructor() {
        super('flashcard-container');
        this.currentCardIndex = 0;
    }

    async initialize(theme, day, mode) {
        try {
            this.theme = theme;
            this.day = day;
            this.mode = mode;
            
            const allQuestions = await Utils.loadQuestions(this.theme);
            this.questions = Utils.getQuestionsForDay(allQuestions, this.day, this.mode);
            
            if (this.questions.length === 0) {
                throw new Error('No flashcards available for selected day');
            }
            
            this.shuffleQuestions();
            this.setupEventListeners();
            this.updateCard();
            
        } catch (error) {
            this.handleError(error.message);
        }
    }

    setupEventListeners() {
        const flashcard = document.getElementById('flashcard');
        const flipBtn = document.getElementById('flipBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        if (flashcard) flashcard.addEventListener('click', () => this.flipCard());
        if (flipBtn) flipBtn.addEventListener('click', () => this.flipCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevCard());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft': this.prevCard(); break;
                case 'ArrowRight': this.nextCard(); break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.flipCard();
                    break;
            }
        });
    }

    updateCard() {
        if (this.currentCardIndex >= this.questions.length) {
            this.showCompletionMessage();
            return;
        }

        const card = this.questions[this.currentCardIndex];
        document.getElementById('frontContent').textContent = card.question;
        document.getElementById('backContent').textContent = `Answer: ${card.answer}`;
        document.getElementById('explanationContent').textContent = card.explanation || 'No explanation available.';
        
        // Reset card to front view
        document.getElementById('flashcard').classList.remove('flipped');
        
        this.updateProgress();
        this.updateButtonStates();
    }

    updateProgress() {
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        
        if (progressText) {
            progressText.textContent = `${this.currentCardIndex + 1}/${this.questions.length}`;
        }
        if (progressFill) {
            progressFill.style.width = `${((this.currentCardIndex + 1) / this.questions.length) * 100}%`;
        }
    }

    updateButtonStates() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentCardIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentCardIndex === this.questions.length - 1;
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.classList.toggle('flipped');
        }
    }

    nextCard() {
        if (this.currentCardIndex < this.questions.length - 1) {
            this.currentCardIndex++;
            this.updateCard();
        }
    }

    prevCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.updateCard();
        }
    }

    showCompletionMessage() {
        const flashcardPerspective = document.querySelector('.flashcard-perspective');
        if (flashcardPerspective) {
            flashcardPerspective.innerHTML = `
                <div class="completion-message">
                    <h2>🎉 Flashcards Complete!</h2>
                    <p>You've reviewed all ${this.questions.length} flashcards for Day ${this.day}.</p>
                    <button onclick="window.location.href='days.html'" class="btn">Choose Another Day</button>
                </div>
            `;
        }
        
        // Hide controls
        const controls = document.querySelector('.flashcard-controls');
        if (controls) controls.style.display = 'none';
    }

    // Override base methods that don't apply to flashcards
    startTimer() { /* No timer in flashcard mode */ }
    updateTimerDisplay() { /* No timer in flashcard mode */ }
    handleAnswer() { /* No scoring in flashcard mode */ }
    showResults() { /* No results in flashcard mode */ }
    completeSession() { /* No completion in flashcard mode */ }
}
