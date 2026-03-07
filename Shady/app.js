import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  getCountFromServer,
  serverTimestamp,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

/**
 * CONFIG FIREBASE
 * Remplacer les valeurs par votre projet Firebase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCeZdO0mVWNq8T796tP3ed-b2VTQOgzqfQ",
  authDomain: "shady-5147b.firebaseapp.com",
  projectId: "shady-5147b",
  storageBucket: "shady-5147b.firebasestorage.app",
  messagingSenderId: "672167300494",
  appId: "1:672167300494:web:4bb5e5ffd917523d6d68df",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * État global applicatif (SPA simple).
 */
const state = {
  authMode: "login",
  user: null,
  profileName: "",
  profileIcon: "🕵️",
  profileTab: "customize",
  preRoomView: "lobby",
  roomId: null,
  room: null,
  players: [],
  game: null,
  mySecretRevealed: false,
  roomsUnsub: null,
  roomUnsub: null,
  playersUnsub: null,
  gameUnsub: null,
  roomsSnapshotToken: 0,
  phaseTickInterval: null,
  phaseAutoHandledKey: null,
  voteAutoHandledKey: null,
  currentView: null,
  accessibilityLargeText: false,
  accessibilityHighContrast: false,
  achievements: {},
  badgeStats: {
    gamesPlayed: 0,
  },
  processedEndSignature: null,
  newUnlockedBadges: [],
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const visualFx = {
  particleCanvas: null,
  particleContext: null,
  particles: [],
  burstParticles: [],
  particleRafId: null,
  lastFrameTimestamp: 0,
  frameStep: 1,
  particleResizeBound: false,
  particleVisibilityBound: false,
  phaseFlashLayer: null,
  phaseSignature: null,
  voteProgressSignature: null,
  eliminationSignature: null,
  winnerSignature: null,
  audioContext: null,
  audioUnlocked: false,
  audioSupported: typeof window.AudioContext === "function" || typeof window.webkitAudioContext === "function",
  audioUnlockBound: false,
  eliminationNoticeSignature: null,
};

const PROFILE_ICONS = ["🕵️", "😎", "🐺", "🦊", "🐼", "🤖", "🦄", "🔥", "⚡", "👑"];
const USER_PROFILE_STORAGE_KEY = "linfiltre_profile_v1";
const USER_ACCESSIBILITY_STORAGE_KEY = "linfiltre_accessibility_v1";
const USER_ACHIEVEMENTS_STORAGE_KEY = "linfiltre_achievements_v1";
const EMPTY_ROOM_CLEANUP_ATTEMPTS = new Set();

const ACHIEVEMENT_DEFINITIONS = [
  {
    key: "firstVictory",
    icon: "🏆",
    title: "Première Victoire",
    description: "Gagner ta première partie.",
  },
  {
    key: "survivor",
    icon: "🛡️",
    title: "Survivant",
    description: "Finir une partie encore en vie.",
  },
  {
    key: "strategist",
    icon: "🧠",
    title: "Stratège",
    description: "Atteindre la manche 3 minimum.",
  },
  {
    key: "veteran",
    icon: "🎖️",
    title: "Vétéran",
    description: "Terminer 5 parties.",
  },
];

/**
 * Liste de paires de mots (50+), thème varié/fun.
 */
const WORD_PAIRS = [
  ["Chien", "Loup"], ["Chat", "Tigre"], ["Panda", "Koala"], ["Lion", "Panthère"], ["Aigle", "Faucon"],
  ["Dauphin", "Requin"], ["Pingouin", "Phoque"], ["Girafe", "Zèbre"], ["Éléphant", "Rhinocéros"], ["Renard", "Coyote"],
  ["Pizza", "Burger"], ["Sushi", "Tacos"], ["Pâtes", "Risotto"], ["Crêpe", "Gaufre"], ["Fromage", "Yaourt"],
  ["Pomme", "Banane"], ["Fraise", "Framboise"], ["Carotte", "Concombre"], ["Tomate", "Poivron"], ["Patate", "Riz"],
  ["Café", "Thé"], ["Jus", "Smoothie"], ["Limonade", "Soda"], ["Chocolat", "Vanille"], ["Miel", "Confiture"],
  ["Avion", "Sous-marin"], ["Train", "Tramway"], ["Bus", "Taxi"], ["Vélo", "Trottinette"], ["Moto", "Quad"],
  ["Fusée", "Dirigeable"], ["Hélicoptère", "Planeur"], ["Voilier", "Péniche"], ["Camion", "Tracteur"], ["Métro", "TGV"],
  ["École", "Hôpital"], ["Musée", "Stade"], ["Banque", "Poste"], ["Pharmacie", "Boulangerie"], ["Cinéma", "Théâtre"],
  ["Bibliothèque", "Librairie"], ["Aéroport", "Port"], ["Usine", "Ferme"], ["Prison", "Tribunal"], ["Mairie", "Préfecture"],
  ["Soleil", "Lune"], ["Désert", "Glacier"], ["Forêt", "Savane"], ["Volcan", "Geyser"], ["Océan", "Canyon"],
  ["Île", "Péninsule"], ["Cascade", "Dune"], ["Tempête", "Canicule"], ["Brouillard", "Arc-en-ciel"], ["Orage", "Avalanche"],
  ["Neige", "Sable"], ["Pluie", "Grêle"], ["Rivière", "Marais"], ["Lac", "Lagune"], ["Montagne", "Falaises"],
  ["Samouraï", "Pirate"], ["Ninja", "Chevalier"], ["Vampire", "Momie"], ["Dragon", "Kraken"], ["Sorcière", "Fée"],
  ["Robot", "Alien"], ["Magicien", "Illusionniste"], ["Empereur", "Président"], ["Roi", "Sultan"], ["Cowboy", "Shérif"],
  ["Astronaute", "Plongeur"], ["Pilote", "Capitaine"], ["Pompier", "Policier"], ["Médecin", "Architecte"], ["Chef", "Serveur"],
  ["Détective", "Journaliste"], ["Espion", "Hacker"], ["Professeur", "Étudiant"], ["Juge", "Avocat"], ["Mécanicien", "Électricien"],
  ["Guitare", "Violon"], ["Piano", "Batterie"], ["Saxophone", "Trompette"], ["Flûte", "Harmonica"], ["DJ", "Chef d'orchestre"],
  ["Film", "Série"], ["Roman", "BD"], ["Poème", "Discours"], ["Podcast", "Radio"], ["Jeu vidéo", "Jeu de société"],
  ["Football", "Basket"], ["Tennis", "Badminton"], ["Rugby", "Baseball"], ["Natation", "Escalade"], ["Surf", "Ski"],
  ["Boxe", "Escrime"], ["Cyclisme", "Marathon"], ["Judo", "Karaté"], ["Volley", "Handball"], ["Golf", "Pétanque"],
  ["Téléphone", "Tablette"], ["Ordinateur", "Console"], ["Clavier", "Manette"], ["Caméra", "Micro"], ["Drone", "Webcam"],
  ["Serveur", "Routeur"], ["Bluetooth", "Wi-Fi"], ["Batterie", "Chargeur"], ["Casque audio", "Enceinte"], ["Projecteur", "Écran"],
  ["Stylo", "Pinceau"], ["Couteau", "Fourchette"], ["Marteau", "Tournevis"], ["Scie", "Perceuse"], ["Balai", "Aspirateur"],
  ["Lampe", "Bougie"], ["Canapé", "Chaise"], ["Table", "Commode"], ["Rideau", "Store"], ["Oreiller", "Couette"],
  ["Chaussure", "Sandale"], ["Botte", "Pantoufle"], ["Veste", "Pull"], ["Manteau", "Cape"], ["Casque", "Couronne"],
  ["Lunettes", "Jumelles"], ["Montre", "Boussole"], ["Sac à dos", "Valise"], ["Parapluie", "Parasol"], ["Gants", "Mitaines"],
  ["Code", "Mot de passe"], ["Algorithme", "Bug"], ["Cloud", "Disque dur"], ["Virus", "Pare-feu"], ["Captcha", "QR code"],
  ["Saturne", "Jupiter"], ["Comète", "Météorite"], ["Galaxie", "Nébuleuse"], ["Télescope", "Microscope"], ["Satellite", "Station spatiale"],
  ["Potion", "Poison"], ["Élixir", "Antidote"], ["Trésor", "Artefact"], ["Parchemin", "Grimoire"], ["Portail", "Labyrinthe"],
  ["Village", "Métropole"], ["Appartement", "Cabane"], ["Château", "Gratte-ciel"], ["Pont", "Tunnel"], ["Route", "Autoroute"],
  ["Bijou", "Trophée"], ["Collier", "Bracelet"], ["Bague", "Broche"], ["Masque", "Maquillage"], ["Parfum", "Déodorant"],
  ["Mango", "Ananas"], ["Citron", "Orange"], ["Poire", "Kiwi"], ["Abricot", "Pêche"], ["Cerise", "Raisin"],
  ["Tortue", "Crocodile"], ["Serpent", "Lézard"], ["Araignée", "Scorpion"], ["Papillon", "Libellule"], ["Abeille", "Guêpe"]
];

/**
 * Raccourci DOM pour limiter la répétition.
 */
const $ = (id) => document.getElementById(id);

const views = {
  auth: $("view-auth"),
  lobby: $("view-lobby"),
  createRoom: $("view-create-room"),
  profile: $("view-profile"),
  room: $("view-room"),
  game: $("view-game"),
  end: $("view-end"),
};

function updateTabBar() {
  const tabBar = $("app-tabbar");
  if (!tabBar) return;

  const shouldShow = Boolean(state.user) && !state.roomId;
  tabBar.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) return;

  const lobbyButton = $("btn-tabbar-lobby");
  const createButton = $("btn-tabbar-create");
  const profileButton = $("btn-tabbar-profile");

  lobbyButton?.classList.toggle("is-active", state.preRoomView === "lobby");
  createButton?.classList.toggle("is-active", state.preRoomView === "createRoom");
  profileButton?.classList.toggle("is-active", state.preRoomView === "profile");
}

