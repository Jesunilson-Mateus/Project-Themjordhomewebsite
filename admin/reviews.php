<?php
require_once __DIR__ . '/lib.php';
require_login();

function review_link_url($token) {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $adminPath = dirname($_SERVER['SCRIPT_NAME']);
    $rootPath = rtrim(dirname($adminPath), '/');
    return $scheme . '://' . $host . $rootPath . '/review.php?t=' . $token;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $reviews = load_reviews();
    $formAction = $_POST['form_action'] ?? '';

    if ($formAction === 'generate_link') {
        $slug = trim($_POST['slug'] ?? '');
        $properties = load_properties();
        if ($slug === '' || !isset($properties[$slug])) {
            redirect_with_message('reviews.php', 'error', 'Escolhe um apartamento válido.');
        }
        $token = new_review_token();
        $reviews[] = [
            'id' => 'r_' . substr($token, 0, 10),
            'token' => $token,
            'slug' => $slug,
            'status' => 'link_pending',
            'guestName' => null,
            'rating' => null,
            'text' => null,
            'createdAt' => date('c'),
            'submittedAt' => null,
            'approvedAt' => null,
        ];
        save_reviews($reviews);
        redirect_with_message('reviews.php', 'success', 'Link criado: ' . review_link_url($token));
    }

    if ($formAction === 'delete_link') {
        $id = $_POST['id'] ?? '';
        $reviews = array_values(array_filter($reviews, function ($r) use ($id) {
            return !($r['id'] === $id && $r['status'] === 'link_pending');
        }));
        save_reviews($reviews);
        redirect_with_message('reviews.php', 'success', 'Link removido.');
    }

    if ($formAction === 'approve') {
        $id = $_POST['id'] ?? '';
        foreach ($reviews as &$r) {
            if ($r['id'] === $id && $r['status'] === 'pending') {
                $r['status'] = 'approved';
                $r['approvedAt'] = date('c');
            }
        }
        unset($r);
        save_reviews($reviews);
        regenerate_reviews_js($reviews);
        redirect_with_message('reviews.php', 'success', 'Avaliação aprovada e publicada no site.');
    }

    if ($formAction === 'reject') {
        $id = $_POST['id'] ?? '';
        foreach ($reviews as &$r) {
            if ($r['id'] === $id && in_array($r['status'], ['pending', 'approved'], true)) {
                $r['status'] = 'rejected';
            }
        }
        unset($r);
        save_reviews($reviews);
        regenerate_reviews_js($reviews);
        redirect_with_message('reviews.php', 'success', 'Avaliação rejeitada/despublicada.');
    }
}

$reviews = load_reviews();
$properties = load_properties();
uasort($properties, function ($a, $b) { return strcasecmp($a['name'] ?? '', $b['name'] ?? ''); });

$linkPending = array_values(array_filter($reviews, function ($r) { return $r['status'] === 'link_pending'; }));
$pendingReview = array_values(array_filter($reviews, function ($r) { return $r['status'] === 'pending'; }));
$approved = array_values(array_filter($reviews, function ($r) { return $r['status'] === 'approved'; }));

function propName($properties, $slug) {
    return $properties[$slug]['name'] ?? $slug;
}
function stars($n) {
    $n = (int) $n;
    return str_repeat('★', max(0, min(5, $n))) . str_repeat('☆', max(0, 5 - $n));
}

$pageTitle = 'Avaliações';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Avaliações</h1>
</div>

<section class="form-section">
  <h2>Gerar link de avaliação</h2>
  <p class="hint">Depois da estadia, envia este link ao hóspede (email/WhatsApp) para ele deixar uma avaliação. Cada link só serve uma vez.</p>
  <form method="post" class="field-row" style="align-items:end;">
    <?= csrf_field() ?>
    <input type="hidden" name="form_action" value="generate_link">
    <label style="flex:2;">Apartamento
      <select name="slug" required>
        <option value="">— escolhe —</option>
        <?php foreach ($properties as $slug => $p): ?>
          <option value="<?= h($slug) ?>"><?= h($p['name'] ?? $slug) ?></option>
        <?php endforeach; ?>
      </select>
    </label>
    <button type="submit" class="btn btn-primary">Gerar link</button>
  </form>
