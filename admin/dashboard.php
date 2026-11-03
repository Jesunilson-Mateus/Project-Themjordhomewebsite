<?php
require_once __DIR__ . '/lib.php';
require_login();

$properties = load_properties();
// Ordenado por nome para ser fácil de encontrar.
uasort($properties, function ($a, $b) { return strcasecmp($a['name'] ?? '', $b['name'] ?? ''); });

$activeCount = count(array_filter($properties, 'property_is_active'));
$inactiveCount = count($properties) - $activeCount;

$pageTitle = 'Apartamentos';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Apartamentos <span class="count"><?= count($properties) ?></span></h1>
  <div class="dash-filters">
    <div class="status-filter" role="group" aria-label="Filtrar por estado">
      <button type="button" class="is-on" data-status="all">Todos <span><?= count($properties) ?></span></button>
      <button type="button" data-status="active">Ativos <span><?= $activeCount ?></span></button>
      <button type="button" data-status="inactive">Inativos <span><?= $inactiveCount ?></span></button>
    </div>
    <input type="search" id="filterBox" placeholder="Procurar por nome ou bairro…" class="filter-box">
  </div>
</div>

<div class="apt-grid" id="aptGrid">
  <?php foreach ($properties as $slug => $p): $isActive = property_is_active($p); ?>
    <div class="apt-card<?= $isActive ? '' : ' is-inactive' ?>" id="apt-<?= h($slug) ?>"
         data-status="<?= $isActive ? 'active' : 'inactive' ?>"
         data-search="<?= h(mb_strtolower(($p['name'] ?? '') . ' ' . ($p['district'] ?? ''))) ?>">
      <a href="edit.php?slug=<?= urlencode($slug) ?>" class="apt-card-link">
        <div class="apt-card-photo">
          <?php if (!empty($p['heroImage'])): ?>
            <img src="<?= h(admin_img_src($p['heroImage'])) ?>" alt="" loading="lazy">
          <?php else: ?>
            <div class="apt-card-photo-empty">Sem foto</div>
          <?php endif; ?>
          <?= active_badge($p) ?>
        </div>
        <div class="apt-card-body">
          <div class="apt-card-name"><?= h($p['name'] ?? $slug) ?></div>
          <div class="apt-card-meta"><?= h($p['district'] ?? '') ?> · <?= (int) ($p['guests'] ?? 0) ?> hóspedes</div>
        </div>
      </a>
      <div class="apt-card-actions">
        <?php if ($isActive): ?>
          <a class="apt-card-view" href="../property.html?p=<?= urlencode($slug) ?>" target="_blank" rel="noopener">Ver no site ↗</a>
        <?php else: ?>
          <span class="apt-card-view is-muted">Não aparece no site</span>
        <?php endif; ?>
        <form method="post" action="save.php">
          <?= csrf_field() ?>
          <input type="hidden" name="csrf_action" value="toggle_active">
          <input type="hidden" name="slug" value="<?= h($slug) ?>">
          <input type="hidden" name="active" value="<?= $isActive ? '0' : '1' ?>">
          <?php if ($isActive): ?>
            <button type="submit" class="toggle-btn"
                    onclick="return confirm('Desativar &quot;<?= h(addslashes($p['name'] ?? $slug)) ?>&quot;? Deixa de aparecer no site e não pode ser reservado.');">Desativar</button>
          <?php else: ?>
            <button type="submit" class="toggle-btn toggle-btn-on">Ativar</button>
          <?php endif; ?>
        </form>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<script>
  (function () {
    var box = document.getElementById('filterBox');
    var status = 'all';
    function apply() {
      var q = box.value.trim().toLowerCase();
      document.querySelectorAll('#aptGrid .apt-card').forEach(function (card) {
        var okText = card.dataset.search.indexOf(q) !== -1;
        var okStatus = status === 'all' || card.dataset.status === status;
        card.style.display = okText && okStatus ? '' : 'none';
      });
    }
    box.addEventListener('input', apply);
    document.querySelectorAll('.status-filter button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.status-filter button').forEach(function (b) { b.classList.remove('is-on'); });
        btn.classList.add('is-on');
        status = btn.dataset.status;
        apply();
      });
    });
  })();
</script>

<?php require __DIR__ . '/partials/footer.php'; ?>
