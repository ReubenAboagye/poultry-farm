<?php
namespace App\Controllers;

use App\Core\Controller;

class ReportsController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    public function index() {
        $data = [
            'title' => 'Reports',
            'reports' => [
                'weekly' => [
                    'sales' => 25000,
                    'expenses' => 15000,
                    'profit' => 10000
                ],
                'monthly' => [
                    'sales' => 100000,
                    'expenses' => 60000,
                    'profit' => 40000
                ]
            ]
        ];
        
        $this->render('reports/index', $data);
    }

    public function weekly() {
        $data = [
            'title' => 'Weekly Reports',
            'period' => 'weekly'
        ];
        
        $this->render('reports/detail', $data);
    }

    public function monthly() {
        $data = [
            'title' => 'Monthly Reports',
            'period' => 'monthly'
        ];
        
        $this->render('reports/detail', $data);
    }

    public function export() {
        // TODO: Implement export functionality
        $_SESSION['flash_message'] = 'Report exported successfully';
        $_SESSION['flash_type'] = 'success';
        $this->redirect('reports');
    }
} 