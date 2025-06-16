// Git Tutorial Application
class GitTutorialApp {
    constructor() {
        this.currentPage = 'home';
        this.lessons = new Map();
        this.commands = [];
        this.terminalHistory = [];
        this.currentPath = '~/my-project';
        this.theme = localStorage.getItem('theme') || 'light';

        this.init();
    }

    init() {
        this.setupData();
        this.setupRouter();
        this.setupThemeToggle();
        this.setupPWA();
        this.setupEventListeners();
        this.populateContent();
        this.checkOnlineStatus();
        this.updateCurrentYear();
        this.hideLoading();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupOfflineSupport();
        this.setupProgressTracking();
    }

    setupData() {
        // Git commands data
        this.commands = [
            {
                name: 'git init',
                description: 'Initialize a new Git repository',
                example: 'git init',
                category: 'setup'
            },
            {
                name: 'git clone',
                description: 'Clone a repository from remote',
                example: 'git clone https://github.com/user/repo.git',
                category: 'setup'
            },
            {
                name: 'git add',
                description: 'Add files to staging area',
                example: 'git add . \n# or \ngit add filename.txt',
                category: 'basic'
            },
            {
                name: 'git commit',
                description: 'Commit staged changes',
                example: 'git commit -m "Your commit message"',
                category: 'basic'
            },
            {
                name: 'git push',
                description: 'Push commits to remote repository',
                example: 'git push origin main',
                category: 'remote'
            },
            {
                name: 'git pull',
                description: 'Pull latest changes from remote',
                example: 'git pull origin main',
                category: 'remote'
            },
            {
                name: 'git status',
                description: 'Check repository status',
                example: 'git status',
                category: 'basic'
            },
            {
                name: 'git log',
                description: 'View commit history',
                example: 'git log --oneline',
                category: 'basic'
            },
            {
                name: 'git branch',
                description: 'List, create, or delete branches',
                example: 'git branch \n# or \ngit branch new-feature',
                category: 'branching'
            },
            {
                name: 'git checkout',
                description: 'Switch branches or restore files',
                example: 'git checkout main \n# or \ngit checkout -b new-branch',
                category: 'branching'
            },
            {
                name: 'git merge',
                description: 'Merge branches',
                example: 'git merge feature-branch',
                category: 'branching'
            },
            {
                name: 'git diff',
                description: 'Show changes between commits',
                example: 'git diff \n# or \ngit diff HEAD~1',
                category: 'basic'
            },
            {
                name: 'git reset',
                description: 'Reset commits or staging area',
                example: 'git reset --soft HEAD~1',
                category: 'advanced'
            },
            {
                name: 'git rebase',
                description: 'Reapply commits on top of another base',
                example: 'git rebase main',
                category: 'advanced'
            }
        ];

        // Lessons data
        this.lessons.set('basics', [
            {
                id: 'what-is-git',
                title: 'What is Git?',
                description: 'Learn the fundamentals of version control and why Git is essential for developers.',
                duration: '5 min read',
                difficulty: 'Beginner',
                content: this.getWhatIsGitContent()
            },
            {
                id: 'installation',
                title: 'Installing Git',
                description: 'Step-by-step guide to install Git on Windows, macOS, and Linux.',
                duration: '10 min read',
                difficulty: 'Beginner',
                content: this.getInstallationContent()
            },
            {
                id: 'configuration',
                title: 'Git Configuration',
                description: 'Set up your Git environment with user details and preferences.',
                duration: '8 min read',
                difficulty: 'Beginner',
                content: this.getConfigurationContent()
            },
            {
                id: 'first-repo',
                title: 'Your First Repository',
                description: 'Create and initialize your first Git repository.',
                duration: '12 min read',
                difficulty: 'Beginner',
                content: this.getFirstRepoContent()
            }
        ]);

        this.lessons.set('github', [
            {
                id: 'github-basics',
                title: 'Getting Started with GitHub',
                description: 'Create your first repository and understand GitHub\'s interface.',
                duration: '15 min read',
                difficulty: 'Beginner',
                content: this.getGitHubBasicsContent()
            },
            {
                id: 'collaboration',
                title: 'Collaboration Workflow',
                description: 'Learn about pull requests, issues, and team collaboration.',
                duration: '20 min read',
                difficulty: 'Intermediate',
                content: this.getCollaborationContent()
            },
            {
                id: 'pages',
                title: 'GitHub Pages',
                description: 'Deploy your websites for free using GitHub Pages.',
                duration: '12 min read',
                difficulty: 'Intermediate',
                content: this.getPagesContent()
            },
            {
                id: 'actions',
                title: 'GitHub Actions',
                description: 'Automate your workflows with CI/CD pipelines.',
                duration: '25 min read',
                difficulty: 'Advanced',
                content: this.getActionsContent()
            }
        ]);

        this.lessons.set('advanced', [
            {
                id: 'git-workflows',
                title: 'Git Workflows',
                description: 'Learn industry-standard Git workflows like GitFlow and GitHub Flow.',
                duration: '18 min read',
                difficulty: 'Advanced',
                content: this.getWorkflowsContent()
            },
            {
                id: 'conflict-resolution',
                title: 'Merge Conflict Resolution',
                description: 'Master the art of resolving merge conflicts effectively.',
                duration: '15 min read',
                difficulty: 'Advanced',
                content: this.getConflictContent()
            },
            {
                id: 'git-hooks',
                title: 'Git Hooks',
                description: 'Automate tasks with Git hooks for better workflow.',
                duration: '20 min read',
                difficulty: 'Advanced',
                content: this.getHooksContent()
            }
        ]);
    }

