<?php
namespace App\Models;

use App\Core\Model;

class PasswordReset extends Model {
    protected $table = 'password_resets';

    public function createToken($identifier, $token, $type = 'email') {
        // Delete any existing tokens for this identifier
        $sql = "DELETE FROM {$this->table} WHERE identifier = :identifier";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['identifier' => $identifier]);

        // Create new token
        return $this->create([
            'identifier' => $identifier,
            'token' => password_hash($token, PASSWORD_DEFAULT),
            'type' => $type,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+1 hour'))
        ]);
    }

    public function verifyToken($identifier, $token) {
        $sql = "SELECT * FROM {$this->table} 
                WHERE identifier = :identifier 
                AND expires_at > NOW() 
                LIMIT 1";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['identifier' => $identifier]);
        $reset = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($reset && password_verify($token, $reset['token'])) {
            // Delete the used token
            $this->delete($reset['id']);
            return true;
        }

        return false;
    }

    public function cleanExpiredTokens() {
        $sql = "DELETE FROM {$this->table} WHERE expires_at <= NOW()";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute();
    }
} 