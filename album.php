<?php

require_once 'db/connection.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT * FROM album";
        $list = [];
        $result = $conn->query($sql);
        foreach ($result as $row) {
            $list[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'singerId' => $row['singer_id']
            ];
        }
        echo json_encode($list);
        break;
    case 'POST':
        $name = $_POST['name'];
        $singerId = $_POST['singerId'];
        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $sql = "UPDATE album SET name = '$name', singer_id = '$singerId' WHERE id = '$id'";
            $conn->query($sql);
            echo json_encode(['id' => $id, 'name' => $name, 'singerId' => $singerId]);
        } else {
            $sql = "INSERT INTO album (id, name, singer_id) VALUES (NULL, '$name', '$singerId')";
            $conn->query($sql);
            $id = mysqli_insert_id($conn);
            echo json_encode(['id' => $id, 'name' => $name, 'singerId' => $singerId]);
        }
        break;
    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM album WHERE id = $id";
        $conn->query($sql);
        echo true;
        break;
}

$conn->close();
