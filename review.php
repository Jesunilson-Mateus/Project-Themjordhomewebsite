<?php
require_once __DIR__ . '/admin/config.php';
require_once __DIR__ . '/admin/lib.php';

$token = trim($_GET['t'] ?? $_POST['t'] ?? '');
$reviews = load_reviews();
$index = null;
foreach ($reviews as $i => $r) {
    if ($r['token'] === $token) { $index = $i; break; }
}

$error = '';
$done = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $index !== null && $reviews[$index]['status'] === 'link_pending') {
    $name = trim($_POST['guestName'] ?? '');
    $rating = (int) ($_POST['rating'] ?? 0);
    $text = trim($_POST['text'] ?? '');
    $honeypot = trim($_POST['website'] ?? '');

    if ($honeypot !== '') {
        // bot — finge sucesso sem gravar nada.
        $done = true;
    } elseif ($name === '' || mb_strlen($name) > 80) {
        $error = 'Escreve o teu nome (até 80 caracteres).';
    } elseif ($rating < 1 || $rating > 5) {
        $error = 'Escolhe uma classificação de 1 a 5 estrelas.';
    } elseif ($text === '' || mb_strlen($text) > 2000) {
        $error = 'Escreve a tua avaliação (até 2000 caracteres).';
    } else {
        $reviews[$index]['guestName'] = $name;
        $reviews[$index]['rating'] = $rating;
        $reviews[$index]['text'] = $text;
        $reviews[$index]['status'] = 'pending';
        $reviews[$index]['submittedAt'] = date('c');
        save_reviews($reviews);
        $done = true;
    }
}

$properties = load_properties();
$slug = $index !== null ? $reviews[$index]['slug'] : null;
$propName = $slug && isset($properties[$slug]) ? $properties[$slug]['name'] : '';
$linkValid = $index !== null && $reviews[$index]['status'] === 'link_pending';
$alreadyUsed = $index !== null && $reviews[$index]['status'] !== 'link_pending' && !$done;
?>
<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Deixar avaliação — TheMajord'Home</title>
<script>(function(){try{var t=localStorage.getItem('tmh_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="review-page">
  <div class="review-box">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <a class="review-logo" href="index.html" style="margin-bottom:0;">TheMajord'Home</a>
      <button type="button" class="theme-toggle" aria-label="Alternar tema claro/escuro">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
      </button>
    </div>

    <?php if ($done): ?>
      <h1>Obrigado!</h1>
      <p class="review-sub">A tua avaliação foi enviada e vai aparecer no site assim que for revista pela nossa equipa.</p>

    <?php elseif (!$linkValid && !$alreadyUsed): ?>
      <h1>Link inválido</h1>
      <p class="review-sub">Este link de avaliação não existe. Verifica se copiaste o endereço completo.</p>

    <?php elseif ($alreadyUsed): ?>
      <h1>Link já usado</h1>
      <p class="review-sub">Esta avaliação já foi submetida anteriormente. Obrigado!</p>

    <?php else: ?>
      <h1>Como foi a tua estadia?</h1>
      <p class="review-sub"><?= h($propName) ?></p>

      <?php if ($error): ?>
        <div class="alert alert-error"><?= h($error) ?></div>
      <?php endif; ?>

      <form method="post">
        <input type="hidden" name="t" value="<?= h($token) ?>">
        <div style="position:absolute; left:-9999px;" aria-hidden="true">
          <label>Não preencher: <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        </div>

        <div class="star-input" role="radiogroup" aria-label="Classificação">
          <?php for ($i = 5; $i >= 1; $i--): ?>
            <input type="radio" name="rating" id="star<?= $i ?>" value="<?= $i ?>" aria-label="<?= $i ?> estrela<?= $i > 1 ? 's' : '' ?>" required>
            <label for="star<?= $i ?>" aria-hidden="true">★</label>
          <?php endfor; ?>
        </div>

        <label>O teu nome
          <input type="text" name="guestName" maxlength="80" required>
        </label>
        <label>A tua avaliação
          <textarea name="text" rows="5" maxlength="2000" required></textarea>
        </label>

        <button type="submit" class="btn-cookie btn-cookie-accept" style="width:100%; margin-top:18px; padding:14px;">Enviar avaliação</button>
      </form>
    <?php endif; ?>
  </div>
</div>
<script src="js/theme.js"></script>
</body>
</html>
