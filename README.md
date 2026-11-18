# TheMajord'Home — Website

Site institucional da TheMajord'Home (gestão de alojamento local e concierge no Porto).

## Estrutura do projeto

```
Project-Themjordhomewebsite/
├── index.html, apartments.html, property.html     → Página inicial, coleção completa, página de cada apartamento
├── proprietarios.html, servico-*.html              → Área de proprietários e as 4 páginas de serviços
├── faq.html, condicoes-gerais.html, politica-privacidade.html, legal-notice.html
├── search-results.html, reserva.html               → Resultados da pesquisa e regresso do pagamento
├── 404.html, manutencao.html                       → Página não encontrada e modo manutenção
├── review.php                                      → Formulário de avaliação (link enviado ao hóspede)
├── sitemap.php, robots.txt, favicon.svg, .htaccess → Google, ícone e regras do servidor (Apache)
├── css/style.css                                   → Folha de estilo de todo o site
├── js/
│   ├── properties-data.js, faq-data.js, reviews-data.js → Cópias geradas dos dados (não editar à mão)
│   ├── i18n.js                  → Textos da interface (PT/EN/FR) + cópia gerada das traduções
│   ├── main.js, property.js     → Página inicial / coleção e página de apartamento
│   ├── booking-*.js, search-results.js → Calendário, reserva, pesquisa (falam com a API via booking-api.js)
│   ├── cookie-consent.js        → Aviso de cookies
│   └── analytics*.js            → Google Analytics 4 / Google Ads (IDs vazios até serem preenchidos)
├── data/                        → Fonte de verdade: apartamentos, traduções, comodidades, FAQ,
│                                  galerias dos serviços, avaliações, mapa Beds24
├── admin/                       → Painel de administração (PHP)
├── api/                         → API de reservas (PHP): Beds24 + Stripe
├── scripts/sync-data.js         → Recria as cópias dos dados nos .js a partir dos JSON
├── img/                         → Fotos (uma pasta por apartamento + servicos/)
└── docs/                        → Guias para quem vai lançar o site
```

## Como adicionar um novo apartamento

Os dados vivem em **`data/properties.json`** (e os textos em PT/FR em `data/translations.json`). Os ficheiros `js/properties-data.js` e `js/i18n.js` têm uma cópia desses dados que é gerada — não se editam à mão.

1. Copia um bloco existente em `data/properties.json` e ajusta os campos:

```json
"nome-do-apartamento": {
    "name": "Nome do Apartamento",
    "subtitle": "Uma frase curta e editorial",
    "district": "Bairro",
    "city": "Porto",
    "country": "Portugal",
    "guests": 4,
    "bedrooms": 2,
    "beds": 3,
    "bathrooms": 1,
    "size_m2": 80,
    "rating": 4.9,
    "reviews": 120,
    "featured": true,
    "heroImage": "img/.../foto-principal.jpg",
    "images": ["img/.../1.jpg", "img/.../2.jpg"],
    "description": "Texto editorial sobre o apartamento.",
    "neighborhood": "Frase sobre a zona.",
    "nearby": [{ "label": "Ponto de interesse", "distance": "5 min walk" }],
    "amenities": {
        "Essentials": ["Wi-Fi", "Air conditioning"],
        "Kitchen": ["Refrigerator", "Stovetop"]
    }
}
```

(`rating` e `reviews` podem ser `null` se não houver.)

2. Acrescenta as versões PT/FR do `subtitle`, `description` e `neighborhood` em `data/translations.json`, com a mesma chave.

3. Atualiza as cópias nos `.js`:

```
node scripts/sync-data.js
```

Para só verificar se está tudo sincronizado, sem alterar nada: `node scripts/sync-data.js --check`. O script recusa-se a correr se houver entradas nos `.js` que faltam nos JSON (para não apagar nada sem querer).

A chave do objeto (`"nome-do-apartamento"`) torna-se o URL da página:
`property.html?p=nome-do-apartamento`

Depois liga a esse apartamento a partir de qualquer sítio com:
```html
<a href="property.html?p=nome-do-apartamento">Ver apartamento</a>
```

- `featured: true` → aparece com foto grande na grelha "A coleção" no topo da homepage.
- `featured: false` (ou omitido) → aparece na lista "A coleção completa", agrupado por bairro.
- Sem `images` → a galeria mostra um fundo tonal elegante em vez de fotos partidas.

