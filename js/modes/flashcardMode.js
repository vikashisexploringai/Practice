import { BaseMode } from './baseMode.js';
import { Utils } from '../core/utils.js';

export class FlashcardMode extends BaseMode {
    constructor() {
        super('flashcard-container');
        this.currentCardIndex = 0;
    }

    initialize(theme, day, mode) {
        // Flashcard doesn't use timer, so we override initialize
        this.theme = theme;
        this.day = day;
        this.mode = mode;
        
        this.loadFlashcards();
    }

    async loadFlashcards() {
        try {
            const allQuestions = await Utils.loadQuestions(this.theme);
            this.questions = Utils.getQuestionsForDay(allQuestions, this.day, this.mode);
            
            if (this.questions.length === 0) {
                throw new Error('No questions available for selected day');
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
        const card = this.questions[this.currentCardIndex];
        document.getElementById('frontContent').textContent = card.question;
        document.getElementById('backContent').textContent = `Answer: ${card.answer}`;
        document.getElementById('explanationContent').textContent = card.explanation || 'No explanation available.';
        
        // Reset card to front view
        document.getElementById('flashcard').classList.remove('flipped');
        
        // Update progress
        this.updateProgress();
        
        // Update button states
        document.getElementById('prevBtn').disabled = this.currentCardIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentCardIndex === this.questions.length - 1;
    }

    updateProgress() {
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        
        if (progressText) progressText.textContent = `${this.currentCardIndex + 1}/${this.questions.length}`;
        if (progressFill) progressFill.style.width = `${((this.currentCardIndex + 1) / this.questions.length) * 100}%`;
    }

    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
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

    // Override base methods that don't apply to flashcards
    startTimer() { /* No timer in flashcard mode */ }
    updateTimerDisplay() { /* No timer in flashcard mode */ }
    handleAnswer() { /* No scoring in flashcard mode */ }
    showResults() { /* No results in flashcard mode */ }
    completeSession() { /* No completion in flashcard mode */ }
}
