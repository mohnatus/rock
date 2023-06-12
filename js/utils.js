import { state } from "./state.js";

export const ids = {
  singersList: "singers-list",

  addSingerDialog: "add-singer-dialog",
  addSingerForm: "add-singer-form",
  addSingerButton: "add-singer",

  editSingerDialog: "edit-singer-dialog",
  editSingerForm: "edit-singer-form",

  addAlbumDialog: "add-album-dialog",
  addAlbumForm: "add-album-form",

  editAlbumDialog: "edit-album-dialog",
  editAlbumForm: "edit-album-form",

  addSongDialog: "add-song-dialog",
  addSongForm: "add-song-form",

  editSongDialog: "edit-song-dialog",
  editSongForm: "edit-song-form",
};

export const classes = {
  loading: "loading",

  singersList: "singers-list",

  singer: "singer",
  singerHeader: "singer-header",
  singerName: "singer-name",
  singerActions: "singer-actions",
  singerRemove: "singer-remove",
  singerEdit: "singer-edit",
  singerAddAlbum: "singer-add-album",

  albumsList: "albums-list",
  album: "album",
  albumHeader: "album-header",
  albumName: "album-name",
  albumActions: "album-actions",
  albumRemove: "album-remove",
  albumEdit: "album-edit",

  songsList: "songs-list",
  song: "song",
  songName: "song-name",
  songActions: "song-actions",
  songRemove: "song-remove",
  songEdit: "song-edit",
};

const elementsCache = {};

export function getElement(id) {
  if (!elementsCache[id]) {
    elementsCache[id] = document.getElementById(id);
  }

  return elementsCache[id];
}

export function render(tagName, children, params) {
  const { className, attrs, text } = params || {};
  const $el = document.createElement(tagName);
  if (className) $el.classList.add(className);
  if (children) {
    children.forEach(($child) => $el.appendChild($child));
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      $el.setAttribute(key, value);
    });
  }
  if (text) {
    $el.innerHTML = text;
  }
  return $el;
}

export function updateSingersList($select) {
  $select.innerHTML = "";
  const fr = document.createDocumentFragment();
  fr.appendChild(render("option"));
  state.singers.forEach((singer) => {
    const $option = render("option", null, {
      attrs: {
        value: singer.id,
      },
      text: singer.name,
    });
    fr.appendChild($option);
  });
  $select.appendChild(fr);
}

export function updateAlbumsList($select, singerId) {
  $select.innerHTML = "";
  const fr = document.createDocumentFragment();
  fr.appendChild(render("option"));
  const albums = state.getSingerAlbums(singerId);
  albums.forEach((album) => {
    const $option = render("option", null, {
      attrs: {
        value: album.id,
      },
      text: album.name,
    });
    fr.appendChild($option);
  });
  $select.appendChild(fr);
}

export function linkSingerAndAlbum($singerSelect, $albumSelect) {
  $singerSelect.addEventListener("change", () => {
    const singerId = parseInt($singerSelect.value);
    updateAlbumsList($albumSelect, singerId);
  });
}

export function fromTemplate(templateId, data) {
  const template = document.getElementById(templateId);
  const $clone = template.content.cloneNode(true);

  Object.entries(data).forEach(([key, value]) => {
    const $texts = $clone.querySelectorAll(`[data-text='${key}']`);
    $texts.forEach(($node) => ($node.innerHTML = value));

    const $attrs = $clone.querySelectorAll(`[data-attr='${key}']`);
    $attrs.forEach(($node) => ($node.dataset[key] = value));
  });

  return $clone;
}

export function initDialog(dialog) {
  const close = dialog.querySelector(".dialog-close");
  const form = dialog.querySelector("form");
  close.addEventListener("click", () => {
    dialog.close();
    form.reset();
  });
}
