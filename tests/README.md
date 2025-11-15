# 🧪 Tests des Nouvelles Fonctionnalités

Ce dossier contient des fichiers HTML interactifs pour tester toutes les fonctionnalités avancées de l'application RH.

## 📋 Fichiers de Test

### 1. test-exports-cnss-ir.html
**Test des Exports CNSS et IR**

Permet de tester:
- ✅ Génération de fichiers Damancom (CNSS)
- ✅ Génération de fichiers SIMPL-IR XML (DGI)
- ✅ Validation des formats officiels
- ✅ Calculs des cotisations sociales
- ✅ Calculs de l'impôt sur le revenu
- ✅ Tests de cas limites
- ✅ Flux complet de déclarations

**Comment utiliser:**
1. Ouvrez `test-exports-cnss-ir.html` dans votre navigateur
2. Configurez la période et le nombre d'employés
3. Cliquez sur les boutons de test
4. Les fichiers seront téléchargés automatiquement
5. Vérifiez les résultats dans la console

### 2. test-pointage-gps.html
**Test du Système de Pointage GPS**

Permet de tester:
- ✅ Géolocalisation en temps réel
- ✅ Validation des périmètres de bureaux
- ✅ Pointage d'entrée (check-in)
- ✅ Pointage de sortie (check-out)
- ✅ Détection d'anomalies (retards, départs anticipés)
- ✅ Calcul de statistiques
- ✅ Tests de permissions GPS

**Comment utiliser:**
1. Ouvrez `test-pointage-gps.html` dans votre navigateur
2. Autorisez la géolocalisation quand demandé
3. Testez les différents scénarios (check-in, check-out, etc.)
4. Vérifiez les validations GPS
5. Consultez les statistiques générées

**⚠️ Important:**
- Nécessite HTTPS ou localhost pour la géolocalisation
- Autorisez les permissions GPS dans votre navigateur

## 🚀 Démarrage Rapide

### Option 1: Serveur Local Simple

```bash
# Dans le dossier racine du projet
cd GEN-RH

# Python 3
python -m http.server 8000

# OU Python 2
python -m SimpleHTTPServer 8000

# OU Node.js
npx http-server
```

Puis ouvrez: http://localhost:8000/tests/

### Option 2: Live Server (VS Code)

1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur un fichier HTML → "Open with Live Server"

### Option 3: Directement dans le Navigateur

Double-cliquez simplement sur les fichiers HTML.

