<?php

require_once '../db/connection.php';
require_once '../db/song.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $song = getSong($id);
            echo json_encode($song);
        } else {
            $list = getSongs(isset($_GET['albumId']) ? $_GET['albumId'] : null);
            echo json_encode($list);
        }
        break;

    case 'POST':
        $name = $_POST['name'];
        $text = $_POST['text'];
        $albumId = $_POST['albumId'];
        $yandexId = $_POST['yandexId'];
        $popular = (int) $_POST['popular'];

        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $song = updateSong($id, $name, $text, $albumId, $yandexId, $popular);
            echo json_encode($song);
        } else {
            $song = createSong($name, $text, $albumId, $yandexId, $popular);
            echo json_encode($song);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        deleteSong($id);
        echo 1;
        break;
}

$conn->close();
