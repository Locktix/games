const GAME_NAME = "RPG";
const WORLD_WIDTH = 3200;
const WORLD_HEIGHT = 1200;
const TOWN_BOUNDS = { x: 320, y: 180, width: 960, height: 600 };

const HOUSES = [
  {
    id: "house-1",
    name: "Maison d'Élio",
    outsideDoor: { x: 545, y: 360 },
    interior: { x: 2020, y: 160, width: 460, height: 360, spawnX: 2250, spawnY: 475, exitX: 2250, exitY: 485 },
  },
  {
    id: "house-2",
    name: "Maison du Nord-Est",
    outsideDoor: { x: 1030, y: 375 },
    interior: { x: 2560, y: 160, width: 460, height: 360, spawnX: 2790, spawnY: 475, exitX: 2790, exitY: 485 },
  },
  {
    id: "house-3",
    name: "Atelier du Village",
    outsideDoor: { x: 790, y: 735 },
    interior: { x: 2290, y: 620, width: 460, height: 360, spawnX: 2520, spawnY: 935, exitX: 2520, exitY: 945 },
  },
];

const HOUSE_BY_ID = HOUSES.reduce((acc, house) => {
  acc[house.id] = house;
  return acc;
}, {});

const state = {
  playerName: "",
  hp: 100,
  inventory: [],
  questStarted: false,
  questCompleted: false,
  currentArea: "outside",
  lastForestMessageAt: 0,
  lastAutoSaveAt: 0,
  transitionLock: false,
  introPlayed: false,
};

function trackEvent(eventType, payload) {
  window.GamesFirebase?.trackEvent?.(GAME_NAME, eventType, payload);
}

function getPlayerDocRef() {
  const playersRef = window.GamesFirebase?.getGameCollectionRef?.(GAME_NAME, "players");
  if (!playersRef || !state.playerName) {
    return null;
  }

  const safeId = state.playerName.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40) || "player";
  return playersRef.doc(safeId);
}

async function savePlayerData(scene, reason = "autosave") {
  const docRef = getPlayerDocRef();
  if (!docRef || !scene?.player) {
    return;
  }

  const payload = {
    playerName: state.playerName,
    hp: state.hp,
    x: Math.round(scene.player.x),
    y: Math.round(scene.player.y),
    currentArea: state.currentArea,
    inventory: [...state.inventory],
    questStarted: state.questStarted,
    questCompleted: state.questCompleted,
    reason,
    updatedAt: firebase?.firestore?.FieldValue?.serverTimestamp
      ? firebase.firestore.FieldValue.serverTimestamp()
      : new Date().toISOString(),
  };

  try {
    await docRef.set(payload, { merge: true });
  } catch (error) {
    console.warn("[RPG] savePlayerData failed:", error?.message || error);
  }
}

async function loadPlayerData(scene, playerName) {
  const docRef = getPlayerDocRef();
  if (!docRef) {
    return false;
  }

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return false;
    }

    const data = snapshot.data() || {};
    state.hp = typeof data.hp === "number" ? Phaser.Math.Clamp(data.hp, 1, 100) : 100;
    state.inventory = Array.isArray(data.inventory) ? data.inventory.slice(0, 12) : [];
    state.questStarted = Boolean(data.questStarted);
    state.questCompleted = Boolean(data.questCompleted);
    state.currentArea = typeof data.currentArea === "string" ? data.currentArea : "outside";

    const x = typeof data.x === "number" ? data.x : 800;
    const y = typeof data.y === "number" ? data.y : 500;
    scene.player.setPosition(x, y);

    if (!HOUSE_BY_ID[state.currentArea] && state.currentArea !== "outside") {
      state.currentArea = "outside";
      scene.player.setPosition(800, 500);
    }

    return true;
  } catch (error) {
    console.warn("[RPG] loadPlayerData failed:", error?.message || error);
    return false;
  }
}

