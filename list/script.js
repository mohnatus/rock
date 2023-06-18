import {
  getElement,
  initDialog,
  fromTemplate,
  setLoadingStatus,
} from "../js/utils.dom.js";
import { request } from "../js/utils.api.js";
import { getState } from "../js/utils.state.js";

const endpoint = "../api/singer.php";

export const api = {
  getList: () => request(endpoint),
  createItem: (name) =>
    request(endpoint, {
      method: "POST",
      body: { name },
    }),
  updateItem: (id, name) =>
    request(endpoint, {
      method: "POST",
      body: {
        id,
        name,
      },
    }),
  deleteItem: (id) => request(`${endpoint}?id=${id}`, { method: "DELETE" }),
};

const state = getState();

const ids = {
  singersList: "singers-list",

  addSingerDialog: "add-singer-dialog",
  addSingerForm: "add-singer-form",
  addSingerButton: "add-singer",

  editSingerDialog: "edit-singer-dialog",
  editSingerForm: "edit-singer-form",
};

const classes = {
  singer: "singer",
  singerName: "singer-name",
};

export function findSingerElement(id) {
  const $singer = document.querySelector(`.${classes.singer}[data-id="${id}"]`);
  return $singer;
}

const actions = {
  openAddSingerDialog() {
    const $dialog = getElement(ids.addSingerDialog);
    $dialog.showModal();
  },
  addSinger(name) {
    setLoadingStatus(true);

    api.createItem(name).then((singerData) => {
      state.addItem(singerData);
      const $singer = renderSinger(singerData);
      const $list = getElement(ids.singersList);
      $list.appendChild($singer);
      setLoadingStatus(false);
    });
  },
  openEditSingerDialog(singerId) {
    const singer = state.getItem(singerId);
    const $form = getElement(ids.editSingerForm);
    const $dialog = getElement(ids.editSingerDialog);
    $form.elements.id.value = singer.id;
    $form.elements.name.value = singer.name;
    $dialog.showModal();
  },
  editSinger(id, name) {
    setLoadingStatus(true);
    api.updateItem(id, name).then((singerData) => {
      state.editItem(singerData);
      const $singer = findSingerElement(id);
      const $name = $singer.querySelector(`.${classes.singerName}`);
      $name.innerHTML = name;
      setLoadingStatus(false);
    });
  },
  removeSinger(singerId) {
    setLoadingStatus(true);

    api.deleteItem(singerId).then(() => {
      state.removeItem(singerId);
      const $singer = findSingerElement(singerId);
      if ($singer) $singer.remove();
      setLoadingStatus(false);
    });
  },
};

export function renderSinger(singer) {
  const $singer = fromTemplate("singer-template", {
    name: singer.name,
    id: singer.id,
  });

  const $name = $singer.querySelector(`.${classes.singerName}`);
  const $remove = $singer.querySelector('[data-action="remove"]');
  const $edit = $singer.querySelector('[data-action="edit"]');

  $name.addEventListener("click", () => {
    window.open(`../singer?id=${singer.id}`);
  });

  $remove.addEventListener("click", () => {
    actions.removeSinger(singer.id);
  });

  $edit.addEventListener("click", () => {
    actions.openEditSingerDialog(singer.id);
  });

  return $singer;
}

export function renderSingersList() {
  const $list = getElement(ids.singersList);
  const fr = document.createDocumentFragment();
  state.list.forEach((singer) => {
    const $singer = renderSinger(singer);
    fr.appendChild($singer);
  });
  $list.innerHTML = "";
  $list.appendChild(fr);
}

/** INIT */

function initAddSingerButton() {
  const $button = getElement(ids.addSingerButton);

  $button.addEventListener("click", () => {
    actions.openAddSingerDialog();
  });
}

function initAddSingerForm() {
  const $form = getElement(ids.addSingerForm);
  const $dialog = getElement(ids.addSingerDialog);

  initDialog($dialog);

  function submitHandler(event) {
    event.preventDefault();
    const name = $form.elements.name.value;

    actions.addSinger(name);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", submitHandler);
}

function initEditSingerForm() {
  const $form = getElement(ids.editSingerForm);
  const $dialog = getElement(ids.editSingerDialog);

  initDialog($dialog);

  function handler(event) {
    event.preventDefault();

    const singerId = parseInt($form.elements.id.value);
    const singerName = $form.elements.name.value.trim();

    actions.editSinger(singerId, singerName);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

function init() {
  setLoadingStatus(true);

  api.getList().then((list) => {
    state.setList(list);
    renderSingersList();
    setLoadingStatus(false);
  });

  initAddSingerButton();
  initAddSingerForm();
  initEditSingerForm();
}

document.addEventListener("DOMContentLoaded", init);
