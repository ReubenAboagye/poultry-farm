class DataManager {
    static STORAGE_KEY_PREFIX = 'poultryfarm_';
    static LAST_BACKUP_KEY = 'lastBackupDate';
    
    static init() {
        this.updateStorageIndicator();
        this.setupEventListeners();
        this.checkAutoBackupNeeded();
    }

    static updateStorageIndicator() {
        const storage = this.checkStorageSpace();
        const storageBar = document.getElementById('storageUsed');
        const storageText = document.getElementById('storageText');
        
        if (storageBar && storageText) {
            storageBar.style.width = `${storage.percentUsed}%`;
            storageBar.className = 'storage-used ' + this.getStorageClass(storage.percentUsed);
            
            storageText.textContent = `${storage.percentUsed.toFixed(1)}% used of ${(this.MAX_STORAGE_SIZE / 1024 / 1024).toFixed(1)}MB`;
            
            this.updateLastBackupInfo();
        }
    }

    static getStorageClass(percentage) {
        if (percentage > 90) return 'danger';
        if (percentage > 70) return 'warning';
        return '';
    }

    static updateLastBackupInfo() {
        const lastBackup = localStorage.getItem(this.LAST_BACKUP_KEY);
        const infoElement = document.getElementById('lastBackupInfo');
        
        if (infoElement) {
            if (lastBackup) {
                const date = new Date(lastBackup);
                infoElement.textContent = `Last backup: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            } else {
                infoElement.textContent = 'No backup created yet';
            }
        }
    }

    static async performBackup() {
        try {
            await this.exportDataToFile();
            localStorage.setItem(this.LAST_BACKUP_KEY, new Date().toISOString());
            this.updateLastBackupInfo();
            alert('Backup created successfully!');
        } catch (error) {
            console.error('Backup failed:', error);
            alert('Failed to create backup. Please try again.');
        }
    }

    static setupEventListeners() {
        const backupBtn = document.getElementById('backupBtn');
        const restoreBtn = document.getElementById('restoreBtn');
        const restoreInput = document.getElementById('restoreInput');

        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.performBackup());
        }

        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => restoreInput.click());
        }

        if (restoreInput) {
            restoreInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    const confirmed = confirm('Restoring data will merge with existing records. Continue?');
                    if (confirmed) {
                        const success = await this.importDataFromFile(e.target.files[0]);
                        if (success) {
                            alert('Data restored successfully!');
                            window.location.reload();
                        } else {
                            alert('Failed to restore data. Please check the backup file.');
                        }
                    }
                }
            });
        }
    }

    // ... (keep all the previous methods from the earlier code) ...
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
}); 