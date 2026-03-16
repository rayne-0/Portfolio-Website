/* =================================================
   CLEANUP & INITIALIZATION
================================================= */
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname);
}

/* =================================================
   THEME TOGGLE
================================================= */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

// Default to dark theme, but allow toggle to light
let currentTheme = localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
  currentTheme = theme;
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (toggleBtn) {
    const iconMoon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    const iconSun = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    
    toggleBtn.innerHTML = theme === 'dark' ? iconSun : iconMoon;
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}
applyTheme(currentTheme);

/* =================================================
   DYNAMIC CURSOR BLOB
================================================= */
const blob = document.querySelector('.blob-cursor');

if (blob && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener('mousemove', (e) => {
    // We use a slight delay for a smooth trailing effect using CSS transition
    blob.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  });
}

/* =================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
================================================= */
const fadeElements = document.querySelectorAll('.fade-in-section');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Optional: unobserve after fading in if you don't want it to repeat
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));


/* =================================================
   SMOOTH SCROLL FOR BUTTONS
================================================= */
const ctaBtn = document.getElementById("cta-btn");
ctaBtn?.addEventListener("click", () => {
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if(this.getAttribute('href') === '#') return;
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});


/* =================================================
   TECHNOLOGIES MARQUEE
================================================= */
const techStack = [
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" }
];

function populateMarquee() {
  const track1 = document.getElementById('tech-track-1');
  const track2 = document.getElementById('tech-track-2');
  
  if(!track1 || !track2) return;

  const buildHTML = () => techStack.map(tech => `
    <div class="tech-item">
      <div class="tech-icon-wrapper">
        <img src="${tech.icon}" alt="${tech.name}">
      </div>
      <span>${tech.name}</span>
    </div>
  `).join('');

  const htmlContent = buildHTML();
  track1.innerHTML = htmlContent;
  track2.innerHTML = htmlContent;
}

populateMarquee();

/* =================================================
   ADMIN SYSTEM & PROJECTS LOGIC
================================================= */
const ADMIN_PASSWORD = "admin"; // Simplified for demo purposes

const loginModal = document.getElementById("login-modal");
const adminMenuModal = document.getElementById("admin-menu-modal");
const addProjectModal = document.getElementById("add-project-modal");

const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const adminPasswordInput = document.getElementById("admin-password");
const closeLoginBtn = document.getElementById("close-login");
const closeAdminBtn = document.getElementById("close-admin");

const openAddProjectBtn = document.getElementById("open-add-project");
const manageProjectsBtn = document.getElementById("manage-projects");
const adminLogoutBtn = document.getElementById("admin-logout");

const saveProjectBtn = document.getElementById("save-project-btn");
const cancelProjectBtn = document.getElementById("cancel-project-btn");
const projectsGrid = document.getElementById("projects-grid");

let isAdmin = sessionStorage.getItem("isAdmin") === "true";
let manageMode = false;
let editingProjectId = null;

// Dummy initial data if none exists
const initialProjectsTemplate = [
  {
    id: "uuid-1",
    title: "E-Commerce Platform",
    shortDesc: "Full-stack digital storefront.",
    fullDesc: "A complete modern e-commerce solution with Next.js and Stripe.",
    github: "https://github.com",
    live: "https://example.com",
    tech: ["Next.js", "TypeScript", "Tailwind", "Stripe"],
    featured: true,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
  },
  {
    id: "uuid-2",
    title: "AI Dashboard",
    shortDesc: "Real-time analytics monitor.",
    fullDesc: "Data visualization utilizing WebSockets and advanced charting libraries.",
    github: "https://github.com",
    live: "https://example.com",
    tech: ["React", "D3.js", "Node.js", "Socket.io"],
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  }
];

if (!localStorage.getItem("projects")) {
  localStorage.setItem("projects", JSON.stringify(initialProjectsTemplate));
}

/* --- OPEN ADMIN MENU (RE-ENTRY) --- */
document.addEventListener("keydown", e => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    if (isAdmin) {
      adminMenuModal?.classList.remove("hidden");
    } else {
      loginModal?.classList.remove("hidden");
      adminPasswordInput?.focus();
    }
  }
});

closeLoginBtn?.addEventListener("click", () => {
  loginModal?.classList.add("hidden");
});

closeAdminBtn?.addEventListener("click", () => {
    adminMenuModal?.classList.add("hidden");
});

/* --- LOGIN --- */
loginBtn?.addEventListener("click", () => {
  if (!adminPasswordInput) return;

  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem("isAdmin", "true");
    isAdmin = true;
    loginModal.classList.add("hidden");
    adminMenuModal.classList.remove("hidden");
    loginError.textContent = "";
    adminPasswordInput.value = "";
    renderAllProjects();
  } else {
    loginError.textContent = "Access Denied.";
  }
});

/* --- LOGOUT --- */
adminLogoutBtn?.addEventListener("click", () => {
  sessionStorage.removeItem("isAdmin");
  isAdmin = false;
  manageMode = false;
  adminMenuModal.classList.add("hidden");
  renderAllProjects();
});

/* --- OPEN ADD PROJECT --- */
openAddProjectBtn?.addEventListener("click", () => {
  editingProjectId = null;
  clearProjectForm();
  adminMenuModal.classList.add("hidden");
  addProjectModal.classList.remove("hidden");
});

