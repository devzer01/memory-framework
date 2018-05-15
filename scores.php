<?php

include_once 'vendor/autoload.php';
$couchDsn = "http://localhost:5984/";
$couchDB = "userprofile";

use PHPOnCouch\CouchClient;
use PHPOnCouch\Exceptions\CouchException;
$client = new CouchClient($couchDsn, $couchDB);
if (count($client->getIndexes()) === 0) {
    $client->createIndex(['score', 'user.id']);
}
$scores = $client->getAllDocs();
echo json_encode($scores);