<?php
require_once __DIR__ . '/lib.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}

require_csrf();

$slug = trim($_POST['slug'] ?? '');
$properties = load_properties();
if ($slug === '' || !isset($properties[$slug])) {
    redirect_with_message('dashboard.php', 'error', 'Apartamento não encontrado.');
}

$action = $_POST['csrf_action'] ?? '';
$backTo = 'edit.php?slug=' . urlencode($slug);

/* =========================================================================
   1) Guardar informação geral / descrições / comodidades / regras da casa
   ========================================================================= */
if ($action === 'update_details') {
    $prop = $properties[$slug];

    $prop['name'] = trim($_POST['name'] ?? $prop['name']);
    $prop['district'] = trim($_POST['district'] ?? $prop['district']);
    foreach (['guests', 'bedrooms', 'beds', 'bathrooms'] as $numField) {
        if (isset($_POST[$numField]) && $_POST[$numField] !== '') {
            $prop[$numField] = max(0, (int) $_POST[$numField]);
        }
    }
    if (isset($_POST['size_m2']) && $_POST['size_m2'] !== '') {
        $prop['size_m2'] = max(0, (int) $_POST['size_m2']);
    } else {
        $prop['size_m2'] = null;
    }

    // Descrição base (EN)
    $prop['subtitle'] = trim($_POST['subtitle_en'] ?? $prop['subtitle'] ?? '');
    $prop['description'] = trim($_POST['description_en'] ?? $prop['description'] ?? '');
    $prop['neighborhood'] = trim($_POST['neighborhood_en'] ?? $prop['neighborhood'] ?? '');

    // Regras da casa
    $checkIn = trim($_POST['checkIn'] ?? '');
    $checkOut = trim($_POST['checkOut'] ?? '');
    if ($checkIn !== '') { $prop['checkIn'] = $checkIn; } else { unset($prop['checkIn']); }
    if ($checkOut !== '') { $prop['checkOut'] = $checkOut; } else { unset($prop['checkOut']); }

    $safety = [];
    $smoke = $_POST['safety_smoke'] ?? 'unknown';
    $co = $_POST['safety_co'] ?? 'unknown';
    if ($smoke !== 'unknown') $safety['smokeAlarm'] = ($smoke === 'yes');
    if ($co !== 'unknown') $safety['coAlarm'] = ($co === 'yes');
    if (!empty($safety)) { $prop['safety'] = $safety; } else { unset($prop['safety']); }

    // Comodidades: reconstrói a partir das checkboxes + campos "outra comodidade"
    $amenityItems = load_amenity_items();
    $amenityCategories = load_amenity_categories();
    $catalog = load_json(AMENITY_CATALOG_JSON);
    $catalogChanged = false;

    $submittedAmenities = $_POST['amenities'] ?? [];
    $newAmenities = $_POST['amenities_new'] ?? [];
    $rebuilt = [];

    // categorias já existentes na app (para não perder categorias que não vieram no POST por engano)
    $allCats = array_unique(array_merge(array_keys($amenityCategories), array_keys($submittedAmenities), array_keys($prop['amenities'] ?? [])));

    foreach ($allCats as $cat) {
        $items = [];
        if (isset($submittedAmenities[$cat]) && is_array($submittedAmenities[$cat])) {
            foreach ($submittedAmenities[$cat] as $item) {
                $item = trim((string) $item);
                if ($item !== '') $items[] = $item;
            }
        }
        $newItem = trim($newAmenities[$cat] ?? '');
        if ($newItem !== '' && !in_array($newItem, $items, true)) {
            $items[] = $newItem;
            if (!isset($catalog[$cat]) || !in_array($newItem, $catalog[$cat], true)) {
                $catalog[$cat][] = $newItem;
                $catalogChanged = true;
            }
        }
        if (!empty($items)) {
            sort($items);
            $rebuilt[$cat] = $items;
        }
    }
    $prop['amenities'] = $rebuilt;

    // Nova categoria (opcional)
    $newCatName = trim($_POST['new_category_name'] ?? '');
    $newCatItem = trim($_POST['new_category_item'] ?? '');
    if ($newCatName !== '' && $newCatItem !== '') {
        $newCatPt = trim($_POST['new_category_pt'] ?? '') ?: $newCatName;
        $newCatItemPt = trim($_POST['new_category_item_pt'] ?? '') ?: $newCatItem;

        if (!isset($amenityCategories[$newCatName])) {
            $amenityCategories[$newCatName] = ['pt' => $newCatPt, 'fr' => $newCatPt];
        }
        if (!isset($amenityItems[$newCatItem])) {
            $amenityItems[$newCatItem] = ['pt' => $newCatItemPt, 'fr' => $newCatItemPt];
        }
        $existing = $prop['amenities'][$newCatName] ?? [];
        if (!in_array($newCatItem, $existing, true)) $existing[] = $newCatItem;
        sort($existing);
        $prop['amenities'][$newCatName] = $existing;

        $catalog[$newCatName] = array_values(array_unique(array_merge($catalog[$newCatName] ?? [], [$newCatItem])));
        $catalogChanged = true;

        save_json(AMENITY_CATALOG_JSON, $catalog);
        $properties[$slug] = $prop;
        $translations = load_translations();
        apply_translation_overlay($translations, $slug, $_POST);
        persist_all($properties, $translations, $amenityItems, $amenityCategories);
        redirect_with_message($backTo, 'success', 'Alterações guardadas.');
    }

    if ($catalogChanged) {
        save_json(AMENITY_CATALOG_JSON, $catalog);
    }

    $properties[$slug] = $prop;
    $translations = load_translations();
    apply_translation_overlay($translations, $slug, $_POST);
    persist_all($properties, $translations);
    redirect_with_message($backTo, 'success', 'Alterações guardadas.');
}

