<?php
namespace App\Controllers;

use App\Core\Controller;

class BatchController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    public function index() {
        $this->render('batch/index', [
            'title' => 'Batch Management'
        ]);
    }
} 