import { CONFIG } from './config.js';

// Utility functions
export const Utils = {
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    calculateAccuracy(score, total) {
        return total > 0 ? Math.round((score / total) * 100) : 0;
    },

    async loadQuestions(theme) {
        try {
            const response = await fetch(`themes/${theme}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No questions found');
            }
            
            return data;
        } catch (error) {
            console.error('Failed to load questions:', error);
            throw new Error(`Could not load questions for ${theme}`);
        }
    },

    getQuestionsForDay(allQuestions, day, mode) {
        if (mode === 'accumulative') {
            const totalQuestions = Math.min(day * CONFIG.QUESTIONS_PER_DAY, allQuestions.length);
            return allQuestions.slice(0, totalQuestions);
        } else {
            const startIndex = (day - 1) * CONFIG.QUESTIONS_PER_DAY;
            return allQuestions.slice(startIndex, startIndex + CONFIG.QUESTIONS_PER_DAY);
        }
    },

validateAnswer(userAnswer, correctAnswer) {
    // Normalize both answers for comparison
    const normalizedUser = userAnswer.trim().toLowerCase()
        .replace(/[–—]/g, '-')  // Replace en-dash and em-dash with regular hyphen
        .replace(/\s+/g, ' ')   // Normalize spaces
        .replace(/\s*ad\s*$/i, ' ad'); // Standardize "AD" format
    
    const normalizedCorrect = correctAnswer.trim().toLowerCase()
        .replace(/[–—]/g, '-')  // Replace en-dash and em-dash with regular hyphen
        .replace(/\s+/g, ' ')   // Normalize spaces
        .replace(/\s*ad\s*$/i, ' ad'); // Standardize "AD" format
    
    console.log('Comparing:', {
        user: userAnswer,
        normalizedUser: normalizedUser,
        correct: correctAnswer,
        normalizedCorrect: normalizedCorrect,
        match: normalizedUser === normalizedCorrect
    });
    
    return normalizedUser === normalizedCorrect;
}
};