/**
 * Affiche une seule vue active selon le flux (SPA section-based).
 */
function setView(viewName) {
  const targetView = views[viewName];
  if (!targetView) return;

  Object.entries(views).forEach(([key, node]) => {
    node.classList.toggle("is-active", key === viewName);
  });

  if (state.currentView === viewName || prefersReducedMotion.matches) {
    state.currentView = viewName;
    return;
  }

  targetView.animate(
    [
      { opacity: 0, transform: "translateY(10px) scale(0.992)", filter: "blur(2px)" },
      { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
    ],
    {
      duration: 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    }
  );

  state.currentView = viewName;
}

function createParticle(viewportWidth, viewportHeight) {
  return {
    x: Math.random() * viewportWidth,
    y: Math.random() * viewportHeight,
    velocityX: (Math.random() - 0.5) * 0.35,
    velocityY: (Math.random() - 0.5) * 0.35,
    radius: 0.8 + Math.random() * 1.8,
    alpha: 0.24 + Math.random() * 0.5,
  };
}

function createBurstParticle(originX, originY, color) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.2 + Math.random() * 3;
  return {
    x: originX,
    y: originY,
    velocityX: Math.cos(angle) * speed,
    velocityY: Math.sin(angle) * speed - 0.6,
    radius: 1.2 + Math.random() * 2.2,
    life: 28 + Math.floor(Math.random() * 26),
    age: 0,
    alpha: 0.95,
    color,
  };
}

function spawnImpactBurst(options = {}) {
  if (prefersReducedMotion.matches) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const originX = options.x ?? viewportWidth * 0.5;
  const originY = options.y ?? viewportHeight * 0.5;
  const color = options.color || "rgba(255, 214, 111";
  const count = Math.max(8, Math.min(80, options.count || 24));

  for (let index = 0; index < count; index += 1) {
    visualFx.burstParticles.push(createBurstParticle(originX, originY, color));
  }

  if (visualFx.burstParticles.length > 240) {
    visualFx.burstParticles.splice(0, visualFx.burstParticles.length - 240);
  }

  startParticlesLoop();
}

function ensureParticlePopulation(viewportWidth, viewportHeight) {
  const isCompactDevice = viewportWidth <= 420;
  const lowPowerDevice = (navigator.hardwareConcurrency || 4) <= 4;
  const densityBase = lowPowerDevice ? 23000 : 16000;
  const minCount = lowPowerDevice ? 14 : 20;
  const maxCount = lowPowerDevice ? 44 : 64;
  const targetCount = Math.min(maxCount, Math.max(minCount, Math.floor((viewportWidth * viewportHeight) / densityBase)));

  visualFx.frameStep = lowPowerDevice || isCompactDevice ? 2 : 1;

  if (visualFx.particles.length === targetCount) return;

  visualFx.particles = Array.from({ length: targetCount }, () => createParticle(viewportWidth, viewportHeight));
}

function resizeParticleCanvas() {
  if (!visualFx.particleCanvas || !visualFx.particleContext) return;

  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  visualFx.particleCanvas.width = Math.floor(viewportWidth * devicePixelRatio);
  visualFx.particleCanvas.height = Math.floor(viewportHeight * devicePixelRatio);
  visualFx.particleCanvas.style.width = `${viewportWidth}px`;
  visualFx.particleCanvas.style.height = `${viewportHeight}px`;

  visualFx.particleContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ensureParticlePopulation(viewportWidth, viewportHeight);
}

