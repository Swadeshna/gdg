/**
 * GDG Memories: Interactive 3D Curved Photo Carousel
 * Features cylindrical perspective depth, natural fluid transitions,
 * zero-cross wrap suppression, looping autoplay, pause-on-hover, and dot navigation.
 * Enforcing PROJECT_RULES.md: Zero em dashes, zero emojis, structural 4px-8px styling.
 */

export function initCurvedCarousel(carouselId) {
  const container = document.getElementById(carouselId);
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.carousel-slide'));
  if (slides.length === 0) return;

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  let currentIndex = 0;
  let autoplayTimer = null;
  let isHovered = false;
  const AUTOPLAY_INTERVAL = 3400; // 3.4 seconds between slides

  // Generate indicator dots dynamically if container exists
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Navigate to memory slide ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(idx);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  function updateCarousel() {
    const total = slides.length;

    slides.forEach((slide, i) => {
      let offset = (i - currentIndex) % total;

      // Handle shortest circular path
      if (offset > Math.floor(total / 2)) {
        offset -= total;
      } else if (offset < -Math.floor(total / 2)) {
        offset += total;
      }

      const prevPosAttr = slide.getAttribute('data-pos');
      const prevPos = prevPosAttr !== null ? parseInt(prevPosAttr, 10) : offset;
      const newPos = offset;

      // Prevent wrapping slides from gliding visibly across the center
      if (Math.abs(prevPos - newPos) > 2) {
        slide.classList.add('no-transition');
        slide.setAttribute('data-pos', newPos.toString());
        // Force synchronous layout recalculation
        void slide.offsetWidth;
        requestAnimationFrame(() => {
          slide.classList.remove('no-transition');
        });
      } else {
        slide.setAttribute('data-pos', newPos.toString());
      }

      // Accessibility states
      slide.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
    });

    updateDots();
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function goTo(idx) {
    currentIndex = ((idx % slides.length) + slides.length) % slides.length;
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isHovered) {
      autoplayTimer = setInterval(() => {
        goNext();
      }, AUTOPLAY_INTERVAL);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Navigation button handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goNext();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goPrev();
      restartAutoplay();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      goNext();
      restartAutoplay();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
      restartAutoplay();
    }
  });

  // Touch swipe support with horizontal intent verification
  let touchStartX = 0;
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAutoplay();
    }
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) goNext();
        else goPrev();
      }
    }
    startAutoplay();
  }, { passive: true });

  // Direct click on adjacent cards to bring them into center focus
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (currentIndex !== idx) {
        goTo(idx);
        restartAutoplay();
      }
    });
  });

  // Pause on hover, resume on mouse leave
  container.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoplay();
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    startAutoplay();
  });

  // Pause autoplay when document tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (!isHovered) {
      startAutoplay();
    }
  });

  // Initial render and start autoplay
  updateCarousel();
  startAutoplay();

  return {
    goNext,
    goPrev,
    goTo,
    startAutoplay,
    stopAutoplay
  };
}
