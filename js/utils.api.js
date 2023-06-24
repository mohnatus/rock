export function request(url, config) {
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

const root = "/russian-rock/api";
const singerEndpoint = `${root}/singer.php`;
const albumEndpoint = `${root}/album.php`;
const songEndpoint = `${root}/song.php`;

export const api = {
  singer: {
    getItem: (id) => request(`${root}/singer.php?id=${id}`),
    getList: () => request(singerEndpoint),
    createItem: (name, yandexId) =>
      request(singerEndpoint, {
        method: "POST",
        body: { name, yandexId },
      }),
    updateItem: (id, name, yandexId) =>
      request(singerEndpoint, {
        method: "POST",
        body: {
          id,
          name,
          yandexId,
        },
      }),
    deleteItem: (id) =>
      request(`${singerEndpoint}?id=${id}`, { method: "DELETE" }),
  },
  album: {
    getItem: (id) => request(`${albumEndpoint}?id=${id}`),
    getList: ({ singerId }) => request(`${albumEndpoint}?singerId=${singerId}`),
    createItem: ({ name, year, singerId, yandexId }) =>
      request(albumEndpoint, {
        method: "POST",
        body: { name, singerId, year, yandexId },
      }),
    updateItem: ({ id, name, year, singerId, yandexId }) =>
      request(albumEndpoint, {
        method: "POST",
        body: {
          id,
          name,
          singerId,
          year,
          yandexId,
        },
      }),
    deleteItem: (id) => request(`${endpoint}?id=${id}`, { method: "DELETE" }),
  },
  song: {
    getItem: (id) => request(`${songEndpoint}?id=${id}`),
    getList: ({ albumId }) => request(`${songEndpoint}?albumId=${albumId}`),
    createItem: ({ name, text, albumId, yandexId, popular }) =>
      request(songEndpoint, {
        method: "POST",
        body: { name, text, yandexId, albumId, popular },
      }),
    updateItem: ({ id, name, text, albumId, yandexId, popular }) =>
      request(songEndpoint, {
        method: "POST",
        body: {
          id,
          name,
          albumId,
          text,
          yandexId,
          popular: popular ? 1 : 0,
        },
      }),
    deleteItem: (id) =>
      request(`${songEndpoint}?id=${id}`, { method: "DELETE" }),
  },
};
