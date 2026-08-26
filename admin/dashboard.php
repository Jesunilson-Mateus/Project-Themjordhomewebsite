<?php
require_once __DIR__ . '/lib.php';
require_login();

$properties = load_properties();
// Ordenado por nome para ser fácil de encontrar.
uasort($properties, function ($a, $b) { return strcasecmp($a['name'] ?? '', $b['name'] ?? ''); });

$pageTitle = 'Apartamentos';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Apartamentos <span class="count"><?= count($properties) ?></span></h1>
  <input type="search" id="filterBox" placeholder="Procurar por nome ou bairro…" class="filter-box">
</div>

<div class="apt-grid" id="aptGrid">
  <?php foreach ($properties as $slug => $p): ?>
    <div class="apt-card" data-search="<?= h(mb_strtolower(($p['name'] ?? '') . ' ' . ($p['district'] ?? ''))) ?>">
      <a href="edit.php?slug=<?= urlencode($slug) ?>" class="apt-card-link">
        <div class="apt-card-photo">
          <?php if (!empty($p['heroImage'])): ?>
            <img src="<?= h(admin_img_src($p['heroImage'])) ?>" alt="" loading="lazy">
          <?php else: ?>
            <div class="apt-card-photo-empty">Sem foto</div>
          <?php endif; ?>
        </div>
        <div class="apt-card-body">
          <div class="apt-card-name"><?= h($p['name'] ?? $slug) ?></div>
          <div class="apt-card-meta"><?= h($p['district'] ?? '') ?> · <?= (int) ($p['guests'] ?? 0) ?> hóspedes</div>
        </div>
      </a>
      <a class="apt-card-view" href="../property.html?p=<?= urlencode($slug) ?>" target="_blank" rel="noopener">Ver no site ↗</a>
    </div>
  <?php endforeach; ?>
</div>

<script>
  document.getElementById('filterBox').addEventListener('input', function () {
    var q = this.value.trim().toLowerCase();
    document.querySelectorAll('#aptGrid .apt-card').forEach(function (card) {
      card.style.display = card.dataset.search.indexOf(q) !== -1 ? '' : 'none';
    });
  });
</script>

<?php require __DIR__ . '/partials/footer.php'; ?>
