<?php
require_once __DIR__ . '/lib.php';
require_login();

$slug = $_GET['slug'] ?? '';
$properties = load_properties();
if ($slug === '' || !isset($properties[$slug])) {
    redirect_with_message('dashboard.php', 'error', 'Apartamento não encontrado.');
}
$prop = $properties[$slug];
$translations = load_translations();
$overlayPt = $translations[$slug]['pt'] ?? [];
$overlayFr = $translations[$slug]['fr'] ?? [];

$catalog = load_json(AMENITY_CATALOG_JSON);
$categories = load_amenity_categories();
$amenityItems = load_amenity_items();
$propAmenities = $prop['amenities'] ?? [];

// Ordem: categorias-padrão primeiro, depois quaisquer outras já usadas neste apartamento.
$categoryOrder = array_keys($categories);
foreach (array_keys($propAmenities) as $c) {
    if (!in_array($c, $categoryOrder, true)) $categoryOrder[] = $c;
}

$safetySmoke = 'unknown';
if (isset($prop['safety']['smokeAlarm'])) $safetySmoke = $prop['safety']['smokeAlarm'] ? 'yes' : 'no';
$safetyCo = 'unknown';
if (isset($prop['safety']['coAlarm'])) $safetyCo = $prop['safety']['coAlarm'] ? 'yes' : 'no';

$pageTitle = 'Editar — ' . ($prop['name'] ?? $slug);
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1><?= h($prop['name'] ?? $slug) ?></h1>
  <a href="../property.html?p=<?= urlencode($slug) ?>" target="_blank" rel="noopener" class="btn btn-ghost">Ver no site ↗</a>
</div>

