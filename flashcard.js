// Flashcard state
let currentTheme = '';
let currentDay = 0;
let flashcards = [];
let currentCardIndex = 0;

// DOM elements
const flashcard = document.getElementById('flashcard');
const frontContent = document.getElementById('frontContent');
const backContent = document.getElementById('backContent');
const explanationContent = document.getElementById('explanationContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

// Initialize flashcard page
document.addEventListener('DOMContentLoaded', function() {
    initializeFlashcards();
});

function initializeFlashcards() {
    currentTheme = localStorage.getItem('selectedTheme');
    currentDay = parseInt(localStorage.getItem('selectedDay'));
    
    if (!currentTheme || !currentDay) {
        window.location.href = 'index.html';
        return;
    }

    fetch(`themes/${currentTheme}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No questions found in file');
            }
            
            // Select questions for the current day (5 questions per day)
            const startIndex = (currentDay - 1) * 5;
            const selectedQuestions = data.slice(startIndex, startIndex + 5);
            
            if (selectedQuestions.length === 0) {
                throw new Error('No questions available for this day');
            }
            
            flashcards = shuffleArray(selectedQuestions);
            currentCardIndex = 0;
            updateCard();
        })
        .catch(error => {
            console.error('Failed to load flashcards:', error);
            frontContent.textContent = "Error loading flashcards. Please try again.";
        });
}

function updateCard() {
    const card = flashcards[currentCardIndex];
    frontContent.textContent = card.question;
    backContent.textContent = `Answer: ${card.answer}`;
    explanationContent.textContent = card.explanation || 'No explanation available.';
    
    // Reset card to front view
    flashcard.classList.remove('flipped');
    
    // Update progress
    progressText.textContent = `${currentCardIndex + 1}/${flashcards.length}`;
    progressFill.style.width = `${((currentCardIndex + 1) / flashcards.length) * 100}%`;
    
    // Update button states
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === flashcards.length - 1;
}

function flipCard() {
    flashcard.classList.toggle('flipped');
}

function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        updateCard();
    }
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCard();
    }
}

// Event listeners
flashcard.addEventListener('click', flipCard);
flipBtn.addEventListener('click', flipCard);
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            prevCard();
            break;
        case 'ArrowRight':
            nextCard();
            break;
        case ' ':
        case 'Enter':
            e.preventDefault();
            flipCard();
            break;
    }
});

// Utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
