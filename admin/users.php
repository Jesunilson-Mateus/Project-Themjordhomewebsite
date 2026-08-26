<?php
require_once __DIR__ . '/lib.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $users = load_users();
    $formAction = $_POST['form_action'] ?? '';

    if ($formAction === 'add_user') {
        $username = trim($_POST['new_username'] ?? '');
        $name = trim($_POST['new_name'] ?? '');
        $password = (string) ($_POST['new_password'] ?? '');
        $username = preg_replace('/[^a-z0-9_\-.]/i', '', $username);

        if ($username === '' || $name === '' || strlen($password) < 8) {
            redirect_with_message('users.php', 'error', 'Preenche o utilizador, nome e uma password com pelo menos 8 caracteres.');
        }
        if (isset($users[$username])) {
            redirect_with_message('users.php', 'error', 'Já existe um utilizador com esse nome.');
        }
        $users[$username] = ['name' => $name, 'passwordHash' => password_hash($password, PASSWORD_DEFAULT)];
        save_users($users);
        redirect_with_message('users.php', 'success', "Utilizador \"{$username}\" criado.");
    }

    if ($formAction === 'change_password') {
        $username = $_POST['username'] ?? '';
        $password = (string) ($_POST['new_password'] ?? '');
        if (!isset($users[$username])) {
            redirect_with_message('users.php', 'error', 'Utilizador não encontrado.');
        }
        if (strlen($password) < 8) {
            redirect_with_message('users.php', 'error', 'A nova password precisa de pelo menos 8 caracteres.');
        }
        $users[$username]['passwordHash'] = password_hash($password, PASSWORD_DEFAULT);
        save_users($users);
        redirect_with_message('users.php', 'success', "Password de \"{$username}\" atualizada.");
    }

    if ($formAction === 'delete_user') {
        $username = $_POST['username'] ?? '';
        if ($username === current_user()) {
            redirect_with_message('users.php', 'error', 'Não podes remover o teu próprio utilizador enquanto tens sessão iniciada com ele.');
        }
        unset($users[$username]);
        save_users($users);
        redirect_with_message('users.php', 'success', "Utilizador \"{$username}\" removido.");
    }
}

$users = load_users();
$pageTitle = 'Utilizadores';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Utilizadores do painel</h1>
</div>

<section class="form-section">
  <h2>Contas existentes</h2>
  <div class="table-scroll">
  <table class="users-table">
    <thead><tr><th>Utilizador</th><th>Nome</th><th>Nova password</th><th></th></tr></thead>
    <tbody>
      <?php foreach ($users as $username => $u): ?>
        <tr>
          <td><?= h($username) ?></td>
          <td><?= h($u['name'] ?? '') ?></td>
          <td>
            <form method="post" class="inline-form">
              <?= csrf_field() ?>
              <input type="hidden" name="form_action" value="change_password">
              <input type="hidden" name="username" value="<?= h($username) ?>">
              <input type="password" name="new_password" placeholder="mín. 8 caracteres" minlength="8">
              <button type="submit" class="btn btn-ghost btn-small">Alterar</button>
            </form>
          </td>
          <td>
            <?php if ($username !== current_user()): ?>
              <form method="post" class="inline-form" onsubmit="return confirm('Remover este utilizador?');">
                <?= csrf_field() ?>
                <input type="hidden" name="form_action" value="delete_user">
                <input type="hidden" name="username" value="<?= h($username) ?>">
                <button type="submit" class="btn btn-danger btn-small">Remover</button>
              </form>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</section>

<section class="form-section">
  <h2>Adicionar novo utilizador</h2>
  <form method="post" class="field-row">
    <?= csrf_field() ?>
    <input type="hidden" name="form_action" value="add_user">
    <label>Utilizador (para entrar)
      <input type="text" name="new_username" required pattern="[A-Za-z0-9_\-.]+" title="Letras, números, . _ -">
    </label>
    <label>Nome
      <input type="text" name="new_name" required>
    </label>
    <label>Password
      <input type="password" name="new_password" required minlength="8">
    </label>
    <button type="submit" class="btn btn-primary">Criar utilizador</button>
  </form>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>
