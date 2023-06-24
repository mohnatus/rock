<?php

require_once '../db/connection.php';
require_once '../db/album.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $album = getAlbum($id);
            echo json_encode($album);
        } else {
            $list = getAlbums(isset($_GET['singerId']) ? $_GET['singerId'] : null);
            echo json_encode($list);
        }
        break;

    case 'POST':
        $name = $_POST['name'];
        $singerId = $_POST['singerId'];
        $year = $_POST['year'];
        $yandexId = $_POST['yandexId'];

        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $album = updateAlbum($id, $name, $year, $singerId, $yandexId);
            echo json_encode($album);
        } else {
            $album = createAlbum($name, $year, $singerId, $yandexId);
            echo json_encode($album);
        }
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        deleteAlbum($id);
        echo 1;
        break;
}

$conn->close();
