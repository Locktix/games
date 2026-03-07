const BASE_DILEMMAS = [
  { category: "Psychologique", question: "Tu préfères vivre sans jamais recevoir de compliments ou sans jamais pouvoir en donner ?", a: "Ne jamais en recevoir", b: "Ne jamais en donner" },
  { category: "Psychologique", question: "Tu préfères connaître la date exacte de ta mort ou celle de tes proches ?", a: "La mienne", b: "Celle de mes proches" },
  { category: "Psychologique", question: "Tu préfères être aimé de tous mais incompris, ou compris par peu mais détesté par beaucoup ?", a: "Aimé mais incompris", b: "Compris mais détesté" },
  { category: "Psychologique", question: "Tu préfères revivre éternellement ta pire journée ou oublier ton plus beau souvenir ?", a: "Revivre la pire journée", b: "Oublier le plus beau souvenir" },
  { category: "Psychologique", question: "Tu préfères ne plus jamais mentir ou entendre toujours la vérité brute ?", a: "Ne plus mentir", b: "Toujours la vérité brute" },
  { category: "Psychologique", question: "Tu préfères réussir ta vie mais seul, ou échouer entouré des tiens ?", a: "Réussir seul", b: "Échouer entouré" },
  { category: "Psychologique", question: "Tu préfères perdre toutes tes photos ou tous tes messages ?", a: "Perdre les photos", b: "Perdre les messages" },
  { category: "Psychologique", question: "Tu préfères pardonner tout le monde ou n’oublier aucune trahison ?", a: "Pardonner tout le monde", b: "N’oublier aucune trahison" },
  { category: "Psychologique", question: "Tu préfères toujours savoir ce que les gens pensent de toi ou ne plus jamais te soucier de leur avis ?", a: "Tout savoir", b: "Ne plus m’en soucier" },
  { category: "Psychologique", question: "Tu préfères avoir raison tout le temps ou être heureux tout le temps ?", a: "Avoir raison", b: "Être heureux" },
  { category: "Psychologique", question: "Tu préfères parler parfaitement de tes émotions ou ne jamais ressentir la honte ?", a: "Parler de mes émotions", b: "Ne jamais ressentir la honte" },
  { category: "Psychologique", question: "Tu préfères qu’on te juge pour ton passé ou qu’on te craigne pour ton présent ?", a: "Juger mon passé", b: "Craindre mon présent" },

  { category: "Connerie", question: "Tu préfères avoir des chaussures qui couinent à chaque pas ou une voix d’hélium permanente ?", a: "Chaussures qui couinent", b: "Voix d’hélium" },
  { category: "Connerie", question: "Tu préfères éternuer des paillettes ou transpirer du ketchup ?", a: "Éternuer des paillettes", b: "Transpirer du ketchup" },
  { category: "Connerie", question: "Tu préfères avoir une coupe mulet à vie ou des sourcils arc-en-ciel ?", a: "Coupe mulet à vie", b: "Sourcils arc-en-ciel" },
  { category: "Connerie", question: "Tu préfères miauler en public quand tu stresses ou danser la macarena quand tu mens ?", a: "Miauler en stress", b: "Macarena quand je mens" },
  { category: "Connerie", question: "Tu préfères manger des céréales avec de l’eau ou des pâtes avec du coca ?", a: "Céréales à l’eau", b: "Pâtes au coca" },
  { category: "Connerie", question: "Tu préfères avoir un canard qui te suit partout ou un pigeon qui te reconnaît et t’attaque ?", a: "Canard qui suit", b: "Pigeon qui attaque" },
  { category: "Connerie", question: "Tu préfères ne pouvoir parler qu’en rap ou qu’en chuchotant ?", a: "Parler en rap", b: "Parler en chuchotant" },
  { category: "Connerie", question: "Tu préfères ne pouvoir utiliser que des gifs pour communiquer ou que des mèmes de 2012 ?", a: "Que des gifs", b: "Mèmes de 2012" },
  { category: "Connerie", question: "Tu préfères avoir une alarme qui crie ton prénom toutes les heures ou une sonnerie de téléphone de 2003 obligatoire ?", a: "Alarme prénom", b: "Sonnerie 2003" },
  { category: "Connerie", question: "Tu préfères glisser sur une peau de banane devant ton crush ou envoyer un vocal gênant à ton boss ?", a: "Tomber devant crush", b: "Vocal gênant au boss" },
  { category: "Connerie", question: "Tu préfères ne manger que bleu ou ne boire que vert ?", a: "Manger bleu", b: "Boire vert" },
  { category: "Connerie", question: "Tu préfères avoir des chaussettes mouillées en permanence ou un moustique qui te suit à vie ?", a: "Chaussettes mouillées", b: "Moustique à vie" },

  { category: "Social", question: "Tu préfères être ultra populaire mais pas digne de confiance, ou discret mais respecté ?", a: "Populaire mais pas fiable", b: "Discret mais respecté" },
  { category: "Social", question: "Tu préfères perdre ton téléphone 1 an ou ton accès aux réseaux 3 ans ?", a: "Perdre mon téléphone 1 an", b: "Perdre les réseaux 3 ans" },
  { category: "Social", question: "Tu préfères être en retard à ton mariage ou en avance de 3h à tous tes rendez-vous ?", a: "Retard à mon mariage", b: "3h d’avance partout" },
  { category: "Social", question: "Tu préfères n’avoir plus qu’un seul ami très loyal ou 30 potes peu fiables ?", a: "1 ami loyal", b: "30 potes peu fiables" },
  { category: "Social", question: "Tu préfères qu’on lise toutes tes conversations ou qu’on publie toutes tes recherches internet ?", a: "Lire mes conversations", b: "Publier mes recherches" },
  { category: "Social", question: "Tu préfères devoir dire exactement ce que tu penses pendant 24h ou entendre ce que tout le monde pense de toi pendant 24h ?", a: "Dire exactement ce que je pense", b: "Entendre ce qu’ils pensent" },
  { category: "Social", question: "Tu préfères ne plus pouvoir utiliser d’emojis ou ne plus pouvoir faire de messages vocaux ?", a: "Plus d’emojis", b: "Plus de vocaux" },
  { category: "Social", question: "Tu préfères travailler avec un génie insupportable ou un gentil incompétent ?", a: "Génie insupportable", b: "Gentil incompétent" },
  { category: "Social", question: "Tu préfères gagner une dispute injustement ou perdre une dispute en ayant raison ?", a: "Gagner injustement", b: "Perdre en ayant raison" },
  { category: "Social", question: "Tu préfères ne jamais pouvoir refuser un service ou ne jamais pouvoir demander de l’aide ?", a: "Ne jamais refuser", b: "Ne jamais demander" },
  { category: "Social", question: "Tu préfères être célèbre dans ta ville ou inconnu partout ?", a: "Célèbre dans ma ville", b: "Inconnu partout" },
  { category: "Social", question: "Tu préfères qu’on oublie ton anniversaire ou qu’on fasse une fête surprise que tu détestes ?", a: "On oublie mon anniversaire", b: "Fête surprise détestée" },

  { category: "WTF", question: "Tu préfères te réveiller chaque jour dans un lieu aléatoire ou avec un accent aléatoire ?", a: "Lieu aléatoire", b: "Accent aléatoire" },
  { category: "WTF", question: "Tu préfères remonter le temps de 10 min une fois par jour ou avancer de 2h sans contrôle une fois par jour ?", a: "Reculer 10 min", b: "Avancer 2h" },
  { category: "WTF", question: "Tu préfères avoir un clone qui te critique ou ton reflet qui te conseille ?", a: "Clone critique", b: "Reflet conseiller" },
  { category: "WTF", question: "Tu préfères pouvoir parler aux objets ou comprendre les pensées des plantes ?", a: "Parler aux objets", b: "Pensées des plantes" },
  { category: "WTF", question: "Tu préfères vivre dans un jeu vidéo sans sauvegarde ou dans un film sans pause ?", a: "Jeu vidéo sans sauvegarde", b: "Film sans pause" },
  { category: "WTF", question: "Tu préfères ne plus dormir mais être fatigué, ou dormir 14h mais être en retard partout ?", a: "Ne plus dormir", b: "Dormir 14h" },
  { category: "WTF", question: "Tu préfères que ton futur toi te juge ou que ton passé toi te voie maintenant ?", a: "Jugé par mon futur moi", b: "Vu par mon passé moi" },
  { category: "WTF", question: "Tu préfères vivre une vie parfaite mais prévisible ou chaotique mais intense ?", a: "Parfaite mais prévisible", b: "Chaotique mais intense" },
  { category: "WTF", question: "Tu préfères avoir 1 milliard mais sans internet, ou internet illimité mais 0 euro ?", a: "1 milliard sans internet", b: "Internet illimité sans argent" },
  { category: "WTF", question: "Tu préfères pouvoir lire une seule pensée par jour ou effacer un seul souvenir gênant par an ?", a: "Lire une pensée par jour", b: "Effacer un souvenir par an" },
  { category: "WTF", question: "Tu préfères être immortel sans tes proches ou mortal avec eux ?", a: "Immortel sans eux", b: "Mortel avec eux" },
  { category: "WTF", question: "Tu préfères revivre tes 15 ans avec ton cerveau actuel ou repartir de zéro demain ?", a: "Revivre mes 15 ans", b: "Repartir de zéro" },
];

