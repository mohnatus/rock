import {
  getElement,
  initDialog,
  fromTemplate,
  setLoadingStatus,
} from "../js/utils.dom.js";
import { getState } from "../js/utils.state.js";
import { getUrlParam } from "../js/utils.url.js";
import { api } from "../js/utils.api.js";

const albumId = getUrlParam("id");

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
  songMedia: "song-media",
  songPopular: "song-popular",
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
  addSong({ name, text, yandexId, popular }) {
    setLoadingStatus(true);
    api.song
      .createItem({ name, text, yandexId, albumId, popular })
      .then((songData) => {
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
    $form.elements.yandex.value = song.yandexId;
    $form.elements.popular.checked = song.popular;
    $dialog.showModal();
  },
  editSong({ id, name, text, yandexId, popular }) {
    setLoadingStatus(true);
    api.song
      .updateItem({ id, name, text, yandexId, albumId, popular })
      .then((songData) => {
        state.editItem(songData);
        const $song = findSongElement(id);
        const $name = $song.querySelector(`.${classes.songName}`);
        const $text = $song.querySelector(`.${classes.songText}`);
        const $popular = $song.querySelector(`.${classes.songPopular}`);

        $name.innerHTML = songData.name;
        $text.innerHTML = songData.text;
        $popular.hidden = songData.popular != 1;

        setLoadingStatus(false);
      });
  },
  removeSong(songId) {
    setLoadingStatus(true);

    api.song.deleteItem(songId).then(() => {
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
    popular: song.popular
  });

  const $name = $song.querySelector(`.${classes.songName}`);
  $name.href = `../song?id=${song.id}`;

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
    const yandexId = $form.elements.yandex.value;
    const popular = $form.elements.popular.checked;

    actions.addSong({ name, text, yandexId, popular });

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
    const yandexId = $form.elements.yandex.value;
    const popular = $form.elements.popular.checked;

    actions.editSong({ id, name, text, yandexId, popular });

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  setLoadingStatus(true);

  const songsPromise = api.song.getList({ albumId }).then((list) => {
    state.setList(list);
    renderSongsList();
  });

  const albumPromise = api.album.getItem(albumId).then((albumData) => {
    const $singerName = getElement(ids.singerName);
    const $albumName = getElement(ids.albumName);
    $singerName.innerHTML = albumData.singer.name;
    $singerName.href = `../singer?id=${albumData.singer.id}`;
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
