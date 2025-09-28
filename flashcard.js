// Flashcard state
let currentTheme = '';
let currentDay = 0;
let flashcards = [];
let currentCardIndex = 0;

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
            
            flashcards = shuffleArray(selectedQuestions);
            currentCardIndex = 0;
            displayCard();
        })
        .catch(error => {
            console.error('Failed to load flashcards:', error);
            document.getElementById('question-text').textContent = 
                "Error loading flashcards. Please try again.";
        });
}

function displayCard() {
    if (currentCardIndex >= flashcards.length) {
        // All cards completed
        document.getElementById('flashcard-container').innerHTML = `
            <div class="completion-message">
                <h2 class="glow-text">🎉 All Flashcards Complete!</h2>
                <p>You've reviewed all ${flashcards.length} flashcards for Day ${currentDay}</p>
                <button onclick="window.location.href='days.html'" class="glow">Choose Another Day</button>
            </div>
        `;
        return;
    }

    const card = flashcards[currentCardIndex];
    const progressCounter = document.getElementById('progress-counter');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const explanationText = document.getElementById('explanation-text');
    const flashcard = document.getElementById('flashcard');

    // Update progress
    progressCounter.textContent = `${currentCardIndex + 1}/${flashcards.length}`;
    
    // Set card content
    questionText.textContent = card.question;
    answerText.textContent = `Answer: ${card.answer}`;
    explanationText.textContent = card.explanation || 'No explanation available.';
    
    // Reset card to front side
    flashcard.classList.remove('flipped');
    
    // Update next button
    document.getElementById('next-card').onclick = nextCard;
}

function nextCard() {
    currentCardIndex++;
    displayCard();
}

// Flip card on click
document.addEventListener('click', function(e) {
    const flashcard = document.getElementById('flashcard');
    if (flashcard && !e.target.closest('.flashcard-actions')) {
        flashcard.classList.toggle('flipped');
    }
});

// Utility function (same as in script.js)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