const DILEMMAS = BASE_DILEMMAS.map((dilemma, index) => ({
  ...dilemma,
  id: `dilemma_${index + 1}`,
}));

const categoryBadge = document.getElementById("category-badge");
const progressText = document.getElementById("progress-text");
const dilemmaText = document.getElementById("dilemma-text");
const choiceAButton = document.getElementById("choice-a-btn");
const choiceBButton = document.getElementById("choice-b-btn");
const nextButton = document.getElementById("next-btn");
const resultText = document.getElementById("result-text");
const statsGridNode = document.querySelector(".stats-grid");
const globalTotalCountNode = document.getElementById("global-total-count");
const globalAStatsNode = document.getElementById("global-a-stats");
const globalBStatsNode = document.getElementById("global-b-stats");
const firebaseDb = window.GamesFirebase?.getDb?.() || null;
const firestoreFieldValue = window.firebase?.firestore?.FieldValue;

const trackGameEvent = (eventType, payload = {}) => {
  window.GamesFirebase?.trackEvent?.("TuPrefere", eventType, payload);
};

const state = {
  order: [],
  index: 0,
  answered: 0,
  hasAnsweredCurrent: false,
};

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function currentDilemma() {
  return state.order[state.index];
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${Math.round(value)}%`;
}

function lockGlobalStatsUI() {
  statsGridNode?.classList.remove("is-revealing");
  globalTotalCountNode.textContent = "—";
  globalAStatsNode.textContent = "Vote pour révéler";
  globalBStatsNode.textContent = "Vote pour révéler";
}

function triggerStatsReveal() {
  if (!statsGridNode) {
    return;
  }

  statsGridNode.classList.remove("is-revealing");
  void statsGridNode.offsetWidth;
  statsGridNode.classList.add("is-revealing");
}

function updateGlobalStatsUI(aCount = 0, bCount = 0) {
  const total = aCount + bCount;
  const aPercent = total > 0 ? (aCount / total) * 100 : 0;
  const bPercent = total > 0 ? (bCount / total) * 100 : 0;

  globalTotalCountNode.textContent = String(total);
  globalAStatsNode.textContent = `${formatPercent(aPercent)} (${aCount})`;
  globalBStatsNode.textContent = `${formatPercent(bPercent)} (${bCount})`;
  triggerStatsReveal();
}

function dilemmaStatsRef(dilemma) {
  if (!firebaseDb || !dilemma?.id) {
    return null;
  }
  return firebaseDb.collection("tuPrefereDilemmaStats").doc(dilemma.id);
}

async function loadGlobalStatsForCurrentDilemma() {
  const dilemma = currentDilemma();
  const ref = dilemmaStatsRef(dilemma);
  if (!ref) {
    updateGlobalStatsUI(0, 0);
    return;
  }

  try {
    const snapshot = await ref.get();
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const aCount = Number(data.aCount) || 0;
    const bCount = Number(data.bCount) || 0;
    updateGlobalStatsUI(aCount, bCount);
  } catch (error) {
    console.warn("[TuPrefere] Impossible de charger les stats globales:", error?.message || error);
    updateGlobalStatsUI(0, 0);
  }
}

async function submitGlobalVote(dilemma, choice) {
  const ref = dilemmaStatsRef(dilemma);
  if (!ref || !choice) {
    return;
  }

  try {
    const increment = firestoreFieldValue?.increment;
    const timestamp = firestoreFieldValue?.serverTimestamp;

    if (increment && timestamp) {
      await ref.set(
        {
          category: dilemma.category,
          question: dilemma.question,
          aLabel: dilemma.a,
          bLabel: dilemma.b,
          aCount: choice === "a" ? increment(1) : increment(0),
          bCount: choice === "b" ? increment(1) : increment(0),
          total: increment(1),
          updatedAt: timestamp(),
        },
        { merge: true }
      );
    } else {
      await firebaseDb.runTransaction(async (transaction) => {
        const snap = await transaction.get(ref);
        const data = snap.exists ? snap.data() || {} : {};
        const currentA = Number(data.aCount) || 0;
        const currentB = Number(data.bCount) || 0;
        const nextA = choice === "a" ? currentA + 1 : currentA;
        const nextB = choice === "b" ? currentB + 1 : currentB;

        transaction.set(
          ref,
          {
            category: dilemma.category,
            question: dilemma.question,
            aLabel: dilemma.a,
            bLabel: dilemma.b,
            aCount: nextA,
            bCount: nextB,
            total: nextA + nextB,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      });
    }
  } catch (error) {
    console.warn("[TuPrefere] Impossible d'enregistrer le vote global:", error?.message || error);
  }
}

function updateView() {
  const dilemma = currentDilemma();
  if (!dilemma) return;

  categoryBadge.textContent = dilemma.category;
  progressText.textContent = `Dilemme ${state.index + 1} / ${state.order.length}`;
  dilemmaText.textContent = dilemma.question;
  choiceAButton.textContent = dilemma.a;
  choiceBButton.textContent = dilemma.b;

  choiceAButton.classList.remove("is-selected");
  choiceBButton.classList.remove("is-selected");
  choiceAButton.disabled = false;
  choiceBButton.disabled = false;

  state.hasAnsweredCurrent = false;
  resultText.textContent = "Choisis une option 👀";
  lockGlobalStatsUI();
}

function answer(choice) {
  if (state.hasAnsweredCurrent) return;

  const dilemma = currentDilemma();
  state.hasAnsweredCurrent = true;
  state.answered += 1;

  if (choice === "a") {
    choiceAButton.classList.add("is-selected");
    resultText.textContent = "Tu as choisi A.";
  } else {
    choiceBButton.classList.add("is-selected");
    resultText.textContent = "Tu as choisi B.";
  }

  choiceAButton.disabled = true;
  choiceBButton.disabled = true;
  submitGlobalVote(dilemma, choice).finally(() => {
    loadGlobalStatsForCurrentDilemma();
  });

  trackGameEvent("dilemma_answered", {
    choice,
    category: dilemma?.category || "unknown",
    dilemmaId: dilemma?.id || "unknown",
    answered: state.answered,
  });
}

function nextDilemma() {
  state.index += 1;

  if (state.index >= state.order.length) {
    state.order = shuffle(DILEMMAS);
    state.index = 0;
    trackGameEvent("deck_reshuffled", {
      total: state.order.length,
    });
  }

  updateView();
}

choiceAButton.addEventListener("click", () => answer("a"));
choiceBButton.addEventListener("click", () => answer("b"));
nextButton.addEventListener("click", nextDilemma);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    answer("a");
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    answer("b");
    return;
  }

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    nextDilemma();
  }
});

function init() {
  state.order = shuffle(DILEMMAS);
  state.index = 0;
  state.answered = 0;
  lockGlobalStatsUI();
  updateView();

  trackGameEvent("game_loaded", {
    totalDilemmas: state.order.length,
  });
}

init();
