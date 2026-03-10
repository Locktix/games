const checklistData = [
  {
    title: "Petite enfance",
    ageRange: "0 - 2 ans",
    image: "./assets/ages/age-0-2.svg",
    items: [
      "Être né(e)",
      "Faire ses premiers pas",
      "Dire ses premiers mots",
      "Faire sa première nuit complète",
      "Avoir sa première dent",
      "Reconnaître le prénom d’un proche",
      "Tenir debout sans aide",
      "Découvrir son premier dessin",
      "Faire ses premiers fous rires",
      "Jouer avec un doudou préféré",
      "Goûter son premier gâteau d’anniversaire",
      "Avoir sa première photo de famille marquante"
    ]
  },
  {
    title: "Maternelle",
    ageRange: "3 - 5 ans",
    image: "./assets/ages/age-3-5.svg",
    items: [
      "Entrer à l’école maternelle",
      "Se faire un(e) meilleur(e) ami(e)",
      "Apprendre à compter jusqu’à 10",
      "Apprendre les couleurs principales",
      "Faire son premier dessin “chef-d’œuvre”",
      "Participer à un spectacle d’école",
      "Réciter une comptine par cœur",
      "Faire du vélo avec roulettes",
      "Aller à un anniversaire de copain/copine",
      "Dormir pour la première fois hors de la maison",
      "Commencer à s’habiller seul(e)",
      "Avoir son premier déguisement préféré"
    ]
  },
  {
    title: "Enfance",
    ageRange: "6 - 10 ans",
    image: "./assets/ages/age-6-10.svg",
    items: [
      "Apprendre à lire couramment",
      "Apprendre à faire du vélo sans roulettes",
      "Perdre sa première dent de lait",
      "Avoir son premier cartable “de grand”",
      "Savoir nager sans brassards",
      "Passer une première classe verte ou colonie",
      "Découvrir un sport en club",
      "Terminer son premier gros livre",
      "Avoir une matière préférée à l’école",
      "Gagner un petit concours (école/sport/jeu)",
      "Tenir sa première tirelire",
      "Inviter des amis à la maison"
    ]
  },
  {
    title: "Pré-ado",
    ageRange: "11 - 14 ans",
    image: "./assets/ages/age-11-14.svg",
    items: [
      "Entrer au collège",
      "Partir en voyage scolaire",
      "Avoir son premier téléphone",
      "Découvrir une vraie passion",
      "Créer son premier compte sur un réseau social",
      "Avoir sa première grosse dispute d’amitié",
      "Écrire son premier journal intime",
      "Participer à une compétition scolaire ou sportive",
      "Préparer un exposé marquant",
      "Avoir son premier coup de cœur",
      "Apprendre à cuisiner un plat simple",
      "Commencer à gérer un petit budget"
    ]
  },
  {
    title: "Adolescence",
    ageRange: "15 - 18 ans",
    image: "./assets/ages/age-15-18.svg",
    items: [
      "Passer le brevet",
      "Choisir une orientation (lycée/études)",
      "Faire son premier stage",
      "Décrocher son premier petit job",
      "Sortir en soirée avec des amis",
      "Vivre sa première vraie histoire d’amour",
      "Passer le code de la route",
      "Obtenir le bac (ou équivalent)",
      "Partir en vacances entre amis",
      "Faire un projet de fin d’année ambitieux",
      "Prendre une décision importante en autonomie",
      "Savoir se relever après un échec"
    ]
  },
  {
    title: "Jeune adulte",
    ageRange: "19 - 25 ans",
    image: "./assets/ages/age-19-25.svg",
    items: [
      "Entrer dans les études supérieures ou en alternance",
      "Quitter le foyer familial",
      "Vivre en coloc ou seul(e)",
      "Faire son premier vrai voyage solo",
      "Signer son premier contrat de travail",
      "Obtenir le permis de conduire",
      "Gérer seul(e) ses démarches administratives",
      "Apprendre à cuisiner pour la semaine",
      "Constituer un premier matelas d’épargne",
      "Faire un déménagement important",
      "Se créer un réseau professionnel",
      "Dire non à une situation qui ne te respecte pas"
    ]
  },
  {
    title: "Construction de vie",
    ageRange: "26 - 40 ans",
    image: "./assets/ages/age-26-40.svg",
    items: [
      "Stabiliser sa carrière ou se reconvertir",
      "Négocier une augmentation marquante",
      "Lancer un projet personnel ambitieux",
      "Atteindre un objectif d’épargne important",
      "Faire un grand voyage rêvé",
      "Construire une relation durable",
      "Avoir son premier logement acheté (optionnel)",
      "Trouver un bon équilibre vie pro / perso",
      "S’offrir un vrai break sans culpabiliser",
      "Accompagner un proche dans un moment difficile",
      "Développer une routine santé durable",
      "Se sentir aligné(e) avec ses choix"
    ]
  },
  {
    title: "Maturité & héritage",
    ageRange: "41 ans et +",
    image: "./assets/ages/age-41-plus.svg",
    items: [
      "Transmettre un savoir à plus jeune que soi",
      "Prendre soin activement de sa santé globale",
      "Refaire un tri de priorités de vie",
      "Accomplir un projet laissé de côté depuis longtemps",
      "Organiser un vrai temps de qualité en famille",
      "Aider une cause qui te tient à cœur",
      "Préparer une nouvelle étape de vie",
      "Apprendre une nouvelle compétence tardivement",
      "Faire la paix avec une ancienne blessure",
      "Célébrer le chemin parcouru",
      "Créer des souvenirs intergénérationnels",
      "Te sentir fier(e) de la personne que tu es devenue"
    ]
  }
];