</section>

<?php if ($linkPending): ?>
<section class="form-section">
  <h2>Links por usar <span class="count"><?= count($linkPending) ?></span></h2>
  <div class="table-scroll">
  <table class="users-table">
    <thead><tr><th>Apartamento</th><th>Link</th><th>Criado em</th><th></th></tr></thead>
    <tbody>
      <?php foreach ($linkPending as $r): ?>
        <tr>
          <td><?= h(propName($properties, $r['slug'])) ?></td>
          <td><code style="font-size:11px;"><?= h(review_link_url($r['token'])) ?></code></td>
          <td><?= h(date('d/m/Y', strtotime($r['createdAt']))) ?></td>
          <td>
            <form method="post" class="inline-form" onsubmit="return confirm('Remover este link?');">
              <?= csrf_field() ?>
              <input type="hidden" name="form_action" value="delete_link">
              <input type="hidden" name="id" value="<?= h($r['id']) ?>">
              <button type="submit" class="btn btn-ghost btn-small">Remover</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</section>
<?php endif; ?>

<section class="form-section">
  <h2>Por aprovar <span class="count"><?= count($pendingReview) ?></span></h2>
  <?php if (!$pendingReview): ?>
    <p class="hint">Sem avaliações à espera de aprovação.</p>
  <?php endif; ?>
  <?php foreach ($pendingReview as $r): ?>
    <div class="amenity-cat-block" style="margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <strong><?= h($r['guestName']) ?></strong> — <?= h(propName($properties, $r['slug'])) ?>
          <div style="color:var(--stone,#C9B79C); letter-spacing:.05em;"><?= stars($r['rating']) ?></div>
        </div>
        <div style="display:flex; gap:8px; align-self:flex-start;">
          <form method="post">
            <?= csrf_field() ?>
            <input type="hidden" name="form_action" value="approve">
            <input type="hidden" name="id" value="<?= h($r['id']) ?>">
            <button type="submit" class="btn btn-primary btn-small">Aprovar</button>
          </form>
          <form method="post" onsubmit="return confirm('Rejeitar esta avaliação?');">
            <?= csrf_field() ?>
            <input type="hidden" name="form_action" value="reject">
            <input type="hidden" name="id" value="<?= h($r['id']) ?>">
            <button type="submit" class="btn btn-danger btn-small">Rejeitar</button>
          </form>
        </div>
      </div>
      <p style="margin:10px 0 0; font-size:13.5px;"><?= nl2br(h($r['text'])) ?></p>
    </div>
  <?php endforeach; ?>
</section>

<section class="form-section">
  <h2>Publicadas <span class="count"><?= count($approved) ?></span></h2>
  <?php if (!$approved): ?>
    <p class="hint">Ainda sem avaliações publicadas.</p>
  <?php endif; ?>
  <?php foreach ($approved as $r): ?>
    <div class="amenity-cat-block" style="margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <strong><?= h($r['guestName']) ?></strong> — <?= h(propName($properties, $r['slug'])) ?>
          <div style="color:var(--stone,#C9B79C); letter-spacing:.05em;"><?= stars($r['rating']) ?></div>
        </div>
        <form method="post" onsubmit="return confirm('Despublicar esta avaliação do site?');">
          <?= csrf_field() ?>
          <input type="hidden" name="form_action" value="reject">
          <input type="hidden" name="id" value="<?= h($r['id']) ?>">
          <button type="submit" class="btn btn-ghost btn-small">Despublicar</button>
        </form>
      </div>
      <p style="margin:10px 0 0; font-size:13.5px;"><?= nl2br(h($r['text'])) ?></p>
    </div>
  <?php endforeach; ?>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>
