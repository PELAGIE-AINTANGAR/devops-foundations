// En prod avec Traefik, tu utiliseras typiquement api.localhost.
// En dev “pur compose”, on laisse configurable via une variable globale.
const API_BASE = window.API_BASE || "http://api.localhost";

function setStatus(el, ok, label) {
  el.textContent = label + (ok ? " OK" : " DOWN");
  el.className = ok ? "ok" : "down";
}

async function ping(path) {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function refresh() {
  const backendEl = document.getElementById("backendStatus");
  const dbEl = document.getElementById("dbStatus");
  const cacheEl = document.getElementById("cacheStatus");
  const visitsEl = document.getElementById("visits");

  // Backend
  try {
    await ping("/health");
    setStatus(backendEl, true, "Backend:");
  } catch {
    setStatus(backendEl, false, "Backend:");
  }

  // DB
  try {
    await ping("/db");
    setStatus(dbEl, true, "Database:");
  } catch {
    setStatus(dbEl, false, "Database:");
  }

  // Cache + visits
  try {
    const data = await ping("/cache");
    setStatus(cacheEl, true, "Cache:");
    visitsEl.textContent = `Visits: ${data.visits}`;
  } catch {
    setStatus(cacheEl, false, "Cache:");
    visitsEl.textContent = "Visits: N/A";
  }
}

document.getElementById("refresh").addEventListener("click", refresh);

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const result = document.getElementById("contactResult");
  result.textContent = "Sending…";

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const r = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    result.textContent = "✅ Sent (check MailHog)";
    form.reset();
  } catch (err) {
    result.textContent = `❌ Failed: ${err.message}`;
  }
});

refresh();
