#!/usr/bin/env node
/* =========================================================================
   THEMAJORD'HOME — Sincronizar dados JSON → JS

   Os ficheiros em data/*.json são a fonte de verdade. O site lê cópias
   desses dados embutidas em js/properties-data.js, js/i18n.js e
   js/faq-data.js, e as
   galerias "Em imagens" das páginas servico-*.html. Este script recria
   essas cópias a partir do JSON, da mesma forma que o painel admin
   (admin/lib.php), mantendo o resto dos ficheiros intacto.

   Uso (na raiz do projeto):
     node scripts/sync-data.js           → atualiza os .js
     node scripts/sync-data.js --check   → só verifica; sai com erro se
                                           algum .js estiver desatualizado
     node scripts/sync-data.js --force   → atualiza mesmo que isso apague
                                           entradas que só existem nos .js
   ========================================================================= */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// JSON de origem → ficheiro .js e declaração do objeto a substituir
const TARGETS = [
  { json: 'data/properties.json',         js: 'js/properties-data.js', needle: 'const PROPERTIES = {' },
  { json: 'data/translations.json',       js: 'js/i18n.js',            needle: 'var PROPERTY_TRANSLATIONS = {' },
  { json: 'data/amenity-items.json',      js: 'js/i18n.js',            needle: 'var AMENITY_ITEMS = {' },
  { json: 'data/amenity-categories.json', js: 'js/i18n.js',            needle: 'var AMENITY_CATEGORIES = {' },
  { json: 'data/nearby-labels.json',      js: 'js/i18n.js',            needle: 'var NEARBY_LABELS = {' },
  { json: 'data/faq.json',                js: 'js/faq-data.js',        needle: 'var FAQ = {' },
];

/* Encontra a chaveta que fecha a que abre em `openPos`, ignorando chavetas
   dentro de strings (ex.: uma descrição com "{"). */
function findMatchingBrace(src, openPos) {
  let depth = 0;
  let quote = null;
  for (let i = openPos; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  return -1;
}

/* Localiza o objeto literal declarado em `needle` → [início, fim]. */
function locateObject(src, needle, file) {
  const pos = src.indexOf(needle);
  if (pos === -1) throw new Error(`Não encontrei "${needle}" em ${file}`);
  const open = src.indexOf('{', pos);
  const close = findMatchingBrace(src, open);
  if (close === -1) throw new Error(`Chavetas desequilibradas em ${file}`);
  return [open, close];
}

/* Substitui o objeto literal pelo JSON formatado (4 espaços, como o
   JSON_PRETTY_PRINT do PHP), com as mesmas quebras de linha do ficheiro. */
function spliceObject(src, needle, data, file) {
  const [open, close] = locateObject(src, needle, file);
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const json = JSON.stringify(data, null, 4).replace(/\n/g, eol);
  return src.slice(0, open) + json + src.slice(close + 1);
}

/* Chaves de topo que existem no .js mas não no JSON — seriam apagadas pela
   sincronização (sinal de que alguém editou o .js à mão). */
function keysOnlyInJs(src, needle, data, file) {
  const [open, close] = locateObject(src, needle, file);
  const current = Function('"use strict"; return (' + src.slice(open, close + 1) + ');')();
  return Object.keys(current).filter(k => !(k in data));
}

/* Galerias das páginas de serviços: data/service-galleries.json → secção
   "Em imagens" de cada servico-*.html. Mesmo HTML que o painel gera
   (admin/lib.php → service_gallery_html / regenerate_service_page). */
const GALLERIES_JSON = 'data/service-galleries.json';
const GALLERY_OPEN = '<div class="service-gallery reveal">';

function escapeHtml(s) {   // = htmlspecialchars(…, ENT_QUOTES) do PHP
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function spliceGallery(src, photos, file) {
  let start = src.indexOf(GALLERY_OPEN);
  if (start === -1) throw new Error(`Não encontrei a galeria em ${file}`);
  start += GALLERY_OPEN.length;
  const end = src.indexOf('</div>', start);
  if (end === -1) throw new Error(`Galeria sem fecho em ${file}`);
  const indent = src.slice(src.lastIndexOf('\n', end) + 1, end);
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const lines = photos.map(p =>
    `      <figure><img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${escapeHtml(p.caption)}</figcaption></figure>`);
  const body = lines.length ? eol + lines.join(eol) : '';
  return src.slice(0, start) + body + eol + indent + src.slice(end);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  } catch (e) {
    throw new Error(`JSON inválido em ${file}: ${e.message}`);
  }
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const force = process.argv.includes('--force');
  const sources = {};   // ficheiro .js → conteúdo (vários objetos no mesmo ficheiro)
  const original = {};
  const lost = [];

  for (const t of TARGETS) {
    if (!(t.js in sources)) {
      sources[t.js] = original[t.js] = fs.readFileSync(path.join(ROOT, t.js), 'utf8');
    }
    const data = readJson(t.json);
    for (const k of keysOnlyInJs(sources[t.js], t.needle, data, t.js)) lost.push(`${t.json}: "${k}"`);
    sources[t.js] = spliceObject(sources[t.js], t.needle, data, t.js);
  }

  for (const svc of Object.values(readJson(GALLERIES_JSON))) {
    const page = path.basename(svc.page);
    sources[page] = original[page] = fs.readFileSync(path.join(ROOT, page), 'utf8');
    sources[page] = spliceGallery(sources[page], svc.photos || [], page);
  }

  if (lost.length) {
    console.error('Estas entradas existem nos .js mas não nos JSON:');
    for (const l of lost) console.error('  - ' + l);
    if (checkOnly || !force) {
      console.error('Acrescenta-as ao JSON, ou corre com --force para as apagar dos .js.');
      process.exit(1);
    }
  }

  const stale = Object.keys(sources).filter(f => sources[f] !== original[f]);

  if (checkOnly) {
    if (stale.length) {
      console.error('Desatualizado: ' + stale.join(', '));
      console.error('Corre: node scripts/sync-data.js');
      process.exit(1);
    }
    console.log('OK — os .js e as galerias dos serviços estão iguais aos JSON.');
    return;
  }

  for (const f of stale) fs.writeFileSync(path.join(ROOT, f), sources[f]);
  console.log(stale.length ? 'Atualizado: ' + stale.join(', ') : 'Nada a mudar — já estava tudo sincronizado.');
}

try {
  main();
} catch (e) {
  console.error('Erro: ' + e.message);
  process.exit(1);
}
