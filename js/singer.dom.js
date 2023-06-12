import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { fromTemplate, classes } from "./utils.js";
import { renderAlbum } from "./album.dom.js";

export function findSingerElement(id) {
  const $singer = document.querySelector(`.${classes.singer}[data-id="${id}"]`);
  return $singer;
}

export function renderSinger(singer) {
  const $singer = fromTemplate("singer-template", {
    name: singer.name,
    id: singer.id,
  });

  const $remove = $singer.querySelector('[data-action="remove"]');
  const $edit = $singer.querySelector('[data-action="edit"]');
  const $addAlbum = $singer.querySelector('[data-action="addAlbum"]');
  const $albums = $singer.querySelector("[data-list]");

  const singerAlbums = state.getSingerAlbums(singer.id);

  singerAlbums.forEach((album) => {
    const $album = renderAlbum(album);
    $albums.appendChild($album);
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

  return $singer;
}
