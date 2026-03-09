# PianoTiles

Mini jeu de réflexes inspiré du concept "Piano Tiles".

## Règles

- Les tuiles noires descendent dans 4 colonnes.
- Tu dois taper uniquement la bonne tuile noire quand elle atteint la ligne rouge.
- Mauvaise case ou tuile ratée = game over.

## Firebase

Le jeu utilise `../firebase-shared.js` pour :

- tracer des événements de partie (`game_start`, `score_milestone`, `game_over`)
- sauvegarder les scores dans `PianoTiles/meta/scores`
- afficher un top 5 global
