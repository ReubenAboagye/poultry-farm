<?php
require_once __DIR__ . '/../config/sms.php';

class SMSHelper {
    /**
     * Send SMS using Hubtel API
     * @param string $to Recipient phone number
     * @param string $message Message text
     * @return array Response with status and message
     */
    public static function send($to, $message) {
        if (!SMSConfig::checkRateLimit()) {
            return [
                'success' => false,
                'message' => 'Rate limit exceeded'
            ];
        }

        $phone = SMSConfig::formatPhoneNumber($to);
        
        $data = [
            'from' => SMSConfig::FROM_NUMBER,
            'to' => $phone,
            'content' => $message
        ];

        $auth = base64_encode(SMSConfig::CLIENT_ID . ':' . SMSConfig::CLIENT_SECRET);

        $ch = curl_init(SMSConfig::API_ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Basic ' . $auth,
                'Content-Type: application/json'
            ],
            CURLOPT_POSTFIELDS => json_encode($data)
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            SMSConfig::logSMS($phone, $message, 'failed', $error);
            return [
                'success' => false,
                'message' => 'Failed to send SMS: ' . $error
            ];
        }

        $result = json_decode($response, true);
        
        if ($httpCode === 200 || $httpCode === 201) {
            SMSConfig::logSMS($phone, $message, 'sent');
            return [
                'success' => true,
                'message' => 'SMS sent successfully'
            ];
        } else {
            SMSConfig::logSMS($phone, $message, 'failed', $response);
            return [
                'success' => false,
                'message' => 'Failed to send SMS: ' . ($result['message'] ?? 'Unknown error')
            ];
        }
    }

    /**
     * Send notification using template
     * @param string $to Recipient phone number
     * @param string $template Template key
     * @param array $data Data to fill template placeholders
     * @return array Response with status and message
     */
    public static function sendTemplate($to, $template, $data) {
        $message = SMSConfig::getTemplate($template);
        
        if (empty($message)) {
            return [
                'success' => false,
                'message' => 'Template not found'
            ];
        }

        // Replace placeholders in template
        foreach ($data as $key => $value) {
            $message = str_replace('{' . $key . '}', $value, $message);
        }

        return self::send($to, $message);
    }

    /**
     * Send batch notification to multiple recipients
     * @param array $recipients Array of phone numbers
     * @param string $message Message text
     * @return array Array of responses
     */
    public static function sendBatch($recipients, $message) {
        $responses = [];
        
        foreach ($recipients as $recipient) {
            $responses[$recipient] = self::send($recipient, $message);
            
            // Add delay to respect rate limits
            usleep(1000000 / SMSConfig::MAX_SMS_PER_MINUTE); // Sleep for appropriate interval
        }

        return $responses;
    }

    /**
     * Send low stock alert
     * @param string $item Item name
     * @param float $quantity Current quantity
     * @param string $unit Unit of measurement
     * @param array $recipients Array of recipient phone numbers
     * @return array Response with status and message
     */
    public static function sendLowStockAlert($item, $quantity, $unit, $recipients) {
        $data = [
            'item' => $item,
            'quantity' => $quantity,
            'unit' => $unit
        ];

        $responses = [];
        foreach ($recipients as $recipient) {
            $responses[$recipient] = self::sendTemplate($recipient, 'low_stock', $data);
        }

        return $responses;
    }

    /**
     * Send vaccination reminder
     * @param string $vaccineName Vaccine name
     * @param string $batchNumber Batch number
     * @param string $date Scheduled date
     * @param array $recipients Array of recipient phone numbers
     * @return array Response with status and message
     */
    public static function sendVaccinationReminder($vaccineName, $batchNumber, $date, $recipients) {
        $data = [
            'vaccine_name' => $vaccineName,
            'batch_number' => $batchNumber,
            'date' => $date
        ];

        $responses = [];
        foreach ($recipients as $recipient) {
            $responses[$recipient] = self::sendTemplate($recipient, 'vaccination_due', $data);
        }

        return $responses;
    }

    /**
     * Send sales milestone notification
     * @param string $period Period description (e.g., "January 2024")
     * @param float $amount Sales amount
     * @param array $recipients Array of recipient phone numbers
     * @return array Response with status and message
     */
    public static function sendSalesMilestone($period, $amount, $recipients) {
        $data = [
            'period' => $period,
            'amount' => number_format($amount, 2)
        ];

        $responses = [];
        foreach ($recipients as $recipient) {
            $responses[$recipient] = self::sendTemplate($recipient, 'sales_milestone', $data);
        }

        return $responses;
    }
} 