function showNameModal(onSubmit) {
  const modal = document.createElement("div");
  modal.id = "rpg-name-modal";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.background = "rgba(0,0,0,0.62)";
  modal.style.zIndex = "9999";

  const panel = document.createElement("div");
  panel.style.width = "min(92vw, 440px)";
  panel.style.background = "#f7f2d3";
  panel.style.border = "3px solid #2d2b24";
  panel.style.borderRadius = "10px";
  panel.style.padding = "18px";
  panel.style.fontFamily = "Arial, sans-serif";

  const title = document.createElement("h2");
  title.textContent = "Retour à Clairbois";
  title.style.margin = "0 0 8px";

  const text = document.createElement("p");
  text.textContent = "Tu viens d'arriver dans ta ville natale. Entre ton nom pour commencer l'aventure.";
  text.style.margin = "0 0 12px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nom du personnage";
  input.maxLength = 24;
  input.style.width = "100%";
  input.style.boxSizing = "border-box";
  input.style.padding = "10px";
  input.style.marginBottom = "12px";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Entrer dans le village";
  button.style.width = "100%";
  button.style.padding = "10px";
  button.style.cursor = "pointer";

  const submit = () => {
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    modal.remove();
    onSubmit(value);
  };

  button.addEventListener("click", submit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submit();
    }
  });

  panel.appendChild(title);
  panel.appendChild(text);
  panel.appendChild(input);
  panel.appendChild(button);
  modal.appendChild(panel);
  document.body.appendChild(modal);
  input.focus();
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  this.load.image("grass", "Assets/grass.svg");
  this.load.image("path", "Assets/path.svg");
  this.load.image("house", "Assets/house.svg");
  this.load.image("tree", "Assets/tree.svg");
  this.load.image("player", "Assets/player.svg");
  this.load.image("npc", "Assets/npc.svg");
  this.load.image("grandpa", "Assets/grandpa.svg");
  this.load.image("item", "Assets/old-map.svg");

  this.load.image("interior-floor", "Assets/interior-floor.svg");
  this.load.image("interior-wall", "Assets/interior-wall.svg");
  this.load.image("rug", "Assets/rug.svg");
  this.load.image("table", "Assets/table.svg");
  this.load.image("bed", "Assets/bed.svg");
  this.load.image("bookshelf", "Assets/bookshelf.svg");
  this.load.image("plant", "Assets/plant.svg");
  this.load.image("door-mat", "Assets/door-mat.svg");
  this.load.image("door-closed", "Assets/door-closed.svg");
  this.load.image("door-open", "Assets/door-open.svg");
  this.load.image("car", "Assets/car.svg");
}

