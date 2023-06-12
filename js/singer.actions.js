import { api } from "./api.js";
import { state } from "./state.js";
import { events, emit } from "./emitter.js";
import { getElement, ids, classes } from "./utils.js";
import { findSingerElement, renderSinger } from "./singer.dom.js";

export function openAddSingerDialog() {
  const $dialog = getElement(ids.addSingerDialog);
  $dialog.showModal();
}

export function addSinger(name) {
  emit(events.setLoadingStatus, true);

  api.createSinger(name).then((singerData) => {
    state.addSinger(singerData);
    const $singer = renderSinger(singerData);
    const $list = getElement(ids.singersList);
    $list.appendChild($singer);
    emit(events.setLoadingStatus, false);
  });
}

export function openEditSingerDialog(singerId) {
  const singer = state.getSinger(singerId);
  const $form = getElement(ids.editSingerForm);
  const $dialog = getElement(ids.editSingerDialog);
  $form.elements.id.value = singer.id;
  $form.elements.name.value = singer.name;
  $dialog.showModal();
}

export function editSinger(id, name) {
  emit(events.setLoadingStatus, true);
  api.updateSinger(id, name).then((singerData) => {
    state.editSinger(singerData);
    const $singer = findSingerElement(id);
    const $name = $singer.querySelector(`.${classes.singerName}`);
    $name.innerHTML = name;
    emit(events.setLoadingStatus, false);
  });
}

export function removeSinger(singerId) {
  emit(events.setLoadingStatus, true);

  api.deleteSinger(singerId).then(() => {
    state.removeSinger(singerId);
    const $singer = findSingerElement(singerId);
    if ($singer) $singer.remove();
    emit(events.setLoadingStatus, false);
  });
}
