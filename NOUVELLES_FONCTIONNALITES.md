# Nouvelles Fonctionnalités - Atlas HR Suite

## Vue d'ensemble

Cette mise à jour majeure d'Atlas HR Suite apporte une conformité complète avec la législation marocaine et des fonctionnalités avancées pour la gestion RH moderne.

---

## 🇲🇦 1. Conformité Marocaine Complète

### 1.1 Déclarations CNSS (Format Damancom)

**Fichier**: `assets/js/services/moroccanCompliance.js`

#### Fonctionnalités
- ✅ Génération automatique des fichiers Damancom pour télétransmission CNSS
- ✅ Format officiel tabulé (TSV) conforme aux spécifications CNSS
- ✅ Calcul automatique des cotisations selon les taux en vigueur :
  - Allocations familiales : 6.4% (employeur)
  - Prestations sociales : 8.98% (employeur) + 4.48% (salarié) - Plafonné à 6000 MAD
  - AMO : 4.11% (employeur) + 2.26% (salarié)
  - TFP : 1.6% (employeur)

#### Utilisation
```javascript
import { generateDamancomFile } from './services/moroccanCompliance.js';

const damancomFile = generateDamancomFile(declaration, employees, companyInfo);
// Télécharger le fichier .txt pour télétransmission
```

#### Format du fichier généré
```
ENREG    MATRICULE_CNSS    NOM    PRENOM    SALAIRE_BRUT    ...
E000001  123456789         ALAMI  FATIMA    8500.00         ...
TOTAL    -                 -      -         85000.00        ...
```

---

### 1.2 Déclarations IR (Format SIMPL-IR XML)

**Fichier**: `assets/js/services/moroccanCompliance.js`

#### Fonctionnalités
- ✅ Génération XML conforme au format SIMPL-IR de la DGI
- ✅ Barème IR 2025 complet (6 tranches : 0%, 10%, 20%, 30%, 34%, 37%)
- ✅ Calcul automatique de l'impôt sur le revenu
- ✅ Export XML prêt pour télédéclaration sur portail DGI

#### Utilisation
```javascript
import { generateSIMPLIRXML } from './services/moroccanCompliance.js';

const xmlFile = generateSIMPLIRXML(declaration, employees, companyInfo);
// Télécharger le fichier XML pour télédéclaration
```

#### Structure XML générée
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DeclarationIR xmlns="http://www.tax.gov.ma/simpl-ir">
  <EnTete>
    <Exercice>2025</Exercice>
    <Periode>01</Periode>
    ...
  </EnTete>
  <Salaries>
    <Salarie>
      <CIN>AB123456</CIN>
      <MontantIR>1250.00</MontantIR>
      ...
    </Salarie>
  </Salaries>
</DeclarationIR>
```

---

### 1.3 Bulletins de Paie Officiels

**Fichier**: `assets/js/services/moroccanCompliance.js` + `assets/js/services/exports.js`

#### Fonctionnalités
- ✅ Génération de bulletins de paie conformes au Code du Travail marocain
- ✅ Détail complet des éléments de rémunération
- ✅ Calcul CNSS, AMO, CIMR, Mutuelle, IR
- ✅ Mentions légales obligatoires
- ✅ Export PDF prêt à imprimer

#### Contenu du bulletin
- En-tête entreprise (ICE, CNSS, RC, Patente)
- Informations salarié (Matricule, CNSS, CNIE, Poste)
- Éléments de rémunération (Salaire base, primes, heures sup, ancienneté)
- Cotisations sociales détaillées
- Impôt sur le revenu
- Net à payer (en chiffres et en lettres)
- Mode de paiement (Virement, Chèque, Espèces)
- Mentions légales

#### Utilisation
```javascript
import { generateBulletinPaie } from './services/moroccanCompliance.js';
import { exportBulletinPaie } from './services/exports.js';

