# L'Infiltré (Undercover) - SPA Mobile Vanilla

Jeu social **mobile-only** (HTML/CSS/JS pur) avec synchronisation temps réel via Firebase.

## Stack
- Front: Vanilla `index.html` + `styles.css` + `app.js`
- Auth: Firebase Authentication (Email/Mot de passe)
- Data: Firestore (`onSnapshot` temps réel)
- Hosting: GitHub Pages

## Structure Firestore

```text
rooms/{roomId}
  - name: string
  - hostId: string
  - hostName: string
  - maxPlayers: number
  - currentPlayers: number
  - mrWhiteEnabled: boolean
  - anonymousVote: boolean
  - public: boolean
  - status: "waiting" | "playing" | "finished" | "closed"
  - phase: "distribution" | "discussion" | "vote" | "end"
  - round: number
  - winner: "civils" | "undercover" | "mrwhite" | null
  - pair: [string, string] | null

rooms/{roomId}/players/{playerId}
  - userId: string
  - displayName: string
  - alive: boolean
  - role: "civil" | "undercover" | "mrwhite" | null
  - word: string

rooms/{roomId}/game/state
  - phase: string
  - round: number
  - votes: { [voterId]: targetId }
  - eliminated: string[]
  - pair: [string, string]
```

## Configuration Firebase
1. Crée un projet Firebase.
2. Active Authentication > **Email/Password**.
3. Crée une base Firestore en mode production (ou test temporaire).
4. Récupère la config web Firebase.
5. Remplace les valeurs `REPLACE_ME` dans `app.js`.

## Règles Firestore (départ simple)
À adapter avant production.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write: if request.auth != null;

      match /players/{playerId} {
        allow read, write: if request.auth != null;
      }

      match /game/{docId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

## Lancer localement
Utilise un serveur statique (pas ouverture directe du fichier):

- VS Code Live Server
- ou `npx serve .`

## Déployer sur GitHub Pages
1. Push du repo sur GitHub.
2. Settings > Pages.
3. Source: branche `main` / dossier `/ (root)`.
4. Vérifie que `index.html` est à la racine.

## Gameplay implémenté
- Auth (connexion + inscription)
- Lobby public + création salon
- Paramètres hôte: nombre joueurs, Mr. White, vote anonyme
- Distribution auto des rôles/mots (60 paires de mots)
- Phases: distribution, discussion IRL, vote, élimination
- Forçage fin de tour par l'hôte
- Conditions de victoire + écran de fin + rematch
- Fermeture hôte: retour lobby global via room `closed` (soft close, sans suppression massive)
