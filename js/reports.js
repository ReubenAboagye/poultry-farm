class ReportManager {
    constructor() {
        this.printService = new PrintService();
        this.chartManager = new ChartManager();
        this.initializeReports();
    }

    async initializeReports() {
        await this.setupFilters();
        await this.loadInitialData();
        this.setupEventListeners();
        this.chartManager.initializeCharts();
    }

    async loadInitialData() {
        const defaultFilters = {
            type: 'sales',
            dateRange: 'month',
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            endDate: new Date()
        };
        await this.updateReport(defaultFilters);
    }
} 