class DashboardManager {
    constructor() {
        this.activitiesPerPage = 5;
        this.currentPage = 1;
        this.activities = [];
        this.initializeDashboard();
        this.setupRealTimeUpdates();
        this.loadInitialData();
    }

    initializeDashboard() {
        this.displayUsername();
        this.loadStats();
        this.loadActivities();
        this.setupPagination();
    }

    setupRealTimeUpdates() {
        // Update stats every minute
        setInterval(() => this.loadStats(), 60000);
        
        // Listen for localStorage changes
        window.addEventListener('storage', (e) => {
            if (['salesData', 'fowlData', 'mortalityData'].includes(e.key)) {
                this.loadStats();
                this.loadActivities();
            }
        });

        // Add local event listener for same-tab updates
        document.addEventListener('dataUpdated', () => {
            this.loadStats();
            this.loadActivities();
        });
    }

    loadStats() {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Calculate egg sales stats
            const eggSalesStats = this.calculateEggSalesStats(today, yesterday);
            this.updateStatCard(
                "Today's Egg Sales", 
                `${eggSalesStats.today.toFixed(1)} dozens`,
                `${eggSalesStats.change > 0 ? '+' : ''}${eggSalesStats.change.toFixed(1)} dozens from yesterday`
            );

            // Calculate revenue stats
            const revenueStats = this.calculateRevenueStats();
            this.updateStatCard(
                "Monthly Revenue",
                `GH₵ ${revenueStats.current.toFixed(2)}`,
                `${revenueStats.percentageChange > 0 ? '+' : ''}${revenueStats.percentageChange.toFixed(1)}% from last month`
            );

            // Calculate mortality rate
            const mortalityRate = this.calculateMortalityRate();
            this.updateStatCard(
                "Mortality Rate",
                `${mortalityRate.toFixed(1)}%`,
                "Last 30 days"
            );

            // Calculate total fowl
            const fowlStats = this.calculateFowlStats();
            this.updateStatCard(
                "Total Fowl",
                fowlStats.total.toString(),
                `${fowlStats.change > 0 ? '+' : ''}${fowlStats.change} from last month`
            );
        } catch (error) {
            console.error('Error loading stats:', error);
            // Update UI to show error state
            document.querySelectorAll('.stats-card').forEach(card => {
                const valueElement = card.querySelector('.stats-value');
                const changeElement = card.querySelector('.stats-change, .stats-info');
                if (valueElement) valueElement.textContent = 'Error';
                if (changeElement && !changeElement.classList.contains('stats-info')) {
                    changeElement.textContent = 'Failed to load data';
                    changeElement.classList.add('negative');
                }
            });
        }
    }

    calculateEggSalesStats(today, yesterday) {
        const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        
        const todaySales = salesData
            .filter(sale => new Date(sale.date).toDateString() === today.toDateString())
            .reduce((total, sale) => total + sale.quantity, 0);

        const yesterdaySales = salesData
            .filter(sale => new Date(sale.date).toDateString() === yesterday.toDateString())
            .reduce((total, sale) => total + sale.quantity, 0);

        return {
            today: todaySales,
            yesterday: yesterdaySales,
            change: todaySales - yesterdaySales
        };
    }

    calculateRevenueStats() {
        const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Current month revenue
        const currentMonthRevenue = salesData
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === currentMonth && 
                       saleDate.getFullYear() === currentYear;
            })
            .reduce((total, sale) => total + (sale.quantity * sale.pricePerDozen), 0);

        // Last month revenue
        const lastMonthRevenue = salesData
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === (currentMonth - 1) && 
                       saleDate.getFullYear() === currentYear;
            })
            .reduce((total, sale) => total + (sale.quantity * sale.pricePerDozen), 0);

        const percentageChange = lastMonthRevenue === 0 ? 0 : 
            ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

        return {
            current: currentMonthRevenue,
            last: lastMonthRevenue,
            percentageChange: percentageChange
        };
    }

    calculateMortalityRate() {
        const mortalityData = JSON.parse(localStorage.getItem('mortalityData')) || [];
        const fowlData = JSON.parse(localStorage.getItem('fowlData')) || [];
        
        // Get date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Calculate total fowl population
        const totalFowl = fowlData
            .filter(fowl => new Date(fowl.dateAcquired) <= new Date())
            .reduce((total, fowl) => total + fowl.quantity, 0);

        // Calculate deaths in last 30 days
        const recentDeaths = mortalityData
            .filter(record => new Date(record.date) >= thirtyDaysAgo)
            .reduce((total, record) => total + record.quantity, 0);

        // Calculate mortality rate as percentage
        return totalFowl === 0 ? 0 : (recentDeaths / totalFowl) * 100;
    }

    calculateFowlStats() {
        const fowlData = JSON.parse(localStorage.getItem('fowlData')) || [];
        const mortalityData = JSON.parse(localStorage.getItem('mortalityData')) || [];
        
        const currentDate = new Date();
        const lastMonth = new Date(currentDate);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // Calculate total current fowl
        const totalFowl = fowlData
            .filter(fowl => new Date(fowl.dateAcquired) <= currentDate)
            .reduce((total, fowl) => total + fowl.quantity, 0);

        // Calculate total fowl last month
        const lastMonthFowl = fowlData
            .filter(fowl => new Date(fowl.dateAcquired) <= lastMonth)
            .reduce((total, fowl) => total + fowl.quantity, 0);

        // Calculate change
        const change = totalFowl - lastMonthFowl;

        return {
            total: totalFowl,
            lastMonth: lastMonthFowl,
            change: change
        };
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    updateStatCard(title, value, change) {
        const cards = document.querySelectorAll('.stats-card');
        const card = Array.from(cards).find(card => card.querySelector('h3').textContent === title);
        
        if (card) {
            const valueElement = card.querySelector('.stats-value');
            const changeElement = card.querySelector('.stats-change, .stats-info');
            
            if (valueElement && value !== valueElement.textContent) {
                // Add animation class
                valueElement.classList.add('value-update');
                valueElement.textContent = value;
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    valueElement.classList.remove('value-update');
                }, 300);
            }
            
            if (changeElement) {
                changeElement.textContent = change;
                
                // Update change indicator classes
                changeElement.classList.remove('positive', 'negative', 'neutral');
                if (change.includes('+')) {
                    changeElement.classList.add('positive');
                } else if (change.includes('-')) {
                    changeElement.classList.add('negative');
                } else {
                    changeElement.classList.add('neutral');
                }
            }
        }
    }

    loadActivities() {
        // Get all activities
        this.activities = this.getAllActivities();
        this.displayActivities();
    }

    displayActivities() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // Clear existing activities
        activityList.innerHTML = '';

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.activitiesPerPage;
        const endIndex = startIndex + this.activitiesPerPage;
        const activitiesToShow = this.activities.slice(startIndex, endIndex);

        // Display activities
        activitiesToShow.forEach(activity => {
            const activityItem = this.createActivityItem(activity);
            activityList.appendChild(activityItem);
        });

        this.updatePaginationControls();
    }

    setupPagination() {
        const totalPages = Math.ceil(this.activities.length / this.activitiesPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (pagination) {
            pagination.innerHTML = `
                <button class="prev-btn" ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span class="current-page">${this.currentPage} of ${totalPages}</span>
                <button class="next-btn" ${this.currentPage === totalPages ? 'disabled' : ''}>Next</button>
            `;

            // Add event listeners
            pagination.querySelector('.prev-btn').addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayActivities();
                }
            });

            pagination.querySelector('.next-btn').addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.displayActivities();
                }
            });
        }
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(this.activities.length / this.activitiesPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (pagination) {
            const prevBtn = pagination.querySelector('.prev-btn');
            const nextBtn = pagination.querySelector('.next-btn');
            const pageInfo = pagination.querySelector('.current-page');

            prevBtn.disabled = this.currentPage === 1;
            nextBtn.disabled = this.currentPage === totalPages;
            pageInfo.textContent = `${this.currentPage} of ${totalPages}`;
        }
    }

    displayUsername() {
        const usernameElement = document.getElementById('username');
        const username = localStorage.getItem('username') || 'User';
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    }

    getAllActivities() {
        const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        const fowlData = JSON.parse(localStorage.getItem('fowlData')) || [];
        const mortalityData = JSON.parse(localStorage.getItem('mortalityData')) || [];

        const activities = [
            ...salesData.map(sale => ({
                type: 'sale',
                date: new Date(sale.date),
                details: `Sold ${sale.quantity} dozens of eggs for GH₵${(sale.quantity * sale.pricePerDozen).toFixed(2)}`,
                icon: '🥚'
            })),
            ...fowlData.map(fowl => ({
                type: 'fowl',
                date: new Date(fowl.dateAcquired),
                details: `Added ${fowl.quantity} ${fowl.category} fowls`,
                icon: '🐔'
            })),
            ...mortalityData.map(record => ({
                type: 'mortality',
                date: new Date(record.date),
                details: `Recorded ${record.quantity} mortalities`,
                icon: '📋'
            }))
        ];

        // Sort by date, most recent first
        return activities.sort((a, b) => b.date - a.date);
    }

    createActivityItem(activity) {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <div class="activity-details">
                <p>${activity.details}</p>
                <span class="activity-time">${this.getTimeAgo(activity.date)}</span>
            </div>
        `;
        return div;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `${interval} years ago`;
        if (interval === 1) return '1 year ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} months ago`;
        if (interval === 1) return '1 month ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} days ago`;
        if (interval === 1) return '1 day ago';
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        if (interval === 1) return '1 hour ago';
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} minutes ago`;
        if (interval === 1) return '1 minute ago';
        
        return 'Just now';
    }

    loadInitialData() {
        // Initialize with empty data if none exists
        if (!localStorage.getItem('salesData')) {
            localStorage.setItem('salesData', '[]');
        }
        if (!localStorage.getItem('fowlData')) {
            localStorage.setItem('fowlData', '[]');
        }
        if (!localStorage.getItem('mortalityData')) {
            localStorage.setItem('mortalityData', '[]');
        }
    }

    dispatchDataUpdate() {
        document.dispatchEvent(new CustomEvent('dataUpdated'));
    }
}

// Add CSS for value update animation
const style = document.createElement('style');
style.textContent = `
    .value-update {
        animation: valueUpdate 0.3s ease-in-out;
    }

    @keyframes valueUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Make dashboardManager globally accessible for pagination buttons
let dashboardManager;

document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
});