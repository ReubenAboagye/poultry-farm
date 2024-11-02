class AuthManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorMessage = document.getElementById('error-message');
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        this.setLoading(true);
        this.clearError();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (this.validateCredentials(username, password)) {
                this.loginSuccess(username);
            } else {
                throw new Error('Invalid username or password');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    validateCredentials(username, password) {
        // For demo purposes - replace with actual authentication
        return username === 'reuben' && password === '123test';
    }

    loginSuccess(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', new Date().toISOString());
        localStorage.setItem('sessionToken', this.generateSessionToken());
        window.location.href = 'dashboard.html';
    }

    logout() {
        // Only clear authentication-related data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('lastLoginTime');
        
        // Redirect to login page
        window.location.href = 'index.html';
    }

    generateSessionToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    setLoading(isLoading) {
        this.form.classList.toggle('form-loading', isLoading);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = isLoading;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    clearError() {
        this.errorMessage.textContent = '';
        this.errorMessage.style.display = 'none';
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new AuthManager()); 