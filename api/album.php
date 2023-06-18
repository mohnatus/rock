<?php

require_once '../db/connection.php';

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['id'])) {

            $id = $_GET['id'];
            $sql = "SELECT album.*, singer.name as singer_name
                    FROM album 
                    JOIN singer ON singer.id = album.singer_id
                    WHERE album.id = '$id'";
            $result = $conn->query($sql);
            $data = $result->fetch_assoc();

            $album = [
                'id' => $data['id'],
                'name' => $data['name'],
                'singer' => [
                    'id' => $data['singer_id'],
                    'name' => $data['singer_name']
                ]
            ];
            echo json_encode($album);
        } else {
            $sql = "SELECT * FROM album";

            if (isset($_GET['singerId'])) {
                $singerId = $_GET['singerId'];
                $sql .= " WHERE singer_id = '$singerId'";
            }

            $list = [];
            $result = $conn->query($sql);
            foreach ($result as $row) {
                $list[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'singerId' => $row['singer_id'],
                    'year' => $row['year']
                ];
            }
            echo json_encode($list);
        }

        break;
    case 'POST':
        $name = $_POST['name'];
        $singerId = $_POST['singerId'];
        $year = $_POST['year'];

        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $sql = "UPDATE album SET 
                    name = '$name', 
                    singer_id = '$singerId',
                    year = '$year' 
                    WHERE id = '$id'";
            $conn->query($sql);
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'singerId' => $singerId,
                'year' => $year
            ]);
        } else {
            $sql = "INSERT INTO album (id, name, singer_id, year) VALUES (NULL, '$name', '$singerId', '$year')";
            $conn->query($sql);
            $id = mysqli_insert_id($conn);
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'singerId' => $singerId,
                'year' => $year
            ]);
        }
        break;
    case 'DELETE':
        $id = $_GET['id'];
        $conn->query("DELETE from song WHERE album_id = '$id'");
        $conn->query("DELETE FROM album WHERE id = '$id'");
        echo true;
        break;
}

$conn->close();
