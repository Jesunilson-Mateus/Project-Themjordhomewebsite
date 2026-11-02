/* =========================================================================
   THEMAJORD'HOME — Configuração das reservas (Beds24 + Stripe)

   mode: 'mock' → o site funciona sem servidor (disponibilidade de exemplo,
                  sem preços, sem pagamento). É o modo atual.
         'live' → o site chama a API em apiBase (pasta api/, PHP), que fala
                  com o Beds24 e o Stripe. Mudar para 'live' só depois de
                  api/config.php estar preenchido no servidor.

   Ver docs/INTEGRACAO-BEDS24-STRIPE.md.
   ========================================================================= */

window.BOOKING_CONFIG = {
  mode: 'mock',
  apiBase: 'api'
};
