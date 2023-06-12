import { events, on } from "./emitter.js";
import { getElement, linkSingerAndAlbum, ids } from "./utils.js";
import {
  addSong,
  editSong,
  openAddSongDialog,
  openEditSongDialog,
  removeSong,
} from "./song.actions.js";

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

    const id = $form.elements.id.value;
    const name = $form.elements.name.value;
    const text = $form.elements.text.value;
    const albumId = parseInt($form.elements.album.value);

    editSong(id, name, text, albumId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

export function initSongs() {
  initAddSongForm();
  initEditSongForm();

  on(events.openAddSongDialog, openAddSongDialog);
  on(events.openEditSongDialog, openEditSongDialog);
  on(events.removeSong, removeSong);
}
