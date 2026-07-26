/**
 * XBear Ekip Başvuru Formu & Google Sheets Entegrasyon Scripti (Validation Included)
 */

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoMM5A3wk2vGavZTm2z2AnVkoJuQnSg_GNtrdSGpDk8IlToX7x54n0rbpdsdmyjBH6/exec';

document.addEventListener('DOMContentLoaded', () => {
  const applicationForm = document.getElementById('applicationForm');
  const appSubmitBtn = document.getElementById('appSubmitBtn');
  const appSuccessCard = document.getElementById('appSuccessCard');
  const submitAnotherBtn = document.getElementById('submitAnotherBtn');
  const sendCopyCheckbox = document.getElementById('sendCopyCheckbox');

  if (!applicationForm) return;

  // Form Elements
  const fullNameInput = document.getElementById('fullName');
  const birthDateInput = document.getElementById('birthDate');
  const emailInput = document.getElementById('applicantEmail');
  const educationInput = document.getElementById('educationInfo');
  const socialInput = document.getElementById('socialLinks');
  const hobbiesInput = document.getElementById('hobbies');
  const expectationsInput = document.getElementById('expectations');
  const contributionsInput = document.getElementById('contributions');
  const phoneInput = document.getElementById('phoneNumber');

  // Mobile menü açma/kapama js/main.js'de zaten yönetiliyor; burada ikinci
  // bir listener eklemek aynı tıklamada iki kez toggle'lanıp birbirini
  // iptal ediyordu (menü hiç açılmıyormuş gibi görünüyordu).

  // ===== LIVE INPUT MASKING =====

  // 1. Phone Input Live Masking (Formats to 05XX XXX XX XX)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      
      // Ensure starting with 05
      if (digits.length > 0 && !digits.startsWith('0')) {
        digits = '0' + digits;
      }
      if (digits.length > 1 && !digits.startsWith('05')) {
        digits = '05' + digits.substring(2);
      }
      
      // Cap at 11 digits
      digits = digits.substring(0, 11);
      
      // Format: 05XX XXX XX XX
      let formatted = '';
      if (digits.length > 0) formatted += digits.substring(0, 4);
      if (digits.length >= 5) formatted += ' ' + digits.substring(4, 7);
      if (digits.length >= 8) formatted += ' ' + digits.substring(7, 9);
      if (digits.length >= 10) formatted += ' ' + digits.substring(9, 11);
      
      e.target.value = formatted;
      validateField(phoneInput);
    });
  }

  // 2. Date Input Live Masking (Formats to DD.MM.YYYY)
  if (birthDateInput) {
    birthDateInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').substring(0, 8);
      let formatted = '';
      
      if (digits.length > 0) formatted += digits.substring(0, 2);
      if (digits.length >= 3) formatted += '.' + digits.substring(2, 4);
      if (digits.length >= 5) formatted += '.' + digits.substring(4, 8);
      
      e.target.value = formatted;
      validateField(birthDateInput);
    });
  }

  // ===== VALIDATION HELPERS =====

  function showFieldError(inputEl, message) {
    if (!inputEl) return;
    const cardField = inputEl.closest('.form-card-field');
    if (!cardField) return;

    cardField.classList.add('has-error');
    cardField.classList.remove('has-success');

    let errorEl = cardField.querySelector('.field-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error-msg';
      cardField.appendChild(errorEl);
    }
    errorEl.innerHTML = `<i class="ph-bold ph-warning-circle"></i> ${message}`;
  }

  function clearFieldError(inputEl) {
    if (!inputEl) return;
    const cardField = inputEl.closest('.form-card-field');
    if (!cardField) return;

    cardField.classList.remove('has-error');
    cardField.classList.add('has-success');

    const errorEl = cardField.querySelector('.field-error-msg');
    if (errorEl) {
      errorEl.remove();
    }
  }

  // Validation Rules Logic
  function validateField(inputEl) {
    if (!inputEl) return true;
    const val = inputEl.value.trim();

    // 1. İsim Soyisim (En az 2 kelime olmalı)
    if (inputEl === fullNameInput) {
      const words = val.split(/\s+/).filter(w => w.length > 0);
      if (words.length < 2) {
        showFieldError(inputEl, 'Lütfen adınızı ve soyadınızı eksiksiz girin (Örn: Ahmet Yılmaz)');
        return false;
      }
    }

    // 2. Doğum Tarihi (DD.MM.YYYY & Geçerli gün/ay/yıl)
    if (inputEl === birthDateInput) {
      const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const match = val.match(dateRegex);
      if (!match) {
        showFieldError(inputEl, 'Lütfen geçerli bir doğum tarihi girin (Örn: 15.04.2002)');
        return false;
      }
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1990 || year > 2012) {
        showFieldError(inputEl, 'Lütfen geçerli bir gün (1-31), ay (1-12) ve yıl (1990-2012) girin');
        return false;
      }
    }

    // 3. E-posta Adresi (Gerçek e-posta kontrolü)
    if (inputEl === emailInput) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val)) {
        showFieldError(inputEl, 'Lütfen geçerli bir e-posta adresi girin (Örn: adiniz@gmail.com)');
        return false;
      }
    }

    // 4. Telefon Numarası (05 ile başlayan 11 haneli telefon)
    if (inputEl === phoneInput) {
      const rawDigits = val.replace(/\D/g, '');
      if (rawDigits.length !== 11 || !rawDigits.startsWith('05')) {
        showFieldError(inputEl, 'Lütfen 05 ile başlayan 11 haneli geçerli bir cep telefonu girin (Örn: 05XX XXX XX XX)');
        return false;
      }
    }

    // 5. Üniversite / Bölüm / Sınıf
    if (inputEl === educationInput && val.length < 1) {
      showFieldError(inputEl, 'Lütfen okul/bölüm bilginizi girin (Öğrenci değilseniz nokta koyabilirsiniz)');
      return false;
    }

    // 6. Sosyal Medya Linkleri
    if (inputEl === socialInput && val.length < 2) {
      showFieldError(inputEl, 'Lütfen sosyal medya kullanıcı adı veya linkinizi girin (Örn: @kullaniciadi)');
      return false;
    }

    // 7. Hobiler, Beklentiler, Katkılar (Açıklayıcı içerik)
    if ((inputEl === hobbiesInput || inputEl === expectationsInput || inputEl === contributionsInput) && val.length < 5) {
      showFieldError(inputEl, 'Lütfen en az birkaç kelimelik açıklayıcı bir yanıt girin');
      return false;
    }

    clearFieldError(inputEl);
    return true;
  }

  // Attach live blur & input validation listeners to all inputs
  [fullNameInput, birthDateInput, emailInput, educationInput, socialInput, hobbiesInput, expectationsInput, contributionsInput, phoneInput].forEach((el) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      // Clear error immediately if valid on typing
      if (el.closest('.form-card-field')?.classList.contains('has-error')) {
        validateField(el);
      }
    });
  });

  // ===== FORM SUBMIT HANDLER =====
  applicationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Remove existing top warning banner if any
    const existingBanner = applicationForm.querySelector('.form-warning-banner');
    if (existingBanner) existingBanner.remove();

    // Validate all fields
    const inputsToValidate = [
      fullNameInput,
      birthDateInput,
      emailInput,
      educationInput,
      socialInput,
      hobbiesInput,
      expectationsInput,
      contributionsInput,
      phoneInput
    ];

    let firstInvalidInput = null;
    let isValidForm = true;

    inputsToValidate.forEach((inputEl) => {
      if (inputEl) {
        const isOk = validateField(inputEl);
        if (!isOk && !firstInvalidInput) {
          firstInvalidInput = inputEl;
          isValidForm = false;
        }
      }
    });

    if (!isValidForm && firstInvalidInput) {
      // Create top warning banner
      const banner = document.createElement('div');
      banner.className = 'form-warning-banner';
      banner.innerHTML = `<i class="ph-bold ph-warning-octagon"></i> Lütfen formdaki kırmızı renkli hatalı alanları kontrol edip tekrar deneyin.`;
      applicationForm.prepend(banner);

      // Scroll to first invalid field
      firstInvalidInput.focus();
      firstInvalidInput.closest('.form-card-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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
      applicantEmail: formData.get('applicantEmail')?.toString().trim() || '',
      educationInfo: formData.get('educationInfo')?.toString().trim() || '',
      socialLinks: formData.get('socialLinks')?.toString().trim() || '',
      hobbies: formData.get('hobbies')?.toString().trim() || '',
      expectations: formData.get('expectations')?.toString().trim() || '',
      contributions: formData.get('contributions')?.toString().trim() || '',
      phoneNumber: formData.get('phoneNumber')?.toString().trim() || '',
      sendCopy: sendCopyCheckbox ? sendCopyCheckbox.checked : false
    };

    try {
      if (GOOGLE_SHEETS_SCRIPT_URL && !GOOGLE_SHEETS_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
        await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        console.warn('[XBear Form] Google Apps Script URL henüz tanımlanmamış. Veriler simüle ediliyor.');
        await new Promise((res) => setTimeout(res, 1200));
      }

      // Show Success State & clear errors
      applicationForm.reset();
      inputsToValidate.forEach((el) => {
        if (el) {
          const card = el.closest('.form-card-field');
          if (card) {
            card.classList.remove('has-error', 'has-success');
            const errEl = card.querySelector('.field-error-msg');
            if (errEl) errEl.remove();
          }
        }
      });

      applicationForm.style.display = 'none';
      appSuccessCard.classList.remove('hidden');
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

  // Reset Event Handler
  applicationForm.addEventListener('reset', () => {
    const existingBanner = applicationForm.querySelector('.form-warning-banner');
    if (existingBanner) existingBanner.remove();

    [fullNameInput, birthDateInput, emailInput, educationInput, socialInput, hobbiesInput, expectationsInput, contributionsInput, phoneInput].forEach((el) => {
      if (el) {
        const card = el.closest('.form-card-field');
        if (card) {
          card.classList.remove('has-error', 'has-success');
          const errEl = card.querySelector('.field-error-msg');
          if (errEl) errEl.remove();
        }
      }
    });
  });

  // Submit Another Response
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', () => {
      appSuccessCard.classList.add('hidden');
      applicationForm.style.display = 'block';
      applicationForm.reset();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  }
});
