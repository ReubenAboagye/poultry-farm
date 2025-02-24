<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\User;

class AuthController extends Controller {
    public function login() {
        // If user is already logged in, redirect to dashboard
        if ($this->isAuthenticated()) {
            return $this->redirect('');
        }

        if ($this->isPost()) {
            $data = $this->sanitizeInput($this->getPostData());
            
            // Validate login
            if (empty($data['email']) || empty($data['password'])) {
                $_SESSION['flash_message'] = 'Please fill in all fields';
                $_SESSION['flash_type'] = 'danger';
                return $this->render('auth/login');
            }

            // Verify credentials
            $user = new User();
            $foundUser = $user->findByEmail($data['email']);

            if ($foundUser && $user->verifyPassword($data['password'], $foundUser['password'])) {
                $_SESSION['user_id'] = $foundUser['id'];
                $_SESSION['user_role'] = $foundUser['role'];
                $_SESSION['flash_message'] = 'Welcome back!';
                $_SESSION['flash_type'] = 'success';
                return $this->redirect('');
            }

            $_SESSION['flash_message'] = 'Invalid email or password';
            $_SESSION['flash_type'] = 'danger';
            return $this->render('auth/login');
        }

        return $this->render('auth/login');
    }

    public function register() {
        if ($this->isPost()) {
            $data = $this->sanitizeInput($this->getPostData());
            
            // Validate registration
            if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['confirm_password'])) {
                $_SESSION['flash_message'] = 'Please fill in all fields';
                $_SESSION['flash_type'] = 'danger';
                return $this->render('auth/register');
            }

            if ($data['password'] !== $data['confirm_password']) {
                $_SESSION['flash_message'] = 'Passwords do not match';
                $_SESSION['flash_type'] = 'danger';
                return $this->render('auth/register');
            }

            // TODO: Add actual user registration here
            $_SESSION['flash_message'] = 'Registration successful! Please login.';
            $_SESSION['flash_type'] = 'success';
            return $this->redirect('login');
        }

        return $this->render('auth/register');
    }

    public function logout() {
        session_destroy();
        return $this->redirect('login');
    }
} 