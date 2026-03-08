const NORMAL_DILEMMAS = [
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

const BYILHAN_NICO_DILEMMAS = [
{category: "ByIlhan&Nico", question: "Tu préfères Byilhan et Nico, ou Nico et Byilhan ?", a: "Byilhan et Nico", b: "Nico et Byilhan"},
{category: "ByIlhan&Nico", question: "Tu préfères Nico et Byilhan, ou Byilhan et Nico ?", a: "Nico et Byilhan", b: "Byilhan et Nico"},
{category: "ByIlhan&Nico", question: "Tu préfères dire Byilhan et Nico, ou dire Nico et Byilhan ?", a: "Dire Byilhan et Nico", b: "Dire Nico et Byilhan"},
{category: "ByIlhan&Nico", question: "Tu préfères faire ce tu préfères, ou faire ce tu préfères ?", a: "Faire ce tu préfères", b: "Faire ce tu préfères"},
{category: "ByIlhan&Nico", question: "Tu préfères faire Paris-Montpellier, ou Montpellier-Paris ?", a: "Paris-Montpellier", b: "Montpellier-Paris"},
{category: "ByIlhan&Nico", question: "Tu préfères prendre l'autoroute pour aller à Paris, ou prendre l'autoroute pour aller à Paris ?", a: "Prendre l'autoroute pour aller à Paris", b: "Prendre l'autoroute pour aller à Paris"},
{category: "ByIlhan&Nico", question: "Tu préfères marcher 800 km, ou marcher 800 km mais en chantant du Jul ?", a: "Marcher 800 km", b: "Marcher 800 km mais en chantant du Jul"},
{category: "ByIlhan&Nico", question: "Tu préfères aller au Japon pour 999 €, ou aller au Japon à Villepinte pour 999 € ?", a: "Aller au Japon pour 999 €", b: "Aller au Japon à Villepinte pour 999 €"},
{category: "ByIlhan&Nico", question: "Tu préfères mourir noyé dans l'eau de mer, ou mourir noyé dans l'eau de mer mais un poisson passe à côté de toi ?", a: "Mourir noyé dans l'eau de mer", b: "Mourir noyé dans l'eau de mer mais un poisson passe à côté"},
{category: "ByIlhan&Nico", question: "Tu préfères mourir noyé dans l'eau de mer, ou mourir noyé dans l'eau de mer avec un requin qui te regarde ?", a: "Mourir noyé dans l'eau de mer", b: "Mourir noyé dans l'eau de mer avec un requin qui te regarde"},
{category: "ByIlhan&Nico", question: "Tu préfères mourir noyé dans l'eau de mer, ou mourir noyé dans l'eau de mer mais t'as un masque ?", a: "Mourir noyé dans l'eau de mer", b: "Mourir noyé dans l'eau de mer mais t'as un masque"},
{category: "ByIlhan&Nico", question: "Tu préfères embrasser un cheval, ou que le cheval te baise ?", a: "Embrasser un cheval", b: "Que le cheval te baise"},
{category: "ByIlhan&Nico", question: "Tu préfères que ta meuf soit perverse, ou que ta meuf soit romantique ?", a: "Que ta meuf soit perverse", b: "Que ta meuf soit romantique"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir tous tes nudes leak, ou avoir tous tes nudes leak ?", a: "Avoir tous tes nudes leak", b: "Avoir tous tes nudes leak"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir tous tes nudes leak, ou avoir tous tes nudes leak mais personne les voit ?", a: "Avoir tous tes nudes leak", b: "Avoir tous tes nudes leak mais personne les voit"},
{category: "ByIlhan&Nico", question: "Tu préfères manger 1 cuisse de poulet, ou 2 cuisses de poulet ?", a: "1 cuisse de poulet", b: "2 cuisses de poulet"},
{category: "ByIlhan&Nico", question: "Tu préfères manger des pâtes, ou manger des spaghettis ?", a: "Des pâtes", b: "Des spaghettis"},
{category: "ByIlhan&Nico", question: "Tu préfères manger des boulettes de viande, ou que les boulettes de viande te mangent ?", a: "Manger des boulettes de viande", b: "Que les boulettes de viande te mangent"},
{category: "ByIlhan&Nico", question: "Tu préfères manger une pizza ananas, ou manger une pizza avec des ananas dessus ?", a: "Une pizza ananas", b: "Une pizza avec des ananas dessus"},
{category: "ByIlhan&Nico", question: "Tu préfères boire de l'eau gazeuse, ou boire de l'eau pétillante ?", a: "De l'eau gazeuse", b: "De l'eau pétillante"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir des problèmes de vue, ou avoir des lunettes 3 fois plus longues que la muraille de Chine ?", a: "Avoir des problèmes de vue", b: "Avoir des lunettes 3 fois plus longues que la muraille de Chine"},
{category: "ByIlhan&Nico", question: "Tu préfères regarder YouTube, ou regarder une vidéo YouTube ?", a: "Regarder YouTube", b: "Regarder une vidéo YouTube"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir une caméra, ou avoir une caméra mais elle filme ?", a: "Avoir une caméra", b: "Avoir une caméra mais elle filme"},
{category: "ByIlhan&Nico", question: "Tu préfères être riche mais nul en tu préfères, ou être pauvre mais le goat des tu préfères nuls ?", a: "Être riche mais nul en tu préfères", b: "Être pauvre mais le goat des tu préfères nuls"},
{category: "ByIlhan&Nico", question: "Tu préfères ça, ou ça ?", a: "Ça", b: "Ça"},
{category: "ByIlhan&Nico", question: "Tu préfères provoquer une calvitie fulgurante à ton meilleur ami, ou provoquer une calvitie fulgurante à ton meilleur ami juste parce qu'il se moque de ta calvitie ?", a: "Provoquer une calvitie fulgurante à ton meilleur ami", b: "Provoquer une calvitie fulgurante à ton meilleur ami parce qu'il se moque de ta calvitie"},
{category: "ByIlhan&Nico", question: "Tu préfères aller dans un avion, ou aller dans la viande ?", a: "Aller dans un avion", b: "Aller dans la viande"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir un restaurant à toi, ou avoir un restaurant à toi mais dans un autre pays ?", a: "Avoir un restaurant à toi", b: "Avoir un restaurant à toi mais dans un autre pays"},
{category: "ByIlhan&Nico", question: "Tu préfères Marseille ou Paris sachant que les trottinettes existent plus ?", a: "Marseille", b: "Paris"},
{category: "ByIlhan&Nico", question: "Tu préfères Kaiser d'Inoxtag, ou l'émission Inoxtag TV ?", a: "Kaiser d'Inoxtag", b: "L'émission Inoxtag TV"},
{category: "ByIlhan&Nico", question: "Tu préfères un cheval qui te baise, ou un cheval que tu baises ?", a: "Un cheval qui te baise", b: "Un cheval que tu baises"},
{category: "ByIlhan&Nico", question: "Tu préfères mourir de faim, ou mourir de soif mais y a de l'eau à côté ?", a: "Mourir de faim", b: "Mourir de soif mais y a de l'eau à côté"},
{category: "ByIlhan&Nico", question: "Tu préfères être chauve, ou être chauve mais avec des cheveux ?", a: "Être chauve", b: "Être chauve mais avec des cheveux"},
{category: "ByIlhan&Nico", question: "Tu préfères prendre le train, ou prendre le train mais assis ?", a: "Prendre le train", b: "Prendre le train mais assis"},
{category: "ByIlhan&Nico", question: "Tu préfères regarder Netflix, ou regarder une série Netflix ?", a: "Regarder Netflix", b: "Regarder une série Netflix"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir froid, ou avoir froid mais avec un pull ?", a: "Avoir froid", b: "Avoir froid mais avec un pull"},
{category: "ByIlhan&Nico", question: "Tu préfères être fatigué, ou être fatigué mais avoir dormi ?", a: "Être fatigué", b: "Être fatigué mais avoir dormi"},
{category: "ByIlhan&Nico", question: "Tu préfères manger du riz, ou manger du riz cuit ?", a: "Manger du riz", b: "Manger du riz cuit"},
{category: "ByIlhan&Nico", question: "Tu préfères Nico, ou Byilhan ?", a: "Nico", b: "Byilhan"},
{category: "ByIlhan&Nico", question: "Tu préfères finir ce message, ou finir ce message mais avec un point ?", a: "Finir ce message", b: "Finir ce message mais avec un point"},
{category: "ByIlhan&Nico", question: "Tu préfères dormir dans le noir, ou dormir avec la lumière éteinte ?", a: "Dormir dans le noir", b: "Dormir avec la lumière éteinte"},
{category: "ByIlhan&Nico", question: "Tu préfères être dans une chambre propre, ou être dans une chambre bleue mais tu la vois toute blanche ?", a: "Être dans une chambre propre", b: "Être dans une chambre bleue mais tu la vois toute blanche"},
{category: "ByIlhan&Nico", question: "Tu préfères monter sur une table, ou monter sur une table mais elle a un seul pied central ?", a: "Monter sur une table", b: "Monter sur une table mais elle a un seul pied central"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir une voiture qui marche, ou avoir une voiture qui marche mais elle roule ?", a: "Avoir une voiture qui marche", b: "Avoir une voiture qui marche mais elle roule"},
{category: "ByIlhan&Nico", question: "Tu préfères être immunisé contre toutes les maladies du monde, ou ne plus jamais être fatigué ?", a: "Être immunisé contre toutes les maladies du monde", b: "Ne plus jamais être fatigué"},
{category: "ByIlhan&Nico", question: "Tu préfères ne plus jamais avoir de relations sexuelles, ou ne plus jamais apprendre quelque chose de nouveau ?", a: "Ne plus jamais avoir de relations sexuelles", b: "Ne plus jamais apprendre quelque chose de nouveau"},
{category: "ByIlhan&Nico", question: "Tu préfères dormir avec la lumière allumée, ou dormir avec la lumière allumée mais éteinte ?", a: "Dormir avec la lumière allumée", b: "Dormir avec la lumière allumée mais éteinte"},
{category: "ByIlhan&Nico", question: "Tu préfères manger des frites, ou manger des frites mais chaudes ?", a: "Manger des frites", b: "Manger des frites mais chaudes"},
{category: "ByIlhan&Nico", question: "Tu préfères avoir un lit, ou avoir un lit mais pour dormir ?", a: "Avoir un lit", b: "Avoir un lit mais pour dormir"},
{category: "ByIlhan&Nico", question: "Tu préfères aller à la plage, ou aller à la plage mais y a de l'eau ?", a: "Aller à la plage", b: "Aller à la plage mais y a de l'eau"},
{category: "ByIlhan&Nico", question: "Tu préfères respirer, ou respirer mais avec de l'air ?", a: "Respirer", b: "Respirer mais avec de l'air"},
{category: "ByIlhan&Nico", question: "Tu préfères marcher, ou marcher mais en avançant ?", a: "Marcher", b: "Marcher mais en avançant"},
{category: "ByIlhan&Nico", question: "Tu préfères parler, ou parler mais en disant des mots ?", a: "Parler", b: "Parler mais en disant des mots"},
{category: "ByIlhan&Nico", question: "Tu préfères voir, ou voir mais avec les yeux ?", a: "Voir", b: "Voir mais avec les yeux"},
{category: "ByIlhan&Nico", question: "Tu préfères entendre, ou entendre mais avec les oreilles ?", a: "Entendre", b: "Entendre mais avec les oreilles"},
{category: "ByIlhan&Nico", question: "Tu préfères Nico et Byilhan ensemble, ou Byilhan et Nico ensemble ?", a: "Nico et Byilhan ensemble", b: "Byilhan et Nico ensemble"},
{category: "ByIlhan&Nico", question: "Tu préfères faire une question tu préfères, ou répondre à une question tu préfères ?", a: "Faire une question tu préfères", b: "Répondre à une question tu préfères"},
{category: "ByIlhan&Nico", question: "Tu préfères être Byilhan, ou être Nico ?", a: "Être Byilhan", b: "Être Nico"},
{category: "ByIlhan&Nico", question: "Tu préfères être Nico, ou être Byilhan ?", a: "Être Nico", b: "Être Byilhan"},
{category: "ByIlhan&Nico", question: "Tu préfères qu'on arrête les tu préfères, ou qu'on continue les tu préfères ?", a: "Qu'on arrête les tu préfères", b: "Qu'on continue les tu préfères"},
{category: "ByIlhan&Nico", question: "Tu préfères un tu préfères nul, ou un tu préfères très nul ?", a: "Un tu préfères nul", b: "Un tu préfères très nul"},
{category: "ByIlhan&Nico", question: "Tu préfères perdre à ce jeu, ou gagner mais c'est nul ?", a: "Perdre à ce jeu", b: "Gagner mais c'est nul"},
{category: "ByIlhan&Nico", question: "Tu préfères boire du Coca, ou boire du Coca mais gazeux ?", a: "Boire du Coca", b: "Boire du Coca mais gazeux"},
{category: "ByIlhan&Nico", question: "Tu préfères manger une pomme, ou manger une pomme mais rouge ?", a: "Manger une pomme", b: "Manger une pomme mais rouge"},
{category: "ByIlhan&Nico", question: "Tu préfères dormir 8h, ou dormir 8h mais la nuit ?", a: "Dormir 8h", b: "Dormir 8h mais la nuit"},
{category: "ByIlhan&Nico", question: "Tu préfères être content, ou être content mais heureux ?", a: "Être content", b: "Être content mais heureux"},
{category: "ByIlhan&Nico", question: "Tu préfères rire, ou rire mais fort ?", a: "Rire", b: "Rire mais fort"},
{category: "ByIlhan&Nico", question: "Tu préfères pleurer, ou pleurer mais avec des larmes ?", a: "Pleurer", b: "Pleurer mais avec des larmes"},
{category: "ByIlhan&Nico", question: "Tu préfères courir, ou courir mais vite ?", a: "Courir", b: "Courir mais vite"},
{category: "ByIlhan&Nico", question: "Tu préfères sauter, ou sauter mais en l'air ?", a: "Sauter", b: "Sauter mais en l'air"},
{category: "ByIlhan&Nico", question: "Tu préfères manger du pain, ou manger du pain mais avec de la mie ?", a: "Manger du pain", b: "Manger du pain mais avec de la mie"},
{category: "ByIlhan&Nico", question: "Tu préfères boire du lait, ou boire du lait mais blanc ?", a: "Boire du lait", b: "Boire du lait mais blanc"},
{category: "ByIlhan&Nico", question: "Tu préfères regarder la télé, ou regarder la télé mais allumée ?", a: "Regarder la télé", b: "Regarder la télé mais allumée"},
{category: "ByIlhan&Nico", question: "Tu préfères écouter de la musique, ou écouter de la musique mais avec du son ?", a: "Écouter de la musique", b: "Écouter de la musique mais avec du son"},
{category: "ByIlhan&Nico", question: "Tu préfères écrire, ou écrire mais avec un stylo ?", a: "Écrire", b: "Écrire mais avec un stylo"},
{category: "ByIlhan&Nico", question: "Tu préfères lire, ou lire mais des mots ?", a: "Lire", b: "Lire mais des mots"},
{category: "ByIlhan&Nico", question: "Tu préfères penser, ou penser mais dans ta tête ?", a: "Penser", b: "Penser mais dans ta tête"},
{category: "ByIlhan&Nico", question: "Tu préfères rêver, ou rêver mais la nuit ?", a: "Rêver", b: "Rêver mais la nuit"},
{category: "ByIlhan&Nico", question: "Tu préfères vivre, ou vivre mais longtemps ?", a: "Vivre", b: "Vivre mais longtemps"},
{category: "ByIlhan&Nico", question: "Tu préfères mourir vieux, ou mourir vieux mais après avoir vécu ?", a: "Mourir vieux", b: "Mourir vieux mais après avoir vécu"},
{category: "ByIlhan&Nico", question: "Tu préfères être immortel, ou être immortel mais sans fin ?", a: "Être immortel", b: "Être immortel mais sans fin"},
];

function withIds(dilemmas, prefix) {
  return dilemmas.map((dilemma, index) => ({
    ...dilemma,
    id: `${prefix}_${index + 1}`,
  }));
}

function fallbackDilemmas(prefix, categoryLabel) {
  return withIds(
    [
      {
        category: categoryLabel,
        question: "Ajoute tes dilemmes dans script.js pour cette version.",
        a: "D'accord",
        b: "Je le fais plus tard",
      },
    ],
    prefix
  );
}

const MODE_DEFINITIONS = {
  normal: {
    label: "Version normale",
    menuLabel: "Version normale (actuelle)",
    imageSrc: "https://images.squarespace-cdn.com/content/v1/52947066e4b006d9061262ab/10b83e15-5290-40aa-a902-00598a0c9b97/Figure-Jeremy-Hall-Normal-Logo-Branding-Image-De-Marque-1.jpg?format=2500w",
    imageLabel: "Image à venir",
    prefix: "normal",
    getDilemmas: () => withIds(NORMAL_DILEMMAS, "normal"),
  },
  byilhanNico: {
    label: "Version Byilhan&Nico",
    menuLabel: "Version Byilhan&Nico",
    imageSrc: "https://cdn-www.konbini.com/files/2025/09/nico_byilhan.jpg?width=1080&quality=75&format=webp",
    imageLabel: "Image à venir",
    prefix: "byilhannico",
    getDilemmas: () => withIds(BYILHAN_NICO_DILEMMAS, "byilhannico"),
  },
};

const startMenu = document.getElementById("start-menu");
const gameRoot = document.getElementById("game-root");
const modeChoicesContainer = document.getElementById("mode-choices");
const modeBadge = document.getElementById("mode-badge");
const categoryBadge = document.getElementById("category-badge");
const progressText = document.getElementById("progress-text");
const dilemmaText = document.getElementById("dilemma-text");
const choicesContainer = document.getElementById("choices-container");
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
  mode: null,
  dilemmas: [],
  order: [],
  index: 0,
  answered: 0,
  hasAnsweredCurrent: false,
  currentChoices: [],
  choiceButtons: [],
  modeStarts: {},
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

function activeModeConfig() {
  return MODE_DEFINITIONS[state.mode] || MODE_DEFINITIONS.normal;
}

function buildModeDilemmas(modeKey) {
  const modeConfig = MODE_DEFINITIONS[modeKey] || MODE_DEFINITIONS.normal;
  const source = modeConfig.getDilemmas();
  if (source.length > 0) {
    return source;
  }
  return fallbackDilemmas(modeConfig.prefix, modeConfig.label);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${Math.round(value)}%`;
}

function formatCount(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return new Intl.NumberFormat("fr-FR").format(safeValue);
}

function normalizeChoiceLabel(index) {
  if (index >= 0 && index < 26) {
    return String.fromCharCode(65 + index);
  }
  return `${index + 1}`;
}

function getDilemmaChoices(dilemma) {
  if (Array.isArray(dilemma?.options) && dilemma.options.length >= 2) {
    return dilemma.options
      .filter((option) => typeof option === "string")
      .map((option, index) => ({
        key: `option_${index}`,
        label: normalizeChoiceLabel(index),
        text: option,
      }));
  }

  const fallback = [];
  if (typeof dilemma?.a === "string") {
    fallback.push({ key: "a", label: "A", text: dilemma.a });
  }
  if (typeof dilemma?.b === "string") {
    fallback.push({ key: "b", label: "B", text: dilemma.b });
  }
  return fallback;
}

function clearChoiceCards() {
  state.choiceButtons = [];
  if (choicesContainer) {
    choicesContainer.innerHTML = "";
  }
}

function renderChoiceCards(dilemma) {
  clearChoiceCards();

  const choices = getDilemmaChoices(dilemma);
  state.currentChoices = choices;

  if (!choicesContainer) {
    return;
  }

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn choice-card";
    button.dataset.choice = choice.key;
    button.innerHTML = `<span class="choice-label">${choice.label}</span><span class="choice-text">${choice.text}</span>`;
    button.addEventListener("click", () => answer(choice.key));
    choicesContainer.appendChild(button);
    state.choiceButtons.push(button);
  });
}

function renderModeCards() {
  if (!modeChoicesContainer) {
    return;
  }

  modeChoicesContainer.innerHTML = "";

  Object.entries(MODE_DEFINITIONS).forEach(([modeKey, modeConfig]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn mode-btn mode-card";
    button.dataset.mode = modeKey;
    const totalStarts = Number(state.modeStarts[modeKey]) || 0;
    const mediaHtml = modeConfig.imageSrc
      ? `<img class="mode-card-image" src="${modeConfig.imageSrc}" alt="${modeConfig.label}" loading="lazy" />`
      : `<span class="mode-card-placeholder">${modeConfig.imageLabel || "Image à venir"}</span>`;

    button.innerHTML = `
      <span class="mode-card-media">${mediaHtml}</span>
      <span class="mode-card-content">
        <span class="choice-label">Version</span>
        <span class="choice-text">${modeConfig.menuLabel || modeConfig.label}</span>
      </span>
      <span class="mode-card-footer">
        <span class="mode-card-stat-label">Jouée</span>
        <span class="mode-card-stat-value" data-mode-count="${modeKey}">${formatCount(totalStarts)} fois</span>
      </span>
    `;
    button.addEventListener("click", () => startGame(modeKey));
    modeChoicesContainer.appendChild(button);
  });
}

function modeStatsRef(modeKey) {
  if (!firebaseDb || !modeKey) {
    return null;
  }
  return firebaseDb.collection("tuPrefereModeStats").doc(modeKey);
}

function setModeCountUI(modeKey, count) {
  const node = modeChoicesContainer?.querySelector(`[data-mode-count="${modeKey}"]`);
  if (!node) {
    return;
  }
  node.textContent = `${formatCount(count)} fois`;
}

async function loadModeStartTotals() {
  const modeKeys = Object.keys(MODE_DEFINITIONS);
  if (!modeKeys.length) {
    return;
  }

  if (!firebaseDb) {
    modeKeys.forEach((modeKey) => {
      state.modeStarts[modeKey] = 0;
      setModeCountUI(modeKey, 0);
    });
    return;
  }

  await Promise.all(
    modeKeys.map(async (modeKey) => {
      const ref = modeStatsRef(modeKey);
      if (!ref) {
        state.modeStarts[modeKey] = 0;
        setModeCountUI(modeKey, 0);
        return;
      }

      try {
        const snapshot = await ref.get();
        const totalStarts = snapshot.exists ? Number(snapshot.data()?.totalStarts) || 0 : 0;
        state.modeStarts[modeKey] = totalStarts;
        setModeCountUI(modeKey, totalStarts);
      } catch (error) {
        console.warn("[TuPrefere] Impossible de charger le compteur de mode:", error?.message || error);
        state.modeStarts[modeKey] = 0;
        setModeCountUI(modeKey, 0);
      }
    })
  );
}

async function registerModeStart(modeKey) {
  const ref = modeStatsRef(modeKey);
  if (!ref || !modeKey) {
    return;
  }

  try {
    const nextTotal = await firebaseDb.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const currentTotal = Number(data.totalStarts) || 0;
      const totalStarts = currentTotal + 1;

      transaction.set(
        ref,
        {
          modeKey,
          label: MODE_DEFINITIONS[modeKey]?.label || modeKey,
          totalStarts,
          updatedAt: firestoreFieldValue?.serverTimestamp
            ? firestoreFieldValue.serverTimestamp()
            : new Date().toISOString(),
        },
        { merge: true }
      );

      return totalStarts;
    });

    state.modeStarts[modeKey] = nextTotal;
    setModeCountUI(modeKey, nextTotal);
  } catch (error) {
    console.warn("[TuPrefere] Impossible d'incrémenter le compteur de mode:", error?.message || error);
  }
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
  if (!ref || !choice || (choice !== "a" && choice !== "b")) {
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

  modeBadge.textContent = activeModeConfig().label;
  categoryBadge.textContent = dilemma.category;
  progressText.textContent = `Dilemme ${state.index + 1} / ${state.order.length}`;
  dilemmaText.textContent = dilemma.question;
  renderChoiceCards(dilemma);

  state.choiceButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.disabled = false;
  });

  state.hasAnsweredCurrent = false;
  resultText.textContent = "Choisis une option 👀";
  lockGlobalStatsUI();
}

function answer(choice) {
  if (state.hasAnsweredCurrent) return;

  const dilemma = currentDilemma();
  const selectedChoice = state.currentChoices.find((item) => item.key === choice);
  if (!selectedChoice) {
    return;
  }

  state.hasAnsweredCurrent = true;
  state.answered += 1;

  state.choiceButtons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.choice === choice);
  });

  resultText.textContent = `Tu as choisi ${selectedChoice.label}.`;
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
    state.order = shuffle(state.dilemmas);
    state.index = 0;
    trackGameEvent("deck_reshuffled", {
      total: state.order.length,
      mode: state.mode,
    });
  }

  updateView();
}

function showGame() {
  if (startMenu) {
    startMenu.classList.add("is-hidden");
    startMenu.setAttribute("aria-hidden", "true");
  }

  if (gameRoot) {
    gameRoot.classList.remove("is-hidden");
    gameRoot.setAttribute("aria-hidden", "false");
  }
}

function startGame(modeKey) {
  state.mode = MODE_DEFINITIONS[modeKey] ? modeKey : "normal";
  state.dilemmas = buildModeDilemmas(state.mode);
  state.order = shuffle(state.dilemmas);
  state.index = 0;
  state.answered = 0;
  state.hasAnsweredCurrent = false;

  showGame();
  lockGlobalStatsUI();
  updateView();
  registerModeStart(state.mode);

  trackGameEvent("game_loaded", {
    totalDilemmas: state.order.length,
    mode: state.mode,
  });
}

nextButton?.addEventListener("click", nextDilemma);

window.addEventListener("keydown", (event) => {
  if (state.mode === null) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    const firstChoiceKey = state.currentChoices[0]?.key;
    if (firstChoiceKey) {
      answer(firstChoiceKey);
    }
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    const secondChoiceKey = state.currentChoices[1]?.key;
    if (secondChoiceKey) {
      answer(secondChoiceKey);
    }
    return;
  }

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    nextDilemma();
  }
});

function init() {
  renderModeCards();
  lockGlobalStatsUI();
  loadModeStartTotals();
}

init();
