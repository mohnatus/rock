export function getYaMusicPreview(songData) {
  return `https://music.yandex.ru/iframe/#track/${songData.yandexId}/${songData.album.yandexId}`;
}
