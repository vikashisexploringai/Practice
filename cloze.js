// Initialize cloze test
document.addEventListener('DOMContentLoaded', function() {
    initializeClozeTest();
});

function initializeClozeTest() {
    const currentTheme = localStorage.getItem('selectedTheme');
    const currentDay = parseInt(localStorage.getItem('selectedDay'));
    
    if (!currentTheme || !currentDay) {
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
            
            // Select questions for the current day (5 questions per day)
            const startIndex = (currentDay - 1) * 5;
            const selectedQuestions = data.slice(startIndex, startIndex + 5);
            
            window.questions = shuffleArray(selectedQuestions);
            window.currentQuestionIndex = 0;
            window.score = 0;
            startStopwatch();
            displayQuestion();
            
            // Setup event listeners
            document.getElementById('submit-answer').onclick = checkAnswer;
            document.getElementById('answer-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkAnswer();
                }
            });
            document.getElementById('next-button').onclick = nextQuestion;
        })
        .catch(error => {
            console.error('Failed to load questions:', error);
            document.getElementById('question-text').textContent = 
                "Error: Could not load questions. Please check the JSON file.";
        });
}

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const progressCounter = document.getElementById('progress-counter');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const feedbackContainer = document.getElementById('feedback-container');
    const explanationContainer = document.getElementById('explanation-container');

    // Hide result container and show question container
    resultContainer.style.display = 'none';
    questionContainer.style.display = 'block';

    if (window.currentQuestionIndex >= window.questions.length) {
        showResults();
        return;
    }

    const question = window.questions[window.currentQuestionIndex];
    
    // Update progress counter
    progressCounter.textContent = `${window.currentQuestionIndex + 1}/${window.questions.length}`;
    
    // Set question text
    questionText.textContent = question.question;
    
    // Reset input and feedback
    answerInput.value = '';
    answerInput.disabled = false;
    answerInput.focus();
    feedbackContainer.style.display = 'none';
    explanationContainer.style.display = 'none';
    
    // Update submit button
    document.getElementById('submit-answer').disabled = false;
    document.getElementById('submit-answer').textContent = 'Submit Answer';
}

function checkAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim();
    const correctAnswer = window.questions[window.currentQuestionIndex].answer;
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const explanationText = document.getElementById('explanation-text');
    const submitButton = document.getElementById('submit-answer');

    if (!userAnswer) {
        return; // Don't submit empty answers
    }

    // Disable input and button
    answerInput.disabled = true;
    submitButton.disabled = true;

    // Case-insensitive comparison with trimmed whitespace
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    if (isCorrect) {
        window.score++;
        feedbackText.innerHTML = '<span style="color: #4CAF50;">✓ Correct!</span>';
        feedbackText.className = 'correct-feedback';
    } else {
        feedbackText.innerHTML = `<span style="color: #f44336;">✗ Incorrect</span><br>Correct answer: <strong>${correctAnswer}</strong>`;
        feedbackText.className = 'incorrect-feedback';
    }

    // Show explanation
    explanationText.textContent = window.questions[window.currentQuestionIndex].explanation || 'No explanation available.';
    
    // Show feedback
    feedbackContainer.style.display = 'block';
    
    // Update submit button to show next
    submitButton.textContent = 'Next Question';
}

function nextQuestion() {
    window.currentQuestionIndex++;
    displayQuestion();
}
