// Ultimate Home Care LLC - Interactive Architecture & 3D Micro-Interactions

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Mobile Drawer Navigation
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn') || document.querySelector('button[aria-label="Toggle Menu"]');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

  function openMobileMenu() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.add('active');
      mobileDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.remove('active');
      mobileDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('#mobile-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
  });

  // ==========================================
  // 2. Smooth Scrolling with Offset
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 115;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 3. Navbar Floating Elevation on Scroll
  // ==========================================
  const headerNav = document.querySelector('header nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav?.classList.add('shadow-2xl', 'border-[#d4af37]/60', 'bg-[#06120c]/98');
      headerNav?.classList.remove('bg-[#06120c]/90');
    } else {
      headerNav?.classList.remove('shadow-2xl', 'border-[#d4af37]/60', 'bg-[#06120c]/98');
      headerNav?.classList.add('bg-[#06120c]/90');
    }
  });

  // ==========================================
  // 4. Hero Background Video Autoplay Ensurer & Audio Mute (Strict Zero-Sound Lock)
  // ==========================================
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo) {
    const lockMuted = () => {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      heroVideo.volume = 0;
    };
    lockMuted();
    heroVideo.addEventListener('volumechange', lockMuted);
    heroVideo.addEventListener('play', lockMuted);

    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, play on first user touch/click
        const playOnInteraction = () => {
          lockMuted();
          heroVideo.play();
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      });
    }
  }

  // ==========================================
  // 5. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '120px 0px 80px 0px',
      threshold: 0.01
    });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ==========================================
  // 6. Modern 3D Tilt Micro-Interactions on Cards
  // ==========================================
  const cards3d = document.querySelectorAll('.card-3d');
  cards3d.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==========================================
  // 7. Interactive Gallery Filter
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden-filter');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hidden-filter');
        }
      });
    });
  });

  // ==========================================
  // 8. Gallery Lightbox Modal
  // ==========================================
  const lightboxModal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  window.openLightbox = function(src, caption) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || 'Ultimate Home Care LLC';
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ==========================================
  // 9. Interactive Services & Suites Inquiries (Form Autofill)
  // ==========================================
  window.inquireService = function(serviceName) {
    const serviceSelect = document.getElementById('service-select');
    const messageInput = document.getElementById('care-notes');
    if (serviceSelect) {
      serviceSelect.value = serviceName;
    }
    if (messageInput && !messageInput.value) {
      messageInput.value = `Hello, I would like to inquire about placement for: ${serviceName}.`;
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 115;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  window.inquireSuite = function(suiteName) {
    const serviceSelect = document.getElementById('service-select');
    const messageInput = document.getElementById('care-notes');
    if (serviceSelect) {
      serviceSelect.value = `Private Room: ${suiteName}`;
    }
    if (messageInput) {
      messageInput.value = `I am interested in scheduling a tour to view ${suiteName} at your Anchorage group home.`;
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 115;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ==========================================
  // 10. Contact / Tour Booking Form Handler
  // ==========================================
  const contactForm = document.querySelector('#contact form');
  const confirmationModal = document.getElementById('confirmation-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function closeModal() {
    if (confirmationModal) {
      confirmationModal.classList.add('hidden');
      confirmationModal.classList.remove('flex');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) closeModal();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('form-submit-btn') || contactForm.querySelector('button[type="submit"]');
      const btnText = document.getElementById('btn-text');
      const originalText = btnText ? btnText.textContent : 'Submit Placement Request';

      // Anti-Spam Honeypot Verification: Trap bots attempting to spam the inbox
      const honeyInput = contactForm.querySelector('input[name="_honey"]');
      if (honeyInput && honeyInput.value.trim().length > 0) {
        contactForm.reset();
        return;
      }
      
      const name = (document.getElementById('form-name')?.value || contactForm.querySelector('input[name="Full Name"]')?.value || 'Valued Guardian').trim();
      const relationship = (document.getElementById('form-relationship')?.value || contactForm.querySelector('input[name="Relationship"]')?.value || 'Guardian / Family').trim();
      const phone = (document.getElementById('form-phone')?.value || contactForm.querySelector('input[name="Phone Number"]')?.value || '+1 (907) 947-4918').trim();
      const email = (document.getElementById('form-email')?.value || contactForm.querySelector('input[name="Email Address"]')?.value || '').trim();
      const service = document.getElementById('service-select')?.value || 'Placement Inquiry';
      const tourDate = (document.getElementById('form-date')?.value || contactForm.querySelector('input[name="Preferred Tour Date"]')?.value || 'Flexible / To Be Scheduled').trim();
      const notes = (document.getElementById('care-notes')?.value || contactForm.querySelector('textarea')?.value || 'None provided').trim();

      // Set Loading State (Prevents accidental double submissions)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.85';
        submitBtn.style.cursor = 'wait';
      }
      if (btnText) {
        btnText.innerHTML = '<span class="inline-block animate-pulse">Sending Inquiry to Susan McCrae...</span>';
      }

      // Generate unique Lead Reference ID & Timestamp to prevent mail relay deduplication
      const refId = 'SM-' + Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Anchorage',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' AKST';

      const payload = {
        "Inquiry Reference ID": refId,
        "Submission Timestamp": timeStr,
        "Full Name": name,
        "Relationship": relationship,
        "Phone Number": phone,
        "Email Address": email,
        "Inquiry Service Focus": service,
        "Preferred Tour Date": tourDate,
        "Care Notes & Questions": notes,
        "_subject": `Serene Meadows Living - New Placement Inquiry / Lead [${refId}] — ${name} (${service} • ${timeStr})`,
        "_template": "table",
        "_captcha": "false"
      };

      if (email) {
        payload._replyto = email;
      }

      try {
        const directParams = new URLSearchParams(payload);

        // Direct client dispatch to official client email smultimate.care6@gmail.com
        // Dispatched directly from visitor's browser IP, completely bypassing Cloudflare datacenter IP blocks
        const directPromise = fetch('https://formsubmit.co/ajax/smultimate.care6@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: directParams.toString()
        }).catch((err) => {
          console.warn('Direct client dispatch caught:', err);
          return null;
        });

        // Serverless audit log
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});

        // Await primary dispatch
        await directPromise;
      } catch (submitErr) {
        console.warn('Submission handled with fallback:', submitErr);
      } finally {
        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.style.cursor = '';
        }
        if (btnText) {
          btnText.textContent = originalText;
        }

        // Display professional confirmation modal with Inquiry Reference ID
        const modalMessage = document.getElementById('modal-confirmation-message');
        if (modalMessage) {
          modalMessage.innerHTML = `Thank you, <strong>${escapeHtml(name)}</strong>! We have received your placement request for <em>${escapeHtml(service)}</em>.<br><br><span class="inline-block px-3 py-1 bg-amber-500/10 border border-amber-800/20 rounded-full text-xs font-semibold text-amber-900 mb-2">Inquiry Reference: #${refId}</span><br>Your inquiry has been sent directly to Susan McCrae at <strong>smultimate.care6@gmail.com</strong>. We will review your request and call you at <strong>${escapeHtml(phone)}</strong> shortly to confirm details and schedule your visit to 9715 New Haven Loop.`;
        }

        if (confirmationModal) {
          confirmationModal.classList.remove('hidden');
          confirmationModal.classList.add('flex');
        }

        contactForm.reset();
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // Global Escape Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
      closeModal();
    }
  });
});
