/**
 * Final CTA Section: 3D Rocket Launch & Neon Exhaust Interaction
 */

export function initRocketSection() {
  const rocket = document.querySelector('.rocket-svg-asset');
  const launchBtn = document.getElementById('launch-cta-btn');
  const exhaust = document.querySelector('.rocket-exhaust-plume');

  if (!launchBtn || !rocket) return;

  launchBtn.addEventListener('mouseenter', () => {
    rocket.style.transform = 'translateY(-20px) scale(1.08)';
    if (exhaust) {
      exhaust.style.height = '120px';
      exhaust.style.filter = 'blur(6px)';
      exhaust.style.boxShadow = '0 0 40px #00f0ff, 0 0 70px rgba(0, 240, 255, 0.9)';
    }
  });

  launchBtn.addEventListener('mouseleave', () => {
    rocket.style.transform = '';
    if (exhaust) {
      exhaust.style.height = '';
      exhaust.style.filter = '';
      exhaust.style.boxShadow = '';
    }
  });

  // Attach button ripple effects across all .btn elements
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

      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
}
