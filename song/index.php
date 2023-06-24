<!DOCTYPE html>
<html lang="en">

<head>
  <?php include '../templates/head.php'; ?>
</head>

<body class="loading">
  <dialog id="edit-song-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Изменить песню</h2>

    <form action="/song" id="edit-song-form" method="UPDATE">
      <input type="hidden" name="id" />
      <div class="form-control">
        <label for="edit-song-name">Название</label>
        <input id="edit-song-name" type="text" name="name" autocomplete="off" />
      </div>
      <div class="form-control">
        <label for="edit-song-text">Текст</label>
        <textarea id="edit-song-text" name="text"></textarea>
      </div>

      <div class="form-control">
        <label for="add-song-yandex">YandexMusic ID</label>
        <input id="add-song-yandex" type="text" name="yandex" disabled />
      </div>

      <div class="form-control">
        <label for="add-song-popular">Популярная песня</label>
        <input type="checkbox" id="add-song-popular" name="popular">
      </div>

      <footer class="form-footer">
        <button type="submit">Сохранить</button>
      </footer>
    </form>

  </dialog>

  <div id="app" class="app">
    <div class="app-container">
      <header class="app-header">
        <div class="app-header-container">
          <a href="../list">Home</a>
          <h2 class="app-header-title">
            <a id="singer-name"></a>,
            <a id="album-name"></a>
          </h2>
        </div>
      </header>

      <div id="song" class="song">
        <h1 class="song-name"></h1>
        <div class="song-popular">Популярная</div>
        <div class="song-text"></div>
        <div><iframe src="" frameborder="0" class="song-audio" width="100%" height="180"></iframe></div>
        <div>
          <button class="edit-song-button">EDIT</button>
          <button class="remove-song-button">REMOVE</button>
        </div>
      </div>

      <?php include '../templates/loader.php'; ?>
    </div>
  </div>

  <?php include '../templates/scripts.php'; ?>

  <script src="./script.js" type="module"></script>
</body>

</html>