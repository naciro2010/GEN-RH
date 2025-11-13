# 📋 Guide de Configuration - Application RH Marocaine

## Table des Matières

1. [Configuration du Pointage GPS](#configuration-du-pointage-gps)
2. [Configuration des Workflows d'Approbation](#configuration-des-workflows-dapprobation)
3. [Configuration CNSS et IR](#configuration-cnss-et-ir)
4. [Personnalisation des Seuils](#personnalisation-des-seuils)
5. [Configuration Mobile](#configuration-mobile)

---

## 📍 Configuration du Pointage GPS

### Localisations des Bureaux

Fichier: `assets/js/services/advancedTimeTracking.js`

#### 1. Ajouter/Modifier des Bureaux

Localisez la section `officeLocations` dans le fichier:

```javascript
gps: {
  enabled: true,
  requiredForCheckIn: true,
  requiredForCheckOut: true,
  maxDistanceMeters: 100,
  officeLocations: [
    {
      name: 'Siège Casablanca',
      lat: 33.5731,
      lng: -7.5898,
      radius: 100
    },
    {
      name: 'Agence Rabat',
      lat: 34.0209,
      lng: -6.8416,
      radius: 100
    },
    {
      name: 'Agence Marrakech',
      lat: 31.6295,
      lng: -7.9811,
      radius: 100
    }
  ]
}
```

#### 2. Obtenir les Coordonnées GPS de Vos Bureaux

**Méthode 1: Google Maps**
1. Ouvrez [Google Maps](https://maps.google.com)
2. Cliquez droit sur votre bureau
3. Sélectionnez "Quoi de neuf ici ?"
4. Les coordonnées apparaissent en haut (ex: 33.5731, -7.5898)

**Méthode 2: Application Mobile**
1. Utilisez votre smartphone avec GPS
2. Activez la géolocalisation
3. Rendez-vous à l'adresse exacte du bureau
4. Ouvrez le fichier `tests/test-pointage-gps.html`
5. Cliquez sur "📡 Obtenir Ma Position GPS"
6. Notez les coordonnées affichées

#### 3. Configurer le Rayon Autorisé

Le rayon définit la distance maximale autorisée autour du bureau (en mètres):

```javascript
{
  name: 'Mon Bureau',
  lat: 33.5731,
  lng: -7.5898,
  radius: 100  // ← Modifiez cette valeur
}
```

**Recommandations:**
- **Petit bureau (< 500m²)**: 50-100 mètres
- **Bureau moyen (500-2000m²)**: 100-200 mètres
- **Grand campus (> 2000m²)**: 200-500 mètres
- **Télétravail partiel**: Désactivez GPS avec `enabled: false`

#### 4. Exemple de Configuration Complète

```javascript
gps: {
  // Activer/Désactiver le GPS
  enabled: true,

  // GPS obligatoire pour pointer l'entrée
  requiredForCheckIn: true,

  // GPS obligatoire pour pointer la sortie
  requiredForCheckOut: true,

  // Distance maximale (si un seul bureau)
  maxDistanceMeters: 100,

  // Liste des bureaux autorisés
  officeLocations: [
    {
      name: 'Siège Social - Casablanca',
      lat: 33.5731,
      lng: -7.5898,
      radius: 150  // Rayon de 150m
    },
    {
      name: 'Agence Nord - Tanger',
      lat: 35.7595,
      lng: -5.8340,
      radius: 100
    },
    {
      name: 'Agence Sud - Agadir',
      lat: 30.4278,
      lng: -9.5981,
      radius: 100
    },
    // Ajoutez vos bureaux ici...
  ]
}
```

### Configuration des Horaires

```javascript
schedule: {
  workDayStart: '08:00',        // Heure de début de journée
  workDayEnd: '17:00',          // Heure de fin de journée
  lunchBreakStart: '12:00',     // Début pause déjeuner
  lunchBreakEnd: '13:00',       // Fin pause déjeuner
  graceMinutes: 15,             // Tolérance de retard (minutes)
  overtimeThreshold: 480        // Seuil heures sup (480 min = 8h)
}
```

### Configuration des Règles

```javascript
rules: {
  maxConsecutiveWorkDays: 6,    // Maximum jours travaillés consécutifs
  minRestHours: 11,             // Repos minimum entre 2 journées
  maxDailyHours: 10,            // Maximum heures par jour
  requireCheckOutSameDay: true, // Check-out obligatoire même jour
  autoCheckOutAfterHours: 12    // Auto check-out après X heures
}
```

---

## 🔄 Configuration des Workflows d'Approbation

Fichier: `assets/js/services/advancedWorkflows.js`

### 1. Règles d'Auto-Approbation

#### Congés (Leave Requests)

```javascript
LEAVE_REQUEST: {
  id: 'leave_request',
  name: 'Demande de congé',
  autoApprovalRules: {
    daysThreshold: 1,              // Auto-approuver si ≤ 1 jour
    requiresManagerApproval: true, // Approbation manager
    requiresHRApproval: true       // Approbation RH
  }
}
```

**Comment ça marche:**
- Si `days <= 1`: Approbation automatique (pas besoin de validation)
- Si `days > 1`: Workflow normal avec validations

**Personnalisation:**
```javascript
daysThreshold: 2,  // Auto-approuver jusqu'à 2 jours
requiresManagerApproval: false,  // Pas besoin du manager
requiresHRApproval: true  // Seulement RH valide
```

#### Notes de Frais (Expense Claims)

```javascript
EXPENSE_CLAIM: {
  id: 'expense_claim',
  name: 'Note de frais',
  autoApprovalRules: {
    amountThreshold: 500,          // Auto-approuver si ≤ 500 MAD
    requiresManagerApproval: true,
    requiresFinanceApproval: true
  }
}
```

**Exemples de Seuils:**
- **Petite entreprise**: 500-1000 MAD
- **Moyenne entreprise**: 1000-2000 MAD
- **Grande entreprise**: 2000-5000 MAD

#### Demandes de Formation

```javascript
TRAINING_REQUEST: {
  autoApprovalRules: {
    costThreshold: 2000,           // Auto-approuver si ≤ 2000 MAD
    requiresManagerApproval: true,
    requiresHRApproval: true,
    requiresBudgetApproval: true   // Approbation budget
  }
}
```

#### Avances sur Salaire

```javascript
SALARY_ADVANCE: {
  autoApprovalRules: {
    maxPercentage: 30,             // Max 30% du salaire
    requiresManagerApproval: true,
    requiresHRApproval: true,
    requiresFinanceApproval: true
  }
}
```

### 2. Personnaliser les Étapes de Workflow

Chaque workflow a des étapes définies:

```javascript
LEAVE_REQUEST: {
  steps: [
    'employee_submit',      // 1. Employé soumet
    'manager_review',       // 2. Manager examine
    'hr_validation',        // 3. RH valide
    'completed'             // 4. Terminé
  ]
}
```

**Pour modifier les étapes:**

```javascript
// Exemple: Ajouter une validation directeur
steps: [
  'employee_submit',
  'manager_review',
  'director_approval',    // ← Nouvelle étape
  'hr_validation',
  'completed'
]
```

### 3. Configuration Recommandée par Taille d'Entreprise

#### Petite Entreprise (< 50 employés)

```javascript
LEAVE_REQUEST: {
  autoApprovalRules: {
    daysThreshold: 2,
    requiresManagerApproval: false,  // Pas de manager
    requiresHRApproval: true         // Seulement RH
  }
}

EXPENSE_CLAIM: {
  autoApprovalRules: {
    amountThreshold: 1000,
    requiresManagerApproval: false,
    requiresFinanceApproval: true
  }
}
```

#### Moyenne Entreprise (50-200 employés)

```javascript
LEAVE_REQUEST: {
  autoApprovalRules: {
    daysThreshold: 1,
    requiresManagerApproval: true,
    requiresHRApproval: true
  }
}

EXPENSE_CLAIM: {
  autoApprovalRules: {
    amountThreshold: 500,
    requiresManagerApproval: true,
    requiresFinanceApproval: true
  }
}
```

#### Grande Entreprise (> 200 employés)

```javascript
LEAVE_REQUEST: {
  autoApprovalRules: {
    daysThreshold: 0,  // Aucune auto-approbation
    requiresManagerApproval: true,
    requiresHRApproval: true
  }
}

EXPENSE_CLAIM: {
  autoApprovalRules: {
    amountThreshold: 200,
    requiresManagerApproval: true,
    requiresFinanceApproval: true
  }
}
```

---

## 💰 Configuration CNSS et IR

Fichier: `assets/js/services/moroccanCompliance.js`

### 1. Informations Entreprise

Ces informations sont utilisées dans les déclarations CNSS et IR:

```javascript
const companyInfo = {
  nom: 'VOTRE SOCIÉTÉ SARL',
  ice: '002345678901234',           // 15 chiffres
  identifiantFiscal: '12345678',    // 8 chiffres
  cnss: '1234567',                  // 7 chiffres
  patente: '12345678',
  rc: '123456',                     // Registre de commerce
  adresse: '123 Avenue Mohammed V',
  ville: 'Casablanca',
  codePostal: '20000',
  telephone: '+212 522 123456',
  email: 'contact@votresociete.ma',
  directeur: 'M. Ahmed BENALI',
  representantLegal: 'M. Ahmed BENALI'
};
```

### 2. Taux de Cotisations CNSS (2025)

Les taux sont déjà configurés selon la législation marocaine:

```javascript
// Part Salarié
const cotisationSalarie = {
  prestationsSociales: 0.0448,  // 4.48%
  amo: 0.0226,                  // 2.26%
  total: 0.0674                 // 6.74%
};

// Part Employeur
const cotisationEmployeur = {
  prestationsSociales: 0.064,   // 6.4%
  allocationsFamiliales: 0.0898,// 8.98%
  amo: 0.0411,                  // 4.11%
  tfp: 0.016,                   // 1.6%
  total: 0.2109                 // 21.09%
};

// Plafond CNSS
const plafondCNSS = 6000;  // MAD
```

⚠️ **Important:** Ces taux sont légaux et ne doivent pas être modifiés sauf changement de la législation.

### 3. Barème IR 2025

```javascript
// Tranches d'imposition (annuelles)
const baremeIR = [
  { min: 0,      max: 30000,  taux: 0.00 },   // Exonéré
  { min: 30001,  max: 50000,  taux: 0.10 },   // 10%
  { min: 50001,  max: 60000,  taux: 0.20 },   // 20%
  { min: 60001,  max: 80000,  taux: 0.30 },   // 30%
  { min: 80001,  max: 180000, taux: 0.34 },   // 34%
  { min: 180001, max: Infinity, taux: 0.38 }  // 38%
];
```

---

## ⚙️ Personnalisation des Seuils et Limites

### Fichier: `assets/js/services/advancedTimeTracking.js`

#### Seuils de Pointage

```javascript
schedule: {
  graceMinutes: 15,  // ← Modifier la tolérance de retard

  // Exemple: Augmenter à 30 minutes
  graceMinutes: 30
}
```

#### Limites de Temps de Travail

```javascript
rules: {
  maxDailyHours: 10,  // ← Maximum d'heures par jour

  // Pour conformité stricte: 10h maximum selon le Code du Travail
  maxDailyHours: 10,

  // Repos minimum entre 2 journées (légal: 11h)
  minRestHours: 11
}
```

### Fichier: `assets/js/services/advancedWorkflows.js`

#### Délais de Traitement

Ajoutez des SLA (Service Level Agreements):

```javascript
LEAVE_REQUEST: {
  // ... configuration existante
  sla: {
    managerReviewHours: 24,    // Manager doit répondre en 24h
    hrValidationHours: 48,     // RH doit valider en 48h
    totalProcessingDays: 3     // Maximum 3 jours au total
  }
}
```

---

## 📱 Configuration Mobile

### 1. Permissions Requises

Pour l'application mobile, configurez les permissions suivantes:

**iOS (Info.plist):**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>L'app nécessite votre localisation pour le pointage</string>

<key>NSCameraUsageDescription</key>
<string>L'app nécessite l'appareil photo pour la reconnaissance faciale</string>

<key>NSFaceIDUsageDescription</key>
<string>L'app utilise Face ID pour le pointage sécurisé</string>
```

**Android (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
```

### 2. Configuration API Mobile

Fichier: `assets/js/services/mobileAPI.js`

```javascript
const mobileConfig = {
  // URL de l'API backend
  apiBaseUrl: 'https://votre-domaine.ma/api',

  // Authentification
  authType: 'JWT',  // ou 'OAuth2'
  tokenExpiry: 3600,  // secondes

  // Synchronisation
  syncInterval: 300,  // 5 minutes
  offlineMode: true,  // Mode hors ligne

  // Notifications Push
  pushNotifications: {
    enabled: true,
    provider: 'FCM',  // Firebase Cloud Messaging
    // ou 'APNS' pour iOS uniquement
  }
};
```

### 3. Configuration Notifications Push

**Firebase (FCM):**
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com)
2. Téléchargez `google-services.json` (Android) et `GoogleService-Info.plist` (iOS)
3. Configurez les clés serveur:

```javascript
const fcmConfig = {
  serverKey: 'VOTRE_CLE_SERVEUR_FCM',
  senderId: 'VOTRE_SENDER_ID',
  apiKey: 'VOTRE_API_KEY'
};
```

---

## 🧪 Tester Votre Configuration

### 1. Tests de Base

Ouvrez les fichiers de test:
- `tests/test-exports-cnss-ir.html` - Tests CNSS/IR
- `tests/test-pointage-gps.html` - Tests GPS
- `tests/test-workflows.html` - Tests Workflows (à venir)

### 2. Checklist de Validation

- [ ] Les coordonnées GPS de mes bureaux sont correctes
- [ ] Le rayon GPS est approprié pour chaque bureau
- [ ] Les horaires de travail correspondent à mon entreprise
- [ ] Les règles d'auto-approbation sont adaptées
- [ ] Les seuils de montants sont corrects
- [ ] Les informations CNSS/IR sont renseignées
- [ ] Les taux de cotisations sont à jour (2025)
- [ ] L'API mobile est configurée (si applicable)

### 3. Tests en Production

Avant le déploiement:

1. **Test GPS**: Testez le pointage depuis chaque bureau
2. **Test Workflows**: Créez des demandes de test
3. **Test CNSS/IR**: Générez une déclaration test
4. **Test Mobile**: Testez l'app sur plusieurs appareils

---

## 🆘 Support et Dépannage

### GPS ne fonctionne pas

1. Vérifiez que vous êtes en HTTPS
2. Autorisez la géolocalisation dans le navigateur
3. Vérifiez les coordonnées GPS (utilisez Google Maps)
4. Augmentez le rayon si trop strict

### Workflows ne s'approuvent pas automatiquement

1. Vérifiez les seuils (`daysThreshold`, `amountThreshold`)
2. Vérifiez que `autoApprovalRules` est bien configuré
3. Consultez la console JavaScript pour les erreurs

### Calculs CNSS/IR incorrects

1. Vérifiez les taux de cotisations (doivent être 2025)
2. Vérifiez le plafond CNSS (6000 MAD)
3. Vérifiez le barème IR
4. Testez avec les fichiers HTML de test

### Questions Fréquentes

**Q: Puis-je désactiver le GPS pour certains employés ?**
R: Oui, ajoutez une propriété `gpsRequired: false` dans le profil employé.

**Q: Comment changer la tolérance de retard ?**
R: Modifiez `graceMinutes` dans `advancedTimeTracking.js`.

**Q: Les taux CNSS vont-ils changer ?**
R: Oui, vérifiez chaque année sur le site de la CNSS et mettez à jour.

---

## 📞 Contacts Utiles

- **CNSS**: www.cnss.ma - 0801 00 22 77
- **DGI (IR)**: www.tax.gov.ma - 05 37 27 37 27
- **Code du Travail**: Consultez un juriste spécialisé

---

**Dernière mise à jour**: Janvier 2025
**Version**: 2.0
