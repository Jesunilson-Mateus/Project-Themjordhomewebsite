<?php
require_once __DIR__ . '/lib.php';
require_login();

/* Liga/desliga o modo manutenção e a pré-visualização do site para este browser. */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $do = $_POST['do'] ?? '';
    $cookie = ['expires' => 0, 'path' => '/', 'secure' => $tmh_isHttps, 'httponly' => true, 'samesite' => 'Lax'];

    if ($do === 'on') {
        set_maintenance(true);
        // Quem liga continua a ver o site normal (para poder testar).
        setcookie(MAINTENANCE_PREVIEW_COOKIE, '1', $cookie);
        redirect_with_message('maintenance.php', 'success', 'Modo manutenção ligado: os visitantes veem agora a página de manutenção.');
    } elseif ($do === 'off') {
        set_maintenance(false);
        setcookie(MAINTENANCE_PREVIEW_COOKIE, '', ['expires' => time() - 3600] + $cookie);
        redirect_with_message('maintenance.php', 'success', 'Modo manutenção desligado: o site está outra vez visível para todos.');
    } elseif ($do === 'preview_on') {
        setcookie(MAINTENANCE_PREVIEW_COOKIE, '1', $cookie);
        redirect_with_message('maintenance.php', 'success', 'Neste browser vês o site normal, mesmo com a manutenção ligada.');
    } elseif ($do === 'preview_off') {
        setcookie(MAINTENANCE_PREVIEW_COOKIE, '', ['expires' => time() - 3600] + $cookie);
        redirect_with_message('maintenance.php', 'success', 'Neste browser vês o site como um visitante.');
    }
    redirect_with_message('maintenance.php', 'error', 'Ação desconhecida.');
}

$status = maintenance_status();
$previewing = !empty($_COOKIE[MAINTENANCE_PREVIEW_COOKIE]);

$pageTitle = 'Manutenção';
require __DIR__ . '/partials/header.php';
?>

<div class="page-head">
  <h1>Modo manutenção <?= $status
      ? '<span class="status-badge status-inactive">Ligado</span>'
      : '<span class="status-badge status-active">Desligado</span>' ?></h1>
  <a href="../manutencao.html" target="_blank" rel="noopener" class="btn btn-ghost">Ver a página de manutenção ↗</a>
</div>

<section class="form-section">
  <?php if ($status): ?>
    <p><b>O site está em manutenção.</b> Os visitantes veem a página "Voltamos já" em todos os endereços.
      <?php if (!empty($status['since'])): ?>
        Ligado em <?= h(date('d/m/Y \à\s H:i', strtotime($status['since']))) ?><?= !empty($status['by']) ? ' por ' . h($status['by']) : '' ?>.
      <?php endif; ?>
    </p>
    <form method="post" class="maintenance-actions">
      <?= csrf_field() ?>
      <button type="submit" name="do" value="off" class="btn btn-primary btn-large">Desligar manutenção — reabrir o site</button>
    </form>
  <?php else: ?>
    <p>O site está <b>aberto</b> a todos. Ligar a manutenção mostra a página "Voltamos já" em vez do site, por exemplo
      durante uma atualização ou uma mudança de servidor.</p>
    <form method="post" class="maintenance-actions">
      <?= csrf_field() ?>
      <button type="submit" name="do" value="on" class="btn btn-danger btn-large"
              onclick="return confirm('Ligar o modo manutenção? Os visitantes deixam de ver o site até o desligares.');">Ligar manutenção</button>
    </form>
  <?php endif; ?>
</section>

<section class="form-section">
  <h2>O que continua a funcionar durante a manutenção</h2>
  <ul class="plain-list">
    <li>Este painel (<code>/admin/</code>).</li>
    <li>Os avisos de pagamento do Stripe (<code>api/stripe-webhook.php</code>), para não se perderem pagamentos já feitos.</li>
    <li>Novas reservas e a página de avaliações <b>ficam fechadas</b> até desligares a manutenção.</li>
  </ul>

  <h2>Ver o site enquanto está em manutenção</h2>
  <p>Quem liga a manutenção continua a ver o site normal neste browser, para poder testar.
     Neste momento: <b><?= $previewing ? 'vês o site normal' : 'vês o que os visitantes veem' ?></b>.</p>
  <form method="post">
    <?= csrf_field() ?>
    <?php if ($previewing): ?>
      <button type="submit" name="do" value="preview_off" class="btn">Ver como visitante</button>
    <?php else: ?>
      <button type="submit" name="do" value="preview_on" class="btn">Ver o site normal neste browser</button>
    <?php endif; ?>
  </form>
  <p class="hint" style="margin-top:14px;">Funciona em servidores Apache (o que está configurado no ficheiro <code>.htaccess</code> da raiz). Noutro tipo de servidor, o engenheiro tem de replicar a regra — ver o guia técnico.</p>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>
