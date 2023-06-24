import { getElement, initDialog, setLoadingStatus } from "../js/utils.dom.js";
import { api } from "../js/utils.api.js";
import { getUrlParam } from "../js/utils.url.js";
import { getYaMusicPreview } from "../js/utils.format.js";

const songId = getUrlParam("id");

let state = null;

const ids = {
  singerName: "singer-name",
  albumName: "album-name",
  song: "song",
  editSongDialog: "edit-song-dialog",
  editSongForm: "edit-song-form",
};

const classes = {
  song: "song",
  songName: "song-name",
  songText: "song-text",
  songAudio: "song-audio",
  songPopular: "song-popular",
  editSongButton: "edit-song-button",
  removeSongButton: "remove-song-button",
};

const actions = {
  openEditSongDialog() {
    const song = state;
    const $form = getElement(ids.editSongForm);
    const $dialog = getElement(ids.editSongDialog);
    $form.elements.id.value = song.id;
    $form.elements.name.value = song.name;
    $form.elements.text.value = song.text;
    $form.elements.yandex.value = song.yandexId;
    $form.elements.popular.checked = song.popular == 1;
    $dialog.showModal();
  },
  editSong({ id, name, text, yandexId, popular }) {
    setLoadingStatus(true);
    api.song
      .updateItem({ id, name, text, yandexId, popular, albumId: state.album.id })
      .then((songData) => {
        state = songData;

        const $song = document.getElementById(ids.song);
        const $name = $song.querySelector(`.${classes.songName}`);
        const $text = $song.querySelector(`.${classes.songText}`);
        const $yandexFrame = $song.querySelector(`.${classes.songAudio}`);
        const $popular = $song.querySelector(`.${classes.songPopular}`);

        $name.innerHTML = songData.name;
        $text.innerHTML = songData.text;
        $yandexFrame.src = getYaMusicPreview(songData);
        $popular.hidden = songData.popular != 1;

        setLoadingStatus(false);
      });
  },
  removeSong() {
    setLoadingStatus(true);

    api.song.deleteItem(songId).then(() => {
      window.location.assign(`../album/${state.albumId}`);
    });
  },
};

export function renderSong(song) {
  const $song = document.getElementById(ids.song);

  const $name = $song.querySelector(`.${classes.songName}`);
  const $text = $song.querySelector(`.${classes.songText}`);
  const $remove = $song.querySelector(`.${classes.removeSongButton}`);
  const $edit = $song.querySelector(`.${classes.editSongButton}`);
  const $yandexFrame = $song.querySelector(`.${classes.songAudio}`);
  const $popular = $song.querySelector(`.${classes.songPopular}`);

  $name.innerHTML = song.name;
  $text.innerHTML = song.text;
  $yandexFrame.src = getYaMusicPreview(song);
  $popular.hidden = song.popular != 1;

  $remove.addEventListener("click", () => {
    actions.removeSong();
  });

  $edit.addEventListener("click", () => {
    actions.openEditSongDialog();
  });

  return $song;
}

/** INIT */

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

  api.song
    .getItem(songId)
    .then((song) => {
      state = song;
      const $singer = document.getElementById(ids.singerName);
      const $album = document.getElementById(ids.albumName);
      $singer.innerHTML = song.singer.name;
      $singer.href = `../singer?id=${song.singer.id}`;
      $album.innerHTML = song.album.name;
      $album.href = `../album?id=${song.album.id}`;
      renderSong(song);
    })
    .then(() => {
      setLoadingStatus(false);
    });

  initEditSongForm();
}

document.addEventListener("DOMContentLoaded", init);
