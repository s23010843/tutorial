
class GoTutorialApp {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.progress = JSON.parse(localStorage.getItem('go-tutorial-progress') || '{}');
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupProgressTracking();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.updateCurrentYear();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            themeToggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.theme);
                localStorage.setItem('theme', this.theme);
                themeToggle.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            });
        }
    }

    setupEventListeners() {
        const hamburger = document.getElementById('hamburger');
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

        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                this.markLessonAsCompleted(card);
            });
        });
    }

    setupProgressTracking() {
        document.querySelectorAll('.lesson-card').forEach((card, index) => {
            const lessonId = `lesson-${index}`;
            if (this.progress[lessonId]) {
                card.classList.add('completed');
                card.innerHTML += '<div class="completion-badge">✓</div>';
            }
        });
    }

    markLessonAsCompleted(card) {
        const lessonId = `lesson-${Array.from(card.parentNode.children).indexOf(card)}`;
        this.progress[lessonId] = true;
        localStorage.setItem('go-tutorial-progress', JSON.stringify(this.progress));
        
        if (!card.classList.contains('completed')) {
            card.classList.add('completed');
            card.innerHTML += '<div class="completion-badge">✓</div>';
            this.showCompletionAnimation(card);
        }
    }

    showCompletionAnimation(card) {
        const badge = card.querySelector('.completion-badge');
        if (badge) {
            badge.style.animation = 'bounceIn 0.6s ease';
        }
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

        document.querySelectorAll('.lesson-card, .content-section h2').forEach(el => {
            observer.observe(el);
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
    new GoTutorialApp();
});
