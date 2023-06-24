<?php

require_once '../db/connection.php';
require_once '../db/format.php';

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// GET: count,singer,album,popular

$count = isset($_GET['count']) ? $_GET['count'] : 1;
$where = "LENGTH(song.text) > 0";

if (isset($_GET['popular']) && $_GET['popular'] == '1') {
    $where .= " AND song.popular = 1";
}

if (isset($_GET['album'])) {
    $albumId = $_GET['album'];
    $where .= " AND album.id = '$albumId'";
}

if (isset($_GET['singer'])) {
    $singerId = $_GET['singer'];
    $where .= " AND singer.id = '$singerId'";
}

$sql = "$select_song_full_data
        WHERE $where
        ORDER BY RAND() LIMIT $count";

$result = $conn->query($sql);

$list = [];
foreach ($result as $row) {
    $list[] = formatSong($row);
}
echo json_encode($list);

$conn->close();
