/**
 * Amma Healing Centerr - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  injectConfigData();
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initTherapyModals();
  initConcernInteractions();
  initNumerologyCalculator();
  initBookingForm();
  initUnifiedBookingModal();
  initModalCloseHandlers();
}

/**
 * Injects dynamic configurable data from SITE_CONFIG into the DOM
 */
function injectConfigData() {
  if (typeof SITE_CONFIG === 'undefined') return;

  // Phone elements
  document.querySelectorAll('.js-phone-display').forEach(el => {
    el.textContent = SITE_CONFIG.phoneDisplay;
  });

  document.querySelectorAll('.js-phone-call-link').forEach(el => {
    el.setAttribute('href', `tel:${SITE_CONFIG.phoneCall}`);
  });

  // WhatsApp elements
  const defaultWaText = encodeURIComponent(`Hello Amma Healing Centerr, I would like to inquire about holistic wellness therapies / numerology guidance in Mysuru.`);
  document.querySelectorAll('.js-whatsapp-link, .js-whatsapp-link-1').forEach(el => {
    el.setAttribute('href', `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${defaultWaText}`);
  });
  document.querySelectorAll('.js-whatsapp-link-2').forEach(el => {
    el.setAttribute('href', `https://wa.me/${SITE_CONFIG.whatsappNumber2}?text=${defaultWaText}`);
  });

  // Address & Maps elements
  document.querySelectorAll('.js-full-address').forEach(el => {
    el.textContent = SITE_CONFIG.location.fullAddress;
  });

  document.querySelectorAll('.js-maps-directions').forEach(el => {
    el.setAttribute('href', SITE_CONFIG.location.googleMapsDirectionsUrl);
  });

  // Hours
  const hoursWeekdays = document.getElementById('js-hours-weekdays');
  const hoursWeekend = document.getElementById('js-hours-weekend');
  if (hoursWeekdays) hoursWeekdays.textContent = SITE_CONFIG.openingHours.weekdays;
  if (hoursWeekend) hoursWeekend.textContent = SITE_CONFIG.openingHours.weekend;

  // Reviews stats
  document.querySelectorAll('.js-review-rating').forEach(el => {
    el.textContent = SITE_CONFIG.reviews.rating;
  });
  document.querySelectorAll('.js-review-count').forEach(el => {
    el.textContent = `${SITE_CONFIG.reviews.reviewCount} Google Reviews`;
  });
}

/**
 * Header scroll state & active link tracking
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/**
 * Mobile navigation menu toggle
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-actions .btn');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Scroll reveal animations via IntersectionObserver
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('active'));
  }
}

/**
 * Unified Appointment Booking Modal
 */
function initUnifiedBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const formView = document.getElementById('bookingFormView');
  const successView = document.getElementById('bookingSuccessView');
  const form = document.getElementById('modalAppointmentForm');
  const dateInput = document.getElementById('modalBookDate');
  const alertBox = document.getElementById('bookingAlertBox');
  const alertMsg = document.getElementById('bookingAlertMsg');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const submitSpinner = document.getElementById('modalSubmitSpinner');
  const submitText = document.getElementById('modalSubmitText');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    // Set default value to today or tomorrow
    dateInput.value = today;
  }

  // Global Open Booking Modal Function
  window.openBookingModal = function(therapyName, concernText) {
    if (!modalOverlay) return;

    // Reset views
    if (formView) formView.style.display = 'block';
    if (successView) successView.classList.remove('active');
    if (alertBox) alertBox.classList.remove('active');

    // Reset form or prefill
    if (therapyName) {
      const therapySelect = document.getElementById('modalBookTherapy');
      if (therapySelect) {
        let matched = false;
        for (let i = 0; i < therapySelect.options.length; i++) {
          if (therapySelect.options[i].value.toLowerCase() === therapyName.toLowerCase() ||
              therapySelect.options[i].text.toLowerCase().includes(therapyName.toLowerCase())) {
            therapySelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched && therapySelect.options.length > 1) {
          therapySelect.selectedIndex = 1;
        }
      }
    }

    if (concernText) {
      const concernField = document.getElementById('modalBookConcern');
      if (concernField) {
        concernField.value = concernText;
      }
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      const nameInput = document.getElementById('modalBookName');
      if (nameInput) nameInput.focus();
    }, 150);
  };

  // Wire all generic Book Appointment buttons across the site
  document.querySelectorAll('a[href="#book"], .js-open-booking-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If clicked inside header/hero/footer/mobile bar, open modal directly
      e.preventDefault();
      window.openBookingModal();
    });
  });

  // Modal Form Submission Handler
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (alertBox) alertBox.classList.remove('active');

      const name = (document.getElementById('modalBookName').value || '').trim();
      const phone = (document.getElementById('modalBookPhone').value || '').trim();
      const therapy = (document.getElementById('modalBookTherapy').value || '').trim();
      const date = (document.getElementById('modalBookDate').value || '').trim();
      const time = (document.getElementById('modalBookTime').value || '').trim();
      const concern = (document.getElementById('modalBookConcern').value || '').trim();

      // 1. Frontend Validations
      if (!name || name.length < 2) {
        showAlert('Please enter your full name (at least 2 characters).');
        document.getElementById('modalBookName').focus();
        return;
      }

      if (window.AmmaSupabase) {
        const phoneVal = window.AmmaSupabase.validateIndianPhone(phone);
        if (!phoneVal.isValid) {
          showAlert(phoneVal.message);
          document.getElementById('modalBookPhone').focus();
          return;
        }

        if (!therapy) {
          showAlert('Please select a therapy or consultation.');
          document.getElementById('modalBookTherapy').focus();
          return;
        }

        const dateVal = window.AmmaSupabase.validateAppointmentDate(date);
        if (!dateVal.isValid) {
          showAlert(dateVal.message);
          document.getElementById('modalBookDate').focus();
          return;
        }

        if (!time) {
          showAlert('Please select your preferred time slot.');
          document.getElementById('modalBookTime').focus();
          return;
        }
      }

      // 2. Set Loading State
      setLoading(true);

      try {
        const appointmentData = {
          full_name: name,
          phone: phone,
          therapy: therapy,
          appointment_date: date,
          preferred_time: time,
          concern: concern
        };

        const result = window.AmmaSupabase
          ? await window.AmmaSupabase.submitAppointment(appointmentData)
          : { success: true, data: appointmentData };

        if (!result.success) {
          setLoading(false);
          showAlert(result.error || 'Failed to submit appointment. Please try again.');
          return;
        }

        // 3. Show Success State
        showSuccessView(result.data || appointmentData);
        form.reset();
      } catch (err) {
        console.error('Submission error:', err);
        setLoading(false);
        showAlert('An unexpected error occurred. Please call or WhatsApp us directly.');
      }
    });
  }

  function showAlert(message) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = message;
      alertBox.classList.add('active');
    } else {
      alert(message);
    }
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.classList.add('loading');
      if (submitText) submitText.textContent = 'Scheduling your appointment...';
    } else {
      submitBtn.classList.remove('loading');
      if (submitText) submitText.textContent = 'Confirm & Schedule Appointment';
    }
  }

  function showSuccessView(data) {
    setLoading(false);
    if (formView) formView.style.display = 'none';
    if (successView) successView.classList.add('active');

    // Build standard WhatsApp Message as strictly required:
    const waMessage = `Hello Amma Healing Center,\n\nI would like to book an appointment.\n\nName: ${data.full_name}\nPhone: ${data.phone}\nTherapy: ${data.therapy}\nPreferred Date: ${data.appointment_date}\nPreferred Time: ${data.preferred_time}\n\nConcern:\n${data.concern || 'None specified'}\n\nThank you.`;

    const encodedMsg = encodeURIComponent(waMessage);
    const waNumber = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.whatsappNumber) ? SITE_CONFIG.whatsappNumber : '919731138761';
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

    // Populate Summary Card
    const summaryCard = document.getElementById('modalSuccessSummaryCard');
    if (summaryCard) {
      summaryCard.innerHTML = `
        <div class="summary-row">
          <span class="summary-label">Customer Name</span>
          <span class="summary-value">${escapeHtml(data.full_name)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Phone</span>
          <span class="summary-value">${escapeHtml(data.phone)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Therapy</span>
          <span class="summary-value">${escapeHtml(data.therapy)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Date & Time</span>
          <span class="summary-value">${escapeHtml(data.appointment_date)} (${escapeHtml(data.preferred_time)})</span>
        </div>
        ${data.concern && data.concern !== 'None specified' ? `
        <div class="summary-row">
          <span class="summary-label">Concern</span>
          <span class="summary-value" style="max-width: 60%;">${escapeHtml(data.concern)}</span>
        </div>` : ''}
      `;
    }

    // Set WhatsApp Button
    const waBtn = document.getElementById('modalSuccessWhatsAppBtn');
    if (waBtn) {
      waBtn.href = waUrl;
    }

    // Set Copy Button
    const copyBtn = document.getElementById('modalCopyDetailsBtn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(waMessage).then(() => {
          const span = copyBtn.querySelector('span');
          if (span) {
            span.textContent = 'Copied!';
            setTimeout(() => { span.textContent = 'Copy Details'; }, 2500);
          }
        });
      };
    }

    // Re-initialize any dynamic icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

