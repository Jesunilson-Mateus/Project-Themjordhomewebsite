<?php
require_once __DIR__ . '/lib.php';
require_login();

$galleries = load_service_galleries();

$pageTitle = 'Serviços';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Páginas de serviços</h1>
</div>
<p class="hint">Fotos da secção "Em imagens" de cada página de serviço. Podes mudar a legenda, trocar a foto, mudar a ordem, apagar ou acrescentar fotos. Apagar uma foto só a remove da página — o ficheiro não é apagado.</p>

<?php foreach ($galleries as $key => $svc): $photos = $svc['photos'] ?? []; ?>
<section class="form-section" id="svc-<?= h($key) ?>">
  <div class="page-head">
    <h2><?= h($svc['title'] ?? $key) ?> <span class="count"><?= count($photos) ?></span></h2>
    <a href="../<?= h($svc['page']) ?>" target="_blank" rel="noopener" class="btn btn-ghost btn-small">Ver página ↗</a>
  </div>

  <div class="photo-grid">
    <?php foreach ($photos as $i => $photo): ?>
      <form method="post" action="save-services.php" enctype="multipart/form-data" class="photo-card">
        <?= csrf_field() ?>
        <input type="hidden" name="service" value="<?= h($key) ?>">
        <input type="hidden" name="index" value="<?= (int) $i ?>">
        <input type="hidden" name="src" value="<?= h($photo['src']) ?>">
        <img src="<?= h(admin_img_src($photo['src'])) ?>" alt="" loading="lazy">
        <div class="photo-card-fields">
          <label>Legenda
            <input type="text" name="caption" value="<?= h($photo['caption'] ?? '') ?>">
          </label>
          <label>Descrição da foto <span class="hint">(para leitores de ecrã e Google)</span>
            <input type="text" name="alt" value="<?= h($photo['alt'] ?? '') ?>">
          </label>
          <label>Trocar foto
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp">
          </label>
        </div>
        <div class="photo-actions">
          <button type="submit" name="do" value="save" title="Guardar legenda, descrição e foto nova">Guardar</button>
          <button type="submit" name="do" value="move_up" title="Mover para trás" <?= $i === 0 ? 'disabled' : '' ?>>◀</button>
          <button type="submit" name="do" value="move_down" title="Mover para a frente" <?= $i === count($photos) - 1 ? 'disabled' : '' ?>>▶</button>
          <button type="submit" name="do" value="delete" class="btn-danger" title="Remover da página" onclick="return confirm('Remover esta foto da página?');">Apagar</button>
        </div>
      </form>
    <?php endforeach; ?>
  </div>

  <form method="post" action="save-services.php" enctype="multipart/form-data" class="upload-form">
    <?= csrf_field() ?>
    <input type="hidden" name="service" value="<?= h($key) ?>">
    <input type="hidden" name="do" value="add">
    <label>Acrescentar foto
      <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required>
    </label>
    <label>Legenda
      <input type="text" name="caption" required>
    </label>
    <label>Descrição da foto
      <input type="text" name="alt">
    </label>
    <button type="submit" class="btn btn-primary">Acrescentar</button>
  </form>
</section>
<?php endforeach; ?>

<?php require __DIR__ . '/partials/footer.php'; ?>
