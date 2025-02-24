<?php
class UrlHelper {
    public static function url($path = '') {
        // Remove leading slash if present
        $path = ltrim($path, '/');
        return BASE_URL . '/' . $path;
    }
} 