**⚠️ Limitation:** La géolocalisation GPS peut ne pas fonctionner en mode fichier local (file://). Utilisez un serveur HTTP pour les tests GPS.

## 📊 Scénarios de Test Recommandés

### Test 1: Exports CNSS (5 minutes)

1. Ouvrir `test-exports-cnss-ir.html`
2. Test 1: Générer un fichier Damancom avec 5 employés
3. Test 2: Vérifier le format du fichier
4. Test 3: Calculer les cotisations CNSS pour un salaire de 8000 MAD
5. Test 4: Télécharger les fichiers exemples

**Résultat attendu:**
- ✅ Fichier .txt généré et téléchargé
- ✅ Format tabulé correct
- ✅ Calculs conformes aux taux 2025

### Test 2: Exports IR (5 minutes)

1. Test 1: Générer un fichier SIMPL-IR XML
2. Test 2: Valider la structure XML
3. Test 3: Calculer l'IR pour différents salaires
4. Test 4: Tester le barème complet

**Résultat attendu:**
- ✅ Fichier .xml généré et téléchargé
- ✅ XML valide et bien formé
- ✅ Calculs IR conformes au barème 2025

### Test 3: Pointage GPS (10 minutes)

1. Ouvrir `test-pointage-gps.html`
2. Test 1: Obtenir votre position GPS actuelle
3. Test 2: Vérifier les permissions GPS
4. Test 3: Simuler une position GPS (bureau)
5. Test 4: Effectuer un check-in normal
6. Test 5: Effectuer un check-out normal
7. Test 6: Tester un check-in en retard
8. Test 7: Tester un check-in hors périmètre
9. Test 8: Calculer les statistiques

**Résultat attendu:**
- ✅ Position GPS détectée avec précision < 50m
- ✅ Validation de périmètre correcte
- ✅ Anomalies détectées (retards, GPS)
- ✅ Statistiques calculées correctement

### Test 4: Flux Complet (15 minutes)

1. **Exports CNSS/IR:**
   - Générer déclarations pour janvier 2025
   - Vérifier les totaux
   - Télécharger les fichiers

2. **Pointage GPS:**
   - Check-in le matin (8h30)
   - Check-out le soir (17h30)
   - Vérifier les heures travaillées

3. **Validation:**
   - Tous les fichiers téléchargés ✅
   - Toutes les validations passées ✅
   - Aucune erreur critique ❌

## 🔧 Configuration des Tests

### Modifier les Localisations GPS de Test

Dans `test-pointage-gps.html`, localisez:

```javascript
const officeLocations = [
  { name: 'Siège Casablanca', lat: 33.5731, lng: -7.5898, radius: 100 },
  // Ajoutez vos bureaux ici
];
```

### Modifier les Données d'Employés de Test

Dans `test-exports-cnss-ir.html`, localisez:

```javascript
const employeesTest = [
  {
    id: 'emp1',
    nom: 'ALAMI',
    prenom: 'Fatima',
    salaireBase: 8000,
    // ...
  },
  // Ajoutez des employés de test
];
```

### Modifier les Informations Entreprise

```javascript
const companyInfoTest = {
  nom: 'VOTRE SOCIÉTÉ',
  ice: '002345678901234',
  cnss: '1234567',
  // ...
};
```

## 🐛 Résolution de Problèmes

### GPS ne fonctionne pas

**Problème:** "Géolocalisation non disponible"

**Solutions:**
1. Vérifiez que vous êtes en HTTPS (ou localhost)
2. Autorisez la géolocalisation dans les paramètres du navigateur
3. Vérifiez que le GPS est activé sur votre appareil
4. Utilisez un serveur HTTP local (voir ci-dessus)

**Test rapide:**
```javascript
// Ouvrez la console navigateur (F12) et tapez:
navigator.geolocation.getCurrentPosition(
  pos => console.log('GPS OK:', pos.coords),
  err => console.error('GPS Error:', err)
);
```

### Fichiers ne se téléchargent pas

**Problème:** Les boutons de téléchargement ne fonctionnent pas

**Solutions:**
1. Vérifiez la console pour les erreurs (F12)
2. Désactivez les bloqueurs de popup
3. Autorisez les téléchargements multiples
4. Testez dans un autre navigateur

### Erreurs dans la Console

**Problème:** "Module not found" ou erreurs d'import

**Solutions:**
1. Vérifiez que vous utilisez un serveur HTTP (pas file://)
2. Vérifiez les chemins des imports (doivent pointer vers ../assets/js/services/)
3. Assurez-vous que tous les fichiers sont présents

## 📈 Résultats Attendus

### ✅ Tests Réussis

Vous devriez voir:
- Messages de succès en vert ✅
- Fichiers téléchargés
- Aucune erreur dans la console
- Validations qui passent

### ⚠️ Avertissements Normaux

Certains avertissements sont normaux:
- Retards détectés (si test de retard)
- GPS hors périmètre (si test hors zone)
- Anomalies volontaires (tests de cas limites)

### ❌ Erreurs à Corriger

Erreurs qui nécessitent attention:
- Erreurs JavaScript dans la console
- Calculs incorrects (CNSS, IR)
- Fichiers non générés
- GPS toujours refusé

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifiez la console** (F12 → Console)
2. **Consultez les guides:**
   - [Guide de Configuration](../GUIDE_CONFIGURATION.md)
   - [Guide Intégration Mobile](../GUIDE_INTEGRATION_MOBILE.md)
   - [Production Checklist](../PRODUCTION_CHECKLIST.md)

3. **Créez un issue GitHub** avec:
   - Description du problème
   - Navigateur et version
   - Messages d'erreur (console)
   - Étapes pour reproduire

## 🎯 Prochaines Étapes

Après avoir testé avec succès:

1. ✅ Configurez vos vraies localisations GPS (voir [Guide de Configuration](../GUIDE_CONFIGURATION.md))
2. ✅ Ajustez les règles d'auto-approbation des workflows
3. ✅ Personnalisez les seuils et limites
4. ✅ Préparez l'intégration mobile (voir [Guide Mobile](../GUIDE_INTEGRATION_MOBILE.md))
5. ✅ Suivez la [Production Checklist](../PRODUCTION_CHECKLIST.md) pour déployer

## 📚 Ressources Complémentaires

- [CNSS - Télédéclaration](https://www.cnss.ma)
- [DGI - SIMPL](https://www.tax.gov.ma)
- [Code du Travail Marocain](http://www.emploi.gov.ma)

---

**Version:** 2.0
**Dernière mise à jour:** Janvier 2025