const STORAGE_KEY = "checklist-de-la-vie.v2";

const root = document.getElementById("checklistRoot");
const searchInput = document.getElementById("searchInput");
const doneCount = document.getElementById("doneCount");
const totalCount = document.getElementById("totalCount");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const resetBtn = document.getElementById("resetBtn");

const allItems = checklistData.flatMap((group, groupIndex) =>
  group.items.map((text, itemIndex) => ({
    id: `${groupIndex}-${itemIndex}`,
    title: group.title,
    ageRange: group.ageRange,
    text
  }))
);

const checkedIds = new Set(loadState());

renderChecklist();
updateStats();

searchInput.addEventListener("input", () => {
  applyFilter(searchInput.value.trim().toLowerCase());
});

resetBtn.addEventListener("click", () => {
  checkedIds.clear();
  saveState();
  renderChecklist();
  updateStats();
  applyFilter(searchInput.value.trim().toLowerCase());
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedIds]));
}

function renderChecklist() {
  root.innerHTML = "";

  checklistData.forEach((group, groupIndex) => {
    const section = document.createElement("article");
    section.className = "stage-card";
    section.dataset.search = `${group.title} ${group.ageRange}`.toLowerCase();

    const cover = document.createElement("img");
    cover.className = "stage-cover";
    cover.src = group.image;
    cover.alt = `Illustration ${group.title} (${group.ageRange})`;
    section.appendChild(cover);

    const body = document.createElement("div");
    body.className = "stage-body";

    const head = document.createElement("div");
    head.className = "stage-head";

    const title = document.createElement("h2");
    title.className = "stage-title";
    title.textContent = group.title;

    const meta = document.createElement("p");
    meta.className = "stage-meta";
    meta.textContent = group.ageRange;

    head.append(title, meta);
    body.appendChild(head);

    const list = document.createElement("ul");
    list.className = "items";

    group.items.forEach((itemText, itemIndex) => {
      const id = `${groupIndex}-${itemIndex}`;
      const listItem = document.createElement("li");
      listItem.dataset.search = `${group.title} ${group.ageRange} ${itemText}`.toLowerCase();

      const label = document.createElement("label");
      label.className = "item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checkedIds.has(id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          checkedIds.add(id);
        } else {
          checkedIds.delete(id);
        }
        saveState();
        updateStats();
      });

      const text = document.createElement("span");
      text.textContent = itemText;

      label.append(checkbox, text);
      listItem.appendChild(label);
      list.appendChild(listItem);
    });

    body.appendChild(list);
    section.appendChild(body);
    root.appendChild(section);
  });
}

function applyFilter(query) {
  const categories = root.querySelectorAll(".stage-card");

  categories.forEach((category) => {
    const items = category.querySelectorAll("li");
    let hasVisibleItem = false;

    items.forEach((item) => {
      const isVisible = !query || item.dataset.search.includes(query);
      item.classList.toggle("hidden", !isVisible);
      if (isVisible) {
        hasVisibleItem = true;
      }
    });

    category.classList.toggle("hidden", !hasVisibleItem);
  });
}

function updateStats() {
  const total = allItems.length;
  const done = checkedIds.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  doneCount.textContent = String(done);
  totalCount.textContent = String(total);
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}
