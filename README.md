# Atlas HR Suite – Prototype Fluent (React + Vite)

Application démonstrateur d’une suite SIRH marocaine (recrutement → paie) construite désormais avec React, Vite et Fluent UI v9.

## Points clés
- SPA HashRouter (`#/app/...`) avec navigation latérale, ruban type Office, bottom tabs.
- Thèmes clair/sombre + mode Excel (palette verte) partagés via Fluent Provider.
- Localisation FR / AR (RTL) et bascule instantanée.
- Jeu de données de démonstration stocké côté client (Zustand) : offres, candidats, salariés, paie, temps, congés, formations, documents.
- Moteur paie Maroc (CNSS/AMO/TFP, IR 2025, prime ancienneté, heures sup) + exports JSON CNSS / SIMPL-IR.
- Landing marketing alignée sur les codes SIRH marocains (AGIRH-like), intégrée en React (`/`).

## Structure
```
src/
├── App.tsx                # Routing + Fluent Provider
├── data/defaultData.ts    # Jeu de données seed (typed)
├── layouts/AppLayout.tsx  # Header / ribbon / nav / footer tabs
├── pages/                 # Dashboard, Recrutement, Salariés, Paie, etc.
├── services/payroll.ts    # Fonctions de calcul paie
├── store/useAtlasStore.ts # Zustand store (data + UI state)
├── styles/                # Global, app shell, landing, toasts
└── utils/                 # Format MAD, download helper, clone helper
```

## Scripts
```bash
npm install       # installe les dépendances
npm run dev       # démarre Vite en mode développement (http://localhost:5173)
npm run build     # build production (dist/)
npm run preview   # sert le build pour vérification locale
```

## Déploiement
Le workflow GitHub Actions (`.github/workflows/deploy-pages.yml`) build automatiquement le site (npm ci → npm run build) puis publie `dist/` sur GitHub Pages. Aucun service externe payant requis.

## Routes principales
- `/` : page d’atterrissage marketing
- `#/app` : tableau de bord
- `#/app/recrutement` : pipeline kanban + ajout candidat
- `#/app/salaries` : fiche salarié éditable
- `#/app/temps` : pointage + import JSON + règles heures sup
- `#/app/conges` : demandes congés & jours fériés public/privé
- `#/app/paie` : paramètres CNSS/IR, variables mensuelles, simulation
- `#/app/formation`, `#/app/documents`, `#/app/admin`

## À suivre (itérations futures)
- Brancher export DOCX/XLSX (actuellement JSON placeholder)
- Implémenter backend persistant & authentification
- Intégrations CNSS/SIMPL-IR/Damancom temps réel
- Portail self-service collaborateurs + workflows multi-niveaux

Ce socle sert de base moderne pour pousser Atlas HR Suite vers une expérience comparable aux SIRH leaders marocains tout en restant 100 % déployable via GitHub Pages.
