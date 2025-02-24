<?php
namespace App\Core;

use App\Helpers\UrlHelper;

abstract class Controller {
    protected function render($view, $data = []) {
        extract($data);
        
        $viewFile = "../app/views/" . $view . ".php";
        
        if (file_exists($viewFile)) {
            ob_start();
            require $viewFile;
            $content = ob_get_clean();
            require "../app/views/layouts/main.php";
        } else {
            throw new \Exception("View $viewFile not found");
        }
    }

    protected function redirect($path) {
        header('Location: ' . UrlHelper::url($path));
        exit;
    }

    protected function isPost() {
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    protected function getPostData() {
        return $_POST;
    }

    protected function sanitizeInput($data) {
        if (is_array($data)) {
            foreach($data as $key => $value) {
                $data[$key] = $this->sanitizeInput($value);
            }
        } else {
            $data = htmlspecialchars(strip_tags(trim($data)));
        }
        return $data;
    }

    protected function isAuthenticated() {
        return isset($_SESSION['user_id']);
    }

    protected function requireAuth() {
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }
    }
} 