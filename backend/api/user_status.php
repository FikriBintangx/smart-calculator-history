<?php
/**
 * PHP Backend Endpoint: /api/user_status.php
 * Fetches user premium entitlement status & purchase history across devices.
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$userId = isset($_GET['user_id']) ? $_GET['user_id'] : 'guest_user';

if (isset($MOCK_USERS_DB[$userId])) {
    $user = $MOCK_USERS_DB[$userId];
    echo json_encode([
        'status' => 'success',
        'data' => $user
    ], JSON_PRETTY_PRINT);
} else {
    // Default response for guest/new users
    echo json_encode([
        'status' => 'success',
        'data' => [
            'user_id' => $userId,
            'is_premium' => false,
            'plan_type' => 'free',
            'expires_at' => null,
            'purchases' => []
        ]
    ], JSON_PRETTY_PRINT);
}
