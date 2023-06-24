<?php

require_once '../db/connection.php';

header('Content-Type: application/json; charset=utf-8');

$name = $_POST['name'];
$data = json_decode($_POST['data'], true);

foreach ($data as $singer) {
    $singer_yandex_id = $singer['id'];

    $check_sql = "SELECT id FROM singer WHERE yandex_id = '$singer_yandex_id'";
    $result = $conn->query($check_sql);

    if (!$result->num_rows) {
        $singer_tracks = $singer['tracks'];
        $tracks_array = explode(',', $singer_tracks);
        $singer_name = $singer['name'];

        $singer_sql = "INSERT INTO singer (id, name, yandex_id, popular_tracks) VALUES (NULL, '$singer_name', '$singer_yandex_id', '$singer_tracks') ON DUPLICATE KEY UPDATE yandex_id = '$singer_yandex_id'";
        $conn->query($singer_sql);
        $singer_id = mysqli_insert_id($conn);

        foreach ($singer['albums'] as $album) {
            $album_yandex_id = $album['id'];
            $album_name = $album['name'];
            $album_year = $album['year'];
            $album_sql = "INSERT INTO album (id, name, singer_id, year, yandex_id) VALUES (NULL, '$album_name', '$singer_id', '$album_year', '$album_yandex_id')";
            $conn->query($album_sql);
            $album_id = mysqli_insert_id($conn);

            $songs_sql = "INSERT INTO song 
                        (id, name, text, album_id, yandex_id, popular) 
                        VALUES ";

            foreach ($album['songs'] as $i => $song) {
                $song_yandex_id = $song['id'];
                $song_name = $song['name'];
                $song_text = $song['lyrics'];
                $song_popular = in_array($song_yandex_id, $tracks_array) ? 1 : 0;

                if ($i > 0) $songs_sql .= ', ';
                $songs_sql .= "(NULL, '$song_name', '$song_text', $album_id, '$song_yandex_id', $song_popular)";
            }

            $conn->query($songs_sql);
        }
    }
}

$conn->close();
