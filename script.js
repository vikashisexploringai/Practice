// Global state
let currentTheme = '';
let currentDay = 0;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let stopwatchInterval;

// Theme configuration with display names
const themes = {
    'vocabulary': { displayName: 'Vocabulary' },
    'tables': { displayName: 'Table' },
    'indianRulers': { displayName: 'Indian Rulers Timeline' },
    'atomicNumbers': { displayName: 'Atomic Numbers' },
    'britishGovernors': { displayName: 'Governor General and Viceroys' },
    'trignometricEquations': { displayName: 'Trignometric Equations' }
};

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop();
    
    if (path === 'index.html' || path === '') {
        setupThemeSelection();
    } else if (path === 'days.html') {
        setupDaySelection();
    } else if (path === 'quiz.html') {
        initializeQuiz();
    }
});

// Theme Selection Page
function setupThemeSelection() {
    const container = document.getElementById('theme-buttons');
    container.innerHTML = '';
    
    Object.entries(themes).forEach(([themeId, themeData]) => {
        const button = document.createElement('button');
        button.className = 'glow';
        button.textContent = themeData.displayName;
        button.onclick = () => {
            currentTheme = themeId;
            localStorage.setItem('selectedTheme', themeId);
            window.location.href = 'mode.html';
        };
        container.appendChild(button);
    });
}

// Day Selection Page
// Day Selection Page
// Day Selection Page
function setupDaySelection() {
    currentTheme = localStorage.getItem('selectedTheme');
    const quizMode = localStorage.getItem('quizMode');
    
    if (!currentTheme || !themes[currentTheme] || !quizMode) {
        window.location.href = 'index.html';
        return;
    }

    fetch(`themes/${currentTheme}.json`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            const totalDays = Math.ceil(questions.length / 5);
            const container = document.getElementById('day-buttons');
            container.innerHTML = '';
            
            for (let day = 1; day <= totalDays; day++) {
                const button = document.createElement('button');
                button.className = 'glow';
                
                // Update button text based on mode
                if (quizMode === 'daywise') {
                    button.textContent = `Day ${day} (5 questions)`;
                } else if (quizMode === 'accumulative') {
                    const questionCount = Math.min(day * 5, questions.length);
                    button.textContent = `Day ${day} (${questionCount} questions)`;
                } else if (quizMode === 'flashcard') {
                    button.textContent = `Day ${day} (5 flashcards)`;
                } else if (quizMode === 'cloze') {
                    button.textContent = `Day ${day} (5 cloze tests)`;
                }
                
                button.onclick = () => {
                    currentDay = day;
                    localStorage.setItem('selectedDay', day);
                    
                    // Redirect based on mode
                    if (quizMode === 'flashcard') {
                        window.location.href = 'flashcard.html';
                    } else if (quizMode === 'cloze') {
                        window.location.href = 'cloze.html';
                    } else {
                        window.location.href = 'quiz.html';
                    }
                };
                container.appendChild(button);
            }
            
            // Add back button
            const backButton = document.createElement('button');
            backButton.className = 'option-button';
            backButton.textContent = '← Back to Modes';
            backButton.onclick = () => {
                window.location.href = 'mode.html';
            };
            container.appendChild(backButton);
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please try again.');
            window.location.href = 'index.html';
        });
}

// Quiz Page
function initializeQuiz() {
    currentTheme = localStorage.getItem('selectedTheme');
    currentDay = parseInt(localStorage.getItem('selectedDay'));
    const quizMode = localStorage.getItem('quizMode');
    
    if (!currentTheme || !currentDay || !quizMode) {
        window.location.href = 'index.html';
        return;
    }

    // Show loading state
    document.getElementById('question-text').textContent = "Loading questions...";
    
    fetch(`themes/${currentTheme}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No questions found in file');
            }
            
            // Select questions based on mode
            let selectedQuestions;
            if (quizMode === 'daywise') {
                // Day-wise: 5 questions for the selected day
                const startIndex = (currentDay - 1) * 5;
                selectedQuestions = data.slice(startIndex, startIndex + 5);
            } else {
                // Accumulative: all questions up to current day * 5
                const totalQuestionsToSelect = Math.min(currentDay * 5, data.length);
                selectedQuestions = data.slice(0, totalQuestionsToSelect);
            }
            
            questions = shuffleArray(selectedQuestions);
            
            currentQuestionIndex = 0;
            score = 0;
            startStopwatch();
            displayQuestion();
        })
        .catch(error => {
            console.error('Failed to load questions:', error);
            document.getElementById('question-text').textContent = 
                "Error: Could not load questions. Please check:";
            document.getElementById('options-container').innerHTML = `
                <p>1. JSON file exists in themes/ folder</p>
                <p>2. File contains valid questions</p>
                <button onclick="window.location.href='days.html'">← Back to Day Selection</button>
            `;
        });
}

function displayQuestion() {
    const questionContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const progressBar = document.getElementById('progress-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const explanationContainer = document.getElementById('explanation-container');

    // Verify all elements exist
    if (!questionContainer || !resultContainer || !progressBar || 
        !questionText || !optionsContainer || !explanationContainer) {
        console.error('Critical elements missing in HTML');
        return;
    }

    // Hide result container and show question container
    resultContainer.style.display = 'none';
    questionContainer.style.display = 'block';

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    
    // Update progress counter
    progressBar.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    
    // Set question text
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    explanationContainer.style.display = 'none';

    // Create option buttons with shuffled choices
    const shuffledOptions = shuffleArray([...question.choices]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.answer);
        optionsContainer.appendChild(button);
    });
}

function showResults() {
    stopStopwatch();
    const totalQuestions = questions.length;
    const accuracy = Math.round((score / totalQuestions) * 100);
    
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalQuestions;
    document.getElementById('completion-time').textContent = 
        document.getElementById('stopwatch').textContent;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
}

function checkAnswer(selectedOption, correctAnswer) {
    const options = document.querySelectorAll('#options-container button');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');

    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === correctAnswer) {
            option.classList.add('correct-answer');
        } else if (option.textContent === selectedOption && selectedOption !== correctAnswer) {
            option.classList.add('wrong-answer');
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
    }

    explanationText.textContent = questions[currentQuestionIndex].explanation || 'No explanation available.';
    explanationContainer.style.display = 'block';
    document.getElementById('next-button').onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Stopwatch functions
function startStopwatch() {
    startTime = Date.now();
    stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
}

// Utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
