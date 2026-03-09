const GAME_NAME = "PianoTiles";
const LANE_COUNT = 4;
const TILE_HEIGHT_RATIO = 0.2;
const SPAWN_INTERVAL_START = 980;
const SPAWN_INTERVAL_MIN = 420;
const SPEED_START = 200;
const SPEED_STEP = 4;
const BEST_STORAGE_KEY = "piano_tiles_best_v1";
const NAME_STORAGE_KEY = "piano_tiles_name_v1";

const board = document.getElementById("board");
const tilesLayer = document.getElementById("tiles-layer");
const hitLine = document.getElementById("hit-line");
const scoreValue = document.getElementById("score-value");
const bestValue = document.getElementById("best-value");
const speedValue = document.getElementById("speed-value");
const comboValue = document.getElementById("combo-value");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startButton = document.getElementById("start-btn");
const statusNode = document.getElementById("status");
const judgementFeedback = document.getElementById("judgement-feedback");
const refreshTopButton = document.getElementById("refresh-top-btn");
const leaderboardList = document.getElementById("leaderboard-list");
const playerNameInput = document.getElementById("player-name");

const db = window.GamesFirebase?.getDb?.() || null;
const fieldValue = window.firebase?.firestore?.FieldValue;

const state = {
  running: false,
  score: 0,
  bestScore: Number(localStorage.getItem(BEST_STORAGE_KEY) || 0),
  tiles: [],
  tileId: 0,
  spawnTimer: 0,
  spawnInterval: SPAWN_INTERVAL_START,
  speed: SPEED_START,
  lastFrameTime: 0,
  startedAt: 0,
  canSaveScore: true,
  combo: 0,
  bonusLevel: 0,
};

const JUDGEMENTS = [
  {
    key: "perfect",
    label: "Perfect",
    className: "judgement-perfect",
    maxRatioDistance: 0.035,
    basePoints: 4,
    boostsCombo: true,
  },
  {
    key: "good",
    label: "Good",
    className: "judgement-good",
    maxRatioDistance: 0.09,
    basePoints: 3,
    boostsCombo: true,
  },
  {
    key: "not_good",
    label: "Not Good",
    className: "judgement-not-good",
    maxRatioDistance: 0.18,
    basePoints: 2,
    boostsCombo: false,
  },
  {
    key: "bad",
    label: "Bad",
    className: "judgement-bad",
    maxRatioDistance: Infinity,
    basePoints: 1,
    boostsCombo: false,
  },
];

function setStatus(text) {
  statusNode.textContent = text;
}

function trackEvent(eventType, payload = {}) {
  window.GamesFirebase?.trackEvent?.(GAME_NAME, eventType, payload);
}

function getPlayerName() {
  const value = String(playerNameInput.value || "").trim();
  return value.slice(0, 20);
}

