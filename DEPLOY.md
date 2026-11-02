# TheMajord'Home — Publicação

> **Este ficheiro substitui o antigo guia de publicação no Netlify, que já não se aplica.**
> O site precisa de um alojamento com **PHP 8.1+** (painel de administração e API de reservas),
> por isso o `netlify.toml` e a pasta `dist/` deixaram de ser usados.

O guia completo para o engenheiro está em:

- [`docs/GUIA-TECNICO-LANCAMENTO-PT.pdf`](docs/GUIA-TECNICO-LANCAMENTO-PT.pdf) — português
- [`docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf`](docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf) — français

Cobre: estrutura do projeto, painel de administração, reservas Beds24 + Stripe, publicação
na web, SEO, Google Ads (Consent Mode v2 e conversões), pendentes (incluindo textos legais) e
uma checklist de lançamento.

Detalhe técnico da API de reservas: [`docs/INTEGRACAO-BEDS24-STRIPE.md`](docs/INTEGRACAO-BEDS24-STRIPE.md).

## Resumo rápido

1. Alojamento com PHP 8.1+ (gd, curl, mbstring) e HTTPS.
2. Publicar o conteúdo do repositório (sem `dist/` nem `.claude/`).
3. Criar no servidor `api/config.php` (a partir de `api/config.example.php`) e a conta do painel
   (instruções em `admin/LEIA-ME.txt`, entregue à parte — não está no git).
4. Dar ao PHP permissão de escrita em `data/`, `img/`, `admin/users.json`, nos `.js` gerados e nas
   páginas `servico-*.html`.
5. Ligar Beds24 e Stripe em modo de teste, testar uma reserva completa, e só depois passar a `live`.

Pré-visualização local: `php -S 127.0.0.1:8080 -t .` na raiz do projeto.
