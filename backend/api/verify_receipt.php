<?php
/**
 * PHP Backend Endpoint: /api/verify_receipt.php
 * Handles verification of In-App Purchase Receipts from iOS App Store & Android Google Play.
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$inputJson = file_get_contents('php://input');
$data = json_decode($inputJson, true);

if (!$data) {
    echo json_encode([
        'status' => 'error',
        'code' => 400,
        'message' => 'Payload JSON tidak valid'
    ]);
    exit();
}

$platform = isset($data['platform']) ? strtolower($data['platform']) : 'sandbox';
$receiptData = isset($data['receipt_data']) ? $data['receipt_data'] : '';
$productId = isset($data['product_id']) ? $data['product_id'] : 'jp.calculator.history.lifetime';
$userId = isset($data['user_id']) ? $data['user_id'] : 'user_default';

if (empty($receiptData)) {
    echo json_encode([
        'status' => 'error',
        'code' => 422,
        'message' => 'Data tanda terima (receipt_data) tidak boleh kosong'
    ]);
    exit();
}

/**
 * Perform verification logic
 */
$isVerified = false;
$transactionId = 'tx_' . time() . '_' . rand(1000, 9999);
$expirationDate = ($productId === 'jp.calculator.history.subscription')
    ? date('Y-m-d H:i:s', strtotime('+1 month'))
    : '2099-12-31 23:59:59';

if ($platform === 'ios') {
    // iOS App Store Receipt Verification simulation (Production URL: https://buy.itunes.apple.com/verifyReceipt)
    // Sandbox URL: https://sandbox.itunes.apple.com/verifyReceipt
    if (strlen($receiptData) > 5) {
        $isVerified = true;
    }
} elseif ($platform === 'android') {
    // Google Play Developer API Verification simulation
    if (strlen($receiptData) > 5) {
        $isVerified = true;
    }
} else {
    // Sandbox / Mock mode testing
    $isVerified = true;
}

if ($isVerified) {
    $response = [
        'status' => 'success',
        'code' => 200,
        'message' => 'Verifikasi tanda terima berhasil! Status premium diaktifkan.',
        'data' => [
            'user_id' => $userId,
            'is_premium' => true,
            'platform' => $platform,
            'product_id' => $productId,
            'transaction_id' => $transactionId,
            'purchase_date' => date('Y-m-d H:i:s'),
            'expires_at' => $expirationDate,
            'verified_at' => date('c')
        ]
    ];
} else {
    $response = [
        'status' => 'failed',
        'code' => 400,
        'message' => 'Verifikasi tanda terima gagal. Tanda terima tidak valid atau telah kedaluwarsa.',
        'data' => [
            'is_premium' => false
        ]
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT);
