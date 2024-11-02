class SalesManager {
    constructor() {
        this.salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSalesData();
        this.updateSummary();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Add Sale Button
        document.getElementById('addSaleBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Form Submit
        document.getElementById('saleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaleSubmit();
        });

        // Close Modal
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.hideModal();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideModal();
        });

        // Auto-calculate total when quantity or price changes
        document.getElementById('quantity').addEventListener('input', () => this.updateTotal());
        document.getElementById('pricePerDozen').addEventListener('input', () => this.updateTotal());

        // Filters
        document.getElementById('dateFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());

        // Add PDF download button listener
        document.getElementById('downloadPdfBtn').addEventListener('click', () => {
            this.generatePDF();
        });

        // Add print button listener
        document.getElementById('printBtn').addEventListener('click', () => {
            this.printSalesReport();
        });
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

    showModal(saleData = null) {
        const modal = document.getElementById('saleModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('saleForm');
        
        if (saleData) {
            modalTitle.textContent = 'Edit Sale';
            this.populateForm(saleData);
        } else {
            modalTitle.textContent = 'Record New Sale';
            form.reset();
            // Set default date to current date and time
            document.getElementById('saleDate').value = this.getCurrentDateTime();
        }
        
        modal.classList.add('active');
    }

    hideModal() {
        document.getElementById('saleModal').classList.remove('active');
    }

    getCurrentDateTime() {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
    }

    handleSaleSubmit() {
        const formData = {
            id: Date.now().toString(),
            customerName: document.getElementById('customerName').value,
            quantity: parseFloat(document.getElementById('quantity').value),
            pricePerDozen: parseFloat(document.getElementById('pricePerDozen').value),
            saleDate: document.getElementById('saleDate').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            notes: document.getElementById('notes').value,
            totalAmount: this.calculateTotal(),
            invoiceNumber: this.generateInvoiceNumber()
        };

        this.salesData.push(formData);
        this.saveSalesData();
        this.loadSalesData();
        this.updateSummary();
        this.hideModal();
    }

    calculateTotal() {
        const quantity = parseFloat(document.getElementById('quantity').value) || 0;
        const pricePerDozen = parseFloat(document.getElementById('pricePerDozen').value) || 0;
        return quantity * pricePerDozen;
    }

    updateTotal() {
        const total = this.calculateTotal();
        // If you want to display the total in the form, add an element for it
    }

    generateInvoiceNumber() {
        const prefix = 'INV';
        const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${date}${random}`;
    }

    saveSalesData() {
        localStorage.setItem('salesData', JSON.stringify(this.salesData));
    }

    formatCurrency(amount) {
        return `GH₵ ${amount.toLocaleString('en-GH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    loadSalesData() {
        const tableBody = document.getElementById('salesTableBody');
        const filteredData = this.getFilteredData();
        
        tableBody.innerHTML = filteredData.map(sale => `
            <tr>
                <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                <td>INV-${sale.id}</td>
                <td>${sale.customerName}</td>
                <td>${sale.quantity}</td>
                <td>GH₵${sale.pricePerDozen}</td>
                <td>GH₵${sale.totalAmount}</td>
                <td class="record-actions">
                    <button onclick="salesManager.editSale('${sale.id}')" title="Edit">✏️</button>
                    <button onclick="salesManager.deleteSale('${sale.id}')" title="Delete">🗑️</button>
                    <button onclick="salesManager.printSaleInvoice('${sale.id}')" title="Print Invoice">🖨️</button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredData() {
        let filteredData = [...this.salesData];
        const dateFilter = document.getElementById('dateFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        // Apply date filter
        if (dateFilter) {
            filteredData = filteredData.filter(sale => 
                sale.saleDate.startsWith(dateFilter)
            );
        }

        // Apply sorting
        switch (sortFilter) {
            case 'newest':
                filteredData.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
                break;
            case 'oldest':
                filteredData.sort((a, b) => new Date(a.saleDate) - new Date(b.saleDate));
                break;
            case 'highest':
                filteredData.sort((a, b) => b.totalAmount - a.totalAmount);
                break;
            case 'lowest':
                filteredData.sort((a, b) => a.totalAmount - b.totalAmount);
                break;
        }

        return filteredData;
    }

    updateSummary() {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthStart = new Date();
        monthStart.setDate(1);

        // Calculate summaries
        const todaySales = this.calculateSummary(sale => 
            sale.saleDate.startsWith(today)
        );

        const weekSales = this.calculateSummary(sale => 
            new Date(sale.saleDate) >= weekAgo
        );

        const monthSales = this.calculateSummary(sale => 
            new Date(sale.saleDate) >= monthStart
        );

        // Update summary cards with formatted currency
        document.getElementById('todaySales').textContent = this.formatCurrency(todaySales.total);
        document.getElementById('weekSales').textContent = this.formatCurrency(weekSales.total);
        document.getElementById('monthSales').textContent = this.formatCurrency(monthSales.total);

        // Update dozens sold
        document.querySelector('#todaySales + .summary-subtext').textContent = 
            `${todaySales.dozens} dozens`;
        document.querySelector('#weekSales + .summary-subtext').textContent = 
            `${weekSales.dozens} dozens`;
        document.querySelector('#monthSales + .summary-subtext').textContent = 
            `${monthSales.dozens} dozens`;
    }

    calculateSummary(filterFn) {
        const filtered = this.salesData.filter(filterFn);
        return {
            total: filtered.reduce((sum, sale) => sum + sale.totalAmount, 0),
            dozens: filtered.reduce((sum, sale) => sum + sale.quantity, 0)
        };
    }

    editSale(saleId) {
        const sale = this.salesData.find(s => s.id === saleId);
        if (sale) {
            this.showModal(sale);
        }
    }

    async deleteSale(saleId) {
        const confirmed = await DialogManager.confirm(
            "Delete Sale Record",
            "Are you sure you want to delete this sale record? This action cannot be undone."
        );
        
        if (confirmed) {
            this.salesData = this.salesData.filter(s => s.id !== saleId);
            this.saveSalesData();
            this.loadSalesData();
            this.updateSummary();
        }
    }

    populateForm(sale) {
        document.getElementById('customerName').value = sale.customerName;
        document.getElementById('quantity').value = sale.quantity;
        document.getElementById('pricePerDozen').value = sale.pricePerDozen;
        document.getElementById('saleDate').value = sale.saleDate;
        document.getElementById('paymentMethod').value = sale.paymentMethod;
        document.getElementById('notes').value = sale.notes || '';
    }

    async printSaleInvoice(saleId) {
        const sale = this.salesData.find(s => s.id === saleId);
        if (!sale) return;

        const invoiceContent = `
            <div class="invoice-details">
                <div class="invoice-header">
                    <div class="invoice-header-left">
                        <h1 class="invoice-title">INVOICE</h1>
                        <p>Poultry Farm Management System</p>
                        <p>123 Farm Road, Agricultural District</p>
                        <p>Phone: +233 123 456 789</p>
                        <p>Email: info@poultryfarm.com</p>
                    </div>
                    <div class="invoice-header-right">
                        <h2>Invoice #INV-${sale.id}</h2>
                        <p>Date: ${new Date(sale.saleDate).toLocaleDateString()}</p>
                        <p>Time: ${new Date(sale.saleDate).toLocaleTimeString()}</p>
                    </div>
                </div>

                <div class="customer-details">
                    <div class="detail-section">
                        <h3>Bill To</h3>
                        <p>Customer Name: ${sale.customerName}</p>
                        <p>Payment Method: ${sale.paymentMethod}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Invoice Details</h3>
                        <p>Payment Status: Paid</p>
                        <p>Generated by: ${localStorage.getItem('username') || 'Admin'}</p>
                    </div>
                </div>

                <div class="sale-details">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th class="amount-column">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Fresh Eggs</td>
                                <td>${sale.quantity} dozens</td>
                                <td>GH₵${sale.pricePerDozen.toFixed(2)}</td>
                                <td class="amount-column">GH₵${sale.totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="totals-section">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>GH₵${sale.totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="total-row final">
                            <span>Total:</span>
                            <span>GH₵${sale.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                ${sale.notes ? `
                    <div class="notes-section">
                        <h3>Notes</h3>
                        <p>${sale.notes}</p>
                    </div>
                ` : ''}
            </div>

            <div class="watermark">
                Powered by GenTech Solutions
            </div>

            <div class="print-footer">
                <div>Page <span class="page-number"></span></div>
                <div>© 2024 Poultry Farm Management System</div>
            </div>
        `;

        // Hide the default print header when printing invoice
        const printHeader = document.querySelector('.print-only');
        if (printHeader) {
            printHeader.style.display = 'none';
        }

        // Temporarily replace content and print
        const contentContainer = document.querySelector('.content-container');
        const originalContent = contentContainer.innerHTML;
        contentContainer.innerHTML = invoiceContent;

        window.print();

        // Restore original content and print header visibility
        contentContainer.innerHTML = originalContent;
        if (printHeader) {
            printHeader.style.display = '';
        }
        this.loadSalesData();
    }

    async generatePDF() {
        try {
            // Format date function
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            };

            // Format currency function
            const formatCurrency = (amount) => {
                return `GH₵ ${amount.toFixed(2)}`;
            };

            const tableRows = this.salesData.map(sale => [
                formatDate(sale.date),
                sale.invoiceNumber,
                sale.customerName,
                `${sale.quantity} dozens`,
                formatCurrency(sale.pricePerDozen),
                formatCurrency(sale.quantity * sale.pricePerDozen),
                sale.paymentMethod.toUpperCase()
            ]);

            // Calculate totals
            const totalAmount = this.salesData.reduce((sum, sale) => sum + (sale.quantity * sale.pricePerDozen), 0);
            const totalQuantity = this.salesData.reduce((sum, sale) => sum + sale.quantity, 0);

            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [40, 60, 40, 60],
                background: function() {
                    return {
                        canvas: [
                            {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 595.28,
                                h: 841.89,
                                color: '#ffffff'
                            },
                            {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 595.28,
                                h: 150,
                                color: '#f8f9fa'
                            }
                        ]
                    };
                },
                content: [
                    // Header Section
                    {
                        stack: [
                            { 
                                text: 'POULTRY FARM SALES REPORT',
                                style: 'mainHeader',
                                margin: [0, 20, 0, 10]
                            },
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 150,
                                        y1: 5,
                                        x2: 450,
                                        y2: 5,
                                        lineWidth: 1,
                                        lineColor: '#e0e0e0'
                                    }
                                ]
                            },
                            { text: 'Poultry Farm Management System', style: 'subHeader' },
                            { text: '123 Farm Road, Agricultural District', style: 'subHeader' },
                            { text: 'Phone: +233 123 456 789', style: 'subHeader' },
                        ],
                        alignment: 'center'
                    },

                    // Summary Section
                    {
                        style: 'summarySection',
                        margin: [0, 20],
                        table: {
                            widths: ['*', '*', '*'],
                            body: [[
                                {
                                    stack: [
                                        { text: 'Total Sales', style: 'summaryLabel' },
                                        { text: formatCurrency(totalAmount), style: 'summaryValue' }
                                    ],
                                    alignment: 'center'
                                },
                                {
                                    stack: [
                                        { text: 'Total Quantity', style: 'summaryLabel' },
                                        { text: `${totalQuantity} dozens`, style: 'summaryValue' }
                                    ],
                                    alignment: 'center'
                                },
                                {
                                    stack: [
                                        { text: 'Total Transactions', style: 'summaryLabel' },
                                        { text: this.salesData.length.toString(), style: 'summaryValue' }
                                    ],
                                    alignment: 'center'
                                }
                            ]]
                        },
                        layout: 'noBorders'
                    },

                    // Report Info Box
                    {
                        style: 'reportInfo',
                        table: {
                            widths: ['*'],
                            body: [[
                                {
                                    stack: [
                                        { text: `Generated: ${formatDate(new Date())} ${new Date().toLocaleTimeString()}` },
                                        { text: `Generated By: ${localStorage.getItem('username') || 'Admin'}` },
                                        { text: `Total Records: ${this.salesData.length}` }
                                    ],
                                    margin: [5, 5]
                                }
                            ]]
                        },
                        layout: {
                            fillColor: function() {
                                return '#f8f9fa';
                            },
                            hLineWidth: function() { return 1; },
                            vLineWidth: function() { return 1; },
                            hLineColor: function() { return '#e0e0e0'; },
                            vLineColor: function() { return '#e0e0e0'; }
                        },
                        margin: [0, 20]
                    },

                    // Sales Table
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                [
                                    'Date',
                                    'Invoice #',
                                    'Customer',
                                    'Quantity',
                                    'Price/Dozen',
                                    'Total',
                                    'Payment'
                                ].map(text => ({
                                    text,
                                    style: 'tableHeader'
                                })),
                                ...tableRows
                            ]
                        },
                        layout: {
                            fillColor: function(rowIndex) {
                                return (rowIndex === 0) ? '#f5f5f5' : 
                                       (rowIndex % 2 === 0) ? '#fbfbfb' : null;
                            },
                            hLineWidth: function() { return 1; },
                            vLineWidth: function() { return 1; },
                            hLineColor: function() { return '#e0e0e0'; },
                            vLineColor: function() { return '#e0e0e0'; }
                        }
                    }
                ],
                styles: {
                    mainHeader: {
                        fontSize: 22,
                        bold: true,
                        color: '#2c3e50'
                    },
                    subHeader: {
                        fontSize: 10,
                        color: '#666666',
                        margin: [0, 2]
                    },
                    reportInfo: {
                        fontSize: 10,
                        color: '#444444',
                        margin: [0, 5],
                        lineHeight: 1.2
                    },
                    tableHeader: {
                        fontSize: 10,
                        bold: true,
                        color: '#2c3e50',
                        fillColor: '#f5f5f5',
                        margin: [5, 5]
                    }
                },
                defaultStyle: {
                    fontSize: 9,
                    color: '#333333'
                },
                footer: function(currentPage, pageCount) {
                    return {
                        stack: [
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 40,
                                        y1: 0,
                                        x2: 515,
                                        y2: 0,
                                        lineWidth: 1,
                                        lineColor: '#e0e0e0'
                                    }
                                ]
                            },
                            {
                                columns: [
                                    { 
                                        text: '© 2024 Poultry Farm Management System',
                                        alignment: 'left',
                                        margin: [40, 5]
                                    },
                                    {
                                        text: 'Powered by GenTech Solutions',
                                        alignment: 'center',
                                        margin: [0, 5]
                                    },
                                    {
                                        text: `Page ${currentPage} of ${pageCount}`,
                                        alignment: 'right',
                                        margin: [0, 5, 40, 0]
                                    }
                                ],
                                fontSize: 8,
                                color: '#666666'
                            }
                        ],
                        margin: [0, 20]
                    };
                }
            };

            // Generate and download the PDF with formatted date in filename
            const today = formatDate(new Date()).replace(/\//g, '-');
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.download(`sales-report-${today}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    async printSalesReport() {
        // Calculate totals
        const totalQuantity = this.salesData.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalAmount = this.salesData.reduce((sum, sale) => sum + (sale.quantity * sale.pricePerDozen), 0);
        const totalTransactions = this.salesData.length;

        const printContent = `
            <div class="print-content">
                <div class="print-header">
                    <h1>POULTRY FARM SALES REPORT</h1>
                    <div class="company-info">
                        <p>Poultry Farm Management System</p>
                        <p>123 Farm Road, Agricultural District</p>
                        <p>Phone: +233 123 456 789</p>
                    </div>
                </div>

                <div class="record-info">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Generated By:</strong> ${localStorage.getItem('username') || 'Admin'}</p>
                </div>

                <div class="sales-summary">
                    <div class="summary-card">
                        <div class="summary-label">Total Sales</div>
                        <div class="summary-value">GH₵${totalAmount.toFixed(2)}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">Total Quantity</div>
                        <div class="summary-value">${totalQuantity} dozens</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">Total Transactions</div>
                        <div class="summary-value">${totalTransactions}</div>
                    </div>
                </div>

                <div class="sales-records-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Invoice #</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Price/Dozen</th>
                                <th>Total</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.salesData.map(sale => `
                                <tr>
                                    <td>${new Date(sale.date).toLocaleDateString('en-GB')}</td>
                                    <td>${sale.invoiceNumber}</td>
                                    <td>${sale.customerName}</td>
                                    <td style="text-align: right">${sale.quantity} dozens</td>
                                    <td style="text-align: right">GH₵${sale.pricePerDozen.toFixed(2)}</td>
                                    <td style="text-align: right">GH₵${(sale.quantity * sale.pricePerDozen).toFixed(2)}</td>
                                    <td>${sale.paymentMethod.toUpperCase()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="print-footer">
                    <p>© 2024 Poultry Farm Management System</p>
                    <p>Powered by GenTech Solutions</p>
                </div>
            </div>
        `;

        const contentContainer = document.querySelector('.content-container');
        const originalContent = contentContainer.innerHTML;
        contentContainer.innerHTML = printContent;

        window.print();

        contentContainer.innerHTML = originalContent;
        this.loadSalesList();
    }
}

// Initialize sales manager when DOM is loaded
let salesManager;
document.addEventListener('DOMContentLoaded', () => {
    salesManager = new SalesManager();
}); 