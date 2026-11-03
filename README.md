# TheMajord'Home — Website

Site institucional da TheMajord'Home (gestão de alojamento local e concierge no Porto).

## Estrutura do projeto

```
majordhome-project/
├── index.html              → Homepage (hero, coleção, serviços, footer)
├── property.html           → Template de página de apartamento (reutilizável)
├── css/
│   └── style.css           → Toda a folha de estilo do site (partilhada)
├── data/
│   ├── properties.json     → Fonte de verdade: dados de todos os apartamentos
│   ├── faq.json            → Fonte de verdade: perguntas frequentes (faq.html), PT/EN/FR
│   └── translations.json   → Fonte de verdade: textos PT/FR de cada apartamento (+ amenity-*.json, nearby-labels.json)
├── scripts/
│   └── sync-data.js        → Recria as cópias dos dados nos .js a partir dos JSON
├── js/
│   ├── properties-data.js  → Cópia gerada de data/properties.json (não editar à mão)
│   ├── i18n.js              → Textos da interface + cópia gerada das traduções
│   ├── faq-data.js          → Cópia gerada de data/faq.json (não editar à mão)
│   ├── main.js              → Interações da homepage (slideshow, menu, etc.)
│   └── property.js          → Interações da página de apartamento (galeria, lightbox, etc.)
└── img/
    └── fabrica-no-jardim/  → Fotos reais do apartamento Fábrica no Jardim
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

## Guia para o engenheiro

Tudo o que é preciso para publicar e ligar as integrações (Beds24, Stripe, Google Ads) está em
[`docs/GUIA-TECNICO-LANCAMENTO-PT.pdf`](docs/GUIA-TECNICO-LANCAMENTO-PT.pdf) (versão francesa:
[`docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf`](docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf)).

## Publicar, atualizar e cópias de segurança

O site precisa de um alojamento com **PHP 8.1+** e Apache (como o do site atual, themajordhome.com):
o painel de administração, a API de reservas, a página 404 e o modo manutenção dependem disso.
Um alojamento só de ficheiros estáticos não serve.

Tudo está em [`DEPLOY.md`](DEPLOY.md): publicar pela primeira vez, **como atualizar sem perder o que
a equipa editou no painel**, e **onde estão as cópias de segurança** — as automáticas do painel ficam
no servidor em `data/backups/AAAA-MM-DD_HHMMSS/` (as últimas 60 gravações).

## Notas técnicas

- **Sem build step.** É HTML/CSS/JS puro — basta abrir `index.html` num browser ou publicar os ficheiros tal como estão.
- **Imagens do Airbnb**: os apartamentos Sweety Porto, Casa B e So Trendy Porto usam fotos alojadas no CDN do Airbnb (`a0.muscache.com`). Se deixarem de aparecer no futuro, o mais seguro é descarregar essas fotos e colocá-las na pasta `img/`, tal como já foi feito para o Fábrica no Jardim.
- **Beds24 + Stripe**: disponibilidade, preços, reservas e pagamento estão preparados (pasta `api/` + `js/booking-api.js`), mas em modo `mock` até alguém ligar as contas. Guia completo em [`docs/INTEGRACAO-BEDS24-STRIPE.md`](docs/INTEGRACAO-BEDS24-STRIPE.md).
- **Fonte**: Fraunces (serif editorial, Google Fonts) + Inter (texto) + IBM Plex Mono (detalhes/preços).
