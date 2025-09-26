# Atlas HR Suite – Prototype Fluent

Prototype front complet (HTML5 + CSS + JavaScript vanilla) illustrant une suite RH marocaine du recrutement à la paie, conçu comme application mono-page avec Fluent UI Web Components.

## Fonctionnalités clefs
- Routage client (`#/path`) avec navigation latérale façon Microsoft 365.
- Bilingue FR/AR (RTL), thème clair/sombre et composants Fluent (boutons, champs, data-grid simplifiée).
- Jeu de données simulé stocké dans `localStorage` (10 salariés, pipeline recrutement, onboarding, temps, congés, paie, formation, documents).
- Moteur de paie marocain : CNSS/AMO/TFP, barème IR 2025, prime d’ancienneté, heures supplémentaires paramétrables, simulation et exports.
- Exports DOCX via `docx` et XLSX via `SheetJS`, placeholders pour intégration Microsoft Graph (Word/Excel Online).
- Import/Export JSON du jeu de données, import XLSX du pointage, génération de lettres d’offre, contrats, bulletins.

## Structure
```
index.html                  # App shell Fluent + inclusion CDN (Fluent, docx, SheetJS)
assets/
├── css/
│   └── app.css             # Styles Fluent adaptés, responsive, RTL ready
└── js/
    ├── app.js              # Entrée SPA, router, thèmes, toasts, import/export
    ├── data/
    │   ├── defaults.js     # Jeu de données seed (salariés, offres, params paie…)
    │   └── store.js        # Gestion localStorage, pub/sub
    ├── services/
    │   ├── exports.js      # Génération DOCX/XLSX, placeholders Office Graph
    │   ├── payroll.js      # Fonctions de calcul paie (CNSS, IR, net…)
    │   └── utils.js        # Format MAD, masquage CNIE, toasts, helpers
    ├── i18n.js             # Dictionnaire FR/AR + bascule RTL
    └── pages/              # Modules de rendu pour chaque route (dashboard → admin)
```

## Routes disponibles
- `#/` Tableau de bord (KPI, liens rapides CNSS/SIMPL-IR)
- `#/recrutement` Kanban pipeline + fiche candidat FR/AR, exports Excel/DOCX
- `#/onboarding` Checklists IT/RH/Manager, génération contrat/attestation
- `#/salaries` Grille salariés, fiche éditable, documents/journal
- `#/temps` Planning & import XLSX, règles heures sup paramétrables
- `#/conges` Gestion des demandes et calendrier fériés public/privé
- `#/paie` Paramètres Maroc, variables mensuelles, simulation, exports CNSS & SIMPL
- `#/formation` Plan de formation & rappel TFP 1.6%
- `#/documents` Gestion modèles DOCX, exports Excel, placeholder Graph
- `#/admin` Rôles, locales, paramètres légaux, reset données

## Utilisation
1. Ouvrir `index.html` dans un navigateur moderne (serveur non requis).
2. Adapter les données/script via `localStorage` (boutons Importer/Exporter dans le menu).
3. Pour remettre les données par défaut : Admin → "Réinitialiser jeu de données".

## Intégrations Office (placeholders)
- Boutons "Ouvrir dans Word/Excel" redirigent vers Office sur le web.
- Fonction `openInExcelGraph` contient les endpoints Graph à implémenter pour uploader un fichier dans OneDrive et alimenter un workbook.

Ce prototype est prêt à être branché sur un back-end (APIs métiers, Microsoft Graph, etc.) en remplaçant progressivement les services `store.js` et `exports.js`.
