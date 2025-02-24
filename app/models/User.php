<?php
namespace App\Models;

use App\Core\Model;

class User extends Model {
    protected $table = 'users';

    public function findByIdentifier($identifier, $type = 'email') {
        $sql = "SELECT * FROM {$this->table} WHERE {$type} = :identifier LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['identifier' => $identifier]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function updatePassword($identifier, $hashedPassword) {
        $sql = "UPDATE {$this->table} SET password = :password 
                WHERE email = :identifier OR phone = :identifier";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'password' => $hashedPassword,
            'identifier' => $identifier
        ]);
    }

    public function authenticate($username, $password) {
        $sql = "SELECT * FROM {$this->table} 
                WHERE (username = :username OR email = :username) 
                AND is_active = 1 
                LIMIT 1";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }

        return false;
    }

    public function create($data) {
        // Hash password before creating user
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        return parent::create($data);
    }

    public function findByEmail($email) {
        return $this->where('email = :email', ['email' => $email])[0] ?? null;
    }

    public function verifyPassword($password, $hashedPassword) {
        return password_verify($password, $hashedPassword);
    }
} 