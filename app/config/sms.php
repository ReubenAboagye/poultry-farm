<?php
class SMSConfig {
    // Hubtel API credentials
    const CLIENT_ID = 'YOUR_HUBTEL_CLIENT_ID';
    const CLIENT_SECRET = 'YOUR_HUBTEL_CLIENT_SECRET';
    const FROM_NUMBER = 'YOUR_SENDER_ID';

    // API endpoints
    const API_ENDPOINT = 'https://api.hubtel.com/v1/messages';

    // SMS templates
    const TEMPLATES = [
        'low_stock' => 'Alert: Low stock level for {item}. Current quantity: {quantity} {unit}.',
        'vaccination_due' => 'Vaccination reminder: {vaccine_name} is due for batch {batch_number} on {date}.',
        'sales_milestone' => 'Sales milestone reached! Total sales for {period}: GHS {amount}.',
        'expense_alert' => 'New expense recorded: GHS {amount} for {category} on {date}.',
        'batch_update' => 'Batch {batch_number} status updated to {status}. Current count: {quantity}.'
    ];

    // Notification thresholds
    const LOW_STOCK_THRESHOLD = 100; // kg or units
    const SALES_MILESTONE_AMOUNT = 10000; // GHS
    const VACCINATION_REMINDER_DAYS = 3; // days before scheduled date

    // Rate limiting
    const MAX_SMS_PER_MINUTE = 60;
    const MAX_SMS_PER_DAY = 1000;

    /**
     * Get SMS template by key
     * @param string $key Template key
     * @return string Template text or empty string if not found
     */
    public static function getTemplate($key) {
        return self::TEMPLATES[$key] ?? '';
    }

    /**
     * Format phone number to international format
     * @param string $phone Phone number
     * @return string Formatted phone number
     */
    public static function formatPhoneNumber($phone) {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add Ghana country code if not present
        if (strlen($phone) === 9) {
            return '+233' . $phone;
        } elseif (strlen($phone) === 10 && $phone[0] === '0') {
            return '+233' . substr($phone, 1);
        }
        
        return $phone;
    }

    /**
     * Check if SMS sending is within rate limits
     * @return bool True if within limits, false otherwise
     */
    public static function checkRateLimit() {
        // Implementation would check against database records
        // of SMS sent within the last minute and day
        return true; // Placeholder implementation
    }

    /**
     * Log SMS sending attempt
     * @param string $phone Recipient phone number
     * @param string $message Message text
     * @param string $status Sending status
     * @param string $error Error message if any
     */
    public static function logSMS($phone, $message, $status, $error = null) {
        global $db;
        
        $sql = "INSERT INTO sms_notifications (recipient_phone, message, status, error_message) 
                VALUES (:phone, :message, :status, :error)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            'phone' => $phone,
            'message' => $message,
            'status' => $status,
            'error' => $error
        ]);
    }
} 