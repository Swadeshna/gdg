/**
 * Site Navigation & Active Scroll-Spy Controller
 * Handles header smooth scrolling with offset compensation and dynamic active indicator tracking.
 * Enforcing PROJECT_RULES.md: Zero em dashes, zero emojis, snappy response.
 */

export function initNavigation() {
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const headerOffset = 90;

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElem = document.getElementById(targetId);
        if (targetElem) {
          e.preventDefault();
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');

          const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, targetPosition - headerOffset),
            behavior: 'smooth'
          });

          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, href);
          }
        }
      }
    });
  });

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset + headerOffset + 60;
    let activeSectionId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSectionId = section.getAttribute('id');
      }
    });

    if (activeSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + activeSectionId) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Handle direct hash navigation on initial load
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, targetPos - headerOffset),
          behavior: 'smooth'
        });
        const hashLink = document.querySelector(`.main-nav a[href="${window.location.hash}"]`);
        if (hashLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          hashLink.classList.add('active');
        }
      }
    }, 150);
  }
}
