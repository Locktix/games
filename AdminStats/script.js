const limitInput = document.getElementById("limit-input");
const refreshButton = document.getElementById("refresh-btn");
const autoButton = document.getElementById("auto-btn");
const statusText = document.getElementById("status-text");

const totalEventsNode = document.getElementById("total-events");
const totalGamesNode = document.getElementById("total-games");
const totalTypesNode = document.getElementById("total-types");

const gameTableBody = document.getElementById("game-table-body");
const eventTableBody = document.getElementById("event-table-body");
const dayTableBody = document.getElementById("day-table-body");

let autoIntervalId = null;

const API_BASE = (function () {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length > 0 && parts[parts.length - 1].includes('.')) parts.pop();
  const up = parts.length > 0 ? '../'.repeat(parts.length) : '';
  return new URL((up || '') + 'api', window.location.href).href.replace(/\/$/, '');
})();

function setStatus(text) {
  statusText.textContent = text;
}

function formatDay(value) {
  if (!value) return "Inconnu";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "Inconnu";
}

function renderRows(container, entries) {
  container.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("tr");
    empty.innerHTML = '<td colspan="2">Aucune donnée</td>';
    container.appendChild(empty);
    return;
  }
  entries.forEach(([label, count]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${label}</td><td>${count}</td>`;
    container.appendChild(row);
  });
}

async function loadStats() {
  const limit = Math.max(50, Math.min(2000, Number(limitInput.value) || 500));
  setStatus("Chargement des événements...");

  try {
    const res = await fetch(`${API_BASE}/admin-stats.php?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const events = data.events || [];

    const byGame = new Map();
    const byType = new Map();
    const byDay = new Map();

    events.forEach((ev) => {
      const game = ev.game || "unknown";
      const type = ev.event_type || "unknown";
      const day = formatDay(ev.created_at);
      byGame.set(game, (byGame.get(game) || 0) + 1);
      byType.set(type, (byType.get(type) || 0) + 1);
      byDay.set(day, (byDay.get(day) || 0) + 1);
    });

    const sortDesc = (a, b) => b[1] - a[1];
    const sortDayDesc = (a, b) => String(b[0]).localeCompare(String(a[0]));

    const gamesEntries = [...byGame.entries()].sort(sortDesc);
    const typesEntries = [...byType.entries()].sort(sortDesc);
    const dayEntries = [...byDay.entries()].sort(sortDayDesc);

    totalEventsNode.textContent = String(events.length);
    totalGamesNode.textContent = String(gamesEntries.length);
    totalTypesNode.textContent = String(typesEntries.length);

    renderRows(gameTableBody, gamesEntries);
    renderRows(eventTableBody, typesEntries);
    renderRows(dayTableBody, dayEntries);

    setStatus(`Mise à jour OK (${events.length} événements).`);
  } catch (error) {
    console.error(error);
    setStatus(`Erreur: ${error?.message || error}`);
  }
}

function toggleAuto() {
  if (autoIntervalId) {
    clearInterval(autoIntervalId);
    autoIntervalId = null;
    autoButton.textContent = "Auto: OFF";
    setStatus("Auto-refresh arrêté.");
    return;
  }
  autoIntervalId = setInterval(loadStats, 10000);
  autoButton.textContent = "Auto: ON";
  setStatus("Auto-refresh actif (10s).");
}

refreshButton.addEventListener("click", loadStats);
autoButton.addEventListener("click", toggleAuto);

loadStats();