function saveNameLocally() {
  const value = getPlayerName();
  if (value) {
    localStorage.setItem(NAME_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(NAME_STORAGE_KEY);
  }
}

function setOverlay(title, text, buttonText = "Rejouer") {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function boardRect() {
  return board.getBoundingClientRect();
}

function hitLineY(rect) {
  const lineBottomPct = 0.18;
  return rect.height * (1 - lineBottomPct);
}

function laneWidth(rect) {
  return rect.width / LANE_COUNT;
}

function tileHeight(rect) {
  return rect.height * TILE_HEIGHT_RATIO;
}

function updateHud() {
  scoreValue.textContent = String(state.score);
  bestValue.textContent = String(state.bestScore);
  const speedFactor = state.speed / SPEED_START;
  speedValue.textContent = `${speedFactor.toFixed(2)}x`;
  comboValue.textContent = String(state.combo);
}

function showJudgement(judgement, gainedPoints, bonusPoints) {
  if (!judgementFeedback) {
    return;
  }

  const bonusSuffix = bonusPoints > 0 ? ` (+${bonusPoints} bonus)` : "";
  judgementFeedback.textContent = `${judgement.label} +${gainedPoints}${bonusSuffix}`;
  judgementFeedback.className = `judgement-feedback ${judgement.className} show`;

  window.clearTimeout(showJudgement.timeoutId);
  showJudgement.timeoutId = window.setTimeout(() => {
    judgementFeedback.className = "judgement-feedback";
  }, 320);
}

showJudgement.timeoutId = 0;

function evaluateJudgement(tile, lineY, rectHeight) {
  const tileBottom = tile.y + tile.height;
  const ratioDistance = Math.abs(tileBottom - lineY) / rectHeight;
  return JUDGEMENTS.find((judgement) => ratioDistance <= judgement.maxRatioDistance) || JUDGEMENTS[JUDGEMENTS.length - 1];
}

function pointsFromJudgement(judgement) {
  if (judgement.boostsCombo) {
    state.combo += 1;
    state.bonusLevel = Math.min(6, state.bonusLevel + 1);
  } else {
    state.combo = 0;
    state.bonusLevel = 0;
  }

  const bonusPoints = judgement.boostsCombo ? Math.floor(state.bonusLevel / 2) : 0;
  const gainedPoints = judgement.basePoints + bonusPoints;
  return {
    gainedPoints,
    bonusPoints,
  };
}

function clearTiles() {
  state.tiles = [];
  tilesLayer.innerHTML = "";
}

function createTileElement() {
  const tileNode = document.createElement("div");
  tileNode.className = "tile";
  return tileNode;
}

function addTile() {
  const rect = boardRect();
  const lane = Math.floor(Math.random() * LANE_COUNT);
  const width = laneWidth(rect);
  const height = tileHeight(rect);

  const tileNode = createTileElement();
  tilesLayer.appendChild(tileNode);

  const tile = {
    id: ++state.tileId,
    lane,
    y: -height,
    width,
    height,
    node: tileNode,
    hit: false,
  };

  state.tiles.push(tile);
  placeTile(tile);
}

function placeTile(tile) {
  tile.node.style.left = `${tile.lane * tile.width}px`;
  tile.node.style.width = `${tile.width}px`;
  tile.node.style.height = `${tile.height}px`;
  tile.node.style.transform = `translateY(${tile.y}px)`;
}

function removeTile(tile) {
  tile.node.remove();
}

function startRun() {
  saveNameLocally();
  state.running = true;
  state.score = 0;
  state.spawnTimer = 0;
  state.spawnInterval = SPAWN_INTERVAL_START;
  state.speed = SPEED_START;
  state.lastFrameTime = 0;
  state.startedAt = performance.now();
  state.canSaveScore = true;
  state.combo = 0;
  state.bonusLevel = 0;
  clearTiles();
  hideOverlay();
  updateHud();
  setStatus("Partie en cours...");
  trackEvent("game_start", { mode: "classic" });
  requestAnimationFrame(tick);
}

function finishRun(reason) {
  if (!state.running) {
    return;
  }

  state.running = false;

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    localStorage.setItem(BEST_STORAGE_KEY, String(state.bestScore));
  }

  updateHud();

  const elapsedMs = Math.max(0, performance.now() - state.startedAt);
  const durationSeconds = Math.round(elapsedMs / 1000);

  setOverlay(
    "Game Over",
    `Raison: ${reason}. Score final: ${state.score}.`,
    "Rejouer"
  );
  setStatus("Partie terminée.");

  trackEvent("game_over", {
    reason,
    score: state.score,
    durationSeconds,
  });

  saveScore(state.score, durationSeconds, reason);
}

function adaptDifficulty() {
  state.speed = SPEED_START + state.score * SPEED_STEP;
  const reducedSpawn = Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - state.score * 8);
  state.spawnInterval = reducedSpawn;
}

function processTap(lane) {
  if (!state.running) {
    return;
  }

  const rect = boardRect();
  const lineY = hitLineY(rect);

  const candidates = state.tiles
    .filter((tile) => tile.lane === lane)
    .sort((left, right) => right.y - left.y);

  const target = candidates[0];

  if (!target) {
    finishRun("mauvaise case");
    return;
  }

  target.hit = true;
  state.tiles = state.tiles.filter((tile) => tile.id !== target.id);
  removeTile(target);

  const judgement = evaluateJudgement(target, lineY, rect.height);
  const { gainedPoints, bonusPoints } = pointsFromJudgement(judgement);
  state.score += gainedPoints;
  adaptDifficulty();
  updateHud();
  showJudgement(judgement, gainedPoints, bonusPoints);

  trackEvent("tile_hit", {
    judgement: judgement.key,
    gainedPoints,
    combo: state.combo,
  });

  if (state.score % 10 === 0) {
    trackEvent("score_milestone", { score: state.score });
  }
}

function laneFromClientX(clientX) {
  const rect = boardRect();
  const relativeX = Math.max(0, Math.min(rect.width - 1, clientX - rect.left));
  const lane = Math.floor(relativeX / laneWidth(rect));
  return Math.max(0, Math.min(LANE_COUNT - 1, lane));
}

