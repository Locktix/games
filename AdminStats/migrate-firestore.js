(function () {
  const LEGACY_GAME_EVENTS = "gameEvents";
  const LEGACY_TUPREFERE_MODE_STATS = "tuPrefereModeStats";
  const LEGACY_TUPREFERE_DILEMMA_STATS = "tuPrefereDilemmaStats";
  const TUPREFERE_ROOT = "TuPrefere";

  function normalizeGameName(game) {
    const fromShared = window.GamesFirebase?.normalizeGameName;
    if (typeof fromShared === "function") {
      return fromShared(game);
    }

    const raw = typeof game === "string" ? game.trim() : "";
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower === "actionverite" || lower === "actionvérité") return "ActionVerite";
    if (lower === "shady") return "Shady";
    if (lower === "testpurete") return "TestPurete";
    if (lower === "tuprefere" || lower === "tupréfère") return "TuPrefere";
    if (lower === "whoami") return "WhoAmI";
    return raw;
  }

  function getDb() {
    return window.GamesFirebase?.getDb?.() || null;
  }

  async function migrateLegacyGameEvents(db, options = {}) {
    const { dryRun = true, maxEvents = 0 } = options;
    const legacyRef = db.collection(LEGACY_GAME_EVENTS);
    let query = legacyRef.orderBy("createdAt", "desc");
    if (Number.isFinite(maxEvents) && maxEvents > 0) {
      query = query.limit(maxEvents);
    }

    const snapshot = await query.get();
    const counters = {
      source: snapshot.size,
      migrated: 0,
      skippedNoGame: 0,
      skippedUnknownGame: 0,
    };

    if (snapshot.empty) {
      return counters;
    }

    let batch = db.batch();
    let writesInBatch = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() || {};
      const gameName = normalizeGameName(data.game);

      if (!data.game) {
        counters.skippedNoGame += 1;
        continue;
      }

      if (!gameName) {
        counters.skippedUnknownGame += 1;
        continue;
      }

      const targetRef = db.collection(gameName).doc("meta").collection("gameEvents").doc(doc.id);
      const payload = {
        ...data,
        game: gameName,
        migratedAt: new Date().toISOString(),
        migratedFrom: `${LEGACY_GAME_EVENTS}/${doc.id}`,
      };

      counters.migrated += 1;
      if (dryRun) {
        continue;
      }

      batch.set(targetRef, payload, { merge: true });
      writesInBatch += 1;

      if (writesInBatch >= 400) {
        await batch.commit();
        batch = db.batch();
        writesInBatch = 0;
      }
    }

    if (!dryRun && writesInBatch > 0) {
      await batch.commit();
    }

    return counters;
  }

  async function migrateLegacyTuPrefereStats(db, options = {}) {
    const { dryRun = true } = options;
    const modeSnap = await db.collection(LEGACY_TUPREFERE_MODE_STATS).get();
    const dilemmaSnap = await db.collection(LEGACY_TUPREFERE_DILEMMA_STATS).get();

    const counters = {
      modeSource: modeSnap.size,
      modeMigrated: modeSnap.size,
      dilemmaSource: dilemmaSnap.size,
      dilemmaMigrated: dilemmaSnap.size,
    };

    if (dryRun) {
      return counters;
    }

    let batch = db.batch();
    let writesInBatch = 0;

    for (const doc of modeSnap.docs) {
      const targetRef = db
        .collection(TUPREFERE_ROOT)
        .doc("stats")
        .collection("modeStarts")
        .doc(doc.id);
      batch.set(
        targetRef,
        {
          ...(doc.data() || {}),
          migratedAt: new Date().toISOString(),
          migratedFrom: `${LEGACY_TUPREFERE_MODE_STATS}/${doc.id}`,
        },
        { merge: true }
      );
      writesInBatch += 1;

      if (writesInBatch >= 400) {
        await batch.commit();
        batch = db.batch();
        writesInBatch = 0;
      }
    }

    for (const doc of dilemmaSnap.docs) {
      const targetRef = db
        .collection(TUPREFERE_ROOT)
        .doc("stats")
        .collection("dilemmaStats")
        .doc(doc.id);
      batch.set(
        targetRef,
        {
          ...(doc.data() || {}),
          migratedAt: new Date().toISOString(),
          migratedFrom: `${LEGACY_TUPREFERE_DILEMMA_STATS}/${doc.id}`,
        },
        { merge: true }
      );
      writesInBatch += 1;

      if (writesInBatch >= 400) {
        await batch.commit();
        batch = db.batch();
        writesInBatch = 0;
      }
    }

    if (writesInBatch > 0) {
      await batch.commit();
    }

    return counters;
  }

  async function deleteLegacyCollections(db, options = {}) {
    const { deleteLegacy = false } = options;
    if (!deleteLegacy) {
      return { deleted: false, counts: {} };
    }

    const gameEventsSnap = await db.collection(LEGACY_GAME_EVENTS).get();
    const modeSnap = await db.collection(LEGACY_TUPREFERE_MODE_STATS).get();
    const dilemmaSnap = await db.collection(LEGACY_TUPREFERE_DILEMMA_STATS).get();

    let batch = db.batch();
    let writesInBatch = 0;

    const enqueueDelete = (ref) => {
      batch.delete(ref);
      writesInBatch += 1;
    };

    const commitIfNeeded = async () => {
      if (writesInBatch >= 400) {
        await batch.commit();
        batch = db.batch();
        writesInBatch = 0;
      }
    };

    for (const doc of gameEventsSnap.docs) {
      enqueueDelete(doc.ref);
      await commitIfNeeded();
    }

    for (const doc of modeSnap.docs) {
      enqueueDelete(doc.ref);
      await commitIfNeeded();
    }

    for (const doc of dilemmaSnap.docs) {
      enqueueDelete(doc.ref);
      await commitIfNeeded();
    }

    if (writesInBatch > 0) {
      await batch.commit();
    }

    return {
      deleted: true,
      counts: {
        gameEvents: gameEventsSnap.size,
        tuPrefereModeStats: modeSnap.size,
        tuPrefereDilemmaStats: dilemmaSnap.size,
      },
    };
  }

  async function runFirestoreMigration(options = {}) {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase indisponible: impossible de lancer la migration.");
    }

    const config = {
      dryRun: options.dryRun !== false,
      deleteLegacy: options.deleteLegacy === true,
      maxEvents: Number(options.maxEvents) > 0 ? Number(options.maxEvents) : 0,
    };

    const startedAt = new Date().toISOString();
    const eventResult = await migrateLegacyGameEvents(db, config);
    const tuPrefereResult = await migrateLegacyTuPrefereStats(db, config);
    const deleteResult = await deleteLegacyCollections(db, config);
    const finishedAt = new Date().toISOString();

    const report = {
      startedAt,
      finishedAt,
      config,
      events: eventResult,
      tuPrefere: tuPrefereResult,
      cleanup: deleteResult,
    };

    console.table({
      dryRun: String(config.dryRun),
      migratedEvents: eventResult.migrated,
      skippedNoGame: eventResult.skippedNoGame,
      skippedUnknownGame: eventResult.skippedUnknownGame,
      modeStatsMigrated: tuPrefereResult.modeMigrated,
      dilemmaStatsMigrated: tuPrefereResult.dilemmaMigrated,
      deletedLegacy: String(deleteResult.deleted),
    });

    return report;
  }

  window.runFirestoreMigration = runFirestoreMigration;
})();