<form method="post" action="save.php" class="admin-form">
  <?= csrf_field() ?>
  <input type="hidden" name="csrf_action" value="update_details">
  <input type="hidden" name="slug" value="<?= h($slug) ?>">

  <section class="form-section">
    <h2>Informação geral</h2>
    <div class="field-row">
      <label>Nome do apartamento
        <input type="text" name="name" value="<?= h($prop['name'] ?? '') ?>" required>
      </label>
      <label>Bairro / distrito
        <input type="text" name="district" value="<?= h($prop['district'] ?? '') ?>">
      </label>
    </div>
    <div class="field-row field-row-5">
      <label>Hóspedes
        <input type="number" name="guests" min="0" value="<?= (int) ($prop['guests'] ?? 0) ?>">
      </label>
      <label>Quartos <span class="hint">(0 = estúdio)</span>
        <input type="number" name="bedrooms" min="0" value="<?= (int) ($prop['bedrooms'] ?? 0) ?>">
      </label>
      <label>Camas
        <input type="number" name="beds" min="0" value="<?= (int) ($prop['beds'] ?? 0) ?>">
      </label>
      <label>Casas de banho
        <input type="number" name="bathrooms" min="0" value="<?= (int) ($prop['bathrooms'] ?? 0) ?>">
      </label>
      <label>Área (m²)
        <input type="number" name="size_m2" min="0" value="<?= h($prop['size_m2'] ?? '') ?>">
      </label>
    </div>
  </section>

  <section class="form-section">
    <h2>Descrição</h2>
    <div class="lang-tabs" role="tablist">
      <button type="button" class="lang-tab active" data-tab="pt">Português</button>
      <button type="button" class="lang-tab" data-tab="en">English (base)</button>
      <button type="button" class="lang-tab" data-tab="fr">Français</button>
    </div>

    <div class="lang-panel" data-panel="pt">
      <p class="hint">Se deixares um campo vazio aqui, o site mostra automaticamente o texto em English (base) para essa língua.</p>
      <label>Subtítulo (PT)
        <input type="text" name="subtitle_pt" value="<?= h($overlayPt['subtitle'] ?? '') ?>">
      </label>
      <label>Descrição (PT)
        <textarea name="description_pt" rows="6"><?= h($overlayPt['description'] ?? '') ?></textarea>
      </label>
      <label>Localização / morada (PT)
        <textarea name="neighborhood_pt" rows="3"><?= h($overlayPt['neighborhood'] ?? '') ?></textarea>
      </label>
    </div>

    <div class="lang-panel" data-panel="en" hidden>
      <p class="hint">Texto base — usado sempre que não existe tradução PT ou FR.</p>
      <label>Subtitle (EN)
        <input type="text" name="subtitle_en" value="<?= h($prop['subtitle'] ?? '') ?>">
      </label>
      <label>Description (EN)
        <textarea name="description_en" rows="6"><?= h($prop['description'] ?? '') ?></textarea>
      </label>
      <label>Neighbourhood / address (EN)
        <textarea name="neighborhood_en" rows="3"><?= h($prop['neighborhood'] ?? '') ?></textarea>
      </label>
    </div>

    <div class="lang-panel" data-panel="fr" hidden>
      <label>Sous-titre (FR)
        <input type="text" name="subtitle_fr" value="<?= h($overlayFr['subtitle'] ?? '') ?>">
      </label>
      <label>Description (FR)
        <textarea name="description_fr" rows="6"><?= h($overlayFr['description'] ?? '') ?></textarea>
      </label>
      <label>Quartier / adresse (FR)
        <textarea name="neighborhood_fr" rows="3"><?= h($overlayFr['neighborhood'] ?? '') ?></textarea>
      </label>
    </div>
  </section>

  <section class="form-section">
    <h2>Comodidades</h2>
    <p class="hint">Marca o que este apartamento tem. Para acrescentar algo que não está na lista, escreve o nome na caixa "outra comodidade" da categoria certa.</p>
    <div class="amenity-categories">
      <?php foreach ($categoryOrder as $cat): ?>
        <div class="amenity-cat-block">
          <h3><?= h($categories[$cat]['pt'] ?? $cat) ?></h3>
          <div class="amenity-checks">
            <?php
              $itemsForCat = $catalog[$cat] ?? [];
              // garante que os já selecionados aparecem mesmo que não estejam no catálogo derivado
              foreach (($propAmenities[$cat] ?? []) as $selectedItem) {
                  if (!in_array($selectedItem, $itemsForCat, true)) $itemsForCat[] = $selectedItem;
              }
              sort($itemsForCat);
              foreach ($itemsForCat as $item):
                $checked = in_array($item, $propAmenities[$cat] ?? [], true);
                $label = $amenityItems[$item]['pt'] ?? $item;
            ?>
              <label class="amenity-check">
                <input type="checkbox" name="amenities[<?= h($cat) ?>][]" value="<?= h($item) ?>" <?= $checked ? 'checked' : '' ?>>
                <?= h($label) ?><?php if ($label !== $item): ?><span class="amenity-en">(<?= h($item) ?>)</span><?php endif; ?>
              </label>
            <?php endforeach; ?>
          </div>
          <label class="amenity-new">+ outra comodidade nesta categoria
            <input type="text" name="amenities_new[<?= h($cat) ?>]" placeholder="Nome em inglês, ex: Board games">
          </label>
        </div>
      <?php endforeach; ?>
    </div>

    <details class="new-category">
      <summary>+ Criar uma categoria nova de comodidades</summary>
      <div class="field-row">
        <label>Nome da categoria (inglês, ex: "Wellness")
          <input type="text" name="new_category_name">
        </label>
        <label>Tradução em português
          <input type="text" name="new_category_pt">
        </label>
        <label>Primeira comodidade (inglês)
          <input type="text" name="new_category_item">
        </label>
        <label>Tradução em português
          <input type="text" name="new_category_item_pt">
        </label>
      </div>
    </details>
  </section>

  <section class="form-section">
    <h2>Regras da casa</h2>
    <div class="field-row">
      <label>Check-in
        <input type="text" name="checkIn" value="<?= h($prop['checkIn'] ?? '') ?>" placeholder="ex: 16:00–23:00">
      </label>
      <label>Check-out
        <input type="text" name="checkOut" value="<?= h($prop['checkOut'] ?? '') ?>" placeholder="ex: 11:00">
      </label>
    </div>
    <div class="field-row">
      <label>Alarme de fumo
        <select name="safety_smoke">
          <option value="unknown" <?= $safetySmoke === 'unknown' ? 'selected' : '' ?>>Não sei / não aplicável</option>
          <option value="yes" <?= $safetySmoke === 'yes' ? 'selected' : '' ?>>Tem alarme</option>
          <option value="no" <?= $safetySmoke === 'no' ? 'selected' : '' ?>>Não tem alarme</option>
        </select>
      </label>
      <label>Alarme de monóxido de carbono
        <select name="safety_co">
          <option value="unknown" <?= $safetyCo === 'unknown' ? 'selected' : '' ?>>Não sei / não aplicável</option>
          <option value="yes" <?= $safetyCo === 'yes' ? 'selected' : '' ?>>Tem alarme</option>
          <option value="no" <?= $safetyCo === 'no' ? 'selected' : '' ?>>Não tem alarme</option>
        </select>
      </label>
    </div>
  </section>

  <button type="submit" class="btn btn-primary btn-large">Guardar alterações</button>
