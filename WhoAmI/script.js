const screens = {
  home: document.getElementById("home-screen"),
  countdown: document.getElementById("countdown-screen"),
  reveal: document.getElementById("reveal-screen"),
};

const playButton = document.getElementById("play-btn");
const modeSelect = document.getElementById("mode-select");
const countdownNumber = document.getElementById("countdown-number");
const nameCard = document.getElementById("name-card");
const roleName = document.getElementById("role-name");
const roleHint = document.getElementById("role-hint");
const roleImage = document.getElementById("role-image");
const restartRoundButton = document.getElementById("restart-round-btn");
const changeModeHomeButton = document.getElementById("change-mode-home-btn");
const foundQuickButton = document.getElementById("found-quick-btn");
const actionMenu = document.getElementById("action-menu");
const changePersonButton = document.getElementById("change-person-btn");
const foundButton = document.getElementById("found-btn");
const resultOverlay = document.getElementById("result-overlay");
const resultRole = document.getElementById("result-role");
const resultRoleHint = document.getElementById("result-role-hint");
const resultRoleImage = document.getElementById("result-role-image");
const resultTime = document.getElementById("result-time");
const nextRoundButton = document.getElementById("next-round-btn");
const greenFlash = document.getElementById("green-flash");

const trackGameEvent = (eventType, payload = {}) => {
  window.GamesFirebase?.trackEvent?.("WhoAmI", eventType, payload);
};

