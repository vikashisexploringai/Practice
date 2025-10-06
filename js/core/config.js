// Application configuration
export const CONFIG = {
    QUESTIONS_PER_DAY: 5,
    THEMES: {
        'vocabulary': { displayName: 'Vocabulary' },
        'tables': { displayName: 'Table' },
        'indianRulers': { displayName: 'Indian Rulers Timeline' },
        'atomicNumbers': { displayName: 'Atomic Numbers' },
        'britishGovernors': { displayName: 'Governor General and Viceroys' },
        'trignometricEquations': { displayName: 'Trignometric Equations' }
    },
    MODES: {
        'daywise': {
            displayName: 'Day-wise Target',
            description: '5 new questions each day',
            supportsDays: true
        },
        'accumulative': {
            displayName: 'Accumulative',
            description: 'Questions accumulate each day',
            supportsDays: true
        },
        'flashcard': {
            displayName: 'Flashcard Mode',
            description: 'Tap to reveal answers',
            supportsDays: true,
            customPage: 'flashcard.html'
        },
        'cloze': {
            displayName: 'Cloze Test Mode',
            description: 'Type the answers',
            supportsDays: true,
            customPage: 'cloze.html'
        }
    }
};