/* =========================================================================
   2) Ações sobre uma foto: capa / mover / apagar
   ========================================================================= */
if ($action === 'photo_action') {
    $prop = $properties[$slug];
    $images = $prop['images'] ?? [];
    $photo = $_POST['photo'] ?? '';
    $do = $_POST['do'] ?? '';
    $idx = array_search($photo, $images, true);

    if ($idx !== false) {
        if ($do === 'set_hero') {
            $prop['heroImage'] = $photo;
        } elseif ($do === 'move_up' && $idx > 0) {
            [$images[$idx - 1], $images[$idx]] = [$images[$idx], $images[$idx - 1]];
            $prop['images'] = $images;
        } elseif ($do === 'move_down' && $idx < count($images) - 1) {
            [$images[$idx + 1], $images[$idx]] = [$images[$idx], $images[$idx + 1]];
            $prop['images'] = $images;
        } elseif ($do === 'delete_photo') {
            array_splice($images, $idx, 1);
            $prop['images'] = $images;
            if (($prop['heroImage'] ?? '') === $photo) {
                $prop['heroImage'] = $images[0] ?? '';
            }
        }
    }

    $properties[$slug] = $prop;
    $translations = load_translations();
    persist_all($properties, $translations);
    redirect_with_message($backTo, 'success', 'Fotos atualizadas.');
}

/* =========================================================================
   3) Envio de novas fotos
   ========================================================================= */
if ($action === 'upload_photo') {
    $prop = $properties[$slug];
    $images = $prop['images'] ?? [];
    $files = $_FILES['photos'] ?? null;
    $added = 0;
    $rejected = 0;

    if ($files && is_array($files['tmp_name'])) {
        foreach ($files['tmp_name'] as $i => $tmpPath) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) { $rejected++; continue; }
            if ($files['size'][$i] > MAX_UPLOAD_BYTES) { $rejected++; continue; }

            $destName = next_photo_filename($slug, $files['name'][$i]);
            $destPath = slug_img_dir($slug) . '/' . $destName;
            if (process_uploaded_image($tmpPath, $destPath)) {
                $relPath = "img/{$slug}/{$destName}";
                $images[] = $relPath;
                $added++;
            } else {
                $rejected++;
            }
        }
    }

    $prop['images'] = $images;
    if (empty($prop['heroImage']) && !empty($images)) {
        $prop['heroImage'] = $images[0];
    }
    $properties[$slug] = $prop;
    $translations = load_translations();
    persist_all($properties, $translations);

    $msg = "{$added} foto(s) adicionada(s).";
    if ($rejected > 0) $msg .= " {$rejected} ficheiro(s) não foram aceites (formato ou tamanho).";
    redirect_with_message($backTo, $rejected > 0 && $added === 0 ? 'error' : 'success', $msg);
}

redirect_with_message($backTo, 'error', 'Ação desconhecida.');

/* =========================================================================
   Aplica os campos de tradução pt/fr enviados no formulário aos dados de
   overlay (translations.json), removendo a língua se tudo ficar vazio.
   ========================================================================= */
function apply_translation_overlay(&$translations, $slug, $post) {
    $entry = $translations[$slug] ?? [];

    foreach (['pt', 'fr'] as $lang) {
        $subtitle = trim($post["subtitle_{$lang}"] ?? '');
        $description = trim($post["description_{$lang}"] ?? '');
        $neighborhood = trim($post["neighborhood_{$lang}"] ?? '');

        if ($subtitle === '' && $description === '' && $neighborhood === '') {
            unset($entry[$lang]);
            continue;
        }
        $langData = [];
        if ($subtitle !== '') $langData['subtitle'] = $subtitle;
        if ($description !== '') $langData['description'] = $description;
        if ($neighborhood !== '') $langData['neighborhood'] = $neighborhood;
        $entry[$lang] = $langData;
    }

    if (empty($entry)) {
        unset($translations[$slug]);
    } else {
        $translations[$slug] = $entry;
    }
}