function tick(timestamp) {
  if (!state.running) {
    return;
  }

  if (!state.lastFrameTime) {
    state.lastFrameTime = timestamp;
  }

  const deltaMs = Math.min(34, timestamp - state.lastFrameTime);
  state.lastFrameTime = timestamp;

  state.spawnTimer += deltaMs;
  if (state.spawnTimer >= state.spawnInterval) {
    state.spawnTimer = 0;
    addTile();
  }

  const rect = boardRect();
  const lineY = hitLineY(rect);
  const pixelsPerMs = state.speed / 1000;

  let hasMissed = false;

  state.tiles.forEach((tile) => {
    tile.y += pixelsPerMs * deltaMs;
    placeTile(tile);

    if (tile.y >= lineY + 8) {
      hasMissed = true;
    }
  });

  if (hasMissed) {
    finishRun("tuile ratée");
    return;
  }

  requestAnimationFrame(tick);
}

async function loadLeaderboard() {
  if (!db) {
    leaderboardList.innerHTML = "<li>Firebase indisponible.</li>";
    return;
  }

  setStatus("Chargement du top global...");

  try {
    const scoresRef = window.GamesFirebase?.getGameCollectionRef?.(GAME_NAME, "scores");
    if (!scoresRef) {
      throw new Error("Collection scores introuvable");
    }

    const snapshot = await scoresRef.orderBy("score", "desc").limit(5).get();
    const entries = [];

    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      entries.push({
        name: data.playerName || "Anonyme",
        score: Number(data.score) || 0,
      });
    });

    leaderboardList.innerHTML = "";

    if (!entries.length) {
      leaderboardList.innerHTML = "<li>Aucun score sauvegardé.</li>";
      setStatus("Top global vide.");
      return;
    }

    entries.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.score}`;
      leaderboardList.appendChild(item);
    });

    setStatus("Top global chargé.");
  } catch (error) {
    console.error(error);
    leaderboardList.innerHTML = "<li>Impossible de charger le top.</li>";
    setStatus(`Erreur leaderboard: ${error?.message || error}`);
  }
}

async function saveScore(score, durationSeconds, reason) {
  if (!db || !state.canSaveScore || score <= 0) {
    return;
  }

  state.canSaveScore = false;

  try {
    const playerName = getPlayerName() || "Anonyme";
    const scoresRef = window.GamesFirebase?.getGameCollectionRef?.(GAME_NAME, "scores");
    const metaRef = window.GamesFirebase?.getGameDocRef?.(GAME_NAME);

    if (!scoresRef || !metaRef) {
      throw new Error("Références Firestore indisponibles");
    }

    await scoresRef.add({
      game: GAME_NAME,
      playerName,
      score,
      durationSeconds,
      reason,
      createdAt: fieldValue?.serverTimestamp ? fieldValue.serverTimestamp() : new Date().toISOString(),
    });

    const bestRef = metaRef.collection("aggregates").doc("leaderboard");
    const currentBest = await bestRef.get();
    const currentBestScore = Number(currentBest.data()?.bestScore || 0);

    if (score > currentBestScore) {
      await bestRef.set(
        {
          bestScore: score,
          bestPlayer: playerName,
          updatedAt: fieldValue?.serverTimestamp ? fieldValue.serverTimestamp() : new Date().toISOString(),
        },
        { merge: true }
      );
    }

    await loadLeaderboard();
    setStatus("Score sauvegardé sur Firebase.");
  } catch (error) {
    console.error(error);
    setStatus(`Sauvegarde score impossible: ${error?.message || error}`);
  }
}

function initializeInput() {
  const savedName = localStorage.getItem(NAME_STORAGE_KEY) || "";
  playerNameInput.value = savedName;
  playerNameInput.addEventListener("change", saveNameLocally);
}

function bindEvents() {
  startButton.addEventListener("click", () => {
    startRun();
    board.focus();
  });

  board.addEventListener("pointerdown", (event) => {
    const lane = laneFromClientX(event.clientX);
    processTap(lane);
  });

  board.addEventListener("keydown", (event) => {
    const keyToLane = {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
    };
    if (keyToLane[event.key] !== undefined) {
      event.preventDefault();
      processTap(keyToLane[event.key]);
    }
  });

  refreshTopButton.addEventListener("click", loadLeaderboard);

  window.addEventListener("resize", () => {
    state.tiles.forEach((tile) => {
      const rect = boardRect();
      tile.width = laneWidth(rect);
      tile.height = tileHeight(rect);
      placeTile(tile);
    });
  });
}

function bootstrap() {
  updateHud();
  initializeInput();
  bindEvents();
  loadLeaderboard();

  if (!window.GamesFirebase?.isReady) {
    setStatus("Firebase indisponible. Le jeu reste jouable en local.");
  }
}

bootstrap();
