// Force browser to reset scroll position to top on page refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset immediately on script load
window.scrollTo(0, 0);

// Helper to clear focus from inputs on page load
const preventRestoredFocusScroll = () => {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
    active.blur();
  }
};

window.addEventListener('load', () => {
  preventRestoredFocusScroll();
  
  // Detect if the page was reloaded (refreshed)
  const isReload = performance.getEntriesByType('navigation')
    .map(nav => nav.type)
    .includes('reload');
    
  if (isReload || !window.location.hash) {
    if (window.location.hash) {
      // Clear hash from URL quietly so browser doesn't scroll to it on next load
      history.replaceState("", document.title, window.location.pathname + window.location.search);
    }
    
    // Perform multiple reset scrolls to ensure we beat all layout shifts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  preventRestoredFocusScroll();
  window.scrollTo(0, 0);

  // ==========================================
  // 1. Header Scroll Effect
  // ==========================================
  const header = document.getElementById('site-header');
  const checkHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkHeaderScroll);
  checkHeaderScroll(); // Initial check

  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navigation = document.getElementById('primary-navigation');
  
  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navigation.classList.toggle('open');
    });

    // Close menu when clicking navigation links
    const navLinks = navigation.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 3. Hero Entrance Animations
  // ==========================================
  const animateOnLoadElements = document.querySelectorAll('.animate-on-load');
  setTimeout(() => {
    animateOnLoadElements.forEach(el => el.classList.add('show'));
  }, 100);

  // ==========================================
  // 4. Scroll Intersection Observers
  // ==========================================
  // Automatically wrap sections for scroll animation
  const animatableSections = [
    'about', 
    'why-choose-us', 
    'markets', 
    'gallery'
  ];
  
  animatableSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('fade-in-section');
    }
  });

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in-section').forEach(section => {
    scrollObserver.observe(section);
  });

  // ==========================================
  // 5. Image Lazy Loading & Blur-up
  // ==========================================
  const lazyImages = document.querySelectorAll('.lazy-load');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Simulating immediate load verification for local assets
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });

  // ==========================================
  // 6. Product Category Tabs Filter
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.id.replace('tab-', '');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
          // Force a subtle fade-in transition
          card.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 400,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 7. Modals (Request Quote & Catalogue Download)
  // ==========================================
  const quoteModal = document.getElementById('quote-modal');
  const catalogueModal = document.getElementById('catalogue-modal');

  // Open Quote Modal
  document.querySelectorAll('.open-quote-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quoteModal) quoteModal.showModal();
    });
  });

  // Close Quote Modal
  const closeQuoteBtn = document.getElementById('close-quote-modal-btn');
  if (closeQuoteBtn && quoteModal) {
    closeQuoteBtn.addEventListener('click', () => quoteModal.close());
    // Close on click outside modal content
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) quoteModal.close();
    });
  }

  // Open Catalogue Modal
  document.querySelectorAll('.open-catalogue-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (catalogueModal) catalogueModal.showModal();
    });
  });

  // Close Catalogue Modal
  const closeCatBtn = document.getElementById('close-catalogue-modal-btn');
  if (closeCatBtn && catalogueModal) {
    closeCatBtn.addEventListener('click', () => catalogueModal.close());
    catalogueModal.addEventListener('click', (e) => {
      if (e.target === catalogueModal) catalogueModal.close();
    });
  }

  // ==========================================
  // 8. B2B Contextual Product Inquiry Buttons
  // ==========================================
  const productInquireButtons = document.querySelectorAll('.product-inquire-btn');
  const inquiryDropdown = document.getElementById('granite-variety');
  const inquiryMessage = document.getElementById('client-message');

  productInquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = btn.getAttribute('data-product');
      if (inquiryDropdown && inquiryMessage) {
        // Set the dropdown to match the product clicked
        inquiryDropdown.value = productName;
        
        // Trigger floating label update on select
        inquiryDropdown.dispatchEvent(new Event('change'));
        
        // Pre-fill message details with professional specifications template
        inquiryMessage.value = `I would like to receive an export quotation for ${productName} slabs.\n\nEstimated Thickness: 20mm / 30mm\nFinish Preference: Polished\nRequired Volume: \nDestination Port: `;
        inquiryMessage.dispatchEvent(new Event('input')); // updates floating label

        // Set focus to the message textarea
        setTimeout(() => {
          inquiryMessage.focus();
        }, 100);
      }
    });
  });

  // ==========================================
  // 9. Lead Capture & Form validation logic
  // ==========================================

  // Regular expression for business email verification
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields helper
  const validateField = (input, errorElement, checkCondition) => {
    if (checkCondition) {
      input.classList.remove('invalid');
      if (errorElement) errorElement.style.display = 'none';
      return true;
    } else {
      input.classList.add('invalid');
      if (errorElement) errorElement.style.display = 'block';
      return false;
    }
  };

  // --- Main Inquiry Form Handler ---
  const inquiryForm = document.getElementById('direct-export-inquiry-form');
  const submitInquiryBtn = document.getElementById('submit-inquiry-btn');
  const inquiryStatusAlert = document.getElementById('form-status-alert');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('client-name');
      const companyInput = document.getElementById('client-company');
      const emailInput = document.getElementById('client-email');
      const phoneInput = document.getElementById('client-phone');
      const varietySelect = document.getElementById('granite-variety');
      const volumeSelect = document.getElementById('shipping-volume');
      const messageText = document.getElementById('client-message');

      const isNameValid = validateField(nameInput, document.getElementById('name-error'), nameInput.value.trim().length >= 2);
      const isCompanyValid = validateField(companyInput, document.getElementById('company-error'), companyInput.value.trim().length >= 1);
      const isEmailValid = validateField(emailInput, document.getElementById('email-error'), emailRegex.test(emailInput.value.trim()));
      const isPhoneValid = validateField(phoneInput, document.getElementById('phone-error'), phoneInput.value.trim().length >= 5);
      const isVarietyValid = validateField(varietySelect, document.getElementById('variety-error'), varietySelect.value !== "");
      const isVolumeValid = validateField(volumeSelect, document.getElementById('volume-error'), volumeSelect.value !== "");
      const isMessageValid = validateField(messageText, document.getElementById('message-error'), messageText.value.trim().length >= 10);

      if (isNameValid && isCompanyValid && isEmailValid && isPhoneValid && isVarietyValid && isVolumeValid && isMessageValid) {
        // Form is valid - initiate submission loader
        submitInquiryBtn.disabled = true;
        const origBtnText = submitInquiryBtn.innerHTML;
        submitInquiryBtn.innerHTML = '<span>Verifying Credentials & Transmitting...</span>';
        
        inquiryStatusAlert.className = 'form-status-alert';
        inquiryStatusAlert.style.display = 'none';

        // Simulating secure B2B CRM submission latency
        setTimeout(() => {
          submitInquiryBtn.disabled = false;
          submitInquiryBtn.innerHTML = origBtnText;

          // Success alert
          inquiryStatusAlert.className = 'form-status-alert success';
          inquiryStatusAlert.innerHTML = `<strong>Inquiry Received.</strong> Your requirements have been encrypted and dispatched to the trade desk. A regional export manager will review your specifications and contact you at <strong>${emailInput.value}</strong> or <strong>${phoneInput.value}</strong> within 24 business hours.`;
          inquiryStatusAlert.style.display = 'block';
          inquiryStatusAlert.setAttribute('aria-hidden', 'false');

          // Reset the form
          inquiryForm.reset();
          
          // Scroll slightly to make sure the success alert is in full view
          inquiryStatusAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
      } else {
        // Scroll to first invalid field
        const firstInvalid = inquiryForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  // --- Modal Quote Form Handler ---
  const modalQuoteForm = document.getElementById('modal-quote-form');
  const modalQuoteStatus = document.getElementById('modal-quote-status');

  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('modal-name');
      const company = document.getElementById('modal-company');
      const email = document.getElementById('modal-email');
      const phone = document.getElementById('modal-phone');
      const variety = document.getElementById('modal-variety');
      const message = document.getElementById('modal-message');

      const isValid = name.value && company.value && emailRegex.test(email.value) && phone.value && variety.value && message.value;

      if (isValid) {
        modalQuoteStatus.className = 'form-status-alert success';
        modalQuoteStatus.innerHTML = '<strong>Quote Request Sent.</strong> Connecting with regional distributor...';
        modalQuoteStatus.style.display = 'block';

        setTimeout(() => {
          modalQuoteForm.reset();
          modalQuoteStatus.style.display = 'none';
          if (quoteModal) quoteModal.close();
          
          // Alert user on the main UI
          alert("Quote request submitted successfully. Check your email inbox for connection validation.");
        }, 1500);
      } else {
        modalQuoteStatus.className = 'form-status-alert error';
        modalQuoteStatus.innerHTML = 'Please populate all fields correctly.';
        modalQuoteStatus.style.display = 'block';
      }
    });
  }

  // --- Modal Catalogue Form & Simulation of PDF Download ---
  const modalCatForm = document.getElementById('modal-catalogue-form');
  const modalCatStatus = document.getElementById('modal-cat-status');

  if (modalCatForm) {
    modalCatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('cat-name');
      const companyInput = document.getElementById('cat-company');
      const emailInput = document.getElementById('cat-email');

      const isNameValid = nameInput.value.trim().length >= 2;
      const isCompanyValid = companyInput.value.trim().length >= 1;
      const isEmailValid = emailRegex.test(emailInput.value.trim());

      if (isNameValid && isCompanyValid && isEmailValid) {
        modalCatStatus.className = 'form-status-alert success';
        modalCatStatus.innerHTML = '<strong>Credentials Verified.</strong> Generating technical catalogue download...';
        modalCatStatus.style.display = 'block';

        setTimeout(() => {
          // Trigger the programmatically generated PDF download
          triggerDummyDownload(nameInput.value.trim(), companyInput.value.trim());

          modalCatStatus.className = 'form-status-alert success';
          modalCatStatus.innerHTML = '<strong>Success.</strong> Download started in your browser.';
          
          setTimeout(() => {
            modalCatForm.reset();
            modalCatStatus.style.display = 'none';
            if (catalogueModal) catalogueModal.close();
          }, 1500);

        }, 1200);
      } else {
        modalCatStatus.className = 'form-status-alert error';
        modalCatStatus.innerHTML = 'Please provide a valid name, business email, and company.';
        modalCatStatus.style.display = 'block';
      }
    });
  }

  // Programmatic Blob file download builder
  const triggerDummyDownload = (userName, companyName) => {
    // Creating text configuration to act as the B2B brochure
    const catalogContent = `=======================================================
ANITHA TRADING - PREMIUM GRANITE TECHNICAL SPECIFICATIONS
=======================================================
Prepared for: ${userName}
Company: ${companyName}
Timestamp: ${new Date().toLocaleString()}

Thank you for downloading our architectural granite catalogue. 
Direct exports are dispatched from Chennai Port, India.

-------------------------------------------------------
MATERIAL VARIETIES IN STOCK:
-------------------------------------------------------

1. ABSOLUTE BLACK
   - Density: 2.92 g/cm3
   - Compressive Strength: 220 MPa
   - Water Absorption: 0.12%
   - Recommended Finishes: Polished, Honed, Leathered
   - Best For: Luxury counter work, memorial monuments

2. IMPERIAL GOLD
   - Density: 2.68 g/cm3
   - Compressive Strength: 178 MPa
   - Water Absorption: 0.24%
   - Recommended Finishes: Polished, Flamed, Brushed
   - Best For: Feature walls, cladding accents, retail flooring

3. WHITE GALAXY
   - Density: 2.70 g/cm3
   - Compressive Strength: 190 MPa
   - Water Absorption: 0.18%
   - Recommended Finishes: Polished, Satin, Honed
   - Best For: Commercial facades, high-end residential tiling

4. STEEL GREY
   - Density: 2.74 g/cm3
   - Compressive Strength: 204 MPa
   - Water Absorption: 0.15%
   - Recommended Finishes: Polished, Flamed, Shot-Blasted
   - Best For: Exterior high-traffic paving, structural steps

-------------------------------------------------------
EXPORT & CRATE CONFIGURATION:
-------------------------------------------------------
- Slabs: Packaged in heavy wooden A-frames (approx. 7-8 bundles per 20ft container)
- Blocks: Loose raw blocks lashed with heavy steel cabling
- Compliance: ISO 9001:2015 QC protocols, ISPM-15 wood packaging certification
- Typical Port of Loading: Chennai Port, India

To receive a commercial wholesale quote, please submit your detailed gang-saw slab requirements or block counts via our direct B2B Inquiry form on our website.

=======================================================
Anitha Trading - Architectural Stone Exports
=======================================================`;

    const blob = new Blob([catalogContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'anitha_trading_granite_catalogue.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
});
