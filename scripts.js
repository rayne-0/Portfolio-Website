/* =========================
   CLEAR HASH ON LOAD
========================= */
if (window.location.hash) {
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
}


/* =========================
   THEME CYCLER (4 THEMES)
========================= */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

const themes = ["dark", "light", "mint", "coffee"];
const themeIcons = {
  dark: "🌙",
  light: "☀️",
  mint: "🌿",
  coffee: "☕"
};

/* Get saved theme or default */
let currentTheme = localStorage.getItem("theme");
if (!themes.includes(currentTheme)) {
  currentTheme = "coffee";
}

/* =========================
   APPLY THEME (SINGLE SOURCE OF TRUTH)
========================= */
function applyTheme(theme) {
  currentTheme = theme;

  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (toggleBtn) {
    toggleBtn.textContent = themeIcons[theme];
    toggleBtn.setAttribute(
      "aria-label",
      `Switch theme (current: ${theme})`
    );
  }

  generatePixels();
}

/* =========================
   THEME BUTTON CLICK
========================= */
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const index = themes.indexOf(currentTheme);
    const nextIndex = (index + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  });
}

/* =========================
   PIXEL BACKGROUND STARS
========================= */
const pixelBg = document.querySelector(".pixel-bg");

function generatePixels() {
  if (!pixelBg) return;

  pixelBg.innerHTML = "";

  const lightLikeThemes = ["light", "mint"];
  const pixelCount = lightLikeThemes.includes(currentTheme) ? 25 : 45;

  for (let i = 0; i < pixelCount; i++) {
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
}

/* =========================
   CTA SCROLL
========================= */
const ctaBtn = document.getElementById("cta-btn");
if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth" });
  });
}

/* =========================
   SCROLL REVEAL
========================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll("section, .reveal")
  .forEach(el => observer.observe(el));

/* =========================
   INITIAL LOAD
========================= */
applyTheme(currentTheme);
