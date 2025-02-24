<?php
namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller {
    public function __construct() {
        // Require authentication for all actions in this controller
        $this->requireAuth();
    }

    public function index() {
        // Sample data for dashboard
        $data = [
            'stats' => [
                'total_birds' => 1250,
                'healthy_birds' => 1200,
                'sick_birds' => 50,
                'total_batches' => 5
            ],
            'recent_sales' => [
                ['date' => '2024-02-24', 'amount' => 5000, 'items' => 100],
                ['date' => '2024-02-23', 'amount' => 3500, 'items' => 70],
                ['date' => '2024-02-22', 'amount' => 4200, 'items' => 85]
            ],
            'upcoming_vaccinations' => [
                ['date' => '2024-02-26', 'batch' => 'B001', 'vaccine' => 'Newcastle Disease'],
                ['date' => '2024-02-27', 'batch' => 'B003', 'vaccine' => 'Infectious Bronchitis']
            ]
        ];
        
        $this->render('home/dashboard', $data);
    }
} 