function drawParticles() {
  if (!visualFx.particleCanvas || !visualFx.particleContext) return;

  const context = visualFx.particleContext;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  context.clearRect(0, 0, viewportWidth, viewportHeight);

  visualFx.particles.forEach((particle) => {
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    if (particle.x < -10 || particle.x > viewportWidth + 10) particle.velocityX *= -1;
    if (particle.y < -10 || particle.y > viewportHeight + 10) particle.velocityY *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(201, 220, 255, ${particle.alpha})`;
    context.fill();
  });

  if (visualFx.burstParticles.length) {
    const nextBurstParticles = [];
    visualFx.burstParticles.forEach((particle) => {
      particle.age += 1;
      particle.velocityY += 0.05;
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.alpha = Math.max(0, 1 - particle.age / particle.life);

      if (particle.age < particle.life) {
        nextBurstParticles.push(particle);
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `${particle.color}, ${Math.max(0, Math.min(1, particle.alpha))})`;
      context.fill();
    });
    visualFx.burstParticles = nextBurstParticles;
  }

  for (let sourceIndex = 0; sourceIndex < visualFx.particles.length; sourceIndex += 1) {
    const sourceParticle = visualFx.particles[sourceIndex];
    let linkedCount = 0;

    for (let targetIndex = sourceIndex + 1; targetIndex < visualFx.particles.length; targetIndex += 1) {
      const targetParticle = visualFx.particles[targetIndex];
      const deltaX = sourceParticle.x - targetParticle.x;
      const deltaY = sourceParticle.y - targetParticle.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 130) continue;

      const opacity = (1 - distance / 130) * 0.22;
      context.beginPath();
      context.moveTo(sourceParticle.x, sourceParticle.y);
      context.lineTo(targetParticle.x, targetParticle.y);
      context.strokeStyle = `rgba(146, 178, 255, ${opacity})`;
      context.lineWidth = 1;
      context.stroke();

      linkedCount += 1;
      if (linkedCount >= 4) break;
    }
  }
}

function startParticlesLoop() {
  if (prefersReducedMotion.matches || !visualFx.particleCanvas) return;
  if (visualFx.particleRafId) return;

  const frame = (timestamp) => {
    if (!visualFx.lastFrameTimestamp) {
      visualFx.lastFrameTimestamp = timestamp;
    }

    const delta = timestamp - visualFx.lastFrameTimestamp;
    const minDelta = visualFx.frameStep > 1 ? 30 : 14;

    if (delta >= minDelta) {
      visualFx.lastFrameTimestamp = timestamp;
      drawParticles();
    }

    visualFx.particleRafId = requestAnimationFrame(frame);
  };

  visualFx.particleRafId = requestAnimationFrame(frame);
}

function stopParticlesLoop() {
  if (!visualFx.particleRafId) return;
  cancelAnimationFrame(visualFx.particleRafId);
  visualFx.particleRafId = null;
  visualFx.lastFrameTimestamp = 0;
}

function ensureAudioContext() {
  if (!visualFx.audioSupported) return null;
  if (visualFx.audioContext) return visualFx.audioContext;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  visualFx.audioContext = new AudioCtx();
  return visualFx.audioContext;
}

function unlockAudioFx() {
  const context = ensureAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }

  visualFx.audioUnlocked = true;
}

function bindAudioUnlock() {
  if (visualFx.audioUnlockBound) return;
  const unlock = () => unlockAudioFx();

  document.addEventListener("pointerdown", unlock, { passive: true });
  document.addEventListener("keydown", unlock, { passive: true });
  visualFx.audioUnlockBound = true;
}

function playTone(frequency, options = {}) {
  if (prefersReducedMotion.matches) return;

  const context = ensureAudioContext();
  if (!context || !visualFx.audioUnlocked) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const type = options.type || "sine";
  const duration = options.duration ?? 0.09;
  const when = context.currentTime + (options.delay ?? 0);
  const gainValue = options.gain ?? 0.04;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, when);
  gainNode.gain.setValueAtTime(0, when);
  gainNode.gain.linearRampToValueAtTime(gainValue, when + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.02);
}

function playUiSound(kind) {
  if (kind === "vote") {
    playTone(420, { type: "triangle", duration: 0.08, gain: 0.03 });
    playTone(620, { type: "triangle", duration: 0.08, gain: 0.024, delay: 0.03 });
    return;
  }

  if (kind === "eliminate") {
    playTone(260, { type: "sawtooth", duration: 0.12, gain: 0.04 });
    playTone(188, { type: "sawtooth", duration: 0.15, gain: 0.035, delay: 0.06 });
    return;
  }

  if (kind === "win") {
    playTone(520, { type: "triangle", duration: 0.1, gain: 0.045 });
    playTone(660, { type: "triangle", duration: 0.12, gain: 0.04, delay: 0.07 });
    playTone(820, { type: "triangle", duration: 0.14, gain: 0.035, delay: 0.14 });
    return;
  }

  if (kind === "badge") {
    playTone(740, { type: "triangle", duration: 0.09, gain: 0.04 });
    playTone(980, { type: "triangle", duration: 0.11, gain: 0.032, delay: 0.06 });
  }
}

function initParticleField() {
  if (visualFx.particleCanvas || prefersReducedMotion.matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "fx-particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  visualFx.particleCanvas = canvas;
  visualFx.particleContext = canvas.getContext("2d", { alpha: true });

  if (!visualFx.particleContext) return;

  resizeParticleCanvas();
  startParticlesLoop();

  if (!visualFx.particleResizeBound) {
    window.addEventListener("resize", resizeParticleCanvas, { passive: true });
    visualFx.particleResizeBound = true;
  }

  if (!visualFx.particleVisibilityBound) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopParticlesLoop();
      } else {
        startParticlesLoop();
      }
    });
    visualFx.particleVisibilityBound = true;
  }
}

function ensurePhaseFlashLayer() {
  if (visualFx.phaseFlashLayer) return visualFx.phaseFlashLayer;

  const flashLayer = document.createElement("div");
  flashLayer.className = "fx-phase-flash";
  flashLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(flashLayer);
  visualFx.phaseFlashLayer = flashLayer;
  return flashLayer;
}

function retriggerClassAnimation(node, className) {
  if (!node) return;
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
  setTimeout(() => node.classList.remove(className), 700);
}

function triggerPhaseCinematic() {
  if (!state.game || !state.room || prefersReducedMotion.matches) return;

  const phase = state.game.phase || "distribution";
  const round = state.game.round || 1;
  const signature = `${state.roomId || "room"}:${phase}:${round}`;

  if (visualFx.phaseSignature === signature) return;
  visualFx.phaseSignature = signature;

  const phaseGradients = {
    distribution: "radial-gradient(66% 52% at 50% 50%, rgba(159, 107, 255, 0.42), rgba(159, 107, 255, 0) 72%)",
    discussion: "radial-gradient(66% 52% at 50% 50%, rgba(107, 141, 255, 0.42), rgba(107, 141, 255, 0) 72%)",
    vote: "radial-gradient(66% 52% at 50% 50%, rgba(255, 108, 174, 0.4), rgba(255, 108, 174, 0) 72%)",
    reveal: "radial-gradient(66% 52% at 50% 50%, rgba(255, 214, 111, 0.4), rgba(255, 214, 111, 0) 72%)",
    end: "radial-gradient(66% 52% at 50% 50%, rgba(75, 228, 173, 0.36), rgba(75, 228, 173, 0) 72%)",
  };

  const flashLayer = ensurePhaseFlashLayer();
  flashLayer.style.background = phaseGradients[phase] || phaseGradients.distribution;
  retriggerClassAnimation(flashLayer, "is-active");

  retriggerClassAnimation(document.querySelector("#view-game .phase-card"), "is-cinematic");
  retriggerClassAnimation($("secret-card"), "is-cinematic-soft");
  retriggerClassAnimation($("round-label"), "is-cinematic");
}

function triggerVoteImpact(received, total) {
  if (!state.room || !state.game || state.game.phase !== "vote") return;

  const signature = `${state.roomId}:${state.game.round || 1}:${received}/${total}`;
  if (visualFx.voteProgressSignature === signature) return;
  visualFx.voteProgressSignature = signature;

  if (received <= 0) return;

  retriggerClassAnimation($("vote-progress"), "is-impact");
  const x = window.innerWidth * (0.3 + Math.random() * 0.4);
  const y = window.innerHeight * (0.62 + Math.random() * 0.2);
  spawnImpactBurst({ x, y, color: "rgba(159, 107, 255", count: received === total ? 44 : 20 });
  playUiSound("vote");
}

function triggerEliminationImpact() {
  if (!state.game || !state.room) return;
  const eliminated = state.game.eliminated || [];
  if (!eliminated.length) return;

  const latestEliminatedId = eliminated[eliminated.length - 1];
  const signature = `${state.roomId}:${state.game.round || 1}:${latestEliminatedId}`;
  if (visualFx.eliminationSignature === signature) return;
  visualFx.eliminationSignature = signature;

  retriggerClassAnimation(document.querySelector("#view-game .card"), "is-shake");
  spawnImpactBurst({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.44, color: "rgba(255, 108, 174", count: 52 });
  playUiSound("eliminate");
}

function triggerVictoryImpact() {
  const winner = state.room?.winner || state.game?.winner;
  if (!winner || state.room?.status !== "finished") return;

  const signature = `${state.roomId}:${winner}:${state.game?.round || state.room?.round || 0}`;
  if (visualFx.winnerSignature === signature) return;
  visualFx.winnerSignature = signature;

  retriggerClassAnimation(document.querySelector("#view-end .end-card"), "is-victory");
  spawnImpactBurst({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.32, color: "rgba(255, 214, 111", count: 76 });
  playUiSound("win");
}

/**
 * Helpers UI status.
 */
function setStatus(node, text, type = "") {
  if (!node) return;
  node.textContent = text;
  node.classList.remove("status-error", "status-ok");
  if (type) node.classList.add(type === "error" ? "status-error" : "status-ok");
}

function getReadableErrorMessage(error, fallback = "Une erreur est survenue") {
  const code = error?.code || "";
  if (code === "permission-denied") {
    return "Permissions Firestore insuffisantes pour cette action. Vérifie tes règles de sécurité.";
  }
  if (code === "unavailable") {
    return "Service temporairement indisponible. Réessaie dans quelques secondes.";
  }
  return error?.message || fallback;
}

async function runWithButtonLoading(button, loadingText, action) {
  if (!button) {
    return action();
  }

  if (button.disabled) return;

  const previousText = button.textContent;
  button.disabled = true;
  if (loadingText) button.textContent = loadingText;

  try {
    return await action();
  } finally {
    button.disabled = false;
    button.textContent = previousText;
  }
}

/**
 * Nettoie les écouteurs Firestore en quittant un scope.
 */
function cleanupRoomSubscriptions() {
  state.roomUnsub?.();
  state.playersUnsub?.();
  state.gameUnsub?.();
  state.roomUnsub = null;
  state.playersUnsub = null;
  state.gameUnsub = null;
  if (state.phaseTickInterval) {
    clearInterval(state.phaseTickInterval);
    state.phaseTickInterval = null;
  }
  state.phaseAutoHandledKey = null;
  state.voteAutoHandledKey = null;
  visualFx.phaseSignature = null;
  visualFx.voteProgressSignature = null;
  visualFx.eliminationSignature = null;
  visualFx.winnerSignature = null;
  visualFx.eliminationNoticeSignature = null;
  state.processedEndSignature = null;
  state.newUnlockedBadges = [];
}

function updateNetworkStatusUI() {
  const networkNode = $("network-status");
  if (!networkNode) return;

  const isOnline = navigator.onLine;
  networkNode.classList.toggle("is-online", isOnline);
  networkNode.classList.toggle("is-offline", !isOnline);
  networkNode.textContent = isOnline ? "En ligne" : "Hors ligne";
}

function bindNetworkEvents() {
  updateNetworkStatusUI();

  window.addEventListener("online", () => {
    updateNetworkStatusUI();
    if ($("lobby-status")) {
      setStatus($("lobby-status"), "Connexion rétablie ✅", "ok");
    }
  });

  window.addEventListener("offline", () => {
    updateNetworkStatusUI();
    if ($("lobby-status")) {
      setStatus($("lobby-status"), "Mode hors ligne: actions limitées", "error");
    }
  });
}

function resetRoomStateToLobby() {
  cleanupRoomSubscriptions();
  setStatus($("vote-status"), "", "");
  state.roomId = null;
  state.room = null;
  state.players = [];
  state.game = null;
  state.preRoomView = "lobby";
  renderAchievementsUI();
  routeFromState();
}

async function maybeAutoResolveVotesByCount(gameState = state.game) {
  if (!state.room || !gameState) return;
  if (state.room.hostId !== state.user?.uid) return;

  if (gameState.phase !== "vote") {
    state.voteAutoHandledKey = null;
    return;
  }

  const aliveIds = state.players.filter((p) => p.alive !== false).map((p) => p.id);
  if (!aliveIds.length) return;

  const votes = gameState.votes || {};
  const allVoted = aliveIds.every((id) => Boolean(votes[id]));

  if (!allVoted) {
    state.voteAutoHandledKey = null;
    return;
  }

  const sortedAlive = [...aliveIds].sort().join(",");
  const sortedVoters = Object.keys(votes).sort().join(",");
  const resolveKey = `${state.roomId}:${gameState.round || 1}:${sortedAlive}:${sortedVoters}`;

  if (state.voteAutoHandledKey === resolveKey) return;
  state.voteAutoHandledKey = resolveKey;

  try {
    await resolveVotesAndEliminate(gameState);
  } catch (error) {
    state.voteAutoHandledKey = null;
    throw error;
  }
}

function timestampToMs(ts) {
  if (!ts) return null;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.seconds === "number") {
    return ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6);
  }
  return null;
}

function getPhaseDurationSec(phase) {
  if (!state.room) return 0;
  if (phase === "discussion") return Number(state.room.discussionDurationSec ?? 60);
  if (phase === "vote") return Number(state.room.voteDurationSec ?? 45);
  return 0;
}

function formatDurationLabel(durationSec, fallbackSec) {
  const value = Number(durationSec ?? fallbackSec);
  if (value <= 0) return "Sans cooldown";
  return `${value}s`;
}

function getForceNextLabel(phase) {
  if (phase === "distribution") return "Passer au moment des discussions";
  if (phase === "discussion") return "Passer au moment des votes";
  if (phase === "vote") return "Passer au moment des discussions";
  return "Passer au moment des votes";
}

function getPhaseRemainingSec(gameState = state.game) {
  if (!gameState) return null;
  const durationSec = Number(gameState.phaseDurationSec ?? getPhaseDurationSec(gameState.phase));
  if (!durationSec) return null;

  const startedMs = timestampToMs(gameState.phaseStartedAt);
  if (!startedMs) return durationSec;

  const elapsedSec = Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
  return Math.max(0, durationSec - elapsedSec);
}

function renderPhaseTimer() {
  const timerCircleNode = $("phase-timer-circle");
  const timerCircleProgressNode = $("phase-timer-circle-progress");
  const timerCircleLabelNode = $("phase-timer-circle-label");
  if (!state.room || !state.game) return;

  const remaining = getPhaseRemainingSec(state.game);
  if (remaining === null) {
    timerCircleNode?.classList.add("hidden");
    timerCircleNode?.classList.remove("is-warning");
    return;
  }

  const phaseDurationSec = Number(state.game.phaseDurationSec ?? getPhaseDurationSec(state.game.phase));
  const progressRatio = phaseDurationSec > 0 ? Math.max(0, Math.min(1, remaining / phaseDurationSec)) : 0;
  const circleRadius = 26;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference * (1 - progressRatio);

  if (timerCircleNode && timerCircleProgressNode && timerCircleLabelNode) {
    timerCircleNode.classList.remove("hidden");
    timerCircleNode.classList.toggle("is-warning", remaining <= 10);
    timerCircleLabelNode.textContent = `${remaining}s`;
    timerCircleProgressNode.style.strokeDasharray = `${circleCircumference}`;
    timerCircleProgressNode.style.strokeDashoffset = `${circleOffset}`;
    timerCircleNode.setAttribute("aria-valuenow", String(Math.round(progressRatio * 100)));
  }
}

async function maybeAutoAdvanceByTimer() {
  if (!state.room || !state.game || state.room.hostId !== state.user?.uid) return;

  const remaining = getPhaseRemainingSec(state.game);
  if (remaining === null || remaining > 0) return;

  const key = `${state.roomId}:${state.game.phase}:${state.game.round || 1}`;
  if (state.phaseAutoHandledKey === key) return;
  state.phaseAutoHandledKey = key;

  if (state.game.phase === "discussion") {
    await forceNextPhase();
    return;
  }

  if (state.game.phase === "vote") {
    await resolveVotesAndEliminate();
  }
}

function ensurePhaseTicker() {
  if (state.phaseTickInterval) return;

  state.phaseTickInterval = setInterval(() => {
    if (!state.room || !state.game) return;
    renderPhaseTimer();
    maybeAutoAdvanceByTimer().catch((error) => {
      console.error("Phase timer auto-advance error:", error);
    });
  }, 1000);
}

/**
 * Détermine le nom joueur depuis l'email.
 */
function buildProfileName(email) {
  return email.split("@")[0].slice(0, 14);
}

function buildDisplayName(name, icon) {
  return `${icon || "🕵️"} ${name || "Player"}`;
}

function getLocalProfileFallback(email = "player") {
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return { displayName: buildProfileName(email), icon: "🕵️" };
    const parsed = JSON.parse(raw);
    const displayName = (parsed.displayName || buildProfileName(email)).slice(0, 18);
    const icon = PROFILE_ICONS.includes(parsed.icon) ? parsed.icon : "🕵️";
    return { displayName, icon };
  } catch {
    return { displayName: buildProfileName(email), icon: "🕵️" };
  }
}

function loadAccessibilityPreferences() {
  try {
    const raw = localStorage.getItem(USER_ACCESSIBILITY_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.accessibilityLargeText = Boolean(parsed.largeText);
    state.accessibilityHighContrast = Boolean(parsed.highContrast);
  } catch {
    state.accessibilityLargeText = false;
    state.accessibilityHighContrast = false;
  }
}

function persistAccessibilityPreferences() {
  try {
    localStorage.setItem(
      USER_ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify({
        largeText: state.accessibilityLargeText,
        highContrast: state.accessibilityHighContrast,
      })
    );
  } catch {
    // Ignore localStorage failures silently.
  }
}

function applyAccessibilityPreferences() {
  document.body.classList.toggle("a11y-large-text", state.accessibilityLargeText);
  document.body.classList.toggle("a11y-high-contrast", state.accessibilityHighContrast);
}

function renderAccessibilityControls() {
  const largeTextNode = $("a11y-large-text");
  const highContrastNode = $("a11y-high-contrast");
  if (!largeTextNode || !highContrastNode) return;

  largeTextNode.checked = state.accessibilityLargeText;
  highContrastNode.checked = state.accessibilityHighContrast;
}

function createDefaultAchievementsState() {
  return Object.fromEntries(ACHIEVEMENT_DEFINITIONS.map((achievement) => [achievement.key, false]));
}

function loadAchievementProgress() {
  state.achievements = createDefaultAchievementsState();
  state.badgeStats = { gamesPlayed: 0 };

  try {
    const raw = localStorage.getItem(USER_ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    const loadedAchievements = parsed.achievements || {};
    ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
      state.achievements[achievement.key] = Boolean(loadedAchievements[achievement.key]);
    });

    state.badgeStats.gamesPlayed = Number(parsed.gamesPlayed || 0);
  } catch {
    state.achievements = createDefaultAchievementsState();
    state.badgeStats = { gamesPlayed: 0 };
  }
}

function persistAchievementProgress() {
  try {
    localStorage.setItem(
      USER_ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify({
        achievements: state.achievements,
        gamesPlayed: state.badgeStats.gamesPlayed,
      })
    );
  } catch {
    // Ignore localStorage failures silently.
  }
}

function renderBadgesInNode(listNode, options = {}) {
  if (!listNode) return;
  const highlightKeys = new Set(options.highlightKeys || []);
  const includeLocked = options.includeLocked !== false;

  listNode.innerHTML = "";

  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    const unlocked = Boolean(state.achievements[achievement.key]);
    if (!includeLocked && !unlocked) return;

    const li = document.createElement("li");
    li.className = `badge-item${unlocked ? "" : " is-locked"}${highlightKeys.has(achievement.key) ? " is-new" : ""}`;
    li.innerHTML = `${achievement.icon} ${achievement.title}<small>${achievement.description}</small>`;
    listNode.appendChild(li);
  });
}

function renderAchievementsUI() {
  renderBadgesInNode($("profile-badges"), { includeLocked: true });

  const unlockedCount = ACHIEVEMENT_DEFINITIONS.filter((achievement) => state.achievements[achievement.key]).length;
  const statsNode = $("profile-badge-stats");
  if (statsNode) {
    statsNode.textContent = `Succès: ${unlockedCount}/${ACHIEVEMENT_DEFINITIONS.length} · Parties: ${state.badgeStats.gamesPlayed}`;
  }

  const endWrap = $("end-unlocks-wrap");
  const hasNewUnlocks = state.newUnlockedBadges.length > 0;
  endWrap?.classList.toggle("hidden", !hasNewUnlocks);
  renderBadgesInNode($("end-unlocks"), { includeLocked: false, highlightKeys: state.newUnlockedBadges });
}

function showAchievementToast(achievement) {
  const toastNode = $("achievement-toast");
  if (!toastNode || !achievement) return;

  toastNode.textContent = `${achievement.icon} Succès débloqué: ${achievement.title}`;
  retriggerClassAnimation(toastNode, "is-visible");

  spawnImpactBurst({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.74,
    color: "rgba(255, 214, 111",
    count: 46,
  });
  playUiSound("badge");
}

function persistLocalProfile() {
  try {
    localStorage.setItem(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: state.profileName,
        icon: state.profileIcon,
      })
    );
  } catch {
    // Ignore localStorage failures silently.
  }
}

function updateProfilePreview() {
  $("profile-preview-icon").textContent = state.profileIcon || "🕵️";
  $("profile-preview-name").textContent = state.profileName || "Player";
}

function updateProfileIconSelectionUI() {
  document.querySelectorAll(".icon-option").forEach((button) => {
    const selected = button.dataset.icon === state.profileIcon;
    button.classList.toggle("is-selected", selected);
  });
}

function setProfileTab(tabKey) {
  state.profileTab = tabKey === "badges" ? "badges" : "customize";

  const customizeButton = $("btn-profile-tab-customize");
  const badgesButton = $("btn-profile-tab-badges");
  const customizePanel = $("profile-tab-customize");
  const badgesPanel = $("profile-tab-badges");

  const showCustomize = state.profileTab === "customize";
  customizeButton?.classList.toggle("is-active", showCustomize);
  badgesButton?.classList.toggle("is-active", !showCustomize);
  customizePanel?.classList.toggle("hidden", !showCustomize);
  badgesPanel?.classList.toggle("hidden", showCustomize);
}

function renderProfileView() {
  if (!state.user) return;
  $("profile-name").value = state.profileName;
  updateProfilePreview();
  updateProfileIconSelectionUI();
  setProfileTab(state.profileTab);
  renderAchievementsUI();
}

async function loadUserProfile(user) {
  const localProfile = getLocalProfileFallback(user.email || "player");
  state.profileName = localProfile.displayName;
  state.profileIcon = localProfile.icon;

  try {
    const profileRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        displayName: state.profileName,
        icon: state.profileIcon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      persistLocalProfile();
      return;
    }

    const data = profileSnap.data();
    state.profileName = (data.displayName || state.profileName).slice(0, 18);
    state.profileIcon = PROFILE_ICONS.includes(data.icon) ? data.icon : state.profileIcon;
    persistLocalProfile();
  } catch (error) {
    console.warn("Profile Firestore access denied/fallback local:", error?.message || error);
  }
}

async function saveUserProfile() {
  if (!state.user) return;

  const typedName = $("profile-name").value.trim();
  if (!typedName) {
    setStatus($("profile-status"), "Le pseudo ne peut pas être vide", "error");
    return;
  }

  state.profileName = typedName.slice(0, 18);
  persistLocalProfile();

  try {
    const profileRef = doc(db, "users", state.user.uid);
    await setDoc(
      profileRef,
      {
        displayName: state.profileName,
        icon: state.profileIcon,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Unable to save profile in users collection:", error?.message || error);
  }

  if (state.roomId) {
    await setDoc(
      doc(db, "rooms", state.roomId, "players", state.user.uid),
      {
        displayName: state.profileName,
        icon: state.profileIcon,
      },
      { merge: true }
    );

    if (state.room?.hostId === state.user.uid) {
      await updateDoc(doc(db, "rooms", state.roomId), {
        hostName: state.profileName,
        hostIcon: state.profileIcon,
        updatedAt: serverTimestamp(),
      });
    }
  }

  updateProfilePreview();
  setStatus($("profile-status"), "Profil enregistré ✅", "ok");
}

/**
 * Auth UI mode (connexion/inscription).
 */
function updateAuthModeUI() {
  const loginTab = $("btn-tab-login");
  const signupTab = $("btn-tab-signup");
  const submit = $("btn-auth-submit");

  loginTab.classList.toggle("is-active", state.authMode === "login");
  signupTab.classList.toggle("is-active", state.authMode === "signup");
  submit.textContent = state.authMode === "login" ? "Se connecter" : "Créer le compte";
}

/**
 * Crée ou met à jour le document joueur dans le salon.
 */
async function upsertPlayerInRoom(roomId) {
  const playerRef = doc(db, "rooms", roomId, "players", state.user.uid);
  await setDoc(
    playerRef,
    {
      userId: state.user.uid,
      displayName: state.profileName,
      icon: state.profileIcon,
      alive: true,
      role: null,
      word: null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function cleanupLegacyTestRooms() {
  if (!state.user) return;

  const testRoomsSnap = await getDocs(
    query(collection(db, "rooms"), where("demoOwnerId", "==", state.user.uid), where("isDemoRoom", "==", true))
  );

  await Promise.all(
    testRoomsSnap.docs.map(async (roomDoc) => {
      const playersSnap = await getDocs(collection(db, "rooms", roomDoc.id, "players"));
      await Promise.all(playersSnap.docs.map((p) => deleteDoc(doc(db, "rooms", roomDoc.id, "players", p.id))));
      await deleteDoc(doc(db, "rooms", roomDoc.id));
    })
  );
}

/**
 * Charge les salons publics en temps réel.
 */
function subscribeRoomsList() {
  state.roomsUnsub?.();
  const roomsRef = collection(db, "rooms");
  const qRooms = query(roomsRef, where("status", "in", ["waiting", "playing"]));

  state.roomsUnsub = onSnapshot(
    qRooms,
    async (snap) => {
      const snapshotToken = ++state.roomsSnapshotToken;
      const nowSec = Math.floor(Date.now() / 1000);
      const rooms = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((r) => r.public === true)
        .filter((r) => r.isDemoRoom !== true)
        .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

      const roomsWithCounts = await Promise.all(
        rooms.map(async (room) => {
          try {
            const countSnap = await getCountFromServer(collection(db, "rooms", room.id, "players"));
            return { ...room, livePlayers: Number(countSnap.data().count || 0) };
          } catch {
            return { ...room, livePlayers: Number(room.currentPlayers || 0) };
          }
        })
      );

      if (snapshotToken !== state.roomsSnapshotToken) {
        return;
      }

      const visibleRooms = roomsWithCounts.filter((room) => {
        const currentPlayers = Number(room.livePlayers || 0);
        const createdSec = Number(room.createdAt?.seconds || nowSec);
        const ageSec = Math.max(0, nowSec - createdSec);
        if (room.status === "playing") return true;
        if (currentPlayers > 0) return true;
        return ageSec < 120;
      });

      roomsWithCounts
        .filter((room) => {
          const createdSec = Number(room.createdAt?.seconds || nowSec);
          const ageSec = Math.max(0, nowSec - createdSec);
          return room.status === "waiting" && Number(room.livePlayers || 0) === 0 && ageSec >= 120;
        })
        .forEach((room) => {
          if (EMPTY_ROOM_CLEANUP_ATTEMPTS.has(room.id)) return;
          EMPTY_ROOM_CLEANUP_ATTEMPTS.add(room.id);
          deleteRoomIfEmpty(room.id).catch((error) => {
            console.warn("Nettoyage auto room vide impossible:", error);
          });
        });

      renderRooms(visibleRooms);
    },
    (error) => {
      console.error("Rooms listener error:", error);
      setStatus($("auth-status"), "Permissions Firestore insuffisantes pour lire les salons", "error");
    }
  );
}

/**
 * Rend la liste des salons dans le lobby.
 */
function renderRooms(rooms) {
  const list = $("rooms-list");
  const empty = $("lobby-empty");
  list.innerHTML = "";

  if (!rooms.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  rooms.forEach((room) => {
    const hostIdentity = buildDisplayName(room.hostName, room.hostIcon);
    const playersCount = Number(room.livePlayers ?? room.currentPlayers ?? 0);
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="row between center">
        <div>
          <div>${room.name}</div>
          <small>${hostIdentity} · ${playersCount}/${room.maxPlayers} · ${room.status}</small>
        </div>
        <button class="btn btn-small" data-room-join="${room.id}">Rejoindre</button>
      </div>
    `;
    list.appendChild(li);
  });
}

