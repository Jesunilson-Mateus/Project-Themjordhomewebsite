/* =========================================================================
   THEMAJORD'HOME — Booking Calendar Manager
   Calendário de datas com a disponibilidade do Beds24 (via BookingAPI)
   ========================================================================= */

class BookingCalendar {
  constructor(inputId, propertySlug) {
    this.inputElement = document.getElementById(inputId);
    this.propertySlug = propertySlug;
    this.reservedDates = [];
    this.minCheckoutDate = null;

    if (!this.inputElement) return;

    this.loadReservations();
    this.initCalendar();
  }

  // Noites ocupadas vindas do Beds24 (via BookingAPI — ver js/booking-api.js).
  // Pede ~18 meses para a frente; os dias devolvidos não podem ser escolhidos.
  async loadReservations() {
    if (!window.BookingAPI) return;
    try {
      const today = new Date();
      const until = new Date(today.getFullYear(), today.getMonth() + 18, today.getDate());
      const data = await window.BookingAPI.getAvailability(this.propertySlug, this.formatDate(today), this.formatDate(until));
      this.reservedDates = data.unavailable || [];

      if (window.bookingCalendar) {
        window.bookingCalendar.destroy();
      }
      this.initCalendar();
    } catch (error) {
      // Sem disponibilidade o calendário fica aberto; o servidor volta a
      // confirmar as datas quando a reserva é submetida.
    }
  }

  initCalendar() {
    const today = new Date();
    const separator = window.I18N ? window.I18N.t('booking.dateSeparator') : '—';

    window.bookingCalendar = flatpickr(this.inputElement, {
      mode: 'range',
      minDate: today,
      dateFormat: 'd-m-Y',   // tokens do flatpickr → dd-mm-yyyy
      locale: 'pt',
      // Date objects (as strings "YYYY-MM-DD" seriam lidas com o dateFormat acima).
      disable: this.reservedDates.map(d => {
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day);
      }),
      onClose: (selectedDates) => {
        this.onDateSelect(selectedDates, separator);
        this.updateMinCheckoutDate(selectedDates);
      },
    });
  }

  onDateSelect(selectedDates, separator = '—') {
    if (selectedDates.length === 2) {
      const checkIn = this.formatDateDisplay(selectedDates[0]);
      const checkOut = this.formatDateDisplay(selectedDates[1]);
      this.inputElement.value = `${checkIn} ${separator} ${checkOut}`;
    }
  }

  updateMinCheckoutDate(selectedDates) {
    if (selectedDates.length === 1) {
      this.minCheckoutDate = new Date(selectedDates[0]);
      this.minCheckoutDate.setDate(this.minCheckoutDate.getDate() + 1);
    }
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateDisplay(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const propertySlug = new URLSearchParams(window.location.search).get('p') || 'default';
  new BookingCalendar('bookCheckIn', propertySlug);
});
