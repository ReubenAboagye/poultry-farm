class DialogManager {
    static async confirm(title, message) {
        return new Promise((resolve) => {
            const dialog = document.getElementById('confirmDialog');
            const titleEl = document.getElementById('confirmTitle');
            const messageEl = document.getElementById('confirmMessage');
            const confirmBtn = document.getElementById('confirmOk');
            const cancelBtn = document.getElementById('confirmCancel');

            titleEl.textContent = title;
            messageEl.textContent = message;

            const handleConfirm = () => {
                dialog.classList.remove('active');
                cleanup();
                resolve(true);
            };

            const handleCancel = () => {
                dialog.classList.remove('active');
                cleanup();
                resolve(false);
            };

            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
            };

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);

            dialog.classList.add('active');
        });
    }
}

class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        this.overlay = document.querySelector('.sidebar-overlay');
        this.init();
    }

    init() {
        if (this.menuToggle && this.sidebar) {
            this.menuToggle.addEventListener('click', () => this.toggleSidebar());
            this.overlay?.addEventListener('click', () => this.closeSidebar());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeSidebar();
            });
        }
    }

    toggleSidebar() {
        this.sidebar?.classList.toggle('sidebar-open');
        this.menuToggle?.classList.toggle('active');
        this.overlay?.classList.toggle('active');
        
        // Update ARIA attributes
        const isOpen = this.sidebar?.classList.contains('sidebar-open');
        this.menuToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        this.sidebar?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    closeSidebar() {
        this.sidebar?.classList.remove('sidebar-open');
        this.menuToggle?.classList.remove('active');
        this.overlay?.classList.remove('active');
        
        // Update ARIA attributes
        this.menuToggle?.setAttribute('aria-expanded', 'false');
        this.sidebar?.setAttribute('aria-hidden', 'true');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});

// Mobile Detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Update print buttons based on device
function updatePrintButtons() {
    const printButtons = document.querySelectorAll('[id$="PrintBtn"]');
    const downloadButtons = document.querySelectorAll('[id$="downloadPdfBtn"]');
    
    if (isMobileDevice()) {
        // Hide print buttons on mobile
        printButtons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
        // Show download buttons on mobile
        downloadButtons.forEach(btn => {
            if (btn) btn.style.display = 'inline-flex';
        });
    } else {
        // Show print buttons on desktop
        printButtons.forEach(btn => {
            if (btn) btn.style.display = 'inline-flex';
        });
        // Hide download buttons on desktop if print is preferred
        downloadButtons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
    }
}

// Call this when DOM loads
document.addEventListener('DOMContentLoaded', updatePrintButtons);
