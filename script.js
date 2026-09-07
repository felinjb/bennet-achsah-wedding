document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("waxSeal");
  const hint = document.getElementById("hint");

  // Open Sequence Handler
  function triggerOpening() {
    if (!envelope.classList.contains("is-open")) {
      envelope.classList.add("is-open");
      createGoldSparkles();
    }
  }

  seal.addEventListener("click", (e) => {
    e.stopPropagation();
    triggerOpening();
  });

  envelope.addEventListener("click", () => {
    triggerOpening();
  });

  if (hint) {
    hint.addEventListener("click", () => {
      triggerOpening();
    });
  }

  // Real-time Countdown: September 19, 2026 at 10:30 AM IST (+05:30)
  const targetTime = new Date("2026-09-19T10:30:00+05:30").getTime();

  function updateCountdown() {
    const now = Date.now();
    const remaining = targetTime - now;

    if (remaining <= 0) {
      document.getElementById("d-val").textContent = "00";
      document.getElementById("h-val").textContent = "00";
      document.getElementById("m-val").textContent = "00";
      document.getElementById("s-val").textContent = "00";
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remaining % (1000 * 60)) / 1000);

    document.getElementById("d-val").textContent = String(days).padStart(2, "0");
    document.getElementById("h-val").textContent = String(hours).padStart(2, "0");
    document.getElementById("m-val").textContent = String(mins).padStart(2, "0");
    document.getElementById("s-val").textContent = String(secs).padStart(2, "0");
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Canvas Physics Sparkle / Gold Foil Burst
  const canvas = document.getElementById("sparkle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function syncCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", syncCanvasSize);
  syncCanvasSize();

  class GoldParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 1.5;
      this.speedX = (Math.random() - 0.5) * 9;
      this.speedY = (Math.random() - 1.1) * 9;
      this.gravity = 0.16;
      this.opacity = 1;
      this.hue = Math.random() * 15 + 40; // Warm gold spectrum
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.opacity -= this.decay;
    }

    render() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.opacity, 0);
      ctx.fillStyle = `hsl(${this.hue}, 85%, 60%)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#fadb7d";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createGoldSparkles() {
    const sealCoords = seal.getBoundingClientRect();
    const centerX = sealCoords.left + sealCoords.width / 2;
    const centerY = sealCoords.top + sealCoords.height / 2;

    for (let i = 0; i < 80; i++) {
      particles.push(new GoldParticle(centerX, centerY));
    }
    renderLoop();
  }

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].render();

      if (particles[i].opacity <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(renderLoop);
    }
  }
});
