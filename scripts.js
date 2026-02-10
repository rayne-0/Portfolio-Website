/* =========================
   THEME TOGGLE
========================= */
const toggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
}

toggleBtn?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  const newTheme = isLight ? "dark" : "light";

  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  toggleBtn.textContent = newTheme === "light" ? "🌙" : "☀️";
});

/* =========================
   CTA SCROLL
========================= */
document.getElementById("cta-btn")?.addEventListener("click", () => {
  document.getElementById("projects")
    .scrollIntoView({ behavior: "smooth" });
});

/* =========================
   PROJECT DATA
========================= */
const projects = [
  {
    title: "Portfolio Website",
    description: "Personal portfolio built with pure HTML, CSS, and JavaScript."
  },
  {
    title: "Interactive App",
    description: "Vanilla JS app with focus on performance and UX."
  },
  {
    title: "Landing Page",
    description: "High-conversion landing page with animations and polish."
  }
];

const grid = document.querySelector(".projects-grid");

projects.forEach(project => {
  const card = document.createElement("div");
  card.className = "project-card reveal";
  card.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>
  `;
  grid.appendChild(card);
});

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
