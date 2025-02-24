<?php
namespace App\Controllers;

use App\Core\Controller;

class ExpensesController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    public function index() {
        $this->render('expenses/index', [
            'title' => 'Expenses Management'
        ]);
    }
} 