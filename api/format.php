<?php

function formatSong($data)
{
    return [
        'id' => $data['id'],
        'name' => $data['name'],
        'text' => $data['text'],

        'album' => [
            'id' => $data['album_id'],
            'name' => $data['album_name'],
        ],

        'singer' => [
            'id' => $data['singer_id'],
            'name' => $data['singer_name'],
        ]
    ];
}