function create() {
  this.cameras.main.setBackgroundColor("#2a4a25");
  this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  this.add
    .tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, "grass")
    .setDepth(0);

  this.add
    .tileSprite(
      TOWN_BOUNDS.x + TOWN_BOUNDS.width / 2,
      TOWN_BOUNDS.y + TOWN_BOUNDS.height / 2,
      TOWN_BOUNDS.width,
      TOWN_BOUNDS.height,
      "path"
    )
    .setDepth(1)
    .setAlpha(0.72);

  this.add.tileSprite(800, 480, 86, 600, "path").setDepth(2).setAlpha(0.96);
  this.add.tileSprite(800, 480, 960, 70, "path").setDepth(2).setAlpha(0.96);

  this.add.image(545, 305, "house").setDisplaySize(170, 120).setDepth(3);
  this.add.image(1030, 310, "house").setDisplaySize(190, 130).setDepth(3);
  this.add.image(790, 680, "house").setDisplaySize(200, 110).setDepth(3);

  this.add.image(545, 366, "door-mat").setDisplaySize(50, 18).setDepth(4);
  this.add.image(1030, 380, "door-mat").setDisplaySize(56, 18).setDepth(4);
  this.add.image(790, 740, "door-mat").setDisplaySize(56, 18).setDepth(4);

  const treePositions = [
    [420, 170], [500, 165], [580, 170], [660, 165], [740, 170], [820, 170], [900, 165], [980, 170], [1060, 165], [1140, 170], [1220, 170],
    [420, 790], [500, 795], [580, 790], [660, 795], [740, 790], [820, 795], [900, 790], [980, 795], [1060, 790], [1140, 795], [1220, 790],
    [320, 240], [320, 330], [320, 420], [320, 510], [320, 600], [320, 690],
    [1280, 240], [1280, 330], [1280, 420], [1280, 510], [1280, 600], [1280, 690],
  ];
  treePositions.forEach(([x, y]) => this.add.image(x, y, "tree").setDisplaySize(82, 100).setDepth(4));

  this.forestBlockers = this.physics.add.staticGroup();
  [
    { x: 800, y: 170, w: 960, h: 12 },
    { x: 800, y: 790, w: 960, h: 12 },
    { x: 320, y: 480, w: 12, h: 600 },
    { x: 1280, y: 480, w: 12, h: 600 },
  ].forEach((def) => {
    const wall = this.add.rectangle(def.x, def.y, def.w, def.h, 0x214823, 0.01);
    this.physics.add.existing(wall, true);
    this.forestBlockers.add(wall);
  });

  this.player = this.physics.add.sprite(800, 500, "player").setDepth(10);
  this.player.body.setSize(20, 28);
  this.player.setDisplaySize(32, 40);
  this.player.setCollideWorldBounds(true);

  this.physics.add.collider(this.player, this.forestBlockers, () => {
    if (state.currentArea !== "outside") {
      return;
    }
    const now = Date.now();
    if (now - state.lastForestMessageAt > 1400) {
      state.lastForestMessageAt = now;
      setDialogue(this, "La forêt est trop dense pour l'instant. Tu dois rester en ville.");
      trackEvent("blocked_forest", { x: this.player.x, y: this.player.y });
    }
  });

  this.interiorColliders = this.physics.add.staticGroup();
  buildAllInteriors(this);
  this.physics.add.collider(this.player, this.interiorColliders);

  this.interactables = [];
  this.doors = [];
  this.doorSprites = [];

  HOUSES.forEach((house) => {
    const outsideDoorSprite = this.add
      .image(house.outsideDoor.x, house.outsideDoor.y - 18, "door-closed")
      .setDisplaySize(34, 46)
      .setDepth(5);

    const insideDoorSprite = this.add
      .image(house.interior.exitX, house.interior.exitY - 21, "door-closed")
      .setDisplaySize(36, 48)
      .setDepth(6);

    this.doorSprites.push(outsideDoorSprite, insideDoorSprite);

    this.doors.push({
      type: "enter",
      houseId: house.id,
      area: "outside",
      x: house.outsideDoor.x,
      y: house.outsideDoor.y,
      radius: 46,
      label: `Entrer dans ${house.name}`,
      sprite: outsideDoorSprite,
    });

    this.doors.push({
      type: "exit",
      houseId: house.id,
      area: house.id,
      x: house.interior.exitX,
      y: house.interior.exitY,
      radius: 46,
      label: "Sortir",
      sprite: insideDoorSprite,
    });
  });

  addNpc(this, {
    area: "outside",
    key: "npc",
    x: 620,
    y: 430,
    name: "Lina",
    lines: ["Quel beau soleil aujourd'hui.", "Ton grand-père t'attend chez lui."],
  });

  addNpc(this, {
    area: "outside",
    key: "npc",
    x: 990,
    y: 560,
    name: "Malo",
    lines: ["Le village est tranquille en ce moment.", "Les maisons du nord ont de vieux secrets."],
  });

  const grandpaHouse = HOUSE_BY_ID["house-1"];
  addNpc(this, {
    area: "house-1",
    key: "grandpa",
    x: grandpaHouse.interior.x + 240,
    y: grandpaHouse.interior.y + 150,
    name: "Grand-père Élio",
    lines: [
      "Te voilà enfin, aventurier.",
      "J'ai besoin de mon ancienne carte. Elle est dans la maison du nord-est.",
      "Ramène-la moi, et ton voyage commencera vraiment.",
    ],
    onInteract: () => {
      if (!state.questStarted) {
        state.questStarted = true;
        setDialogue(this, "Quête: retrouver l'ancienne carte dans la maison du nord-est.");
        trackEvent("quest_started", { quest: "old_map" });
        savePlayerData(this, "quest_started");
      } else if (!state.questCompleted) {
        setDialogue(this, "Va dans la maison du nord-est. La carte t'y attend.");
      } else {
        setDialogue(this, "Parfait ! Tu es prêt pour la prochaine aventure.");
      }
    },
  });

  const workshopHouse = HOUSE_BY_ID["house-3"];
  addNpc(this, {
    area: "house-3",
    key: "npc",
    x: workshopHouse.interior.x + 150,
    y: workshopHouse.interior.y + 190,
    name: "Maël l'Artisan",
    lines: ["Bienvenue à l'atelier.", "Les héros passent toujours ici avant de partir loin."],
  });

  const archiveHouse = HOUSE_BY_ID["house-2"];
  this.mapItem = this.physics.add.staticSprite(archiveHouse.interior.x + 335, archiveHouse.interior.y + 185, "item").setDepth(12);
  this.mapItem.setDisplaySize(24, 24);
  this.interactables.push({
    area: "house-2",
    sprite: this.mapItem,
    name: "Ancienne carte",
    lines: ["Tu trouves une carte ancienne avec des notes manuscrites."],
    onInteract: () => {
      if (!state.questStarted) {
        setDialogue(this, "Cette carte semble importante... mais pour qui ?");
        return;
      }
      if (state.questCompleted) {
        setDialogue(this, "Tu as déjà récupéré l'ancienne carte.");
        return;
      }
      state.inventory.push("Ancienne carte");
      state.questCompleted = true;
      this.mapItem.destroy();
      setDialogue(this, "Objet obtenu: Ancienne carte. Retourne parler à ton grand-père.");
      trackEvent("item_collected", { item: "old_map" });
      savePlayerData(this, "item_collected");
    },
  });

  this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
  this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  this.uiStats = this.add
    .text(12, 10, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.45)",
      padding: { left: 8, right: 8, top: 5, bottom: 5 },
    })
    .setScrollFactor(0)
    .setDepth(30);

  this.uiPrompt = this.add
    .text(12, 52, "", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#ffe082",
      backgroundColor: "rgba(0,0,0,0.45)",
      padding: { left: 8, right: 8, top: 4, bottom: 4 },
    })
    .setScrollFactor(0)
    .setDepth(30);

  this.uiDialogue = this.add
    .text(12, 540, "", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.68)",
      padding: { left: 10, right: 10, top: 8, bottom: 8 },
      wordWrap: { width: 935, useAdvancedWrap: true },
    })
    .setScrollFactor(0)
    .setDepth(30);

  this.nearestDoor = null;
  this.nearestInteractable = null;

  startIntroAndRegistration(this);

  updateUi(this);
}

