import {
  getElement,
  initDialog,
  fromTemplate,
  setLoadingStatus,
} from "../js/utils.dom.js";
import { request } from "../js/utils.api.js";
import { getState } from "../js/utils.state.js";
import { getUrlParam } from "../js/utils.url.js";

const albumId = getUrlParam("id");

const root = "../api";
const endpoint = `${root}/song.php`;

export const api = {
  getAlbum: () => request(`${root}/album.php?id=${albumId}`),
  getList: () => request(`${endpoint}?albumId=${albumId}`),
  createItem: ({ name, text, url }) =>
    request(endpoint, {
      method: "POST",
      body: { name, text, url, albumId },
    }),
  updateItem: ({ id, name, text, url }) =>
    request(endpoint, {
      method: "POST",
      body: {
        id,
        name,
        albumId,
        text,
        url,
      },
    }),
  deleteItem: (id) => request(`${endpoint}?id=${id}`, { method: "DELETE" }),
};

const state = getState();

const ids = {
  singerName: "singer-name",
  albumName: "album-name",

  songsList: "songs-list",

  addSongButton: "add-song-button",
  addSongDialog: "add-song-dialog",
  addSongForm: "add-song-form",

  editSongDialog: "edit-song-dialog",
  editSongForm: "edit-song-form",
};

const classes = {
  song: "song",
  songName: "song-name",
  songText: "song-text",
};

export function findSongElement(id) {
  const $song = document.querySelector(`.${classes.song}[data-id="${id}"]`);
  return $song;
}

const actions = {
  openAddSongDialog() {
    const $dialog = getElement(ids.addSongDialog);
    $dialog.showModal();
  },
  addSong({ name, text, url }) {
    setLoadingStatus(true);
    api.createItem({ name, text, url }).then((songData) => {
      state.addItem(songData);
      const $song = renderSong(songData);
      const $list = getElement(ids.songsList);
      $list.appendChild($song);
      setLoadingStatus(false);
    });
  },
  openEditSongDialog(songId) {
    const song = state.getItem(songId);
    const $form = getElement(ids.editSongForm);
    const $dialog = getElement(ids.editSongDialog);
    $form.elements.id.value = song.id;
    $form.elements.name.value = song.name;
    $form.elements.text.value = song.text;
    $form.elements.url.value = song.url;
    $dialog.showModal();
  },
  editSong({ id, name, text, url }) {
    setLoadingStatus(true);
    api.updateItem({ id, name, text, url }).then((songData) => {
      state.editItem(songData);
      const $song = findSongElement(id);
      const $name = $song.querySelector(`.${classes.songName}`);
      const $text = $song.querySelector(`.${classes.songText}`);
      $name.innerHTML = name;
      $text.innerHTML = text;
      setLoadingStatus(false);
    });
  },
  removeSong(songId) {
    setLoadingStatus(true);

    api.deleteItem(songId).then(() => {
      state.removeItem(songId);
      const $song = findSongElement(songId);
      if ($song) $song.remove();
      setLoadingStatus(false);
    });
  },
};

export function renderSong(song) {
  const $song = fromTemplate("song-template", {
    name: song.name,
    id: song.id,
    text: song.text,
  });

  const $remove = $song.querySelector('[data-action="remove"]');
  const $edit = $song.querySelector('[data-action="edit"]');

  $remove.addEventListener("click", () => {
    actions.removeSong(song.id);
  });

  $edit.addEventListener("click", () => {
    actions.openEditSongDialog(song.id);
  });

  return $song;
}

export function renderSongsList() {
  const $list = getElement(ids.songsList);
  const fr = document.createDocumentFragment();
  state.list.forEach((song) => {
    const $song = renderSong(song);
    fr.appendChild($song);
  });
  $list.innerHTML = "";
  $list.appendChild(fr);
}

/** INIT */

function initAddSongButton() {
  const $button = getElement(ids.addSongButton);

  $button.addEventListener("click", () => {
    actions.openAddSongDialog();
  });
}

function initAddSongForm() {
  const $form = getElement(ids.addSongForm);
  const $dialog = getElement(ids.addSongDialog);

  initDialog($dialog);

  function submitHandler(event) {
    event.preventDefault();
    const name = $form.elements.name.value;
    const text = $form.elements.text.value;
    const url = $form.elements.url.value;

    actions.addSong({ name, text, url });

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", submitHandler);
}

function initEditSongForm() {
  const $form = getElement(ids.editSongForm);
  const $dialog = getElement(ids.editSongDialog);

  initDialog($dialog);

  function handler(event) {
    event.preventDefault();

    const id = parseInt($form.elements.id.value);
    const name = $form.elements.name.value.trim();
    const text = $form.elements.text.value;
    const url = $form.elements.url.value;

    actions.editSong({ id, name, text, url });

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  setLoadingStatus(true);

  const songsPromise = api.getList().then((list) => {
    state.setList(list);
    renderSongsList();
  });

  const albumPromise = api.getAlbum().then((albumData) => {
    const $singerName = getElement(ids.singerName);
    const $albumName = getElement(ids.albumName);
    $singerName.innerHTML = albumData.singer.name;
    $albumName.innerHTML = albumData.name;
  });

  Promise.all([songsPromise, albumPromise]).then(() => {
    setLoadingStatus(false);
  });

  initAddSongButton();
  initAddSongForm();
  initEditSongForm();
}

document.addEventListener("DOMContentLoaded", init);