/**
 * Crée un nouveau salon public.
 * Structure Firestore: rooms/{roomId}/players/{playerId}
 */
async function createRoom() {
  if (!state.user) {
    throw new Error("Tu dois être connecté pour créer un salon");
  }

  const name = $("room-name").value.trim();
  const maxPlayers = Number($("room-max-players").value);
  const discussionDurationSec = Number($("room-discussion-time").value);
  const voteDurationSec = Number($("room-vote-time").value);
  const maxRounds = Number($("room-max-rounds").value);
  const mrWhiteEnabled = $("room-mr-white-enabled").checked;
  const anonymousVote = $("room-anonymous-vote").checked;

  if (!name) {
    throw new Error("Choisis un nom de salon");
  }
  if (!Number.isFinite(maxPlayers) || maxPlayers < 3 || maxPlayers > 15) {
    throw new Error("Nombre de joueurs invalide (3 à 15)");
  }
  if (!Number.isFinite(discussionDurationSec) || discussionDurationSec < 0 || discussionDurationSec > 300) {
    throw new Error("Temps de discussion invalide (0 à 300)");
  }
  if (!Number.isFinite(voteDurationSec) || voteDurationSec < 0 || voteDurationSec > 180) {
    throw new Error("Temps de vote invalide (0 à 180)");
  }
  if (!Number.isFinite(maxRounds) || maxRounds < 2 || maxRounds > 12) {
    throw new Error("Nombre max de manches invalide (2 à 12)");
  }

  const roomDoc = await addDoc(collection(db, "rooms"), {
    name,
    hostId: state.user.uid,
    hostName: state.profileName,
    hostIcon: state.profileIcon,
    maxPlayers,
    currentPlayers: 1,
    discussionDurationSec,
    voteDurationSec,
    maxRounds,
    mrWhiteEnabled,
    anonymousVote,
    public: true,
    status: "waiting",
    phase: "distribution",
    round: 1,
    winner: null,
    pair: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await upsertPlayerInRoom(roomDoc.id);
  state.preRoomView = "lobby";
  await joinRoom(roomDoc.id);
}

/**
 * Rejoint un salon et s'abonne aux flux room/players/game.
 */
async function joinRoom(roomId) {
  cleanupRoomSubscriptions();

  const roomRef = doc(db, "rooms", roomId);
  const myPlayerRef = doc(db, "rooms", roomId, "players", state.user.uid);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) {
    throw new Error("Salon introuvable");
  }

  const roomData = roomSnap.data();
  if (roomData.status === "finished") {
    throw new Error("Cette partie est déjà terminée");
  }

  try {
    await runTransaction(db, async (tx) => {
      const txRoomSnap = await tx.get(roomRef);
      if (!txRoomSnap.exists()) {
        throw new Error("Salon introuvable");
      }

      const txRoomData = txRoomSnap.data();
      if (txRoomData.status === "finished") {
        throw new Error("Cette partie est déjà terminée");
      }

      const myPlayerSnap = await tx.get(myPlayerRef);
      if (!myPlayerSnap.exists()) {
        const current = Number(txRoomData.currentPlayers || 0);
        if (current >= Number(txRoomData.maxPlayers || 0)) {
          throw new Error("Salon complet");
        }

        tx.set(myPlayerRef, {
          userId: state.user.uid,
          displayName: state.profileName,
          icon: state.profileIcon,
          alive: true,
          role: null,
          word: null,
          createdAt: serverTimestamp(),
        });

        if (txRoomData.hostId === state.user.uid) {
          tx.update(roomRef, {
            currentPlayers: current + 1,
            updatedAt: serverTimestamp(),
          });
        }
      }
    });
  } catch (error) {
    throw new Error(getReadableErrorMessage(error, "Impossible de rejoindre ce salon"));
  }

  state.roomId = roomId;

  state.roomUnsub = onSnapshot(
    roomRef,
    (snap) => {
      if (!snap.exists()) {
        resetRoomStateToLobby();
        return;
      }
      const roomPayload = { id: snap.id, ...snap.data() };
      if (roomPayload.status === "closed") {
        resetRoomStateToLobby();
        return;
      }
      state.room = roomPayload;
      renderRoomView();
      renderEndReveal();
      routeFromState();
    },
    (error) => console.error("Room listener error:", error)
  );

  state.playersUnsub = onSnapshot(
    collection(db, "rooms", roomId, "players"),
    (snap) => {
      state.players = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      renderRoomPlayers();
      renderVoteOptions();
      renderVoteProgress();
      renderVoteFeed();
      renderEndReveal();
      maybeAutoResolveVotesByCount().catch((error) => {
        console.error("Auto-resolve vote (players listener) error:", error);
      });
    },
    (error) => console.error("Players listener error:", error)
  );

  state.gameUnsub = onSnapshot(
    doc(db, "rooms", roomId, "game", "state"),
    (snap) => {
      state.game = snap.exists() ? snap.data() : null;
      renderVoteProgress();
      renderVoteFeed();
      renderGameView();
      renderEndReveal();
      maybeAutoResolveVotesByCount().catch((error) => {
        console.error("Auto-resolve vote (game listener) error:", error);
      });
      routeFromState();
    },
    (error) => console.error("Game listener error:", error)
  );
}

/**
 * Quitte un salon (et supprime joueur du sous-ensemble).
 */
async function leaveRoom() {
  if (!state.roomId) return;

  const roomId = state.roomId;
  const roomRef = doc(db, "rooms", roomId);
  const playerRef = doc(db, "rooms", roomId, "players", state.user.uid);
  const roomSnapBefore = await getDoc(roomRef);
  const wasHost = roomSnapBefore.exists() && roomSnapBefore.data().hostId === state.user.uid;

  await runTransaction(db, async (tx) => {
    const roomSnap = await tx.get(roomRef);
    if (!roomSnap.exists()) return;

    const roomData = roomSnap.data();
    const playerSnap = await tx.get(playerRef);
    const current = Number(roomData.currentPlayers || 0);

    if (playerSnap.exists()) {
      tx.delete(playerRef);

      if (roomData.hostId === state.user.uid) {
        tx.update(roomRef, {
          currentPlayers: Math.max(0, current - 1),
          updatedAt: serverTimestamp(),
        });
      }
    }
  });

  if (wasHost) {
    await transferHostIfNeeded(roomId);
  }

  await deleteRoomIfEmpty(roomId);

  cleanupRoomSubscriptions();
  setStatus($("vote-status"), "", "");
  renderVoteFeed();
  state.roomId = null;
  state.room = null;
  state.players = [];
  state.game = null;
  state.preRoomView = "lobby";
  setView("lobby");
}

async function transferHostIfNeeded(roomId) {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) return;

  const roomData = roomSnap.data();
  if (roomData.hostId !== state.user.uid) return;

  const playersSnap = await getDocs(collection(db, "rooms", roomId, "players"));
  if (playersSnap.empty) return;

  const nextHostDoc = playersSnap.docs[0];
  const nextHostData = nextHostDoc.data();

  await updateDoc(roomRef, {
    hostId: nextHostDoc.id,
    hostName: nextHostData.displayName || "Joueur",
    hostIcon: nextHostData.icon || "🕵️",
    currentPlayers: playersSnap.size,
    updatedAt: serverTimestamp(),
  });
}

