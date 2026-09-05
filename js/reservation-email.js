/* =========================================================================
   THEMAJORD'HOME — Reservation Email System
   Handles sending confirmation emails and review invitation links
   ========================================================================= */

class ReservationEmail {
  static generateReviewToken() {
    // Generate a secure token for the review link
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static getReviewLink(propertySlug, email, checkIn, checkOut, token) {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      property: propertySlug,
      email: email,
      checkIn: checkIn,
      checkOut: checkOut,
      token: token
    });
    return `${baseUrl}/leave-review.html?${params.toString()}`;
  }

  static async sendReservationConfirmation(reservationData) {
    const {
      propertyName,
      propertySlug,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      guestPhone,
      totalGuests,
      services,
      totalPrice
    } = reservationData;

    const reviewToken = this.generateReviewToken();
    const reviewLink = this.getReviewLink(propertySlug, guestEmail, checkIn, checkOut, reviewToken);

    const emailContent = this.generateEmailContent({
      propertyName,
      checkIn,
      checkOut,
      guestName,
      totalGuests,
      services,
      totalPrice,
      reviewLink
    });

    try {
      // TODO: Replace with actual email sending backend
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: guestEmail,
      //     subject: emailContent.subject,
      //     html: emailContent.html,
      //     cc: 'resa@themajordhome.com'
      //   })
      // });

      // Mock email sending
      console.log('Reservation confirmation email would be sent to:', guestEmail);
      console.log('Review link:', reviewLink);

      // Save to localStorage as backup
      const reservations = JSON.parse(localStorage.getItem('sentEmails') || '[]');
      reservations.push({
        to: guestEmail,
        propertySlug,
        checkIn,
        checkOut,
        reviewToken,
        sentAt: new Date().toISOString()
      });
      localStorage.setItem('sentEmails', JSON.stringify(reservations));

      return { success: true, reviewLink };
    } catch (error) {
      console.error('Error sending reservation email:', error);
      return { success: false, error: error.message };
    }
  }

  static generateEmailContent(data) {
    const { propertyName, checkIn, checkOut, guestName, totalGuests, services, totalPrice, reviewLink } = data;

    const subject = `Confirmação de Reserva — ${propertyName}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1B3E4C 0%, #4F8864 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .section { margin: 20px 0; padding: 15px; background: white; border-radius: 6px; }
          .label { font-weight: bold; color: #1B3E4C; }
          .button { display: inline-block; background: #4F8864; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #ddd; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">TheMajord'Home</h1>
            <p style="margin: 5px 0 0 0;">Confirmação de Reserva</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Olá <span class="label">${guestName}</span>,</p>
              <p>Agradecemos a sua reserva! Aqui estão os detalhes da sua estadia:</p>
            </div>

            <div class="section">
              <div><span class="label">Propriedade:</span> ${propertyName}</div>
              <div><span class="label">Check-in:</span> ${checkIn}</div>
              <div><span class="label">Check-out:</span> ${checkOut}</div>
              <div><span class="label">Hóspedes:</span> ${totalGuests}</div>
            </div>

            ${services && services.length > 0 ? `
            <div class="section">
              <div style="font-weight: bold; margin-bottom: 10px;">Serviços Adicionais:</div>
              ${services.map(s => `<div>• ${s.name}: €${s.price}</div>`).join('')}
            </div>
            ` : ''}

            <div class="section">
              <div style="font-size: 18px; font-weight: bold; color: #4F8864;">
                Total: €${totalPrice}
              </div>
              <p style="margin-top: 10px; color: #999; font-size: 12px;">
                Pagamento devido no check-in. Aceitamos dinheiro, cartão de crédito e transferência bancária.
              </p>
            </div>

            <div class="section">
              <p>Precisa de ajuda? Entre em contacto conosco:</p>
              <p>
                📧 resa@themajordhome.com<br>
                📞 +351 910 239 900<br>
                🕐 Disponíveis de 9h às 23h
              </p>
            </div>

            <div class="section" style="border-left: 4px solid #4F8864;">
              <div style="font-weight: bold; margin-bottom: 10px;">Como foi a sua estadia?</div>
              <p>Após o seu checkout, convida-mos a deixar uma avaliação para nos ajudar a melhorar.</p>
              <a href="${reviewLink}" class="button">Deixar Avaliação</a>
            </div>
          </div>

          <div class="footer">
            <p>© 2026 TheMajord'Home. Todos os direitos reservados.</p>
            <p>Porto, Portugal</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }
}

window.ReservationEmail = ReservationEmail;
