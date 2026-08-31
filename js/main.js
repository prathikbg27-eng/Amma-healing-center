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
  document.querySelectorAll('.js-whatsapp-link').forEach(el => {
    el.setAttribute('href', `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${defaultWaText}`);
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
      selectServiceAndScroll(therapy.name);
    };

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
}

/**
 * Concern cards click to pre-fill inquiry
 */
function initConcernInteractions() {
  window.selectConcernAndBook = function(concernName) {
    const serviceSelect = document.getElementById('bookService');
    const messageField = document.getElementById('bookMessage');
    const bookingSection = document.getElementById('book');

    if (messageField) {
      messageField.value = `I would like holistic wellness guidance regarding: ${concernName}.`;
    }

    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

/**
 * Helper to select service and smoothly scroll to booking
 */
function selectServiceAndScroll(serviceName) {
  const serviceSelect = document.getElementById('bookService');
  const bookingSection = document.getElementById('book');

  if (serviceSelect) {
    // Attempt to match dropdown option
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
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

    let inquiryText = `Hello Amma Healing Centerr, I would like to inquire about Numerology Guidance.\n`;
    if (name) inquiryText += `Name: ${name}\n`;
    if (dob) inquiryText += `Date of Birth: ${dob}\n`;
    inquiryText += `Area of Guidance: ${serviceType}\n`;

    const encoded = encodeURIComponent(inquiryText);
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  });
}

/**
 * Appointment Booking Form submission & confirmation modal
 */
function initBookingForm() {
  const form = document.getElementById('appointmentForm');
  const confirmModal = document.getElementById('confirmationModal');
  const confirmSummary = document.getElementById('confirmSummaryText');
  const confirmWhatsAppBtn = document.getElementById('confirmWhatsAppBtn');
  const confirmCopyBtn = document.getElementById('confirmCopyBtn');

  if (!form) return;

  // Set min date for datepicker to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const service = document.getElementById('bookService').value;
    const message = document.getElementById('bookMessage').value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    // Format neat message
    let waMessage = `*New Appointment Inquiry - Amma Healing Centerr*\n\n`;
    waMessage += `👤 *Name:* ${name}\n`;
    waMessage += `📞 *Phone:* ${phone}\n`;
    if (date) waMessage += `📅 *Preferred Date:* ${date}\n`;
    if (time) waMessage += `⏰ *Preferred Time:* ${time}\n`;
    waMessage += `🌿 *Service:* ${service}\n`;
    if (message) waMessage += `💬 *Note / Concern:* ${message}\n`;
    waMessage += `\n_Submitted via Amma Healing Centerr Website_`;

    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;

    // Update confirmation modal
    if (confirmSummary) {
      confirmSummary.innerHTML = `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        ${date ? `<p><strong>Preferred Date:</strong> ${escapeHtml(date)}</p>` : ''}
        ${time ? `<p><strong>Preferred Time:</strong> ${escapeHtml(time)}</p>` : ''}
        ${message ? `<p><strong>Concern/Note:</strong> ${escapeHtml(message)}</p>` : ''}
      `;
    }

    if (confirmWhatsAppBtn) {
      confirmWhatsAppBtn.href = waUrl;
      confirmWhatsAppBtn.onclick = () => {
        closeAllModals();
      };
    }

    if (confirmCopyBtn) {
      confirmCopyBtn.onclick = () => {
        navigator.clipboard.writeText(waMessage).then(() => {
          confirmCopyBtn.textContent = 'Copied to Clipboard!';
          setTimeout(() => {
            confirmCopyBtn.textContent = 'Copy Details';
          }, 2500);
        });
      };
    }

    // Show Confirmation Modal
    if (confirmModal) {
      confirmModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    form.reset();
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
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