const famousNames = [
  "Kylian Mbappé — footballeur français",
  "Lionel Messi — footballeur argentin",
  "Cristiano Ronaldo — footballeur portugais",
  "Neymar — footballeur brésilien",
  "Zinedine Zidane — légende du football français",
  "Karim Benzema — footballeur français",
  "Antoine Griezmann — footballeur français",
  "Didier Drogba — légende du football ivoirien",
  "Erling Haaland — footballeur norvégien",
  "Jude Bellingham — footballeur anglais",
  "Luka Modrić — footballeur croate",
  "Ronaldinho — légende du football brésilien",
  "Ronaldo Nazário — légende du football brésilien",
  "Pelé — légende du football mondial",
  "Diego Maradona — légende du football argentin",
  "LeBron James — basketteur NBA",
  "Michael Jordan — légende NBA",
  "Stephen Curry — basketteur NBA",
  "Kobe Bryant — légende NBA",
  "Victor Wembanyama — basketteur français NBA",
  "Giannis Antetokounmpo — basketteur NBA",
  "Nikola Jokić — basketteur NBA",
  "Rafael Nadal — champion de tennis",
  "Roger Federer — champion de tennis",
  "Novak Djokovic — champion de tennis",
  "Serena Williams — légende du tennis",
  "Carlos Alcaraz — joueur de tennis espagnol",
  "Iga Świątek — joueuse de tennis polonaise",
  "Usain Bolt — sprinteur jamaïcain",
  "Teddy Riner — judoka français",

  "Taylor Swift — chanteuse américaine",
  "Beyoncé — chanteuse américaine",
  "Rihanna — chanteuse barbadienne",
  "Ariana Grande — chanteuse américaine",
  "Billie Eilish — chanteuse américaine",
  "Dua Lipa — chanteuse britannique",
  "Lady Gaga — chanteuse américaine",
  "Shakira — chanteuse colombienne",
  "Ed Sheeran — chanteur britannique",
  "Bruno Mars — chanteur américain",
  "Drake — rappeur canadien",
  "The Weeknd — chanteur canadien",
  "Justin Bieber — chanteur canadien",
  "Selena Gomez — chanteuse américaine",
  "Adele — chanteuse britannique",
  "Sia — chanteuse australienne",
  "Katy Perry — chanteuse américaine",
  "Miley Cyrus — chanteuse américaine",
  "Stromae — chanteur belge",
  "Aya Nakamura — chanteuse française",
  "Gims — chanteur français",
  "Jul — rappeur français",
  "Ninho — rappeur français",
  "Soprano — rappeur français",
  "Booba — rappeur français",
  "Orelsan — rappeur français",
  "Damso — rappeur belge",
  "Kendrick Lamar — rappeur américain",
  "Eminem — rappeur américain",
  "Snoop Dogg — rappeur américain",

  "Leonardo DiCaprio — acteur américain",
  "Brad Pitt — acteur américain",
  "Tom Cruise — acteur américain",
  "Will Smith — acteur américain",
  "Dwayne Johnson — acteur américain",
  "Keanu Reeves — acteur canadien",
  "Robert Downey Jr. — acteur américain",
  "Chris Hemsworth — acteur australien",
  "Ryan Reynolds — acteur canadien",
  "Johnny Depp — acteur américain",
  "Morgan Freeman — acteur américain",
  "Tom Hanks — acteur américain",
  "Scarlett Johansson — actrice américaine",
  "Jennifer Lawrence — actrice américaine",
  "Margot Robbie — actrice australienne",
  "Emma Watson — actrice britannique",
  "Zendaya — actrice américaine",
  "Angelina Jolie — actrice américaine",
  "Natalie Portman — actrice américaine",
  "Meryl Streep — actrice américaine",
  "Omar Sy — acteur français",
  "Marion Cotillard — actrice française",
  "Jean Dujardin — acteur français",
  "Vincent Cassel — acteur français",
  "Pierre Niney — acteur français",
  "Alain Delon — acteur français",
  "Jean-Paul Belmondo — acteur français",
  "Denzel Washington — acteur américain",
  "Anne Hathaway — actrice américaine",
  "Hugh Jackman — acteur australien",

  "MrBeast — youtubeur américain",
  "PewDiePie — youtubeur suédois",
  "Squeezie — youtubeur français",
  "Inoxtag — créateur de contenu français",
  "Michou — créateur de contenu français",
  "Léna Situations — créatrice de contenu française",
  "Tibo InShape — créateur de contenu français",
  "Ninja — streamer américain",
  "Pokimane — streameuse canado-marocaine",
  "Ibai — streamer espagnol",

  "Elon Musk — entrepreneur",
  "Bill Gates — cofondateur de Microsoft",
  "Steve Jobs — cofondateur d'Apple",
  "Mark Zuckerberg — fondateur de Facebook",
  "Jeff Bezos — fondateur d'Amazon",
  "Tim Cook — PDG d'Apple",
  "Satya Nadella — PDG de Microsoft",
  "Sam Altman — entrepreneur dans l'IA",
  "Warren Buffett — investisseur américain",
  "Bernard Arnault — entrepreneur français",

  "Albert Einstein — physicien",
  "Marie Curie — scientifique",
  "Isaac Newton — physicien et mathématicien",
  "Galilée — astronome italien",
  "Nikola Tesla — inventeur",
  "Stephen Hawking — physicien",
  "Charles Darwin — naturaliste",
  "Louis Pasteur — scientifique français",
  "Thomas Edison — inventeur",
  "Alan Turing — pionnier de l'informatique",

  "Napoléon Bonaparte — empereur français",
  "Charles de Gaulle — homme d'État français",
  "Winston Churchill — homme d'État britannique",
  "Nelson Mandela — leader sud-africain",
  "Martin Luther King Jr. — militant des droits civiques",
  "Mahatma Gandhi — leader indien",
  "Barack Obama — ancien président américain",
  "Donald Trump — président américain",
  "Joe Biden — président américain",
  "Vladimir Poutine — président russe",
  "Emmanuel Macron — président français",
  "Angela Merkel — ancienne chancelière allemande",
  "Xi Jinping — président chinois",
  "Volodymyr Zelensky — président ukrainien",
  "Jules César — chef romain",
  "Cléopâtre — reine d'Égypte",

  "Victor Hugo — écrivain français",
  "Molière — dramaturge français",
  "William Shakespeare — dramaturge anglais",
  "Pablo Picasso — peintre espagnol",
  "Léonard de Vinci — artiste et inventeur",
  "Frida Kahlo — peintre mexicaine",
  "Mozart — compositeur autrichien",
  "Beethoven — compositeur allemand",
  "Michael Jackson — chanteur américain",
  "Madonna — chanteuse américaine",
  "Freddie Mercury — chanteur britannique",
  "Bob Marley — chanteur jamaïcain",
  "Elvis Presley — chanteur américain",
  "Bruce Lee — acteur et expert en arts martiaux",
  "Jackie Chan — acteur et cascadeur",
  "Thomas Pesquet — astronaute français",

  "Théodora — rappeuse française",
  "SDM — rappeur français",
  "Werenoi — rappeur français",
  "Gazo — rappeur français",
  "Tiakola — rappeur français",
  "Favé — rappeur français",
  "Zola — rappeur français",
  "Hamza — rappeur belge",
  "Maes — rappeur français",
  "Koba LaD — rappeur français",
  "Heuss L'Enfoiré — rappeur français",
  "SCH — rappeur français",
  "PLK — rappeur français",
  "Kaaris — rappeur français",
  "Dinos — rappeur français",
  "Lomepal — rappeur français",
  "Lefa — rappeur français",
  "Alonzo — rappeur français",
  "Kalash Criminel — rappeur français",
  "Niska — rappeur français",
  "Josman — rappeur français",
  "Lujipeka — rappeur français",
  "Népal — rappeur français",
  "Alkpote — rappeur français",
  "La Fève — rappeur français",
  "Luther — rappeur français",
  "Leto — rappeur français",
  "Laylow — rappeur français",
  "Nekfeu — rappeur français",
  "Bigflo & Oli — duo de rap français",
  "Vald — rappeur français",
  "Lorenzo — rappeur français",
  "Naps — rappeur français",
  "Rim'K — rappeur français",
  "Médine — rappeur français",
  "Guy2Bezbar — rappeur français",
  "Rohff — rappeur français",
  "Sinik — rappeur français",
  "Kery James — rappeur français",
  "Fianso — rappeur français",
  "Sofiane — rappeur français",
  "La Mano 1.9 — rappeur français",
  "Houdi — rappeur français",
  "Kerchak — rappeur français",
  "Shay — rappeuse belge",
  "Aleff — rappeur français",
  "J9ueve — rappeur français",
  "Ashe 22 — rappeur français",
  "DA Uzi — rappeur français",
  "Ziak — rappeur français",

  "Amixem — youtubeur français",
  "Joyca — youtubeur français",
  "Anyme023 — youtubeur français",
  "Cyprien — youtubeur français",
  "Norman — youtubeur français",
  "Mister V — youtubeur et rappeur français",
  "McFly & Carlito — duo youtubeur français",
  "Natoo — youtubeuse française",
  "EnjoyPhoenix — youtubeuse française",
  "HugoDécrypte — youtubeur d'actualité français",
  "Dr Nozman — youtubeur science français",
  "Léo Techmaker — youtubeur tech français",
  "Léo Grasset (DirtyBiology) — youtubeur science français",
  "Joueur du Grenier — youtubeur français",
  "Guillaume Pley — animateur et youtubeur français",
  "AmineMaTue — streamer et youtubeur français",
  "Domingo — streamer français",
  "Locklear — streamer français",
  "LeBouseuh — youtubeur français",
  "Swan & Néo — youtubeurs français",
  "Fuze III — youtubeur français",
  "Doigby — youtubeur français",
  "TheKairi78 — youtubeur français",
  "Pierre Croce — youtubeur français",
  "Monsieur Poulpe — youtubeur et animateur français",
  "Squeezie — youtubeur français",
  "Inoxtag — créateur de contenu français",
  "Michou — créateur de contenu français",
  "Tibo InShape — créateur de contenu français",
  "Léna Situations — créatrice de contenu française",

  "Gotaga — streamer français",
  "Kameto — streamer français",
  "ZeratoR — streamer français",
  "Etoiles — streamer français",
  "Sardoche — streamer français",
  "Maghla — streameuse française",
  "Ponce — streamer français",
  "Antoine Daniel — streamer et youtubeur français",
  "Baghera Jones — streameuse française",
  "Mister MV — streamer français",
  "Chowh1 — streamer français",
  "Xari — streameur français",
  "Deujna — streamer français",
  "Horty — streamer français",
  "Rivenzi — streamer français",

  "Angèle — chanteuse belge",
  "Clara Luciani — chanteuse française",
  "Louane — chanteuse française",
  "Pomme — chanteuse française",
  "Vianney — chanteur français",
  "Kendji Girac — chanteur français",
  "Slimane — chanteur français",
  "Vitaa — chanteuse française",
  "Hoshi — chanteuse française",
  "Pierre de Maere — chanteur belge",
  "Zaho de Sagazan — chanteuse française",
  "Yseult — chanteuse française",
  "Santa — chanteuse française",
  "Adé — chanteuse française",
  "Soolking — chanteur algérien",
  "Ronisia — chanteuse française",
  "Juliette Armanet — chanteuse française",
  "M. Pokora — chanteur français",
  "Mylène Farmer — chanteuse française",
  "Benjamin Biolay — chanteur français",
  "Eddy de Pretto — chanteur français",
  "Julien Doré — chanteur français",
  "Christine and the Queens — chanteuse française",

  "Paul Mirabel — humoriste français",
  "Panayotis Pascot — humoriste français",
  "Haroun — humoriste français",
  "Waly Dia — humoriste français",
  "Fabrice Éboué — humoriste français",
  "Blanche Gardin — humoriste française",
  "Fary — humoriste français",
  "Kyan Khojandi — humoriste français",
  "Jamel Debbouze — humoriste français",
  "Gad Elmaleh — humoriste français",
  "Florence Foresti — humoriste française",
  "Redouane Bougheraba — humoriste français",
  "Roman Frayssinet — humoriste français",
  "Laura Felpin — humoriste française",
  "Alban Ivanov — humoriste français",
  "Franck Dubosc — humoriste français",
  "Ahmed Sylla — humoriste français",
  "Kev Adams — humoriste français",
  "Malik Bentalha — humoriste français",
  "Baptiste Lecaplain — humoriste français",
  "Guillaume Meurice — humoriste français",
  "Inès Reg — humoriste française",
  "Booder — humoriste français",

  "Nabilla — personnalité TV française",
  "Maeva Ghennam — personnalité TV française",
  "Carla Moreau — personnalité TV française",
  "Jazz Correia — personnalité TV française",
  "Laurent Correia — personnalité TV français",
  "Julien Tanti — personnalité TV français",
  "Manon Marsault — personnalité TV française",
  "Jessica Thivenin — personnalité TV française",
  "Thibault Garcia — personnalité TV français",
  "Nasdas — créateur de contenu français",
  "Maxime Biaggi (InscopeTV) — créateur de contenu français",
  "Ftsimo — créateur de contenu français",

  "Kylian Mbappé — footballeur français",
  "Aurélien Tchouaméni — footballeur français",
  "Eduardo Camavinga — footballeur français",
  "Warren Zaïre-Emery — footballeur français",
  "Bradley Barcola — footballeur français",
  "Ousmane Dembélé — footballeur français",
  "Marcus Thuram — footballeur français",
  "Randal Kolo Muani — footballeur français",
  "Mike Maignan — footballeur français",
  "Ibrahima Konaté — footballeur français",
  "William Saliba — footballeur français",
  "Jules Koundé — footballeur français",
  "Dayot Upamecano — footballeur français",
  "Théo Hernandez — footballeur français",
  "Adrien Rabiot — footballeur français",
  "N'Golo Kanté — footballeur français",
  "Antoine Dupont — rugbyman français",
  "Léon Marchand — nageur français",
  "Florent Manaudou — nageur français",
  "Renaud Lavillenie — perchiste français",
  "Caroline Garcia — joueuse de tennis française",
  "Gaël Monfils — joueur de tennis français",

  "Omar Sy — acteur français",
  "Marion Cotillard — actrice française",
  "Jean Dujardin — acteur français",
  "Vincent Cassel — acteur français",
  "Pierre Niney — acteur français",
  "François Civil — acteur français",
  "Adèle Exarchopoulos — actrice française",
  "Virginie Efira — actrice française",
  "Léa Seydoux — actrice française",
  "Tahar Rahim — acteur français",
  "Jean-Pascal Zadi — acteur et humoriste français",
  "Camille Cottin — actrice française",
  "Anaïs Demoustier — actrice française",
  "Louis Garrel — acteur français",
  "Raphaël Quenard — acteur français",
  "Jonathan Cohen — acteur français",

  "Cyril Hanouna — animateur TV français",
  "Michel Drucker — animateur TV français",
  "Nagui — animateur TV français",
  "Arthur — animateur TV français",
  "Yann Barthès — animateur TV français",
  "Laurent Ruquier — animateur TV français",
  "Léa Salamé — journaliste française",
  "Anne-Sophie Lapix — journaliste française",

  "Jordan Bardella — politique français",
  "Marine Le Pen — politique française",
  "Jean-Luc Mélenchon — politique français",
  "Édouard Philippe — politique français",
  "Gabriel Attal — politique français",
  "Élisabeth Borne — politique française",
  "François Ruffin — politique français",
  "Éric Zemmour — politique français"
];

