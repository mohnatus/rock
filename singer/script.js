import {
  getElement,
  initDialog,
  fromTemplate,
  setLoadingStatus,
} from "../js/utils.dom.js";
import { getState } from "../js/utils.state.js";
import { getUrlParam } from "../js/utils.url.js";
import { api } from "../js/utils.api.js";

const singerId = getUrlParam("id");

const state = getState();

const ids = {
  singerName: "singer-name",

  albumsList: "albums-list",

  addAlbumButton: "add-album-button",
  addAlbumDialog: "add-album-dialog",
  addAlbumForm: "add-album-form",

  editAlbumDialog: "edit-album-dialog",
  editAlbumForm: "edit-album-form",
};

const classes = {
  album: "album",
  albumName: "album-name",
  albumYear: "album-year",
};

function findAlbumElement(id) {
  const $album = document.querySelector(`.${classes.album}[data-id="${id}"]`);
  return $album;
}

const actions = {
  openAddAlbumDialog() {
    const $dialog = getElement(ids.addAlbumDialog);
    $dialog.showModal();
  },
  addAlbum(name, year, yandexId) {
    setLoadingStatus(true);

    api.album.createItem({ name, year, singerId, yandexId }).then((albumData) => {
      state.addItem(albumData);
      const $album = renderAlbum(albumData);
      const $list = getElement(ids.albumsList);
      $list.appendChild($album);
      setLoadingStatus(false);
    });
  },
  openEditAlbumDialog(albumId) {
    const album = state.getItem(albumId);
    const $form = getElement(ids.editAlbumForm);
    const $dialog = getElement(ids.editAlbumDialog);
    $form.elements.id.value = album.id;
    $form.elements.name.value = album.name;
    $form.elements.year.value = album.year;
    $form.elements.yandex.value = album.yandexId;
    $dialog.showModal();
  },
  editAlbum(id, name, year, yandexId) {
    setLoadingStatus(true);
    api.album.updateItem({ id, name, year, singerId }).then((albumData) => {
      state.editItem(albumData);
      const $album = findAlbumElement(id);
      const $name = $album.querySelector(`.${classes.albumName}`);
      const $year = $album.querySelector(`.${classes.albumYear}`);
      $name.innerHTML = name;
      $year.innerHTML = year;
      setLoadingStatus(false);
    });
  },
  removeAlbum(albumId) {
    setLoadingStatus(true);

    api.album.deleteItem(albumId).then(() => {
      state.removeItem(albumId);
      const $album = findAlbumElement(albumId);
      if ($album) $album.remove();
      setLoadingStatus(false);
    });
  },
};

export function renderAlbum(album) {
  const $album = fromTemplate("album-template", {
    name: album.name,
    id: album.id,
    year: album.year,
  });

  const $name = $album.querySelector(`.${classes.albumName}`);
  const $remove = $album.querySelector('[data-action="remove"]');
  const $edit = $album.querySelector('[data-action="edit"]');

  $name.addEventListener("click", () => {
    window.open(`../album?id=${album.id}`);
  });

  $remove.addEventListener("click", () => {
    actions.removeAlbum(album.id);
  });

  $edit.addEventListener("click", () => {
    actions.openEditAlbumDialog(album.id);
  });

  return $album;
}

export function renderAlbumsList() {
  const $list = getElement(ids.albumsList);
  const fr = document.createDocumentFragment();
  state.list.forEach((album) => {
    const $album = renderAlbum(album);
    fr.appendChild($album);
  });
  $list.innerHTML = "";
  $list.appendChild(fr);
}

/** INIT */

function initAddAlbumButton() {
  const $button = getElement(ids.addAlbumButton);

  $button.addEventListener("click", () => {
    actions.openAddAlbumDialog();
  });
}

function initAddAlbumForm() {
  const $form = getElement(ids.addAlbumForm);
  const $dialog = getElement(ids.addAlbumDialog);

  initDialog($dialog);

  function submitHandler(event) {
    event.preventDefault();
    const name = $form.elements.name.value;
    const year = $form.elements.year.value;
    const yandexId = $form.elements.yandex.value;

    actions.addAlbum(name, year, yandexId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", submitHandler);
}

function initEditAlbumForm() {
  const $form = getElement(ids.editAlbumForm);
  const $dialog = getElement(ids.editAlbumDialog);

  initDialog($dialog);

  function handler(event) {
    event.preventDefault();

    const albumId = parseInt($form.elements.id.value);
    const albumName = $form.elements.name.value.trim();
    const albumYear = $form.elements.year.value;
    const yandexId = $form.elements.yandex.value;

    actions.editAlbum(albumId, albumName, albumYear, yandexId);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  setLoadingStatus(true);

  const albumsPromise = api.album.getList({singerId}).then((list) => {
    state.setList(list);
    renderAlbumsList();
  });

  const singerPromise = api.singer.getItem(singerId).then((singerData) => {
    const $singerName = getElement(ids.singerName);
    $singerName.innerHTML = singerData.name;
  });

  Promise.all([albumsPromise, singerPromise]).then(() => {
    setLoadingStatus(false);
  });

  initAddAlbumButton();
  initAddAlbumForm();
  initEditAlbumForm();
}

document.addEventListener("DOMContentLoaded", init);
