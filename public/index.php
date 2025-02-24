<?php
session_start();

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define constants
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');

// Update base URL constant to include the subdirectory
define('BASE_URL', '/farm/public');

// Debug output
if (isset($_SERVER['REQUEST_URI'])) {
    error_log("Request URI: " . $_SERVER['REQUEST_URI']);
}

// Autoloader
spl_autoload_register(function ($class) {
    $class = str_replace('\\', '/', $class);
    $file = ROOT_PATH . '/' . $class . '.php';
    if (file_exists($file)) {
        require $file;
    } else {
        error_log("Class file not found: " . $file);
    }
});

// Load configuration
require_once APP_PATH . '/config/database.php';

// Add the URL helper
require_once APP_PATH . '/helpers/UrlHelper.php';

// Create Router instance
$router = new \App\Core\Router();

// Define routes
$router->add('', ['controller' => 'home', 'action' => 'index']);
$router->add('login', ['controller' => 'auth', 'action' => 'login']);
$router->add('register', ['controller' => 'auth', 'action' => 'register']);
$router->add('logout', ['controller' => 'auth', 'action' => 'logout']);

// Poultry routes
$router->add('poultry', ['controller' => 'poultry', 'action' => 'index']);
$router->add('poultry/create', ['controller' => 'poultry', 'action' => 'create']);
$router->add('poultry/edit/{id}', ['controller' => 'poultry', 'action' => 'edit']);
$router->add('poultry/delete/{id}', ['controller' => 'poultry', 'action' => 'delete']);

// Batch routes
$router->add('batches', ['controller' => 'batch', 'action' => 'index']);
$router->add('batches/create', ['controller' => 'batch', 'action' => 'create']);
$router->add('batches/edit/{id}', ['controller' => 'batch', 'action' => 'edit']);
$router->add('batches/delete/{id}', ['controller' => 'batch', 'action' => 'delete']);

// Sales routes
$router->add('sales', ['controller' => 'sales', 'action' => 'index']);
$router->add('sales/create', ['controller' => 'sales', 'action' => 'create']);
$router->add('sales/report', ['controller' => 'sales', 'action' => 'report']);

// Expenses routes
$router->add('expenses', ['controller' => 'expenses', 'action' => 'index']);
$router->add('expenses/create', ['controller' => 'expenses', 'action' => 'create']);
$router->add('expenses/report', ['controller' => 'expenses', 'action' => 'report']);

// Reports routes
$router->add('reports', ['controller' => 'reports', 'action' => 'index']);
$router->add('reports/weekly', ['controller' => 'reports', 'action' => 'weekly']);
$router->add('reports/monthly', ['controller' => 'reports', 'action' => 'monthly']);
$router->add('reports/export', ['controller' => 'reports', 'action' => 'export']);

// Password reset routes
$router->add('password/forgot', ['controller' => 'password', 'action' => 'forgot']);
$router->add('password/reset', ['controller' => 'password', 'action' => 'reset']);

// Get the URL
$url = trim($_SERVER['REQUEST_URI'], '/');

try {
    $router->dispatch($url);
} catch (\Exception $e) {
    error_log("Routing error: " . $e->getMessage());
    // Handle 404 and other errors
    http_response_code($e->getCode() === 404 ? 404 : 500);
    require APP_PATH . '/views/errors/' . ($e->getCode() === 404 ? '404' : '500') . '.php';
} 