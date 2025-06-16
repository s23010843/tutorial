
// JavaScript Tutorial Application
class JavaScriptTutorial {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLessonCards();
        this.setupTheme();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupLessonCards() {
        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                console.log('JavaScript Lesson clicked:', card.querySelector('h3').textContent);
            });
        });
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JavaScriptTutorial();
});