async function startIntroAndRegistration(scene) {
  if (!state.introPlayed) {
    await playArrivalCutscene(scene);
    state.introPlayed = true;
  }

  showNameModal(async (playerName) => {
    state.playerName = playerName;

    const restored = await loadPlayerData(scene, playerName);
    if (restored) {
      setDialogue(scene, `Bon retour ${playerName}. Ta progression a été chargée.`);
      trackEvent("player_loaded", { playerName });
    } else {
      setDialogue(scene, "Tu arrives à Clairbois. Commence par visiter ton grand-père.");
      trackEvent("player_created", { playerName });
      await savePlayerData(scene, "player_created");
    }

    updateUi(scene);
  });
}

function playArrivalCutscene(scene) {
  return new Promise((resolve) => {
    state.transitionLock = true;

    const camera = scene.cameras.main;
    camera.stopFollow();
    camera.setZoom(1.04);
    camera.centerOn(800, 760);

    scene.player.setVisible(false);
    scene.player.body.enable = false;

    const barsTop = scene.add.rectangle(480, 28, 960, 62, 0x000000, 0.9).setScrollFactor(0).setDepth(100);
    const barsBottom = scene.add.rectangle(480, 572, 960, 62, 0x000000, 0.9).setScrollFactor(0).setDepth(100);

    const titleText = scene.add
      .text(480, 28, "Quelques minutes plus tôt...", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#f8f5e1",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);

    const subtitleText = scene.add
      .text(480, 570, "", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#f3ead0",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);

    const carShadow = scene.add.ellipse(800, 990, 76, 24, 0x000000, 0.28).setDepth(14);
    const car = scene.add.image(800, 980, "car").setDisplaySize(90, 50).setDepth(15);

    subtitleText.setText("Après des années d'absence, tu reprends la route vers Clairbois...");

    scene.tweens.add({
      targets: [car, carShadow],
      y: 610,
      duration: 5200,
      ease: "Sine.easeOut",
      onUpdate: () => {
        carShadow.x = car.x;
        carShadow.y = car.y + 17;
      },
      onComplete: () => {
        subtitleText.setText("La voiture ralentit. Le village de ton grand-père est juste devant toi.");

        scene.time.delayedCall(1800, () => {
          subtitleText.setText("Une nouvelle aventure commence maintenant.");

          scene.time.delayedCall(1800, () => {
            camera.fadeOut(520, 0, 0, 0);

            scene.time.delayedCall(540, () => {
              car.destroy();
              carShadow.destroy();
              barsTop.destroy();
              barsBottom.destroy();
              titleText.destroy();
              subtitleText.destroy();

              scene.player.setPosition(800, 545);
              scene.player.setVisible(true);
              scene.player.body.enable = true;

              camera.setZoom(1);
              camera.startFollow(scene.player, true, 0.12, 0.12);
              camera.fadeIn(520, 0, 0, 0);

              state.transitionLock = false;
              trackEvent("intro_arrival_played", {});
              resolve();
            });
          });
        });
      },
    });
  });
}

function buildAllInteriors(scene) {
  HOUSES.forEach((house) => {
    const room = house.interior;

    scene.add
      .tileSprite(room.x + room.width / 2, room.y + room.height / 2, room.width, room.height, "interior-floor")
      .setDepth(1);

    scene.add.tileSprite(room.x + room.width / 2, room.y + 12, room.width, 24, "interior-wall").setDepth(2);
    scene.add.tileSprite(room.x + room.width / 2, room.y + room.height - 12, room.width, 24, "interior-wall").setDepth(2);
    scene.add.tileSprite(room.x + 12, room.y + room.height / 2, 24, room.height, "interior-wall").setDepth(2);
    scene.add.tileSprite(room.x + room.width - 12, room.y + room.height / 2, 24, room.height, "interior-wall").setDepth(2);

    scene.add.image(room.x + room.width / 2, room.y + room.height - 42, "door-mat").setDisplaySize(84, 26).setDepth(5);

    addColliderRect(scene, room.x + room.width / 2, room.y + 10, room.width - 24, 20);
    addColliderRect(scene, room.x + room.width / 2, room.y + room.height - 10, room.width - 110, 20);
    addColliderRect(scene, room.x + 10, room.y + room.height / 2, 20, room.height - 24);
    addColliderRect(scene, room.x + room.width - 10, room.y + room.height / 2, 20, room.height - 24);

    if (house.id === "house-1") {
      scene.add.image(room.x + 95, room.y + 100, "bed").setDisplaySize(132, 76).setDepth(6);
      scene.add.image(room.x + 360, room.y + 105, "bookshelf").setDisplaySize(82, 96).setDepth(6);
      scene.add.image(room.x + 235, room.y + 205, "table").setDisplaySize(100, 62).setDepth(6);
      scene.add.image(room.x + 125, room.y + 270, "plant").setDisplaySize(38, 56).setDepth(6);
      scene.add.image(room.x + 300, room.y + 275, "rug").setDisplaySize(120, 80).setDepth(5);
      addColliderRect(scene, room.x + 95, room.y + 105, 120, 60);
      addColliderRect(scene, room.x + 360, room.y + 108, 70, 76);
      addColliderRect(scene, room.x + 235, room.y + 210, 88, 44);
    }

    if (house.id === "house-2") {
      scene.add.image(room.x + 95, room.y + 100, "bookshelf").setDisplaySize(82, 96).setDepth(6);
      scene.add.image(room.x + 235, room.y + 120, "bookshelf").setDisplaySize(82, 96).setDepth(6);
      scene.add.image(room.x + 360, room.y + 110, "bookshelf").setDisplaySize(82, 96).setDepth(6);
      scene.add.image(room.x + 245, room.y + 260, "table").setDisplaySize(115, 70).setDepth(6);
      scene.add.image(room.x + 150, room.y + 280, "rug").setDisplaySize(120, 78).setDepth(5);
      addColliderRect(scene, room.x + 95, room.y + 108, 68, 76);
      addColliderRect(scene, room.x + 235, room.y + 128, 68, 76);
      addColliderRect(scene, room.x + 360, room.y + 118, 68, 76);
      addColliderRect(scene, room.x + 245, room.y + 265, 98, 48);
    }

    if (house.id === "house-3") {
      scene.add.image(room.x + 96, room.y + 108, "table").setDisplaySize(100, 62).setDepth(6);
      scene.add.image(room.x + 235, room.y + 108, "table").setDisplaySize(100, 62).setDepth(6);
      scene.add.image(room.x + 365, room.y + 108, "table").setDisplaySize(100, 62).setDepth(6);
      scene.add.image(room.x + 352, room.y + 260, "bed").setDisplaySize(120, 72).setDepth(6);
      scene.add.image(room.x + 115, room.y + 270, "plant").setDisplaySize(40, 56).setDepth(6);
      scene.add.image(room.x + 235, room.y + 265, "rug").setDisplaySize(130, 84).setDepth(5);
      addColliderRect(scene, room.x + 96, room.y + 112, 84, 44);
      addColliderRect(scene, room.x + 235, room.y + 112, 84, 44);
      addColliderRect(scene, room.x + 365, room.y + 112, 84, 44);
      addColliderRect(scene, room.x + 352, room.y + 266, 110, 52);
    }
  });
}

function addColliderRect(scene, x, y, width, height) {
  const rect = scene.add.rectangle(x, y, width, height, 0x000000, 0.01);
  scene.physics.add.existing(rect, true);
  scene.interiorColliders.add(rect);
}

function addNpc(scene, npcConfig) {
  const sprite = scene.physics.add.staticSprite(npcConfig.x, npcConfig.y, npcConfig.key).setDepth(10);
  sprite.setDisplaySize(32, 40);

  scene.interactables.push({
    area: npcConfig.area || "outside",
    sprite,
    name: npcConfig.name,
    lines: npcConfig.lines || [],
    onInteract: npcConfig.onInteract,
  });
}

function setDialogue(scene, text) {
  if (!scene?.uiDialogue) {
    return;
  }
  scene.uiDialogue.setText(text || "");
}

function updateUi(scene) {
  const inventoryLabel = state.inventory.length ? state.inventory.join(", ") : "vide";
  const areaLabel = state.currentArea === "outside" ? "Ville" : HOUSE_BY_ID[state.currentArea]?.name || "Maison";

  scene.uiStats.setText(
    `Joueur: ${state.playerName || "..."}   Zone: ${areaLabel}   HP: ${state.hp}/100   Sac: ${inventoryLabel}`
  );
}

function findNearestDoor(scene) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  scene.doors.forEach((door) => {
    if (door.area !== state.currentArea) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, door.x, door.y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = door;
    }
  });

  if (nearest && nearestDistance <= nearest.radius) {
    return nearest;
  }

  return null;
}

