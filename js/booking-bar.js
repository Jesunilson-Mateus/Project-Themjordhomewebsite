/* =========================================================================
   THEMAJORD'HOME — Main Booking Bar
   Handles search form submission and navigation to search results
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingBar');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkin = form.querySelector('[name="checkin"]').value;
    const checkout = form.querySelector('[name="checkout"]').value;
    const guests = form.querySelector('[name="guests"]').value;

    // Convert date format from YYYY-MM-DD to DD-MM-YYYY
    const checkInFormatted = formatDateToSearch(checkin);
    const checkOutFormatted = formatDateToSearch(checkout);

    // Navigate to search results
    const params = new URLSearchParams({
      checkIn: checkInFormatted,
      checkOut: checkOutFormatted,
      guests: guests
    });

    window.location.href = `search-results.html?${params.toString()}`;
  });
});

function formatDateToSearch(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}
