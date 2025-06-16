
// Programming Tutorials Pro - Main Application
class TutorialApp {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupPWA();
        this.setupEventListeners();
        this.setupCookieNotice();
        this.checkOnlineStatus();
        this.updateCurrentYear();
        this.hideLoading();
        this.setupErrorHandling();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
        
        themeToggle?.addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
            if (themeIcon) {
                themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            }
        });
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/tutorial/sw.js', {
                    scope: '/tutorial/'
                })
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    this.showUpdateNotification();
                                }
                            }
                        });
                    });
                })
                .catch(error => console.log('SW registration failed: ', error));
            });
        }

        // PWA installation
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.style.display = 'block';
            }
        });

        installBtn?.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });

        // Handle app installed
        window.addEventListener('appinstalled', (evt) => {
            console.log('App was installed');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        hamburger?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Tutorial card interactions
        document.querySelectorAll('.tutorial-card:not(.coming-soon)').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('tutorial-link')) {
                    const link = this.querySelector('.tutorial-link');
                    if (link && !link.classList.contains('disabled')) {
                        window.location.href = link.href;
                    }
                }
            });
        });
    }

    setupCookieNotice() {
        const cookieNotice = document.getElementById('cookieNotice');
        const acceptBtn = document.getElementById('acceptCookies');

        if (!this.cookiesAccepted && cookieNotice) {
            cookieNotice.style.display = 'block';
        }

        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            this.cookiesAccepted = true;
            if (cookieNotice) {
                cookieNotice.style.display = 'none';
            }
        });
    }

    checkOnlineStatus() {
        const offlineStatus = document.getElementById('offlineStatus');
        
        const updateStatus = () => {
            if (navigator.onLine) {
                offlineStatus.style.display = 'none';
                document.body.classList.remove('offline');
            } else {
                offlineStatus.style.display = 'block';
                document.body.classList.add('offline');
            }
        };
        
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('.current-year');
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }

    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 1000);
    }

    setupErrorHandling() {
        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        // Log error for debugging
        console.error('Application error:', error);
        
        // You could send errors to an analytics service here
        // For now, we'll just handle it gracefully
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>A new version is available!</span>
                <button onclick="window.location.reload()" class="btn btn-primary">Refresh</button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.display = 'block';
        }, 100);
    }

    // Analytics helpers (privacy-focused)
    trackPageView(page) {
        // Only track if user accepted cookies
        if (this.cookiesAccepted) {
            const visits = JSON.parse(localStorage.getItem('pageVisits') || '{}');
            visits[page] = (visits[page] || 0) + 1;
            localStorage.setItem('pageVisits', JSON.stringify(visits));
        }
    }

    trackEvent(event, data) {
        // Only track if user accepted cookies
        if (this.cookiesAccepted) {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            events.push({
                event,
                data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('events', JSON.stringify(events.slice(-100))); // Keep last 100 events
        }
    }
}

// Utility functions
function handleHttpError(response) {
    if (!response.ok) {
        if (response.status === 404) {
            window.location.href = '/tutorial/404.html';
        } else if (response.status === 500) {
            window.location.href = '/tutorial/500.html';
        } else if (response.status === 403) {
            window.location.href = '/tutorial/403.html';
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialApp = new TutorialApp();
    
    // Track page view
    window.tutorialApp.trackPageView(window.location.pathname);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible
        window.tutorialApp?.trackEvent('page_visible');
    } else {
        // Page became hidden
        window.tutorialApp?.trackEvent('page_hidden');
    }
});
