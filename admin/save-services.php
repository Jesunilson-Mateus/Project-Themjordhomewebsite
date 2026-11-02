<?php
require_once __DIR__ . '/lib.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: services.php');
    exit;
}

require_csrf();

$galleries = load_service_galleries();
$key = $_POST['service'] ?? '';
if (!isset($galleries[$key])) {
    redirect_with_message('services.php', 'error', 'Página de serviço não encontrada.');
}

$backTo = 'services.php#svc-' . urlencode($key);
$photos = $galleries[$key]['photos'] ?? [];
$do = $_POST['do'] ?? '';

/**
 * Grava a foto enviada no campo "photo" em img/servicos/ e devolve o
 * caminho relativo, null se não veio ficheiro, ou false se foi rejeitada.
 */
function take_service_upload() {
    $file = $_FILES['photo'] ?? null;
    if (!$file || $file['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] > MAX_UPLOAD_BYTES) return false;

    $destName = next_photo_filename(SERVICE_IMG_FOLDER, $file['name']);
    $destPath = slug_img_dir(SERVICE_IMG_FOLDER) . '/' . $destName;
    if (!process_uploaded_image($file['tmp_name'], $destPath)) return false;
    return 'img/' . SERVICE_IMG_FOLDER . '/' . $destName;
}

/* =========================================================================
   Acrescentar uma foto nova no fim da galeria
   ========================================================================= */
if ($do === 'add') {
    $src = take_service_upload();
    if (!$src) {
        redirect_with_message($backTo, 'error', 'A foto não foi aceite (formato ou tamanho).');
    }
    $photos[] = [
        'src' => $src,
        'caption' => trim($_POST['caption'] ?? ''),
        'alt' => trim($_POST['alt'] ?? '') ?: trim($_POST['caption'] ?? ''),
    ];
    $galleries[$key]['photos'] = $photos;
    persist_service_galleries($galleries, $key);
    redirect_with_message($backTo, 'success', 'Foto acrescentada.');
}

/* =========================================================================
   Ações sobre uma foto existente. O índice tem de corresponder ao ficheiro
   (proteção contra formulários desatualizados noutro separador).
   ========================================================================= */
if (!in_array($do, ['save', 'move_up', 'move_down', 'delete'], true)) {
    redirect_with_message($backTo, 'error', 'Ação desconhecida.');
}
$idx = (int) ($_POST['index'] ?? -1);
if (!isset($photos[$idx]) || $photos[$idx]['src'] !== ($_POST['src'] ?? '')) {
    redirect_with_message($backTo, 'error', 'A galeria mudou entretanto — recarrega a página e tenta de novo.');
}

// Legenda e descrição vão sempre com o formulário da foto: guardam-se em qualquer ação.
$photos[$idx]['caption'] = trim($_POST['caption'] ?? $photos[$idx]['caption']);
$photos[$idx]['alt'] = trim($_POST['alt'] ?? $photos[$idx]['alt']);
$message = 'Alterações guardadas.';

if ($do === 'save') {
    $src = take_service_upload();
    if ($src === false) {
        redirect_with_message($backTo, 'error', 'A foto nova não foi aceite (formato ou tamanho).');
    }
    if ($src) {
        $photos[$idx]['src'] = $src;
        $message = 'Foto trocada.';
    }
} elseif ($do === 'move_up' && $idx > 0) {
    [$photos[$idx - 1], $photos[$idx]] = [$photos[$idx], $photos[$idx - 1]];
} elseif ($do === 'move_down' && $idx < count($photos) - 1) {
    [$photos[$idx + 1], $photos[$idx]] = [$photos[$idx], $photos[$idx + 1]];
} elseif ($do === 'delete') {
    array_splice($photos, $idx, 1);
    $message = 'Foto removida da página.';
}

$galleries[$key]['photos'] = $photos;
persist_service_galleries($galleries, $key);
redirect_with_message($backTo, 'success', $message);
