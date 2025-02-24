<?php
namespace App\Core;

class Router {
    private $routes = [];
    private $params = [];

    public function add($route, $params = []) {
        $route = preg_replace('/\//', '\\/', $route);
        $route = preg_replace('/\{([a-z]+)\}/', '(?P<\1>[a-z-]+)', $route);
        $route = '/^' . $route . '$/i';
        $this->routes[$route] = $params;
    }

    public function match($url) {
        foreach ($this->routes as $route => $params) {
            if (preg_match($route, $url, $matches)) {
                foreach ($matches as $key => $match) {
                    if (is_string($key)) {
                        $params[$key] = $match;
                    }
                }
                $this->params = $params;
                return true;
            }
        }
        return false;
    }

    public function dispatch($url) {
        $url = $this->removeQueryStringVariables($url);

        if ($this->match($url)) {
            $controller = $this->params['controller'];
            $controller = $this->convertToStudlyCaps($controller);
            $controller = "App\\Controllers\\{$controller}Controller";

            if (class_exists($controller)) {
                $controller_object = new $controller();
                
                $action = $this->params['action'];
                $action = $this->convertToCamelCase($action);

                if (method_exists($controller_object, $action)) {
                    return $controller_object->$action();
                } else {
                    throw new \Exception("Method $action in controller $controller not found");
                }
            } else {
                throw new \Exception("Controller class $controller not found");
            }
        } else {
            throw new \Exception('No route matched.', 404);
        }
    }

    private function convertToStudlyCaps($string) {
        return str_replace(' ', '', ucwords(str_replace('-', ' ', $string)));
    }

    private function convertToCamelCase($string) {
        return lcfirst($this->convertToStudlyCaps($string));
    }

    private function removeQueryStringVariables($url) {
        // Handle Windows-style paths and convert to forward slashes
        $url = str_replace('\\', '/', $url);
        
        // Remove the subdirectory from the URL if present
        $baseDir = 'farm/public';
        if (strpos($url, $baseDir) !== false) {
            $url = substr($url, strpos($url, $baseDir) + strlen($baseDir));
        }
        
        // Remove query string
        if ($url != '') {
            $parts = explode('?', $url, 2);
            $url = $parts[0];
        }
        
        return trim($url, '/');
    }

    public function getParams() {
        return $this->params;
    }
} 