const animalNames = [
  "Lion — roi de la savane",
  "Tigre — grand félin rayé",
  "Éléphant — plus grand mammifère terrestre",
  "Girafe — mammifère au long cou",
  "Zèbre — équidé à rayures noires et blanches",
  "Rhinocéros — grand mammifère à corne",
  "Hippopotame — mammifère semi-aquatique",
  "Guépard — félin le plus rapide",
  "Panthère — grand félin",
  "Léopard — félin tacheté",
  "Ours brun — grand omnivore",
  "Ours polaire — ours de l'Arctique",
  "Loup — canidé sauvage",
  "Renard — canidé roux",
  "Cerf — grand herbivore forestier",
  "Sanglier — mammifère sauvage",
  "Lapin — petit mammifère aux longues oreilles",
  "Écureuil — rongeur arboricole",
  "Panda — ours noir et blanc",
  "Koala — marsupial australien",
  "Kangourou — marsupial sauteur",
  "Dauphin — mammifère marin",
  "Baleine bleue — plus grand animal du monde",
  "Orque — cétacé prédateur",
  "Requin blanc — grand poisson prédateur",
  "Pieuvre — mollusque à huit bras",
  "Pingouin — oiseau marin de l'hémisphère sud",
  "Aigle — rapace",
  "Hibou — oiseau nocturne",
  "Perroquet — oiseau coloré",
  "Paon — oiseau à grande roue de plumes",
  "Autruche — plus grand oiseau terrestre",
  "Flamant rose — oiseau rose des zones humides",
  "Crocodile — reptile semi-aquatique",
  "Serpent — reptile sans pattes",
  "Tortue — reptile à carapace",
  "Caméléon — reptile qui change de couleur",
  "Grenouille — amphibien sauteur",
  "Abeille — insecte pollinisateur",
  "Papillon — insecte aux ailes colorées",
  "Coccinelle — petit insecte à pois",
  "Fourmi — insecte social",
  "Araignée — arthropode à huit pattes",
  "Escargot — mollusque à coquille",
  "Crabe — crustacé",
  "Homard — crustacé marin",
  "Morse — mammifère marin à défenses",
  "Phoque — mammifère marin",
  "Chameau — mammifère du désert",
  "Dromadaire — camélidé à une bosse"
];