const bulletin = generateBulletinPaie(employee, payrollData, companyInfo, '2025-01');
exportBulletinPaie(bulletin); // Ouvre la fenêtre d'impression
```

---

### 1.4 Certificats Officiels

**Fichier**: `assets/js/services/moroccanCompliance.js`

#### Types de certificats disponibles

##### a) Attestation de Travail
- Conforme à l'article 72 du Code du Travail
- Informations complètes de l'employé
- Durée d'emploi et poste occupé
- Salaire mensuel brut

##### b) Certificat de Salaire
- Moyenne des 3 derniers mois (configurable)
- Détail salaire brut et net
- Utilisable pour dossiers bancaires, location, etc.

##### c) Certificat de Travail (Fin de contrat)
- Document de fin de relation de travail
- Mention "libre de tout engagement"
- Conformité article 72 du Code du Travail

##### d) Solde de Tout Compte
- Détail des éléments finaux (prorata, congés, indemnités)
- Calcul des retenues
- Signatures employeur/salarié
- Délai de renonciation 60 jours

#### Utilisation
```javascript
import {
  generateAttestationTravail,
  generateCertificatSalaire,
  generateCertificatTravail,
  generateSoldeToutCompte
} from './services/moroccanCompliance.js';

// Attestation de travail
const attestation = generateAttestationTravail(employee, companyInfo, 'Banque');

// Certificat de salaire (3 derniers mois)
const certificat = generateCertificatSalaire(employee, payrollHistory, companyInfo, 3);

// Export PDF ou DOCX
import { exportAttestationTravail, exportCertificatDocx } from './services/exports.js';
exportAttestationTravail(attestation);
```

---

## 📍 2. Système de Pointage Avancé

**Fichier**: `assets/js/services/advancedTimeTracking.js`

### 2.1 Validation GPS

#### Fonctionnalités
- ✅ Géolocalisation automatique lors du pointage
- ✅ Validation du périmètre autorisé (multi-sites)
- ✅ Calcul de distance précis (formule de Haversine)
- ✅ Détection des pointages hors périmètre
- ✅ Configuration par site (rayon autorisé)

#### Configuration
```javascript
const gpsConfig = {
  enabled: true,
  maxDistanceMeters: 100,
  officeLocations: [
    { name: 'Siège Casablanca', lat: 33.5731, lng: -7.5898, radius: 100 },
    { name: 'Agence Rabat', lat: 34.0209, lng: -6.8416, radius: 100 },
    { name: 'Agence Marrakech', lat: 31.6295, lng: -7.9811, radius: 100 }
  ]
};
```

#### Utilisation
```javascript
import { checkIn, getCurrentLocation } from './services/advancedTimeTracking.js';

// Obtenir la localisation
const location = await getCurrentLocation();

// Pointage avec GPS
const checkInData = await checkIn(employeeId, {
  gps: location,
  device: { type: 'mobile', os: 'Android' }
});
```

---

### 2.2 Biométrie et Reconnaissance Faciale

#### Fonctionnalités
- ✅ Support empreinte digitale, reconnaissance faciale, iris
- ✅ Détection de vivacité (anti-spoofing)
- ✅ Seuil de confiance configurable (par défaut 85%)
- ✅ Capture photo avec analyse
- ✅ Fallback sur code PIN si biométrie échoue

#### Configuration
```javascript
const biometricConfig = {
  enabled: true,
  types: ['fingerprint', 'face', 'iris'],
  confidenceThreshold: 0.85,
  livenessDetection: true,
  maxAttempts: 3
};
```

#### Utilisation
```javascript
import { captureFacePhoto } from './services/advancedTimeTracking.js';

// Capturer une photo pour reconnaissance faciale
const photo = await captureFacePhoto();

