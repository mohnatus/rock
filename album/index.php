<!DOCTYPE html>
<html lang="en">

<head>
  <?php include '../templates/head.php'; ?>
</head>

<body class="loading">
  <template id="song-template">
    <tr class="song" data-attr="id">
      <td>
        <a class="song-name" data-text="name"></a>
        <br>
        <div class="song-popular" data-show="popular">Популярная</div>
        <br>
        <div class="song-text-wrapper">
          <span class="song-text" data-text="text"></span>
        </div>
      </td>
      <td>
        <div class="actions">
          <button type="button" class="song-edit" data-action="edit">
            EDIT
          </button>
          <button type="button" class="song-remove" data-action="remove">
            &times;
          </button>
        </div>
      </td>
    </tr>
  </template>

  <dialog id="add-song-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Добавить песню</h2>
    <form action="/song" id="add-song-form" method="POST">
      <div class="form-control">
        <label for="add-song-name">Название</label>
        <input id="add-song-name" type="text" name="name" autocomplete="off" />
      </div>
      <div class="form-control">
        <label for="add-song-text">Текст</label>
        <textarea id="add-song-text" name="text"></textarea>
      </div>
      <div class="form-control">
        <label for="add-song-yandex">YandexMusic ID</label>
        <input id="add-song-yandex" type="text" name="yandex" />
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
            <span id="album-name"></span>
          </h2>

          <div class="app-header-actions">
            <button id="add-song-button">ADD SONG</button>
          </div>
        </div>
      </header>

      <table>
        <thead>
          <tr>
            <th>
              Название
            </th>

            <th width="50"></th>
          </tr>
        </thead>
        <tbody id="songs-list"></tbody>
      </table>

      <?php include '../templates/loader.php'; ?>
    </div>
  </div>

  <?php include '../templates/scripts.php'; ?>

  <script src="./script.js" type="module"></script>
</body>

</html>