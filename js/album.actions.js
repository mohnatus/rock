import { api } from "./api.js";
import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { getElement, updateSingersList, ids, classes } from "./utils.js";
import { findSingerElement } from "./singer.dom.js";
import { findAlbumElement, renderAlbum } from "./album.dom.js";

export function openAddAlbumDialog(singerId) {
  const $form = getElement(ids.addAlbumForm);
  const $dialog = getElement(ids.addAlbumDialog);
  const $select = $form.elements.singer;

  updateSingersList($select);
  $form.elements.singer.value = singerId;
  $dialog.showModal();
}

export function addAlbum(name, singerId) {
  emit(events.setLoadingStatus, true);

  api.createAlbum(name, singerId).then((albumData) => {
    state.addAlbum(albumData);
    const $album = renderAlbum(albumData);
    const $singer = findSingerElement(singerId);
    const $albumsList = $singer.querySelector(`.${classes.albumsList}`);
    $albumsList.appendChild($album);
    emit(events.setLoadingStatus, false);
  });
}

export function openEditAlbumDialog(albumId) {
  const album = state.getAlbum(albumId);

  const $form = getElement(ids.editAlbumForm);
  const $dialog = getElement(ids.editAlbumDialog);
  const $select = $form.elements.singer;
  updateSingersList($select);
  $form.elements.id.value = album.id;
  $form.elements.name.value = album.name;
  $form.elements.singer.value = album.singerId;
  $dialog.showModal();
}

export function editAlbum(id, name, singerId) {
  emit(events.setLoadingStatus, true);
  api.updateAlbum(id, name, singerId).then((albumData) => {
    state.editAlbum(albumData);
    const $album = findAlbumElement(id);
    const $name = $album.querySelector(`.${classes.albumName}`);
    $name.innerHTML = albumData.name;
    const $currentSinger = $album.closest(`.${classes.singer}`);
    if (parseInt($currentSinger.dataset.id) !== singerId) {
      const $singer = findSingerElement(albumData.singerId);
      const $albums = $singer.querySelector(`.${classes.albumsList}`);
      $albums.appendChild($album);
    }
    emit(events.setLoadingStatus, false);
  });
}

export function removeAlbum(albumId) {
  emit(events.setLoadingStatus, true);
  api.deleteAlbum(albumId).then(() => {
    state.removeAlbum(albumId);
    const $album = document.querySelector(
      `.${classes.album}[data-id="${albumId}"]`
    );
    if ($album) $album.remove();
    emit(events.setLoadingStatus, false);
  });
}