function setDoorState(door, isOpen) {
  if (!door?.sprite?.active) {
    return;
  }
  door.sprite.setTexture(isOpen ? "door-open" : "door-closed");
}

function findNearestInteractable(scene) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  scene.interactables.forEach((target) => {
    if (!target?.sprite?.active || target.area !== state.currentArea) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, target.sprite.x, target.sprite.y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = target;
    }
  });

  if (nearest && nearestDistance <= 56) {
    return nearest;
  }

  return null;
}

function runTransition(scene, callback, door = null) {
  if (state.transitionLock) {
    return;
  }

  state.transitionLock = true;

  setDoorState(door, true);

  const animatedTarget = door?.sprite || scene.player;
  scene.tweens.add({
    targets: animatedTarget,
    duration: 90,
    scaleY: animatedTarget.scaleY * 1.05,
    yoyo: true,
    onComplete: () => {
      scene.cameras.main.fadeOut(180, 0, 0, 0);
      scene.time.delayedCall(190, () => {
        callback();
        scene.cameras.main.fadeIn(220, 0, 0, 0);
        scene.time.delayedCall(240, () => {
          setDoorState(door, false);
          state.transitionLock = false;
        });
      });
    },
  });
}

function enterHouse(scene, door) {
  const house = HOUSE_BY_ID[door?.houseId];
  if (!house) {
    return;
  }

  runTransition(
    scene,
    () => {
      state.currentArea = house.id;
      scene.player.setPosition(house.interior.spawnX, house.interior.spawnY);
      setDialogue(scene, `${house.name}. Un intérieur chaleureux à l'ancienne.`);
      trackEvent("house_enter", { houseId: house.id });
      savePlayerData(scene, "house_enter");
    },
    door
  );
}

