<?php

$raw = file_get_contents("http://cricket.pituwa.lk:5984/userprofile/_all_docs?include_docs=true&limit=10");
header("Content-Type: application/json");
echo $raw;
