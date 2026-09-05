/* =========================================================================
   THEMAJORD'HOME — Multi-step Booking Wizard
   Manages 4-step booking form with conditional fields
   ========================================================================= */

class BookingWizard {
  constructor(formId, maxCapacity = null) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = {};

    // Ler capacidade do atributo data se não fornecido
    if (maxCapacity === null) {
      maxCapacity = parseInt(this.form.getAttribute('data-max-capacity')) || 2;
    }
    this.maxCapacity = maxCapacity;

    this.init();
  }

  setCapacity(maxCapacity) {
    this.maxCapacity = maxCapacity;
    this.initGuestSelects();
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
    const capacityNote = document.getElementById('capacityNote');

    if (!adultsSelect || !childrenSelect) return;

    // Limpar opções anteriores
    adultsSelect.innerHTML = '';
    childrenSelect.innerHTML = '';

    // Populate adults (1 até maxCapacity)
    for (let i = 1; i <= this.maxCapacity; i++) {
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

    // Atualizar mensagem de capacidade
    if (capacityNote) {
      const pt = `Máximo ${this.maxCapacity} adulto${this.maxCapacity > 1 ? 's' : ''}. Bebés não contam para o limite.`;
      const en = `Maximum ${this.maxCapacity} adult${this.maxCapacity > 1 ? 's' : ''}. Babies do not count towards the limit.`;
      const fr = `Maximum ${this.maxCapacity} adulte${this.maxCapacity > 1 ? 's' : ''}. Les bébés ne comptent pas dans la limite.`;

      const lang = window.I18N ? window.I18N.currentLang : 'pt';
      const message = lang === 'en' ? en : lang === 'fr' ? fr : pt;
      capacityNote.textContent = message;
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
        if (this.currentStep === this.totalSteps) {
          this.updateSummary();
        }
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepVisibility();
    }
  }

  validateStep(step) {
    const inputs = this.form.querySelectorAll(`[data-wizard-step="${step}"] [required]`);
    let isValid = true;
    let errorMessages = [];

    inputs.forEach(input => {
      if (!input.value || (input.type === 'checkbox' && !input.checked && input.hasAttribute('required'))) {
        input.classList.add('error');
        isValid = false;
        const label = input.previousElementSibling?.textContent || input.getAttribute('data-i18n') || input.name;
        errorMessages.push(label);
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid && errorMessages.length > 0) {
      const errorMsg = window.I18N
        ? window.I18N.t('booking.requiredFields')
        : 'Por favor, preencha os campos obrigatórios';
      setTimeout(() => alert(errorMsg), 50);
    }

    // Step 1: Validate dates
    if (step === 1) {
      const checkInField = this.form.querySelector('[name="dateRange"]');
      if (checkInField) {
        if (!checkInField.value) {
          // Show error for empty field
          if (window.dateValidator) {
            const emptyError = [{
              type: 'empty_field',
              field: 'check-in',
              message: window.I18N ? window.I18N.t('validation.invalidDateFormat') : 'Data inválida. Use dd-mm-yyyy'
            }];
            window.dateValidator.showErrors(emptyError, 'bookForm');
          }
          isValid = false;
        } else {
          const dates = checkInField.value.split(' — ');
          const checkInStr = dates[0];
          const checkOutStr = dates[1];

          if (window.dateValidator) {
            const errors = window.dateValidator.validate(checkInStr, checkOutStr);
            if (errors.length > 0) {
              window.dateValidator.showErrors(errors, 'bookForm');
              isValid = false;
            } else {
              window.dateValidator.clearErrors('bookForm');
            }
          }
        }
      }
    }

    // Step 2: Validate capacity (max capacity)
    if (step === 2) {
      const adultsSelect = this.form.querySelector('[name="adults"]');
      const adults = parseInt(adultsSelect?.value) || 0;
      if (adults > this.maxCapacity) {
        const pt = `Capacidade máxima: ${this.maxCapacity} adulto${this.maxCapacity > 1 ? 's' : ''}`;
        const en = `Maximum capacity: ${this.maxCapacity} adult${this.maxCapacity > 1 ? 's' : ''}`;
        const fr = `Capacité maximale: ${this.maxCapacity} adulte${this.maxCapacity > 1 ? 's' : ''}`;
        const lang = window.I18N ? window.I18N.currentLang : 'pt';
        const message = lang === 'en' ? en : lang === 'fr' ? fr : pt;
        alert(message);
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

  updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;

    const formData = new FormData(this.form);
    const dateRange = formData.get('dateRange') || '';
    const [checkIn, checkOut] = dateRange.split(' — ').map(d => d.trim());
    const adults = parseInt(formData.get('adults')) || 1;
    const children = parseInt(formData.get('children')) || 0;
    const totalGuests = adults + children;

    let servicesHtml = '';
    if (formData.get('wantsTransfer')) {
      const transferLabel = window.I18N ? window.I18N.t('booking.transfer') : 'Transfer';
      servicesHtml += `<li>${transferLabel}: ${parseInt(formData.get('transferPeople')) || 1} ${window.I18N ? window.I18N.t('booking.people') : 'pessoas'}</li>`;
    }
    if (formData.get('wantsBabyKit')) {
      const babyKitLabel = window.I18N ? window.I18N.t('booking.babyKit') : 'Baby Kit';
      servicesHtml += `<li>${babyKitLabel}: ${parseInt(formData.get('babyKitQuantity')) || 1}</li>`;
    }

    summaryContent.innerHTML = `
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin-top: 0; color: #333;">Resumo da sua reserva</h4>
        <p><strong>Período:</strong> ${checkIn} — ${checkOut}</p>
        <p><strong>Hóspedes:</strong> ${totalGuests} ${totalGuests === 1 ? 'pessoa' : 'pessoas'}</p>
        ${servicesHtml ? `<p><strong>Serviços:</strong></p><ul style="margin: 5px 0; padding-left: 20px;">${servicesHtml}</ul>` : '<p><strong>Serviços:</strong> Nenhum serviço adicional</p>'}
        <p><strong>Contacto:</strong> ${formData.get('visitorName')} (${formData.get('visitorEmail')})</p>
      </div>
    `;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateStep(this.totalSteps)) {
      // Collect form data
      const formData = new FormData(this.form);
      const dateRange = formData.get('dateRange') || '';
      const [checkIn, checkOut] = dateRange.split(' — ').map(d => d.trim());
      const adults = parseInt(formData.get('adults')) || 1;
      const children = parseInt(formData.get('children')) || 0;
      const totalGuests = adults + children;

      const services = [];
      if (formData.get('wantsTransfer')) {
        services.push({
          name: window.I18N ? window.I18N.t('booking.transfer') : 'Transfer',
          quantity: parseInt(formData.get('transferPeople')) || 1,
          price: 0 // TODO: fetch actual price from property data
        });
      }
      if (formData.get('wantsBabyKit')) {
        services.push({
          name: window.I18N ? window.I18N.t('booking.babyKit') : 'Baby Kit',
          quantity: parseInt(formData.get('babyKitQuantity')) || 1,
          price: 0 // TODO: fetch actual price from property data
        });
      }

      const reservationData = {
        propertyName: window.propertyName || 'Property',
        propertySlug: window.propertySlug || 'property',
        checkIn: checkIn,
        checkOut: checkOut,
        guestName: formData.get('visitorName') || 'Guest',
        guestEmail: formData.get('visitorEmail') || '',
        guestPhone: formData.get('visitorPhone') || '',
        totalGuests: totalGuests,
        services: services,
        totalPrice: 0 // TODO: fetch actual price from property data
      };

      // Send confirmation email with review link
      if (window.ReservationEmail) {
        window.ReservationEmail.sendReservationConfirmation(reservationData).then(result => {
          const message = window.I18N
            ? window.I18N.t('booking.alert')
            : 'Sua reserva foi submetida! Em breve receberá confirmação por email.';
          alert(message);
          // TODO: Redirect to confirmation page or reset form
        }).catch(error => {
          const errorMsg = window.I18N
            ? window.I18N.t('booking.error')
            : 'Erro ao processar reserva. Tente novamente.';
          alert(errorMsg);
        });
      } else {
        const message = window.I18N
          ? window.I18N.t('booking.alert')
          : 'Sua reserva foi submetida! Em breve receberá confirmação.';
        alert(message);
      }
    }
  }
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bookingWizard = new BookingWizard('bookForm');
});
