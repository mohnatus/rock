import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { fromTemplate, classes } from "./utils.js";
import { renderSong } from "./song.dom.js";

export function findAlbumElement(id) {
  const $album = document.querySelector(`.${classes.album}[data-id="${id}"]`);
  return $album;
}

export function renderAlbum(album) {
  const $album = fromTemplate("album-template", {
    name: album.name,
    id: album.id,
  });

  const $remove = $album.querySelector('[data-action="remove"]');
  const $edit = $album.querySelector('[data-action="edit"]');
  const $addSong = $album.querySelector('[data-action="addSong"]');
  const $songs = $album.querySelector("[data-list]");

  const albumSongs = state.getAlbumSongs(album.id);

  albumSongs.forEach((song) => {
    const $song = renderSong(song);
    $songs.appendChild($song);
  });

  $edit.addEventListener("click", () => {
    emit(events.openEditAlbumDialog, album.id);
  });

  $remove.addEventListener("click", () => {
    emit(events.removeAlbum, album.id);
  });

  $addSong.addEventListener("click", () => {
    emit(events.openAddSongDialog, album.id);
  });

  return $album;
}