cancelProjectBtn?.addEventListener("click", () => {
  addProjectModal.classList.add("hidden");
  adminMenuModal.classList.remove("hidden");
});

/* --- MANAGE PROJECTS (TOGGLE EDIT/DELETE) --- */
manageProjectsBtn?.addEventListener("click", () => {
  manageMode = !manageMode;
  manageProjectsBtn.textContent = manageMode ? "Disable Management Protocol" : "Toggle Management Protocol";
  manageProjectsBtn.className = manageMode ? "btn btn-outline w-full text-danger border-danger" : "btn btn-outline w-full";
  renderAllProjects();
});

/* =================================================
   STORAGE HELPERS
================================================= */
function getStoredProjects() {
  return JSON.parse(localStorage.getItem("projects")) || [];
}

function setStoredProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function isValidURL(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/* =================================================
   PROJECT RENDERING
================================================= */
function renderAllProjects() {
  if (!projectsGrid) return;
  const stored = getStoredProjects();
  projectsGrid.innerHTML = "";
  stored.forEach(renderProject);
}

function renderProject(project) {
  const card = document.createElement("div");
  card.className = "project-card glass-card fade-in-section is-visible";

  const techHTML = (project.tech || [])
    .map(t => `<span class="tech-badge">${escapeHTML(t)}</span>`)
    .join("");

  const githubLink = project.github && isValidURL(project.github)
    ? `<a href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        Source
       </a>`
    : "";

  const liveLink = project.live && isValidURL(project.live)
    ? `<a href="${escapeHTML(project.live)}" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
       </a>`
    : "";

  const adminControls = isAdmin && manageMode
    ? `
      <div class="admin-controls">
        <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" data-edit="${project.id}">Edit</button>
        <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" data-delete="${project.id}">Delete</button>
      </div>
    `
    : "";

  const imageHTML = project.image && isValidURL(project.image)
      ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}" loading="lazy">`
      : `<div class="project-image-placeholder">No Asset</div>`;

  card.innerHTML = `
    <div class="project-image-wrapper">
      ${imageHTML}
    </div>
    <div class="project-content">
      <h3 class="project-title">${escapeHTML(project.title)}</h3>
      <p class="project-desc">${escapeHTML(project.shortDesc)}</p>
      
      <div class="project-tech">${techHTML}</div>
      <div class="project-links">${githubLink}${liveLink}</div>
      
      ${adminControls}
    </div>
  `;

  projectsGrid.appendChild(card);
}

/* =================================================
   EDIT / DELETE HANDLING
================================================= */
projectsGrid?.addEventListener("click", (e) => {
  const deleteId = e.target.getAttribute("data-delete");
  const editId = e.target.getAttribute("data-edit");

  if (deleteId && isAdmin && manageMode) {
    if(confirm("Are you sure you want to purge this entity?")) {
        const filtered = getStoredProjects().filter(p => p.id !== deleteId);
        setStoredProjects(filtered);
        renderAllProjects();
    }
  }

  if (editId && isAdmin && manageMode) {
    const project = getStoredProjects().find(p => p.id === editId);
    if (!project) return;

    editingProjectId = editId;
    fillProjectForm(project);

    addProjectModal.classList.remove("hidden");
    adminMenuModal.classList.add("hidden");
  }
});

/* =================================================
   SAVE PROJECT
================================================= */
saveProjectBtn?.addEventListener("click", () => {
  if (!isAdmin) return;

  const projectData = {
    id: editingProjectId || crypto.randomUUID(),
    title: document.getElementById("project-title")?.value.trim(),
    shortDesc: document.getElementById("project-short")?.value.trim(),
    fullDesc: document.getElementById("project-full")?.value.trim(),
    github: document.getElementById("project-github")?.value.trim(),
    live: document.getElementById("project-live")?.value.trim(),
    tech: document.getElementById("project-tech")?.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean),
    featured: document.getElementById("project-featured")?.checked,
    image: document.getElementById("project-image")?.value.trim(),
  };

  if (!projectData.title || !projectData.shortDesc) {
      alert("Title and Short Desc are required entities.");
      return;
  }

  let stored = getStoredProjects();

  if (editingProjectId) {
    stored = stored.map(p => p.id === editingProjectId ? projectData : p);
  } else {
    stored.push(projectData);
  }

  setStoredProjects(stored);
  editingProjectId = null;

  addProjectModal.classList.add("hidden");
  adminMenuModal.classList.remove("hidden");
  renderAllProjects();
});

/* =================================================
   FORM HELPERS
================================================= */
function fillProjectForm(project) {
  document.getElementById("project-title").value = project.title || "";
  document.getElementById("project-short").value = project.shortDesc || "";
  document.getElementById("project-full").value = project.fullDesc || "";
  document.getElementById("project-github").value = project.github || "";
  document.getElementById("project-live").value = project.live || "";
  document.getElementById("project-tech").value = (project.tech || []).join(", ");
  document.getElementById("project-image").value = project.image || "";
  document.getElementById("project-featured").checked = project.featured || false;
}

function clearProjectForm() {
  fillProjectForm({});
}

/* =================================================
   ESCAPE HTML (SECURITY)
================================================= */
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =================================================
   INIT RENDERING
================================================= */
document.addEventListener('DOMContentLoaded', () => {
    renderAllProjects();
});