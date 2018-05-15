<?php

include_once 'vendor/autoload.php';
$couchDsn = "http://localhost:5984/";
$couchDB = "userprofile";

use PHPOnCouch\CouchClient;
use PHPOnCouch\Exceptions\CouchException;
$client = new CouchClient($couchDsn,$couchDB);


$raw = file_get_contents('php://input');
try {
    $doc = json_decode($raw);
    $_doc = $client->getDoc($doc->_id);
    $_doc->score = $doc->score;
    $_doc->peek = $doc->peek;
    $_doc->rev = time();
    $response = $client->storeDoc($_doc);
} catch (Exception $e) {

}
echo json_encode($response);