    setupRouter() {
        window.router = {
            navigate: (path) => {
                window.location.hash = path;
                this.handleRoute();
            }
        };

        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const page = hash.substring(1) || 'home';

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show current page
        const currentPageEl = document.getElementById(`page-${page}`);
        if (currentPageEl) {
            currentPageEl.classList.add('active');
            this.currentPage = page;

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-route') === page);
            });

            // Update page title
            this.updatePageTitle(page);

            // Populate page content if needed
            this.populatePageContent(page);
        }
    }

    updatePageTitle(page) {
        const titles = {
            home: 'Git & GitHub Tutorial - Complete Professional Guide',
            basics: 'Git Basics - Professional Tutorial',
            commands: 'Essential Git Commands - Interactive Guide',
            github: 'GitHub Integration - Professional Tutorial',
            practice: 'Interactive Git Practice - Terminal Simulator',
            advanced: 'Advanced Git Topics - Professional Guide'
        };

        document.title = titles[page] || titles.home;
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

        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    setupPWA() {
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            if (installBtn) {
                installBtn.style.display = 'block';
                installBtn.addEventListener('click', () => {
                    installBtn.style.display = 'none';
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        deferredPrompt = null;
                    });
                });
            }
        });
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

         // Search functionality
         const searchInput = document.getElementById('commandSearch');
         if (searchInput) {
             searchInput.addEventListener('input', (e) => {
                 this.filterCommands(e.target.value);
             });
         }
       

        // Terminal simulator
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = e.target.value.trim();
                    if (command) {
                        this.executeCommand(command);
                        e.target.value = '';
                    }
                }
            });
        }

        // Modal events
        const modal = document.getElementById('lessonModal');
        const modalClose = document.querySelector('.modal-close');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Navigation links
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                router.navigate(`/${route}`);
            });
        });
    }

    populateContent() {
        this.populateCommands();
        this.setupTerminal();
    }

    populatePageContent(page) {
        if (page === 'basics' || page === 'github' || page === 'advanced') {
            this.populateLessons(page);
        }
    }

    populateLessons(category) {
        const lessonsContainer = document.getElementById(`${category}Lessons`);
        if (!lessonsContainer) return;

        const lessons = this.lessons.get(category) || [];
        lessonsContainer.innerHTML = lessons.map(lesson => `
            <div class="lesson-card" data-lesson="${lesson.id}">
                <div class="lesson-header">
                    <h3>${lesson.title}</h3>
                    <span class="difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                </div>
                <p>${lesson.description}</p>
                <div class="lesson-meta">
                    <span class="duration">📖 ${lesson.duration}</span>
                </div>
            </div>
        `).join('');

        // Add click events
        lessonsContainer.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                const lessonId = card.getAttribute('data-lesson');
                this.openLesson(lessonId, category);
            });
        });
    }

    populateCommands() {
        const commandGrid = document.getElementById('commandGrid');
        if (!commandGrid) return;

        commandGrid.innerHTML = this.commands.map(command => `
            <div class="command-card" data-category="${command.category}">
                <div class="command-header">
                    <div class="command-name">${command.name}</div>
                    <span class="command-category">${command.category}</span>
                </div>
                <div class="command-description">${command.description}</div>
                <div class="command-example"><code>${command.example}</code></div>
            </div>
        `).join('');
    }

    setupTerminal() {
        const terminalOutput = document.getElementById('terminalOutput');
        if (!terminalOutput) return;

        this.addToTerminal('🚀 Welcome to Git Terminal Simulator Pro!', 'system');
        this.addToTerminal('Try commands like: git init, git status, git add, git commit', 'system');
        this.addToTerminal('Type "help" for available commands or "clear" to clear screen', 'system');
        this.addToTerminal('', 'system');
    }

    executeCommand(command) {
        this.addToTerminal(`$ ${command}`, 'input');

        if (command === 'git init') {
            this.addToTerminal('✅ Initialized empty Git repository in ' + this.currentPath + '/.git/', 'success');
        } else if (command === 'git status') {
            this.addToTerminal('On branch main', 'output');
            this.addToTerminal('No commits yet', 'output');
            this.addToTerminal('nothing to commit (create/copy files and use "git add" to track)', 'output');
        } else if (command.startsWith('git add')) {
            this.addToTerminal('✅ Files staged for commit', 'success');
        } else if (command.startsWith('git commit')) {
            if (command.includes('-m')) {
                this.addToTerminal('✅ [main (root-commit) a1b2c3d] ' + (command.match(/-m "([^"]*)"/) || ['', 'Commit message'])[1], 'success');
                this.addToTerminal('1 file changed, 1 insertion(+)', 'output');
            } else {
                this.addToTerminal('❌ Aborting commit due to empty commit message.', 'error');
            }
        } else if (command === 'git log') {
            this.addToTerminal('commit a1b2c3d4e5f6789 (HEAD -> main)', 'output');
            this.addToTerminal('Author: You <you@example.com>', 'output');
            this.addToTerminal('Date: ' + new Date().toDateString(), 'output');
            this.addToTerminal('', 'output');
            this.addToTerminal('    Initial commit', 'output');
        } else if (command === 'clear') {
            document.getElementById('terminalOutput').innerHTML = '';
            return;
        } else if (command === 'help') {
            this.showHelp();
        } else {
            this.addToTerminal(`❌ Command not found: ${command}`, 'error');
            this.addToTerminal('Type "help" for available commands', 'hint');
        }

        this.addToTerminal('', 'output');
    }

    showHelp() {
        this.addToTerminal('📋 Available commands:', 'system');
        this.addToTerminal('', 'output');
        this.commands.slice(0, 10).forEach(cmd => {
            this.addToTerminal(`  ${cmd.name.padEnd(20)} - ${cmd.description}`, 'help');
        });
        this.addToTerminal('', 'output');
        this.addToTerminal('💡 Special commands: clear, help', 'hint');
    }

    addToTerminal(text, type) {
        const terminalOutput = document.getElementById('terminalOutput');
        if (!terminalOutput) return;

        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        line.textContent = text;

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    openLesson(lessonId, category) {
        const lessons = this.lessons.get(category) || [];
        const lesson = lessons.find(l => l.id === lessonId);

        if (lesson) {
            const modal = document.getElementById('lessonModal');
            const content = document.getElementById('lessonContent');

            content.innerHTML = `
                <div class="lesson-header">
                    <h1>${lesson.title}</h1>
                    <div class="lesson-meta">
                        <span class="duration">${lesson.duration}</span>
                        <span class="difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                    </div>
                </div>
                <div class="lesson-body">${lesson.content}</div>
            `;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('lessonModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    checkOnlineStatus() {
        const offlineStatus = document.getElementById('offlineStatus');

        const updateStatus = () => {
            if (navigator.onLine) {
                if (offlineStatus) offlineStatus.style.display = 'none';
            } else {
                if (offlineStatus) offlineStatus.style.display = 'block';
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
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

    updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('.current-year');
        yearElements.forEach(element => {
            element.textContent = currentYear;
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
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.lesson-card, .content-section, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupOfflineSupport() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    setupProgressTracking() {
        const lessonCards = document.querySelectorAll('.lesson-card');

        lessonCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const lessonId = `git-lesson-${index}`;
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
            const lessonId = `git-lesson-${index}`;
            if (viewedLessons.includes(lessonId)) {
                card.classList.add('viewed');
            }
        });
    }

    filterLessons(searchTerm) {
        const lessonCards = document.querySelectorAll('.lesson-card');

        lessonCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isMatch = title.includes(searchTerm.toLowerCase()) || 
                           description.includes(searchTerm.toLowerCase());

            card.style.display = isMatch ? 'block' : 'none';
        });
    }

    filterCommands(searchTerm) {
        const commandCards = document.querySelectorAll('.command-card');

        commandCards.forEach(card => {
            const commandName = card.querySelector('.command-name').textContent.toLowerCase();
            const commandDesc = card.querySelector('.command-description').textContent.toLowerCase();
    
            const isMatch = commandName.includes(searchTerm.toLowerCase()) || 
                            commandDesc.includes(searchTerm.toLowerCase());
            card.style.display = isMatch ? 'block' : 'none';
        });
    }

    // Content methods
    getWhatIsGitContent() {
        return `
            <h2>Understanding Version Control</h2>
            <p>Git is a distributed version control system that tracks changes in files and coordinates work on those files among multiple people. It's like having a time machine for your code!</p>

            <h3>Why Use Git?</h3>
            <ul>
                <li><strong>Track Changes:</strong> See exactly what changed, when, and who made the change</li>
                <li><strong>Collaboration:</strong> Multiple developers can work on the same project simultaneously</li>
                <li><strong>Branching:</strong> Create separate lines of development for different features</li>
                <li><strong>Backup:</strong> Your code history is preserved and distributed</li>
                <li><strong>Rollback:</strong> Easily revert to previous versions if something breaks</li>
            </ul>

            <div class="tip-box">
                <h4>💡 Pro Tip</h4>
                <p>Git is not just for code! You can use it to track changes in any text-based files including documentation, configuration files, and even this tutorial!</p>
            </div>
        `;
    }

    getInstallationContent() {
        return `
            <h2>Installing Git on Different Platforms</h2>

            <h3>Windows</h3>
            <ol>
                <li>Download Git from <a href="https://git-scm.com/download/win" target="_blank" rel="noopener">git-scm.com</a></li>
                <li>Run the installer (.exe file)</li>
                <li>Follow the installation wizard (default settings work fine)</li>
                <li>Open Command Prompt or Git Bash to verify: <code>git --version</code></li>
            </ol>

            <h3>macOS</h3>
            <ol>
                <li><strong>Option 1:</strong> Install Xcode Command Line Tools<br><code>xcode-select --install</code></li>
                <li><strong>Option 2:</strong> Use Homebrew<br><code>brew install git</code></li>
                <li><strong>Option 3:</strong> Download from <a href="https://git-scm.com/download/mac" target="_blank" rel="noopener">git-scm.com</a></li>
            </ol>

            <div class="code-block">
                <h4>Verify Installation</h4>
                <pre><code>git --version</code></pre>
                <p>You should see output like: <code>git version 2.34.1</code></p>
            </div>
        `;
    }

    getConfigurationContent() {
        return `
            <h2>Setting Up Git for First Use</h2>
            <p>Before you start using Git, you need to configure your identity. This information will be included in every commit you make.</p>

            <div class="code-block">
                <h3>Essential Configuration</h3>
                <pre><code># Set your name
git config --global user.name "Your Full Name"

# Set your email
git config --global user.email "your.email@example.com"</code></pre>
            </div>

            <div class="warning-box">
                <h4>⚠️ Important</h4>
                <p>Use the same email address for Git and GitHub to ensure your commits are properly attributed to your GitHub profile!</p>
            </div>
        `;
    }

    getFirstRepoContent() {
        return `
            <h2>Creating Your First Repository</h2>
            <p>Let's create your first Git repository and make your first commit!</p>

            <div class="step-by-step">
                <div class="step">
                    <h3>Step 1: Create a Project Folder</h3>
                    <pre><code>mkdir my-first-repo
cd my-first-repo</code></pre>
                </div>

                <div class="step">
                    <h3>Step 2: Initialize Git</h3>
                    <pre><code>git init</code></pre>
                </div>

                <div class="step">
                    <h3>Step 3: Create a File</h3>
                    <pre><code>echo "# My First Repository" > README.md</code></pre>
                </div>

                <div class="step">
                    <h3>Step 4: Add and Commit</h3>
                    <pre><code>git add README.md
git commit -m "Initial commit"</code></pre>
                </div>
            </div>

            <div class="success-box">
                <h4>🎉 Congratulations!</h4>
                <p>You've just created your first Git repository and made your first commit!</p>
            </div>
        `;
    }

    getGitHubBasicsContent() {
        return `
            <h2>What is GitHub?</h2>
            <p>GitHub is a cloud-based platform that uses Git for version control. It provides a web interface for Git repositories plus additional collaboration features.</p>

            <h3>Creating Your First Repository</h3>
            <ol>
                <li>Sign up at <a href="https://github.com" target="_blank" rel="noopener">github.com</a></li>
                <li>Click the "+" icon in the top-right corner</li>
                <li>Select "New repository"</li>
                <li>Enter a repository name</li>
                <li>Add a description (optional)</li>
                <li>Choose public or private</li>
                <li>Initialize with README (recommended)</li>
                <li>Click "Create repository"</li>
            </ol>
        `;
    }

    getCollaborationContent() {
        return `
            <h2>Working with Teams on GitHub</h2>
            <p>GitHub enables seamless collaboration through features like pull requests, code reviews, and issue tracking.</p>

            <h3>Fork and Pull Request Workflow</h3>
            <ol>
                <li><strong>Fork:</strong> Create your copy of someone else's repository</li>
                <li><strong>Clone:</strong> Download your fork to your local machine</li>
                <li><strong>Branch:</strong> Create a new branch for your feature</li>
                <li><strong>Code:</strong> Make your changes</li>
                <li><strong>Push:</strong> Push your branch to your fork</li>
                <li><strong>Pull Request:</strong> Propose your changes to the original repository</li>
            </ol>
        `;
    }

    getPagesContent() {
        return `
            <h2>Deploy Websites with GitHub Pages</h2>
            <p>GitHub Pages lets you host static websites directly from your GitHub repository for free!</p>

            <h3>Setting Up GitHub Pages</h3>
            <ol>
                <li>Go to your repository on GitHub</li>
                <li>Click on "Settings" tab</li>
                <li>Scroll down to "Pages" section</li>
                <li>Under "Source", select "Deploy from a branch"</li>
                <li>Choose your branch (usually "main") and folder ("/ (root)" or "/docs")</li>
                <li>Click "Save"</li>
            </ol>

            <p><strong>Your site will be available at:</strong><br>
            <code>https://username.github.io/repository-name</code></p>
        `;
    }

    getActionsContent() {
        return `
            <h2>Automate with GitHub Actions</h2>
            <p>GitHub Actions is a powerful CI/CD platform that allows you to automate your software workflows.</p>

            <h3>Basic Workflow Example</h3>
            <pre><code># .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test</code></pre>
        `;
    }

    getWorkflowsContent() {
        return `
            <h2>Git Workflows</h2>
            <p>Learn industry-standard workflows for managing code with Git.</p>

            <h3>GitHub Flow</h3>
            <ol>
                <li>Create a branch</li>
                <li>Add commits</li>
                <li>Open a pull request</li>
                <li>Discuss and review</li>
                <li>Deploy and test</li>
                <li>Merge</li>
            </ol>
        `;
    }

    getConflictContent() {
        return `
            <h2>Resolving Merge Conflicts</h2>
            <p>Learn how to handle merge conflicts like a pro.</p>

            <h3>Common Conflict Scenarios</h3>
            <ul>
                <li>Two people edit the same line</li>
                <li>One person deletes a file while another edits it</li>
                <li>Binary file conflicts</li>
            </ul>
        `;
    }

    getHooksContent() {
        return `
            <h2>Git Hooks</h2>
            <p>Automate tasks with Git hooks to enforce standards and improve workflow.</p>

            <h3>Common Hook Types</h3>
            <ul>
                <li><strong>pre-commit:</strong> Run before each commit</li>
                <li><strong>pre-push:</strong> Run before each push</li>
                <li><strong>post-receive:</strong> Run after receiving a push</li>
            </ul>
        `;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GitTutorialApp();
});