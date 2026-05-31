(function () {
  // API_BASE — resolve relative to current page, always pointing at root /api
  const API_BASE = (function () {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0 && parts[parts.length - 1].includes('.')) parts.pop();
    const up = parts.length > 0 ? '../'.repeat(parts.length) : '';
    return new URL((up || '') + 'api', window.location.href).href.replace(/\/$/, '');
  })();

  const SUPPORTED_GAMES = [
    'ActionVerite', 'Shady', 'TestPurete', 'TuPrefere', 'WhoAmI',
    'PianoTiles', 'RPG', 'Combattants', 'CheckListDeLaVie',
  ];

  function normalizeGameName(game) {
    const raw = typeof game === 'string' ? game.trim() : '';
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower === 'actionverite' || lower === 'actionvérité') return 'ActionVerite';
    if (lower === 'shady') return 'Shady';
    if (lower === 'testpurete') return 'TestPurete';
    if (lower === 'tuprefere' || lower === 'tupréfère') return 'TuPrefere';
    if (lower === 'whoami') return 'WhoAmI';
    if (lower === 'pianotiles' || lower === 'piano tiles') return 'PianoTiles';
    if (lower === 'rpg' || lower === 'rpg beta') return 'RPG';
    if (lower === 'combattants' || lower === 'combattant') return 'Combattants';
    if (lower === 'checklistdelavie') return 'CheckListDeLaVie';
    return raw;
  }

  function sanitizePayload(payload) {
    if (!payload || typeof payload !== 'object') return {};
    const safe = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined) return;
      if (typeof value === 'string') { safe[key] = value.slice(0, 180); return; }
      if (typeof value === 'number' || typeof value === 'boolean') { safe[key] = value; return; }
      safe[key] = String(value).slice(0, 180);
    });
    return safe;
  }

  // ─────────────────────────────────────────────
  // trackEvent — fire-and-forget analytics
  // ─────────────────────────────────────────────
  async function trackEvent(game, eventType, payload) {
    try {
      const gameName = normalizeGameName(game);
      if (!gameName || !eventType) return null;

      await fetch(`${API_BASE}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameName,
          eventType,
          payload: sanitizePayload(payload || {}),
          pagePath: window.location.pathname,
        }),
      });
    } catch (error) {
      console.warn('[GamesAPI] trackEvent failed:', error?.message || error);
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // Scores API (PianoTiles leaderboard)
  // ─────────────────────────────────────────────
  async function getScores(game, limit = 10) {
    const gameName = normalizeGameName(game);
    if (!gameName) return [];
    try {
      const res = await fetch(`${API_BASE}/scores.php?game=${encodeURIComponent(gameName)}&limit=${limit}`);
      const data = await res.json();
      return data.scores || [];
    } catch {
      return [];
    }
  }

  async function saveScore(game, playerName, score, extra = {}) {
    const gameName = normalizeGameName(game);
    if (!gameName || score <= 0) return null;
    try {
      const res = await fetch(`${API_BASE}/scores.php?game=${encodeURIComponent(gameName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, score, extra }),
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────
  // TuPrefere stats API
  // ─────────────────────────────────────────────
  async function getTuPrefereCounts(dilemmaId) {
    try {
      const res = await fetch(`${API_BASE}/stats.php?dilemma=${encodeURIComponent(dilemmaId)}`);
      const data = await res.json();
      return data.counts || { A: 0, B: 0 };
    } catch {
      return { A: 0, B: 0 };
    }
  }

  async function recordTuPrefereVote(dilemmaId, choice) {
    try {
      const res = await fetch(`${API_BASE}/stats.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemmaId, choice: choice.toUpperCase() }),
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────
  // RPG players API
  // ─────────────────────────────────────────────
  async function saveRpgPlayer(playerName, extra = {}) {
    try {
      const res = await fetch(`${API_BASE}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: 'RPG',
          eventType: 'player_saved',
          payload: { playerName, ...sanitizePayload(extra) },
          pagePath: window.location.pathname,
        }),
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────
  // ActionVerite rooms API
  // ─────────────────────────────────────────────
  async function avGetRoom(code) {
    try {
      const res = await fetch(`${API_BASE}/av-rooms.php?code=${encodeURIComponent(code)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function avCreateRoom(hostId, hostName, difficulty, players) {
    try {
      const res = await fetch(`${API_BASE}/av-rooms.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostId, hostName, difficulty, players }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function avUpdateRoom(code, patch) {
    try {
      const res = await fetch(`${API_BASE}/av-rooms.php?code=${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function avDeleteRoom(code) {
    try {
      await fetch(`${API_BASE}/av-rooms.php?code=${encodeURIComponent(code)}`, { method: 'DELETE' });
    } catch { /* ignore */ }
  }

  // ─────────────────────────────────────────────
  // Public surface
  // ─────────────────────────────────────────────
  window.GamesAPI = {
    // Core
    apiBase: API_BASE,
    isReady: true,
    getGames: () => [...SUPPORTED_GAMES],
    normalizeGameName,

    // Analytics
    trackEvent,

    // Scores
    getScores,
    saveScore,

    // TuPrefere
    getTuPrefereCounts,
    recordTuPrefereVote,

    // RPG
    saveRpgPlayer,

    // ActionVerite rooms
    avGetRoom,
    avCreateRoom,
    avUpdateRoom,
    avDeleteRoom,
  };

  // Legacy alias — games that still call window.GamesFirebase.trackEvent won't break
  window.GamesFirebase = {
    isReady: true,
    trackEvent,
    getGames: () => [...SUPPORTED_GAMES],
    normalizeGameName,
    // Stubs to avoid null errors in games not yet migrated
    getDb: () => null,
    getGameDocRef: () => null,
    getGameCollectionRef: () => null,
  };
})();
