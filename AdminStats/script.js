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
const FALLBACK_GAME_COLLECTIONS = ["ActionVerite", "Shady", "TestPurete", "TuPrefere", "WhoAmI", "PianoTiles"];

function setStatus(text) {
  statusText.textContent = text;
}

function formatDay(value) {
  if (!value) return "Inconnu";
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString().slice(0, 10);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
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
  const db = window.GamesFirebase?.getDb?.();
  if (!db) {
    setStatus("Firebase indisponible. Vérifie la connexion/SDK.");
    return;
  }

  const limit = Math.max(50, Math.min(2000, Number(limitInput.value) || 500));
  const gameCollections = window.GamesFirebase?.getGames?.() || FALLBACK_GAME_COLLECTIONS;
  setStatus(`Chargement des événements (${gameCollections.length} jeux)...`);

  try {
    const snapshots = await Promise.all(
      gameCollections.map((gameName) =>
        db.collection(gameName).doc("meta").collection("gameEvents").orderBy("createdAt", "desc").limit(limit).get()
      )
    );

    const events = [];
    snapshots.forEach((snapshot, index) => {
      const gameName = gameCollections[index];
      snapshot.forEach((doc) => {
        const data = doc.data() || {};
        events.push({
          ...data,
          game: data.game || gameName,
        });
      });
    });

    events.sort((a, b) => {
      const aTime = typeof a.createdAt?.toDate === "function" ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const bTime = typeof b.createdAt?.toDate === "function" ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    const recentEvents = events.slice(0, limit);

    const byGame = new Map();
    const byType = new Map();
    const byDay = new Map();

    recentEvents.forEach((data) => {
      const game = data.game || "unknown";
      const type = data.eventType || "unknown";
      const day = formatDay(data.createdAt);

      byGame.set(game, (byGame.get(game) || 0) + 1);
      byType.set(type, (byType.get(type) || 0) + 1);
      byDay.set(day, (byDay.get(day) || 0) + 1);
    });

    const sortDesc = (a, b) => b[1] - a[1];
    const sortDayDesc = (a, b) => String(b[0]).localeCompare(String(a[0]));

    const gamesEntries = [...byGame.entries()].sort(sortDesc);
    const typesEntries = [...byType.entries()].sort(sortDesc);
    const dayEntries = [...byDay.entries()].sort(sortDayDesc);

    totalEventsNode.textContent = String(recentEvents.length);
    totalGamesNode.textContent = String(gamesEntries.length);
    totalTypesNode.textContent = String(typesEntries.length);

    renderRows(gameTableBody, gamesEntries);
    renderRows(eventTableBody, typesEntries);
    renderRows(dayTableBody, dayEntries);

    setStatus(`Mise à jour OK (${recentEvents.length} événements).`);
  } catch (error) {
    console.error(error);
    setStatus(`Erreur de lecture Firestore: ${error?.message || error}`);
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

  autoIntervalId = setInterval(() => {
    loadStats();
  }, 10000);

  autoButton.textContent = "Auto: ON";
  setStatus("Auto-refresh actif (10s).");
}

refreshButton.addEventListener("click", loadStats);
autoButton.addEventListener("click", toggleAuto);

loadStats();
