const screens = {
  setup: document.getElementById("setup-screen"),
  game: document.getElementById("game-screen"),
};

const playersList = document.getElementById("players-list");
const addPlayerButton = document.getElementById("add-player-btn");
const startGameButton = document.getElementById("start-game-btn");
const setupStatus = document.getElementById("setup-status");
const difficultyGrid = document.getElementById("difficulty-grid");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-btn"));
const playerRowTemplate = document.getElementById("player-row-template");

const currentPlayerLabel = document.getElementById("current-player");
const currentDifficultyLabel = document.getElementById("current-difficulty");
const cardTypeLabel = document.getElementById("card-type");
const cardTextLabel = document.getElementById("card-text");
const truthButton = document.getElementById("truth-btn");
const dareButton = document.getElementById("dare-btn");
const nextPlayerButton = document.getElementById("next-player-btn");
const backSetupButton = document.getElementById("back-setup-btn");

const DIFFICULTY_LABELS = {
  "bebe-cadum": "Bébé Cadum",
  normal: "Normal",
  spicy: "Spicy",
  infame: "Infâme",
};

const DECK = {
  "bebe-cadum": {
    truth: [
      "Quel est ton dessin animé préféré de tous les temps ?",
      "Quel est le dernier truc qui t’a fait rire très fort ?",
      "Quel est ton snack préféré à minuit ?",
      "Quelle chanson tu connais par cœur sans honte ?",
      "Ton souvenir d’école le plus drôle ?",
      "Quel est ton film doudou ?",
      "Quel talent inutile tu as ?",
      "Quel est le pire cadeau que tu as reçu ?",
      "Tu préfères mer ou montagne ? Pourquoi ?",
      "Quelle appli tu ouvres le plus ?",
      "Quel métier tu rêvais de faire enfant ?",
      "La dernière fois où tu as pleuré de rire ?",
      "Ton emoji le plus utilisé ?",
      "Tu dors plutôt tôt ou très tard ?",
      "Quel plat tu pourrais manger toute la semaine ?",
      "Ton plus gros craquage shopping ?",
      "Quel est ton mot préféré du moment ?",
      "Quel pays tu veux absolument visiter ?",
      "Quel est ton défaut le plus assumé ?",
      "Quel est ton meilleur souvenir de vacances ?",
      "Tu chantes sous la douche ?",
      "Quelle série as-tu rewatchée trop de fois ?",
      "Quel est ton plus gros fail en cuisine ?",
      "Quel est ton téléphone de rêve ?",
      "Quelle est ta saison préférée ?",
      "Ton parfum de glace favori ?",
      "Quel bruit t’énerve le plus ?",
      "Ton jour préféré de la semaine ?",
      "Tu préfères messages vocaux ou texte ?",
      "Quel est ton plus grand plaisir coupable ?",
      "Tu es team sucré ou salé ?",
      "Ton sport préféré à regarder ?",
      "Quel est le dernier compliment reçu ?",
      "Quel super pouvoir tu choisirais ?",
      "Ton personnage fictif préféré ?",
      "Quelle est ta boisson chaude préférée ?",
      "Quel est ton fond d’écran actuel ?",
      "Tu es plutôt improvisation ou planning ?",
      "Quel est le dernier livre lu ?",
      "Quelle est la dernière chose que tu as procrastinée ?"
    ],
    dare: [
      "Fais ton meilleur cri de victoire en mode film d’action.",
      "Parle avec une voix de robot pendant 2 tours.",
      "Imite une pub de dentifrice pendant 15 secondes.",
      "Fais 10 squats en comptant à voix haute.",
      "Envoie un emoji random à la dernière personne de ton chat (sans explication).",
      "Fais une mini danse de 10 secondes.",
      "Récite l’alphabet à l’envers le plus loin possible.",
      "Imite un animal choisi par le groupe pendant 20 secondes.",
      "Fais un selfie très dramatique.",
      "Parle en rimes jusqu’à ton prochain tour.",
      "Fais semblant d’être au téléphone avec une célébrité.",
      "Tiens en planche 20 secondes.",
      "Dis 5 mots qui commencent par la lettre M en 5 secondes.",
      "Fais une imitation de comment tu te réveilles le matin.",
      "Chante le refrain d’une chanson très connue.",
      "Fais un compliment sincère à chaque joueur.",
      "Marche comme un mannequin pendant 15 secondes.",
      "Imite ton prof/ton boss préféré.",
      "Raconte une blague nulle mais avec sérieux.",
      "Fais un accent au hasard pendant un tour.",
      "Écris ton prénom avec ton coude dans l’air.",
      "Dis un mot en épelant chaque lettre très lentement.",
      "Fais 5 pompes contre un mur.",
      "Pose comme une star sur tapis rouge.",
      "Dis bonjour en 3 langues.",
      "Fais une météo imaginaire de ta ville.",
      "Parle comme un commentateur sportif pendant 20 secondes.",
      "Imite un réveil pendant 10 secondes.",
      "Fais une grimace et garde-la 8 secondes.",
      "Chuchote tout jusqu’à ton prochain tour.",
      "Fais l’intro d’une émission TV inventée.",
      "Mime ‘j’ai perdu mes clés’ sans parler.",
      "Fais une mini pub pour des chaussettes.",
      "Dis une phrase motivante en mode coach.",
      "Imite un personnage de dessin animé.",
      "Fais un moonwalk (ou tentative).",
      "Fais 15 secondes de beatbox improvisé.",
      "Répète ‘très tristes tigres’ 5 fois vite.",
      "Mets une musique et fais un freeze dance 10 secondes.",
      "Présente-toi comme si tu gagnais un Oscar."
    ]
  },
  normal: {
    truth: [
      "Quel est ton plus gros mensonge ‘inoffensif’ ?",
      "Qui est la dernière personne que tu as stalkée en ligne ?",
      "Quelle habitude bizarre personne ne comprend chez toi ?",
      "Ton plus gros regret de ces 12 derniers mois ?",
      "Quelle est la chose la plus immature que tu fais encore ?",
      "Quel message que tu n’as jamais osé envoyer ?",
      "Quelle est ta plus grande peur sociale ?",
      "À quel moment tu t’es senti vraiment fier récemment ?",
      "Tu pardonnes facilement ?",
      "Ton red flag principal selon toi ?",
      "Quel est ton green flag principal ?",
      "Qu’est-ce que tu juges trop vite chez les gens ?",
      "Le dernier moment gênant que tu n’oublies pas ?",
      "Tu as déjà ghosté quelqu’un ? Pourquoi ?",
      "Quel est ton niveau de jalousie sur 10 ?",
      "Une vérité que tu caches souvent pour éviter un conflit ?",
      "Quelle est ta relation la plus marquante ?",
      "Ton pire message envoyé au mauvais destinataire ?",
      "Quelle critique te touche le plus ?",
      "Tu préfères avoir raison ou garder la paix ?",
      "Quel est ton ‘ick’ instantané ?",
      "As-tu déjà fait semblant d’aimer quelqu’un ?",
      "Quelle qualité tu envies le plus chez un proche ?",
      "Quelle est ta plus grande insécurité ?",
      "Quand as-tu été hypocrite pour la dernière fois ?",
      "Quel objectif tu repousses depuis trop longtemps ?",
      "Quel est ton plus gros sabotage perso ?",
      "Tu tiens tes promesses facilement ?",
      "Quel est ton défaut en amitié ?",
      "Tu te compares souvent aux autres ?",
      "Quel est ton pire achat ‘influence’ ?",
      "Quelle rumeur fausse sur toi t’a le plus énervé ?",
      "Quel est ton mécanisme de défense préféré ?",
      "Quel sujet te met immédiatement mal à l’aise ?",
      "Tu as déjà fouillé un téléphone sans permission ?",
      "Tu donnes des secondes chances facilement ?",
      "Quel est ton ‘type’ de personne compliqué ?",
      "Tu préfères dire la vérité brutale ou la version douce ?",
      "Quelle est ta mauvaise habitude en couple ?",
      "Quel est ton plus gros caprice récemment ?"
    ],
    dare: [
      "Montre ta dernière photo prise (hors captures).",
      "Lis ton dernier message vocal avec une voix dramatique.",
      "Appelle quelqu’un et dis seulement ‘je te rappelle’.",
      "Écris un mini poème pour la personne à ta gauche.",
      "Imite ton rire le plus gêné.",
      "Montre ton meilleur pas de danse TikTok (ou invente).",
      "Fais 20 secondes de regard intense sans rire.",
      "Envoie ‘t’as pensé à moi ?’ à un ami proche.",
      "Fais 15 jumping jacks.",
      "Parle en troisième personne pendant 2 tours.",
      "Donne un surnom à chaque joueur.",
      "Raconte ta journée en 8 secondes chrono.",
      "Mime ta série préférée sans parler.",
      "Prends une pose yoga 20 secondes.",
      "Envoie un GIF random à un contact proche.",
      "Imite une scène de dispute de film.",
      "Crée un slogan pour le groupe en 10 secondes.",
      "Fais une déclaration d’amour à ton snack préféré.",
      "Fais un discours ‘candidat à la présidence’ en 15 secondes.",
      "Épelle ton prénom avec ton pied dans l’air.",
      "Parle très lentement jusqu’à ton prochain tour.",
      "Fais 10 secondes de stand-up improvisé.",
      "Imite un influenceur motivation.",
      "Récite une table de multiplication au hasard.",
      "Complimente quelqu’un sans utiliser ‘gentil’ ni ‘beau’.",
      "Fais l’accent marseillais/ch’ti/québécois au choix 20 secondes.",
      "Mets un timer 10 secondes et fixe un mur sans bouger.",
      "Explique comment faire des pâtes comme un tuto expert.",
      "Réponds à la prochaine question avec un seul mot.",
      "Fais la voix GPS pendant 1 minute.",
      "Chante ton plat préféré sur l’air d’une berceuse.",
      "Imite quelqu’un du groupe (avec bienveillance).",
      "Fais une pub de parfum imaginaire.",
      "Devine 3 capitales en 10 secondes.",
      "Fais semblant d’être sur un podium de mode.",
      "Raconte un souvenir en parlant très vite.",
      "Fais 5 burpees (ou version simplifiée).",
      "Décris chaque joueur en 1 mot.",
      "Reste sans utiliser tes mains pendant 1 tour.",
      "Invente un rap de 2 lignes sur le groupe."
    ]
  },
  spicy: {
    truth: [
      "Ton plus gros crush impossible ?",
      "Tu as déjà embrassé quelqu’un juste pour tester ?",
      "Quel type de message te fait craquer direct ?",
      "Quel est ton scénario de date parfait ?",
      "As-tu déjà été jaloux sans l’avouer ?",
      "Quel est ton plus gros turn-off ?",
      "Quel est ton plus gros turn-on non physique ?",
      "Tu as déjà regretté un flirt ?",
      "As-tu déjà envoyé un message ambigu par ennui ?",
      "Quelle est ta zone de confort en flirt (0 à 10) ?",
      "Avec quel style de personne tu perds tes moyens ?",
      "Tu as déjà relu une conversation 20 fois ?",
      "Quel est ton pire date de tous les temps ?",
      "As-tu déjà menti sur tes sentiments ?",
      "Ton red flag amoureux assumé ?",
      "Quel compliment te fait fondre ?",
      "As-tu déjà fait un premier pas que tu regrettes ?",
      "Tu préfères slow burn ou coup de foudre ?",
      "Quel est ton langage de l’amour dominant ?",
      "As-tu déjà espionné les stories d’un ex ?",
      "Quel détail physique te marque en premier ?",
      "Qu’est-ce qui te fait décrocher instantanément ?",
      "Tu as déjà donné une fausse excuse pour éviter quelqu’un ?",
      "Quelle est ta limite absolue en relation ?",
      "Tu as déjà confondu attachement et amour ?",
      "Quel est ton plus gros fantasme de voyage romantique ?",
      "Tu as déjà regretté un ‘vu’ sans réponse ?",
      "Ton style de flirt: subtil ou direct ?",
      "Quel secret ‘mignon’ personne ne sait ?",
      "Tu as déjà tenté de rendre quelqu’un jaloux ?",
      "Quel est ton vice de séduction ?",
      "Quelle est ta phrase d’accroche la plus nulle ?",
      "Tu préfères compliments publics ou privés ?",
      "Avec qui du groupe tu partirais en roadtrip 24h ?",
      "Quel est ton ratio honnêteté / mystère en début de relation ?",
      "Ton pire auto-sabotage sentimental ?",
      "Tu t’attaches vite ?",
      "Quelle chanson décrit ta vie amoureuse actuelle ?",
      "Tu as déjà eu un crush sur quelqu’un d’indisponible ?",
      "Quel ‘green flag’ te rassure immédiatement ?"
    ],
    dare: [
      "Fais un compliment flirt à la personne de ton choix.",
      "Envoie ‘j’espère que tu passes une bonne journée 🙂’ à un ami proche.",
      "Lis ton dernier DM avec une voix séduisante.",
      "Fais un regard intense 10 secondes à quelqu’un (respectueux).",
      "Raconte ton date idéal en 15 secondes, version teaser.",
      "Écris une bio d’app de rencontre fictive en 2 lignes.",
      "Imite une scène de comédie romantique.",
      "Décris ton crush type sans dire ‘beau/belle’.",
      "Fais une déclaration dramatique à une bouteille d’eau.",
      "Dis 3 qualités séduisantes sur toi sans rire.",
      "Chuchote la prochaine phrase que tu dis.",
      "Fais un selfie ‘mystérieux’ et garde-le 1 tour.",
      "Imite une voix de radio de nuit.",
      "Fais un message vocal fictif de 10 secondes ‘tu me manques’.",
      "Donne un titre de film romantique à chaque joueur.",
      "Reste ‘impassible’ pendant qu’un joueur te fait rire 15 secondes.",
      "Décris un rendez-vous catastrophe en mode stand-up.",
      "Fais un clin d’œil de star de cinéma à chaque joueur.",
      "Invente un horoscope amour du jour.",
      "Prononce une phrase ultra romantique en mode rap.",
      "Parle comme dans une télénovela pendant 1 tour.",
      "Rédige un SMS de rupture polie (fictif).",
      "Fais un ‘slow-motion walk’ sur 5 pas.",
      "Invente un code secret de flirt en 3 gestes.",
      "Décris ton type en utilisant seulement des emojis.",
      "Fais une pub pour ‘parfum attraction’ en 10 secondes.",
      "Donne une note de charisme fictive à chaque joueur.",
      "Chante 1 phrase de chanson d’amour.",
      "Invente une réplique de film culte de séduction.",
      "Fais une mini scène de jalousie exagérée.",
      "Mets une pose ‘cover magazine’.",
      "Raconte un date parfait en 5 mots.",
      "Reste en mode gentleman/lady pendant 1 tour.",
      "Envoie un emoji ❤️ à quelqu’un de confiance.",
      "Parle avec une voix grave ou aiguë pendant 1 tour.",
      "Fais une intro ‘podcast love coach’.",
      "Décris ta vibe actuelle en un cocktail imaginaire.",
      "Fais 10 secondes de danse lente solo.",
      "Donne ton meilleur ‘pickup line’ ironique.",
      "Fais un toast ‘à l’amour’ avec sérieux."
    ]
  },
  infame: {
    truth: [
      "Quel est ton secret le plus difficile à avouer ici ?",
      "Qui dans ce groupe te lit le mieux ?",
      "Quelle vérité tu repousses depuis des mois ?",
      "Quand as-tu été le plus injuste avec quelqu’un ?",
      "Quel est ton mensonge le plus coûteux émotionnellement ?",
      "Quelle personne te manque mais tu n’oses pas recontacter ?",
      "Quel est ton plus gros complexe social ?",
      "Quelle relation t’a le plus transformé ?",
      "Quel comportement toxique tu combats encore ?",
      "De quoi as-tu le plus honte dans ton passé ?",
      "Tu as déjà brisé la confiance de quelqu’un ?",
      "Quel pardon tu n’as jamais demandé ?",
      "Quelle peur gouverne encore tes décisions ?",
      "Quel est ton mécanisme d’évitement principal ?",
      "Quelle vérité personne n’imagine sur toi ?",
      "Quel est ton ‘point de rupture’ en relation ?",
      "As-tu déjà été manipulateur sans t’en rendre compte ?",
      "Quelle blessure d’ego revient souvent ?",
      "Quel est ton plus gros regret amoureux ?",
      "Quand as-tu fui une conversation importante ?",
      "Quel masque social tu portes le plus ?",
      "Quelle critique te met hors de toi ?",
      "Tu as déjà saboté quelque chose qui marchait bien ?",
      "Quel est ton besoin affectif principal ?",
      "Quelle personne t’impressionne mais t’intimide ?",
      "Quelle promesse à toi-même tu as trahie ?",
      "Quelle jalousie tu n’assumes pas ?",
      "As-tu déjà voulu être quelqu’un d’autre ?",
      "Quel est ton pire réflexe en conflit ?",
      "Quelle habitude détruit ton énergie ?",
      "Quelle vérité tu as peur d’entendre sur toi ?",
      "Quel échec te poursuit encore ?",
      "Quel est ton plus grand manque de courage récent ?",
      "Quel est ton besoin de contrôle le plus fort ?",
      "Tu préfères être aimé ou admiré ?",
      "Quelle relation mériterait un vrai reset ?",
      "Qu’est-ce que tu ne montres jamais en public ?",
      "Quelle émotion tu refoules le plus ?",
      "Quel est le rôle que tu joues pour plaire ?",
      "Quel changement radical tu devrais faire maintenant ?"
    ],
    dare: [
      "Regarde chaque joueur dans les yeux et dis une qualité + un défaut (respectueux).",
      "Enregistre une note vocale à toi-même: ‘ce que je dois arrêter de fuir’.",
      "Écris 3 objectifs honnêtes pour ce mois et lis-les.",
      "Fais 30 secondes de silence complet et respiration profonde.",
      "Raconte un échec et ce qu’il t’a appris, en 20 secondes.",
      "Dis ‘j’ai eu tort sur…’ et complète la phrase.",
      "Fais un mini discours d’excuses fictif ultra sincère.",
      "Écris un message de gratitude (non envoyé) à quelqu’un.",
      "Fais 20 squats puis dis une vérité claire sur toi.",
      "Donne un conseil brutal mais bienveillant à toi-même.",
      "Choisis un joueur: il te pose une question, tu réponds sans esquive.",
      "Prends une posture ‘confiance’ 20 secondes puis parle.",
      "Dis à voix haute une limite personnelle importante.",
      "Invente ton mantra anti-auto-sabotage.",
      "Raconte en 10 secondes ce que tu veux vraiment maintenant.",
      "Lis une phrase motivante comme un coach militaire.",
      "Décris ta pire excuse habituelle en 5 mots.",
      "Fais un engagement public pour une action dans 48h.",
      "Dis ‘merci’ à un joueur pour une chose précise.",
      "Fais 15 secondes de cri silencieux (sans son, juste mime).",
      "Reste immobile 15 secondes, puis dis une phrase vraie importante.",
      "Imite ton ‘toi de demain’ qui a réglé ton problème principal.",
      "Fais une promesse réaliste au groupe.",
      "Décris ton stress comme une météo.",
      "Parle 20 secondes sans utiliser ‘mais’.",
      "Fais une micro-méditation guidée de 15 secondes.",
      "Choisis une mauvaise habitude et annonce son remplacement.",
      "Donne une note à ton courage aujourd’hui et explique.",
      "Fais un toast à ton futur toi.",
      "Écris une phrase ‘j’arrête de…’ et lis-la.",
      "Raconte une décision que tu repousses et fixe une date.",
      "Dis une vérité difficile sans te justifier.",
      "Fais 10 respirations lentes en silence.",
      "Décris ton objectif en une phrase ultra simple.",
      "Prends 20 secondes pour remercier ton corps/mental.",
      "Dis ce que tu dois lâcher immédiatement.",
      "Donne un conseil honnête à quelqu’un (avec tact).",
      "Exprime une peur en une phrase puis sa contre-action.",
      "Fais un mini pacte de progression pour la semaine.",
      "Conclue avec: ‘je me choisis, maintenant’."
    ]
  }
};

