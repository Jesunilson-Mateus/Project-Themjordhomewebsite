<?php
require_once __DIR__ . '/lib.php';

if (current_user()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $throttle = login_throttle_check($ip);

    if ($throttle['blocked']) {
        $minutes = (int) ceil($throttle['wait'] / 60);
        $error = "Demasiadas tentativas falhadas. Tenta novamente daqui a {$minutes} min.";
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = (string) ($_POST['password'] ?? '');
        $users = load_users();

        if (isset($users[$username]) && password_verify($password, $users[$username]['passwordHash'])) {
            login_throttle_clear($ip);
            session_regenerate_id(true);
            $_SESSION['tmh_user'] = $username;
            header('Location: dashboard.php');
            exit;
        }
        login_throttle_register_failure($ip);
        $error = 'Utilizador ou password incorretos.';
    }
}
?>
<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Entrar — Painel TheMajord'Home</title>
<script>(function(){try{var t=localStorage.getItem('tmh_admin_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body class="login-page">
  <button type="button" id="themeToggle" class="theme-toggle login-theme-toggle" aria-label="Alternar tema claro/escuro">
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
  </button>
  <div class="login-box">
    <h1>TheMajord'Home</h1>
    <p class="login-sub">Painel de gestão dos apartamentos</p>
    <?php if ($error): ?>
      <div class="alert alert-error"><?= h($error) ?></div>
    <?php endif; ?>
    <form method="post" novalidate>
      <?= csrf_field() ?>
      <label for="username">Utilizador</label>
      <input type="text" id="username" name="username" autocomplete="username" required autofocus>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required>
      <button type="submit" class="btn btn-primary">Entrar</button>
    </form>
  </div>
<script>
(function(){
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    var isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('tmh_admin_theme', next); } catch (e) {}
  });
})();
</script>
</body>
</html>
