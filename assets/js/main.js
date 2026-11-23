const STEP_MS = 260;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};

function initThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => document.documentElement.dataset.theme ?? (systemDark.matches ? "dark" : "light");
  const sync = () => toggle.setAttribute("aria-pressed", String(currentTheme() === "dark"));

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storage.set("theme", next);
    sync();
  });

  systemDark.addEventListener("change", sync);
  sync();
}

function initRunner() {
  const runner = document.querySelector(".runner");
  const list = runner?.querySelector("[data-runner]");
  const summary = runner?.querySelector("[data-runner-summary]");
  const rerun = runner?.querySelector("[data-runner-rerun]");
  if (!runner || !list || !summary) return;

  const items = [...list.children];
  let timers = [];

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const run = () => {
    clearTimers();

    if (prefersReducedMotion.matches) {
      runner.classList.remove("is-running");
      return;
    }

    items.forEach((item) => item.classList.remove("is-done"));
    summary.classList.remove("is-done");
    runner.classList.add("is-running");
    if (rerun) rerun.disabled = true;

    items.forEach((item, index) => {
      timers.push(setTimeout(() => item.classList.add("is-done"), STEP_MS * (index + 1)));
    });

    timers.push(
      setTimeout(() => {
        summary.classList.add("is-done");
        runner.classList.remove("is-running");
        if (rerun) rerun.disabled = false;
      }, STEP_MS * (items.length + 1)),
    );
  };

  rerun?.addEventListener("click", run);
  run();
}

function initActiveSection() {
  const links = [...document.querySelectorAll(".site-nav a[href^='#']")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          links.forEach((link) => {
            if (link.getAttribute("href") === `#${entry.target.id}`) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initPrint() {
  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
}

function initYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

initThemeToggle();
initRunner();
initActiveSection();
initPrint();
initYear();
