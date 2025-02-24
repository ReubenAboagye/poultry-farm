<?php
namespace App\Controllers;

use App\Core\Controller;

class SalesController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    public function index() {
        $this->render('sales/index', [
            'title' => 'Sales Management'
        ]);
    }
} 