const api = {
  getSingerData: (singerId) =>
    `https://music.yandex.ru/handlers/artist.jsx?artist=${singerId}&what=tracks&sort=&dir=&period=month&trackPage=0&trackPageSize=100&lang=ru&external-domain=music.yandex.ru&overembed=false&ncrnd=0.6444172376722177`,
  getSingerAlbums: (singerId) =>
    `https://music.yandex.ru/handlers/artist.jsx?artist=${singerId}&what=albums&sort=year&dir=&period=month&trackPage=0&trackPageSize=100&lang=ru&external-domain=music.yandex.ru&overembed=false&ncrnd=0.007080521065628398`,
  getAlbumSongs: (albumId) =>
    `https://music.yandex.ru/handlers/album.jsx?album=${albumId}&lang=ru&external-domain=music.yandex.ru&overembed=false&ncrnd=0.4564112726898206`,
  getSongLyrics: (albumId, songId) =>
    `https://music.yandex.ru/handlers/track.jsx?track=${songId}%3A${albumId}&lang=ru&external-domain=music.yandex.ru&overembed=false&ncrnd=0.7056189980926431`,
};

function getYandexLink(albumId, songId) {
  return `https://music.yandex.ru/album/${albumId}/track/${songId}`;
}

async function getLyrics(albumId, songId) {
  const result = await fetch(
    `https://music.yandex.ru/handlers/track.jsx?track=${songId}%3A${albumId}&lang=ru&external-domain=music.yandex.ru&overembed=false&ncrnd=0.7056189980926431`
  ).then((res) => res.json());
  const text = result.lyric[0].fullLyrics;
  return text.replace(/\n/g, "\r\n");
}

async function formatSong(albumId, songData) {
  const data = {
    id: songData.id,
    name: songData.title,
    yandexLink: getYandexLink(albumId, songData.id),
  };
  const lyrics = await getLyrics(albumId, songData.id);
  data.lyrics = lyrics;
  return data;
}

async function getAlbumSongs(albumId) {
  const result = await fetch(api.getAlbumSongs(albumId));
  const json = await result.json();
  const list = json.volumes[0];
  const promises = list.map((song) => {
    return formatSong(albumId, song);
  });
  const albumSongs = await Promise.all(promises);
  return albumSongs;
}

async function formatAlbum(albumData) {
  const data = {
    id: albumData.id,
    name: albumData.title,
    year: albumData.year,
  };
  const songs = await getAlbumSongs(albumData.id);
  data.songs = songs;
  return data;
}

async function getAlbums(singerId) {
  const result = await fetch(api.getSingerAlbums(singerId));
  const json = await result.json();
  const list = json.albums;
  const singerAlbums = [];

  for (let album of list) {
    const data = await formatAlbum(album);
    singerAlbums.push(data);
  }
  return singerAlbums;
}

async function getSinger(singerId) {
  const singerDataPromise = fetch(api.getSingerData(singerId)).then((res) =>
    res.json()
  );
  const albumsPromise = getAlbums(singerId);
  // const albumsPromise = Promise.resolve([])

  const [singerData, albums] = await Promise.all([
    singerDataPromise,
    albumsPromise,
  ]);
  console.log({ singerData });
  return {
    id: singerId,
    name: singerData.artist.name,
    albums,
    tracks: singerData.trackIds
  };
}

async function getSingers(singers) {
  const list = [...new Set(singers)];
  const data = [];

  for (let singerId of list) {
    const singerData = await getSinger(singerId);
    data.push(singerData);
  }

  return data;
}

const singers = [
  41213, // 7Б

  41138, // Nautilus Pompilius

  41134, // Агата Кристи
  188963, // Аквариум
  167401, // Алиса
  164354, // Ария

  41114, // Би2
  614609, // Бригадный подряд

  188975, // Високосный год

  189548, // Гарик Сукачев

  358612, // ДДТ

  1431923, // Жуки

  218099, // Земфира

  41075, // Кино
  166306, // Конец фильма
  1435011, // Константин Никольский
  41052, // Король и Шут
  170650, // Крематорий
  41154, // Кукрыниксы

  427825, // Мара
  1652733, // Машина времени
  359577, // Мельница
  188978, // Моральный кодекс
  41098, // Мумий Тролль

  41092, // Найк Борзов
  218071, // Ночные снайперы

  218073, // Пикник
  41072, // Пилот

  167640, // Секрет
  158511, // Сектор газа
  41120, // СерьГа
  41051, // Смысловые галлюцинации
  161243, // Сплин
  41062, // Сурганова и Оркестр

  41050, // Танцы минус

  41094, // Ундервуд

  41055, // Чайф
  359598, // Черный обелиск
  2905482, // Чиж и Ко
  
  2150261, // Электропартизаны
];

getSingers(singers).then((list) => console.log(list));
