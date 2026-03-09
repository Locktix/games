const screens = {
  mode: document.getElementById("mode-screen"),
  setup: document.getElementById("setup-screen"),
  game: document.getElementById("game-screen"),
};
const modeSoloButton = document.getElementById("mode-solo-btn");
const modeMultiButton = document.getElementById("mode-multi-btn");
const backModeButton = document.getElementById("back-mode-btn");
const playersList = document.getElementById("players-list");
const soloPlayersPanel = document.getElementById("solo-players-panel");
const addPlayerButton = document.getElementById("add-player-btn");
const startGameButton = document.getElementById("start-game-btn");
const setupStatus = document.getElementById("setup-status");
const setupKicker = document.getElementById("setup-kicker");
const setupSubtitle = document.getElementById("setup-subtitle");
const difficultyGrid = document.getElementById("difficulty-grid");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-btn"));
const multiPanel = document.getElementById("multi-panel");
const multiNameInput = document.getElementById("multi-name-input");
const roomCodeInput = document.getElementById("room-code-input");
const createRoomButton = document.getElementById("create-room-btn");
const joinRoomButton = document.getElementById("join-room-btn");
const startMultiButton = document.getElementById("start-multi-btn");
const roomInfo = document.getElementById("room-info");
const roomPlayers = document.getElementById("room-players");
const multiRoleBadge = document.getElementById("multi-role-badge");
const playerRowTemplate = document.getElementById("player-row-template");
const currentPlayerLabel = document.getElementById("current-player");
const currentDifficultyLabel = document.getElementById("current-difficulty");
const gameRoomMeta = document.getElementById("game-room-meta");
const gameMultiHint = document.getElementById("game-multi-hint");
const cardTypeLabel = document.getElementById("card-type");
const cardTextLabel = document.getElementById("card-text");
const truthButton = document.getElementById("truth-btn");
const dareButton = document.getElementById("dare-btn");
const turnActions = document.getElementById("turn-actions");
const redrawButton = document.getElementById("redraw-btn");
const completeTurnButton = document.getElementById("complete-turn-btn");
const endVoteWrap = document.getElementById("end-vote-wrap");
const voteEndButton = document.getElementById("vote-end-btn");
const voteStatus = document.getElementById("vote-status");
const firebaseDb = window.GamesFirebase?.getDb?.() || null;
const trackGameEvent = (eventType, payload = {}) => {
  window.GamesFirebase?.trackEvent?.("ActionVerite", eventType, payload);
};
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
      "Quelle est la dernière chose que tu as procrastinée ?",
      // Ajouts pour plus de "vrais" : plus authentiques et enfantins
      "Quelle est ta plus grande peur inavouable, comme les araignées ?",
      "As-tu déjà fait une bêtise à l'école sans te faire prendre ?",
      "Quel est ton jouet préféré quand tu étais petit ?",
      "Quelle est la blague la plus nulle que tu connais ?",
      "As-tu déjà mangé quelque chose de bizarre par curiosité ?"
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
      "Présente-toi comme si tu gagnais un Oscar.",
      // Ajouts pour plus de "vrais" : défis simples et fun
      "Imite ton animal préféré en marchant autour de la pièce.",
      "Raconte une histoire inventée avec des gestes exagérés.",
      "Fais une tour avec des objets du salon en 30 secondes.",
      "Chante une chanson d'enfance à tue-tête.",
      "Dessine un portrait rapide d'un joueur avec tes yeux fermés."
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
      "Quel est ton plus gros caprice récemment ?",
      // Ajouts pour plus de profondeur
      "As-tu déjà menti pour éviter un embarras ?",
      "Quelle est la plus grosse erreur que tu as commise au travail ?",
      "As-tu déjà regretté une amitié perdue ?",
      "Quel est ton vice caché quotidien ?",
      "As-tu déjà été surpris en train de mentir ?"
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
      "Invente un rap de 2 lignes sur le groupe.",
      // Ajouts pour plus d'intensité modérée
      "Montre ton historique de recherche Google récent.",
      "Appelle un ami et chante une chanson ridicule.",
      "Fais 20 pompes ou explique pourquoi pas.",
      "Partage un meme embarrassant de ton téléphone.",
      "Imite un joueur du groupe de manière exagérée."
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
      "Quel ‘green flag’ te rassure immédiatement ?",
      // Ajouts "vraies spicy" : plus coquines et adultes
      "Quel est l'endroit le plus fou où tu as fait l'amour ?",
      "Quel est l'acte sexuel que tu préfères recevoir ?",
      "Préfères-tu qu'on fasse l'amour le matin ou le soir ?",
      "Quelle est la chose la plus coquine que tu aies imaginée avec quelqu'un ici ?",
      "As-tu déjà envoyé des nudes ? À qui ?",
      "Quelle est ta position sexuelle préférée ?",
      "As-tu déjà eu un plan à trois ?",
      "Quel est ton fantasme sexuel le plus secret ?",
      "As-tu déjà regardé du porno avec quelqu'un ?",
      "Quelle partie du corps te fait le plus craquer ?",
      "As-tu déjà fait l'amour en public ?",
      "Quel est le nombre de partenaires que tu as eu ?",
      "As-tu déjà utilisé des jouets sexuels ?",
      "Quelle est ta plus grande turn-on physique ?",
      "As-tu déjà trompé quelqu'un ?"
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
      "Fais un toast ‘à l’amour’ avec sérieux.",
      // Ajouts "vraies spicy" : plus coquins
      "Fais un lap dance de 10 secondes à la personne à ta gauche.",
      "Envoie un message coquin (fictif) à voix haute.",
      "Embrasse sur la joue la personne de ton choix.",
      "Décris un fantasme en 3 mots.",
      "Imite un orgasme de film (sans exagérer).",
      "Montre ton tatouage le plus caché (si tu en as).",
      "Fais un strip-tease léger (enlever un accessoire).",
      "Chuchote un secret coquin à l'oreille d'un joueur.",
      "Pose en sous-vêtements imaginaires pour une photo fictive.",
      "Raconte ton pire flop sexuel avec humour."
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
      "Quel changement radical tu devrais faire maintenant ?",
      "Quelle conversation tu évites parce qu’elle pourrait tout changer ?",
      "Quel est ton plus gros non-dit familial ?",
      "Quelle part de toi veux-tu cacher à tout prix ?",
      "Quel schéma relationnel tu reproduis malgré toi ?",
      "À quel moment as-tu trahi tes propres valeurs ?",
      "Quel est ton plus grand mensonge par omission ?",
      "Quand as-tu demandé de l’aide trop tard ?",
      "Quel conflit non réglé te prend encore de l’énergie ?",
      "Quelle décision aurais-tu dû prendre il y a un an ?",
      "Quel est ton plus gros ‘si seulement’ ?",
      "Quelle est la dernière fois où tu as été cruel par fatigue ?",
      "Quel est ton besoin que tu n’oses jamais exprimer ?",
      "Qui t’a le plus déçu, et pourquoi ?",
      "De quoi as-tu peur si tu réussis vraiment ?",
      "Quel est le prix caché de ton mode de vie actuel ?",
      "Quel abandon te hante encore ?",
      "Quelle image de toi est complètement fausse ?",
      "Quel est ton déclencheur émotionnel numéro 1 ?",
      "Quelle limite tu n’as pas su poser récemment ?",
      "Quel est ton plus grand manque de discipline ?",
      "Sur quel sujet te mens-tu encore ?",
      "Quand as-tu confondu fierté et orgueil ?",
      "Quel est ton réflexe toxique quand tu te sens rejeté ?",
      "Quelle relation maintiens-tu par habitude, pas par envie ?",
      "Quel pardon tu t’interdis encore à toi-même ?",
      "Quel choix prends-tu pour faire plaisir plutôt que pour être aligné ?",
      "Quel échec as-tu transformé en excuse permanente ?",
      "Quelle est la chose la plus difficile à accepter sur toi ?",
      "Quand as-tu dit ‘ça va’ alors que c’était faux ?",
      "Quel est ton plus gros manque de cohérence entre paroles et actes ?",
      "Quelle vérité sur ton avenir te fait peur ?",
      "Quel est ton comportement le plus passif-agressif ?",
      "Quelle défaite te rend encore amer ?",
      "Quel besoin de validation dirige trop ta vie ?",
      "Quel souvenir tu revis quand tu doutes de toi ?",
      "Quelle partie de ta routine t’éloigne de ce que tu veux vraiment ?",
      "Quel est ton plus gros gâchis de potentiel ?",
      "Quelle peur te fait rester dans l’entre-deux ?",
      "Quel mensonge répété est devenu ton identité ?",
      "Quel est le dernier moment où tu t’es senti imposteur ?",
      "Quel est ton angle mort en amitié ?",
      "Quel jugement te bloque encore aujourd’hui ?",
      "Quel engagement as-tu rompu sans jamais réparer ?",
      "Quelle chose simple te ferait du bien mais tu refuses de faire ?",
      "Quel conflit intérieur est le plus épuisant en ce moment ?",
      "Quelle vérité sur l’amour t’a coûté le plus cher ?",
      "Quel est ton plus grand sabotage financier ou pro ?",
      "Quand as-tu choisi le confort au lieu du courage ?",
      "Quelle personne devrait entendre ‘merci’ de ta part depuis longtemps ?",
      "Quelle décision t’obligerait à devenir enfin adulte sur un sujet clé ?",
      // Ajouts "vraies infame" : plus extrêmes et osés
      "Quelle est la chose la plus illégale que tu aies jamais faite ?",
      "As-tu déjà regardé du porno au travail ?",
      "Quelle est la plus grosse trahison que tu aies commise ?",
      "As-tu déjà volé quelque chose d'important ?",
      "Quel est ton secret le plus sombre que personne ne sait ?",
      "As-tu déjà eu des pensées taboues sur un proche ?",
      "Quelle est la chose la plus honteuse que tu aies faite ivre ?",
      "As-tu déjà manipulé quelqu'un pour du sexe ?",
      "Quel est ton plus grand mensonge à un partenaire ?",
      "As-tu déjà eu une addiction cachée ?",
      "Quelle est la pire vengeance que tu aies planifiée ?",
      "As-tu déjà couché avec quelqu'un pour de l'argent ou un avantage ?",
      "Quel est ton plus grand regret sexuel ?",
      "As-tu déjà stalké quelqu'un obsessivement ?",
      "Quelle est la chose la plus cruelle que tu aies dite ?"
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
      "Conclue avec: ‘je me choisis, maintenant’.",
      "Fais une liste de 3 excuses que tu utilises, puis barre-les à voix haute.",
      "Annonce un objectif précis pour 7 jours, avec date et heure.",
      "Dis ‘non’ fermement trois fois comme entraînement à poser une limite.",
      "Fais 45 secondes de gainage puis annonce ton prochain acte courageux.",
      "Demande à un joueur une question difficile et réponds sans détour.",
      "Lis ta dernière note perso (ou écris-en une) sur ce que tu évites.",
      "Choisis une peur et propose un mini plan en 3 étapes.",
      "Écris une phrase d’excuse sincère (fictive ou réelle) puis lis-la.",
      "Raconte un échec en 15 secondes sans te dévaloriser.",
      "Fais 20 secondes de respiration carrée (4-4-4-4) en silence.",
      "Énonce une limite claire que tu appliques dès aujourd’hui.",
      "Fais un pitch de 20 secondes de ton ‘nouveau toi’.",
      "Transforme une plainte actuelle en action concrète.",
      "Pose une question inconfortable à un joueur (respectueuse), puis réponds à la même.",
      "Fais 10 fentes puis dis une vérité que tu évites depuis trop longtemps.",
      "Écris un engagement sur ton téléphone et mets un rappel maintenant.",
      "Donne un feedback honnête et bienveillant à un joueur.",
      "Décris ton pire scénario, puis ton meilleur scénario, en 20 secondes.",
      "Dis ce que tu refuses de tolérer désormais, en une phrase.",
      "Annonce une habitude à supprimer et son remplacement exact.",
      "Fais 30 secondes en posture droite, puis parle avec assurance.",
      "Raconte un moment où tu as fui, puis ce que tu ferais différemment.",
      "Fais un mini contrat verbal: ‘si je reporte, alors…’.",
      "Pose ton téléphone face cachée pendant 2 tours et explique pourquoi.",
      "En 10 secondes, cite 3 priorités non négociables.",
      "Fais une déclaration ‘je mérite…’ en regardant un point fixe.",
      "Donne un délai public à une décision que tu repousses.",
      "Exprime une colère de façon posée, sans accusation.",
      "Écris une phrase de clôture pour une relation/situation toxique (fictive).",
      "Fais 25 squats puis annonce une action inconfortable sous 24h.",
      "Demande un conseil à un joueur et reformule-le clairement.",
      "Parle 30 secondes uniquement au présent (pas de ‘demain’, pas de ‘avant’).",
      "Fais un check-in émotionnel: 3 mots, pas plus.",
      "Nomme une vérité, une peur, une action, dans cet ordre.",
      "Lis à voix haute ‘ce que je ne veux plus normaliser’.",
      "Propose un défi positif au groupe pour la semaine.",
      "Dis un merci direct à quelqu’un ici pour quelque chose de précis.",
      "Fais 15 secondes de silence, puis une phrase ultra honnête.",
      "Résume ton problème principal en 7 mots maximum.",
      "Fais un plan d’urgence anti-procrastination en 3 phrases.",
      "Prends 20 secondes et choisis ce que tu arrêtes dès ce soir.",
      "Énonce une vérité difficile sans te justifier après.",
      "Fais une promesse réalisable devant le groupe et répète-la deux fois.",
      "Raconte un moment de honte et ce que ça t’a appris.",
      "Donne un exemple où tu as été injuste, puis corrige en une phrase.",
      "Fais un toast à la discipline, pas à la motivation.",
      "Choisis une distraction majeure et annonce sa limite quotidienne.",
      "Écris une phrase d’auto-respect et lis-la debout.",
      "Annonce la conversation difficile que tu vas avoir, et quand.",
      "Termine ton tour par ‘je passe à l’action maintenant’.",
