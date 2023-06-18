<!DOCTYPE html>
<html lang="ru">

<head>
  <?php include '../templates/head.php'; ?>
</head>

<body class="loading">
  <template id="singer-template">
    <tr class="singer" data-attr="id">
      <td>
        <b class="singer-name" data-text="name"></b>
      </td>
      <td>
        <div class="actions">
          <button type="button" class="singer-edit" data-action="edit">
            EDIT
          </button>
          <button type="button" class="singer-remove" data-action="remove">
            &times;
          </button>
        </div>
      </td>
    </tr>
  </template>

  <dialog id="add-singer-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Добавить исполнителя</h2>
    <form id="add-singer-form" action="/singer" method="POST">
      <div class="form-control">
        <label for="add-singer-name">Название</label>
        <input type="text" id="add-singer-name" name="name" autocomplete="off" />
      </div>
      <footer class="form-footer">
        <button type="submit">Сохранить</button>
      </footer>
    </form>
  </dialog>

  <dialog id="edit-singer-dialog">
    <button type="button" class="dialog-close">&times;</button>
    <h2 class="dialog-title">Изменить исполнителя</h2>
    <form id="edit-singer-form" action="/singer" method="UPDATE">
      <input type="hidden" name="id" />
      <div class="form-control">
        <label for="edit-singer-name">Название</label>
        <input id="edit-singer-name" type="text" name="name" autocomplete="off" />
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
          <button id="add-singer">ADD SINGER</button>
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
        <tbody id="singers-list"></tbody>
      </table>

      <?php include '../templates/loader.php'; ?>
    </div>
  </div>

  <?php include '../templates/scripts.php'; ?>

  <script src="./script.js" type="module"></script>
</body>

</html>