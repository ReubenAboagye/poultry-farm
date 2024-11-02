class MortalityManager {
    constructor() {
        this.mortalityData = JSON.parse(localStorage.getItem('mortalityData')) || [];
        this.fowlData = JSON.parse(localStorage.getItem('fowlData')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBatchOptions();
        this.loadMortalityData();
        this.updateStatistics();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Add Mortality Button
        document.getElementById('addMortalityBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Form Submit
        document.getElementById('mortalityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMortalitySubmit();
        });

        // Close Modal
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.hideModal();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideModal();
        });

        // Filters
        document.getElementById('dateFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('batchFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('causeFilter').addEventListener('change', () => this.applyFilters());
    }

    setupNavigation() {
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            const confirmed = await DialogManager.confirm(
                "Confirm Logout",
                "Are you sure you want to log out?"
            );
            
            if (confirmed) {
                localStorage.clear();
                window.location.href = 'index.html';
            }
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    loadBatchOptions() {
        const batchSelect = document.getElementById('batchId');
        const batchFilter = document.getElementById('batchFilter');
        
        // Get unique batch IDs from fowl data
        const batches = [...new Set(this.fowlData.map(fowl => fowl.batchId))];
        
        const batchOptions = batches.map(batch => 
            `<option value="${batch}">Batch ${batch}</option>`
        ).join('');

        batchSelect.innerHTML = `<option value="">Select Batch</option>${batchOptions}`;
        batchFilter.innerHTML = `<option value="">All Batches</option>${batchOptions}`;
    }

    showModal(mortalityData = null) {
        const modal = document.getElementById('mortalityModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (mortalityData) {
            modalTitle.textContent = 'Edit Mortality Record';
            this.populateForm(mortalityData);
        } else {
            modalTitle.textContent = 'Record Mortality';
            document.getElementById('mortalityForm').reset();
            document.getElementById('mortalityDate').value = new Date().toISOString().split('T')[0];
        }
        
        modal.classList.add('active');
    }

    hideModal() {
        document.getElementById('mortalityModal').classList.remove('active');
    }

    handleMortalitySubmit() {
        const formData = {
            id: Date.now().toString(),
            batchId: document.getElementById('batchId').value,
            numberOfBirds: parseInt(document.getElementById('numberOfBirds').value),
            date: document.getElementById('mortalityDate').value,
            cause: document.getElementById('cause').value,
            notes: document.getElementById('notes').value
        };

        this.mortalityData.push(formData);
        this.saveMortalityData();
        this.loadMortalityData();
        this.updateStatistics();
        this.hideModal();
    }

    saveMortalityData() {
        localStorage.setItem('mortalityData', JSON.stringify(this.mortalityData));
    }

    loadMortalityData() {
        const tableBody = document.getElementById('mortalityTableBody');
        const filteredData = this.getFilteredData();

        tableBody.innerHTML = filteredData.map(record => `
            <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>Batch ${record.batchId}</td>
                <td>${record.numberOfBirds}</td>
                <td>
                    <span class="cause-label cause-${record.cause}">
                        ${record.cause.charAt(0).toUpperCase() + record.cause.slice(1)}
                    </span>
                </td>
                <td>${record.notes || '-'}</td>
                <td class="record-actions">
                    <button onclick="mortalityManager.editRecord('${record.id}')">✏️</button>
                    <button onclick="mortalityManager.deleteRecord('${record.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredData() {
        let filteredData = [...this.mortalityData];
        const dateFilter = document.getElementById('dateFilter').value;
        const batchFilter = document.getElementById('batchFilter').value;
        const causeFilter = document.getElementById('causeFilter').value;

        if (dateFilter) {
            filteredData = filteredData.filter(record => 
                record.date === dateFilter
            );
        }

        if (batchFilter) {
            filteredData = filteredData.filter(record => 
                record.batchId === batchFilter
            );
        }

        if (causeFilter) {
            filteredData = filteredData.filter(record => 
                record.cause === causeFilter
            );
        }

        return filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    updateStatistics() {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthStart = new Date();
        monthStart.setDate(1);

        // Today's mortality
        const todayMortality = this.mortalityData
            .filter(record => record.date === today)
            .reduce((sum, record) => sum + record.numberOfBirds, 0);

        // Weekly mortality rate
        const weeklyMortality = this.mortalityData
            .filter(record => new Date(record.date) >= weekAgo)
            .reduce((sum, record) => sum + record.numberOfBirds, 0);

        const totalBirds = this.fowlData.reduce((sum, fowl) => sum + fowl.quantity, 0);
        const weeklyRate = totalBirds > 0 ? (weeklyMortality / totalBirds * 100).toFixed(2) : 0;

        // Monthly total
        const monthlyTotal = this.mortalityData
            .filter(record => new Date(record.date) >= monthStart)
            .reduce((sum, record) => sum + record.numberOfBirds, 0);

        document.getElementById('todayMortality').textContent = todayMortality;
        document.getElementById('weeklyRate').textContent = `${weeklyRate}%`;
        document.getElementById('monthlyTotal').textContent = monthlyTotal;
    }

    editRecord(recordId) {
        const record = this.mortalityData.find(r => r.id === recordId);
        if (record) {
            this.showModal(record);
        }
    }

    async deleteRecord(recordId) {
        const confirmed = await DialogManager.confirm(
            "Delete Mortality Record",
            "Are you sure you want to delete this mortality record? This action cannot be undone."
        );
        
        if (confirmed) {
            this.mortalityData = this.mortalityData.filter(record => record.id !== recordId);
            this.saveMortalityData();
            this.loadMortalityData();
            this.updateStatistics();
        }
    }

    populateForm(record) {
        document.getElementById('batchId').value = record.batchId;
        document.getElementById('numberOfBirds').value = record.numberOfBirds;
        document.getElementById('mortalityDate').value = record.date;
        document.getElementById('cause').value = record.cause;
        document.getElementById('notes').value = record.notes || '';
    }
}

// Initialize mortality manager when DOM is loaded
let mortalityManager;
document.addEventListener('DOMContentLoaded', () => {
    mortalityManager = new MortalityManager();
}); 