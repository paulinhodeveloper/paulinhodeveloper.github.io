const STEP_MS = 320;
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
  const items = [...(runner?.querySelectorAll("[data-runner] li") ?? [])];
  const summary = runner?.querySelector("[data-runner-summary]");
  const rerun = runner?.querySelector("[data-runner-rerun]");
  if (!runner || !items.length || !summary) return;

  const total = items.length;
  let timers = [];

  const showProgress = (done) => {
    summary.dataset.state = "running";
    summary.textContent = `Executando ${done} de ${total}`;
  };

  const showResult = (elapsedMs) => {
    const passed = document.createElement("span");
    passed.textContent = `${total} passed`;
    summary.dataset.state = "passed";
    summary.replaceChildren(passed, ` (${(elapsedMs / 1000).toFixed(1)}s)`);
    runner.setAttribute("aria-busy", "false");
    if (rerun) rerun.disabled = false;
  };

  const run = () => {
    timers.forEach(clearTimeout);
    timers = [];

    const startedAt = performance.now();
    runner.setAttribute("aria-busy", "true");
    if (rerun) rerun.disabled = true;
    items.forEach((item) => {
      item.dataset.state = "pending";
    });
    showProgress(0);

    items.forEach((item, index) => {
      timers.push(
        setTimeout(() => {
          item.dataset.state = "running";
        }, STEP_MS * index),
      );
      timers.push(
        setTimeout(() => {
          item.dataset.state = "passed";
          showProgress(index + 1);
        }, STEP_MS * index + STEP_MS * 0.75),
      );
    });

    timers.push(setTimeout(() => showResult(performance.now() - startedAt), STEP_MS * total + 150));
  };

  rerun?.addEventListener("click", run);
  if (!prefersReducedMotion.matches) run();
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
  document.querySelector("[data-print]")?.addEventListener("click", () => {
    const pageTitle = document.title;
    document.title = "Curriculo - Paulo Henrique Santos Borges - Analista de QA";
    window.addEventListener("afterprint", () => (document.title = pageTitle), { once: true });
    window.print();
  });
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
