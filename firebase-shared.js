(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBO-a2RFOidJRyaAyS64hxkeJVW185WZFs",
    authDomain: "games-ba575.firebaseapp.com",
    projectId: "games-ba575",
    storageBucket: "games-ba575.firebasestorage.app",
    messagingSenderId: "943293078369",
    appId: "1:943293078369:web:bc67b53c5ff58fb9608320",
    measurementId: "G-8TR31F1FZ6",
  };

  function sanitizePayload(payload) {
    if (!payload || typeof payload !== "object") {
      return {};
    }

    const safe = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      if (typeof value === "string") {
        safe[key] = value.slice(0, 180);
        return;
      }

      if (typeof value === "number" || typeof value === "boolean") {
        safe[key] = value;
        return;
      }

      safe[key] = String(value).slice(0, 180);
    });

    return safe;
  }

  let db = null;
  let fieldValue = null;
  const SUPPORTED_GAMES = ["ActionVerite", "Shady", "TestPurete", "TuPrefere", "WhoAmI", "PianoTiles"];

  function normalizeGameName(game) {
    const raw = typeof game === "string" ? game.trim() : "";
    if (!raw) {
      return null;
    }

    const lower = raw.toLowerCase();
    if (lower === "actionverite" || lower === "actionvérité") return "ActionVerite";
    if (lower === "shady") return "Shady";
    if (lower === "testpurete") return "TestPurete";
    if (lower === "tuprefere" || lower === "tupréfère") return "TuPrefere";
    if (lower === "whoami") return "WhoAmI";
    if (lower === "pianotiles" || lower === "piano tiles") return "PianoTiles";
    return raw;
  }

  function gameDocRef(game) {
    if (!db) {
      return null;
    }
    const gameName = normalizeGameName(game);
    if (!gameName) {
      return null;
    }
    return db.collection(gameName).doc("meta");
  }

  function gameCollectionRef(game, collectionName) {
    const rootRef = gameDocRef(game);
    if (!rootRef || !collectionName) {
      return null;
    }
    return rootRef.collection(collectionName);
  }

  try {
    if (typeof firebase === "undefined") {
      throw new Error("Firebase SDK not loaded");
    }

    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    db = firebase.firestore(app);
    fieldValue = firebase.firestore.FieldValue;
  } catch (error) {
    console.warn("[GamesFirebase] Firebase init unavailable:", error?.message || error);
  }

  async function trackEvent(game, eventType, payload) {
    if (!db) {
      return null;
    }

    try {
      const gameName = normalizeGameName(game);
      if (!gameName) {
        return null;
      }

      const eventsRef = gameCollectionRef(gameName, "gameEvents");
      if (!eventsRef) {
        return null;
      }

      return await eventsRef.add({
        game: gameName,
        eventType,
        payload: sanitizePayload(payload),
        pagePath: window.location.pathname,
        createdAt: fieldValue?.serverTimestamp ? fieldValue.serverTimestamp() : new Date().toISOString(),
      });
    } catch (error) {
      console.warn("[GamesFirebase] trackEvent failed:", error?.message || error);
      return null;
    }
  }

  window.GamesFirebase = {
    isReady: Boolean(db),
    getDb: () => db,
    getGames: () => [...SUPPORTED_GAMES],
    normalizeGameName,
    getGameDocRef: gameDocRef,
    getGameCollectionRef: gameCollectionRef,
    trackEvent,
  };
})();
