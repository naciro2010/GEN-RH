# Atlas HR Suite — Backlog épics & stories (Maroc)

Ce document organise le projet par épics et stories, avec une vision techno-fonctionnelle adaptée au marché marocain (CNSS, AMO, IR, congés, pointage), et des pratiques inspirées des SIRH leaders (AGIRH/Sage/Odoo/Cegid) — sans reproduire leurs implémentations propriétaires. Les taux et règles légales évoluent: prévoir une configuration centralisée et vérifiée auprès des sources officielles (CNSS, DGI, ministère du Travail).

## 1) Vision & objectifs
- Offrir une suite SIRH moderne couvrant: Core HR, Recrutement, Onboarding, Temps & Absences, Paie Maroc, Formation, Documents, Self‑Service et Reporting.
- Cœur différenciant Maroc: calcul paie configurable (CNSS/AMO/TFP, IR, prime d’ancienneté, heures sup), exports conformes (Damancom/CNSS, SIMPL‑IR), fiches de paie conformes.
- Expérience: FR/AR (RTL), accessibilité, mobile-friendly, intégration Microsoft 365 (Graph) pour documents.

Personas prioritaires: Admin RH, Gestionnaire Paie, Manager, Employé, Auditeur/Compliance.

KPIs: temps de clôture paie, taux d’erreurs de paie, adoption self-service, SLA des workflows, couverture des dossiers salariés, conformité.

## 2) Architecture (techno-fonctionnelle)
- Frontend: React + Vite + Fluent UI v9, Zustand (déjà en place), i18n FR/AR, hash routing.
- Backend (proposé, phase 2): Node.js (NestJS/Express) + PostgreSQL. Modular monolith au départ, services par domaines (HR, Time, Payroll, Docs). AuthN/OIDC (Keycloak/Azure AD), RBAC par rôle (Admin RH, Paie, Manager, Employé, Auditeur).
- Intégrations:
  - Microsoft Graph (OneDrive/SharePoint) pour modèles et dépôts de documents.
  - Connecteurs paie: exports JSON/CSV pour CNSS (Damancom) et SIMPL‑IR (DGFiP Maroc) — vérifier schémas actuels et planifier une passerelle SFTP/API si disponible.
- Sécurité & conformité:
  - Données sensibles (CIN, RIB, CNSS) chiffrées au repos côté serveur, masquage en UI.
  - Journal d’audit: accès et modifications, traçabilité paie (qui-quoi-quand).
  - Loi 09‑08 (Maroc) + principes RGPD: minimisation, consentement candidats, rétention légale.
- Observabilité: logs structurés (JSON), métriques (masse salariale, durée calcul), traces.

## 3) Données & modèles (résumé)
- Salarié: identités, contrat, salaire de base, primes, matricule CNSS, CIN masquée, RIB, ayants-droit, rattachement orga.
- Contrat & historiques: changements de salaire/poste, type de contrat, avenants, dates d’effet.
- Temps & absences: pointage, heures sup, RTT, congés, jours fériés public/privé.
- Paie: paramètres globaux (CNSS/AMO/TFP, IR par tranches, prime ancienneté, overtime), variables mensuelles, bulletins, journal paie, exports.
- Recrutement & onboarding: offres, candidats, pipeline, checklists arrivée.
- Documents: modèles, variables de fusion, dépôts, liens Graph.

Note: Dans le prototype, `src/services/payroll.ts` implémente déjà un calcul paie configurable via `settings.payrollParams` dans `src/data/defaultData.ts`. La cible back‑end reprendra ces règles côté serveur avec tables paramétriques et versioning.

## 4) Backlog par épic (priorisé)

### Epic A — Core HR (Dossiers salariés & Organisation)
Objectif: centraliser et fiabiliser les dossiers salariés, l’organigramme, et les données contractuelles.

Stories (extraits):
1. Créer/éditer un salarié (Admin RH)
   - En tant qu’Admin RH, je crée un dossier salarié avec validations (CIN, RIB, CNSS) et masquage des champs sensibles.
   - Critères d’acceptation:
     - Formulaire typé avec champs obligatoires, masquage CIN/RIB par défaut.
     - Historisation des modifications (audit).
     - Upload de documents (CIN, contrat) avec contrôle d’accès.
2. Historiser les changements de contrat/salaire
   - En tant que Gestionnaire Paie, je saisis un avenant daté avec prise d’effet sur la paie.
   - Critères: timeline, versioning, effet sur base paie du mois M.
3. Organisation & postes
   - En tant qu’Admin RH, je maintiens départements, postes, rattachements managers.
   - Critères: organigramme consultable, impacts visibles sur fiches salariés.
4. RGPD/Loi 09‑08: consentements & rétention
   - En tant que Auditeur, je consulte les consentements et la politique de rétention (X ans) configurable.

Livrables techniques:
- Schéma BDD: tables `employees`, `contracts`, `positions`, `departments`, `employee_documents`, `audit_logs`.
- API CRUD sécurisées, masking en sérialisation, index sur identifiants.

### Epic B — Paie Maroc (Calcul, Bulletins, Exports)
Objectif: produire une paie conforme au Maroc, configurable et traçable.

Stories (extraits):
1. Paramétrage paie central (CNSS/AMO/TFP, IR, ancienneté, overtime)
   - En tant que Gestionnaire Paie, je gère un référentiel des paramètres de calcul avec date d’effet.
   - Critères: versioning des barèmes, validations, simulation avant publication.
