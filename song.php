<?php

require_once 'db/connection.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT * FROM song";
        $list = [];
        $result = $conn->query($sql);
        foreach ($result as $row) {
            $list[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'text' => $row['text'],
                'albumId' => $row['album_id']
            ];
        }
        echo json_encode($list);
        break;
    case 'POST':
        $name = $_POST['name'];
        $text = $_POST['text'];
        $albumId = $_POST['albumId'];
        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $sql = "UPDATE song SET name = '$name', text = '$text', album_id = '$albumId' WHERE id = '$id'";
            $conn->query($sql);
            echo json_encode(['id' => $id, 'name' => $name, 'text' => $text, 'albumId' => $albumId]);
        } else {
            $sql = "INSERT INTO song (id, name, text, album_id) VALUES (NULL, '$name', '$text', '$albumId')";
            $conn->query($sql);
            $id = mysqli_insert_id($conn);
            echo json_encode(['id' => $id, 'name' => $name, 'text' => $text, 'albumId' => $albumId]);
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
