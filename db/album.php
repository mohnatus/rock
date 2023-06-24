<?php

require_once 'connection.php';
require_once 'format.php';

function getAlbum($id)
{
    global $conn, $select_album_full_data;

    $sql = "$select_album_full_data
                WHERE album.id = '$id'";
    $result = $conn->query($sql);
    $data = $result->fetch_assoc();
    $album = formatAlbum($data);
    return $album;
}

function getAlbums($singerId)
{
    global $conn, $select_album_full_data;

    $sql = $select_album_full_data;

    if ($singerId) {
        $sql .= " WHERE album.singer_id = $singerId";
    }

    $list = [];
    $result = $conn->query($sql);
    foreach ($result as $row) {
        $list[] = formatAlbum($row);
    }

    return $list;
}

function createAlbum($name, $year, $singerId, $yandexId)
{
    global $conn;

    $sql = "INSERT INTO album 
                (id, name, year, singer_id, yandex_id) 
                VALUES 
                (NULL, '$name', '$year', $singerId, '$yandexId')";

    $conn->query($sql);
    $id = mysqli_insert_id($conn);

    return getAlbum($id);
}

function updateAlbum($id, $name, $year, $singerId, $yandexId)
{
    global $conn;
    $sql = "UPDATE album SET 
                    name = '$name', 
                    year = '$year', 
                    singer_id = '$singerId', 
                    yandex_id = '$yandexId',
                    WHERE id = '$id'";

    $conn->query($sql);

    return getAlbum($id);
}

function deleteAlbum($id)
{
    global $conn;
    
    $conn->query("DELETE from song WHERE album_id = '$id'");
    $conn->query("DELETE FROM album WHERE id = '$id'");
}
