/* =========================================================
   AURIS — hero particle reveal
   White particles fall, aimed at sampled points of the "AURIS"
   wordmark; once a particle reaches its target's y it snaps in
   place and stays lit. Unaimed particles fall continuously as
   ambient rain, before, during, and after the reveal.
   ========================================================= */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const WORD = "AURIS";
  const SAMPLE_STEP = 4; // px between sampled text pixels
  const AMBIENT_COUNT = 70;
  const REVEAL_FRAMES = 190; // ~3.2s at 60fps

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let unfilled = [];
  let perFrame = 1;
  let aimed = []; // particles en route to a specific target
  let ambient = []; // decorative continuous rain
  let settled = []; // points already lit
  let resizeTimer = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildTargets();
  }

  function buildTargets() {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");

    let fontSize = Math.min(width * 0.17, height * 0.4);
    fontSize = Math.max(46, Math.min(fontSize, 230));
    octx.font = "700 " + fontSize + "px 'Chakra Petch', sans-serif";
    let tw = octx.measureText(WORD).width;
    const maxW = width * 0.86;
    if (tw > maxW) {
      fontSize *= maxW / tw;
      octx.font = "700 " + fontSize + "px 'Chakra Petch', sans-serif";
    }

    const textY = height * 0.42;
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(WORD, width / 2, textY);

    const data = octx.getImageData(0, 0, width, height).data;
    const pts = [];
    for (let y = 0; y < height; y += SAMPLE_STEP) {
      for (let x = 0; x < width; x += SAMPLE_STEP) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] > 120) {
          pts.push({ x: x + (Math.random() - 0.5) * 2, y: y + (Math.random() - 0.5) * 2 });
        }
      }
    }
    // shuffle so the reveal doesn't fill in raster order
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    unfilled = pts;
    settled = [];
    aimed = [];
    perFrame = Math.max(1, Math.ceil(pts.length / REVEAL_FRAMES));
  }

  function spawnAmbient() {
    return {
      x: Math.random() * width,
      y: Math.random() * -height,
      vy: 1.1 + Math.random() * 1.6,
      r: 0.6 + Math.random() * 1.3,
      op: 0.25 + Math.random() * 0.35,
    };
  }

  for (let i = 0; i < AMBIENT_COUNT; i++) ambient.push(spawnAmbient());

  function releaseAimed() {
    for (let i = 0; i < perFrame && unfilled.length; i++) {
      const t = unfilled.pop();
      aimed.push({
        x: t.x,
        targetY: t.y,
        y: -20 - Math.random() * 260,
        vy: 3.4 + Math.random() * 2.2,
      });
    }
  }

  let shimmerT = 0;

  function tick() {
    ctx.clearRect(0, 0, width, height);
    releaseAimed();

    // ambient rain
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ambient.forEach((p) => {
      p.y += p.vy;
      if (p.y > height + 10) Object.assign(p, spawnAmbient(), { y: -10 });
      ctx.beginPath();
      ctx.globalAlpha = p.op;
      ctx.lineWidth = p.r;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y - p.r * 4);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // aimed particles falling toward the wordmark
    ctx.fillStyle = "#ffffff";
    for (let i = aimed.length - 1; i >= 0; i--) {
      const p = aimed[i];
      p.y += p.vy;
      if (p.y >= p.targetY) {
        settled.push({ x: p.x, y: p.targetY });
        aimed.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.globalAlpha = 0.85;
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // settled wordmark, with a slow shared shimmer
    shimmerT += 0.02;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255,0.55)";
    settled.forEach((p, i) => {
      const s = 0.75 + 0.25 * Math.sin(shimmerT + i * 0.35);
      ctx.globalAlpha = 0.75 + 0.25 * s;
      ctx.shadowBlur = 2.2 * s;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.35, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    requestAnimationFrame(tick);
  }

  resize();
  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    }, 180);
  });
})();
