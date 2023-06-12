import { api } from "./api.js";
import { state } from "./state.js";
import { emit, events } from "./emitter.js";
import {
  getElement,
  updateSingersList,
  updateAlbumsList,
  ids,
  classes,
} from "./utils.js";
import { findAlbumElement } from "./album.dom.js";
import { renderSong, findSongElement } from "./song.dom.js";

export function openAddSongDialog(albumId) {
  const $form = getElement(ids.addSongForm);
  const $dialog = getElement(ids.addSongDialog);

  const album = state.getAlbum(albumId);
  const singerId = album.singerId;

  updateSingersList($form.elements.singer);
  $form.elements.singer.value = singerId;

  updateAlbumsList($form.elements.album, singerId);
  $form.elements.album.value = albumId;

  $dialog.showModal();
}

export function addSong(songData) {
  const { name, text, albumId, url } = songData;
  emit(events.setLoadingStatus, true);

  api.createSong({ name, text, albumId, url }).then((songData) => {
    state.addSong(songData);
    const $album = findAlbumElement(albumId);
    const $songs = $album.querySelector(`.${classes.songsList}`);
    const $song = renderSong(songData);
    $songs.appendChild($song);
    emit(events.setLoadingStatus, false);
  });
}

export function openEditSongDialog(songId) {
  const $form = getElement(ids.editSongForm);
  const $dialog = getElement(ids.editSongDialog);

  const song = state.getSong(songId);

  $form.elements.id.value = song.id;
  $form.elements.name.value = song.name;
  $form.elements.text.value = song.text;
  $form.elements.url.value = song.url;

  const album = state.getAlbum(song.albumId);
  const singerId = album.singerId;

  updateSingersList($form.elements.singer);
  $form.elements.singer.value = singerId;

  updateAlbumsList($form.elements.album, singerId);
  $form.elements.album.value = song.albumId;

  $dialog.showModal();
}

export function editSong(songData) {
  const { id, name, text, albumId, url } = songData;
  emit(events.setLoadingStatus, true);

  api.updateSong({ id, name, text, albumId, url }).then((songData) => {
    state.editSong(songData);

    const $song = findSongElement(songData.id);
    const $name = $song.querySelector(`.${classes.songName}`);
    $name.innerHTML = name;
    const $currentAlbum = $song.closest(`.${classes.album}`);
    if (parseInt($currentAlbum.dataset.id) !== songData.albumId) {
      const $album = findAlbumElement(songData.albumId);
      const $songs = $album.querySelector(`.${classes.songsList}`);
      $songs.appendChild($song);
    }

    emit(events.setLoadingStatus, false);
  });
}

export function removeSong(songId) {
  emit(events.setLoadingStatus, true);

  api.deleteSong(songId).then(() => {
    state.removeSong(songId);
    const $song = document.querySelector(
      `.${classes.song}[data-id="${songId}"]`
    );
    if ($song) $song.remove();
    emit(events.setLoadingStatus, false);
  });
}
