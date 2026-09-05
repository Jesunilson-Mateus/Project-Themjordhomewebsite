/* =========================================================================
   THEMAJORD'HOME — Booking Calendar Manager
   Manages calendar with Beds24 availability data
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

  // Fetch reservations from Beds24 (or mock data for now)
  async loadReservations() {
    try {
      // TODO: Replace with actual Beds24 API call
      // const response = await fetch(`/api/beds24/availability/${this.propertySlug}`);
      // const data = await response.json();
      // this.reservedDates = data.reserved_dates;

      // Mock data for demonstration
      const today = new Date();
      this.reservedDates = [
        this.formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
        this.formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
        this.formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
        this.formatDate(new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000)),
        this.formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
      ];

      if (window.bookingCalendar) {
        window.bookingCalendar.close();
      }
      this.initCalendar();
    } catch (error) {
      // Error loading reservations silently
    }
  }

  initCalendar() {
    const today = new Date();
    const separator = window.I18N ? window.I18N.t('booking.dateSeparator') : '—';

    window.bookingCalendar = flatpickr(this.inputElement, {
      mode: 'range',
      minDate: today,
      dateFormat: 'dd-mm-yyyy',
      locale: 'pt',
      disable: this.reservedDates,
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
