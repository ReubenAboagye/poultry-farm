class FowlManager {
    constructor() {
        this.fowlData = JSON.parse(localStorage.getItem('fowlData')) || [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFowlList();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Add Fowl Button
        document.getElementById('addFowlBtn').addEventListener('click', () => {
            this.currentEditId = null;
            this.showModal();
        });

        // Form Submit
        document.getElementById('fowlForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFowlSubmit();
        });

        // Close Modal
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.hideModal();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideModal();
        });

        // Search and Filters
        document.getElementById('searchFowl').addEventListener('input', () => this.applyFilters());
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('ageFilter').addEventListener('change', () => this.applyFilters());

        // Add Print All button listener
        document.getElementById('printAllBtn').addEventListener('click', () => {
            this.printAllRecords();
        });
    }

    showModal(fowlData = null) {
        const modal = document.getElementById('fowlModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('fowlForm');
        
        if (fowlData) {
            modalTitle.textContent = 'Edit Fowl';
            this.currentEditId = fowlData.id;
            this.populateForm(fowlData);
        } else {
            modalTitle.textContent = 'Add New Fowl';
            this.currentEditId = null;
            form.reset();
            document.getElementById('dateAcquired').valueAsDate = new Date();
        }
        
        modal.classList.add('active');
    }

    hideModal() {
        document.getElementById('fowlModal').classList.remove('active');
        this.currentEditId = null;
    }

    handleFowlSubmit() {
        const formData = {
            id: this.currentEditId || Date.now().toString(),
            batchId: document.getElementById('batchId').value,
            category: document.getElementById('category').value,
            quantity: parseInt(document.getElementById('quantity').value),
            dateAcquired: document.getElementById('dateAcquired').value,
            notes: document.getElementById('notes').value
        };

        if (this.currentEditId) {
            this.fowlData = this.fowlData.map(fowl => 
                fowl.id === this.currentEditId ? formData : fowl
            );
        } else {
            this.fowlData.push(formData);
        }

        this.saveFowlData();
        this.loadFowlList();
        this.hideModal();
    }

    populateForm(fowl) {
        document.getElementById('batchId').value = fowl.batchId;
        document.getElementById('category').value = fowl.category;
        document.getElementById('quantity').value = fowl.quantity;
        document.getElementById('dateAcquired').value = fowl.dateAcquired;
        document.getElementById('notes').value = fowl.notes || '';
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchFowl').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const ageFilter = document.getElementById('ageFilter').value;

        let filteredData = this.fowlData.filter(fowl => {
            const matchesSearch = fowl.batchId.toLowerCase().includes(searchTerm) ||
                                fowl.category.toLowerCase().includes(searchTerm) ||
                                (fowl.notes && fowl.notes.toLowerCase().includes(searchTerm));

            const matchesCategory = !categoryFilter || fowl.category === categoryFilter;

            const ageInWeeks = this.calculateAgeInWeeks(fowl.dateAcquired);
            const matchesAge = !ageFilter || this.isInAgeRange(ageInWeeks, ageFilter);

            return matchesSearch && matchesCategory && matchesAge;
        });

        this.renderFowlList(filteredData);
    }

    calculateAgeInWeeks(dateAcquired) {
        const acquired = new Date(dateAcquired);
        const now = new Date();
        const diffTime = Math.abs(now - acquired);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    }

    isInAgeRange(weeks, range) {
        switch (range) {
            case '0-12': return weeks <= 12;
            case '13-24': return weeks > 12 && weeks <= 24;
            case '25+': return weeks > 24;
            default: return true;
        }
    }

    renderFowlList(data) {
        const fowlList = document.getElementById('fowlList');
        fowlList.innerHTML = data.map(fowl => `
            <div class="fowl-card">
                <div class="fowl-header">
                    <h3>Batch ID: ${fowl.batchId}</h3>
                    <div class="fowl-actions">
                        <button onclick="fowlManager.editFowl('${fowl.id}')" title="Edit">✏️</button>
                        <button onclick="fowlManager.deleteFowl('${fowl.id}')" title="Delete">🗑️</button>
                        <button onclick="fowlManager.printFowlRecord('${fowl.id}')" title="Print Record">🖨️</button>
                    </div>
                </div>
                <div class="fowl-details">
                    <p><strong>Category:</strong> ${fowl.category}</p>
                    <p><strong>Quantity:</strong> ${fowl.quantity}</p>
                    <p><strong>Date Acquired:</strong> ${new Date(fowl.dateAcquired).toLocaleDateString()}</p>
                    <p><strong>Age:</strong> ${this.calculateAgeInWeeks(fowl.dateAcquired)} weeks</p>
                    ${fowl.notes ? `<p><strong>Notes:</strong> ${fowl.notes}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    async printFowlRecord(fowlId) {
        const fowl = this.fowlData.find(f => f.id === fowlId);
        if (!fowl) return;

        const printContent = `
            <div class="print-content">
                <div class="print-header">
                    <h1>Fowl Record</h1>
                    <div class="company-info">
                        <p>Poultry Farm Management System</p>
                        <p>123 Farm Road, Agricultural District</p>
                        <p>Generated: ${new Date().toLocaleString()}</p>
                    </div>
                </div>

                <div class="fowl-record-details">
                    <table>
                        <tr>
                            <th>Batch ID</th>
                            <td>${fowl.batchId}</td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>${fowl.category}</td>
                        </tr>
                        <tr>
                            <th>Quantity</th>
                            <td>${fowl.quantity}</td>
                        </tr>
                        <tr>
                            <th>Date Acquired</th>
                            <td>${new Date(fowl.dateAcquired).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th>Current Age</th>
                            <td>${this.calculateAgeInWeeks(fowl.dateAcquired)} weeks</td>
                        </tr>
                        ${fowl.notes ? `
                        <tr>
                            <th>Notes</th>
                            <td>${fowl.notes}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>

                <div class="watermark">
                    Powered by GenTech Solutions
                </div>

                <div class="print-footer">
                    <p>Printed by: ${localStorage.getItem('username') || 'Admin'}</p>
                    <p>© 2024 Poultry Farm Management System</p>
                </div>
            </div>
        `;

        const contentContainer = document.querySelector('.content-container');
        const originalContent = contentContainer.innerHTML;
        contentContainer.innerHTML = printContent;

        window.print();

        contentContainer.innerHTML = originalContent;
        this.loadFowlList();
    }

    saveFowlData() {
        localStorage.setItem('fowlData', JSON.stringify(this.fowlData));
    }

    loadFowlList() {
        const fowlList = document.getElementById('fowlList');
        fowlList.innerHTML = this.fowlData.map(fowl => this.createFowlCard(fowl)).join('');
    }

    createFowlCard(fowl) {
        return `
            <div class="fowl-card">
                <div class="fowl-header">
                    <div class="fowl-title">Batch ${fowl.batchId}</div>
                    <span class="fowl-category category-${fowl.category}">${fowl.category}</span>
                </div>
                <div class="fowl-details">
                    <div class="fowl-detail-item">
                        <span>Quantity:</span>
                        <span>${fowl.quantity}</span>
                    </div>
                    <div class="fowl-detail-item">
                        <span>Date Acquired:</span>
                        <span>${new Date(fowl.dateAcquired).toLocaleDateString()}</span>
                    </div>
                    <div class="fowl-detail-item">
                        <span>Age:</span>
                        <span>${this.calculateAge(fowl.dateAcquired)} weeks</span>
                    </div>
                </div>
                <div class="fowl-actions">
                    <button class="btn btn-outline" onclick="fowlManager.editFowl('${fowl.id}')">
                        Edit
                    </button>
                    <button class="btn btn-outline" onclick="fowlManager.deleteFowl('${fowl.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    calculateAge(dateAcquired) {
        const acquired = new Date(dateAcquired);
        const today = new Date();
        const diffTime = Math.abs(today - acquired);
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return diffWeeks;
    }

    handleSearch(searchTerm) {
        // Implementation for search functionality
    }

    editFowl(fowlId) {
        const fowl = this.fowlData.find(f => f.id === fowlId);
        if (fowl) {
            this.showModal(fowl);
        }
    }

    async deleteFowl(fowlId) {
        const confirmed = await DialogManager.confirm(
            "Delete Fowl Record",
            "Are you sure you want to delete this fowl record? This action cannot be undone."
        );
        
        if (confirmed) {
            this.fowlData = this.fowlData.filter(f => f.id !== fowlId);
            this.saveFowlData();
            this.loadFowlList();
        }
    }

    setupNavigation() {
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    async printAllRecords() {
        const printContent = `
            <div class="print-content">
                <div class="print-header">
                    <h1>Fowl Management Records</h1>
                    <div class="company-info">
                        <p>Poultry Farm Management System</p>
                        <p>123 Farm Road, Agricultural District</p>
                        <p>Phone: +233 123 456 789</p>
                    </div>
                </div>

                <div class="record-info">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Generated By:</strong> ${localStorage.getItem('username') || 'Admin'}</p>
                    <p><strong>Total Records:</strong> ${this.fowlData.length}</p>
                </div>

                <div class="fowl-records-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Batch ID</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Date Acquired</th>
                                <th>Age (Weeks)</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.fowlData.map(fowl => `
                                <tr>
                                    <td>${fowl.batchId}</td>
                                    <td>${fowl.category}</td>
                                    <td>${fowl.quantity}</td>
                                    <td>${new Date(fowl.dateAcquired).toLocaleDateString()}</td>
                                    <td>${this.calculateAge(fowl.dateAcquired)}</td>
                                    <td>${fowl.notes || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="print-footer">
                    <p>Powered by GenTech Solutions</p>
                    <p>© 2024 Poultry Farm Management System</p>
                </div>
            </div>
        `;

        const contentContainer = document.querySelector('.content-container');
        const originalContent = contentContainer.innerHTML;
        contentContainer.innerHTML = printContent;

        window.print();

        contentContainer.innerHTML = originalContent;
        this.loadFowlList();
    }
}

// Initialize fowl manager when DOM is loaded
let fowlManager;
document.addEventListener('DOMContentLoaded', () => {
    fowlManager = new FowlManager();
}); 