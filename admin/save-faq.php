<?php
require_once __DIR__ . '/lib.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: faq.php');
    exit;
}

require_csrf();

$faq = load_faq();
$key = $_POST['section'] ?? '';
if (!isset($faq[$key])) {
    redirect_with_message('faq.php', 'error', 'Secção não encontrada.');
}

$items = $faq[$key]['items'] ?? [];
$do = $_POST['do'] ?? '';

/** Pergunta a partir dos campos do formulário. */
function faq_item_from_post() {
    $item = ['q' => [], 'a' => [], 'draft' => !empty($_POST['draft'])];
    foreach (['pt', 'en', 'fr'] as $lang) {
        $item['q'][$lang] = trim($_POST['q_' . $lang] ?? '');
        // quebras de linha normalizadas (o browser envia \r\n)
        $item['a'][$lang] = trim(str_replace("\r\n", "\n", $_POST['a_' . $lang] ?? ''));
    }
    return $item;
}

/** Mensagem de erro se a pergunta não pode ser gravada assim, ou null. */
function faq_item_problem($item) {
    if ($item['q']['pt'] === '' || $item['a']['pt'] === '') {
        return 'A pergunta e a resposta em português são obrigatórias.';
    }
    if (!$item['draft']) {
        foreach (['q', 'a'] as $field) {
            foreach ($item[$field] as $text) {
                if (preg_match('/\[(A CONFIRMAR|TO CONFIRM|À CONFIRMER)/iu', $text)) {
                    return 'Ainda há texto entre [ ] por confirmar. Completa a resposta ou deixa a pergunta marcada como "a confirmar".';
                }
            }
        }
    }
    return null;
}

/* =========================================================================
   Acrescentar uma pergunta no fim da secção
   ========================================================================= */
if ($do === 'add') {
    $item = faq_item_from_post();
    if ($problem = faq_item_problem($item)) {
        redirect_with_message('faq.php#faq-' . urlencode($key), 'error', $problem);
    }
    $items[] = $item;
    $faq[$key]['items'] = $items;
    persist_faq($faq);
    redirect_with_message('faq.php#faq-' . urlencode($key) . '-' . (count($items) - 1), 'success', 'Pergunta acrescentada.');
}

/* =========================================================================
   Ações sobre uma pergunta existente. O índice tem de corresponder à
   pergunta gravada (proteção contra formulários desatualizados noutro
   separador).
   ========================================================================= */
if (!in_array($do, ['save', 'move_up', 'move_down', 'delete'], true)) {
    redirect_with_message('faq.php', 'error', 'Ação desconhecida.');
}
$idx = (int) ($_POST['index'] ?? -1);
if (!isset($items[$idx]) || md5($items[$idx]['q']['pt'] ?? '') !== ($_POST['check'] ?? '')) {
    redirect_with_message('faq.php#faq-' . urlencode($key), 'error', 'As perguntas mudaram entretanto — recarrega a página e tenta de novo.');
}

$message = 'Alterações guardadas.';

if ($do === 'delete') {
    array_splice($items, $idx, 1);
    $faq[$key]['items'] = $items;
    persist_faq($faq);
    redirect_with_message('faq.php#faq-' . urlencode($key), 'success', 'Pergunta apagada.');
}

// Guardar, subir e descer gravam também o que estiver escrito no formulário.
$item = faq_item_from_post();
if ($problem = faq_item_problem($item)) {
    redirect_with_message('faq.php#faq-' . urlencode($key) . '-' . $idx, 'error', $problem);
}
$items[$idx] = $item;

if ($do === 'move_up' && $idx > 0) {
    [$items[$idx - 1], $items[$idx]] = [$items[$idx], $items[$idx - 1]];
    $idx--;
} elseif ($do === 'move_down' && $idx < count($items) - 1) {
    [$items[$idx + 1], $items[$idx]] = [$items[$idx], $items[$idx + 1]];
    $idx++;
}

$faq[$key]['items'] = $items;
persist_faq($faq);
redirect_with_message('faq.php#faq-' . urlencode($key) . '-' . $idx, 'success', $message);