// Pointage avec biométrie
const checkInData = await checkIn(employeeId, {
  photo: photo,
  biometric: {
    type: 'face',
    confidence: photo.confidence,
    deviceId: 'terminal_001'
  }
});
```

---

### 2.3 Détection d'Anomalies

#### Types d'anomalies détectées
- ⚠️ **LATE_ARRIVAL** : Retard supérieur au délai de grâce (15 min par défaut)
- ⚠️ **EARLY_DEPARTURE** : Départ anticipé
- ⚠️ **GPS_OUT_OF_RANGE** : Pointage hors périmètre autorisé
- ⚠️ **BIOMETRIC_LOW_CONFIDENCE** : Confiance biométrique faible
- ⚠️ **FACE_RECOGNITION_FAILED** : Échec de reconnaissance faciale
- ℹ️ **OVERTIME** : Heures supplémentaires détectées
- ℹ️ **EARLY_ARRIVAL** : Arrivée anticipée

#### Gestion des anomalies
```javascript
// Les anomalies sont automatiquement ajoutées au pointage
checkInData.anomalies.forEach(anomaly => {
  console.log(`${anomaly.type}: ${anomaly.message} (${anomaly.severity})`);
});

// Validation manuelle si nécessaire
if (checkInData.anomalies.some(a => a.severity === 'error')) {
  // Nécessite validation RH
  checkInData.validated = false;
}
```

---

### 2.4 Statistiques de Pointage

#### Métriques calculées
- Nombre total de jours travaillés
- Jours de présence/absence
- Retards et départs anticipés
- Heures travaillées totales
- Heures supplémentaires
- Taux de présence
- Heure d'arrivée/départ moyenne

#### Utilisation
```javascript
import { calculateTimeStats } from './services/advancedTimeTracking.js';

