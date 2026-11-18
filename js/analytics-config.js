/* =========================================================================
   THEMAJORD'HOME — Google Analytics 4 e Google Ads (configuração)

   Preencher quando as contas existirem. Com os campos vazios, nada do
   Google é carregado e o site funciona igual.

     ga4Id              → Google Analytics → Administrador → Fluxos de dados
                          → Web → "ID de medição" (G-XXXXXXXXXX)
     adsId              → Google Ads → Objetivos → Conversões → etiqueta
                          do Google: "AW-XXXXXXXXX"
     adsConversionLabel → etiqueta da conversão "Reserva": a parte depois
                          da barra em send_to: 'AW-XXXXXXXXX/<etiqueta>'

   O consentimento (Consent Mode v2, ligado ao aviso de cookies) e o envio
   da conversão quando uma reserva é paga estão em js/analytics.js.
   Passo a passo: docs/GOOGLE-ADS-SEO.md.
   ========================================================================= */

window.ANALYTICS_CONFIG = {
  ga4Id: '',
  adsId: '',
  adsConversionLabel: ''
};
