<?php

$raw = file_get_contents("http://localhost:5984/userprofile/_all_docs?include_docs=true&limit=10");
header("Content-Type: application/json");
echo $raw;
