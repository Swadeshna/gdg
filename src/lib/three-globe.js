/**
 * Holographic 3D Interactive Globe
 * Renders rotating 3D Earth with glowing pins, light trail arcs, and interactive selection.
 */
export function initHolographicGlobe(canvasId, onSelectEvent) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement.clientWidth || 450);
  let height = (canvas.height = canvas.parentElement.clientHeight || 450);

  let rotationY = 0;
  let rotationX = 0.22;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let animId;

  const globeRadius = Math.min(width, height) * 0.38;

  // Global Event Locations (Latitude, Longitude in degrees)
  const events = [
    {
      id: 'sf',
      title: 'GDG Global Cloud & AI Summit',
      city: 'Mountain View, CA',
      date: 'Nov 14, 2026',
      time: '10:00 AM PST',
      venue: 'Google Tech Corners & Online',
      lat: 37.422,
      lon: -122.084,
      isPrimary: true
    },
    {
      id: 'lon',
      title: 'DevFest London: Mobile & Web',
      city: 'London, UK',
      date: 'Dec 02, 2026',
      time: '09:30 AM GMT',
      venue: 'Kings Cross Campus',
      lat: 51.5074,
      lon: -0.1278
    },
    {
      id: 'blr',
      title: 'DevFest Bengaluru: Scalable Systems',
      city: 'Bengaluru, India',
      date: 'Dec 12, 2026',
      time: '10:00 AM IST',
      venue: 'Convention Hall & Stream',
      lat: 12.9716,
      lon: 77.5946
    },
    {
      id: 'tyo',
      title: 'GDG Tokyo: On-Device Intelligence',
      city: 'Tokyo, Japan',
      date: 'Jan 18, 2027',
      time: '13:00 JST',
      venue: 'Roppongi Hills Hall',
      lat: 35.6762,
      lon: 139.6503
    },
    {
      id: 'zrh',
      title: 'GDG Zurich: AI Security & Systems',
      city: 'Zurich, Switzerland',
      date: 'Feb 05, 2027',
      time: '14:00 CET',
      venue: 'Europaallee Tech Hub',
      lat: 47.3769,
      lon: 8.5417
    }
  ];

  // Generate longitude/latitude grid points simulating Earth continents & matrix
  const spherePoints = [];
  const latSteps = 30;
  const lonSteps = 50;

  for (let i = 0; i < latSteps; i++) {
    const lat = ((i / (latSteps - 1)) * 180 - 90) * (Math.PI / 180);
    const y = Math.sin(lat) * globeRadius;
    const rRing = Math.cos(lat) * globeRadius;

    for (let j = 0; j < lonSteps; j++) {
      const lon = ((j / lonSteps) * 360) * (Math.PI / 180);
      const x = Math.cos(lon) * rRing;
      const z = Math.sin(lon) * rRing;

      // Density filter to create continent-like clustering
      const continentNoise = Math.sin(lat * 3) * Math.cos(lon * 2) + Math.sin(lat * 5 + lon * 3);
      if (continentNoise > -0.2) {
        spherePoints.push({ x0: x, y0: y, z0: z, origLat: lat, origLon: lon });
      }
    }
  }

  function handleResize() {
    width = canvas.width = canvas.parentElement.clientWidth || 450;
    height = canvas.height = canvas.parentElement.clientHeight || 450;
  }

  window.addEventListener('resize', handleResize, { passive: true });

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    rotationY += deltaX * 0.006;
    rotationX = Math.max(-0.8, Math.min(0.8, rotationX + deltaY * 0.006));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  // Touch support for mobile responsiveness
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    rotationY += deltaX * 0.006;
    rotationX = Math.max(-0.8, Math.min(0.8, rotationX + deltaY * 0.006));
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
  }, { passive: true });

  function rotate3D(x, y, z) {
    // Rotation around X axis
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    // Rotation around Y axis
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    return { x: x2, y: y1, z: z2 };
  }

  function getEventCoords(ev) {
    const phi = (90 - ev.lat) * (Math.PI / 180);
    const theta = (ev.lon + 180) * (Math.PI / 180);
    const x = -globeRadius * Math.sin(phi) * Math.cos(theta);
    const y = globeRadius * Math.cos(phi);
    const z = globeRadius * Math.sin(phi) * Math.sin(theta);
    return rotate3D(x, y, z);
  }

  let arcProgress = 0;

  function renderGlobe() {
    if (!isDragging) {
      rotationY += 0.004; // Smooth continuous auto-spin
    }
    arcProgress = (arcProgress + 0.008) % 1;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Atmosphere Outer Glow
    const gradient = ctx.createRadialGradient(centerX, centerY, globeRadius * 0.7, centerX, centerY, globeRadius * 1.25);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
    gradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, globeRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Holographic Mesh Dots
    for (let i = 0; i < spherePoints.length; i++) {
      const p = spherePoints[i];
      const r = rotate3D(p.x0, p.y0, p.z0);

      // Back-face culling with soft gradient
      if (r.z > -globeRadius * 0.25) {
        const screenX = centerX + r.x;
        const screenY = centerY + r.y;
        const depthAlpha = (r.z + globeRadius) / (globeRadius * 2);
        const alpha = Math.max(0.08, Math.min(0.85, depthAlpha * 0.7));

        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      }
    }

    // Calculate Projected Pin Locations
    const projectedEvents = events.map(ev => ({
      ...ev,
      proj: getEventCoords(ev)
    }));

    // Draw Light Trails / Great Circle Arcs connecting SF to other hubs
    const sfEvent = projectedEvents[0];
    for (let k = 1; k < projectedEvents.length; k++) {
      const target = projectedEvents[k];
      if (sfEvent.proj.z > -100 || target.proj.z > -100) {
        ctx.beginPath();
        const p1x = centerX + sfEvent.proj.x;
        const p1y = centerY + sfEvent.proj.y;
        const p2x = centerX + target.proj.x;
        const p2y = centerY + target.proj.y;

        // Elevated control point for 3D curved arc
        const midX = (p1x + p2x) / 2;
        const midY = (p1y + p2y) / 2 - 40;

        ctx.moveTo(p1x, p1y);
        ctx.quadraticCurveTo(midX, midY, p2x, p2y);
        ctx.strokeStyle = 'rgba(255, 209, 92, 0.28)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsing Light Pulse along the arc
        const t = (arcProgress + k * 0.25) % 1;
        const pulseX = (1 - t) * (1 - t) * p1x + 2 * (1 - t) * t * midX + t * t * p2x;
        const pulseY = (1 - t) * (1 - t) * p1y + 2 * (1 - t) * t * midY + t * t * p2y;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd15c';
        ctx.shadowColor = '#ffd15c';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Render Event Pins
    projectedEvents.forEach((ev) => {
      if (ev.proj.z > -40) {
        const pinX = centerX + ev.proj.x;
        const pinY = centerY + ev.proj.y;

        // Glowing outer ripple
        ctx.beginPath();
        ctx.arc(pinX, pinY, 7 + Math.sin(Date.now() * 0.005) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = ev.isPrimary ? 'rgba(255, 209, 92, 0.6)' : 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center Pin
        ctx.beginPath();
        ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
        ctx.fillStyle = ev.isPrimary ? '#ffd15c' : '#00f0ff';
        ctx.shadowColor = ev.isPrimary ? '#ffd15c' : '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    animId = requestAnimationFrame(renderGlobe);
  }

  renderGlobe();

  // Handle click on canvas to select nearest visible event
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - width / 2;
    const clickY = e.clientY - rect.top - height / 2;

    const projectedEvents = events.map(ev => ({
      ...ev,
      proj: getEventCoords(ev)
    }));

    for (const ev of projectedEvents) {
      if (ev.proj.z > 0) {
        const dist = Math.hypot(ev.proj.x - clickX, ev.proj.y - clickY);
        if (dist < 24) {
          if (onSelectEvent) onSelectEvent(ev);
          break;
        }
      }
    }
  });

  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animId);
  };
}
