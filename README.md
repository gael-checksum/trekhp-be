# Trek HP — Site officiel

Site statique pour les éditions du Trek HP, hébergé sur GitHub Pages.

## Déploiement

1. Pousser sur la branche `main` → GitHub Actions déploie automatiquement
2. Dans les Settings du repo : Pages → Source → `gh-pages` branch

## Mise à jour annuelle

Modifier uniquement `assets/js/config.js` :

```js
const TREK_CONFIG = {
  annee: 2028,           // ← changer l'année
  date_trek: "2028-10-...",
  statut: "annonce",
  // ...
};
```

## Backend Google Apps Script

1. Aller sur [script.google.com](https://script.google.com)
2. Nouveau projet → coller le contenu de `backend/apps-script.js`
3. Remplacer `VOTRE_SPREADSHEET_ID` par l'ID de votre Google Sheet
4. Déployer → Nouvelle application web → accès : "Tout le monde"
5. Copier l'URL dans `config.js` : `apps_script_inscription` et `apps_script_mailing`

## Structure

```
/
├── index.html          ← page d'accueil
├── inscription.html    ← formulaire équipe
├── archives.html       ← éditions passées (à créer)
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── config.js       ← CONFIG ANNUELLE
│   │   ├── map.js          ← carte Leaflet/OSM
│   │   ├── countdown.js    ← compte à rebours
│   │   ├── mailing.js      ← formulaire mailing list
│   │   └── inscription.js  ← formulaire + priorité
│   └── img/
│       └── hero-bg.jpg     ← photo de fond (à ajouter)
└── backend/
    └── apps-script.js  ← code Google Apps Script (non déployé)
```