const state = {
  players: [],
  currentIndex: 0,
  difficulty: "bebe-cadum",
};

function setScreen(screenName) {
  Object.entries(screens).forEach(([key, node]) => {
    node.classList.toggle("active", key === screenName);
  });
}

function createPlayerRow(defaultValue = "") {
  const node = playerRowTemplate.content.firstElementChild.cloneNode(true);
  const input = node.querySelector(".player-input");
  const removeButton = node.querySelector(".remove-player-btn");

  input.value = defaultValue;
  removeButton.addEventListener("click", () => {
    node.remove();
    setupStatus.textContent = "";
  });

  return node;
}

function collectPlayers() {
  const inputs = Array.from(playersList.querySelectorAll(".player-input"));
  const names = inputs
    .map((input) => input.value.trim())
    .filter((value) => value.length > 0);

  const uniqueNames = [...new Set(names.map((name) => name.toLowerCase()))];
  if (uniqueNames.length !== names.length) {
    return { valid: false, message: "Chaque joueur doit avoir un nom différent." };
  }

  if (names.length < 2) {
    return { valid: false, message: "Ajoute au moins 2 joueurs pour lancer la partie." };
  }

  return { valid: true, names };
}

function pickRandomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function drawCard(type) {
  const pool = DECK[state.difficulty][type];
  const text = pickRandomFrom(pool);

  cardTypeLabel.textContent = type === "truth" ? "VÉRITÉ" : "ACTION";
  cardTextLabel.textContent = text;
}

