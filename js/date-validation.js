/* =========================================================================
   THEMAJORD'HOME — Date Validation Module
   Validates check-in/check-out dates with business rules
   ========================================================================= */

class DateValidator {
  constructor() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.currentHour = new Date().getHours();
  }

  // Parse date from dd-mm-yyyy or mm/dd/yyyy format
  parseDate(dateStr) {
    if (!dateStr) return null;

    // Handle both dd-mm-yyyy and dd/mm/yyyy formats
    const parts = dateStr.split(/[-\/]/);
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Validate date range
  validate(checkInStr, checkOutStr) {
    const errors = [];

    const checkIn = this.parseDate(checkInStr);
    const checkOut = this.parseDate(checkOutStr);

    // Invalid date format
    if (!checkIn) {
      errors.push({
        type: 'invalid_format',
        field: 'check-in',
        message: window.I18N ? window.I18N.t('validation.invalidDateFormat') : 'Data inválida. Use dd-mm-yyyy'
      });
    }

    if (!checkOut) {
      errors.push({
        type: 'invalid_format',
        field: 'check-out',
        message: window.I18N ? window.I18N.t('validation.invalidDateFormat') : 'Data inválida. Use dd-mm-yyyy'
      });
    }

    if (!checkIn || !checkOut) return errors;

    // Check-in cannot be in the past
    if (checkIn < this.today) {
      errors.push({
        type: 'date_passed',
        field: 'check-in',
        message: window.I18N ? window.I18N.t('validation.datePassed') : 'Esta data já passou'
      });
    }

    // Check-in same day only allowed before 18:00
    if (checkIn.getTime() === this.today.getTime() && this.currentHour >= 18) {
      errors.push({
        type: 'same_day_after_18',
        field: 'check-in',
        message: window.I18N ? window.I18N.t('validation.sameDayAfter18') : 'Reservas para hoje só são permitidas antes das 18h00'
      });
    }

    // Check-out must be after check-in
    if (checkOut <= checkIn) {
      errors.push({
        type: 'invalid_range',
        field: 'check-out',
        message: window.I18N ? window.I18N.t('validation.checkOutBeforeCheckIn') : 'Data de saída deve ser após data de entrada'
      });
    }

    return errors;
  }

  // Show validation errors as notifications
  showErrors(errors, containerId = null) {
    if (errors.length === 0) return true;

    const container = containerId ? document.getElementById(containerId) : document.body;

    // Remove existing error notifications
    const existing = container.querySelectorAll('[data-validation-error]');
    existing.forEach(el => el.remove());

    // Create and show new errors
    errors.forEach(error => {
      const errorEl = document.createElement('div');
      errorEl.className = 'validation-error';
      errorEl.setAttribute('data-validation-error', error.type);
      errorEl.style.cssText = `
        background: #fee;
        color: #c84d5c;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 12px;
        font-size: 13px;
        border-left: 3px solid #c84d5c;
      `;
      errorEl.textContent = error.message;

      if (container === document.body) {
        document.body.insertBefore(errorEl, document.body.firstChild);
      } else {
        container.insertBefore(errorEl, container.firstChild);
      }
    });

    return false;
  }

  // Clear validation errors
  clearErrors(containerId = null) {
    const container = containerId ? document.getElementById(containerId) : document.body;
    const errors = container.querySelectorAll('[data-validation-error]');
    errors.forEach(el => el.remove());
  }
}

// Initialize globally
window.dateValidator = new DateValidator();
