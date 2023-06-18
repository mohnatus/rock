<?php

require_once '../db/connection.php';
require_once './format.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT song.*, album.name as album_name, singer.name as singer_name, singer.id as singer_id 
                FROM song
                JOIN album ON album.id = song.album_id
                JOIN singer ON singer.id = album.singer_id";
        if (isset($_GET['albumId'])) {
            $albumId = $_GET['albumId'];
            $sql .= " WHERE song.album_id = $albumId";
        }
        $list = [];
        $result = $conn->query($sql);
        foreach ($result as $row) {
            $list[] = formatSong($row);
        }
        echo json_encode($list);
        break;
    case 'POST':
        $name = $_POST['name'];
        $text = $_POST['text'];
        $albumId = $_POST['albumId'];
        $url = $_POST['url'];

        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $sql = "UPDATE song SET 
                    name = '$name', 
                    text = '$text', 
                    album_id = '$albumId', 
                    url = '$url' 
                    WHERE id = '$id'";
            $conn->query($sql);
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'text' => $text,
                'albumId' => $albumId,
                'url' => $url
            ]);
        } else {
            $sql = "INSERT INTO song 
                (id, name, text, album_id, url) 
                VALUES 
                (NULL, '$name', '$text', '$albumId', '$url'
            )";
            $conn->query($sql);
            $id = mysqli_insert_id($conn);
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'text' => $text,
                'albumId' => $albumId,
                'url' => $url
            ]);
        }
        break;
    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM song WHERE id = $id";
        $conn->query($sql);
        echo true;
        break;
}

$conn->close();
