// Mode configuration
const quizModes = {
    'daywise': {
        displayName: 'Day-wise Target',
        description: '5 new questions each day'
    },
    'accumulative': {
        displayName: 'Accumulative',
        description: 'Questions accumulate each day'
    }
};

// Initialize mode selection page
document.addEventListener('DOMContentLoaded', function() {
    setupModeSelection();
});

// Mode Selection Page
function setupModeSelection() {
    const container = document.getElementById('mode-buttons');
    container.innerHTML = '';
    
    Object.entries(quizModes).forEach(([modeId, modeData]) => {
        const button = document.createElement('button');
        button.className = 'glow';
        button.innerHTML = `<strong>${modeData.displayName}</strong><br><span style="font-size: 0.9em; opacity: 0.8;">${modeData.description}</span>`;
        button.onclick = () => {
            localStorage.setItem('quizMode', modeId);
            window.location.href = 'days.html';
        };
        container.appendChild(button);
    });
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'option-button';
    backButton.textContent = '← Back to Themes';
    backButton.onclick = () => {
        window.location.href = 'index.html';
    };
    container.appendChild(backButton);
}
