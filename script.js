let unique = 9;

const testData = {
  singers: [
    { id: 1, name: "Алиса" },
    { id: 2, name: "Кино" },
    { id: 3, name: "ДДТ" },
  ],
  albums: [
    { id: 4, name: "Алиса-1", singerId: 1 },
    { id: 5, name: "Алиса-2", singerId: 1 },
    { id: 6, name: "Кино-1", singerId: 2 },
    { id: 7, name: "ДДТ-1", singerId: 3 },
  ],
  songs: [
    {
      id: 8,
      name: "Song 1",
      albumId: 4,
    },
  ],
};

const data = {
  singers: [],
  albums: [],
  songs: [],
};

const ids = {
  singersList: "singers-list",

  addSingerDialog: "add-singer-dialog",
  addSingerForm: "add-singer-form",
  addSingerButton: "add-singer",

  editSingerDialog: "edit-singer-dialog",
  editSingerForm: "edit-singer-form",

  addAlbumDialog: "add-album-dialog",
  addAlbumForm: "add-album-form",

  editAlbumDialog: "edit-album-dialog",
  editAlbumForm: "edit-album-form",

  addSongDialog: "add-song-dialog",
  addSongForm: "add-song-form",

  editSongDialog: "edit-song-dialog",
  editSongForm: "edit-song-form",
};

const elementsCache = {};

const classes = {
  loading: "loading",

  singersList: "singers-list",

  singer: "singer",
  singerHeader: "singer-header",
  singerName: "singer-name",
  singerActions: "singer-actions",
  singerRemove: "singer-remove",
  singerEdit: "singer-edit",
  singerAddAlbum: "singer-add-album",

  albumsList: "albums-list",
  album: "album",
  albumHeader: "album-header",
  albumName: "album-name",
  albumActions: "album-actions",
  albumRemove: "album-remove",
  albumEdit: "album-edit",

  songsList: "songs-list",
  song: "song",
  songName: "song-name",
  songActions: "song-actions",
  songRemove: "song-remove",
  songEdit: "song-edit",
};

/** UTILS */

function getElement(id) {
  if (!elementsCache[id]) {
    elementsCache[id] = document.getElementById(id);
  }

  return elementsCache[id];
}

function render(tagName, children, params) {
  const { className, attrs, text } = params || {};
  const $el = document.createElement(tagName);
  if (className) $el.classList.add(className);
  if (children) {
    children.forEach(($child) => $el.appendChild($child));
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      $el.setAttribute(key, value);
    });
  }
  if (text) {
    $el.innerHTML = text;
  }
  return $el;
}

function delay() {
  return new Promise((res) => {
    setTimeout(res, 500);
  });
}

function findSingerElement(id) {
  const $singer = document.querySelector(`.${classes.singer}[data-id="${id}"]`);
  return $singer;
}

function findAlbumElement(id) {
  const $album = document.querySelector(`.${classes.album}[data-id="${id}"]`);
  return $album;
}

function findSongElement(id) {
  const $song = document.querySelector(`.${classes.song}[data-id="${id}"]`);
  return $song;
}

function setLoadingStatus(status) {
  if (status) document.body.classList.add(classes.loading);
  else document.body.classList.remove(classes.loading);
}

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

/** API */

const API = {
  getSingersList: () => request("./singer.php"),
  getAlbumsList: () => request("./album.php"),
  getSongsList: () => request("./song.php"),

  createSinger: (name) =>
    request("./singer.php", {
      method: "POST",
      body: { name },
    }),
  updateSinger: (id, name) =>
    request("./singer.php", {
      method: "POST",
      body: {
        id,
        name,
      },
    }),
  deleteSinger: (id) => request(`./singer.php?id=${id}`, { method: "DELETE" }),

  createAlbum: (name, singerId) =>
    request("./album.php", {
      method: "POST",
      body: { name, singerId },
    }),
  updateAlbum: (id, name, singerId) =>
    request("./album.php", {
      method: "POST",
      body: {
        id,
        name,
        singerId,
      },
    }),
  deleteAlbum: (id) => request(`./album.php?id=${id}`, { method: "DELETE" }),

  createSong: (name, text, albumId) =>
    request("./song.php", {
      method: "POST",
      body: { name, text, albumId },
    }),
  updateSong: (id, name, text, albumId) =>
    request("./song.php", {
      method: "POST",
      body: {
        id,
        name,
        text,
        albumId,
      },
    }),
  deleteSong: (id) => request(`./song.php?id=${id}`, { method: "DELETE" }),
};

/** EFFECTS */

