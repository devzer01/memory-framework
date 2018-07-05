<?php

include_once 'config.php';
include_once 'vendor/autoload.php';

function parse_signed_request($signed_request)
{
    list($encoded_sig, $payload) = explode('.', $signed_request, 2);

    $secret = APPSECRET; // Use your app secret here

    // decode the data
    $sig = base64_url_decode($encoded_sig);
    $data = json_decode(base64_url_decode($payload), true);

    // confirm the signature
    $expected_sig = hash_hmac('sha256', $payload, $secret, $raw = true);
    if ($sig !== $expected_sig) {
        error_log('Bad Signed JSON signature!');
        return null;
    }

    return $data;
}

function base64_url_decode($input)
{
    return base64_decode(strtr($input, '-_', '+/'));
}

if ($_POST['signed_request']) {
    $auth = parse_signed_request($_POST['signed_request']);
}
### ANON DSN
$couchDsn = "http://admin:couchdb@localhost:5984/";
### AUTHENTICATED DSN
//$couchDsn = "http://admin:adminPwd@localhost:5984/";
$couchDB = "userprofile1";
//Import required libraries
use PHPOnCouch\CouchClient;
use PHPOnCouch\Exceptions\CouchException;

$client = new CouchClient($couchDsn,$couchDB);

file_put_contents("deauth.txt", print_r($auth, true));
try {
    $_doc = $client->getDoc($auth['user_id']);
    $client->deleteDoc($_doc);    
$response = $client->storeDoc($_doc);
} catch (Exception $e) {
//    $response = $client->storeDoc($doc);
}
