import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { classes, render } from "./utils.js";
import { renderAlbum } from "./album.dom.js";

export function findSingerElement(id) {
  const $singer = document.querySelector(`.${classes.singer}[data-id="${id}"]`);
  return $singer;
}

export function renderSinger(singer) {
  const $name = render("div", null, {
    className: classes.singerName,
    text: singer.name,
  });
  const $remove = render("button", null, {
    attrs: { type: "button" },
    className: classes.singerRemove,
    text: "&times;",
  });
  const $edit = render("button", null, {
    text: "EDIT",
    className: classes.singerEdit,
    attrs: { type: "button" },
  });
  const $addAlbum = render("button", null, {
    text: "ADD ALBUM",
    className: classes.singerAddAlbum,
    attrs: { type: "button" },
  });
  const $actions = render("div", [$addAlbum, $edit, $remove], {
    className: classes.singerActions,
  });
  const $header = render("div", [$name, $actions], {
    className: classes.singerHeader,
  });

  const singerAlbums = state.getSingerAlbums(singer.id);
  const $albums = render(
    "div",
    singerAlbums.map((album) => {
      return renderAlbum(album);
    }),
    {
      className: classes.albumsList,
      attrs: { "data-singer-id": singer.id },
    }
  );
  const $el = render("div", [$header, $albums], {
    className: classes.singer,
    attrs: { "data-id": singer.id },
  });

  $remove.addEventListener("click", () => {
    emit(events.removeSinger, singer.id);
  });

  $edit.addEventListener("click", () => {
    emit(events.openEditSingerDialog, singer.id);
  });

  $addAlbum.addEventListener("click", () => {
    emit(events.openAddAlbumDialog, singer.id);
  });

  return $el;
}