const stats = calculateTimeStats(
  attendanceRecords,
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

console.log(`Présences: ${stats.presentDays}/${stats.totalDays}`);
console.log(`Retards: ${stats.lateDays}`);
console.log(`Heures travaillées: ${stats.totalHoursWorked.toFixed(2)}h`);
```

---

## 📱 3. API Mobile

**Fichier**: `assets/js/services/mobileAPI.js`

### 3.1 Architecture

L'API mobile fournit une interface REST complète pour les applications mobiles (iOS/Android).

#### Endpoints disponibles

##### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/reset-password` - Réinitialiser mot de passe

##### Employé
- `GET /employee/profile` - Profil de l'employé
- `PUT /employee/profile` - Mettre à jour le profil
- `GET /employee/documents` - Documents de l'employé

##### Pointage
- `POST /attendance/check-in` - Pointer l'entrée
- `POST /attendance/check-out` - Pointer la sortie
- `GET /attendance/history` - Historique de pointage
- `GET /attendance/stats` - Statistiques de pointage

##### Congés
- `GET /leaves` - Liste des congés
- `POST /leaves/request` - Demander un congé
- `DELETE /leaves/:id/cancel` - Annuler un congé
- `GET /leaves/balance` - Solde de congés

##### Paie
- `GET /payroll/payslips` - Bulletins de paie
- `GET /payroll/payslips/:id` - Détail d'un bulletin
- `GET /payroll/payslips/:id/download` - Télécharger un bulletin

##### Notifications
- `GET /notifications` - Notifications
- `PUT /notifications/:id/read` - Marquer comme lu

##### Managers
- `GET /team` - Équipe
- `GET /team/attendance` - Pointage de l'équipe
- `POST /team/leaves/:id/approve` - Approuver un congé
- `POST /team/leaves/:id/reject` - Rejeter un congé

---

### 3.2 Authentification JWT

#### Connexion
```javascript
import { mobileAPI } from './services/mobileAPI.js';

const response = await mobileAPI.login({
  username: 'fatima.alami@example.com',
  password: 'password123',
  deviceId: 'device_12345',
  deviceToken: 'fcm_token_xxx' // Pour notifications push
});

// Réponse
{
  success: true,
  data: {
    user: { id, nom, email, poste, role, permissions },
    authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'refresh_token_xxx',
    expiresIn: 86400 // 24h
  }
}
```

---

### 3.3 Pointage Mobile

#### Exemple complet
```javascript
// 1. Obtenir la position GPS
const location = await getCurrentLocation();

// 2. Capturer la photo (optionnel)
const photo = await captureFacePhoto();

// 3. Effectuer le pointage
const checkInResponse = await mobileAPI.mobileCheckIn({
  enableGPS: true,
  enableFaceRecognition: true,
  deviceModel: 'iPhone 13',
  deviceOS: 'iOS 16',
  notes: 'Arrivée bureau'
});

// 4. Vérifier le résultat
if (checkInResponse.success) {
  if (checkInResponse.data.validated) {
    console.log('Pointage validé automatiquement');
  } else {
    console.log('Pointage enregistré, validation RH requise');
  }
}
```

---

### 3.4 Gestion des Congés

#### Demander un congé
```javascript
const leaveResponse = await mobileAPI.requestLeave({
  type: 'Congé annuel',
  startDate: '2025-02-01',
  endDate: '2025-02-10',
  days: 10,
  reason: 'Vacances familiales',
  documents: [] // Pièces justificatives si nécessaire
});

// Notification envoyée automatiquement au manager
```

---

### 3.5 Permissions et Rôles

#### Système de permissions
```javascript
// Rôles disponibles
const roles = {
  employee: ['view_profile', 'check_in', 'check_out', 'request_leave', 'view_payslips'],
  manager: [...employee_permissions, 'view_team', 'approve_leave', 'reject_leave'],
  hr: [...manager_permissions, 'manage_employees', 'manage_payroll'],
  admin: ['*'] // Toutes les permissions
};

// Vérification automatique des permissions
if (mobileAPI.user.permissions.includes('approve_leave')) {
  // Afficher bouton d'approbation
}
```

---

## 🔄 4. Système de Workflows Avancés

**Fichier**: `assets/js/services/advancedWorkflows.js`

### 4.1 Types de Workflows

#### Workflows disponibles

1. **Demande de Congé** (`leave_request`)
   - Étapes : Soumission → Validation Manager → Validation RH → Terminé
   - Auto-approbation : ≤ 1 jour

2. **Note de Frais** (`expense_claim`)
   - Étapes : Soumission → Validation Manager → Validation Finance → Terminé
   - Auto-approbation : ≤ 500 MAD

3. **Recrutement** (`recruitment`)
   - Étapes : Publication → Screening → Entretien 1 → Entretien 2 → Offre → Onboarding

4. **Demande de Formation** (`training_request`)
   - Étapes : Soumission → Validation Manager → Validation RH → Approbation Budget → Terminé
   - Auto-approbation : ≤ 2000 MAD

5. **Demande de Document** (`document_request`)
   - Étapes : Soumission → Traitement RH → Terminé
   - Auto-génération de certains documents

6. **Avance sur Salaire** (`salary_advance`)
   - Étapes : Soumission → Manager → RH → Finance → Terminé
   - Limite : 30% du salaire

7. **Évaluation de Performance** (`performance_review`)
   - Étapes : Auto-évaluation → Évaluation Manager → Validation RH → Entretien → Terminé

---

### 4.2 Moteur de Workflow

#### Créer un workflow
```javascript
import { workflowEngine, createLeaveRequestWorkflow } from './services/advancedWorkflows.js';

// Méthode 1 : Helper function
const workflow = createLeaveRequestWorkflow(employeeId, {
  type: 'Congé annuel',
  startDate: '2025-02-01',
  endDate: '2025-02-10',
  days: 10,
  reason: 'Vacances',
  urgent: false
});

// Méthode 2 : Moteur direct
const workflow = workflowEngine.createWorkflow('leave_request', employeeId, {
  type: 'Congé annuel',
  startDate: '2025-02-01',
  endDate: '2025-02-10',
  days: 10,
  reason: 'Vacances'
}, {
  priority: 'normal',
  dueDate: '2025-02-01'
});
```

---

### 4.3 Avancement du Workflow

#### Actions disponibles
- `approve` - Approuver et passer à l'étape suivante
- `reject` - Rejeter le workflow
- `request_changes` - Demander des modifications (retour étape précédente)
- `cancel` - Annuler le workflow

#### Exemple d'approbation
```javascript
// Manager approuve la demande
workflowEngine.advanceWorkflow(
  workflowId,
  managerId,
  'approve',
  'Validé, bon retour de vacances !'
);

// RH rejette avec commentaire
workflowEngine.advanceWorkflow(
  workflowId,
  hrUserId,
  'reject',
  'Solde de congés insuffisant'
);

// Demande de modifications
workflowEngine.advanceWorkflow(
  workflowId,
  managerId,
  'request_changes',
  'Merci de préciser les dates exactes'
);
```

---

### 4.4 Auto-Approbation

#### Règles configurables
```javascript
const autoApprovalRules = {
  leave_request: {
    daysThreshold: 1, // Auto-approuver si ≤ 1 jour
    requiresManagerApproval: true,
    requiresHRApproval: true
  },
  expense_claim: {
    amountThreshold: 500, // Auto-approuver si ≤ 500 MAD
    requiresManagerApproval: true,
    requiresFinanceApproval: true
  },
  training_request: {
    costThreshold: 2000,
    requiresManagerApproval: true,
    requiresHRApproval: true,
    requiresBudgetApproval: true
  }
};

// Le système vérifie automatiquement et passe les étapes si conditions remplies
```

---

### 4.5 Notifications Automatiques

#### Événements notifiés
- Création de workflow → Notifier les approbateurs
- Approbation → Notifier l'initiateur et prochains approbateurs
- Rejet → Notifier l'initiateur
- Demande de modifications → Notifier l'initiateur
- Complétion → Notifier l'initiateur

#### Format des notifications
```javascript
{
  id: 'notif_12345',
  userId: 'emp_001',
  type: 'workflow_approve',
  title: 'Demande de congé',
  message: 'Votre demande de congé a été approuvée',
  metadata: {
    workflowId: 'wf_12345',
    workflowType: 'leave_request',
    action: 'approve'
  },
  read: false,
  timestamp: '2025-01-15T10:30:00Z'
}
```

---

### 4.6 Automatisations

#### Actions automatisables
- `send_email` - Envoyer un email
- `update_field` - Mettre à jour un champ
- `create_task` - Créer une tâche
- `generate_document` - Générer un document
- `update_calendar` - Mettre à jour le calendrier
- `webhook` - Appeler un webhook externe

#### Exemple de règle d'automatisation
```javascript
const automation = {
  workflowType: 'leave_request',
  trigger: 'approve', // Quand approuvé
  enabled: true,
  actions: [
    {
      type: 'update_calendar',
      params: {
        calendar: 'absences',
        event: {
          title: 'Congé {{employee_name}}',
          start: '{{leave_start}}',
          end: '{{leave_end}}'
        }
      }
    },
    {
      type: 'send_email',
      params: {
        to: '{{employee_email}}',
        subject: 'Congé approuvé',
        template: 'leave_approved'
      }
    }
  ]
};
```

---

### 4.7 Statistiques de Workflows

#### Métriques disponibles
```javascript
const stats = workflowEngine.getWorkflowStats({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});

console.log(stats);
// {
//   total: 45,
//   byStatus: { active: 12, completed: 28, rejected: 3, cancelled: 2 },
//   byType: { leave_request: 20, expense_claim: 15, training_request: 10 },
//   averageCompletionTime: 2.5, // jours
//   completionRate: 62.22 // %
// }
```

---

## 📊 5. Intégration avec les Modules Existants

### 5.1 Module Paie
- Génération automatique de bulletins conformes
- Export CNSS Damancom et SIMPL-IR XML
- Calculs selon législation marocaine 2025

### 5.2 Module Pointage
- Remplacement du système basique par le système avancé
- Validation GPS et biométrie
- Détection d'anomalies en temps réel

### 5.3 Module Congés
- Intégration avec le workflow de demande de congé
- Notifications automatiques
- Validation multi-niveaux

### 5.4 Module Documents
- Génération de certificats officiels
- Export PDF et DOCX
- Templates conformes

---

## 🔒 6. Sécurité et Conformité

### 6.1 Protection des Données (RGPD)
- Chiffrement des données sensibles (CNIE, CNSS, RIB)
- Journalisation des accès
- Consentement pour biométrie et GPS

### 6.2 Authentification
- JWT avec expiration (24h pour auth, 30j pour refresh)
- Tokens signés et vérifiés
- Stockage sécurisé côté client

### 6.3 Permissions
- Système de rôles (employee, manager, hr, finance, admin)
- Vérification des permissions à chaque action
- Séparation des responsabilités

---

## 📱 7. Compatibilité Mobile

### 7.1 Progressive Web App (PWA)
- Installation sur écran d'accueil
- Mode hors ligne (à implémenter)
- Notifications push

### 7.2 APIs Natives
- Géolocalisation (navigator.geolocation)
- Caméra (navigator.mediaDevices)
- Biométrie (WebAuthn) - À implémenter

### 7.3 Frameworks Supportés
- React Native
- Flutter
- Ionic
- Cordova/Capacitor

---

## 🚀 8. Utilisation

### 8.1 Import des Services

```javascript
// Conformité marocaine
import {
  generateDamancomFile,
  generateSIMPLIRXML,
  generateBulletinPaie,
  generateAttestationTravail,
  generateCertificatSalaire
} from './services/moroccanCompliance.js';

// Pointage avancé
import {
  checkIn,
  checkOut,
  getCurrentLocation,
  captureFacePhoto,
  calculateTimeStats
} from './services/advancedTimeTracking.js';

// API Mobile
import { mobileAPI } from './services/mobileAPI.js';

// Workflows
import {
  workflowEngine,
  createLeaveRequestWorkflow,
  createExpenseClaimWorkflow
} from './services/advancedWorkflows.js';

// Exports
import {
  exportDeclarationCNSS,
  exportDeclarationIR,
  exportBulletinPaie,
  exportAttestationTravail
} from './services/exports.js';
```

---

## 📝 9. Exemples Complets

### Exemple 1 : Génération déclaration CNSS et export

```javascript
import { getData } from './data/store.js';
import { generateDamancomFile } from './services/moroccanCompliance.js';
import { exportDeclarationCNSS } from './services/exports.js';

const data = getData();

const declaration = {
  id: 'decl_001',
  periode: '2025-01',
  nbEmployes: data.employees.length,
  details: data.employees.map(emp => ({
    employeeId: emp.id,
    salaireBrut: emp.salaireBase,
    nombreJours: 26
  }))
};

const companyInfo = {
  nom: 'Atlas Technologies',
  ice: '002123456789012',
  adresse: '123 Boulevard Mohamed V',
  ville: 'Casablanca'
};

// Export automatique
exportDeclarationCNSS(declaration, data.employees, companyInfo);
```

### Exemple 2 : Pointage mobile avec GPS et photo

```javascript
import { mobileAPI } from './services/mobileAPI.js';

// Connexion
await mobileAPI.login({
  username: 'fatima.alami@example.com',
  password: 'secure_password',
  deviceId: 'mobile_001',
  deviceToken: 'fcm_token'
});

// Pointage avec toutes les validations
const result = await mobileAPI.mobileCheckIn({
  enableGPS: true,
  enableFaceRecognition: true,
  deviceModel: 'Samsung Galaxy S21',
  deviceOS: 'Android 12',
  notes: 'Arrivée au bureau'
});

if (result.success) {
  console.log('Pointage enregistré:', result.data);

  // Afficher les anomalies éventuelles
  result.data.anomalies.forEach(anomaly => {
    if (anomaly.severity === 'warning') {
      console.warn(anomaly.message);
    }
  });
}
```

### Exemple 3 : Workflow de demande de congé

```javascript
import { createLeaveRequestWorkflow, workflowEngine } from './services/advancedWorkflows.js';

// 1. Employé crée une demande
const workflow = createLeaveRequestWorkflow('emp_001', {
  type: 'Congé annuel',
  startDate: '2025-02-01',
  endDate: '2025-02-10',
  days: 10,
  reason: 'Vacances en famille',
  urgent: false
});

console.log('Workflow créé:', workflow.id);
console.log('Étape actuelle:', workflow.currentStep); // 'employee_submit'

// 2. Manager approuve
workflowEngine.advanceWorkflow(
  workflow.id,
  'mgr_001',
  'approve',
  'Validé, profitez bien de vos vacances !'
);

// 3. RH valide
workflowEngine.advanceWorkflow(
  workflow.id,
  'hr_001',
  'approve',
  'Congé validé, bon repos'
);

// 4. Workflow terminé
console.log('Statut:', workflow.status); // 'completed'

// 5. Consulter l'historique
workflow.history.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.action} par ${entry.userId} - ${entry.comment}`);
});
```

### Exemple 4 : Génération bulletin de paie complet

```javascript
import { simulatePayroll } from './services/payroll.js';
import { generateBulletinPaie } from './services/moroccanCompliance.js';
import { exportBulletinPaie } from './services/exports.js';
import { getData } from './data/store.js';

