<?php
require_once __DIR__ . '/../vendor/autoload.php';

use TCPDF;

class PDFHelper {
    private $pdf;
    private $currency = 'GHS';

    public function __construct() {
        // Create new PDF document
        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        
        // Set document information
        $this->pdf->SetCreator('Poultry Management System');
        $this->pdf->SetAuthor('Poultry Farm');
        
        // Set default header data
        $this->pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, 'Poultry Management System', 'Generated on: ' . date('Y-m-d H:i:s'));
        
        // Set header and footer fonts
        $this->pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $this->pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
        
        // Set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        
        // Set margins
        $this->pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $this->pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $this->pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
        
        // Set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
    }

    /**
     * Generate weekly performance report
     * @param array $data Report data
     * @return string Path to generated PDF file
     */
    public function generateWeeklyReport($data) {
        $this->pdf->SetTitle('Weekly Performance Report');
        
        // Add a page
        $this->pdf->AddPage();
        
        // Set font
        $this->pdf->SetFont('helvetica', 'B', 16);
        
        // Title
        $this->pdf->Cell(0, 10, 'Weekly Performance Report', 0, 1, 'C');
        $this->pdf->Ln(10);
        
        // Period
        $this->pdf->SetFont('helvetica', '', 12);
        $this->pdf->Cell(0, 10, 'Period: ' . $data['start_date'] . ' to ' . $data['end_date'], 0, 1, 'L');
        $this->pdf->Ln(5);
        
        // Stock Summary
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->Cell(0, 10, 'Stock Summary', 0, 1, 'L');
        $this->pdf->SetFont('helvetica', '', 12);
        
        $this->pdf->Cell(100, 8, 'Total Birds:', 0, 0);
        $this->pdf->Cell(0, 8, $data['stock']['total_birds'], 0, 1);
        
        $this->pdf->Cell(100, 8, 'Healthy Birds:', 0, 0);
        $this->pdf->Cell(0, 8, $data['stock']['healthy_birds'], 0, 1);
        
        $this->pdf->Cell(100, 8, 'Sick Birds:', 0, 0);
        $this->pdf->Cell(0, 8, $data['stock']['sick_birds'], 0, 1);
        
        $this->pdf->Ln(10);
        
        // Financial Summary
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->Cell(0, 10, 'Financial Summary', 0, 1, 'L');
        $this->pdf->SetFont('helvetica', '', 12);
        
        $this->pdf->Cell(100, 8, 'Total Sales:', 0, 0);
        $this->pdf->Cell(0, 8, $this->formatCurrency($data['financial']['total_sales']), 0, 1);
        
        $this->pdf->Cell(100, 8, 'Total Expenses:', 0, 0);
        $this->pdf->Cell(0, 8, $this->formatCurrency($data['financial']['total_expenses']), 0, 1);
        
        $this->pdf->Cell(100, 8, 'Net Profit/Loss:', 0, 0);
        $this->pdf->Cell(0, 8, $this->formatCurrency($data['financial']['net_profit']), 0, 1);
        
        $this->pdf->Ln(10);
        
        // Feed Consumption
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->Cell(0, 10, 'Feed Consumption', 0, 1, 'L');
        $this->pdf->SetFont('helvetica', '', 12);
        
        foreach ($data['feed_consumption'] as $feed) {
            $this->pdf->Cell(100, 8, $feed['type'] . ':', 0, 0);
            $this->pdf->Cell(0, 8, $feed['quantity'] . ' ' . $feed['unit'], 0, 1);
        }
        
        $this->pdf->Ln(10);
        
        // Vaccination Schedule
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->Cell(0, 10, 'Upcoming Vaccinations', 0, 1, 'L');
        $this->pdf->SetFont('helvetica', '', 12);
        
        if (!empty($data['vaccinations'])) {
            foreach ($data['vaccinations'] as $vaccination) {
                $this->pdf->Cell(0, 8, $vaccination['date'] . ' - ' . $vaccination['vaccine_name'] . ' (Batch: ' . $vaccination['batch_number'] . ')', 0, 1);
            }
        } else {
            $this->pdf->Cell(0, 8, 'No upcoming vaccinations', 0, 1);
        }
        
        // Generate file name
        $fileName = 'weekly_report_' . date('Y-m-d_His') . '.pdf';
        $filePath = __DIR__ . '/../../public/reports/' . $fileName;
        
        // Save PDF
        $this->pdf->Output($filePath, 'F');
        
        return $fileName;
    }

    /**
     * Generate sales report
     * @param array $data Sales data
     * @return string Path to generated PDF file
     */
    public function generateSalesReport($data) {
        $this->pdf->SetTitle('Sales Report');
        
        // Add a page
        $this->pdf->AddPage();
        
        // Title
        $this->pdf->SetFont('helvetica', 'B', 16);
        $this->pdf->Cell(0, 10, 'Sales Report', 0, 1, 'C');
        $this->pdf->Ln(10);
        
        // Period
        $this->pdf->SetFont('helvetica', '', 12);
        $this->pdf->Cell(0, 10, 'Period: ' . $data['start_date'] . ' to ' . $data['end_date'], 0, 1, 'L');
        $this->pdf->Ln(5);
        
        // Sales Summary
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->Cell(0, 10, 'Sales Summary', 0, 1, 'L');
        
        // Create sales table
        $this->pdf->SetFont('helvetica', '', 12);
        
        // Table header
        $this->pdf->Cell(40, 8, 'Date', 1, 0, 'C');
        $this->pdf->Cell(50, 8, 'Item', 1, 0, 'C');
        $this->pdf->Cell(30, 8, 'Quantity', 1, 0, 'C');
        $this->pdf->Cell(35, 8, 'Unit Price', 1, 0, 'C');
        $this->pdf->Cell(35, 8, 'Total', 1, 1, 'C');
        
        // Table data
        foreach ($data['sales'] as $sale) {
            $this->pdf->Cell(40, 8, $sale['date'], 1, 0);
            $this->pdf->Cell(50, 8, $sale['item'], 1, 0);
            $this->pdf->Cell(30, 8, $sale['quantity'], 1, 0, 'R');
            $this->pdf->Cell(35, 8, $this->formatCurrency($sale['unit_price']), 1, 0, 'R');
            $this->pdf->Cell(35, 8, $this->formatCurrency($sale['total']), 1, 1, 'R');
        }
        
        // Total
        $this->pdf->SetFont('helvetica', 'B', 12);
        $this->pdf->Cell(155, 8, 'Total', 1, 0, 'R');
        $this->pdf->Cell(35, 8, $this->formatCurrency($data['total_sales']), 1, 1, 'R');
        
        // Generate file name
        $fileName = 'sales_report_' . date('Y-m-d_His') . '.pdf';
        $filePath = __DIR__ . '/../../public/reports/' . $fileName;
        
        // Save PDF
        $this->pdf->Output($filePath, 'F');
        
        return $fileName;
    }

    /**
     * Format currency amount
     * @param float $amount Amount to format
     * @return string Formatted amount with currency symbol
     */
    private function formatCurrency($amount) {
        return $this->currency . ' ' . number_format($amount, 2);
    }
} 