</form>

<section class="form-section">
  <h2>Fotos</h2>
  <p class="hint">A foto marcada como "capa" é a que aparece nos cartões e na listagem. Apagar uma foto só a remove do site — o ficheiro original não é apagado.</p>

  <div class="photo-grid">
    <?php foreach (($prop['images'] ?? []) as $i => $img): ?>
      <form method="post" action="save.php" class="photo-card">
        <?= csrf_field() ?>
        <input type="hidden" name="csrf_action" value="photo_action">
        <input type="hidden" name="slug" value="<?= h($slug) ?>">
        <input type="hidden" name="photo" value="<?= h($img) ?>">
        <img src="<?= h(admin_img_src($img)) ?>" alt="" loading="lazy">
        <?php if (($prop['heroImage'] ?? '') === $img): ?>
          <span class="photo-hero-badge">Capa</span>
        <?php endif; ?>
        <div class="photo-actions">
          <?php if (($prop['heroImage'] ?? '') !== $img): ?>
            <button type="submit" name="do" value="set_hero" title="Definir como capa">★ Capa</button>
          <?php endif; ?>
          <button type="submit" name="do" value="move_up" title="Mover para trás" <?= $i === 0 ? 'disabled' : '' ?>>◀</button>
          <button type="submit" name="do" value="move_down" title="Mover para a frente" <?= $i === count($prop['images']) - 1 ? 'disabled' : '' ?>>▶</button>
          <button type="submit" name="do" value="delete_photo" class="btn-danger" title="Remover do site" onclick="return confirm('Remover esta foto do site?');">Apagar</button>
        </div>
      </form>
    <?php endforeach; ?>
  </div>

  <form method="post" action="save.php" enctype="multipart/form-data" class="upload-form">
    <?= csrf_field() ?>
    <input type="hidden" name="csrf_action" value="upload_photo">
    <input type="hidden" name="slug" value="<?= h($slug) ?>">
    <label>Adicionar foto(s) novas
      <input type="file" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple required>
    </label>
    <button type="submit" class="btn btn-primary">Enviar foto(s)</button>
  </form>
</section>

<script>
  document.querySelectorAll('.lang-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.lang-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.lang-panel').forEach(p => p.hidden = true);
      btn.classList.add('active');
      document.querySelector('.lang-panel[data-panel="' + btn.dataset.tab + '"]').hidden = false;
    });
  });
</script>

<?php require __DIR__ . '/partials/footer.php'; ?>
