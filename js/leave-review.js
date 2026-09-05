/* =========================================================================
   THEMAJORD'HOME — Leave Review Page
   Handles guest review submission with email token verification
   ========================================================================= */

class LeaveReview {
  constructor() {
    this.form = document.getElementById('leaveReviewFormElement');
    this.propertyInfo = document.getElementById('propertyInfo');
    this.successMessage = document.getElementById('successMessage');
    this.reviewForm = document.getElementById('reviewForm');
    this.ratingInput = document.getElementById('ratingInput');

    this.parseUrlParams();
    this.setupEventListeners();
    this.populatePropertyInfo();
  }

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    this.propertySlug = params.get('property');
    this.token = params.get('token');
    this.email = params.get('email');
    this.checkIn = params.get('checkIn');
    this.checkOut = params.get('checkOut');
  }

  setupEventListeners() {
    // Star rating buttons
    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rating = parseInt(btn.dataset.rating);
        this.setRating(rating);
      });
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitReview();
      });
    }
  }

  setRating(rating) {
    this.ratingInput.value = rating;
    document.querySelectorAll('.star-btn').forEach(btn => {
      const btnRating = parseInt(btn.dataset.rating);
      btn.style.opacity = btnRating <= rating ? '1' : '0.3';
    });
  }

  populatePropertyInfo() {
    if (!this.propertySlug) {
      this.showError('Propriedade não identificada');
      return;
    }

    const prop = window.properties?.find(p => p.slug === this.propertySlug);
    if (!prop) {
      this.showError('Propriedade não encontrada');
      return;
    }

    const dates = this.checkIn && this.checkOut ? `${this.checkIn} — ${this.checkOut}` : '';
    this.propertyInfo.textContent = `${prop.name}${dates ? ` • ${dates}` : ''}`;
    this.propertyName = prop.name;
  }

  async submitReview() {
    const rating = this.ratingInput.value;
    const title = document.getElementById('reviewTitle').value;
    const text = document.getElementById('reviewText').value;
    const visitorName = document.getElementById('visitorName').value;
    const country = document.getElementById('visitorCountry').value;

    if (!rating || !title || !text || !visitorName) {
      this.showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const reviewData = {
      propertySlug: this.propertySlug,
      token: this.token,
      email: this.email,
      rating: parseInt(rating),
      title,
      text,
      visitorName,
      country,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reviewData)
      // });

      // Mock submission
      console.log('Review submitted:', reviewData);

      // Save to localStorage as backup
      const reviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
      reviews.push(reviewData);
      localStorage.setItem('pendingReviews', JSON.stringify(reviews));

      this.showSuccess();
    } catch (error) {
      this.showError('Erro ao submeter avaliação. Tente novamente.');
    }
  }

  showSuccess() {
    this.reviewForm.style.display = 'none';
    this.successMessage.style.display = 'block';
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 3px solid #c62828;
    `;
    errorDiv.textContent = message;

    if (this.reviewForm.firstChild) {
      this.reviewForm.insertBefore(errorDiv, this.reviewForm.firstChild);
    } else {
      this.reviewForm.appendChild(errorDiv);
    }

    setTimeout(() => errorDiv.remove(), 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LeaveReview();
});