const objectNames = [
  "Téléphone — appareil mobile",
  "Ordinateur — machine informatique",
  "Clavier — périphérique pour taper",
  "Souris — périphérique informatique",
  "Écran — affichage visuel",
  "Casque audio — écouteurs pour la tête",
  "Enceinte — haut-parleur",
  "Télévision — écran de salon",
  "Télécommande — commande à distance",
  "Appareil photo — capture d'images",
  "Lunettes — correction de la vue",
  "Montre — objet pour lire l'heure",
  "Réveil — horloge avec alarme",
  "Lampe — source de lumière",
  "Ampoule — source lumineuse",
  "Batterie — stockage d'énergie",
  "Chargeur — alimentation électrique",
  "Sac à dos — sac de transport",
  "Portefeuille — rangement pour cartes",
  "Clés — ouvrent une serrure",
  "Parapluie — protection contre la pluie",
  "Valise — bagage de voyage",
  "Bouteille — récipient pour liquide",
  "Verre — récipient pour boire",
  "Tasse — récipient pour boisson chaude",
  "Assiette — vaisselle pour manger",
  "Bol — récipient de cuisine",
  "Cuillère — couvert",
  "Fourchette — couvert",
  "Couteau — ustensile coupant",
  "Poêle — ustensile de cuisson",
  "Casserole — récipient de cuisson",
  "Réfrigérateur — appareil pour conserver au froid",
  "Four — appareil de cuisson",
  "Micro-ondes — appareil de chauffe rapide",
  "Machine à laver — appareil électroménager",
  "Aspirateur — appareil de nettoyage",
  "Canapé — siège de salon",
  "Chaise — siège",
  "Table — meuble plat",
  "Lit — meuble pour dormir",
  "Oreiller — coussin pour la tête",
  "Couverture — textile pour se couvrir",
  "Livre — objet de lecture",
  "Stylo — instrument d'écriture",
  "Crayon — instrument d'écriture",
  "Gomme — efface le crayon",
  "Règle — outil de mesure",
  "Ciseaux — outil de découpe",
  "Marteau — outil de bricolage"
];

