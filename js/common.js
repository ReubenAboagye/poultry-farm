class SecurityManager {
    static checkAuth() {
        const isLoggedIn = localStorage.getItem(AuthManager.AUTH_KEYS.IS_LOGGED_IN);
        const sessionToken = localStorage.getItem(AuthManager.AUTH_KEYS.SESSION_TOKEN);
        
        if (!isLoggedIn || !sessionToken) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    static validateSession() {
        const loginTime = new Date(localStorage.getItem(AuthManager.AUTH_KEYS.LOGIN_TIME));
        const currentTime = new Date();
        const sessionDuration = currentTime - loginTime;
        
        // Auto logout after 8 hours
        if (sessionDuration > 8 * 60 * 60 * 1000) {
            const auth = new AuthManager();
            auth.handleLogout();
            return false;
        }
        return true;
    }
}

class DataManager {
    static encryptData(data) {
        // Basic encoding for example - use proper encryption in production
        return btoa(JSON.stringify(data));
    }

    static decryptData(encryptedData) {
        // Basic decoding for example - use proper decryption in production
        return JSON.parse(atob(encryptedData));
    }

    static saveData(key, data) {
        const encryptedData = this.encryptData(data);
        localStorage.setItem(key, encryptedData);
    }

    static getData(key) {
        const encryptedData = localStorage.getItem(key);
        return encryptedData ? this.decryptData(encryptedData) : null;
    }
} 