function updateSingersList($select) {
  $select.innerHTML = "";
  const fr = document.createDocumentFragment();
  fr.appendChild(render("option"));
  data.singers.forEach((singer) => {
    const $option = render("option", null, {
      attrs: {
        value: singer.id,
      },
      text: singer.name,
    });
    fr.appendChild($option);
  });
  $select.appendChild(fr);
}

function updateAlbumsList($select, singerId) {
  $select.innerHTML = "";
  const fr = document.createDocumentFragment();
  fr.appendChild(render("option"));
  const albums = data.albums.filter((a) => a.singerId === singerId);
  albums.forEach((album) => {
    const $option = render("option", null, {
      attrs: {
        value: album.id,
      },
      text: album.name,
    });
    fr.appendChild($option);
  });
  $select.appendChild(fr);
}

function linkSingerAndAlbum($singerSelect, $albumSelect) {
  $singerSelect.addEventListener("change", () => {
    const singerId = parseInt($singerSelect.value);
    updateAlbumsList($albumSelect, singerId);
  });
}

/** ACTIONS */

function openAddSingerDialog() {
  const $dialog = getElement(ids.addSingerDialog);
  $dialog.showModal();
}

function addSinger(name) {
  setLoadingStatus(true);

  API.createSinger(name).then((singerData) => {
    data.singers.push(singerData);
    const $singer = renderSinger(singerData);
    const $list = getElement(ids.singersList);
    $list.appendChild($singer);
    setLoadingStatus(false);
  });
}

function openEditSingerDialog(singerId) {
  const singer = data.singers.find((s) => s.id === singerId);

  const $form = getElement(ids.editSingerForm);
  const $dialog = getElement(ids.editSingerDialog);

  $form.elements.id.value = singer.id;
  $form.elements.name.value = singer.name;

  $dialog.showModal();
}

function editSinger(id, name) {
  setLoadingStatus(true);

  API.updateSinger(id, name).then((singerData) => {
    data.singers = data.singers.map((singer) => {
      if (singer.id === singerData.id) {
        return singerData;
      }
      return singer;
    });
    const $singer = findSingerElement(id);
    const $name = $singer.querySelector(`.${classes.singerName}`);
    $name.innerHTML = name;
    setLoadingStatus(false);
  });
}

function removeSinger(singerId) {
  setLoadingStatus(true);

  API.deleteSinger(id).then(() => {
    data.singers = data.singers.filter((s) => s.id !== singerId);
    const $singer = findSingerElement(singerId);
    if ($singer) $singer.remove();
    setLoadingStatus(false);
  });
}

function openAddAlbumDialog(singer) {
  const $form = getElement(ids.addAlbumForm);
  const $dialog = getElement(ids.addAlbumDialog);
  const $select = $form.elements.singer;

  updateSingersList($select);
  $form.elements.singer.value = singer.id;
  $dialog.showModal();
}

function addAlbum(name, singerId) {
  setLoadingStatus(true);

  API.createAlbum(name, singerId).then((albumData) => {
    data.albums.push(albumData);
    const $album = renderAlbum(albumData);
    const $singer = findSingerElement(singerId);
    const $albumsList = $singer.querySelector(`.${classes.albumsList}`);
    $albumsList.appendChild($album);
    setLoadingStatus(false);
  });
}

function openEditAlbumDialog(albumId) {
  const album = data.albums.find((a) => a.id === albumId);

  const $form = getElement(ids.editAlbumForm);
  const $dialog = getElement(ids.editAlbumDialog);
  const $select = $form.elements.singer;
  updateSingersList($select);
  $form.elements.id.value = album.id;
  $form.elements.name.value = album.name;
  $form.elements.singer.value = album.singerId;
  $dialog.showModal();
}

function editAlbum(id, name, singerId) {
  setLoadingStatus(true);
  API.updateAlbum(id, name, singerId).then((albumData) => {
    data.albums = data.albums.map((album) => {
      if (album.id === albumData.id) {
        return albumData;
      }
      return album;
    });
    const $album = findAlbumElement(id);
    const $name = $album.querySelector(`.${classes.albumName}`);
    $name.innerHTML = albumData.name;
    const $currentSinger = $album.closest(`.${classes.singer}`);
    if (parseInt($currentSinger.dataset.id) !== singerId) {
      const $singer = findSingerElement(albumData.singerId);
      const $albums = $singer.querySelector(`.${classes.albumsList}`);
      $albums.appendChild($album);
    }
    setLoadingStatus(false);
  });
}

function removeAlbum(albumId) {
  setLoadingStatus(true);
  API.deleteAlbum(albumId).then(() => {
    data.albums = data.albums.filter((a) => albumId !== a.id);
    const $album = document.querySelector(
      `.${classes.album}[data-id="${albumId}"]`
    );
    if ($album) $album.remove();
    setLoadingStatus(false);
  });
}

