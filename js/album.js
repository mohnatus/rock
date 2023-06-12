import { events, on } from "./emitter.js";
import { getElement, ids } from "./utils.js";
import {
  addAlbum,
  editAlbum,
  openAddAlbumDialog,
  openEditAlbumDialog,
  removeAlbum,
} from "./album.actions.js";

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

export function initAlbums() {
  initAddAlbumForm();
  initEditAlbumForm();

  on(events.openAddAlbumDialog, openAddAlbumDialog);
  on(events.openEditAlbumDialog, openEditAlbumDialog);
  on(events.removeAlbum, removeAlbum);
}
