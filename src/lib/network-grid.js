/**
 * Swirling Holographic 3D Data Network Grid
 * Enforcing PROJECT_RULES.md: Snappy, smooth, zero sluggish event listeners
 */
export function initNetworkGrid(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;
  let animationFrameId;
  let time = 0;

  const cols = 28;
  const rows = 20;
  const spacing = 58;

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function onMouseMove(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function render() {
    time += 0.015;
    // Smooth interpolation for mouse
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height * 0.38;
    const tilt = 0.58;

    const points = [];

    for (let r = 0; r < rows; r++) {
      const rowPoints = [];
      for (let c = 0; c < cols; c++) {
        const xOffset = (c - cols / 2) * spacing;
        const yOffset = (r - rows / 2) * spacing;

        // Wave elevation formula
        const distFromCenter = Math.hypot(xOffset, yOffset);
        const wave = Math.sin(distFromCenter * 0.018 - time * 1.8) * 22;
        const mouseDist = Math.hypot(originX + xOffset - mouseX, originY + yOffset * tilt - mouseY);
        const mouseElevation = Math.max(0, (260 - mouseDist) * 0.12);

        // Perspective 3D mapping
        const projX = originX + xOffset;
        const projY = originY + yOffset * tilt - wave - mouseElevation;

        rowPoints.push({ x: projX, y: projY, elevation: wave + mouseElevation });
      }
      points.push(rowPoints);
    }

    // Draw Grid Lines with Cyan and Gold accents
    ctx.lineWidth = 1;
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const pt = points[r][c];
        if (c === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.07 + (r / rows) * 0.18})`;
      ctx.stroke();
    }

    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const pt = points[r][c];
        if (r === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.07 + Math.sin((c / cols) * Math.PI) * 0.15})`;
      ctx.stroke();
    }

    // Draw Glowing Coordinate Nodes
    for (let r = 0; r < rows; r += 2) {
      for (let c = 0; c < cols; c += 2) {
        const pt = points[r][c];
        const isGold = (r + c) % 6 === 0;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isGold ? 2.5 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = isGold ? '#ffd15c' : '#00f0ff';
        ctx.shadowColor = isGold ? '#ffd15c' : '#00f0ff';
        ctx.shadowBlur = isGold ? 10 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    cancelAnimationFrame(animationFrameId);
  };
}
