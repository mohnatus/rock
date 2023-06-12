<?php

require_once '../db/connection.php';

header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT song.id as song_id, 
                song.name as song_name, 
                song.text as song_text, 
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

$song = [
    'id' => $data['song_id'],
    'name' => $data['song_name'],
    'text' => $data['song_text'],

    'album' => [
        'id' => $data['album_id'],
        'name' => $data['album_name'],
    ],

    'singer' => [
        'id' => $data['singer_id'],
        'name' => $data['singer_name'],
    ]
];

echo json_encode($song);

$conn->close();