// Ajouts "vraies infame" : plus osés et extrêmes
      "Appelle un ex et dis-lui que tu penses encore à lui/elle (ou simule).",
      "Lèche le cou de la personne à ta gauche (avec consentement).",
      "Raconte ton histoire la plus embarrassante en détail.",
      "Enlève un vêtement et reste comme ça 2 tours.",
      "Partage ton historique porno récent (anonymisé).",
      "Fais un appel anonyme à un ami et confesse un mensonge.",
      "Imite une scène intime d'un film devant le groupe.",
      "Écris un message osé à un crush et montre-le (sans envoyer).",
      "Avoue un vol mineur du passé.",
      "Fais 50 pompes nu(e) (ou en sous-vêtements, avec consentement).",
      "Raconte une trahison que tu as subie ou commise.",
      "Embrasse passionnément un oreiller en démonstration.",
      "Partage un secret tabou avec le groupe.",
      "Danse sensuellement sur une chanson choisie par le groupe.",
      "Appelle tes parents et dis un mensonge ridicule."
    ]
  }
};
const GENERATED_PROMPTS_CONFIG = {
  "bebe-cadum": {
    truthCount: 200, // Augmenté pour plus de variété
    dareCount: 200,
    truthTemplates: [
      "Si tu pouvais améliorer {topic} dans ta vie, tu commencerais par quoi ?",
      "Quel est ton souvenir le plus drôle lié à {topic} ?",
      "Qu’est-ce qui te motive le plus quand il s’agit de {topic} ?",
      "Quel petit secret positif sur {topic} personne ne connaît ?",
      "Dans {topic}, quelle est ta plus grande fierté ?",
      "Quel conseil simple donnerais-tu à un ami sur {topic} ?",
      "Quand tu penses à {topic}, qu’est-ce qui te fait sourire ?",
      "Quelle habitude cool autour de {topic} veux-tu garder toute ta vie ?",
      "Quel est ton meilleur souvenir de groupe autour de {topic} ?",
      "Si {topic} devenait un challenge, comment tu le gagnerais ?",
      // Ajouts pour "vrais" : plus authentiques
      "Quelle est ta plus grosse bêtise liée à {topic} ?",
      "As-tu déjà ri aux larmes à cause de {topic} ?"
    ],
    dareTemplates: [
      "Fais une mini scène de {topic} pendant 12 secondes.",
      "Imite {topic} en version comique pendant 15 secondes.",
      "Fais une action rapide liée à {topic} sans parler.",
      "Explique {topic} comme si tu avais 8 ans.",
      "Raconte {topic} en 5 mots maximum.",
      "Mime {topic} et laisse le groupe deviner.",
      "Fais un slogan positif sur {topic}.",
      "Joue {topic} en mode présentateur TV.",
      "Fais une version épique de {topic} en 10 secondes.",
      "Invente un cri d’équipe sur {topic}.",
      // Ajouts
      "Imite un son lié à {topic} de manière drôle.",
      "Crée un objet imaginaire avec {topic}."
    ],
    topics: [
      "les vacances", "l’école", "les amis", "la musique", "les films", "la cuisine", "le sport", "les jeux vidéo",
      "les transports", "les animaux", "les soirées", "la famille", "les réseaux sociaux", "la mode", "les cadeaux",
      "les blagues", "les photos", "les applis", "les souvenirs d’enfance", "les séries", "les week-ends", "les repas",
      "les voyages", "les habitudes du matin", "les routines du soir", "les passions", "les playlists", "les challenges",
      "les cours", "les projets persos",
      // Ajouts pour variété
      "les anniversaires", "les fêtes", "les rêves"
    ]
  },
  normal: {
    truthCount: 200,
    dareCount: 200,
    truthTemplates: [
      "Quelle vérité inconfortable as-tu sur {topic} ?",
      "Qu’est-ce que tu fais semblant de maîtriser concernant {topic} ?",
      "Quel est ton plus gros regret lié à {topic} ?",
      "Quel réflexe toxique tu remarques chez toi autour de {topic} ?",
      "Quelle limite tu poses mal quand il s’agit de {topic} ?",
      "Quel non-dit te pèse dans {topic} ?",
      "Si tu pouvais refaire une décision sur {topic}, laquelle ?",
      "Quel comportement tu veux changer vis-à-vis de {topic} ?",
      "Quelle peur cachée influence tes choix en {topic} ?",
      "Quel mensonge ‘pratique’ tu racontes sur {topic} ?",
      // Ajouts pour profondeur
      "As-tu déjà échoué spectaculairement en {topic} ?",
      "Quelle excuse utilises-tu souvent pour {topic} ?"
    ],
    dareTemplates: [
      "Donne une version honnête de ton avis sur {topic} en 12 secondes.",
      "Fais un mini débat ‘pour/contre’ sur {topic} avec toi-même.",
      "Fais 10 squats puis dis une vérité claire sur {topic}.",
      "Résume ton plus gros apprentissage sur {topic} en 1 phrase.",
      "Fais un pitch de 15 secondes sur comment t’améliorer en {topic}.",
      "Donne 3 actions concrètes pour progresser en {topic}.",
      "Choisis un joueur et demande-lui un feedback sur {topic}.",
      "Fais un engagement public lié à {topic} pour cette semaine.",
      "Dis ce que tu arrêtes de faire concernant {topic}, maintenant.",
      "Raconte ton dernier fail sur {topic} avec autodérision.",
      // Ajouts
      "Partage un secret modéré sur {topic}.",
      "Imite une erreur commune en {topic}."
    ],
    topics: [
      "la confiance", "l’amitié", "la communication", "la jalousie", "les priorités", "la discipline", "l’organisation",
      "les habitudes", "les excuses", "la sincérité", "les relations", "le stress", "la pression sociale", "l’argent",
      "le travail", "les études", "les objectifs", "la procrastination", "l’ego", "la fierté", "les réseaux sociaux",
      "le sommeil", "la santé", "la constance", "les conflits", "les limites", "les promesses", "la motivation",
      "les choix difficiles", "la gestion du temps",
      // Ajouts
      "les regrets", "les mensonges", "les peurs"
    ]
  },
  spicy: {
    truthCount: 200,
    dareCount: 200,
    truthTemplates: [
      "Quelle est ta vérité la plus osée sur {topic} ?",
      "Quel détail sur {topic} te fait craquer instantanément ?",
      "Quel est ton plus gros turn-off lié à {topic} ?",
      "Quel scénario secret imagines-tu sur {topic} ?",
      "Quelle contradiction tu as dans {topic} ?",
      "Quel est ton red flag perso autour de {topic} ?",
      "Quelle limite claire tu as sur {topic} ?",
      "Quel souvenir marquant as-tu sur {topic} ?",
      "Qu’est-ce que tu n’avoues pas facilement sur {topic} ?",
      "Quelle préférence assumée as-tu en {topic} ?",
      // Modifications pour "vraies spicy" : plus hot
      "Quel fantasme sexuel as-tu lié à {topic} ?",
      "As-tu déjà eu une expérience coquine avec {topic} ?",
      "Quelle partie de {topic} te rend excité(e) ?",
      "Quel secret intime caches-tu sur {topic} ?",
      "Préfères-tu {topic} soft ou hardcore ?"
    ],
    dareTemplates: [
      "Fais une version dramatique de {topic} pendant 10 secondes.",
      "Invente une phrase de flirt sur {topic}.",
      "Mime une scène liée à {topic} sans parler.",
      "Raconte {topic} en mode bande-annonce romantique.",
      "Donne 3 green flags sur {topic} en 8 secondes.",
      "Fais une pub imaginaire sur {topic}.",
      "Lis une phrase sur {topic} avec une voix très théâtrale.",
      "Invente un titre de film autour de {topic}.",
      "Donne ton conseil numéro 1 sur {topic}.",
      "Fais un toast court sur {topic}.",
      // Modifications pour plus coquin
      "Mime un geste sensuel lié à {topic}.",
      "Envoie un compliment hot sur {topic} à voix haute.",
      "Fais une danse érotique légère inspirée de {topic}.",
      "Décris un scénario intime avec {topic}.",
      "Imite un baiser passionné sur {topic}."
    ],
    topics: [
      "le flirt", "les crushs", "les messages", "les dates", "la séduction", "les compliments", "le charisme",
      "la jalousie", "les red flags", "les green flags", "les relations", "les ex", "les non-dits", "les limites",
      "les intentions", "les signaux mixtes", "les rendez-vous", "les premiers pas", "les affinités", "les vibes",
      "les coups de foudre", "les conversations tardives", "les regards", "les textos", "la complicité", "les attentes",
      "la sincérité", "les malentendus", "les ruptures", "les réconciliations",
      // Ajouts pour hot
      "les fantasmes", "le sexe", "les positions", "les jouets", "les lieux publics"
    ]
  },
  infame: {
    truthCount: 200,
    dareCount: 200,
    truthTemplates: [
      "Quelle est ta vérité la plus osée sur {topic} ?",
      "Quel détail tabou sur {topic} n'avoues-tu jamais ?",
      "Quel est ton plus gros regret extrême lié à {topic} ?",
      "Quel comportement infâme as-tu eu avec {topic} ?",
      "Quelle limite as-tu franchie en {topic} ?",
      "Quel secret sombre caches-tu sur {topic} ?",
      "Si tu pouvais refaire un acte infâme en {topic}, lequel ?",
      "Quelle peur extrême influence {topic} ?",
      "Quel mensonge scandaleux as-tu dit sur {topic} ?",
      "Quelle contradiction honteuse as-tu en {topic} ?",
      // Modifications pour "vraies infame" : plus extrêmes
      "As-tu déjà commis quelque chose d'illégal en {topic} ?",
      "Quel fantasme tabou as-tu sur {topic} ?",
      "Quelle trahison as-tu faite liée à {topic} ?",
      "As-tu déjà manipulé pour {topic} ?",
      "Quel secret le plus honteux sur {topic} ?"
    ],
    dareTemplates: [
      "Donne une version honnête et extrême de ton avis sur {topic}.",
      "Fais un débat scandaleux sur {topic}.",
      "Fais 20 squats puis avoue un secret sur {topic}.",
      "Résume ton pire moment en {topic} en 1 phrase.",
      "Fais un pitch osé sur {topic}.",
      "Donne 3 actions infâmes pour {topic}.",
      "Demande un feedback extrême sur {topic}.",
      "Fais un engagement public osé lié à {topic}.",
      "Avoue ce que tu as fait de pire en {topic}.",
      "Raconte un fail infâme sur {topic}.",
      // Modifications pour extrême
      "Mime une action tabou liée à {topic}.",
      "Partage un détail honteux sur {topic} publiquement.",
      "Fais un défi physique osé inspiré de {topic}.",
      "Appelle quelqu'un et confesse sur {topic}.",
      "Imite une trahison en {topic}."
    ],
    topics: [
      "la trahison", "les secrets", "les regrets", "les tabous", "les addictions", "les mensonges", "les vengeances",
      "les manipulations", "les hontes", "les échecs", "les peurs profondes", "les obsessions", "les conflits intérieurs",
      "les limites franchies", "les non-dits familiaux", "les blessures", "les sabotages", "les contrôles", "les abandons",
      "les déclencheurs", "les disciplines manquantes", "les fiertés mal placées", "les rejets", "les habitudes toxiques",
      "les pardons refusés", "les choix pour plaire", "les excuses permanentes", "les acceptations difficiles", "les cohérences manquantes",
      "les avenirs effrayants", "les défaites amères", "les validations excessives", "les souvenirs douloureux", "les routines destructrices",
      "les gâchis", "les mensonges identitaires", "les impostures", "les angles morts", "les jugements bloquants",
      "les engagements rompus", "les conflits épuisants", "les vérités coûteuses", "les sabotages pros", "les conforts vs courage",
      // Ajouts pour extrême
      "les illégalités", "les pornos", "les tromperies", "les vols", "les addictions cachées"
    ]
  }
};
function uniquePrompts(list) {
  return [...new Set(list.map((value) => value.trim()))];
}
function buildGeneratedPrompts(config, key, count) {
  const templates = key === "truth" ? config.truthTemplates : config.dareTemplates;
  const results = [];
  for (let round = 0; round < 20 && results.length < count; round += 1) {
    for (let templateIndex = 0; templateIndex < templates.length; templateIndex += 1) {
      for (let topicIndex = 0; topicIndex < config.topics.length; topicIndex += 1) {
        const template = templates[templateIndex];
        const topic = config.topics[(topicIndex + round) % config.topics.length];
        const prompt = template.replace("{topic}", topic);
        results.push(prompt);
        if (results.length >= count) {
          break;
        }
      }
      if (results.length >= count) {
        break;
      }
    }
  }
  return uniquePrompts(results).slice(0, count);
}
function extendDeckWithGeneratedPrompts() {
  Object.entries(GENERATED_PROMPTS_CONFIG).forEach(([difficulty, config]) => {
    const generatedTruth = buildGeneratedPrompts(config, "truth", config.truthCount);
    const generatedDare = buildGeneratedPrompts(config, "dare", config.dareCount);
    DECK[difficulty].truth = uniquePrompts([...DECK[difficulty].truth, ...generatedTruth]);
    DECK[difficulty].dare = uniquePrompts([...DECK[difficulty].dare, ...generatedDare]);
  });
}
extendDeckWithGeneratedPrompts();
const FIELD_VALUE = window.firebase?.firestore?.FieldValue;
const CLIENT_ID_KEY = "actionVeriteClientId";
const MAIN_PAGE_URL = "../index.html";

