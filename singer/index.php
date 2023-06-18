<!DOCTYPE html>
<html lang="ru">

<head>
  <?php include '../templates/head.php'; ?>
</head>

<body class="loading">
  <template id="album-template">
    <tr class="album" data-attr="id">
      <td>
        <b class="album-name" data-text="name"></b>
        <br>
        <span class="album-year" data-text="year"></span>
      </td>
      <td>
        <div class="actions">
          <button type="button" class="album-edit" data-action="edit">
            EDIT
          </button>
          <button type="button" class="album-remove" data-action="remove">
            &times;
          </button>
        </div>
      </td>
    </tr>
  </template>

  <dialog id="add-album-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Добавить альбом</h2>
    <form action="/album" id="add-album-form" method="POST">
      <div class="form-control">
        <label for="add-album-name">Название</label>
        <input id="add-album-name" type="text" name="name" autocomplete="off" />
      </div>
      <div class="form-control">
        <label for="add-album-year">Год</label>
        <input type="text" id="add-album-year" name="year" />
      </div>
      <footer class="form-footer">
        <button type="submit">Сохранить</button>
      </footer>
    </form>
  </dialog>

  <dialog id="edit-album-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Изменить альбом</h2>
    <form action="/album" id="edit-album-form" method="UPDATE">
      <input type="hidden" name="id" />
      <div class="form-control">
        <label for="edit-album-name">Название</label>
        <input id="edit-album-name" type="text" name="name" autocomplete="off" />
      </div>
      <div class="form-control">
        <label for="edit-album-year">Год</label>
        <input type="text" id="edit-album-year" name="year" />
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
          <h1 id="singer-name" class="app-header-title"></h1>

          <div class="app-header-actions">
            <button id="add-album-button">ADD ALBUM</button>
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
        <tbody id="albums-list"></tbody>
      </table>

      <?php include '../templates/loader.php'; ?>
    </div>
  </div>

  <?php include '../templates/scripts.php'; ?>

  <script src="./script.js" type="module"></script>
</body>

</html>