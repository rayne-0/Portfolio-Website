/* =========================
   THEME TOGGLE
========================= */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  if (toggleBtn) toggleBtn.textContent = savedTheme === "light" ? "🌙" : "☀️";
}

toggleBtn?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  const next = isLight ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  toggleBtn.textContent = next === "light" ? "🌙" : "☀️";
});

/* =========================
   CTA SCROLL
========================= */
document.getElementById("cta-btn")?.addEventListener("click", () => {
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
});

/* =========================
   SCROLL REVEAL
========================= */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll("section, .reveal")
  .forEach(el => observer.observe(el));

/* =========================
   PIXEL BACKGROUND STARS
========================= */
const pixelBg = document.querySelector(".pixel-bg");
const isLightMode = root.getAttribute("data-theme") === "light";
const PIXEL_COUNT = isLightMode ? 25 : 45;

for (let i = 0; i < PIXEL_COUNT; i++) {
  const pixel = document.createElement("div");
  pixel.className = "pixel";

  const size = Math.random() > 0.7 ? 4 : 3;
  pixel.style.width = `${size}px`;
  pixel.style.height = `${size}px`;
  pixel.style.left = `${Math.random() * 100}%`;
  pixel.style.top = `${Math.random() * 100}%`;
  pixel.style.animationDuration = `${20 + Math.random() * 30}s`;
  pixel.style.animationDelay = `${Math.random() * 10}s`;

  pixelBg.appendChild(pixel);
}