async function deleteRoomIfEmpty(roomId) {
  const playersSnap = await getDocs(collection(db, "rooms", roomId, "players"));
  if (!playersSnap.empty) return;

  try {
    await deleteDoc(doc(db, "rooms", roomId, "game", "state"));
  } catch (error) {
    if (error?.code !== "not-found") {
      console.warn("Suppression game/state impossible:", error);
    }
  }

  try {
    await deleteDoc(doc(db, "rooms", roomId));
  } catch (error) {
    console.warn("Suppression room impossible:", error);
  }
}

async function closeRoomForEveryone(roomId) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    status: "closed",
    public: false,
    phase: "end",
    updatedAt: serverTimestamp(),
  });

  try {
    await updateDoc(doc(db, "rooms", roomId, "game", "state"), {
      phase: "end",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error?.code !== "not-found") {
      console.warn("Mise à jour game/state impossible:", error);
    }
  }
}

/**
 * Distribue rôles et mots en début de manche.
 */
function buildRoleDistribution(playersCount, mrWhiteEnabled) {
  const roles = new Array(playersCount).fill("civil");
  const undercoverIdx = Math.floor(Math.random() * playersCount);
  roles[undercoverIdx] = "undercover";

  if (mrWhiteEnabled && playersCount >= 3) {
    const civilIndices = roles
      .map((role, idx) => (role === "civil" ? idx : null))
      .filter((idx) => idx !== null);

    if (civilIndices.length) {
      const mrWhiteIdx = civilIndices[Math.floor(Math.random() * civilIndices.length)];
      roles[mrWhiteIdx] = "mrwhite";
    }
  }

  return roles;
}

