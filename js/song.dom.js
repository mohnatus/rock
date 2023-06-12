import { events, emit } from "./emitter.js";
import { fromTemplate, classes } from "./utils.js";

export function findSongElement(id) {
  const $song = document.querySelector(`.${classes.song}[data-id="${id}"]`);
  return $song;
}

export function renderSong(song) {
  const $song = fromTemplate("song-template", {
    name: song.name,
    id: song.id,
  });

  const $remove = $song.querySelector('[data-action="remove"]');
  const $edit = $song.querySelector('[data-action="edit"]');

  $remove.addEventListener("click", () => {
    emit(events.removeSong, song.id);
  });

  $edit.addEventListener("click", () => {
    emit(events.openEditSongDialog, song.id);
  });

  return $song;
}
