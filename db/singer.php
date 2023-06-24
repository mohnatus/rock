<?php

require_once 'connection.php';
require_once 'format.php';

function getSinger($id)
{
    global $conn;

    $sql = "SELECT * FROM singer
                WHERE singer.id = '$id'";

    $result = $conn->query($sql);
    $data = $result->fetch_assoc();
    $singer = formatSinger($data);
    return $singer;
}

function getSingers()
{
    global $conn;

    $sql = "SELECT * FROM singer";

    $list = [];
    $result = $conn->query($sql);
    foreach ($result as $row) {
        $list[] = formatSinger($row);
    }

    return $list;
}

function createSinger($name, $yandexId)
{
    global $conn;
    $sql = "INSERT INTO singer 
                (id, name, yandex_id) 
                VALUES 
                (NULL, '$name', '$yandexId')";
    $conn->query($sql);
    $id = mysqli_insert_id($conn);

    return getSinger($id);
}

function updateSinger($id, $name, $yandexId)
{
    global $conn;
    $sql = "UPDATE singer SET 
                    name = '$name', 
                    yandex_id = '$yandexId',
                    WHERE id = '$id'";
    $conn->query($sql);

    return getSinger($id);
}

function deleteSinger($id)
{
    global $conn;

    $conn->query("DELETE FROM song 
            WHERE album_id IN 
            (SELECT id FROM album WHERE singer_id = '$id');");
    $conn->query("DELETE FROM album WHERE singer_id = '$id';");
    $conn->query("DELETE FROM singer WHERE id = '$id';");
}
