<?php
namespace App\Controllers;

use App\Core\Controller;

class PoultryController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    public function index() {
        $this->render('poultry/index', [
            'title' => 'Poultry Management'
        ]);
    }
} 