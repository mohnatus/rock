import { events, emit } from "./emitter.js";
import { classes, render } from "./utils.js";

export function findSongElement(id) {
  const $song = document.querySelector(`.${classes.song}[data-id="${id}"]`);
  return $song;
}

export function renderSong(song) {
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
    emit(events.removeSong, song.id);
  });

  $edit.addEventListener("click", () => {
    emit(events.openEditSongDialog, song.id);
  });

  return $el;
}