const countryNames = [
  "France — pays d'Europe",
  "Espagne — pays d'Europe",
  "Portugal — pays d'Europe",
  "Italie — pays d'Europe",
  "Allemagne — pays d'Europe",
  "Royaume-Uni — pays d'Europe",
  "Irlande — pays d'Europe",
  "Belgique — pays d'Europe",
  "Pays-Bas — pays d'Europe",
  "Suisse — pays d'Europe",
  "Autriche — pays d'Europe",
  "Suède — pays d'Europe",
  "Norvège — pays d'Europe",
  "Danemark — pays d'Europe",
  "Finlande — pays d'Europe",
  "Pologne — pays d'Europe",
  "Grèce — pays d'Europe",
  "Turquie — pays transcontinental",
  "États-Unis — pays d'Amérique du Nord",
  "Canada — pays d'Amérique du Nord",
  "Mexique — pays d'Amérique du Nord",
  "Brésil — pays d'Amérique du Sud",
  "Argentine — pays d'Amérique du Sud",
  "Colombie — pays d'Amérique du Sud",
  "Chili — pays d'Amérique du Sud",
  "Pérou — pays d'Amérique du Sud",
  "Maroc — pays d'Afrique",
  "Algérie — pays d'Afrique",
  "Tunisie — pays d'Afrique",
  "Égypte — pays d'Afrique",
  "Nigeria — pays d'Afrique",
  "Sénégal — pays d'Afrique",
  "Côte d'Ivoire — pays d'Afrique",
  "Afrique du Sud — pays d'Afrique",
  "Kenya — pays d'Afrique",
  "Arabie saoudite — pays du Moyen-Orient",
  "Émirats arabes unis — pays du Moyen-Orient",
  "Qatar — pays du Moyen-Orient",
  "Inde — pays d'Asie",
  "Pakistan — pays d'Asie",
  "Chine — pays d'Asie",
  "Japon — pays d'Asie",
  "Corée du Sud — pays d'Asie",
  "Indonésie — pays d'Asie",
  "Thaïlande — pays d'Asie",
  "Vietnam — pays d'Asie",
  "Australie — pays d'Océanie",
  "Nouvelle-Zélande — pays d'Océanie",
  "Ukraine — pays d'Europe",
  "Russie — pays d'Eurasie"
];

