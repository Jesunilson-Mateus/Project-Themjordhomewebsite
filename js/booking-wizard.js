/* =========================================================================
   THEMAJORD'HOME — Multi-step Booking Wizard
   Manages 4-step booking form with conditional fields
   ========================================================================= */

class BookingWizard {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};

    this.init();
  }

  init() {
    // Hide all steps except the first
    this.updateStepVisibility();

    // Setup step buttons
    const prevBtn = this.form.querySelector('[data-wizard-prev]');
    const nextBtn = this.form.querySelector('[data-wizard-next]');
    const submitBtn = this.form.querySelector('[data-wizard-submit]');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
    if (submitBtn) submitBtn.addEventListener('click', (e) => this.handleSubmit(e));

    // Setup conditional field visibility
    const childrenSelect = this.form.querySelector('[name="children"]');
    const transferCheckbox = this.form.querySelector('[name="wantsTransfer"]');

    if (childrenSelect) {
      childrenSelect.addEventListener('change', () => this.updateBabyKitVisibility());
    }
    if (transferCheckbox) {
      transferCheckbox.addEventListener('change', () => this.updateTransferVisibility());
    }

    // Setup number of guests note
    const adultsSelect = this.form.querySelector('[name="adults"]');
    if (adultsSelect) {
      adultsSelect.addEventListener('change', () => this.updateGuestsNote());
      childrenSelect?.addEventListener('change', () => this.updateGuestsNote());
    }
  }

  updateStepVisibility() {
    const steps = this.form.querySelectorAll('[data-wizard-step]');
    steps.forEach((step, idx) => {
      step.style.display = (idx + 1 === this.currentStep) ? 'block' : 'none';
    });

    this.updateButtons();
  }

  updateButtons() {
    const prevBtn = this.form.querySelector('[data-wizard-prev]');
    const nextBtn = this.form.querySelector('[data-wizard-next]');
    const submitBtn = this.form.querySelector('[data-wizard-submit]');

    if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    if (nextBtn) nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
    if (submitBtn) submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStepVisibility();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  validateStep(step) {
    const inputs = this.form.querySelectorAll(`[data-wizard-step="${step}"] [required]`);
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value || (input.type === 'checkbox' && !input.checked && input.hasAttribute('required'))) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });

    return isValid;
  }

  updateGuestsNote() {
    const adultsSelect = this.form.querySelector('[name="adults"]');
    const childrenSelect = this.form.querySelector('[name="children"]');
    const note = this.form.querySelector('[data-guests-note]');

    if (!note) return;

    const adults = parseInt(adultsSelect?.value) || 0;
    const children = parseInt(childrenSelect?.value) || 0;
    const total = adults + children;

    note.textContent = `${total} hóspedes no total`;
  }

  updateBabyKitVisibility() {
    const childrenSelect = this.form.querySelector('[name="children"]');
    const babyKitField = this.form.querySelector('[data-baby-kit-field]');

    if (!babyKitField || !childrenSelect) return;

    const children = parseInt(childrenSelect.value) || 0;
    if (children > 0) {
      babyKitField.style.display = 'block';
    } else {
      babyKitField.style.display = 'none';
      this.form.querySelector('[name="wantsBabyKit"]').checked = false;
    }
  }

  updateTransferVisibility() {
    const transferCheckbox = this.form.querySelector('[name="wantsTransfer"]');
    const transferDetails = this.form.querySelector('[data-transfer-details]');

    if (!transferDetails || !transferCheckbox) return;

    if (transferCheckbox.checked) {
      transferDetails.style.display = 'block';
    } else {
      transferDetails.style.display = 'none';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateStep(this.totalSteps)) {
      // Collect form data
      const formData = new FormData(this.form);
      console.log('Booking submitted:', Object.fromEntries(formData));

      // Show alert (replace with actual API call)
      const message = window.I18N
        ? window.I18N.t('booking.alert')
        : 'Sua reserva foi submetida! Em breve receberá confirmação.';
      alert(message);
    }
  }
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BookingWizard('bookForm');
});
