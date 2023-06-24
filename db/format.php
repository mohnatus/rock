<?php

$select_album_data = "album.id as album_id, 
                        album.name as album_name,
                        album.year as album_year,
                        album.yandex_id as album_yandex_id";

$select_singer_data = "singer.id as singer_id, 
                        singer.name as singer_name,
                        singer.yandex_id as singer_yandex_id";

$select_song_full_data = "SELECT song.*, $select_album_data, $select_singer_data 
                            FROM song 
                            JOIN album ON album.id = song.album_id
                            JOIN singer ON singer.id = album.singer_id";

$select_album_full_data = "SELECT album.*, $select_singer_data 
                            FROM album
                            JOIN singer on singer.id = album.singer_id";

function formatSong($data)
{
    return [
        'test' => 'test',
        'id' => $data['id'],
        'name' => $data['name'],
        'text' => $data['text'],
        'yandexId' => $data['yandex_id'],
        'popular' => $data['popular'] == '1' ? true : false,

        'album' => [
            'id' => $data['album_id'],
            'name' => $data['album_name'],
            'year' => $data['album_year'],
            'yandexId' => $data['album_yandex_id']
        ],

        'singer' => [
            'id' => $data['singer_id'],
            'name' => $data['singer_name'],
            'yandexId' => $data['singer_yandex_id']
        ]
    ];
}

function formatAlbum($data)
{
    return [
        'id' => $data['id'],
        'name' => $data['name'],
        'year' => $data['year'],
        'yandexId' => $data['yandex_id'],

        'singer' => [
            'id' => $data['singer_id'],
            'name' => $data['singer_name'],
            'yandexId' => $data['singer_yandex_id']
        ]
    ];
}

function formatSinger($data)
{
    return [
        'id' => $data['id'],
        'name' => $data['name'],
        'yandexId' => $data['yandex_id'],
    ];
}
