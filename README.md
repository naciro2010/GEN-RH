# Atlas HR Suite – Front statique

Ensemble de pages HTML/CSS/JS inspirées de l’univers Microsoft pour présenter Atlas HR Suite, proposer une authentification de démonstration et deux portails (secteur public et secteur privé) prêts à être branchés sur un futur back-end.

## Structure du projet

```
├── index.html                 # Landing page marketing (secteurs public/privé)
├── pages/
│   ├── login.html             # Portail de connexion (démonstration)
│   ├── dashboard-public.html  # Dashboard secteur public
│   └── dashboard-private.html # Dashboard secteur privé
├── assets/
│   ├── css/
│   │   ├── base.css           # Fondations UI & tokens
│   │   ├── home.css           # Styles landing page
│   │   ├── login.css          # Styles écran de connexion
│   │   ├── dashboard-shared.css   # Layout commun dashboards
│   │   ├── dashboard-public.css   # Couche secteur public
│   │   └── dashboard-private.css # Couche secteur privé
│   └── js/
│       ├── base.js                # Thème, auth simulée, helpers globaux
│       ├── home.js                # Contenu dynamique landing
│       ├── login.js               # Logique connexion + redirections
│       ├── dashboard-shared.js    # Helpers dashboards (nav, formatage)
│       ├── dashboard-public.js    # Données & rendu secteur public
│       └── dashboard-private.js   # Données & rendu secteur privé
└── LICENSE
```

Chaque page HTML n’inclut que les feuilles de style et scripts nécessaires pour garder un découpage clair et réutilisable.

## Comptes de démonstration

| Portail | Email | Mot de passe |
|---------|-----------------------------|----------------|
| Public  | `public.admin@atlas.local`  | `Public#2024`  |
| Privé   | `private.director@atlas.local` | `Private#2024` |

- Les comptes sont gérés côté front via `assets/js/base.js` (stockage local simulé).
- Les dashboards vérifient le scope (public/privé) et redirigent vers la page de connexion si nécessaire.

## Navigation & personnalisation

- Le thème clair/sombre est disponible depuis le bouton circulaire dans l’en-tête.
- Les accès rapides de la landing page remplissent automatiquement la portée souhaitée sur la page de connexion.
- Les dashboards disposent d’une barre latérale modulable et de composants (KPI, timelines, kanban, heatmap, tableaux) prêts à connecter à une API.

Pour brancher un back-end réel, remplacez la logique d’authentification dans `base.js` / `login.js` et injectez les données dans les scripts spécifiques aux dashboards.
