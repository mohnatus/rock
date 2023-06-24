<?php

require_once 'connection.php';
require_once 'format.php';

function getSong($id)
{
    global $conn, $select_song_full_data;

    $sql = "$select_song_full_data
                WHERE song.id = '$id'";

    $result = $conn->query($sql);
    $data = $result->fetch_assoc();

    $song = formatSong($data);
    return $song;
}

function getSongs($albumId)
{
    global $conn, $select_song_full_data;

    $sql = $select_song_full_data;

    if ($albumId) {
        $sql .= " WHERE song.album_id = $albumId";
    }

    $list = [];
    $result = $conn->query($sql);
    foreach ($result as $row) {
        $list[] = formatSong($row);
    }

    return $list;
}

function createSong($name, $text, $albumId, $yandexId, $popular)
{
    global $conn;

    $sql = "INSERT INTO song 
                (id, name, text, album_id, yandex_id, popular) 
                VALUES 
                (NULL, '$name', '$text', $albumId, '$yandexId', $popular)";

    $conn->query($sql);
    $id = mysqli_insert_id($conn);

    return getSong($id);
}

function updateSong($id, $name, $text, $albumId, $yandexId, $popular)
{
    global $conn;
    $sql = "UPDATE song 
            SET name = '$name', 
                    text = '$text', 
                    album_id = '$albumId', 
                    popular = '$popular',
                    yandex_id = '$yandexId'
                    
             WHERE id = '$id'";

    // echo $sql;

    $conn->query($sql);

    return getSong($id);
}

function deleteSong($id)
{
    global $conn;
    $sql = "DELETE FROM song WHERE id = $id";
    $conn->query($sql);
}