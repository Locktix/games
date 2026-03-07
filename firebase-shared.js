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
      return await db.collection("gameEvents").add({
        game,
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
    trackEvent,
  };
})();
