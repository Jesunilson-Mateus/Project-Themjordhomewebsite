/* =========================================================================
   THEMAJORD'HOME — mapa da coleção (apartments.html)
   Usa Leaflet + OpenStreetMap (gratuito, sem chave de API). Cada apartamento
   não tem morada exata nos dados (só o bairro), por isso o marcador fica no
   centro aproximado do bairro, com um pequeno desvio determinístico (baseado
   no slug) para os marcadores do mesmo bairro não ficarem todos empilhados
   no mesmo ponto. Isto também evita expor a morada exata de cada apartamento
   publicamente antes da reserva.
   ========================================================================= */

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Centro aproximado de cada bairro coberto pela coleção (Porto). */
var DISTRICT_CENTERS = {
  'Baixa': { lat: 41.1459, lng: -8.6110 },
  'Baixa · Trindade': { lat: 41.1502, lng: -8.6083 },
  'Bonfim': { lat: 41.1495, lng: -8.5940 },
  'Cedofeita': { lat: 41.1540, lng: -8.6215 },
  'Ribeira': { lat: 41.1407, lng: -8.6118 },
  'Fontaínhas': { lat: 41.1428, lng: -8.6060 },
  'Foz Velha': { lat: 41.1470, lng: -8.6760 },
  'Boavista': { lat: 41.1590, lng: -8.6300 }
};
var PORTO_FALLBACK = { lat: 41.1496, lng: -8.6110 };

/* Desvio pequeno e determinístico (~até 300m) a partir do slug, para
   espalhar visualmente os marcadores do mesmo bairro. */
function jitterFromSlug(slug) {
  var hash = 0;
  for (var i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  var a = (hash % 1000) / 1000;
  var b = ((hash >>> 10) % 1000) / 1000;
  return {
    lat: (a - 0.5) * 0.006,
    lng: (b - 0.5) * 0.006
  };
}

function pinDivIcon() {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 30 40">'
    + '<path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.716 23.284 0 15 0z" fill="#1B3E4C"/>'
    + '<circle cx="15" cy="15" r="6" fill="#F4EFE4"/>'
    + '</svg>';
  return L.divIcon({
    html: svg,
    className: 'apt-map-pin',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34]
  });
}

function buildPopupContent(p, slug) {
  var photo = p.heroImage
    ? '<img src="' + escapeHtml(p.heroImage) + '" alt="" style="width:100%;height:96px;object-fit:cover;border-radius:8px;margin-bottom:8px;">'
    : '';
  return '<div style="font-family:Inter,sans-serif;min-width:160px;">'
    + photo
    + '<div style="font-family:Lora,serif;font-size:15px;margin-bottom:4px;">' + escapeHtml(p.name) + '</div>'
    + '<div style="font-size:12px;opacity:.65;margin-bottom:8px;">' + escapeHtml(p.district) + '</div>'
    + '<a href="property.html?p=' + encodeURIComponent(slug) + '" style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#1B3E4C;">Ver apartamento →</a>'
    + '</div>';
}

function initMap() {
  var container = document.getElementById('apartmentsMap');
  if (!container || typeof PROPERTIES === 'undefined' || typeof L === 'undefined') return;

  var map = L.map(container, { scrollWheelZoom: false }).setView([PORTO_FALLBACK.lat, PORTO_FALLBACK.lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  var icon = pinDivIcon();
  var bounds = [];

  Object.keys(PROPERTIES).forEach(function (slug) {
    var p = PROPERTIES[slug];
    var center = DISTRICT_CENTERS[p.district] || PORTO_FALLBACK;
    var jitter = jitterFromSlug(slug);
    var lat = center.lat + jitter.lat;
    var lng = center.lng + jitter.lng;

    L.marker([lat, lng], { icon: icon, title: p.name })
      .addTo(map)
      .bindPopup(buildPopupContent(p, slug));

    bounds.push([lat, lng]);
  });

  if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] });
}

function showMapFallback() {
  var container = document.getElementById('apartmentsMap');
  if (!container || container.children.length) return;
  container.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-family:Inter,sans-serif;font-size:13px;opacity:.6;">Mapa indisponível de momento.</div>';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
setTimeout(function () {
  if (typeof L === 'undefined') showMapFallback();
}, 6000);
