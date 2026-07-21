/**
 * XBear Ekip Başvuru Formu & Google Sheets Entegrasyon Scripti
 */

// IMPORTANT: Google Sheets Webhook URL'inizi buraya yapıştırın.
// Örnek: 'https://script.google.com/macros/s/AKfycb.../exec'
const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_YOUR_SCRIPT_ID_HERE/exec';

document.addEventListener('DOMContentLoaded', () => {
  const applicationForm = document.getElementById('applicationForm');
  const appSubmitBtn = document.getElementById('appSubmitBtn');
  const appSuccessCard = document.getElementById('appSuccessCard');
  const submitAnotherBtn = document.getElementById('submitAnotherBtn');

  if (!applicationForm) return;

  const sendCopyCheckbox = document.getElementById('sendCopyCheckbox');
  const emailInputWrapper = document.getElementById('emailInputWrapper');
  const applicantEmailInput = document.getElementById('applicantEmail');

  // Toggle Email Input when Checkbox is Checked
  if (sendCopyCheckbox && emailInputWrapper && applicantEmailInput) {
    sendCopyCheckbox.addEventListener('change', () => {
      if (sendCopyCheckbox.checked) {
        emailInputWrapper.classList.remove('hidden');
        applicantEmailInput.required = true;
        applicantEmailInput.focus();
      } else {
        emailInputWrapper.classList.add('hidden');
        applicantEmailInput.required = false;
        applicantEmailInput.value = '';
      }
    });
  }

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // Form Submit Handler
  applicationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = appSubmitBtn.innerHTML;

    // Loading state
    appSubmitBtn.disabled = true;
    appSubmitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Gönderiliyor...
    `;
    appSubmitBtn.style.opacity = '0.75';

    // Prepare Submission Payload
    const now = new Date();
    const formattedDate = now.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const formData = new FormData(applicationForm);
    const payload = {
      timestamp: formattedDate,
      fullName: formData.get('fullName')?.toString().trim() || '',
      birthDate: formData.get('birthDate')?.toString().trim() || '',
      educationInfo: formData.get('educationInfo')?.toString().trim() || '',
      socialLinks: formData.get('socialLinks')?.toString().trim() || '',
      hobbies: formData.get('hobbies')?.toString().trim() || '',
      expectations: formData.get('expectations')?.toString().trim() || '',
      contributions: formData.get('contributions')?.toString().trim() || '',
      phoneNumber: formData.get('phoneNumber')?.toString().trim() || '',
      sendCopy: sendCopyCheckbox ? sendCopyCheckbox.checked : false,
      applicantEmail: formData.get('applicantEmail')?.toString().trim() || ''
    };

    try {
      if (GOOGLE_SHEETS_SCRIPT_URL && !GOOGLE_SHEETS_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
        // Send data to Google Apps Script Web App
        await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps script redirect compatibility
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        console.warn('[XBear Form] Google Apps Script URL henüz tanımlanmamış. Veriler simüle ediliyor.');
        await new Promise((res) => setTimeout(res, 1200));
      }

      // Show Success State
      applicationForm.reset();
      if (emailInputWrapper) emailInputWrapper.classList.add('hidden');
      if (applicantEmailInput) applicantEmailInput.required = false;

      applicationForm.style.display = 'none';
      appSuccessCard.classList.remove('hidden');

      // Scroll to top of form smoothly
      window.scrollTo({ top: 120, behavior: 'smooth' });

    } catch (err) {
      console.error('[XBear Form Error]', err);
      alert('Başvuru gönderilirken bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      appSubmitBtn.disabled = false;
      appSubmitBtn.innerHTML = originalBtnText;
      appSubmitBtn.style.opacity = '1';
    }
  });

  // Reset Button Event
  applicationForm.addEventListener('reset', () => {
    if (emailInputWrapper) emailInputWrapper.classList.add('hidden');
    if (applicantEmailInput) applicantEmailInput.required = false;
  });

  // Submit Another Response
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', () => {
      appSuccessCard.classList.add('hidden');
      applicationForm.style.display = 'block';
      applicationForm.reset();
      if (emailInputWrapper) emailInputWrapper.classList.add('hidden');
      if (applicantEmailInput) applicantEmailInput.required = false;
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  }
});
