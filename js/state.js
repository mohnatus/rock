export const state = {
  singers: [],
  albums: [],
  songs: [],

  setSingers(list) {
    this.singers = list;
  },
  setAlbums(list) {
    this.albums = list;
  },
  setSongs(list) {
    this.songs = list;
  },

  getSinger(singerId) {
    return this.singers.find((s) => s.id === singerId);
  },
  addSinger(singerData) {
    this.singers.push(singerData);
  },
  editSinger(singerData) {
    this.singers = this.singers.map((singer) => {
      if (singer.id === singerData.id) {
        return singerData;
      }
      return singer;
    });
  },
  removeSinger(singerId) {
    this.singers = this.singers.filter((s) => s.id !== singerId);
  },

  getAlbum(albumId) {
    return this.albums.find((a) => a.id === albumId);
  },
  addAlbum(albumData) {
    this.albums.push(albumData);
  },
  editAlbum(albumData) {
    this.albums = this.albums.map((album) => {
      if (album.id === albumData.id) {
        return albumData;
      }
      return album;
    });
  },
  removeAlbum(albumId) {
    this.albums = this.albums.filter((a) => a.id !== albumId);
  },

  getSingerAlbums(singerId) {
    return this.albums.filter((a) => a.singerId === singerId);
  },

  getSong(songId) {
    return this.songs.find((s) => s.id === songId);
  },
  addSong(songData) {
    this.songs.push(songData);
  },
  editSong(songData) {
    this.songs = this.songs.map((song) => {
      if (song.id === songData.id) {
        return songData;
      }
      return song;
    });
  },
  removeSong(songId) {
    this.songs = this.songs.filter((s) => s.id !== songId);
  },

  getAlbumSongs(albumId) {
    return this.songs.filter((a) => a.albumId === albumId);
  },
};