const gameModes = {
  celebrities: famousNames,
  animals: animalNames,
  objects: objectNames,
  countries: countryNames,
  all: [...famousNames, ...animalNames, ...objectNames, ...countryNames],
};

let namePool = [];
let countdownTimer = null;
let wakeLock = null;
let pressTimer = null;
let pressStarted = false;
let currentRole = "";
let currentRoleHint = "";
let currentRoleImage = "";
let lastPickedName = "";
let recentPickedNames = [];
let activeMode = "celebrities";
let roleShownTimestamp = 0;
let imageFetchToken = 0;

const LONG_PRESS_MS = 520;
const FLASH_DURATION_MS = 2100;
const RECENT_BLOCK_COUNT = 50;

function showScreen(screenKey) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenKey].classList.add("active");
}

function refillPool() {
  const modeEntries = gameModes[activeMode] || gameModes.celebrities;
  namePool = [...modeEntries];
}

function syncModeFromSelection() {
  const selectedMode = modeSelect?.value || "celebrities";
  if (selectedMode === activeMode) {
    return;
  }

  activeMode = selectedMode;
  lastPickedName = "";
  recentPickedNames = [];
  refillPool();
}

function getRandomName() {
  if (namePool.length === 0) {
    refillPool();
  }

  const blockedNames = new Set(recentPickedNames);
  const preferredIndexes = [];

  for (let index = 0; index < namePool.length; index += 1) {
    const candidate = namePool[index];
    if (candidate !== lastPickedName && !blockedNames.has(candidate)) {
      preferredIndexes.push(index);
    }
  }

  let selectedIndex = -1;

  if (preferredIndexes.length > 0) {
    const randomPreferred = Math.floor(Math.random() * preferredIndexes.length);
    selectedIndex = preferredIndexes[randomPreferred];
  } else {
    const nonLastIndexes = [];
    for (let index = 0; index < namePool.length; index += 1) {
      if (namePool[index] !== lastPickedName) {
        nonLastIndexes.push(index);
      }
    }

    if (nonLastIndexes.length > 0) {
      const randomNonLast = Math.floor(Math.random() * nonLastIndexes.length);
      selectedIndex = nonLastIndexes[randomNonLast];
    } else {
      selectedIndex = Math.floor(Math.random() * namePool.length);
    }
  }

  const pickedName = namePool.splice(selectedIndex, 1)[0];

  lastPickedName = pickedName;
  recentPickedNames.push(pickedName);
  if (recentPickedNames.length > RECENT_BLOCK_COUNT) {
    recentPickedNames.shift();
  }

  return pickedName;
}

