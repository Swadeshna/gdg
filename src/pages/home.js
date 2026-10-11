import { initNetworkGrid } from '../lib/network-grid.js';
import { initHolographicGlobe } from '../lib/three-globe.js';
import { initCurvedCarousel } from '../components/carousel.js';
import { initTimeline } from '../components/timeline.js';
import { initRocketSection } from '../components/rocket.js';
import { initNavigation } from '../components/navigation.js';

function initializeApp() {
  // Initialize Background Holographic Grid
  initNetworkGrid('hero-grid-canvas');

  // Initialize Holographic 3D Globe with Interactive Detail Updates
  const eventTitle = document.getElementById('selected-event-title');
  const eventCity = document.getElementById('selected-event-city');
  const eventDate = document.getElementById('selected-event-date');
  const eventTime = document.getElementById('selected-event-time');
  const eventVenue = document.getElementById('selected-event-venue');

  initHolographicGlobe('globe-canvas', (ev) => {
    if (eventTitle) eventTitle.textContent = ev.title;
    if (eventCity) eventCity.textContent = ev.city;
    if (eventDate) eventDate.textContent = ev.date;
    if (eventTime) eventTime.textContent = ev.time;
    if (eventVenue) eventVenue.textContent = ev.venue;
  });

  // Initialize 3D Curved Photo Carousel
  initCurvedCarousel('memories-carousel');

  // Initialize Timeline, Rocket, and Navigation Modules
  initTimeline();
  initRocketSection();
  initNavigation();
}

// Ensure execution regardless of script load timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
