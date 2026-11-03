<?php
require_once __DIR__ . '/lib.php';
require_login();

$faq = load_faq();
$langs = ['pt' => 'Português', 'en' => 'English', 'fr' => 'Français'];
$drafts = faq_draft_count($faq);

$pageTitle = 'Perguntas frequentes';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Perguntas frequentes</h1>
  <a href="../faq.html" target="_blank" rel="noopener" class="btn btn-ghost">Ver página ↗</a>
</div>
<p class="hint">Perguntas e respostas da página <b>faq.html</b>, em português, inglês e francês. As perguntas marcadas como <b>a confirmar</b> não aparecem no site — servem para preparar respostas que ainda dependem de uma decisão (preços, cancelamento…). Se um campo em inglês ou francês ficar vazio, o site mostra o texto em português.</p>
<?php if ($drafts): ?>
  <div class="alert alert-error"><?= $drafts ?> pergunta<?= $drafts === 1 ? '' : 's' ?> a confirmar — não aparece<?= $drafts === 1 ? '' : 'm' ?> no site até ser<?= $drafts === 1 ? '' : 'em' ?> completada<?= $drafts === 1 ? '' : 's' ?> e publicada<?= $drafts === 1 ? '' : 's' ?>.</div>
<?php endif; ?>

<?php foreach ($faq as $key => $section): $items = $section['items'] ?? []; ?>
<section class="form-section" id="faq-<?= h($key) ?>">
  <div class="page-head">
    <h2><?= h($section['title']['pt'] ?? $key) ?> <span class="count"><?= count($items) ?></span></h2>
    <a href="../faq.html#<?= $key === 'owners' ? 'proprietarios' : 'hospedes' ?>" target="_blank" rel="noopener" class="btn btn-ghost btn-small">Ver secção ↗</a>
  </div>

  <?php foreach ($items as $i => $item): $isDraft = !empty($item['draft']); ?>
    <details class="faq-item<?= $isDraft ? ' is-draft' : '' ?>" id="faq-<?= h($key) ?>-<?= (int) $i ?>">
      <summary>
        <span class="faq-num"><?= sprintf('%02d', $i + 1) ?></span>
        <span class="faq-q"><?= h($item['q']['pt'] ?? '') ?></span>
        <?php if ($isDraft): ?><span class="status-badge status-inactive">A confirmar</span><?php else: ?><span class="status-badge status-active">No site</span><?php endif; ?>
      </summary>
      <form method="post" action="save-faq.php" class="faq-form">
        <?= csrf_field() ?>
        <input type="hidden" name="section" value="<?= h($key) ?>">
        <input type="hidden" name="index" value="<?= (int) $i ?>">
        <input type="hidden" name="check" value="<?= h(md5($item['q']['pt'] ?? '')) ?>">
        <div class="faq-langs">
          <?php foreach ($langs as $lang => $label): ?>
            <div class="faq-lang">
              <div class="faq-lang-name"><?= h($label) ?></div>
              <label>Pergunta
                <input type="text" name="q_<?= $lang ?>" value="<?= h($item['q'][$lang] ?? '') ?>"<?= $lang === 'pt' ? ' required' : '' ?>>
              </label>
              <label>Resposta
                <textarea name="a_<?= $lang ?>" rows="7"<?= $lang === 'pt' ? ' required' : '' ?>><?= h($item['a'][$lang] ?? '') ?></textarea>
              </label>
            </div>
          <?php endforeach; ?>
        </div>
        <label class="faq-draft-check"><input type="checkbox" name="draft" value="1"<?= $isDraft ? ' checked' : '' ?>> A confirmar <span class="hint">(não aparece no site)</span></label>
        <div class="photo-actions">
          <button type="submit" name="do" value="save" class="btn btn-primary btn-small">Guardar</button>
          <button type="submit" name="do" value="move_up" class="btn btn-small" title="Mover para cima" <?= $i === 0 ? 'disabled' : '' ?>>▲</button>
          <button type="submit" name="do" value="move_down" class="btn btn-small" title="Mover para baixo" <?= $i === count($items) - 1 ? 'disabled' : '' ?>>▼</button>
          <button type="submit" name="do" value="delete" class="btn btn-danger btn-small" formnovalidate onclick="return confirm('Apagar esta pergunta?');">Apagar</button>
        </div>
      </form>
    </details>
  <?php endforeach; ?>

  <details class="faq-item faq-new">
    <summary><span class="faq-num">+</span><span class="faq-q">Acrescentar pergunta</span></summary>
    <form method="post" action="save-faq.php" class="faq-form">
      <?= csrf_field() ?>
      <input type="hidden" name="section" value="<?= h($key) ?>">
      <input type="hidden" name="do" value="add">
      <div class="faq-langs">
        <?php foreach ($langs as $lang => $label): ?>
          <div class="faq-lang">
            <div class="faq-lang-name"><?= h($label) ?></div>
            <label>Pergunta
              <input type="text" name="q_<?= $lang ?>"<?= $lang === 'pt' ? ' required' : '' ?>>
            </label>
            <label>Resposta
              <textarea name="a_<?= $lang ?>" rows="5"<?= $lang === 'pt' ? ' required' : '' ?>></textarea>
            </label>
          </div>
        <?php endforeach; ?>
      </div>
      <label class="faq-draft-check"><input type="checkbox" name="draft" value="1"> A confirmar <span class="hint">(não aparece no site)</span></label>
      <button type="submit" class="btn btn-primary">Acrescentar</button>
    </form>
  </details>
</section>
<?php endforeach; ?>

<p class="hint">Uma linha em branco separa parágrafos. Emails, telefones (+351…) e endereços https:// ficam clicáveis no site.</p>

<script>
  // Depois de gravar, volta aberta a pergunta que foi editada.
  (function () {
    var el = location.hash && document.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') el.open = true;
  })();
</script>

<?php require __DIR__ . '/partials/footer.php'; ?>
