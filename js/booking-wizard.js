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
    this.maxAdults = 2;

    this.init();
  }

  init() {
    // Hide all steps except the first
    this.updateStepVisibility();

    // Setup step buttons
    const prevBtn = this.form.querySelector('[data-wizard-prev]');
    const nextBtn = this.form.querySelector('[data-wizard-next]');
    const submitBtn = this.form.querySelector('[data-wizard-submit]');

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); this.previousStep(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); this.nextStep(); });
    if (submitBtn) submitBtn.addEventListener('click', (e) => this.handleSubmit(e));

    // Initialize adults/children selects
    this.initGuestSelects();

    // Setup conditional field visibility
    const childrenSelect = this.form.querySelector('[name="children"]');
    const transferCheckbox = this.form.querySelector('[name="wantsTransfer"]');
    const babyKitCheckbox = this.form.querySelector('[name="wantsBabyKit"]');

    if (childrenSelect) {
      childrenSelect.addEventListener('change', () => this.updateBabyKitVisibility());
    }
    if (transferCheckbox) {
      transferCheckbox.addEventListener('change', () => this.updateTransferVisibility());
    }
    if (babyKitCheckbox) {
      babyKitCheckbox.addEventListener('change', () => this.updateBabyKitQuantityVisibility());
    }

    // Setup number of guests note
    const adultsSelect = this.form.querySelector('[name="adults"]');
    if (adultsSelect) {
      adultsSelect.addEventListener('change', () => this.updateGuestsNote());
      childrenSelect?.addEventListener('change', () => this.updateGuestsNote());
    }
  }

  initGuestSelects() {
    const adultsSelect = this.form.querySelector('[name="adults"]');
    const childrenSelect = this.form.querySelector('[name="children"]');

    if (!adultsSelect || !childrenSelect) return;

    // Populate adults (1-2)
    for (let i = 1; i <= this.maxAdults; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i === 1 ? '1 adulto' : `${i} adultos`;
      adultsSelect.appendChild(opt);
    }

    // Populate children (0-3)
    for (let i = 0; i <= 3; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      if (i === 0) opt.textContent = 'Nenhuma';
      else opt.textContent = i === 1 ? '1 criança' : `${i} crianças`;
      childrenSelect.appendChild(opt);
    }

    adultsSelect.value = 1;
    childrenSelect.value = 0;
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

    // Step 2: Validate capacity (max 2 adults)
    if (step === 2) {
      const adultsSelect = this.form.querySelector('[name="adults"]');
      const adults = parseInt(adultsSelect?.value) || 0;
      if (adults > this.maxAdults) {
        alert(`Capacidade máxima: ${this.maxAdults} adultos`);
        isValid = false;
      }
    }

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

  updateBabyKitQuantityVisibility() {
    const babyKitCheckbox = this.form.querySelector('[name="wantsBabyKit"]');
    const babyKitDetails = this.form.querySelector('[data-baby-kit-details]');

    if (!babyKitDetails || !babyKitCheckbox) return;

    if (babyKitCheckbox.checked) {
      babyKitDetails.style.display = 'block';
    } else {
      babyKitDetails.style.display = 'none';
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