**Nota:** no servidor, a forma normal de editar um apartamento é o painel de administração (ver secção seguinte). O painel grava nos JSON e regenera os `.js` sozinho, exatamente como o `scripts/sync-data.js`. Qualquer alteração feita diretamente nos `.js` perde-se na próxima gravação do painel.

## Painel de administração (para a equipa editar o site)

A pasta `admin/` é um painel de gestão protegido por password onde a equipa pode editar, sem mexer em código: descrições (PT/EN/FR), comodidades, fotos e as regras da casa (check-in/check-out, alarmes) de cada apartamento, se cada apartamento está **ativo** (visível e reservável no site) ou **inativo** (escondido, com os dados guardados), o **modo manutenção** (o site público passa a mostrar `manutencao.html`), as fotos e legendas das galerias "Em imagens" das páginas de serviços (separador **Serviços**; dados em `data/service-galleries.json`), e as **perguntas frequentes** da página `faq.html` em PT/EN/FR (separador **FAQ**; dados em `data/faq.json` — as perguntas marcadas "a confirmar" não aparecem no site). Fica acessível em `/admin/` depois do site estar publicado num servidor com PHP.

Ver `admin/LEIA-ME.txt` para as instruções completas de publicação, permissões de ficheiros, e as credenciais da primeira conta.

**Importante**: o painel precisa de um servidor com PHP (ver secção "Publicar o site" abaixo) — não funciona em hospedagem só de ficheiros estáticos como o GitHub Pages.

## Guia para quem vai lançar o site

Ordem de leitura:

1. [`docs/GUIA-TECNICO-LANCAMENTO-PT.pdf`](docs/GUIA-TECNICO-LANCAMENTO-PT.pdf) (versão francesa:
   [`docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf`](docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf)) — visão geral, o que está
   feito, o que falta e checklist de lançamento.
2. [`DEPLOY.md`](DEPLOY.md) — publicar o site, atualizar e cópias de segurança.
3. [`docs/INTEGRACAO-BEDS24-STRIPE.md`](docs/INTEGRACAO-BEDS24-STRIPE.md) — ligar o Beds24 (disponibilidade,
   preços, reservas) e o Stripe (pagamento).
4. [`docs/GOOGLE-ADS-SEO.md`](docs/GOOGLE-ADS-SEO.md) — Google Analytics 4, Google Ads (consentimento e
   conversão de reserva) e publicação no Google (Search Console, sitemap, endereços do site antigo).

As credenciais (conta do painel, chaves) nunca estão no repositório: são entregues à parte.

## Publicar, atualizar e cópias de segurança

O site precisa de um alojamento com **PHP 8.1+** e Apache (como o do site atual, themajordhome.com):
o painel de administração, a API de reservas, a página 404 e o modo manutenção dependem disso.
Um alojamento só de ficheiros estáticos não serve.

Tudo está em [`DEPLOY.md`](DEPLOY.md): publicar pela primeira vez, **como atualizar sem perder o que
a equipa editou no painel**, e **onde estão as cópias de segurança** — as automáticas do painel ficam
no servidor em `data/backups/AAAA-MM-DD_HHMMSS/` (as últimas 60 gravações).

## Notas técnicas

- **Sem build step.** O site é HTML/CSS/JS puro; o painel, a API de reservas e o sitemap precisam de PHP. Para ver localmente: `php -S 127.0.0.1:8080 -t .` na raiz do projeto.
- **Imagens do Airbnb**: os apartamentos Sweety Porto, Casa B e So Trendy Porto usam fotos alojadas no CDN do Airbnb (`a0.muscache.com`). Se deixarem de aparecer no futuro, o mais seguro é descarregar essas fotos e colocá-las na pasta `img/`, tal como já foi feito para o Fábrica no Jardim.
- **Beds24 + Stripe**: disponibilidade, preços, reservas e pagamento estão preparados (pasta `api/` + `js/booking-api.js`), mas em modo `mock` até alguém ligar as contas. Guia completo em [`docs/INTEGRACAO-BEDS24-STRIPE.md`](docs/INTEGRACAO-BEDS24-STRIPE.md).
- **Fontes**: Lora (títulos), Inter (texto) e IBM Plex Mono (detalhes), via Google Fonts.