/**
 * Lance une partie: crée rooms/{roomId}/game/state + assigne rôle/mot aux joueurs.
 */
async function startGame() {
  if (!state.room || state.room.hostId !== state.user.uid) {
    throw new Error("Seul l'hôte peut lancer la partie");
  }

  const alivePlayers = state.players.filter((p) => p.alive !== false);
  if (alivePlayers.length < 3) {
    throw new Error("Minimum 3 joueurs requis");
  }

  const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
  const roles = buildRoleDistribution(alivePlayers.length, state.room.mrWhiteEnabled);
  state.newUnlockedBadges = [];
  renderAchievementsUI();

  await Promise.all(
    alivePlayers.map((player, idx) => {
      const role = roles[idx];
      let word = pair[0];
      if (role === "undercover") word = pair[1];
      if (role === "mrwhite") word = "";

      return updateDoc(doc(db, "rooms", state.roomId, "players", player.id), {
        role,
        word,
        alive: true,
      });
    })
  );

  await setDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: "distribution",
    round: 1,
    phaseStartedAt: serverTimestamp(),
    phaseDurationSec: 0,
    votes: {},
    eliminated: [],
    logs: [],
    pair,
    revealMrWhiteGuess: null,
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "rooms", state.roomId), {
    status: "playing",
    phase: "distribution",
    round: 1,
    winner: null,
    pair,
    updatedAt: serverTimestamp(),
  });

  setStatus($("vote-status"), "", "");
  renderVoteFeed();
}

/**
 * Force la phase suivante (hôte).
 */
async function forceNextPhase() {
  if (!state.room || state.room.hostId !== state.user.uid || !state.game) return;

  if (state.game.phase === "vote") {
    await skipVoteAndStartDiscussion();
    return;
  }

  const transitions = {
    distribution: "discussion",
    discussion: "vote",
    reveal: "discussion",
  };

  const next = transitions[state.game.phase] || "discussion";
  const nextDurationSec = getPhaseDurationSec(next);

  await updateDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: next,
    phaseStartedAt: serverTimestamp(),
    phaseDurationSec: nextDurationSec,
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "rooms", state.roomId), {
    phase: next,
    updatedAt: serverTimestamp(),
  });
}

async function skipVoteAndStartDiscussion() {
  if (!state.room || !state.game) return;
  if (state.room.hostId !== state.user?.uid) return;
  if (state.game.phase !== "vote") return;

  const nextRound = (state.game.round || 1) + 1;
  const maxRounds = state.room?.maxRounds || 6;
  if (nextRound > maxRounds) {
    await setGameWinner(computeWinnerByRoundLimit());
    return;
  }

  await updateDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: "discussion",
    round: nextRound,
    phaseStartedAt: serverTimestamp(),
    phaseDurationSec: getPhaseDurationSec("discussion"),
    votes: {},
    eliminated: [...(state.game.eliminated || [])],
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "rooms", state.roomId), {
    phase: "discussion",
    round: nextRound,
    updatedAt: serverTimestamp(),
  });

  setStatus($("vote-status"), "Vote passé par l'hôte → nouvelle discussion", "ok");
  renderVoteFeed();
}

/**
 * Vote d'un joueur vers une cible.
 */
async function submitVote(targetId) {
  if (!state.roomId || !state.game) return;

  const gameRef = doc(db, "rooms", state.roomId, "game", "state");
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const votes = { ...(data.votes || {}) };
    votes[state.user.uid] = targetId;

    tx.update(gameRef, { votes, updatedAt: serverTimestamp() });
  });

  setStatus($("vote-status"), "Vote enregistré ✅", "ok");

  const latestGameSnap = await getDoc(gameRef);
  if (!latestGameSnap.exists()) return;

  const latestGame = latestGameSnap.data();
  await maybeAutoResolveVotesByCount(latestGame);
}

/**
 * Résout le vote et élimine la cible majoritaire.
 */
