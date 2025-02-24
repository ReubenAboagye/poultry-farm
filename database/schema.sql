-- Keep only structure, remove any test data
CREATE DATABASE IF NOT EXISTS poultry_farm;
USE poultry_farm;

-- Users table structure only
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identifier VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    type ENUM('email', 'phone') NOT NULL DEFAULT 'email',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    breed VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    arrival_date DATE NOT NULL,
    source VARCHAR(255) NOT NULL,
    initial_cost DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'completed', 'terminated') DEFAULT 'active',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Individual fowl table
CREATE TABLE IF NOT EXISTS fowls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    tag_number VARCHAR(50) UNIQUE,
    breed VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
    date_of_birth DATE,
    weight DECIMAL(5,2),
    status ENUM('healthy', 'sick', 'deceased') DEFAULT 'healthy',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);

-- Feed inventory table
CREATE TABLE IF NOT EXISTS feed_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feed_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    purchase_date DATE NOT NULL,
    expiry_date DATE,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Feed consumption table
CREATE TABLE IF NOT EXISTS feed_consumption (
    id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    feed_inventory_id INT,
    quantity_used DECIMAL(10,2) NOT NULL,
    consumption_date DATE NOT NULL,
    notes TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (feed_inventory_id) REFERENCES feed_inventory(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Vaccination schedule table
CREATE TABLE IF NOT EXISTS vaccination_schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    vaccine_name VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    dosage VARCHAR(50),
    notes TEXT,
    status ENUM('pending', 'completed', 'missed') DEFAULT 'pending',
    administered_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (administered_by) REFERENCES users(id)
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date DATE NOT NULL,
    customer_name VARCHAR(255),
    item_type ENUM('fowl', 'eggs', 'other') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money') NOT NULL,
    notes TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money') NOT NULL,
    receipt_number VARCHAR(100),
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- SMS notifications table
CREATE TABLE IF NOT EXISTS sms_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    sms_enabled BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_notification (user_id, notification_type)
); 