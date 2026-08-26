<?php
if (!defined('ROOT_DIR')) { http_response_code(403); exit; }
/** Espera que $pageTitle esteja definido antes de incluir este ficheiro. */
$flash = pop_flash();
$__allUsers = load_users();
?>
<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= h($pageTitle ?? "Painel") ?> — TheMajord'Home</title>
<script>(function(){try{var t=localStorage.getItem('tmh_admin_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="admin-header">
  <a class="admin-logo" href="dashboard.php">TheMajord'Home <span>painel</span></a>
  <nav class="admin-nav">
    <a href="dashboard.php">Apartamentos</a>
    <a href="reviews.php">Avaliações</a>
    <a href="users.php">Utilizadores</a>
    <a href="../index.html" target="_blank" rel="noopener">Ver site ↗</a>
  </nav>
  <div class="admin-user">
    <button type="button" id="themeToggle" class="theme-toggle" aria-label="Alternar tema claro/escuro">
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
    </button>
    <span><?= h($__allUsers[current_user()]['name'] ?? current_user()) ?></span>
    <a href="logout.php">Sair</a>
  </div>
</header>
<main class="admin-main">
<?php if ($flash): ?>
  <div class="alert alert-<?= h($flash['type']) ?>"><?= h($flash['message']) ?></div>
<?php endif; ?>