function openAddSongDialog(albumId) {
  const $form = getElement(ids.addSongForm);
  const $dialog = getElement(ids.addSongDialog);

  const album = data.albums.find((a) => a.id === albumId);
  const singerId = album.singerId;

  updateSingersList($form.elements.singer);
  $form.elements.singer.value = singerId;

  updateAlbumsList($form.elements.album, singerId);
  $form.elements.album.value = albumId;

  $dialog.showModal();
}

function addSong(name, text, albumId) {
  setLoadingStatus(true);

  API.createSong(name, text, albumId).then((songData) => {
    data.songs.push(songData);
    const album = data.albums.find((a) => a.id === songData.albumId);
    const $album = findAlbumElement(album.id);
    const $songs = $album.querySelector(`.${classes.songsList}`);
    const $song = renderSong(songData);
    $songs.appendChild($song);
    setLoadingStatus(false);
  });
}

function openEditSongDialog(songId) {
  const $form = getElement(ids.editSongForm);
  const $dialog = getElement(ids.editSongDialog);

  const song = data.songs.find((s) => s.id === songId);

  $form.elements.id.value = song.id;
  $form.elements.name.value = song.name;
  $form.elements.text.value = song.text;

  const album = data.albums.find((a) => a.id === song.albumId);
  const singerId = album.singerId;

  updateSingersList($form.elements.singer);
  $form.elements.singer.value = singerId;

  updateAlbumsList($form.elements.album, singerId);
  $form.elements.album.value = song.albumId;

  $dialog.showModal();
}

function editSong(id, name, text, albumId) {
  setLoadingStatus(true);

  API.updateSong(id, name, text, albumId).then((songData) => {
    data.songs = data.songs.map((song) => {
      if (song.id === id) {
        return songData;
      }
      return song;
    });

    const $song = findSongElement(songData.id);
    const $name = $song.querySelector(`.${classes.songName}`);
    $name.innerHTML = name;
    const $currentAlbum = $album.closest(`.${classes.album}`);
    if (parseInt($currentAlbum.dataset.id) !== songData.albumId) {
      const $album = findSingerElement(songData.albumId);
      const $songs = $album.querySelector(`.${classes.songsList}`);
      $songs.appendChild($song);
    }

    setLoadingStatus(false);
  });
}

function removeSong(songId) {
  setLoadingStatus(true);

  API.deleteSong(songId).then(() => {
    data.songs = data.songs.filter((s) => songId !== s.id);
    const $song = document.querySelector(
      `.${classes.song}[data-id="${songId}"]`
    );
    if ($song) $song.remove();
    setLoadingStatus(false);
  });
}

/** RENDER */

function renderSong(song) {
  const $name = render("div", null, {
    className: classes.songName,
    text: song.name,
  });
  const $remove = render("button", null, {
    attrs: {
      type: "button",
    },
    className: classes.songRemove,
    text: "&times;",
  });
  const $edit = render("button", null, {
    attrs: {
      type: "button",
    },
    className: classes.songEdit,
    text: "EDIT",
  });
  const $actions = render("div", [$edit, $remove], {
    className: classes.songActions,
  });
  const $el = render("div", [$name, $actions], {
    className: classes.song,
    attrs: { "data-id": song.id, "data-album-id": song.albumId },
  });

  $remove.addEventListener("click", () => {
    removeSong(song.id);
  });

  $edit.addEventListener("click", () => {
    openEditSongDialog(song.id);
  });

  return $el;
}

function renderAlbum(album) {
  const $name = render("div", null, {
    className: classes.albumName,
    text: album.name,
  });
  const $remove = render("button", null, {
    attrs: {
      type: "button",
    },
    className: classes.albumRemove,
    text: "&times;",
  });
  const $edit = render("button", null, {
    attrs: {
      type: "button",
    },
    text: "EDIT",
  });
  const $addSong = render("button", null, {
    attrs: {
      type: "button",
    },
    text: "ADD SONG",
  });
  const $actions = render("div", [$addSong, $edit, $remove], {
    className: classes.albumActions,
  });
  const $header = render("div", [$name, $actions], {
    className: classes.albumHeader,
  });

  const albumSongs = data.songs.filter((song) => song.albumId === album.id);
  const $songs = render(
    "div",
    albumSongs.map((song) => {
      return renderSong(song);
    }),
    {
      className: classes.songsList,
    }
  );

  const $el = render("div", [$header, $songs], {
    className: classes.album,
    attrs: { "data-id": album.id, "data-singer-id": album.singerId },
  });

  $edit.addEventListener("click", () => {
    openEditAlbumDialog(album.id);
  });

  $remove.addEventListener("click", () => {
    removeAlbum(album.id);
  });

  $addSong.addEventListener("click", () => {
    openAddSongDialog(album.id);
  });

  return $el;
}

