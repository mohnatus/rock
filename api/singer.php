<?php

require_once '../db/connection.php';
require_once '../db/singer.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT * FROM singer";

        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $singer = getSinger($id);
            echo json_encode($singer);
        } else {
            $list = getSingers();
            echo json_encode($list);
        }
        break;

    case 'POST':
        $name = $_POST['name'];
        $yandexId = $_POST['yandex_id'];

        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $singer = updateSinger($id, $name, $yandexId);
            echo json_encode($singer);
        } else {
            $singer = createSinger($name, $yandexId);
            echo json_encode($singer);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];

        deleteSinger($id);

        echo 1;
        break;
}

$conn->close();
