import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { classes, render } from "./utils.js";
import { renderSong } from "./song.dom.js";

export function findAlbumElement(id) {
  const $album = document.querySelector(`.${classes.album}[data-id="${id}"]`);
  return $album;
}

export function renderAlbum(album) {
  const $name = render("div", null, {
    className: classes.albumName,
    text: album.name,
  });
  const $remove = render("button", null, {
    attrs: {
      type: "button",
    },
    className: classes.albumRemove,
    text: "&times;",
  });
  const $edit = render("button", null, {
    attrs: {
      type: "button",
    },
    text: "EDIT",
  });
  const $addSong = render("button", null, {
    attrs: {
      type: "button",
    },
    text: "ADD SONG",
  });
  const $actions = render("div", [$addSong, $edit, $remove], {
    className: classes.albumActions,
  });
  const $header = render("div", [$name, $actions], {
    className: classes.albumHeader,
  });

  const albumSongs = state.getAlbumSongs(album.id);
  const $songs = render(
    "div",
    albumSongs.map((song) => {
      return renderSong(song);
    }),
    {
      className: classes.songsList,
    }
  );

  const $el = render("div", [$header, $songs], {
    className: classes.album,
    attrs: { "data-id": album.id, "data-singer-id": album.singerId },
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

  return $el;
}
