# TheMajord'Home — Publicação, atualizações e cópias de segurança

Guia completo para o engenheiro:
[`docs/GUIA-TECNICO-LANCAMENTO-PT.pdf`](docs/GUIA-TECNICO-LANCAMENTO-PT.pdf) ·
[`docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf`](docs/GUIDE-TECHNIQUE-LANCEMENT-FR.pdf).
API de reservas: [`docs/INTEGRACAO-BEDS24-STRIPE.md`](docs/INTEGRACAO-BEDS24-STRIPE.md).

## Requisitos

- Alojamento com **PHP 8.1+** (extensões gd, curl, mbstring) e **HTTPS**. O painel (`admin/`) e a API
  de reservas (`api/`) precisam de PHP — um alojamento só de ficheiros estáticos não serve.
- **Apache** com mod_rewrite e mod_headers (as regras estão nos `.htaccess`). Em nginx, as regras
  têm de ser recriadas (ver o guia técnico).
- O site fica na **raiz do domínio** (ex.: `https://www.themajordhome.com/`).

## Publicar pela primeira vez

1. Apontar o domínio para o alojamento e ativar HTTPS.
2. Copiar o conteúdo do repositório para a raiz do site.
3. Criar no servidor, fora do git:
   - `api/config.php` (a partir de `api/config.example.php`);
   - a conta do painel (instruções em `admin/LEIA-ME.txt`, entregue à parte).
4. Dar ao PHP permissão de escrita em `data/`, `img/`, `admin/users.json`, `js/properties-data.js`,
   `js/i18n.js`, `js/reviews-data.js`, `js/faq-data.js` e nas 4 páginas `servico-*.html`.
5. Ligar Beds24 e Stripe em modo de teste, testar uma reserva completa e só depois passar a `live`.

## Páginas de erro e manutenção

O `.htaccess` da raiz:

- mostra `404.html` para endereços que não existem;
- quando o **modo manutenção** está ligado no painel (`/admin/` → Manutenção), responde a todo o site
  público com `manutencao.html` (código 503). O painel e o webhook do Stripe continuam a funcionar;
- bloqueia `.git/`, outros ficheiros escondidos e `_arquivo/`.

## Atualizar o site

> **Importante:** depois de o site estar no ar, **os dados verdadeiros são os do servidor** — a
> equipa edita-os no painel. Numa atualização, estes ficheiros **não podem ser substituídos** pelas
> versões do repositório, ou perdem-se as alterações feitas no painel:
>
> `data/` · `img/` · `admin/users.json` · `api/config.php` · `js/properties-data.js` · `js/i18n.js` ·
> `js/reviews-data.js` · `js/faq-data.js` · `servico-*.html`
>
> Se uma atualização precisar de mexer num deles (p. ex. textos da interface em `js/i18n.js`), trazer
> primeiro a versão do servidor para o repositório, fazer a alteração sobre ela e só depois publicar.

1. No painel, **ligar o modo manutenção**.
2. **Fazer uma cópia** do servidor (descarregar por SFTP ou pelo painel do alojamento): `data/`
   (inclui `data/backups/` e `data/reservations/`), `img/`, `admin/users.json`, `api/config.php`.
3. Publicar os ficheiros novos do código, sem substituir os da lista acima.
4. Testar: páginas, línguas, painel, pesquisa e, com as reservas ligadas, uma reserva de teste.
5. No painel, **desligar o modo manutenção**.

## Onde estão as cópias de segurança

| O quê | Onde | O que contém | Como recuperar |
|---|---|---|---|
| **Cópias automáticas do painel** | No servidor, `data/backups/AAAA-MM-DD_HHMMSS/` — uma pasta por gravação no painel, as **últimas 60** | Todos os `data/*.json` (apartamentos, traduções, comodidades, galerias dos serviços, perguntas frequentes, avaliações, mapa Beds24) e `users.json` (contas do painel), tal como estavam **antes** dessa gravação | Copiar os ficheiros da pasta escolhida para `data/` (e `users.json` para `admin/`); depois correr `node scripts/sync-data.js` para regenerar os `.js` e as galerias. Sem Node no servidor: correr o script numa cópia local e enviar os ficheiros gerados |
| **Código** | GitHub — histórico do git | Todas as versões que foram para o repositório | `git log` para encontrar a versão; `git checkout <commit> -- <ficheiro>` |
| **Fotos** | No servidor, `img/` | As fotos. **Não há cópia automática.** Apagar uma foto no painel só a retira do site — o ficheiro fica em `img/` | Voltar a escolher a foto no painel; se o ficheiro se perdeu, usar a cópia do passo 2 ou a do alojamento |
| **Reservas** | O **Beds24** (fonte de verdade); `data/reservations/` no servidor guarda o estado de cada pagamento | Reservas, estados e ligação ao Stripe | Consultar no Beds24 e no Stripe |
| **Configuração e contas** | `api/config.php` e `admin/users.json`, no servidor (nunca no git) | Chaves do Beds24/Stripe; contas do painel (também em cada cópia automática) | Guardar uma cópia fora do servidor, em local seguro |
| **Cópias do alojamento** | Painel do alojamento (p. ex. cPanel → Backups) | Depende do alojamento | Recomendado: cópias diárias de todo o site |
| **Arquivo local** | `_arquivo/`, só no computador de desenvolvimento | Ficheiros sem uso no site — ver `_arquivo/LEIA-ME.md` | — |

Pré-visualização local: `php -S 127.0.0.1:8080 -t .` na raiz do projeto.
