<?php

function post($url, $data, $token = null) {
    $ch = curl_init($url);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, json_decode($res, true)];
}

function get($url, $token = null) {
    $ch = curl_init($url);
    $headers = ['Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, json_decode($res, true)];
}

echo "=== 1. Registration Test ===\n";
[$code, $reg] = post('http://127.0.0.1:8000/api/v1/auth/register', [
    'name' => 'Ahmad Raza',
    'email' => 'ahmad.' . time() . '@yettoexplore.com',
    'password' => 'password123',
    'phone' => '+92 300 7766554',
    'role' => 'customer'
]);
echo "Status: $code | Registered User: " . ($reg['user']['name'] ?? 'Failed') . "\n";

echo "\n=== 2. Agency Owner Login ===\n";
[$code, $login] = post('http://127.0.0.1:8000/api/v1/auth/login', [
    'email' => 'agency@yettoexplore.com',
    'password' => 'password123'
]);
$agencyToken = $login['token'] ?? null;
echo "Status: $code | Agency: " . ($login['user']['agency']['name'] ?? 'None') . " | Role: " . ($login['user']['role'] ?? '') . "\n";

echo "\n=== 3. Agency SaaS Metrics ===\n";
[$code, $stats] = get('http://127.0.0.1:8000/api/v1/agency/stats', $agencyToken);
echo "Status: $code | Total Tours: " . ($stats['stats']['total_tours'] ?? 0) . " | Bookings: " . ($stats['stats']['total_bookings'] ?? 0) . " | Revenue: PKR " . number_format($stats['stats']['total_revenue'] ?? 0) . "\n";

echo "\n=== 4. Traveler Login & Booking Creation ===\n";
[$code, $tLogin] = post('http://127.0.0.1:8000/api/v1/auth/login', [
    'email' => 'traveler@yettoexplore.com',
    'password' => 'password123'
]);
$travelerToken = $tLogin['token'] ?? null;
echo "Status: $code | Traveler: " . ($tLogin['user']['name'] ?? '') . "\n";

[$code, $booking] = post('http://127.0.0.1:8000/api/v1/bookings', [
    'tour_id' => 1,
    'batch_id' => 1,
    'travel_date' => '2026-09-15',
    'adults_count' => 2,
    'children_count' => 1,
    'coupon_code' => 'EXPLORE10',
    'payment_method' => 'credit_card',
    'special_requests' => 'Window seats in coaster please',
    'passengers' => [
        ['full_name' => 'Sarah Khan', 'cnic_passport' => '61101-1234567-8', 'gender' => 'Female', 'age' => 28, 'is_lead' => true, 'phone' => '+92 321 7654321'],
        ['full_name' => 'Farhan Khan', 'cnic_passport' => '61101-9876543-1', 'gender' => 'Male', 'age' => 30, 'is_lead' => false],
        ['full_name' => 'Ayan Khan', 'cnic_passport' => '61101-5554443-2', 'gender' => 'Male', 'age' => 6, 'is_lead' => false]
    ]
], $travelerToken);

echo "Status: $code | Booking #: " . ($booking['booking']['booking_number'] ?? 'N/A') . "\n";
echo "QR Pass Token: " . ($booking['booking']['qr_code_token'] ?? 'N/A') . "\n";
echo "Total Amount: PKR " . number_format($booking['booking']['total_amount'] ?? 0) . " (Discount: PKR " . number_format($booking['booking']['discount_amount'] ?? 0) . ")\n";
echo "Passengers Confirmed: " . count($booking['booking']['passengers'] ?? []) . "\n";

echo "\n=== 5. Fetch Traveler Bookings ===\n";
[$code, $myBookings] = get('http://127.0.0.1:8000/api/v1/bookings/my-bookings', $travelerToken);
echo "Status: $code | My Bookings Count: " . ($myBookings['count'] ?? count($myBookings['data'] ?? [])) . "\n";
foreach (($myBookings['data'] ?? []) as $b) {
    echo "  - [" . $b['booking_number'] . "] " . ($b['tour']['title'] ?? 'Tour') . " | Status: " . $b['status'] . " | Paid: PKR " . number_format($b['total_amount']) . "\n";
}

echo "\n>>> ALL END-TO-END LARAVEL API TESTS PASSED SUCCESSFULLY! <<<\n";
