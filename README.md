# TheMajord'Home — Website

Site institucional da TheMajord'Home (gestão de alojamento local e concierge no Porto).

## Estrutura do projeto

```
majordhome-project/
├── index.html              → Homepage (hero, coleção, serviços, footer)
├── property.html           → Template de página de apartamento (reutilizável)
├── css/
│   └── style.css           → Toda a folha de estilo do site (partilhada)
├── js/
│   ├── properties-data.js  → Fonte única de dados de todos os apartamentos
│   ├── main.js              → Interações da homepage (slideshow, menu, etc.)
│   └── property.js          → Interações da página de apartamento (galeria, lightbox, etc.)
└── img/
    └── fabrica-no-jardim/  → Fotos reais do apartamento Fábrica no Jardim
```

## Como adicionar um novo apartamento

Só é preciso editar **um ficheiro**: `js/properties-data.js`.

Copia um bloco existente dentro do objeto `PROPERTIES` e ajusta os campos:

```js
"nome-do-apartamento": {
  name: "Nome do Apartamento",
  subtitle: "Uma frase curta e editorial",
  district: "Bairro",
  city: "Porto",
  country: "Portugal",
  guests: 4,
  bedrooms: 2,
  beds: 3,
  bathrooms: 1,
  size_m2: 80,
  rating: 4.9,        // ou null se não houver
  reviews: 120,        // ou null
  priceFrom: 150,       // ou remove a linha se não houver preço
  featured: true,       // true = aparece na grelha "A coleção" com foto grande
  heroImage: "img/.../foto-principal.jpg",
  images: ["img/.../1.jpg", "img/.../2.jpg", "..."],
  description: "Texto editorial sobre o apartamento.",
  neighborhood: "Frase sobre a zona.",
  nearby: [{ label: "Ponto de interesse", distance: "5 min a pé" }],
  amenities: {
    "Essentials": ["Wi-Fi", "Ar condicionado"],
    "Kitchen": ["Frigorífico", "Fogão"]
  }
}
```

A chave do objeto (`"nome-do-apartamento"`) torna-se o URL da página:
`property.html?p=nome-do-apartamento`

Depois liga a esse apartamento a partir de qualquer sítio com:
```html
<a href="property.html?p=nome-do-apartamento">Ver apartamento</a>
```

- `featured: true` → aparece com foto grande na grelha "A coleção" no topo da homepage.
- `featured: false` (ou omitido) → aparece na lista "A coleção completa", agrupado por bairro.
- Sem `images` → a galeria mostra um fundo tonal elegante em vez de fotos partidas.

**Nota:** desde que existe o painel de administração (ver secção seguinte), a forma normal de editar um apartamento passou a ser o painel, não este ficheiro à mão. Editar `properties-data.js` diretamente continua a funcionar (o painel lê sempre o ficheiro mais recente), mas qualquer alteração feita pelo painel reescreve este ficheiro automaticamente — por isso evita editar os dois ao mesmo tempo.

## Painel de administração (para a equipa editar o site)

A pasta `admin/` é um painel de gestão protegido por password onde a equipa pode editar, sem mexer em código: descrições (PT/EN/FR), comodidades, fotos e as regras da casa (check-in/check-out, alarmes). Fica acessível em `/admin/` depois do site estar publicado num servidor com PHP.

Ver `admin/LEIA-ME.txt` para as instruções completas de publicação, permissões de ficheiros, e as credenciais da primeira conta.

**Importante**: o painel precisa de um servidor com PHP (ver secção "Publicar o site" abaixo) — não funciona em hospedagem só de ficheiros estáticos como o GitHub Pages.

## Publicar o site

O site em si (páginas públicas) é HTML/CSS/JS puro e funciona em qualquer hospedagem, incluindo hospedagem estática (GitHub Pages, Netlify, etc.). **Mas o painel de administração (`admin/`) precisa de um servidor com PHP** — o mesmo tipo de hospedagem onde já está o site atual (themajordhome.com), como cPanel, cPanel com PHP, ou qualquer hosting LAMP/PHP tradicional.

Para publicar com o painel a funcionar:
1. Copia todos os ficheiros desta pasta (mantendo a estrutura) para o servidor, incluindo `admin/`, `data/` e `js/`.
2. Confirma que o PHP no servidor consegue **escrever** nas pastas `data/`, `data/backups/`, `img/` e no ficheiro `admin/users.json` (normalmente basta que o utilizador do PHP tenha permissão de escrita na pasta — pergunta ao teu alojamento se tiveres dúvidas sobre isto).
3. Acede a `https://oteudominio.pt/admin/` e entra com as credenciais em `admin/LEIA-ME.txt`.

Se só quiseres publicar as páginas públicas sem o painel (ex: numa hospedagem só estática), basta não copiar a pasta `admin/` — o resto do site funciona à mesma, só que a edição volta a ser manual em `properties-data.js`.

## Notas técnicas

- **Sem build step.** É HTML/CSS/JS puro — basta abrir `index.html` num browser ou publicar os ficheiros tal como estão.
- **Imagens do Airbnb**: os apartamentos Sweety Porto, Casa B e So Trendy Porto usam fotos alojadas no CDN do Airbnb (`a0.muscache.com`). Se deixarem de aparecer no futuro, o mais seguro é descarregar essas fotos e colocá-las na pasta `img/`, tal como já foi feito para o Fábrica no Jardim.
- **Beds24**: o botão "Verificar disponibilidade" está preparado (mas ainda não ligado) para a próxima fase de integração com o Beds24.
- **Fonte**: Fraunces (serif editorial, Google Fonts) + Inter (texto) + IBM Plex Mono (detalhes/preços).
