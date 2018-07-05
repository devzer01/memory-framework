<?php

include_once 'vendor/autoload.php';

### ANON DSN
$couchDsn = "http://admin:couchdb@localhost:5984/";
### AUTHENTICATED DSN
//$couchDsn = "http://admin:adminPwd@localhost:5984/";
$couchDB = "userprofile1";
//Import required libraries
use PHPOnCouch\CouchClient;
use PHPOnCouch\Exceptions\CouchException;

$client = new CouchClient($couchDsn,$couchDB);

try {
    $result = $client->createDatabase();
} catch(Exception $e){
}

$raw = file_get_contents('php://input');
$doc = json_decode($raw);
$doc->_id = $doc->user->id;
try {
    $_doc = $client->getDoc($doc->_id);
    $_doc->rev = time();
    $response = $client->storeDoc($_doc);
} catch (Exception $e) {
    $response = $client->storeDoc($doc);
}


echo json_encode($response);
