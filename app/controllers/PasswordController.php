<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\User;
use App\Models\PasswordReset;
use App\Helpers\SMSHelper;

class PasswordController extends Controller {
    private $userModel;
    private $resetModel;

    public function __construct() {
        $this->userModel = new User();
        $this->resetModel = new PasswordReset();
    }

    public function forgot() {
        if ($this->isPost()) {
            $data = $this->sanitizeInput($this->getPostData());
            $resetType = $data['reset_type'] ?? 'email';
            $identifier = $data[$resetType] ?? '';

            // Find user by email or phone
            $user = $this->userModel->findByIdentifier($identifier, $resetType);
            
            if ($user) {
                // Generate random token
                $token = bin2hex(random_bytes(16));
                
                // Store token
                $this->resetModel->createToken($identifier, $token, $resetType);

                if ($resetType === 'email') {
                    // Send email
                    $resetLink = "http://" . $_SERVER['HTTP_HOST'] . "/password/reset?email=" . urlencode($identifier) . "&token=" . $token;
                    $emailSent = $this->sendResetEmail($user['email'], $resetLink);
                    
                    if ($emailSent) {
                        $_SESSION['flash_message'] = 'Password reset instructions have been sent to your email.';
                        $_SESSION['flash_type'] = 'success';
                    } else {
                        $_SESSION['flash_message'] = 'Failed to send reset email. Please try again.';
                        $_SESSION['flash_type'] = 'danger';
                    }
                } else {
                    // Send SMS
                    $smsHelper = new SMSHelper();
                    $message = "Your password reset code is: " . $token;
                    $response = $smsHelper->send($user['phone'], $message);
                    
                    if ($response['success']) {
                        $_SESSION['flash_message'] = 'Password reset code has been sent to your phone.';
                        $_SESSION['flash_type'] = 'success';
                    } else {
                        $_SESSION['flash_message'] = 'Failed to send reset code. Please try again.';
                        $_SESSION['flash_type'] = 'danger';
                    }
                }
            } else {
                $_SESSION['flash_message'] = 'No account found with that ' . $resetType . '.';
                $_SESSION['flash_type'] = 'danger';
            }
            
            $this->redirect('/password/forgot');
        }

        $this->render('password/forgot');
    }

    public function reset() {
        if ($this->isPost()) {
            $data = $this->sanitizeInput($this->getPostData());
            $identifier = $data['identifier'] ?? '';
            $token = $data['token'] ?? '';
            $password = $data['password'] ?? '';
            $confirmPassword = $data['confirm_password'] ?? '';

            if ($password !== $confirmPassword) {
                $_SESSION['flash_message'] = 'Passwords do not match.';
                $_SESSION['flash_type'] = 'danger';
                $this->redirect('/password/reset');
            }

            if (strlen($password) < 8) {
                $_SESSION['flash_message'] = 'Password must be at least 8 characters long.';
                $_SESSION['flash_type'] = 'danger';
                $this->redirect('/password/reset');
            }

            if ($this->resetModel->verifyToken($identifier, $token)) {
                // Update password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $this->userModel->updatePassword($identifier, $hashedPassword);

                $_SESSION['flash_message'] = 'Your password has been reset successfully. Please login.';
                $_SESSION['flash_type'] = 'success';
                $this->redirect('/login');
            } else {
                $_SESSION['flash_message'] = 'Invalid or expired reset token.';
                $_SESSION['flash_type'] = 'danger';
                $this->redirect('/password/reset');
            }
        }

        $this->render('password/reset', [
            'email' => $_GET['email'] ?? '',
            'token' => $_GET['token'] ?? ''
        ]);
    }

    private function sendResetEmail($email, $resetLink) {
        $to = $email;
        $subject = "Password Reset Request";
        $message = "
        <html>
        <head>
            <title>Password Reset Request</title>
        </head>
        <body>
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <p><a href='{$resetLink}'>Reset Password</a></p>
            <p>If you did not request this reset, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        </body>
        </html>
        ";

        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: Poultry Farm <noreply@poultryfarm.com>' . "\r\n";

        return mail($to, $subject, $message, $headers);
    }
} 