const state = {
  gameMode: null,
  players: [],
  playersDetailed: [],
  currentIndex: 0,
  difficulty: "bebe-cadum",
  roomMode: "waiting",
  turn: {
    cardType: null,
    cardText: "",
  },
  finishRedirectTimer: null,
  endVotes: [],
  multiplayer: {
    clientId: getOrCreateClientId(),
    playerName: "",
    roomCode: "",
    isHost: false,
    unsubscribe: null,
  },
};

function getOrCreateClientId() {
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) {
    return existing;
  }
  const nextId = `client_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(CLIENT_ID_KEY, nextId);
  return nextId;
}

function getRoomsCollection() {
  if (!firebaseDb) {
    return null;
  }
  return firebaseDb.collection("ActionVerite").doc("multiplayer").collection("rooms");
}

function getRoomRef(roomCode) {
  const rooms = getRoomsCollection();
  if (!rooms || !roomCode) {
    return null;
  }
  return rooms.doc(roomCode);
}

function setScreen(screenName) {
  Object.entries(screens).forEach(([key, node]) => {
    node?.classList.toggle("active", key === screenName);
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

function collectMultiName() {
  const playerName = (multiNameInput?.value || "").trim();
  if (!playerName) {
    return { valid: false, message: "Entre ton pseudo pour jouer en multi." };
  }
  return { valid: true, name: playerName.slice(0, 24) };
}

function pickRandomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateDifficultyUI() {
  difficultyButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === state.difficulty);
  });
}

function setCardDisplay(cardType = null, cardText = "") {
  state.turn.cardType = cardType;
  state.turn.cardText = cardText;

  if (!cardType || !cardText) {
    cardTypeLabel.textContent = "ACTION / VÉRITÉ";
    cardTextLabel.textContent = "Choisis Action ou Vérité pour afficher une carte.";
    return;
  }

  cardTypeLabel.textContent = cardType === "truth" ? "VÉRITÉ" : "ACTION";
  cardTextLabel.textContent = cardText;
}

function currentTurnPlayer() {
  return state.playersDetailed[state.currentIndex] || null;
}

function isMyTurn() {
  if (state.gameMode !== "multi") {
    return true;
  }
  const currentPlayer = currentTurnPlayer();
  return Boolean(currentPlayer && currentPlayer.id === state.multiplayer.clientId);
}

function updateCompleteButtonLabel() {
  if (state.turn.cardType === "truth") {
    completeTurnButton.textContent = "Vérité dite";
    return;
  }
  completeTurnButton.textContent = "Action faite";
}

function clearFinishRedirect() {
  if (state.finishRedirectTimer) {
    window.clearTimeout(state.finishRedirectTimer);
    state.finishRedirectTimer = null;
  }
}

function scheduleReturnToMainPage() {
  if (state.finishRedirectTimer) {
    return;
  }

  state.finishRedirectTimer = window.setTimeout(() => {
    window.location.href = MAIN_PAGE_URL;
  }, 2200);
}

function requiredEndVotesCount() {
  if (!state.players.length) {
    return 0;
  }
  return Math.ceil(state.players.length * 0.75);
}

function hasCurrentClientVotedEnd() {
  return state.endVotes.includes(state.multiplayer.clientId);
}

function updateEndVoteUI() {
  const isMulti = state.gameMode === "multi";
  const canShow = isMulti && (state.roomMode === "playing" || state.roomMode === "ended");
  endVoteWrap.classList.toggle("is-hidden", !canShow);

  if (!canShow) {
    return;
  }

  const required = requiredEndVotesCount();
  voteStatus.textContent = `Votes fin: ${state.endVotes.length}/${required}`;

  if (state.roomMode === "ended") {
    voteEndButton.disabled = true;
    voteEndButton.textContent = "Partie terminée";
    return;
  }

  const alreadyVoted = hasCurrentClientVotedEnd();
  voteEndButton.disabled = alreadyVoted;
  voteEndButton.textContent = alreadyVoted ? "Vote envoyé" : "Voter pour finir";
}

function applySetupModeUI() {
  const isSolo = state.gameMode === "solo";
  const isMulti = state.gameMode === "multi";
  soloPlayersPanel.classList.toggle("is-hidden", !isSolo);
  multiPanel.classList.toggle("is-hidden", !isMulti);
  startGameButton.classList.toggle("is-hidden", !isSolo);

  setupKicker.textContent = isMulti ? "Mode multijoueur" : "Mode local";
  setupSubtitle.textContent = isMulti
    ? "Crée un salon ou rejoins un code depuis un autre téléphone."
    : "Version solo locale sur un seul téléphone.";
}

function updateGameHeader() {
  currentPlayerLabel.textContent = state.players[state.currentIndex] || "Player";
  currentDifficultyLabel.textContent = DIFFICULTY_LABELS[state.difficulty] || "Normal";
}

function updateGameModeUI() {
  const isMulti = state.gameMode === "multi";
  gameRoomMeta.classList.toggle("is-hidden", !isMulti);
  if (isMulti) {
    gameRoomMeta.textContent = `Salon: ${state.multiplayer.roomCode || "—"}`;
  }
}

function updateTurnControls() {
  if (state.roomMode === "ended") {
    setCardDisplay(null, "");
    gameMultiHint.textContent = "Partie terminée par vote. Retour à l’accueil...";
    gameMultiHint.classList.toggle("is-hidden", false);
    truthButton.classList.add("is-hidden");
    dareButton.classList.add("is-hidden");
    truthButton.disabled = true;
    dareButton.disabled = true;
    turnActions.classList.add("is-hidden");
    redrawButton.disabled = true;
    completeTurnButton.disabled = true;
    updateEndVoteUI();
    scheduleReturnToMainPage();
    return;
  }

  clearFinishRedirect();

  const myTurn = isMyTurn();
  const hasCard = Boolean(state.turn.cardType && state.turn.cardText);

  if (myTurn) {
    gameMultiHint.textContent = hasCard
      ? "Valide ton tour ou repioche la carte."
      : "À ton tour : choisis Action ou Vérité.";
  } else {
    const playerName = state.players[state.currentIndex] || "un joueur";
    gameMultiHint.textContent = `En attente de ${playerName}.`;
  }

  gameMultiHint.classList.toggle("is-hidden", false);

  truthButton.classList.toggle("is-hidden", hasCard || !myTurn);
  dareButton.classList.toggle("is-hidden", hasCard || !myTurn);
  truthButton.disabled = hasCard || !myTurn;
  dareButton.disabled = hasCard || !myTurn;

  turnActions.classList.toggle("is-hidden", !hasCard || !myTurn);
  redrawButton.disabled = !hasCard || !myTurn;
  completeTurnButton.disabled = !hasCard || !myTurn;

  updateCompleteButtonLabel();
  updateEndVoteUI();
}

function refreshRoomLobbyUI(data = null) {
  if (state.gameMode !== "multi") {
    return;
  }

  const players = Array.isArray(data?.players) ? data.players : [];
  const playerNames = players.map((player) => player?.name).filter(Boolean);
  roomPlayers.textContent = `Joueurs: ${playerNames.length ? playerNames.join(", ") : "—"}`;

  const code = data?.roomCode || state.multiplayer.roomCode || "—";
  roomInfo.textContent = data
    ? `Salon ${code} • ${data.mode === "playing" ? "En cours" : "En attente"}`
    : `Salon ${code}`;

  const isHost = Boolean(data && data.hostId === state.multiplayer.clientId);
  state.multiplayer.isHost = isHost;
  multiRoleBadge.textContent = isHost ? "Hôte" : "Invité";

  const playersCount = players.length;
  const canStart = Boolean(isHost && data && data.mode !== "playing" && playersCount >= 2);
  startMultiButton.classList.toggle("is-hidden", !canStart);
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

async function reserveRoomCode() {
  const rooms = getRoomsCollection();
  if (!rooms) {
    throw new Error("Firebase indisponible pour le mode multi.");
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateRoomCode();
    const existing = await rooms.doc(code).get();
    if (!existing.exists) {
      return code;
    }
  }

  throw new Error("Impossible de générer un code salon, réessaie.");
}

function applyMultiplayerDoc(data) {
  const players = Array.isArray(data?.players) ? data.players : [];
  state.playersDetailed = players.map((player) => ({
    id: player?.id || "",
    name: player?.name || "Joueur",
  }));
  state.players = players.map((player) => player?.name).filter(Boolean);
  state.currentIndex = Number.isFinite(data?.currentIndex)
    ? Math.max(0, Math.min(data.currentIndex, Math.max(state.players.length - 1, 0)))
    : 0;
  state.roomMode = data?.mode || "waiting";
  state.endVotes = Array.isArray(data?.endVotes)
    ? data.endVotes.filter((value) => typeof value === "string")
    : [];
  if (data?.difficulty && DECK[data.difficulty]) {
    state.difficulty = data.difficulty;
    updateDifficultyUI();
  }

  updateGameHeader();
  refreshRoomLobbyUI(data);
  setCardDisplay(data?.currentCardType || null, data?.currentCardText || "");
  updateGameModeUI();
  updateTurnControls();

  if (state.roomMode === "playing") {
    setScreen("game");
    return;
  }

  if (state.roomMode === "ended") {
    setScreen("game");
    return;
  }

  if (state.gameMode === "multi") {
    setScreen("setup");
  }
}

function stopRoomSubscription() {
  if (typeof state.multiplayer.unsubscribe === "function") {
    state.multiplayer.unsubscribe();
  }
  state.multiplayer.unsubscribe = null;
}

function subscribeToRoom(roomCode) {
  const roomRef = getRoomRef(roomCode);
  if (!roomRef) {
    return;
  }

  stopRoomSubscription();
  state.multiplayer.unsubscribe = roomRef.onSnapshot(
    (snapshot) => {
      if (!snapshot.exists) {
        setupStatus.textContent = "Le salon a été supprimé.";
        stopRoomSubscription();
        state.multiplayer.roomCode = "";
        refreshRoomLobbyUI();
        return;
      }

      const data = snapshot.data() || {};
      state.multiplayer.roomCode = data.roomCode || roomCode;
      applyMultiplayerDoc(data);
    },
    (error) => {
      setupStatus.textContent = `Erreur salon: ${error?.message || error}`;
    }
  );
}

async function createRoom() {
  if (!firebaseDb) {
    setupStatus.textContent = "Firebase indisponible pour le mode multi.";
    return;
  }

  const playerResult = collectMultiName();
  if (!playerResult.valid) {
    setupStatus.textContent = playerResult.message;
    return;
  }

  const roomCode = await reserveRoomCode();
  const roomRef = getRoomRef(roomCode);
  if (!roomRef) {
    setupStatus.textContent = "Impossible de créer le salon.";
    return;
  }

  const createdAt = FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString();
  const payload = {
    roomCode,
    mode: "waiting",
    difficulty: state.difficulty,
    hostId: state.multiplayer.clientId,
    hostName: playerResult.name,
    players: [{ id: state.multiplayer.clientId, name: playerResult.name }],
    currentIndex: 0,
    currentCardType: null,
    currentCardText: "",
    createdAt,
    updatedAt: createdAt,
  };

  await roomRef.set(payload, { merge: true });

  state.multiplayer.playerName = playerResult.name;
  state.multiplayer.roomCode = roomCode;
  state.multiplayer.isHost = true;
  roomCodeInput.value = roomCode;
  setupStatus.textContent = `Salon créé: ${roomCode}`;
  subscribeToRoom(roomCode);

  trackGameEvent("multi_room_created", {
    roomCode,
    difficulty: state.difficulty,
  });
}

async function joinRoom() {
  if (!firebaseDb) {
    setupStatus.textContent = "Firebase indisponible pour le mode multi.";
    return;
  }

  const playerResult = collectMultiName();
  if (!playerResult.valid) {
    setupStatus.textContent = playerResult.message;
    return;
  }

  const roomCode = (roomCodeInput?.value || "").trim().toUpperCase();
  if (!roomCode || roomCode.length < 4) {
    setupStatus.textContent = "Entre un code salon valide.";
    return;
  }

  const roomRef = getRoomRef(roomCode);
  if (!roomRef) {
    setupStatus.textContent = "Impossible de rejoindre ce salon.";
    return;
  }

  await firebaseDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists) {
      throw new Error("Salon introuvable.");
    }

    const data = snapshot.data() || {};
    const players = Array.isArray(data.players) ? [...data.players] : [];
    const existingIndex = players.findIndex((player) => player?.id === state.multiplayer.clientId);

    if (data.mode === "playing" && existingIndex < 0) {
      throw new Error("Partie en cours: impossible de rejoindre maintenant.");
    }

    if (existingIndex >= 0) {
      players[existingIndex] = { ...players[existingIndex], name: playerResult.name };
    } else {
      players.push({ id: state.multiplayer.clientId, name: playerResult.name });
    }

    transaction.set(
      roomRef,
      {
        players,
        updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
      },
      { merge: true }
    );
  });

  state.multiplayer.playerName = playerResult.name;
  state.multiplayer.roomCode = roomCode;
  setupStatus.textContent = `Connecté au salon ${roomCode}.`;
  subscribeToRoom(roomCode);

  trackGameEvent("multi_room_joined", {
    roomCode,
  });
}

async function startMultiplayerGame() {
  if (!state.multiplayer.roomCode || !state.multiplayer.isHost) {
    setupStatus.textContent = "Seul l’hôte peut lancer la partie.";
    return;
  }

  const roomRef = getRoomRef(state.multiplayer.roomCode);
  if (!roomRef) {
    return;
  }

  await roomRef.set(
    {
      mode: "playing",
      currentIndex: 0,
      difficulty: state.difficulty,
      currentCardType: null,
      currentCardText: "",
      endVotes: [],
      updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
    },
    { merge: true }
  );

  trackGameEvent("multi_game_started", {
    roomCode: state.multiplayer.roomCode,
    difficulty: state.difficulty,
  });
}

async function leaveRoom() {
  if (!state.multiplayer.roomCode || !firebaseDb) {
    stopRoomSubscription();
    return;
  }

  const roomRef = getRoomRef(state.multiplayer.roomCode);
  stopRoomSubscription();

  if (!roomRef) {
    state.multiplayer.roomCode = "";
    return;
  }

  try {
    await firebaseDb.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(roomRef);
      if (!snapshot.exists) {
        return;
      }

      const data = snapshot.data() || {};
      const players = Array.isArray(data.players) ? [...data.players] : [];
      const nextPlayers = players.filter((player) => player?.id !== state.multiplayer.clientId);
      const nextPlayerIds = nextPlayers.map((player) => player?.id).filter(Boolean);
      const votes = Array.isArray(data.endVotes) ? data.endVotes : [];
      const nextVotes = votes.filter((playerId) => nextPlayerIds.includes(playerId));
      const wasHost = data.hostId === state.multiplayer.clientId;

      if (!nextPlayers.length) {
        transaction.delete(roomRef);
        return;
      }

      const nextHost = wasHost ? nextPlayers[0]?.id : data.hostId;
      const nextHostName = nextPlayers.find((player) => player.id === nextHost)?.name || data.hostName;
      const safeIndex = Math.min(Number(data.currentIndex) || 0, Math.max(nextPlayers.length - 1, 0));
      const requiredVotes = Math.ceil(nextPlayers.length * 0.75);
      const endByVote = nextPlayers.length > 0 && nextVotes.length >= requiredVotes;

      transaction.set(
        roomRef,
        {
          players: nextPlayers,
          hostId: nextHost,
          hostName: nextHostName,
          currentIndex: safeIndex,
          mode: data.mode === "playing" && nextPlayers.length < 2 ? "waiting" : endByVote ? "ended" : data.mode,
          currentCardType:
            data.mode === "playing" && (nextPlayers.length < 2 || endByVote)
              ? null
              : data.currentCardType || null,
          currentCardText:
            data.mode === "playing" && (nextPlayers.length < 2 || endByVote)
              ? ""
              : data.currentCardText || "",
          endVotes: nextVotes,
          updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
        },
        { merge: true }
      );
    });
  } catch (error) {
    console.warn("[ActionVerite] leaveRoom error:", error?.message || error);
  }

  state.multiplayer.roomCode = "";
  state.multiplayer.isHost = false;
  state.playersDetailed = [];
  state.players = [];
  state.currentIndex = 0;
  state.roomMode = "waiting";
  state.endVotes = [];
  setCardDisplay(null, "");
  refreshRoomLobbyUI();
}

async function drawCard(type) {
  if (!type || !DECK[state.difficulty]?.[type]) {
    return;
  }

  if (!isMyTurn()) {
    return;
  }

  if (state.gameMode === "multi") {
    if (!state.multiplayer.roomCode || state.roomMode !== "playing") {
      return;
    }

    const pool = DECK[state.difficulty][type];
    const text = pickRandomFrom(pool);
    const roomRef = getRoomRef(state.multiplayer.roomCode);
    await roomRef?.set(
      {
        currentCardType: type,
        currentCardText: text,
        updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
      },
      { merge: true }
    );
    return;
  }

  const pool = DECK[state.difficulty][type];
  const text = pickRandomFrom(pool);
  setCardDisplay(type, text);
  updateTurnControls();
}

async function redrawCurrentCard() {
  if (!state.turn.cardType || !isMyTurn()) {
    return;
  }
  await drawCard(state.turn.cardType);
}

async function completeTurn() {
  if (!state.turn.cardType || !isMyTurn()) {
    return;
  }

  if (state.gameMode === "multi") {
    if (!state.multiplayer.roomCode || state.roomMode !== "playing") {
      return;
    }

    const roomRef = getRoomRef(state.multiplayer.roomCode);
    const nextIndex = state.players.length ? (state.currentIndex + 1) % state.players.length : 0;
    await roomRef?.set(
      {
        currentIndex: nextIndex,
        currentCardType: null,
        currentCardText: "",
        updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
      },
      { merge: true }
    );
    return;
  }

  state.currentIndex = (state.currentIndex + 1) % state.players.length;
  updateGameHeader();
  setCardDisplay(null, "");
  updateTurnControls();
}

async function voteToEndGame() {
  if (state.gameMode !== "multi" || !state.multiplayer.roomCode) {
    return;
  }

  const roomRef = getRoomRef(state.multiplayer.roomCode);
  if (!roomRef) {
    return;
  }

  await firebaseDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists) {
      throw new Error("Salon introuvable.");
    }

    const data = snapshot.data() || {};
    if (data.mode !== "playing") {
      return;
    }

    const players = Array.isArray(data.players) ? data.players : [];
    const playerIds = players.map((player) => player?.id).filter(Boolean);
    if (!playerIds.includes(state.multiplayer.clientId)) {
      throw new Error("Tu n'es plus dans cette partie.");
    }

    const votes = Array.isArray(data.endVotes) ? [...data.endVotes] : [];
    if (!votes.includes(state.multiplayer.clientId)) {
      votes.push(state.multiplayer.clientId);
    }

    const requiredVotes = Math.ceil(playerIds.length * 0.75);
    const shouldEnd = votes.length >= requiredVotes;

    transaction.set(
      roomRef,
      {
        endVotes: votes,
        mode: shouldEnd ? "ended" : data.mode,
        currentCardType: shouldEnd ? null : data.currentCardType || null,
        currentCardText: shouldEnd ? "" : data.currentCardText || "",
        endedAt: shouldEnd
          ? FIELD_VALUE?.serverTimestamp
            ? FIELD_VALUE.serverTimestamp()
            : new Date().toISOString()
          : data.endedAt || null,
        updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
      },
      { merge: true }
    );
  });
}

modeSoloButton.addEventListener("click", () => {
  state.gameMode = "solo";
  applySetupModeUI();
  setupStatus.textContent = "";
  setScreen("setup");
  setCardDisplay(null, "");
  updateGameModeUI();
  updateTurnControls();
});

modeMultiButton.addEventListener("click", () => {
  state.gameMode = "multi";
  applySetupModeUI();
  setupStatus.textContent = firebaseDb ? "Crée un salon ou rejoins un code existant." : "Firebase requis pour le mode multi.";
  setScreen("setup");
  setCardDisplay(null, "");
  updateGameModeUI();
  updateTurnControls();
});

backModeButton.addEventListener("click", async () => {
  if (state.gameMode === "multi") {
    await leaveRoom();
  }
  state.gameMode = null;
  setScreen("mode");
  setupStatus.textContent = "";
});

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

  if (state.gameMode === "multi" && !state.multiplayer.isHost && state.multiplayer.roomCode && state.roomMode !== "playing") {
    setupStatus.textContent = "Seul l’hôte peut changer la difficulté.";
    return;
  }

  state.difficulty = difficulty;
  updateDifficultyUI();

  if (state.gameMode === "multi" && state.multiplayer.isHost && state.multiplayer.roomCode) {
    const roomRef = getRoomRef(state.multiplayer.roomCode);
    roomRef
      ?.set(
        {
          difficulty,
          updatedAt: FIELD_VALUE?.serverTimestamp ? FIELD_VALUE.serverTimestamp() : new Date().toISOString(),
        },
        { merge: true }
      )
      .catch((error) => {
        setupStatus.textContent = `Erreur difficulté: ${error?.message || error}`;
      });
  }
});

startGameButton.addEventListener("click", () => {
  const playersResult = collectPlayers();
  if (!playersResult.valid) {
    setupStatus.textContent = playersResult.message;
    trackGameEvent("setup_invalid", {
      reason: playersResult.message,
      difficulty: state.difficulty,
    });
    return;
  }

  state.players = playersResult.names;
  state.playersDetailed = playersResult.names.map((name, index) => ({ id: `local_${index}`, name }));
  state.currentIndex = 0;
  setupStatus.textContent = "";
  setScreen("game");
  updateGameHeader();
  setCardDisplay(null, "");
  updateGameModeUI();
  updateTurnControls();

  trackGameEvent("game_started", {
    mode: "solo",
    difficulty: state.difficulty,
    playersCount: state.players.length,
  });
});

createRoomButton.addEventListener("click", () => {
  createRoom().catch((error) => {
    setupStatus.textContent = error?.message || "Erreur création salon.";
  });
});

joinRoomButton.addEventListener("click", () => {
  joinRoom().catch((error) => {
    setupStatus.textContent = error?.message || "Erreur connexion salon.";
  });
});

startMultiButton.addEventListener("click", () => {
  startMultiplayerGame().catch((error) => {
    setupStatus.textContent = error?.message || "Erreur lancement multi.";
  });
});

truthButton.addEventListener("click", () => {
  drawCard("truth")
    .then(() => {
      trackGameEvent("card_drawn", {
        mode: state.gameMode || "unknown",
        cardType: "truth",
        difficulty: state.difficulty,
        roomCode: state.multiplayer.roomCode || null,
      });
    })
    .catch((error) => {
      setupStatus.textContent = `Erreur carte: ${error?.message || error}`;
    });
});

dareButton.addEventListener("click", () => {
  drawCard("dare")
    .then(() => {
      trackGameEvent("card_drawn", {
        mode: state.gameMode || "unknown",
        cardType: "dare",
        difficulty: state.difficulty,
        roomCode: state.multiplayer.roomCode || null,
      });
    })
    .catch((error) => {
      setupStatus.textContent = `Erreur carte: ${error?.message || error}`;
    });
});

redrawButton.addEventListener("click", () => {
  redrawCurrentCard()
    .then(() => {
      trackGameEvent("card_redrawn", {
        mode: state.gameMode || "unknown",
        cardType: state.turn.cardType || "unknown",
        difficulty: state.difficulty,
        roomCode: state.multiplayer.roomCode || null,
      });
    })
    .catch((error) => {
      setupStatus.textContent = `Erreur repioche: ${error?.message || error}`;
    });
});

completeTurnButton.addEventListener("click", () => {
  const finishedCardType = state.turn.cardType || "unknown";
  completeTurn()
    .then(() => {
      trackGameEvent("turn_completed", {
        mode: state.gameMode || "unknown",
        cardType: finishedCardType,
        difficulty: state.difficulty,
        roomCode: state.multiplayer.roomCode || null,
      });
    })
    .catch((error) => {
      setupStatus.textContent = `Erreur validation: ${error?.message || error}`;
    });
});

voteEndButton.addEventListener("click", () => {
  voteToEndGame()
    .then(() => {
      trackGameEvent("game_end_vote_cast", {
        mode: state.gameMode || "unknown",
        roomCode: state.multiplayer.roomCode || null,
      });
    })
    .catch((error) => {
      setupStatus.textContent = `Erreur vote fin: ${error?.message || error}`;
    });
});

window.addEventListener("beforeunload", () => {
  if (state.gameMode === "multi" && state.multiplayer.roomCode) {
    leaveRoom();
  }
});

playersList.appendChild(createPlayerRow("Joueur 1"));
playersList.appendChild(createPlayerRow("Joueur 2"));
applySetupModeUI();
updateDifficultyUI();
setCardDisplay(null, "");
setScreen("mode");
updateGameModeUI();
updateTurnControls();

trackGameEvent("game_loaded", {
  difficulty: state.difficulty,
});