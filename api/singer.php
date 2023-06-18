<?php

require_once '../db/connection.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT * FROM singer";

        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql .= " WHERE id = '$id'";
            $result = $conn->query($sql);
            $data = $result->fetch_assoc();
            $singer = [
                'id' => $data['id'],
                'name' => $data['name']
            ];
            echo json_encode($singer);
        } else {
            $list = [];
            $result = $conn->query($sql);
            foreach ($result as $row) {
                $list[] = [
                    'id' => $row['id'],
                    'name' => $row['name']
                ];
            }
            echo json_encode($list);
        }


        break;
    case 'POST':
        $name = $_POST['name'];
        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $sql = "UPDATE singer SET name = '$name' WHERE id = '$id'";
            $conn->query($sql);
            echo json_encode(['id' => $id, 'name' => $name]);
        } else {
            $sql = "INSERT INTO singer (id, name) VALUES (NULL, '$name')";
            $conn->query($sql);
            $id = mysqli_insert_id($conn);
            echo json_encode(['id' => $id, 'name' => $name]);
        }
        break;
    case 'DELETE':
        $id = $_GET['id'];

        $conn->query("DELETE FROM song 
                        WHERE album_id IN 
                        (SELECT id FROM album WHERE singer_id = '$id');");
        $conn->query("DELETE FROM album WHERE singer_id = '$id';");
        $conn->query("DELETE FROM singer WHERE id = '$id';");

        echo true;
        break;
}

$conn->close();
