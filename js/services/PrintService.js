class PrintService {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
    }

    async generatePDF(data, type) {
        const pdfContent = await this.getPDFContent(data, type);
        if (this.isMobile) {
            return this.downloadPDF(pdfContent);
        }
        return this.printContent(pdfContent);
    }

    async getPDFContent(data, type) {
        // Common PDF structure
        return {
            header: this.getHeader(),
            content: this.getContent(data, type),
            footer: this.getFooter(),
            styles: this.getPDFStyles()
        };
    }
} 