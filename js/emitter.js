export const events = {
  setLoadingStatus: "events/status/loading",

  openEditSingerDialog: "events/singer/openEditDialog", // singer.id
  removeSinger: "events/singer/remove", // singer.id

  openAddAlbumDialog: "events/album/openAddDialog", // singer.id
  openEditAlbumDialog: "events/album/openEditDialog", // album.id
  removeAlbum: "events/album/remove", // album.id

  openAddSongDialog: "events/song/openAddDialog", // album.id
  openEditSongDialog: "events/song/openEditDialog", // song.id
  removeSong: "events/song/remove", // song.id
};

const cbs = {};

export function on(eventName, cb) {
  if (!cbs[eventName]) {
    cbs[eventName] = [];
  }
  cbs[eventName].push(cb);
}

export function emit(eventName, eventData) {
  const list = cbs[eventName] || [];
  list.forEach((cb) => cb(eventData));
}
