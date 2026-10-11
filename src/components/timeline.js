/**
 * Timeline of Excellence: 3D Metallic Ribbon & Milestone Nodes
 * Features glowing 3D nodes and unfurling interactive detail cards.
 */

export function initTimeline() {
  const cards = document.querySelectorAll('.timeline-node-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}