const data = getData();
const employee = data.employees[0];

// 1. Calculer la paie
const variables = {
  [employee.id]: {
    heuresSup: { jour: 5, nuit: 2, repos: 0, jourHebdo: 0 },
    primes: 500,
    absences: 0
  }
};

const payrollResult = simulatePayroll([employee], variables, data.payrollParams);
const payrollData = payrollResult.results[0];

// 2. Générer le bulletin
const bulletin = generateBulletinPaie(employee, payrollData, data.companyInfo, '2025-01');

// 3. Exporter en PDF
exportBulletinPaie(bulletin);
```

---

## 🔧 10. Configuration

### 10.1 Configuration GPS
Modifier dans `advancedTimeTracking.js`:
```javascript
export const timeTrackingConfig = {
  gps: {
    enabled: true,
    maxDistanceMeters: 100,
    officeLocations: [
      // Ajouter vos bureaux ici
      { name: 'Siège', lat: 33.5731, lng: -7.5898, radius: 100 }
    ]
  }
};
```

### 10.2 Configuration Biométrie
```javascript
biometric: {
  enabled: true,
  types: ['fingerprint', 'face', 'iris'],
  confidenceThreshold: 0.85, // 85% de confiance minimum
  livenessDetection: true
}
```

### 10.3 Configuration Workflows
```javascript
// Modifier les règles d'auto-approbation
const autoApprovalRules = {
  daysThreshold: 1, // Changer selon vos besoins
  amountThreshold: 500
};
```

---

## 📞 11. Support

Pour toute question ou assistance :
- Documentation technique : Voir les fichiers dans `assets/js/services/`
- Code commenté : Chaque fonction est documentée
- Exemples : Voir ce fichier, section 9

---

## 📜 12. Conformité Légale

### Code du Travail Marocain
- ✅ Article 72 : Certificat de travail
- ✅ Article 75 : Solde de tout compte (délai 60 jours)
- ✅ Bulletin de paie conforme
- ✅ Déclarations CNSS obligatoires
- ✅ Déclarations IR obligatoires

### Protection des Données
- ✅ Chiffrement des données sensibles
- ✅ Consentement pour biométrie et GPS
- ✅ Droit d'accès et de rectification
- ✅ Durée de conservation limitée

---

## 🎯 13. Prochaines Étapes

### Fonctionnalités à venir
- [ ] Intégration API bancaire pour virements
- [ ] Signature électronique des certificats
- [ ] Module de formation en ligne
- [ ] Analytics avancés avec BI
- [ ] Application mobile native (React Native)
- [ ] Mode hors ligne complet
- [ ] Intégration ERP (SAP, Oracle)
- [ ] Export vers comptabilité (Sage, Ciel)

---

**Version**: 2.0.0
**Date**: Janvier 2025
**Auteur**: Atlas HR Suite Team