function parseRole(entry) {
  const separator = " — ";
  if (!entry.includes(separator)) {
    return {
      name: entry,
      hint: "",
    };
  }

  const [name, ...rest] = entry.split(separator);
  return {
    name: name.trim(),
    hint: rest.join(separator).trim(),
  };
}

function toKeywordHint(text) {
  if (!text) {
    return "";
  }

  const compact = text
    .replace(/[()]/g, " ")
    .replace(/[,:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stopWords = new Set([
    "de", "du", "des", "la", "le", "les", "d", "l", "un", "une", "et", "en", "dans", "pour", "au", "aux", "ta", "ton", "tous", "toutes", "ses", "son", "sa", "ton", "quotidien"
  ]);

  const tokens = compact
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1)
    .filter((token) => !stopWords.has(token.toLowerCase()));

  return tokens.slice(0, 5).join(" • ");
}

function fallbackImageForRole(name) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "JS";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect width="256" height="256" rx="28" fill="url(#g)"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial" font-size="86" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function fetchWikipediaImage(query, language = "fr") {
  const title = encodeURIComponent(query.trim().replace(/\s+/g, "_"));
  const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return "";
    }

    const data = await response.json();
    return data.thumbnail?.source || data.originalimage?.source || "";
  } catch {
    return "";
  }
}

async function resolveRoleImage(name, hint) {
  const wikiQuery = `${name} ${hint.replace(/•/g, " ")}`.trim();
  const byNameFr = await fetchWikipediaImage(name, "fr");
  if (byNameFr) {
    return byNameFr;
  }

  const byQueryFr = await fetchWikipediaImage(wikiQuery, "fr");
  if (byQueryFr) {
    return byQueryFr;
  }

  const byNameEn = await fetchWikipediaImage(name, "en");
  if (byNameEn) {
    return byNameEn;
  }

  const byQueryEn = await fetchWikipediaImage(wikiQuery, "en");
  if (byQueryEn) {
    return byQueryEn;
  }

  return fallbackImageForRole(name);
}

function applyRoleImage(url, altText) {
  roleImage.src = url;
  roleImage.alt = altText;
  resultRoleImage.src = url;
  resultRoleImage.alt = altText;
}

async function updateRoleImage(name, hint) {
  imageFetchToken += 1;
  const currentToken = imageFetchToken;
  const fallback = fallbackImageForRole(name);
  applyRoleImage(fallback, `Image de ${name}`);

  const resolved = await resolveRoleImage(name, hint);
  if (currentToken !== imageFetchToken) {
    return;
  }

  currentRoleImage = resolved;
  applyRoleImage(resolved, `Image de ${name}`);
}

function startCountdown(seconds = 3) {
  clearInterval(countdownTimer);
  closeActionMenu();
  closeResultOverlay();
  let remaining = seconds;
  countdownNumber.textContent = String(remaining);
  showScreen("countdown");

  countdownTimer = setInterval(() => {
    remaining -= 1;

    if (remaining > 0) {
      countdownNumber.textContent = String(remaining);
      return;
    }

    clearInterval(countdownTimer);
    revealName();
  }, 1000);
}

