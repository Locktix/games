const QUESTION_BANK = [
  { text: "J’ai déjà trahi la confiance d’un ami proche.", theme: "Amitié", type: "negative", points: 2 },
  { text: "J’ai déjà ghosté un ami sans explication.", theme: "Amitié", type: "negative", points: 1 },
  { text: "J’ai déjà monté deux amis l’un contre l’autre.", theme: "Amitié", type: "negative", points: 3 },
  { text: "J’ai déjà humilié un ami en public.", theme: "Amitié", type: "negative", points: 3 },
  { text: "J’ai déjà gardé un secret d’ami malgré la pression.", theme: "Amitié", type: "positive", points: 2 },
  { text: "J’ai déjà pris des nouvelles d’un ami en bad mood.", theme: "Amitié", type: "positive", points: 1 },
  { text: "J’ai déjà aidé un ami à se relever après une rupture.", theme: "Amitié", type: "positive", points: 2 },
  { text: "J’ai déjà menti à un ami pour éviter un conflit.", theme: "Amitié", type: "negative", points: 1 },
  { text: "J’ai déjà jalousé la réussite d’un ami.", theme: "Amitié", type: "negative", points: 1 },
  { text: "J’ai déjà fait semblant d’être content pour un ami.", theme: "Amitié", type: "negative", points: 1 },
  { text: "J’ai déjà soutenu financièrement un ami en galère.", theme: "Amitié", type: "positive", points: 2 },
  { text: "J’ai déjà annulé un plan important à la dernière minute.", theme: "Amitié", type: "negative", points: 1 },
  { text: "J’ai déjà défendu un ami qui se faisait rabaisser.", theme: "Amitié", type: "positive", points: 2 },
  { text: "J’ai déjà ignoré volontairement un ami plusieurs jours.", theme: "Amitié", type: "negative", points: 2 },
  { text: "J’ai déjà gardé contact avec quelqu’un juste par intérêt.", theme: "Amitié", type: "negative", points: 2 },
  { text: "J’ai déjà aidé un ami à retrouver confiance en lui/elle.", theme: "Amitié", type: "positive", points: 2 },
  { text: "J’ai déjà dit du mal d’un ami derrière son dos.", theme: "Amitié", type: "negative", points: 2 },
  { text: "J’ai déjà été là à 3h du matin pour un ami.", theme: "Amitié", type: "positive", points: 3 },
  { text: "J’ai déjà refusé d’aider un ami alors que je pouvais.", theme: "Amitié", type: "negative", points: 2 },
  { text: "J’ai déjà fait une surprise à un ami sans rien attendre.", theme: "Amitié", type: "positive", points: 1 },

  { text: "J’ai déjà détruit le moral de mon/ma partenaire par mes mots.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà menti sur mes sentiments en couple.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà trompé mon/ma partenaire.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà fouillé le téléphone de mon/ma partenaire.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà manipulé quelqu’un pour qu’il/elle reste.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà coupé le contact sans explication après un flirt.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà couché avec quelqu’un.", theme: "Couple", type: "negative", points: 1 },
  { text: "J’ai déjà couché avec une personne du même sexe.", theme: "Couple", type: "negative", points: 1 },
  { text: "J’ai déjà fait un plan à 3.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà eu une relation parallèle non assumée.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà assumé mes torts en couple et demandé pardon.", theme: "Couple", type: "positive", points: 2 },
  { text: "J’ai déjà posé une limite saine dans une relation.", theme: "Couple", type: "positive", points: 2 },
  { text: "J’ai déjà fait passer mon ego avant mon couple.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà été violent verbalement en couple.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà pris le temps d’écouter vraiment mon/ma partenaire.", theme: "Couple", type: "positive", points: 1 },
  { text: "J’ai déjà menti pour cacher une sortie.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà quitté quelqu’un par message.", theme: "Couple", type: "negative", points: 2 },
  { text: "J’ai déjà respecté une rupture sans harcèlement.", theme: "Couple", type: "positive", points: 2 },
  { text: "J’ai déjà jalousé au point de contrôler l’autre.", theme: "Couple", type: "negative", points: 3 },
  { text: "J’ai déjà été honnête dès le départ sur mes intentions.", theme: "Couple", type: "positive", points: 2 },

  { text: "J’ai déjà volé dans un magasin.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà blessé quelqu’un physiquement.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà pris de la drogue.", theme: "Morale", type: "negative", points: 2 },
  { text: "J’ai déjà bu de l’alcool.", theme: "Morale", type: "negative", points: 1 },
  { text: "J’ai déjà été bourré et violent.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà conduit en étant pas en état.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà menti à la police / autorité.", theme: "Morale", type: "negative", points: 2 },
  { text: "J’ai déjà profité de la faiblesse de quelqu’un.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà piraté un compte / utilisé un accès sans droit.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà triché dans un examen important.", theme: "Morale", type: "negative", points: 2 },
  { text: "J’ai déjà donné à une œuvre caritative.", theme: "Morale", type: "positive", points: 2 },
  { text: "J’ai déjà rendu un portefeuille / objet perdu.", theme: "Morale", type: "positive", points: 3 },
  { text: "J’ai déjà aidé une personne âgée à traverser.", theme: "Morale", type: "positive", points: 2 },
  { text: "J’ai déjà défendu quelqu’un victime d’injustice.", theme: "Morale", type: "positive", points: 3 },
  { text: "J’ai déjà assumé une faute alors que je pouvais me cacher.", theme: "Morale", type: "positive", points: 3 },
  { text: "J’ai déjà manipulé des faits pour avoir raison.", theme: "Morale", type: "negative", points: 2 },
  { text: "J’ai déjà fait du chantage émotionnel.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà humilié quelqu’un plus faible que moi.", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà aidé un inconnu en difficulté sans filmer.", theme: "Morale", type: "positive", points: 2 },
  { text: "J’ai déjà menti pour éviter les conséquences de mes actes.", theme: "Morale", type: "negative", points: 2 },

  { text: "J’ai déjà manqué de respect à un parent / proche.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà coupé les ponts sans explication familiale.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà crié violemment sur quelqu’un de ma famille.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà ignoré un appel important de ma famille.", theme: "Famille", type: "negative", points: 1 },
  { text: "J’ai déjà menti pour éviter une réunion familiale.", theme: "Famille", type: "negative", points: 1 },
  { text: "J’ai déjà fait culpabiliser un membre de ma famille.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà pris du temps pour écouter un proche en détresse.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà aidé régulièrement un proche malade / fragile.", theme: "Famille", type: "positive", points: 3 },
  { text: "J’ai déjà demandé pardon sincèrement à un membre de ma famille.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà organisé quelque chose pour réunir la famille.", theme: "Famille", type: "positive", points: 1 },
  { text: "J’ai déjà jugé sévèrement un proche sans connaître toute l’histoire.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà soutenu un frère / une sœur dans un moment dur.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà aidé mes parents dans une galère concrète.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà dit des mots que je regrette en famille.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà fait passer mon confort avant un proche.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà réconforté un ami / une amie en pleine crise.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà aidé quelqu’un à trouver un logement / emploi.", theme: "Famille", type: "positive", points: 3 },
  { text: "J’ai déjà fui une conversation familiale essentielle.", theme: "Famille", type: "negative", points: 2 },
  { text: "J’ai déjà pris des nouvelles d’un proche isolé.", theme: "Famille", type: "positive", points: 2 },
  { text: "J’ai déjà minimisé la souffrance d’un membre de ma famille.", theme: "Famille", type: "negative", points: 2 },

  { text: "J’ai déjà humilié quelqu’un en ligne.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà partagé une info sans vérifier.", theme: "Réseaux", type: "negative", points: 1 },
  { text: "J’ai déjà harcelé quelqu’un par messages.", theme: "Réseaux", type: "negative", points: 3 },
  { text: "J’ai déjà supprimé un message pour cacher la vérité.", theme: "Réseaux", type: "negative", points: 1 },
  { text: "J’ai déjà exposé quelqu’un en story sans son accord.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà utilisé un faux compte.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà signalé un contenu dangereux pour protéger les autres.", theme: "Réseaux", type: "positive", points: 2 },
  { text: "J’ai déjà retiré un post blessant après réflexion.", theme: "Réseaux", type: "positive", points: 1 },
  { text: "J’ai déjà demandé l’accord avant de poster la photo de quelqu’un.", theme: "Réseaux", type: "positive", points: 2 },
  { text: "J’ai déjà aidé à calmer un clash en ligne.", theme: "Réseaux", type: "positive", points: 2 },
  { text: "J’ai déjà créé un drama pour avoir de l’attention.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà liké une publication juste par hypocrisie.", theme: "Réseaux", type: "negative", points: 1 },
  { text: "J’ai déjà utilisé les réseaux pour rabaisser une personne.", theme: "Réseaux", type: "negative", points: 3 },
  { text: "J’ai déjà pris la défense d’une victime en ligne.", theme: "Réseaux", type: "positive", points: 3 },
  { text: "J’ai déjà menti sur ma vie pour paraître mieux.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà bloqué quelqu’un pour préserver ma santé mentale.", theme: "Réseaux", type: "positive", points: 1 },
  { text: "J’ai déjà moqué le physique de quelqu’un en commentaire.", theme: "Réseaux", type: "negative", points: 3 },
  { text: "J’ai déjà relayé une collecte utile / solidaire.", theme: "Réseaux", type: "positive", points: 2 },
  { text: "J’ai déjà trahi un DM privé.", theme: "Réseaux", type: "negative", points: 2 },
  { text: "J’ai déjà reconnu publiquement une erreur faite en ligne.", theme: "Réseaux", type: "positive", points: 3 },

  { text: "J’ai déjà saboté mes objectifs par pure flemme.", theme: "Perso", type: "negative", points: 1 },
  { text: "J’ai déjà menti à moi-même sur une habitude toxique.", theme: "Perso", type: "negative", points: 2 },
  { text: "J’ai déjà fait passer mon ego avant la vérité.", theme: "Perso", type: "negative", points: 2 },
  { text: "J’ai déjà refusé une remise en question utile.", theme: "Perso", type: "negative", points: 2 },
  { text: "J’ai déjà abandonné un proche quand il avait besoin.", theme: "Perso", type: "negative", points: 3 },
  { text: "J’ai déjà reporté une décision cruciale trop longtemps.", theme: "Perso", type: "negative", points: 1 },
  { text: "J’ai déjà tenu une promesse difficile.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà réparé une erreur que j’avais causée.", theme: "Perso", type: "positive", points: 3 },
  { text: "J’ai déjà fait un vrai travail sur moi.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà choisi l’honnêteté malgré le risque.", theme: "Perso", type: "positive", points: 3 },
  { text: "J’ai déjà demandé de l’aide avant d’exploser.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà coupé une habitude qui me détruisait.", theme: "Perso", type: "positive", points: 3 },
  { text: "J’ai déjà dit ‘j’ai tort’ sans me justifier.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà fui mes responsabilités personnelles.", theme: "Perso", type: "negative", points: 2 },
  { text: "J’ai déjà fait du mal à quelqu’un par jalousie.", theme: "Perso", type: "negative", points: 3 },
  { text: "J’ai déjà repris de zéro après un gros échec.", theme: "Perso", type: "positive", points: 3 },
  { text: "J’ai déjà assumé les conséquences d’une bêtise.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà menti pour paraître plus fort que je ne suis.", theme: "Perso", type: "negative", points: 1 },
  { text: "J’ai déjà aidé quelqu’un alors que personne ne le voyait.", theme: "Perso", type: "positive", points: 2 },
  { text: "J’ai déjà blessé quelqu’un puis fait la paix sincèrement.", theme: "Perso", type: "positive", points: 2 },

  // ────────────────────────────────────────────────
  // Amitié & Trahison (niveau sombre)
  // ────────────────────────────────────────────────
  { text: "J’ai déjà révélé un secret très grave qu’on m’avait confié sous le sceau de la confidence.", theme: "Amitié", type: "negative", points: 4 },
  { text: "J’ai déjà couché avec le/la partenaire d’un·e ami·e proche en sachant très bien ce que je faisais.", theme: "Amitié", type: "negative", points: 5 },
  { text: "J’ai déjà répandu une rumeur destructrice sur un·e ami·e juste pour me sentir mieux.", theme: "Amitié", type: "negative", points: 3 },
  { text: "J’ai déjà laissé tomber un·e ami·e en pleine descente suicidaire parce que « c’était trop lourd ».", theme: "Amitié", type: "negative", points: 5 },
  { text: "J’ai déjà utilisé un·e ami·e comme plan B affectif/sexuel pendant des mois sans le lui dire.", theme: "Amitié", type: "negative", points: 4 },
  { text: "J’ai déjà assisté en silence à la destruction publique d’un·e ami·e sans intervenir.", theme: "Amitié", type: "negative", points: 3 },
  { text: "J’ai déjà simulé une dépression ou une crise pour garder l’attention d’un·e ami·e.", theme: "Amitié", type: "negative", points: 3 },

  // ────────────────────────────────────────────────
  // Relation amoureuse & Sexualité sombre
  // ────────────────────────────────────────────────
  { text: "J’ai déjà eu une relation sexuelle non consentie (j’étais celui/celle qui a forcé la situation).", theme: "Couple", type: "negative", points: 6 },
  { text: "J’ai déjà continué un acte sexuel alors que l’autre personne disait non ou semblait hésiter.", theme: "Couple", type: "negative", points: 5 },
  { text: "J’ai déjà ghosté quelqu’un après avoir pris sa virginité.", theme: "Couple", type: "negative", points: 4 },
  { text: "J’ai déjà eu des relations sexuelles sous emprise (drogue, alcool très fort, chantage affectif).", theme: "Couple", type: "negative", points: 4 },
  { text: "J’ai déjà filmé ou pris des photos intimes sans le consentement explicite de l’autre.", theme: "Couple", type: "negative", points: 5 },
  { text: "J’ai déjà eu une relation parallèle (side piece) pendant plus de 6 mois en mentant quotidiennement.", theme: "Couple", type: "negative", points: 4 },
  { text: "J’ai déjà utilisé le sexe pour manipuler ou punir mon/ma partenaire.", theme: "Couple", type: "negative", points: 4 },
  { text: "J’ai déjà eu des fantasmes violents (viol, strangulation non négociée, etc.) que j’ai mis en acte.", theme: "Couple", type: "negative", points: 5 },

  // ────────────────────────────────────────────────
  // Morale & Limites éthiques sombres
  // ────────────────────────────────────────────────
  { text: "J’ai déjà fait du mal physiquement à quelqu’un sous le coup de la colère (coup, strangulation, etc.).", theme: "Morale", type: "negative", points: 5 },
  { text: "J’ai déjà payé pour des services sexuels (escort, prostitu·e·s).", theme: "Morale", type: "negative", points: 3 },
  { text: "J’ai déjà consommé de la pornographie impliquant des mineur·e·s (même sans le savoir au départ).", theme: "Morale", type: "negative", points: 6 },
  { text: "J’ai déjà menti sous serment ou dans une déposition officielle.", theme: "Morale", type: "negative", points: 4 },
  { text: "J’ai déjà profité sexuellement ou financièrement d’une personne vulnérable (addiction, deuil, handicap).", theme: "Morale", type: "negative", points: 5 },
  { text: "J’ai déjà fait chanter quelqu’un avec des photos/vidéos intimes.", theme: "Morale", type: "negative", points: 6 },
  { text: "J’ai déjà assisté à un viol ou une agression sans rien faire pour arrêter.", theme: "Morale", type: "negative", points: 6 },

  // ────────────────────────────────────────────────
  // Famille & Blessures profondes
  // ────────────────────────────────────────────────
  { text: "J’ai déjà volé de l’argent important à un parent / grand-parent malade.", theme: "Famille", type: "negative", points: 4 },
  { text: "J’ai déjà souhaité la mort d’un membre de ma famille (même passagèrement).", theme: "Famille", type: "negative", points: 3 },
  { text: "J’ai déjà eu une relation sexuelle ou romantique incestueuse (même consentie).", theme: "Famille", type: "negative", points: 6 },
  { text: "J’ai déjà abandonné un parent âgé ou malade qui avait besoin d’aide quotidienne.", theme: "Famille", type: "negative", points: 5 },
  { text: "J’ai déjà fait du mal psychologique intentionnel et répété à un frère / une sœur plus jeune.", theme: "Famille", type: "negative", points: 4 },

  // ────────────────────────────────────────────────
  // Réseaux & Vie publique toxique
  // ────────────────────────────────────────────────
  { text: "J’ai déjà diffusé une sextape revenge sans flouter le visage.", theme: "Réseaux", type: "negative", points: 6 },
  { text: "J’ai déjà doxxé quelqu’un par vengeance (adresse, numéro, lieu de travail).", theme: "Réseaux", type: "negative", points: 5 },
  { text: "J’ai déjà participé à un pile-on massif contre une personne vulnérable en ligne.", theme: "Réseaux", type: "negative", points: 4 },
  { text: "J’ai déjà créé un compte fake pour harceler ou draguer quelqu’un mineur.", theme: "Réseaux", type: "negative", points: 5 },

  // ────────────────────────────────────────────────
  // Rapport à soi & autodestruction
  // ────────────────────────────────────────────────
  { text: "J’ai déjà tenté de me suicider sérieusement (moyen létal réel).", theme: "Perso", type: "negative", points: 4 },
  { text: "J’ai déjà mutilé mon corps de façon répétée et intentionnelle.", theme: "Perso", type: "negative", points: 4 },
  { text: "J’ai déjà développé une addiction qui a détruit ma santé / mes relations.", theme: "Perso", type: "negative", points: 4 },
  { text: "J’ai déjà eu des relations sexuelles uniquement pour me punir ou me dégoûter.", theme: "Perso", type: "negative", points: 4 },

  // ────────────────────────────────────────────────
  // Quelques rares points positifs intenses (pour équilibrer un peu)
  // ────────────────────────────────────────────────
  { text: "J’ai déjà sauvé la vie de quelqu’un (urgence réelle, don d’organe, etc.).", theme: "Morale", type: "positive", points: 6 },
  { text: "J’ai déjà renoncé à une vengeance alors que j’avais tous les moyens de détruire l’autre.", theme: "Perso", type: "positive", points: 5 },
  { text: "J’ai déjà avoué publiquement une faute grave qui m’a coûté très cher socialement.", theme: "Perso", type: "positive", points: 5 },
  { text: "J’ai déjà accueilli chez moi quelqu’un en danger de mort (fuite violences conjugales, etc.).", theme: "Morale", type: "positive", points: 5 },
];

const MODE_LIMITS = {
  court: 30,
  normal: 60,
  long: 120,
};

const modeGrid = document.getElementById("mode-grid");
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
const quizPanel = document.getElementById("quiz-panel");
const progressText = document.getElementById("progress-text");
const questionText = document.getElementById("question-text");
const themeBadge = document.getElementById("theme-badge");
const progressFill = document.getElementById("progress-fill");
const startQuizButton = document.getElementById("start-quiz-btn");
const answerNoButton = document.getElementById("answer-no-btn");
const answerYesButton = document.getElementById("answer-yes-btn");
const restartButton = document.getElementById("restart-btn");
const resultPanel = document.getElementById("result-panel");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");
const resultBreakdown = document.getElementById("result-breakdown");
const meterFill = document.getElementById("meter-fill");
const copyResultButton = document.getElementById("copy-result-btn");
const playerNameInput = document.getElementById("player-name");

const state = {
  mode: "court",
  questions: [],
  currentQuestionIndex: 0,
  negativeLoss: 0,
  positiveGain: 0,
  yesCount: 0,
  started: false,
};

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildQuestionSet(mode) {
  const target = MODE_LIMITS[mode] || MODE_LIMITS.court;
  const themes = [...new Set(QUESTION_BANK.map((question) => question.theme))];
  const selected = [];

  themes.forEach((theme) => {
    const perTheme = shuffle(QUESTION_BANK.filter((question) => question.theme === theme));
    const quota = Math.max(4, Math.floor(target / themes.length));
    selected.push(...perTheme.slice(0, Math.min(quota, perTheme.length)));
  });

  if (selected.length < target) {
    const remaining = shuffle(
      QUESTION_BANK.filter(
        (question) =>
          !selected.some(
            (selectedQuestion) =>
              selectedQuestion.text === question.text && selectedQuestion.theme === question.theme
          )
      )
    );
    selected.push(...remaining.slice(0, target - selected.length));
  }

  return shuffle(selected).slice(0, Math.min(target, QUESTION_BANK.length));
}

function resetQuizState() {
  state.questions = [];
  state.currentQuestionIndex = 0;
  state.negativeLoss = 0;
  state.positiveGain = 0;
  state.yesCount = 0;
  state.started = false;
}

function currentQuestion() {
  return state.questions[state.currentQuestionIndex];
}

function updateQuestionView() {
  const question = currentQuestion();
  if (!question) return;

  const current = state.currentQuestionIndex + 1;
  const total = state.questions.length;
  progressText.textContent = `${current} / ${total}`;
  questionText.textContent = `${current}. ${question.text}`;
  themeBadge.textContent = question.theme;

  const percent = Math.round((current / total) * 100);
  progressFill.style.width = `${percent}%`;
}

function getResultMessage(score) {
  if (score >= 90) return "Très clean: tu gardes une ligne solide.";
  if (score >= 75) return "Plutôt clean: quelques zones grises, mais globalement bon.";
  if (score >= 55) return "Équilibré: vécu varié, décisions parfois risquées.";
  if (score >= 35) return "Niveau chaud: tu as un parcours très intense.";
  return "Mode chaos assumé: vécu extrême et sans filtre.";
}

function computeFinalScore() {
  const base = 100;
  const score = Math.max(0, Math.min(100, base - state.negativeLoss + state.positiveGain));
  return score;
}

function showResult() {
  const score = computeFinalScore();
  const firstName = playerNameInput.value.trim();

  resultTitle.textContent = firstName ? `Score de pureté · ${firstName}` : "Score de pureté";
  resultScore.textContent = `${score}/100`;
  resultMessage.textContent = `${getResultMessage(score)} (${state.yesCount}/${state.questions.length} réponses Oui)`;
  resultBreakdown.textContent = `Pénalités: -${state.negativeLoss} · Récup: +${state.positiveGain} · Mode: ${state.mode}`;
  meterFill.style.width = `${score}%`;

  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  startQuizButton.classList.add("hidden");
}

function answerCurrentQuestion(answerYes) {
  if (!state.started) return;

  const question = currentQuestion();
  if (!question) return;

  if (answerYes) {
    state.yesCount += 1;
    if (question.type === "negative") {
      state.negativeLoss += question.points;
    } else {
      state.positiveGain += question.points;
    }
  }

  const isLast = state.currentQuestionIndex >= state.questions.length - 1;
  if (isLast) {
    showResult();
    return;
  }

  state.currentQuestionIndex += 1;
  updateQuestionView();
}

function startQuiz() {
  resetQuizState();
  state.questions = buildQuestionSet(state.mode);
  state.started = true;

  resultPanel.classList.add("hidden");
  startQuizButton.classList.add("hidden");
  quizPanel.classList.remove("hidden");

  updateQuestionView();
}

function restartQuiz() {
  resultPanel.classList.add("hidden");
  quizPanel.classList.add("hidden");
  startQuizButton.classList.remove("hidden");
  resetQuizState();
  progressText.textContent = `1 / ${MODE_LIMITS[state.mode]}`;
  questionText.textContent = "";
  themeBadge.textContent = "Thème";
  progressFill.style.width = "0%";
}

modeGrid.addEventListener("click", (event) => {
  const target = event.target.closest(".mode-btn");
  if (!target) return;

  const mode = target.dataset.mode;
  if (!mode || !MODE_LIMITS[mode]) return;

  state.mode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button === target);
  });

  if (!state.started) {
    progressText.textContent = `1 / ${MODE_LIMITS[state.mode]}`;
  }
});

startQuizButton.addEventListener("click", startQuiz);
answerNoButton.addEventListener("click", () => answerCurrentQuestion(false));
answerYesButton.addEventListener("click", () => answerCurrentQuestion(true));
restartButton.addEventListener("click", restartQuiz);

window.addEventListener("keydown", (event) => {
  if (!state.started) return;
  if (quizPanel.classList.contains("hidden")) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    answerCurrentQuestion(false);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    answerCurrentQuestion(true);
  }
});

copyResultButton.addEventListener("click", async () => {
  const text = `${resultTitle.textContent}: ${resultScore.textContent} — ${resultMessage.textContent} (${resultBreakdown.textContent})`;

  try {
    await navigator.clipboard.writeText(text);
    copyResultButton.textContent = "Copié !";
    setTimeout(() => {
      copyResultButton.textContent = "Copier le résultat";
    }, 1000);
  } catch {
    copyResultButton.textContent = "Copie indisponible";
    setTimeout(() => {
      copyResultButton.textContent = "Copier le résultat";
    }, 1200);
  }
});

restartQuiz();
