<?php

require_once '../db/connection.php';
require_once './format.php';

header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT song.*, 
                album.id as album_id, 
                album.name as album_name,
                singer.id as singer_id, 
                singer.name as singer_name
        FROM song 
        JOIN album ON song.album_id = album.id 
        JOIN singer ON singer.id = album.singer_id
        ORDER BY RAND() LIMIT 1";

$result = $conn->query($sql);
$data = $result->fetch_assoc();
$song = formatSong($data);

echo json_encode($song);

$conn->close();