function updateGameHeader() {
  currentPlayerLabel.textContent = state.players[state.currentIndex] || "Player";
  currentDifficultyLabel.textContent = DIFFICULTY_LABELS[state.difficulty];
}

function goToNextPlayer() {
  state.currentIndex = (state.currentIndex + 1) % state.players.length;
  updateGameHeader();
  cardTypeLabel.textContent = "ACTION / VÉRITÉ";
  cardTextLabel.textContent = "Choisis une carte pour continuer.";
}

addPlayerButton.addEventListener("click", () => {
  playersList.appendChild(createPlayerRow());
  setupStatus.textContent = "";

  const inputs = playersList.querySelectorAll(".player-input");
  inputs[inputs.length - 1]?.focus();
});

difficultyGrid.addEventListener("click", (event) => {
  const target = event.target.closest(".difficulty-btn");
  if (!target) return;

  const difficulty = target.dataset.difficulty;
  if (!difficulty || !DECK[difficulty]) return;

  state.difficulty = difficulty;

  difficultyButtons.forEach((button) => {
    button.classList.toggle("is-active", button === target);
  });
});

startGameButton.addEventListener("click", () => {
  const playersResult = collectPlayers();

  if (!playersResult.valid) {
    setupStatus.textContent = playersResult.message;
    return;
  }

  state.players = playersResult.names;
  state.currentIndex = 0;

  setupStatus.textContent = "";
  setScreen("game");
  updateGameHeader();

  cardTypeLabel.textContent = "ACTION / VÉRITÉ";
  cardTextLabel.textContent = "Choisis une carte pour démarrer le tour.";
});

truthButton.addEventListener("click", () => drawCard("truth"));
dareButton.addEventListener("click", () => drawCard("dare"));
nextPlayerButton.addEventListener("click", goToNextPlayer);

backSetupButton.addEventListener("click", () => {
  setScreen("setup");
});

playersList.appendChild(createPlayerRow("Joueur 1"));
playersList.appendChild(createPlayerRow("Joueur 2"));