/**
 * Therapy Detail Modals
 */
function initTherapyModals() {
  const modalOverlay = document.getElementById('therapyModal');
  const modalTitle = document.getElementById('modalTherapyTitle');
  const modalTagline = document.getElementById('modalTherapyTagline');
  const modalImage = document.getElementById('modalTherapyImage');
  const modalDescription = document.getElementById('modalTherapyDescription');
  const modalBenefitsList = document.getElementById('modalTherapyBenefits');
  const modalBookBtn = document.getElementById('modalTherapyBookBtn');

  if (!modalOverlay) return;

  window.openTherapyModal = function(therapyId) {
    if (!SITE_CONFIG || !SITE_CONFIG.therapies) return;
    const therapy = SITE_CONFIG.therapies.find(t => t.id === therapyId);
    if (!therapy) return;

    modalTitle.textContent = therapy.name;
    modalTagline.textContent = therapy.tagline;
    modalImage.src = therapy.image;
    modalImage.alt = `${therapy.name} at Amma Healing Centerr`;
    modalDescription.textContent = therapy.longDesc;

    // Populate benefits
    modalBenefitsList.innerHTML = '';
    therapy.benefits.forEach(benefit => {
      const li = document.createElement('li');
      li.textContent = benefit;
      modalBenefitsList.appendChild(li);
    });

    modalBookBtn.onclick = () => {
      closeAllModals();
      window.openBookingModal(therapy.name);
    };

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
}

/**
 * Concern cards click to pre-fill booking modal
 */
function initConcernInteractions() {
  window.selectConcernAndBook = function(concernName) {
    window.openBookingModal('', `I would like holistic wellness guidance regarding: ${concernName}.`);
  };
}

/**
 * Helper to select service and open booking modal
 */
function selectServiceAndScroll(serviceName) {
  window.openBookingModal(serviceName);
}

/**
 * Numerology Quick Assistant
 */
function initNumerologyCalculator() {
  const numForm = document.getElementById('numerologyQuickForm');
  if (!numForm) return;

  numForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('numName').value.trim();
    const dob = document.getElementById('numDob').value;
    const serviceType = document.getElementById('numServiceType').value;

    let inquiryText = `Hello Amma Healing Center,\n\nI would like to inquire about Numerology Guidance.\n`;
    if (name) inquiryText += `Name: ${name}\n`;
    if (dob) inquiryText += `Date of Birth: ${dob}\n`;
    inquiryText += `Area of Guidance: ${serviceType}\n\nThank you.`;

    const encoded = encodeURIComponent(inquiryText);
    const waNumber = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.whatsappNumber) ? SITE_CONFIG.whatsappNumber : '919731138761';
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  });
}

/**
 * Inline Booking Form in #book section (syncs with unified booking)
 */
function initBookingForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.addEventListener('focus', () => {
      dateInput.setAttribute('min', today);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookName') ? document.getElementById('bookName').value.trim() : '';
    const phone = document.getElementById('bookPhone') ? document.getElementById('bookPhone').value.trim() : '';
    const service = document.getElementById('bookService') ? document.getElementById('bookService').value : '';
    const message = document.getElementById('bookMessage') ? document.getElementById('bookMessage').value.trim() : '';

    window.openBookingModal(service, message);
    if (name) {
      const modalName = document.getElementById('modalBookName');
      if (modalName) modalName.value = name;
    }
    if (phone) {
      const modalPhone = document.getElementById('modalBookPhone');
      if (modalPhone) modalPhone.value = phone;
    }
  });
}

/**
 * Modal close triggers (close button, backdrop click, Escape key)
 */
function initModalCloseHandlers() {
  const closeButtons = document.querySelectorAll('.js-modal-close');
  const overlays = document.querySelectorAll('.modal-overlay');

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

function escapeHtml(string) {
  if (!string) return '';
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