function exitHouse(scene, door) {
  const house = HOUSE_BY_ID[door?.houseId];
  if (!house) {
    return;
  }

  runTransition(
    scene,
    () => {
      state.currentArea = "outside";
      scene.player.setPosition(house.outsideDoor.x, house.outsideDoor.y + 36);
      setDialogue(scene, "Tu sors de la maison et retrouves l'air frais du village.");
      trackEvent("house_exit", { houseId: house.id });
      savePlayerData(scene, "house_exit");
    },
    door
  );
}

function handleInteraction(scene) {
  if (!state.playerName || state.transitionLock) {
    return;
  }

  if (scene.nearestDoor) {
    if (scene.nearestDoor.type === "enter") {
      enterHouse(scene, scene.nearestDoor);
    } else {
      exitHouse(scene, scene.nearestDoor);
    }
    return;
  }

  if (!scene.nearestInteractable) {
    return;
  }

  const target = scene.nearestInteractable;
  const lines = target.lines || [];
  if (lines.length > 0) {
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    setDialogue(scene, `${target.name}: ${randomLine}`);
  }

  if (typeof target.onInteract === "function") {
    target.onInteract();
  }

  trackEvent("npc_interaction", { target: target.name, area: state.currentArea });
  updateUi(scene);
}

function update() {
  const speed = 170;
  const hasName = Boolean(state.playerName);

  this.player.body.setVelocity(0);

  if (hasName && !state.transitionLock) {
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    this.player.body.velocity.normalize().scale(speed);
  }

  this.nearestDoor = findNearestDoor(this);
  this.nearestInteractable = findNearestInteractable(this);

  if (!hasName) {
    this.uiPrompt.setText("Renseigne ton nom pour commencer.");
  } else if (this.nearestDoor) {
    this.uiPrompt.setText(`E: ${this.nearestDoor.label}`);
  } else if (this.nearestInteractable) {
    this.uiPrompt.setText(`E: parler avec ${this.nearestInteractable.name}`);
  } else {
    this.uiPrompt.setText("");
  }

  if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
    handleInteraction(this);
  }

  updateUi(this);

  const now = Date.now();
  if (hasName && now - state.lastAutoSaveAt > 8000) {
    state.lastAutoSaveAt = now;
    savePlayerData(this, "autosave");
  }
}
