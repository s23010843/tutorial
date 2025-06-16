
// Programming Tutorials Pro - Advanced SPA Application
class TutorialApp {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
        this.currentRoute = '';
        this.isNavigating = false;
        this.prefetchedRoutes = new Set();
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupPWA();
        this.setupRouter();
        this.setupEventListeners();
        this.setupCookieNotice();
        this.checkOnlineStatus();
        this.updateCurrentYear();
        this.setupPerformanceOptimizations();
        this.hideLoading();
        this.setupErrorHandling();
        this.initializeAnimations();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon') || themeToggle;
        
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
            this.animateThemeTransition();
        });
    }

    setupRouter() {
        // Handle initial route
        this.handleRoute();
        
        // Listen for popstate events (back/forward buttons)
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.navigate(link.href);
            }
        });
    }

    isInternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.origin === window.location.origin;
        } catch {
            return false;
        }
    }

    async navigate(url, pushState = true) {
        if (this.isNavigating) return;
        
        const targetUrl = new URL(url, window.location.origin);
        const route = this.getRouteFromUrl(targetUrl);
        
        if (route === this.currentRoute) return;
        
        this.isNavigating = true;
        this.showNavigationLoader();
        
        try {
            await this.loadRoute(route, targetUrl);
            
            if (pushState) {
                history.pushState({ route }, '', targetUrl.href);
            }
            
            this.currentRoute = route;
            this.updateActiveNavigation();
            this.animatePageTransition();
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.handleNavigationError();
        } finally {
            this.isNavigating = false;
            this.hideNavigationLoader();
        }
    }

    getRouteFromUrl(url) {
        const path = url.pathname.replace('/tutorial/', '').replace(/\/$/, '');
        return path || 'home';
    }

    async loadRoute(route, url) {
        const routeConfig = this.getRouteConfig(route);
        
        if (routeConfig.external) {
            // For external routes like separate tutorial pages
            window.location.href = url.href;
            return;
        }
        
        // Load content for SPA routes
        const content = await this.getRouteContent(route);
        this.renderContent(content);
        
        // Update metadata
        this.updateMetadata(routeConfig);
    }

    getRouteConfig(route) {
        const routes = {
            'home': {
                title: 'Programming Tutorials Pro - #1 Free Learning Platform',
                description: 'Master programming with comprehensive tutorials for Git, Python, C++, Java, C#, Android.',
                external: false
            },
            'github': {
                title: 'Git & GitHub Tutorial - Complete Professional Guide',
                description: 'Master Git and GitHub with our comprehensive tutorial.',
                external: true
            },
            'python': {
                title: 'Python Programming Tutorial - From Basics to Advanced',
                description: 'Complete Python programming course with interactive examples.',
                external: true
            },
            'java': {
                title: 'Java Development Tutorial - Professional Guide',
                description: 'Master Java programming with object-oriented concepts.',
                external: true
            },
            'cpp': {
                title: 'C++ Programming Tutorial - Advanced Guide',
                description: 'Learn C++ for system programming and high-performance applications.',
                external: true
            },
            'csharp': {
                title: 'C# Development Tutorial - .NET Programming',
                description: 'Build modern applications with C# and .NET framework.',
                external: true
            },
            'c': {
                title: 'C Programming Tutorial - Foundation Guide',
                description: 'Master the foundation of programming with C language.',
                external: true
            },
            'android': {
                title: 'Android Development Tutorial - Mobile App Guide',
                description: 'Create mobile apps with Android development.',
                external: true
            }
        };
        
        return routes[route] || routes['home'];
    }

    async getRouteContent(route) {
        // Return appropriate content based on route
        if (route === 'home' || !route) {
            return this.getHomeContent();
        }
        
        // For other routes, return default content or fetch from server
        return this.getDefaultContent(route);
    }

    getHomeContent() {
        return `
            <section class="hero enhanced-hero">
                <div class="hero-background"></div>
                <div class="hero-content">
                    <h1 class="hero-title animate-fade-in">Master Programming with Professional Tutorials</h1>
                    <p class="hero-subtitle animate-slide-up">Complete courses for Git, Python, Java, C++, C#, C, and Android development. Interactive examples, offline support, and industry best practices.</p>
                    <div class="hero-buttons animate-slide-up-delayed">
                        <a href="github/" class="btn btn-primary pulse-effect">Start with Git</a>
                        <a href="python/" class="btn btn-secondary hover-lift">Learn Python</a>
                    </div>
                    <div class="hero-stats animate-fade-in-delayed">
                        <div class="stat">
                            <span class="stat-number counter" data-target="8">0</span>
                            <span class="stat-label">Languages</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number counter" data-target="500">0</span>
                            <span class="stat-label">Lessons</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Free</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">Offline</span>
                            <span class="stat-label">Ready</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="tutorials enhanced-tutorials">
                <div class="container">
                    <h2 class="section-title animate-on-scroll">Choose Your Programming Journey</h2>
                    <div class="tutorial-grid enhanced-grid">
                        ${this.generateTutorialCards()}
                    </div>
                </div>
            </section>

            <section class="features enhanced-features">
                <div class="container">
                    <h2 class="section-title animate-on-scroll">Why Choose Our Tutorials?</h2>
                    <div class="features-grid enhanced-features-grid">
                        ${this.generateFeatureCards()}
                    </div>
                </div>
            </section>
        `;
    }

    generateTutorialCards() {
        const tutorials = [
            { icon: '🔧', name: 'Git & GitHub', desc: 'Master version control and collaboration with our comprehensive Git and GitHub tutorial. Essential for every developer.', difficulty: 'beginner', lessons: '60+', href: 'github/', featured: true },
            { icon: '🐍', name: 'Python Programming', desc: 'Learn Python from basics to advanced topics including web development, data science, and automation.', difficulty: 'beginner', lessons: '100+', href: 'python/' },
            { icon: '☕', name: 'Java Development', desc: 'Master Java programming with object-oriented concepts, frameworks, and enterprise development.', difficulty: 'intermediate', lessons: '90+', href: 'java/' },
            { icon: '⚡', name: 'C++ Programming', desc: 'Learn C++ for system programming, game development, and high-performance applications.', difficulty: 'advanced', lessons: '80+', href: 'cpp/' },
            { icon: '🎯', name: 'C# Development', desc: 'Build modern applications with C# and .NET framework. Desktop, web, and mobile development.', difficulty: 'intermediate', lessons: '85+', href: 'csharp/' },
            { icon: '⚙️', name: 'C Programming', desc: 'Master the foundation of programming with C language. System programming and embedded development.', difficulty: 'beginner', lessons: '70+', href: 'c/' },
            { icon: '🌐', name: 'JavaScript', desc: 'Learn modern JavaScript, ES6+, DOM manipulation, and build interactive web applications.', difficulty: 'beginner', lessons: '95+', href: 'javascript/' },
            { icon: '🚀', name: 'Go Programming', desc: 'Master Go language for backend development, microservices, and cloud-native applications.', difficulty: 'intermediate', lessons: '75+', href: 'go/' },
            { icon: '🦀', name: 'Rust Programming', desc: 'Learn Rust for systems programming with memory safety and high performance.', difficulty: 'advanced', lessons: '65+', href: 'rust/' },
            { icon: '📱', name: 'Android Development', desc: 'Create mobile apps with Android development using Java, Kotlin, and modern Android frameworks.', difficulty: 'intermediate', lessons: '110+', href: 'android/' }
        ];

        return tutorials.map((tutorial, index) => `
            <div class="tutorial-card enhanced-card animate-on-scroll ${tutorial.featured ? 'featured' : ''} ${tutorial.comingSoon ? 'coming-soon' : ''}" 
                 style="animation-delay: ${index * 0.1}s" data-href="${tutorial.href}">
                <div class="tutorial-icon animate-float">${tutorial.icon}</div>
                <h3>${tutorial.name}</h3>
                <p>${tutorial.desc}</p>
                <div class="tutorial-meta">
                    <span class="difficulty ${tutorial.difficulty}">${tutorial.difficulty}</span>
                    <span class="lessons">${tutorial.lessons} Lessons</span>
                </div>
                <a href="${tutorial.href}" class="tutorial-link ${tutorial.comingSoon ? 'disabled' : ''}">
                    ${tutorial.comingSoon ? 'Coming Soon' : 'Start Learning'}
                </a>
            </div>
        `).join('');
    }

    generateFeatureCards() {
        const features = [
            { icon: '🏆', title: 'Professional Quality', desc: 'Industry-standard practices with real-world examples from experienced developers' },
            { icon: '📱', title: 'Mobile Optimized', desc: 'Perfect experience on all devices with responsive design and PWA technology' },
            { icon: '⚡', title: 'Interactive Learning', desc: 'Practice with built-in code editors and hands-on exercises' },
            { icon: '🔄', title: 'Works Offline', desc: 'Continue learning anywhere with full offline support' },
            { icon: '🎯', title: 'SEO Optimized', desc: 'Structured content for easy discovery and learning progress tracking' },
            { icon: '🔒', title: 'Privacy Focused', desc: 'No tracking, no cookies, just pure learning experience' }
        ];

        return features.map((feature, index) => `
            <div class="feature-card enhanced-feature animate-on-scroll" style="animation-delay: ${index * 0.1}s">
                <div class="feature-icon pulse-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.desc}</p>
            </div>
        `).join('');
    }

    renderContent(content) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = content;
            this.reinitializeInteractivity();
        }
    }

    reinitializeInteractivity() {
        // Reinitialize scroll animations
        this.setupScrollAnimations();
        
        // Reinitialize counters
        this.setupCounters();
        
        // Reinitialize tutorial card interactions
        this.setupTutorialInteractions();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });

            observer.observe(counter);
        });
    }

    setupTutorialInteractions() {
        document.querySelectorAll('.tutorial-card:not(.coming-soon)').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('tutorial-link')) {
                    const href = this.getAttribute('data-href');
                    if (href && href !== '#') {
                        window.tutorialApp.navigate(href);
                    }
                }
            });
        });
    }

    handleRoute() {
        const route = this.getRouteFromUrl(new URL(window.location));
        this.navigate(window.location.href, false);
    }

    updateMetadata(routeConfig) {
        document.title = routeConfig.title;
        
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', routeConfig.description);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) ogTitle.setAttribute('content', routeConfig.title);
        if (ogDescription) ogDescription.setAttribute('content', routeConfig.description);
    }

    updateActiveNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/tutorial/' && link.getAttribute('href') === '#home')) {
                link.classList.add('active');
            }
        });
    }

    showNavigationLoader() {
        let loader = document.querySelector('.navigation-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'navigation-loader';
            loader.innerHTML = '<div class="navigation-progress"></div>';
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    }

    hideNavigationLoader() {
        const loader = document.querySelector('.navigation-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    animatePageTransition() {
        document.body.classList.add('page-transitioning');
        setTimeout(() => {
            document.body.classList.remove('page-transitioning');
        }, 300);
    }

    animateThemeTransition() {
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    initializeAnimations() {
        // Initialize entrance animations
        document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-up-delayed, .animate-fade-in-delayed').forEach(el => {
            el.classList.add('animate-init');
        });
        
        // Setup scroll-triggered animations
        this.setupScrollAnimations();
        this.setupCounters();
    }

    setupPerformanceOptimizations() {
        // Prefetch critical routes
        this.prefetchCriticalRoutes();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Setup service worker updates
        this.setupServiceWorkerUpdates();
    }

    prefetchCriticalRoutes() {
        const criticalRoutes = ['github/', 'python/'];
        criticalRoutes.forEach(route => {
            if (!this.prefetchedRoutes.has(route)) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = route;
                document.head.appendChild(link);
                this.prefetchedRoutes.add(route);
            }
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupServiceWorkerUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'SKIP_WAITING') {
                    window.location.reload();
                }
            });
        }
    }

    setupPWA() {
        // Register service worker with enhanced error handling
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/tutorial/sw.js', {
                        scope: '/tutorial/',
                        updateViaCache: 'none'
                    });
                    
                    console.log('SW registered successfully');
                    
                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    });
                    
                } catch (error) {
                    console.log('SW registration failed:', error);
                }
            });
        }

        // Enhanced PWA installation
        this.setupPWAInstallation();
    }

    setupPWAInstallation() {
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.style.display = 'block';
                installBtn.classList.add('bounce-in');
            }
        });

        installBtn?.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                
                if (choiceResult.outcome === 'accepted') {
                    this.trackEvent('pwa_installed');
                }
                
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });

        window.addEventListener('appinstalled', () => {
            if (installBtn) {
                installBtn.style.display = 'none';
            }
            this.showInstallSuccessMessage();
        });
    }

    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'install-success-message';
        message.innerHTML = `
            <div class="message-content">
                <span>🎉 App installed successfully! You can now use it offline.</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.classList.add('show');
        }, 100);

        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    setupEventListeners() {
        // Enhanced mobile menu with animations
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        hamburger?.addEventListener('click', () => {
            const isActive = navMenu?.classList.contains('active');
            
            if (isActive) {
                navMenu?.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            } else {
                navMenu?.classList.add('active');
                hamburger.classList.add('active');
                document.body.classList.add('menu-open');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu?.classList.contains('active')) {
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Enhanced scroll handling
        let ticking = false;
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar?.classList.add('navbar-hidden');
        } else {
            navbar?.classList.remove('navbar-hidden');
        }
        
        if (currentScrollY > 50) {
            navbar?.classList.add('navbar-scrolled');
        } else {
            navbar?.classList.remove('navbar-scrolled');
        }
        
        lastScrollY = currentScrollY;
    }

    setupCookieNotice() {
        const cookieNotice = document.getElementById('cookieNotice');
        const acceptBtn = document.getElementById('acceptCookies');

        if (!this.cookiesAccepted && cookieNotice) {
            cookieNotice.style.display = 'block';
            setTimeout(() => cookieNotice.classList.add('show'), 1000);
        }

        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            this.cookiesAccepted = true;
            cookieNotice?.classList.add('hide');
            setTimeout(() => {
                if (cookieNotice) cookieNotice.style.display = 'none';
            }, 300);
        });
    }

    checkOnlineStatus() {
        const offlineStatus = document.getElementById('offlineStatus');
        
        const updateStatus = () => {
            if (navigator.onLine) {
                offlineStatus?.classList.remove('show');
                document.body.classList.remove('offline');
            } else {
                offlineStatus?.classList.add('show');
                document.body.classList.add('offline');
            }
        };
        
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('.current-year').forEach(element => {
            element.textContent = currentYear;
        });
    }

    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 800);
    }

    setupErrorHandling() {
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
        console.error('Application error:', error);
        
        // Categorize error types
        let message = 'Something went wrong. Please refresh the page.';
        if (error.name === 'TypeError') {
            message = 'Network error. Please check your connection.';
        } else if (error.name === 'SyntaxError') {
            message = 'Page loading error. Please refresh to try again.';
        }
        
        this.showErrorNotification(message);
        
        // Track error for debugging
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => notification.remove(), 5000);
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🚀 New version available!</span>
                <button onclick="window.location.reload()" class="btn btn-primary">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-close">×</button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
    }

    // Analytics helpers (privacy-focused)
    trackPageView(page) {
        if (this.cookiesAccepted) {
            const visits = JSON.parse(localStorage.getItem('pageVisits') || '{}');
            visits[page] = (visits[page] || 0) + 1;
            localStorage.setItem('pageVisits', JSON.stringify(visits));
        }
    }

    trackEvent(event, data = {}) {
        if (this.cookiesAccepted) {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            events.push({
                event,
                data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('events', JSON.stringify(events.slice(-100)));
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialApp = new TutorialApp();
    window.tutorialApp.trackPageView(window.location.pathname);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        window.tutorialApp?.trackEvent('page_visible');
    } else {
        window.tutorialApp?.trackEvent('page_hidden');
    }
});

// Utility functions for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle HTTP errors gracefully
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

// Enhanced performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            if (window.tutorialApp) {
                window.tutorialApp.trackEvent('performance', {
                    loadTime,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
                });
            }
        }, 0);
    });
}
