<?php
DEFINE('MAXFILESIZE', 1024); 	// in kb
DEFINE('MAXTIMEOUT', 120);	// timeout in seconds
DEFINE('FILE_ERRORLOG', './cors-proxy.log'); // or '/var/log/cors-proxy.log'
DEFINE('SSL_VERIFYPEER', false);	// SSL is insecure in many ways, use at your own risk

$arrSourceWhitelist = array('cyborgshell.com', 'cyborgdesktop.com', 'localhost');
//$arrDestinationWhitelist = array('api.anthropic.com', 'api.openai.com', 'google.com', 'generativelanguage.googleapis.com');
$arrDestinationWhitelist = array();

// Minimal CORS Proxy - Run your own instead of trusting third parties
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-api-key, anthropic-version');
//header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') 
{
	http_response_code(200);
    exit(0);
}

$strURL = '';
if (isset($_GET['url']))
{
	$strURL = $_GET['url'];
}

if (!$strURL || !filter_var($strURL, FILTER_VALIDATE_URL)) 
{
    http_response_code(400);
    echo json_encode(array('error' => 'Invalid URL'));
    exit;
}

// Check source whitelist
$strReferer = '';
if (isset($_SERVER['HTTP_REFERER']))
{
	$strReferer = $_SERVER['HTTP_REFERER'];
}

if ($strReferer) 
{
    $objRefererParsed = parse_url($strReferer);
    if ((count($arrSourceWhitelist) > 0) && (!in_array($objRefererParsed['host'], $arrSourceWhitelist))) 
	{
        file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Permission Denied: " . $_SERVER['REMOTE_ADDR'] . " from " . $strReferer . "\n", FILE_APPEND | LOCK_EX);
        http_response_code(403);
        echo json_encode(array('error' => 'Permission Denied'));
        exit;
    }
}

// Check destination whitelist
$objParsed = parse_url($strURL);
if ((count($arrDestinationWhitelist) > 0) && (!in_array($objParsed['host'], $arrDestinationWhitelist))) 
{
    file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Host not allowed: " . $_SERVER['REMOTE_ADDR'] . " -> " . $strURL . "\n", FILE_APPEND | LOCK_EX);
    http_response_code(403);
    echo json_encode(array('error' => 'Host not allowed'));
    exit;
}

// Initialize cURL
$objCurl = curl_init();
curl_setopt($objCurl, CURLOPT_URL, $strURL);
curl_setopt($objCurl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($objCurl, CURLOPT_FOLLOWLOCATION, true);

curl_setopt($objCurl, CURLOPT_SSL_VERIFYPEER, SSL_VERIFYPEER);
//curl_setopt($objCurl, CURLOPT_SSL_VERIFYPEER, false);	// QUICK TEST
//curl_setopt($objCurl, CURLOPT_SSL_VERIFYHOST, false);	// QUICK TEST

curl_setopt($objCurl, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($objCurl, CURLOPT_MAXFILESIZE, MAXFILESIZE * 1024);
curl_setopt($objCurl, CURLOPT_TIMEOUT, MAXTIMEOUT);

// Read raw body once (for POST data and token extraction)
$rawBody = file_get_contents('php://input');

// Handle POST data
if ($_SERVER['REQUEST_METHOD'] !== 'GET') 
{
    curl_setopt($objCurl, CURLOPT_POSTFIELDS, $rawBody);
}

file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Received Headers: " . print_r(getallheaders(), true) . "\n", FILE_APPEND | LOCK_EX);
file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - JSON Request Body: " . $rawBody . "\n", FILE_APPEND | LOCK_EX);

// Forward headers (excluding problematic ones)
$arrHeaders = array();
if (function_exists('getallheaders')) 
{
    foreach (getallheaders() as $strKey => $strValue) 
    {
        if (!in_array(strtolower($strKey), array('host', 'connection', 'accept-encoding', 'content-length'))) 
        {
            // Sanitize header values to prevent injection
            //$strKey = preg_replace('/[^\w-]/', '', $strKey);
            //$strValue = preg_replace('/[\r\n\t]/', '', $strValue);
            $arrHeaders[] = $strKey . ": " . $strValue;
        }
    }
}
else 
{
    // Fallback for PHP 5.4 setups without getallheaders()
    foreach ($_SERVER as $strKey => $strValue) 
    {
        if (substr($strKey, 0, 5) == 'HTTP_') 
        {
            $strHeaderName = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($strKey, 5)))));
            if (!in_array(strtolower($strHeaderName), array('host', 'connection', 'accept-encoding', 'content-length'))) 
            {
                //$strValue = preg_replace('/[\r\n\t]/', '', $strValue);
                $arrHeaders[] = $strHeaderName . ": " . $strValue;
            }
        }
    }
}

// Extract bearer token from JSON body if present
$objPayload = json_decode($rawBody, true);
file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - JSON Request Received: " . print_r($objPayload, true) . "\n", FILE_APPEND | LOCK_EX);

$strBearer = null;
if (is_array($objPayload)) 
{
    $strBearer = isset($objPayload['bearer']) ? $objPayload['bearer'] : 
                 (isset($objPayload['api_key']) ? $objPayload['api_key'] : null);
    
    // Remove bearer and api_key from payload before sending to API
    unset($objPayload['bearer']);
    unset($objPayload['api_key']);
}

file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Extracted Bearer: " . ($strBearer ? 'FOUND' : 'NOT FOUND') . "\n", FILE_APPEND | LOCK_EX);

// Remove any existing Authorization headers to prevent duplicates
$arrHeaders = array_filter($arrHeaders, function($strHeader) {
    return stripos($strHeader, 'Authorization:') !== 0;
});

// Always add Authorization header from JSON bearer if available
if (!empty($strBearer)) 
{
    $arrHeaders[] = 'Authorization: Bearer ' . $strBearer;
}

// Update the POST body with cleaned payload (bearer removed)
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && is_array($objPayload)) 
{
    $rawBody = json_encode($objPayload);
    curl_setopt($objCurl, CURLOPT_POSTFIELDS, $rawBody);
}

curl_setopt($objCurl, CURLOPT_HTTPHEADER, $arrHeaders);
file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Passed-on headers: " . print_r($arrHeaders, true) . "\n", FILE_APPEND | LOCK_EX);


// Execute request
$strResponse = curl_exec($objCurl);

// Check for cURL errors
if (curl_error($objCurl)) 
{
    file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Curl error: " . curl_error($objCurl) . " for URL: " . $strURL . "\n", FILE_APPEND | LOCK_EX);
    http_response_code(500);
    echo json_encode(array('error' => 'Request failed: ' . curl_error($objCurl)));
    curl_close($objCurl);
    exit;
}

$intHttpCode = curl_getinfo($objCurl, CURLINFO_HTTP_CODE);
curl_close($objCurl);

http_response_code($intHttpCode);

file_put_contents(FILE_ERRORLOG, date('Y-m-d H:i:s') . " - Reponse: " . $strResponse . "\n", FILE_APPEND | LOCK_EX);

header('Content-Type: application/json; charset=utf-8');
echo $strResponse;
?>