async function requestWakeLock() {
  if (!("wakeLock" in navigator)) {
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch {
    wakeLock = null;
  }
}

async function requestFullscreen() {
  if (!document.documentElement.requestFullscreen) {
    return;
  }

  if (document.fullscreenElement) {
    return;
  }

  try {
    await document.documentElement.requestFullscreen();
  } catch {
  }
}

function revealName() {
  const roleEntry = getRandomName();
  const parsedRole = parseRole(roleEntry);
  currentRole = parsedRole.name;
  currentRoleHint = toKeywordHint(parsedRole.hint);
  roleShownTimestamp = Date.now();
  roleName.textContent = currentRole;
  roleHint.textContent = currentRoleHint;
  updateRoleImage(currentRole, currentRoleHint);
  showScreen("reveal");
}

function getEventPoint(event) {
  if (event.changedTouches && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }

  if (typeof event.clientX === "number" && typeof event.clientY === "number") {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  return { x: 0, y: 0 };
}

function openActionMenu() {
  actionMenu.classList.add("open");
  actionMenu.setAttribute("aria-hidden", "false");
}

function closeActionMenu() {
  actionMenu.classList.remove("open");
  actionMenu.setAttribute("aria-hidden", "true");
}

function openResultOverlay() {
  resultOverlay.classList.add("open");
  resultOverlay.setAttribute("aria-hidden", "false");
}

function closeResultOverlay() {
  resultOverlay.classList.remove("open");
  resultOverlay.setAttribute("aria-hidden", "true");
}

function triggerGreenFlash() {
  greenFlash.classList.remove("active");
  void greenFlash.offsetWidth;
  greenFlash.classList.add("active");

  if (navigator.vibrate) {
    navigator.vibrate([90, 70, 90]);
  }
}

function formatElapsedTime(elapsedMs) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));

  if (totalSeconds < 60) {
    return `${totalSeconds} s`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (totalMinutes < 60) {
    return seconds === 0 ? `${totalMinutes} min` : `${totalMinutes} min ${seconds} s`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function showResultAfterDiscovery() {
  const elapsedMs = Math.max(0, Date.now() - roleShownTimestamp);
  const elapsedLabel = formatElapsedTime(elapsedMs);
  resultRole.textContent = currentRole;
  resultRoleHint.textContent = currentRoleHint;
  if (currentRoleImage) {
    applyRoleImage(currentRoleImage, `Image de ${currentRole}`);
  }
  resultTime.textContent = `Trouvé en ${elapsedLabel}`;

  setTimeout(() => {
    openResultOverlay();
  }, FLASH_DURATION_MS);
}

playButton.addEventListener("click", () => {
  syncModeFromSelection();
  requestFullscreen();
  requestWakeLock();
  startCountdown(3);
});

modeSelect?.addEventListener("change", () => {
  syncModeFromSelection();
});

function startLongPress(event) {
  if (!screens.reveal.classList.contains("active")) {
    return;
  }

  if (actionMenu.classList.contains("open")) {
    return;
  }

  if (event.type === "mousedown" && event.button !== 0) {
    return;
  }

  clearTimeout(pressTimer);
  pressStarted = true;
  pressTimer = setTimeout(() => {
    if (!pressStarted) {
      return;
    }
    openActionMenu();
  }, LONG_PRESS_MS);
}

function cancelLongPress() {
  pressStarted = false;
  clearTimeout(pressTimer);
}

document.addEventListener("touchstart", startLongPress, { passive: true });
document.addEventListener("touchend", cancelLongPress);
document.addEventListener("touchcancel", cancelLongPress);
document.addEventListener("touchmove", cancelLongPress);
document.addEventListener("mousedown", startLongPress);
document.addEventListener("mouseup", cancelLongPress);
document.addEventListener("mouseleave", cancelLongPress);
document.addEventListener("mousemove", cancelLongPress);
document.addEventListener("contextmenu", (event) => {
  if (screens.reveal.classList.contains("active")) {
    event.preventDefault();
  }
});

changePersonButton.addEventListener("click", () => {
  closeActionMenu();
  startCountdown(3);
});

foundButton.addEventListener("click", () => {
  closeActionMenu();
  triggerGreenFlash();
  showResultAfterDiscovery();
});

restartRoundButton?.addEventListener("click", () => {
  closeActionMenu();
  closeResultOverlay();
  startCountdown(3);
});

changeModeHomeButton?.addEventListener("click", () => {
  closeActionMenu();
  closeResultOverlay();
  showScreen("home");
});

foundQuickButton?.addEventListener("click", () => {
  closeActionMenu();
  triggerGreenFlash();
  showResultAfterDiscovery();
});

nextRoundButton.addEventListener("click", () => {
  startCountdown(3);
});

actionMenu.addEventListener("click", (event) => {
  if (event.target === actionMenu) {
    closeActionMenu();
  }
});

refillPool();
showScreen("home");

trackGameEvent("game_loaded", {
  mode: modeSelect?.value || "celebrities",
});

playButton?.addEventListener("click", () => {
  trackGameEvent("game_started", {
    mode: modeSelect?.value || "unknown",
  });
});

modeSelect?.addEventListener("change", () => {
  trackGameEvent("mode_changed", {
    mode: modeSelect.value,
  });
});

foundButton?.addEventListener("click", () => {
  trackGameEvent("role_found_menu", {
    mode: modeSelect?.value || "unknown",
  });
});

foundQuickButton?.addEventListener("click", () => {
  trackGameEvent("role_found_quick", {
    mode: modeSelect?.value || "unknown",
  });
});

nextRoundButton?.addEventListener("click", () => {
  trackGameEvent("next_round", {
    mode: modeSelect?.value || "unknown",
  });
});