async function resolveVotesAndEliminate(gameData = state.game) {
  if (!gameData) return;

  const tally = {};
  Object.values(gameData.votes || {}).forEach((targetId) => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const eliminatedId = sorted[0]?.[0];
  if (!eliminatedId) return;

  await updateDoc(doc(db, "rooms", state.roomId, "players", eliminatedId), { alive: false });

  const eliminatedList = [...(gameData.eliminated || []), eliminatedId];
  const winner = computeWinnerAfterElimination(eliminatedId);

  if (winner) {
    await setGameWinner(winner);
    return;
  }

  const nextRound = (gameData.round || 1) + 1;
  const maxRounds = state.room?.maxRounds || 6;
  if (nextRound > maxRounds) {
    await setGameWinner(computeWinnerByRoundLimit());
    return;
  }

  await updateDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: "discussion",
    round: nextRound,
    phaseStartedAt: serverTimestamp(),
    phaseDurationSec: getPhaseDurationSec("discussion"),
    votes: {},
    eliminated: eliminatedList,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "rooms", state.roomId), {
    phase: "discussion",
    round: nextRound,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Conditions de victoire simplifiées:
 * - Undercover mort => Civils gagnent.
 * - Si 2 joueurs vivants et undercover vivant => Undercover gagne.
 * - Mr.White dernier survivant spécial => Mr.White gagne.
 */
function computeWinnerAfterElimination(eliminatedId = null) {
  const playersNow = state.players.map((p) => ({ ...p }));
  if (eliminatedId) {
    const eliminatedPlayer = playersNow.find((p) => p.id === eliminatedId);
    if (eliminatedPlayer) eliminatedPlayer.alive = false;
  }
  const alive = playersNow.filter((p) => p.alive !== false);

  const undercoverAlive = alive.some((p) => p.role === "undercover");
  const mrWhiteAlive = alive.some((p) => p.role === "mrwhite");

  if (!undercoverAlive && !mrWhiteAlive) return "civils";
  if (!undercoverAlive && mrWhiteAlive) return "mrwhite";
  if (alive.length <= 2 && undercoverAlive) return "undercover";
  return null;
}

function computeWinnerByRoundLimit() {
  const alive = state.players.filter((p) => p.alive !== false);
  const undercoverAlive = alive.some((p) => p.role === "undercover");
  const mrWhiteAlive = alive.some((p) => p.role === "mrwhite");

  if (undercoverAlive) return "undercover";
  if (mrWhiteAlive) return "mrwhite";
  return "civils";
}

function renderVoteProgress() {
  if (!state.room || !state.game) return;

  const alivePlayers = state.players.filter((p) => p.alive !== false);
  const votes = state.game.votes || {};
  const received = alivePlayers.filter((p) => votes[p.id]).length;
  const total = alivePlayers.length;

  const progressNode = $("vote-progress");
  if (!progressNode) return;

  if (state.game.phase !== "vote") {
    setStatus(progressNode, "", "");
    return;
  }

  const statusType = received === total && total > 0 ? "ok" : "";
  setStatus(progressNode, `Votes: ${received}/${total}`, statusType);
  triggerVoteImpact(received, total);
}

function renderVoteFeed() {
  const feedNode = $("vote-feed");
  if (!feedNode) return;

  feedNode.innerHTML = "";

  if (!state.room || !state.game || state.game.phase !== "vote") {
    feedNode.classList.add("hidden");
    return;
  }

  if (state.room.anonymousVote) {
    feedNode.classList.add("hidden");
    return;
  }

  const votes = state.game.votes || {};
  const voteEntries = Object.entries(votes);
  if (!voteEntries.length) {
    feedNode.classList.add("hidden");
    return;
  }

  const playersById = Object.fromEntries(state.players.map((p) => [p.id, p]));
  voteEntries.forEach(([voterId, targetId]) => {
    const voterName = playersById[voterId]?.displayName || "Joueur";
    const targetName = playersById[targetId]?.displayName || "Joueur";
    const li = document.createElement("li");
    li.textContent = `${voterName} a voté pour ${targetName}`;
    feedNode.appendChild(li);
  });

  feedNode.classList.remove("hidden");
}

/**
 * Finalise la partie et affiche l'écran end.
 */
async function setGameWinner(winner) {
  await updateDoc(doc(db, "rooms", state.roomId), {
    status: "finished",
    winner,
    phase: "end",
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: "end",
    winner,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Rejouer avec les mêmes joueurs (hôte uniquement).
 */
async function rematch() {
  if (!state.room || state.room.hostId !== state.user.uid) return;

  state.newUnlockedBadges = [];
  renderAchievementsUI();

  await Promise.all(
    state.players.map((p) =>
      updateDoc(doc(db, "rooms", state.roomId, "players", p.id), {
        alive: true,
        role: null,
        word: null,
      })
    )
  );

  await setDoc(doc(db, "rooms", state.roomId, "game", "state"), {
    phase: "distribution",
    round: 1,
    phaseStartedAt: serverTimestamp(),
    phaseDurationSec: 0,
    votes: {},
    eliminated: [],
    winner: null,
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "rooms", state.roomId), {
    status: "waiting",
    phase: "distribution",
    round: 1,
    winner: null,
    updatedAt: serverTimestamp(),
  });

  setStatus($("vote-status"), "", "");
  renderVoteFeed();
}

/**
 * Routing SPA minimal selon les états room/game.
 */
function routeFromState() {
  let targetView = "room";

  if (!state.user) {
    targetView = "auth";
  } else if (!state.roomId) {
    targetView = state.preRoomView || "lobby";
  } else if (state.room?.status === "finished" || state.game?.phase === "end") {
    targetView = "end";
  } else if (state.room?.status === "playing") {
    targetView = "game";
  }

  setView(targetView);
  updateTabBar();
}

/**
 * Rendu du salon.
 */
function renderRoomView() {
  if (!state.room) return;
  $("room-title").textContent = state.room.name;
  $("room-host-name").textContent = buildDisplayName(state.room.hostName, state.room.hostIcon);
  const liveCount = state.players.length || Number(state.room.currentPlayers || 0);
  $("room-player-count").textContent = String(liveCount);
  $("room-player-max").textContent = String(state.room.maxPlayers || 0);
  $("room-vote-type").textContent = state.room.anonymousVote ? "Anonyme" : "Visible";
  $("room-mr-white-label").textContent = state.room.mrWhiteEnabled ? "Actif" : "Désactivé";
  $("room-discussion-time-label").textContent = formatDurationLabel(state.room.discussionDurationSec, 60);
  $("room-vote-time-label").textContent = formatDurationLabel(state.room.voteDurationSec, 45);
  $("room-max-rounds-label").textContent = String(state.room.maxRounds || 6);

  const isHost = state.room.hostId === state.user?.uid;
  const isPlaying = state.room.status === "playing";
  const nextPhaseLabel = getForceNextLabel(state.room.phase || "discussion");
  $("btn-force-next").textContent = nextPhaseLabel;
  $("btn-force-next-game").textContent = nextPhaseLabel;

  $("btn-start-game").classList.toggle("hidden", !isHost);
  $("btn-force-next").classList.toggle("hidden", !(isHost && isPlaying));
}

/**
 * Rendu liste joueurs.
 */
function renderRoomPlayers() {
  const ul = $("players-list");
  ul.innerHTML = "";

  state.players
    .sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""))
    .forEach((player) => {
      const li = document.createElement("li");
      const isDead = player.alive === false;
      const icon = player.icon || "🕵️";
      li.textContent = `${icon} ${player.displayName}${player.id === state.room?.hostId ? " 👑" : ""}${isDead ? " (OUT)" : ""}`;
      ul.appendChild(li);
    });
}

/**
 * Rendu section jeu + secret joueur.
 */
function renderGameView() {
  if (!state.room || !state.game) return;

  $("round-label").textContent = `Manche ${state.game.round || 1}`;

  const phaseText = {
    distribution: "Regarde ton mot en secret, puis attends que l'hôte lance les discussions.",
    discussion: `Tu es en discussion (${formatDurationLabel(state.room.discussionDurationSec, 60)}) : décris ton mot sans jamais le prononcer.`,
    vote: `Tu es au vote (${formatDurationLabel(state.room.voteDurationSec, 45)}) : choisis un suspect.`,
    reveal: "Résolution: élimination puis nouvelle manche.",
    end: "La partie est terminée.",
  };
  $("phase-description").textContent = phaseText[state.game.phase] || "Phase inconnue";
  $("btn-force-next-game").textContent = getForceNextLabel(state.game.phase);
  $("btn-force-next-game").classList.toggle("hidden", state.room.hostId !== state.user?.uid);

  triggerPhaseCinematic();

  const me = state.players.find((p) => p.id === state.user.uid);
  const wordButton = $("btn-reveal-role");

  if (!me) return;

  if (state.mySecretRevealed) {
    wordButton.textContent = me.role === "mrwhite" ? "" : `${me.word || "-"}`;
  } else {
    wordButton.textContent = "👁️";
  }

  const formVote = $("form-vote");
  const canVote = state.game.phase === "vote" && me.alive !== false;
  formVote.classList.toggle("hidden", !canVote);

  const myVote = (state.game.votes || {})[state.user.uid];
  if (state.game.phase !== "vote" || !myVote) {
    setStatus($("vote-status"), "", "");
  }

  renderVoteProgress();
  renderVoteFeed();
  renderEliminationFeedback();
  triggerEliminationImpact();

  renderPhaseTimer();
  ensurePhaseTicker();
  maybeAutoAdvanceByTimer().catch((error) => {
    console.error("Auto-advance render cycle error:", error);
  });
}

function renderEliminationFeedback() {
  const feedbackNode = $("elimination-feedback");
  if (!feedbackNode) return;

  if (!state.game || !state.room) {
    feedbackNode.classList.add("hidden");
    return;
  }

  const eliminated = state.game.eliminated || [];
  const latestEliminatedId = eliminated[eliminated.length - 1];
  if (!latestEliminatedId) {
    feedbackNode.classList.add("hidden");
    return;
  }

  const eliminatedPlayer = state.players.find((player) => player.id === latestEliminatedId);
  const eliminatedName = eliminatedPlayer?.displayName || "Un joueur";
  feedbackNode.textContent = `🔻 ${eliminatedName} a été éliminé`;
  feedbackNode.classList.remove("hidden");

  const signature = `${state.roomId}:${latestEliminatedId}:${eliminated.length}`;
  if (visualFx.eliminationNoticeSignature !== signature) {
    visualFx.eliminationNoticeSignature = signature;
    retriggerClassAnimation(feedbackNode, "is-impact");
  }
}

/**
 * Remplit la sélection de vote avec les joueurs vivants.
 */
function renderVoteOptions() {
  const select = $("vote-target");
  select.innerHTML = "";
  state.players
    .filter((p) => p.alive !== false && p.id !== state.user?.uid)
    .forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.displayName;
      select.appendChild(opt);
    });
}

function didCurrentUserWinGame() {
  if (!state.user || !state.room) return false;

  const me = state.players.find((player) => player.id === state.user.uid);
  if (!me) return false;

  const winner = state.room.winner || state.game?.winner;
  if (winner === "civils") return me.role === "civil";
  if (winner === "undercover") return me.role === "undercover";
  if (winner === "mrwhite") return me.role === "mrwhite";
  return false;
}

function unlockAchievement(achievementKey, unlockedKeys) {
  if (state.achievements[achievementKey]) return;
  state.achievements[achievementKey] = true;
  unlockedKeys.push(achievementKey);
}

function processEndGameAchievements() {
  if (!state.room || !state.game || state.room.status !== "finished") return;

  const signature = `${state.room.id || state.roomId}:${state.room.winner || state.game.winner || "x"}:${state.game.round || 0}`;
  if (state.processedEndSignature === signature) return;
  state.processedEndSignature = signature;

  state.badgeStats.gamesPlayed += 1;

  const unlockedKeys = [];
  if (didCurrentUserWinGame()) {
    unlockAchievement("firstVictory", unlockedKeys);
  }

  const me = state.players.find((player) => player.id === state.user?.uid);
  if (me && me.alive !== false) {
    unlockAchievement("survivor", unlockedKeys);
  }

  if (Number(state.game.round || 0) >= 3) {
    unlockAchievement("strategist", unlockedKeys);
  }

  if (state.badgeStats.gamesPlayed >= 5) {
    unlockAchievement("veteran", unlockedKeys);
  }

  state.newUnlockedBadges = unlockedKeys;
  persistAchievementProgress();
  renderAchievementsUI();

  unlockedKeys.forEach((key, index) => {
    const achievement = ACHIEVEMENT_DEFINITIONS.find((item) => item.key === key);
    if (!achievement) return;
    setTimeout(() => showAchievementToast(achievement), index * 420);
  });
}

/**
 * Écran de fin: rôle de chaque joueur + gagnant.
 */
function renderEndReveal() {
  if (state.room?.status !== "finished") return;

  processEndGameAchievements();

  const winnerLabel = state.room.winner || state.game?.winner || "inconnu";
  const roundLabel = state.game?.round || state.room?.round || "?";
  $("end-title").textContent = `Victoire: ${winnerLabel}`;
  $("end-subtitle").textContent = `Résumé de la partie · Manche finale ${roundLabel}`;

  const ul = $("end-reveal-list");
  ul.innerHTML = "";

  if (!state.players.length) {
    const li = document.createElement("li");
    li.textContent = "Aucun résumé joueur disponible.";
    ul.appendChild(li);
  }

  state.players.forEach((p) => {
    const li = document.createElement("li");
    const role =
      p.role === "mrwhite"
        ? "Mr. White"
        : p.role === "undercover"
          ? "Undercover"
          : p.role === "civil"
            ? "Civil"
            : "Rôle inconnu";
    const word = p.role === "mrwhite" ? "" : `(${p.word || "-"})`;
    const aliveTag = p.alive === false ? " · éliminé" : " · survivant";
    li.textContent = `${p.displayName || "Joueur"} → ${role} ${word}${aliveTag}`;
    ul.appendChild(li);
  });

  $("btn-rematch").classList.toggle("hidden", state.room.hostId !== state.user?.uid);
  triggerVictoryImpact();
  if (state.newUnlockedBadges.length > 0) {
    retriggerClassAnimation(document.querySelector("#view-end .end-card"), "is-victory-super");
  }
}

/**
 * Attache tous les événements UI.
 */
function bindEvents() {
  $("btn-tab-login").addEventListener("click", () => {
    state.authMode = "login";
    updateAuthModeUI();
  });

  $("btn-tab-signup").addEventListener("click", () => {
    state.authMode = "signup";
    updateAuthModeUI();
  });

  $("form-auth").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("auth-email").value.trim();
    const password = $("auth-password").value;
    const status = $("auth-status");
    const submitButton = $("btn-auth-submit");

    await runWithButtonLoading(submitButton, "Connexion...", async () => {
      try {
        if (state.authMode === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
        setStatus(status, "Authentification réussie", "ok");
      } catch (error) {
        setStatus(status, error.message, "error");
      }
    });
  });

  $("btn-auth-logout").addEventListener("click", async () => {
    if (state.roomId) {
      try {
        await leaveRoom();
      } catch (error) {
        console.warn("Leave room before logout failed:", error);
      }
    }
    await signOut(auth);
  });

  $("btn-open-profile")?.addEventListener("click", () => {
    state.preRoomView = "profile";
    setProfileTab("customize");
    renderProfileView();
    routeFromState();
  });

  $("btn-tabbar-lobby")?.addEventListener("click", () => {
    state.preRoomView = "lobby";
    routeFromState();
  });

  $("btn-tabbar-create")?.addEventListener("click", () => {
    state.preRoomView = "createRoom";
    routeFromState();
  });

  $("btn-tabbar-profile")?.addEventListener("click", () => {
    state.preRoomView = "profile";
    setProfileTab("customize");
    renderProfileView();
    routeFromState();
  });

  $("btn-open-create-room").addEventListener("click", () => {
    state.preRoomView = "createRoom";
    routeFromState();
  });

  $("btn-back-lobby-from-create").addEventListener("click", () => {
    state.preRoomView = "lobby";
    routeFromState();
  });

  $("btn-back-lobby-from-profile").addEventListener("click", () => {
    state.preRoomView = "lobby";
    routeFromState();
  });

  $("btn-profile-tab-customize")?.addEventListener("click", () => {
    setProfileTab("customize");
  });

  $("btn-profile-tab-badges")?.addEventListener("click", () => {
    setProfileTab("badges");
    renderAchievementsUI();
  });

  $("btn-save-profile").addEventListener("click", async () => {
    await runWithButtonLoading($("btn-save-profile"), "Enregistrement...", saveUserProfile);
  });

  $("profile-name").addEventListener("input", (event) => {
    state.profileName = event.target.value.slice(0, 18);
    updateProfilePreview();
  });

  $("profile-icon-grid").addEventListener("click", (event) => {
    const option = event.target.closest(".icon-option[data-icon]");
    if (!option) return;
    state.profileIcon = option.dataset.icon;
    updateProfileIconSelectionUI();
    updateProfilePreview();
  });

  $("form-create-room").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter || event.target.querySelector('button[type="submit"]');
    const status = $("create-room-status");

    await runWithButtonLoading(submitButton, "Création...", async () => {
      try {
        await createRoom();
        setStatus(status, "Salon créé ✅", "ok");
      } catch (error) {
        setStatus(status, getReadableErrorMessage(error, "Impossible de créer le salon"), "error");
      }
    });
  });

  $("rooms-list").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-room-join]");
    if (!button) return;
    const status = $("lobby-status");

    await runWithButtonLoading(button, "Connexion...", async () => {
      try {
        await joinRoom(button.dataset.roomJoin);
        setStatus(status, "", "");
      } catch (error) {
        setStatus(status, getReadableErrorMessage(error, "Impossible de rejoindre ce salon"), "error");
      }
    });
  });

  $("btn-refresh-rooms").addEventListener("click", subscribeRoomsList);

  $("btn-leave-room").addEventListener("click", async () => {
    await leaveRoom();
  });

  $("btn-start-game").addEventListener("click", async () => {
    const status = $("room-status");
    await runWithButtonLoading($("btn-start-game"), "Démarrage...", async () => {
      try {
        await startGame();
        setStatus(status, "Partie lancée ✅", "ok");
      } catch (error) {
        setStatus(status, error.message, "error");
      }
    });
  });

  $("btn-force-next").addEventListener("click", forceNextPhase);
  $("btn-force-next-game").addEventListener("click", forceNextPhase);

  $("btn-reveal-role").addEventListener("click", () => {
    state.mySecretRevealed = !state.mySecretRevealed;
    renderGameView();
  });

  $("form-vote").addEventListener("submit", async (event) => {
    event.preventDefault();
    const targetId = $("vote-target").value;
    if (!targetId) return;
    const submitButton = event.submitter || event.target.querySelector('button[type="submit"]');
    await runWithButtonLoading(submitButton, "Vote...", async () => {
      try {
        await submitVote(targetId);
      } catch (error) {
        setStatus($("vote-status"), error.message, "error");
      }
    });
  });

  $("btn-rematch").addEventListener("click", rematch);

  $("btn-back-lobby").addEventListener("click", async () => {
    try {
      if (state.room && state.room.hostId === state.user?.uid) {
        await closeRoomForEveryone(state.roomId);
        resetRoomStateToLobby();
      } else {
        await leaveRoom();
      }
    } catch (error) {
      console.error("Retour lobby impossible:", error);
      await leaveRoom();
    }
  });
}

