import { api } from "./js/api.js";
import { state } from "./js/state.js";
import { emit, on, events } from "./js/emitter.js";
import { ids, classes, getElement } from "./js/utils.js";

import { renderSinger } from "./js/singer.dom.js";

import { initSingers } from "./js/singer.js";
import { initAlbums } from "./js/album.js";
import { initSongs } from "./js/song.js";

export function renderSingersList() {
  const $list = getElement(ids.singersList);
  const fr = document.createDocumentFragment();
  state.singers.forEach((singer) => {
    const $singer = renderSinger(singer);
    fr.appendChild($singer);
  });
  $list.innerHTML = "";
  $list.appendChild(fr);
}

function init() {
  on(events.setLoadingStatus, (isLoading) => {
    document.body.classList.toggle(classes.loading, isLoading);
  });

  const singersPromise = api
    .getSingersList()
    .then((list) => state.setSingers(list));
  const albumsPromise = api
    .getAlbumsList()
    .then((list) => state.setAlbums(list));
  const songsPromise = api.getSongsList().then((list) => state.setSongs(list));

  Promise.all([singersPromise, albumsPromise, songsPromise]).then(() => {
    renderSingersList();
    emit(events.setLoadingStatus, false);
  });

  initSingers();
  initAlbums();
  initSongs();
}

document.addEventListener("DOMContentLoaded", init);