function renderSinger(singer) {
  const $name = render("div", null, {
    className: classes.singerName,
    text: singer.name,
  });
  const $remove = render("button", null, {
    attrs: { type: "button" },
    className: classes.singerRemove,
    text: "&times;",
  });
  const $edit = render("button", null, {
    text: "EDIT",
    className: classes.singerEdit,
    attrs: { type: "button" },
  });
  const $addAlbum = render("button", null, {
    text: "ADD ALBUM",
    className: classes.singerAddAlbum,
    attrs: { type: "button" },
  });
  const $actions = render("div", [$addAlbum, $edit, $remove], {
    className: classes.singerActions,
  });
  const $header = render("div", [$name, $actions], {
    className: classes.singerHeader,
  });

  const singerAlbums = data.albums.filter(
    (album) => album.singerId === singer.id
  );
  const $albums = render(
    "div",
    singerAlbums.map((album) => {
      return renderAlbum(album);
    }),
    {
      className: classes.albumsList,
      attrs: { "data-singer-id": singer.id },
    }
  );
  const $el = render("div", [$header, $albums], {
    className: classes.singer,
    attrs: { "data-id": singer.id },
  });

  $remove.addEventListener("click", () => {
    removeSinger(singer.id);
  });

  $edit.addEventListener("click", () => {
    openEditSingerDialog(singer.id);
  });

  $addAlbum.addEventListener("click", () => {
    openAddAlbumDialog(singer);
  });

  return $el;
}

function renderSingersList() {
  const $list = getElement(ids.singersList);
  const fr = document.createDocumentFragment();
  data.singers.forEach((singer) => {
    const $singer = renderSinger(singer);
    fr.appendChild($singer);
  });
  $list.innerHTML = "";
  $list.appendChild(fr);
}

/** INIT */

function initAddSingerButton() {
  const $button = getElement(ids.addSingerButton);

  $button.addEventListener("click", () => {
    openAddSingerDialog();
  });
}

function initAddSingerForm() {
  const $form = getElement(ids.addSingerForm);
  const $dialog = getElement(ids.addSingerDialog);

  function submitHandler(event) {
    event.preventDefault();
    const name = $form.elements.name.value;

    addSinger(name);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", submitHandler);
}

function initEditSingerForm() {
  const $form = getElement(ids.editSingerForm);
  const $dialog = getElement(ids.editSingerDialog);

  function handler(event) {
    event.preventDefault();

    const singerId = parseInt($form.elements.id.value);
    const singerName = $form.elements.name.value.trim();

    editSinger(singerId, singerName);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function initAddAlbumForm() {
  const $dialog = getElement(ids.addAlbumDialog);
  const $form = getElement(ids.addAlbumForm);

  function handler(event) {
    event.preventDefault();

    const name = $form.elements.name.value;
    const singerId = $form.elements.singer.value;

    addAlbum(name, singerId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function initEditAlbumForm() {
  const $dialog = getElement(ids.editAlbumDialog);
  const $form = getElement(ids.editAlbumForm);

  function handler(event) {
    event.preventDefault();

    const albumId = parseInt($form.elements.id.value);
    const name = $form.elements.name.value;
    const singerId = parseInt($form.elements.singer.value);

    editAlbum(albumId, name, singerId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function initAddSongForm() {
  const $form = getElement(ids.addSongForm);
  const $dialog = getElement(ids.addSongDialog);

  linkSingerAndAlbum($form.elements.singer, $form.elements.album);

  function handler(event) {
    event.preventDefault();

    const name = $form.elements.name.value;
    const text = $form.elements.text.value;
    const albumId = parseInt($form.elements.album.value);

    addSong(name, text, albumId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function initEditSongForm() {
  const $form = getElement(ids.editSongForm);
  const $dialog = getElement(ids.editSongDialog);

  linkSingerAndAlbum($form.elements.singer, $form.elements.album);

  function handler(event) {
    event.preventDefault();

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  const singersPromise = API.getSingersList().then(
    (list) => (data.singers = list)
  );
  const albumsPromise = API.getAlbumsList().then(
    (list) => (data.albums = list)
  );
  const songsPromise = API.getSongsList().then((list) => (data.songs = list));

  Promise.all([singersPromise, albumsPromise, songsPromise]).then(() => {
    renderSingersList();
    setLoadingStatus(false);
  });

  initAddSingerButton();
  initAddSingerForm();
  initEditSingerForm();
  initAddAlbumForm();
  initEditAlbumForm();
  initAddSongForm();
  initEditSongForm();
}

document.addEventListener("DOMContentLoaded", init);
