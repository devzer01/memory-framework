<?php

$raw = json_decode(file_get_contents("http://localhost:5984/userprofile1/_all_docs?include_docs=true&limit=10"));
$r1 = array_map(function ($row) {
	$user = $row->doc->user;
	$user->score = $row->doc->score;
	$user->peek = $row->doc->peek;
	return $row->doc->user;
}, $raw->rows);
header("Content-Type: application/json");
echo json_encode($r1);