/**
 * Observe l'auth et route automatiquement.
 */
function subscribeAuth() {
  onAuthStateChanged(auth, async (user) => {
    state.user = user;

    if (!user) {
      cleanupRoomSubscriptions();
      state.roomId = null;
      state.room = null;
      state.players = [];
      state.game = null;
      state.preRoomView = "lobby";
      $("btn-open-profile")?.classList.add("hidden");
      renderAchievementsUI();
      routeFromState();
      return;
    }

    await loadUserProfile(user);
    renderProfileView();
    renderAchievementsUI();
    $("btn-open-profile")?.classList.remove("hidden");

    try {
      await cleanupLegacyTestRooms();
    } catch (error) {
      console.warn("Unable to cleanup legacy test rooms:", error?.message || error);
    }

    subscribeRoomsList();
    routeFromState();
  });
}

/**
 * Bootstrapping.
 */
function init() {
  loadAchievementProgress();
  loadAccessibilityPreferences();
  applyAccessibilityPreferences();
  initParticleField();
  bindAudioUnlock();
  bindNetworkEvents();
  bindEvents();
  updateAuthModeUI();
  routeFromState();
  subscribeAuth();
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        stopParticlesLoop();
        visualFx.particleCanvas?.remove();
        visualFx.particleCanvas = null;
        visualFx.particleContext = null;
        visualFx.particles = [];
        visualFx.burstParticles = [];
      } else {
        initParticleField();
      }
    });
  }
}

init();
