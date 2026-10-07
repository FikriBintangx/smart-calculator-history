<?php
/**
 * Smart Calculator with History - PHP Backend Configuration
 * Handles In-App Purchase Verification & Premium Account Status.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('APP_NAME', 'Smart Calculator with History');
define('APP_VERSION', '2.5.0');

// Environment secret keys (Replace with production credentials when deploying)
define('APPLE_SHARED_SECRET', 'mock_apple_shared_secret_key_88910');
define('GOOGLE_SERVICE_ACCOUNT_KEY', 'mock_google_service_account.json');

// Mock User Database simulation
$MOCK_USERS_DB = [
    'user_free_01' => [
        'user_id' => 'user_free_01',
        'is_premium' => false,
        'plan_type' => 'free',
        'expires_at' => null,
        'purchases' => []
    ],
    'user_premium_01' => [
        'user_id' => 'user_premium_01',
        'is_premium' => true,
        'plan_type' => 'lifetime',
        'expires_at' => '2099-12-31 23:59:59',
        'purchases' => [
            [
                'transaction_id' => 'tx_9988776655',
                'product_id' => 'jp.calculator.history.lifetime',
                'platform' => 'ios',
                'purchase_date' => '2026-01-15 10:20:00'
            ]
        ]
    ]
];
