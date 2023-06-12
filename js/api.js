function request(url, config) {
  const { method = "GET", body } = config || {};
  const params = {
    method,
  };
  if (body) {
    const fd = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      fd.append(key, value);
    });
    params.body = fd;
  }

  return fetch(url, params).then((res) => res.json());
}

export const api = {
  getSingersList: () => request("./api/singer.php"),
  getAlbumsList: () => request("./api/album.php"),
  getSongsList: () => request("./api/song.php"),

  createSinger: (name) =>
    request("./api/singer.php", {
      method: "POST",
      body: { name },
    }),
  updateSinger: (id, name) =>
    request("./api/singer.php", {
      method: "POST",
      body: {
        id,
        name,
      },
    }),
  deleteSinger: (id) =>
    request(`./api/singer.php?id=${id}`, { method: "DELETE" }),

  createAlbum: (name, singerId) =>
    request("./api/album.php", {
      method: "POST",
      body: { name, singerId },
    }),
  updateAlbum: (id, name, singerId) =>
    request("./api/album.php", {
      method: "POST",
      body: {
        id,
        name,
        singerId,
      },
    }),
  deleteAlbum: (id) =>
    request(`./api/album.php?id=${id}`, { method: "DELETE" }),

  createSong: (songData) => {
    const { name, text, albumId, url } = songData;
    return request("./api/song.php", {
      method: "POST",
      body: { name, text, albumId, url },
    });
  },
  updateSong: (songData) => {
    const { id, name, text, albumId, url } = songData;
    return request("./api/song.php", {
      method: "POST",
      body: {
        id,
        name,
        text,
        albumId,
        url,
      },
    });
  },
  deleteSong: (id) => request(`./api/song.php?id=${id}`, { method: "DELETE" }),
};