2. Variables mensuelles par salarié
   - Je saisis heures sup, primes/avantages, absences, autres retenues.
   - Critères: import CSV/Excel, contrôle des bornes, logs de modification.
3. Calcul du bulletin
   - Je lance le calcul pour une période (M) avec aperçu par salarié et masse salariale.
   - Critères: détail CNSS/AMO/TFP, IR, prime ancienneté, net à payer, arrondis.
4. Émission des bulletins
   - Générer PDF conformes (mentions légales), distribution portail self‑service + option envoi email chiffré.
   - Critères: filigrane « Brouillon » avant clôture, accusés de consultation.
5. Exports réglementaires
   - Générer fichiers d’export pour CNSS/Damancom et SIMPL‑IR.
   - Critères: formats configurables (JSON/CSV/XML) + mapping champs.
6. Clôture & réouverture contrôlée
   - Workflow d’approbation, verrouillage période, réouverture avec motif et recalcul.

Livrables techniques:
- Service `payroll` (API): endpoints calcul/simulation, génération PDF (templating), exporteurs CNSS/IR, journal paie.
- Tables: `payroll_params`, `payroll_periods`, `payroll_runs`, `payroll_items`, `payroll_exports`.
- Moteur de règles: barèmes et taux configurables (sans codage), fonctions déterministes testées.

### Epic C — Temps & Absences (Pointage, Heures sup, Congés)
Objectif: collecter un temps fiable, alimenter la paie et gérer les congés.

Stories (extraits):
1. Règles heures sup
   - Configurer seuil hebdo, taux jour/nuit/repos/dimanche, exceptions.
2. Pointage
   - Import CSV/JSON, saisie manuelle, contrôle anomalies (heures négatives, week‑end non autorisé).
3. Congés & jours fériés
   - Demandes, validations multi‑niveaux, calendriers public/privé.
4. Bridge Paie
   - Consolider un récapitulatif par salarié pour injection dans variables paie.

Livrables techniques:
- Tables `time_entries`, `leave_requests`, `time_rules`, `holidays`.
- API d’agrégation hebdo/mensuelle, calcul heures sup conformes aux règles locales.

### Epic D — Recrutement & Onboarding
Objectif: pipeline de recrutement et parcours d’arrivée intégrés au dossier salarié.

Stories (extraits):
1. Pipeline kanban (Offres, Candidats, Étapes)
2. Consentement candidats + purge automatique
3. Checklists onboarding multi‑équipes (IT/RH/Manager)
4. Transformation candidat → salarié (pré‑remplissage dossier)

### Epic E — Self‑Service & Workflows
Objectif: portail employés et managers, automatisations.

Stories (extraits):
1. Portail employé: fiches de paie, attestations, congés, mises à jour profil (demande de changement soumise à RH)
2. Portail manager: validations congés, variables paie, vues équipe
3. Workflows: approbations multi‑niveaux, notifications (email/Teams)

### Epic F — Documents & Modèles
Objectif: générer et stocker des documents RH.

Stories (extraits):
1. Modèles DOCX (contrats, offres) avec variables de fusion
2. Stockage OneDrive/SharePoint (Graph), contrôle d’accès
3. Registre documents salariés, empreintes et audit

### Epic G — Reporting & Compliance
Objectif: tableaux de bord, exports, audits.

Stories (extraits):
1. Tableau bord RH (headcount, turn‑over, masse salariale, absentéisme)
2. Audit trail consultable et exportable
3. Rapports réglementaires (CNSS/IR) et analytiques

## 5) Spécificités paie Maroc (haut niveau)
- Contributions sociales: CNSS (prestations sociales plafonnées), allocations familiales, AMO, TFP. Taux et plafonds à paramétrer par période.
- Impôt sur le Revenu: barème progressif par tranches, abattements éventuels; tenir compte des évolutions annuelles.
- Éléments de salaire: base, primes récurrentes, prime d’ancienneté (grille configurable), heures supplémentaires (jour/nuit/repos/dimanche), retenues.
- Export & déclaratif: fichiers compatibles Damancom (CNSS) et SIMPL‑IR; vérifier formats et mises à jour.
- Fiche de paie: mentions légales, net à payer en MAD, traçabilité.

Important: Centraliser ces paramètres dans une table/config administrable et versionnée. Toute valeur « dure » dans le code est à proscrire.

## 6) Definition of Ready / Done (DoR/DoD)
- DoR story:
  - Persona, valeur métier, données d’entrée connues; règles de gestion écrites; critères d’acceptation SMART; impacts sécurité/compliance évalués.
- DoD story:
  - Tests unitaires/integ OK, validation UX, audits et logs en place, docs mises à jour, feature flags/configs appliqués, i18n FR/AR.

## 7) Roadmap (phases)
1. P0 Prototype durci (2–3 sprints)
   - Core HR minimal, Paie base (calcul + simulation), Temps/Absences import, export JSON CNSS/IR, stockage local (puis Postgres en P1).
2. P1 Production initiale (3–4 sprints)
   - Backend NestJS + Postgres, Auth OIDC, bulletins PDF, clôture paie, portails employés/managers.
3. P2 Écosystème & intégrations (4+ sprints)
   - Intégrations temps réel, reporting avancé, connecteurs compta, SSO Microsoft 365, mobile PWA.

## 8) Annexes
- Références publiques: CNSS/Damancom, DGI (IR), ministère du Travail. Toujours vérifier les textes applicables avant mise en production.
- Inspiration UX: patterns SIRH leaders (dashboard RH, filtres, list/detail, tableurs type Excel pour variables paie, wizards d’onboarding).


