
// C++ Tutorial Application
class CppTutorialApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupThemeToggle();
        this.setupProgressTracking();
        this.setupCodeEditor();
        this.updateCurrentYear();
    }

    setupEventListeners() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.nextElementSibling.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = 'Copy', 2000);
                });
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.lesson-card, .content-section').forEach(el => {
            observer.observe(el);
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        const savedTheme = localStorage.getItem('theme') || 
                          (prefersDark.matches ? 'dark' : 'light');
        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    setupProgressTracking() {
        const lessonCards = document.querySelectorAll('.lesson-card');
        
        lessonCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const lessonId = `cpp-lesson-${index}`;
                this.markLessonAsViewed(lessonId);
                card.classList.add('viewed');
            });
        });

        this.loadProgress();
    }

    markLessonAsViewed(lessonId) {
        const viewedLessons = JSON.parse(localStorage.getItem('viewedLessons') || '[]');
        if (!viewedLessons.includes(lessonId)) {
            viewedLessons.push(lessonId);
            localStorage.setItem('viewedLessons', JSON.stringify(viewedLessons));
        }
    }

    loadProgress() {
        const viewedLessons = JSON.parse(localStorage.getItem('viewedLessons') || '[]');
        const lessonCards = document.querySelectorAll('.lesson-card');
        
        lessonCards.forEach((card, index) => {
            const lessonId = `cpp-lesson-${index}`;
            if (viewedLessons.includes(lessonId)) {
                card.classList.add('viewed');
            }
        });
    }

    setupCodeEditor() {
        document.querySelectorAll('.code-example').forEach(codeBlock => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            });
            codeBlock.parentNode.insertBefore(copyBtn, codeBlock);
        });
    }

    updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('.current-year').forEach(element => {
            element.textContent = currentYear;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CppTutorialApp();
});
