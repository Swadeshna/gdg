/**
 * Google Developer Groups (GDG) - Community Members Page Controller
 * Handles client-side category filtering, real-time search, and interactive actions.
 * Enforcing PROJECT_RULES.md: Zero em dashes, zero emojis, snappy response.
 */

export function initMembersDirectory() {
  const searchInput = document.getElementById('member-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const memberCards = document.querySelectorAll('.member-detail-card');
  const noResultsBlock = document.getElementById('no-members-found');

  let activeTrack = 'all';
  let searchQuery = '';

  function filterMembers() {
    let visibleCount = 0;

    memberCards.forEach(card => {
      const cardTrack = card.getAttribute('data-track') || '';
      const cardName = (card.querySelector('.member-full-name')?.textContent || '').toLowerCase();
      const cardRole = (card.querySelector('.member-role-title')?.textContent || '').toLowerCase();
      const cardBio = (card.querySelector('.member-bio-text')?.textContent || '').toLowerCase();
      const cardTags = (card.querySelector('.member-tags-container')?.textContent || '').toLowerCase();

      const matchesTrack = activeTrack === 'all' || cardTrack === activeTrack;
      const matchesSearch = !searchQuery ||
        cardName.includes(searchQuery) ||
        cardRole.includes(searchQuery) ||
        cardBio.includes(searchQuery) ||
        cardTags.includes(searchQuery);

      if (matchesTrack && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsBlock) {
      noResultsBlock.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Filter button handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTrack = this.getAttribute('data-filter') || 'all';
      filterMembers();
    });
  });

  // Search input handler with instant input responsiveness
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value.trim().toLowerCase();
      filterMembers();
    });
  }

  // Button ripple feedback
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => { ripple.remove(); }, 500);
    });
  });
}

// Auto-run if executed in browser context
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMembersDirectory);
} else {
  initMembersDirectory();
}
