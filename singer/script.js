import {
  getElement,
  initDialog,
  fromTemplate,
  setLoadingStatus
} from "../js/utils.dom.js";
import { request } from "../js/utils.api.js";
import { getState } from "../js/utils.state.js";
import { getUrlParam } from "../js/utils.url.js";

const singerId = getUrlParam("id");

const root = "../api";
const endpoint = `${root}/album.php`;

const api = {
  getSinger: () => request(`${root}/singer.php?id=${singerId}`),
  getList: () => request(`${endpoint}?singerId=${singerId}`),
  createItem: ({ name, year }) =>
    request(endpoint, {
      method: "POST",
      body: { name, singerId, year },
    }),
  updateItem: ({ id, name, year }) =>
    request(endpoint, {
      method: "POST",
      body: {
        id,
        name,
        singerId,
        year,
      },
    }),
  deleteItem: (id) => request(`${endpoint}?id=${id}`, { method: "DELETE" }),
};

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
  addAlbum(name, year) {
    setLoadingStatus(true);

    api.createItem({ name, year }).then((albumData) => {
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
    $dialog.showModal();
  },
  editAlbum(id, name, year) {
    setLoadingStatus(true);
    api.updateItem({ id, name, year }).then((albumData) => {
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

    api.deleteItem(albumId).then(() => {
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

    actions.addAlbum(name, year);

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

    actions.editAlbum(albumId, albumName, albumYear);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  setLoadingStatus(true);

  const albumsPromise = api.getList().then((list) => {
    state.setList(list);
    renderAlbumsList();
  });

  const singerPromise = api.getSinger().then((singerData) => {
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
