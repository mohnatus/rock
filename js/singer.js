import { getElement, ids } from "./utils.js";
import { on, events } from "./emitter.js";
import {
  addSinger,
  editSinger,
  openAddSingerDialog,
  openEditSingerDialog,
  removeSinger,
} from "./singer.actions.js";

function initAddSingerButton() {
  const $button = getElement(ids.addSingerButton);

  $button.addEventListener("click", () => {
    openAddSingerDialog();
  });
}

function initAddSingerForm() {
  const $form = getElement(ids.addSingerForm);
  const $dialog = getElement(ids.addSingerDialog);

  function submitHandler(event) {
    event.preventDefault();
    const name = $form.elements.name.value;

    addSinger(name);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", submitHandler);
}

function initEditSingerForm() {
  const $form = getElement(ids.editSingerForm);
  const $dialog = getElement(ids.editSingerDialog);

  function handler(event) {
    event.preventDefault();

    const singerId = parseInt($form.elements.id.value);
    const singerName = $form.elements.name.value.trim();

    editSinger(singerId, singerName);

    $dialog.close();
    $form.reset();
  }

  $form.addEventListener("submit", handler);
}

export function initSingers() {
  initAddSingerButton();
  initAddSingerForm();
  initEditSingerForm();

  on(events.openEditSingerDialog, openEditSingerDialog);
  on(events.removeSinger, removeSinger);
}
