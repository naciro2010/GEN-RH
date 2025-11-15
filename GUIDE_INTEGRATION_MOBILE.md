# 📱 Guide d'Intégration Mobile - Application RH

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Choix de la Technologie](#choix-de-la-technologie)
3. [Configuration React Native](#configuration-react-native)
4. [Configuration Flutter](#configuration-flutter)
5. [Intégration avec l'API](#intégration-avec-lapi)
6. [Fonctionnalités Natives](#fonctionnalités-natives)
7. [Notifications Push](#notifications-push)
8. [Sécurité](#sécurité)
9. [Déploiement](#déploiement)

---

## 🎯 Vue d'Ensemble

L'application RH dispose d'une **API mobile complète** déjà prête dans:
- `assets/js/services/mobileAPI.js`

Cette API permet:
- ✅ Authentification JWT
- ✅ Pointage GPS avec géolocalisation
- ✅ Reconnaissance faciale/biométrique
- ✅ Demandes de congés et workflows
- ✅ Consultation des bulletins de paie
- ✅ Notifications push
- ✅ Mode hors ligne avec synchronisation

---

## 🛠️ Choix de la Technologie

### Option 1: React Native (Recommandé)

**Avantages:**
- ✅ Code partagé iOS/Android
- ✅ Grande communauté
- ✅ Performance native
- ✅ Hot reload pour développement rapide
- ✅ Compatible avec notre code JavaScript existant

**Inconvénients:**
- ❌ Taille d'app plus grande
- ❌ Certaines features nécessitent du code natif

**Coût estimé:** 3-4 semaines de développement

### Option 2: Flutter

**Avantages:**
- ✅ Performance excellente
- ✅ UI magnifique out-of-the-box
- ✅ Code partagé iOS/Android
- ✅ Taille d'app plus petite

**Inconvénients:**
- ❌ Langage différent (Dart vs JavaScript)
- ❌ Moins de bibliothèques tierces

**Coût estimé:** 4-5 semaines de développement

### Option 3: Progressive Web App (PWA)

**Avantages:**
- ✅ Pas de stores (App Store / Play Store)
- ✅ Mises à jour instantanées
- ✅ Code web existant réutilisé
- ✅ Pas de développement natif

**Inconvénients:**
- ❌ Fonctionnalités natives limitées
- ❌ Performance moindre
- ❌ Pas de notifications push iOS

**Coût estimé:** 1-2 semaines d'adaptation

---

## ⚛️ Configuration React Native

### 1. Installation de l'Environnement

```bash
# Installer Node.js et npm (si pas déjà fait)
# Télécharger depuis https://nodejs.org

# Installer React Native CLI
npm install -g react-native-cli

# Créer le projet
npx react-native init AppRH

cd AppRH
```

### 2. Structure du Projet

```
AppRH/
├── android/               # Code Android natif
├── ios/                   # Code iOS natif
├── src/
│   ├── api/              # Intégration API
│   │   └── client.js     # Client API
│   ├── screens/          # Écrans de l'app
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── CheckInScreen.js
│   │   ├── LeavesScreen.js
│   │   └── PayslipScreen.js
│   ├── components/       # Composants réutilisables
│   │   ├── GPSButton.js
│   │   └── BiometricAuth.js
│   ├── services/         # Services métier
│   │   ├── gps.js
│   │   ├── biometric.js
│   │   └── storage.js
│   └── utils/            # Utilitaires
├── package.json
└── App.js               # Point d'entrée
```

### 3. Dépendances Essentielles

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Géolocalisation GPS
npm install react-native-geolocation-service

# Biométrie
npm install react-native-biometrics

# Appareil Photo (reconnaissance faciale)
npm install react-native-camera

# Stockage Local
npm install @react-native-async-storage/async-storage

# HTTP Client
npm install axios

# Notifications Push
npm install @react-native-firebase/app @react-native-firebase/messaging

# Date/Heure
npm install moment

# PDF Viewer (bulletins de paie)
npm install react-native-pdf
```

### 4. Configuration Permissions

#### iOS - `ios/AppRH/Info.plist`

```xml
<dict>
  <!-- Géolocalisation -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>L'application nécessite votre localisation pour le pointage</string>

  <key>NSLocationAlwaysUsageDescription</key>
  <string>Permet le pointage en arrière-plan</string>

  <!-- Appareil Photo -->
  <key>NSCameraUsageDescription</key>
  <string>Requis pour la reconnaissance faciale lors du pointage</string>

  <!-- Face ID -->
  <key>NSFaceIDUsageDescription</key>
  <string>Permet l'authentification sécurisée par Face ID</string>
</dict>
```

#### Android - `android/app/src/main/AndroidManifest.xml`

```xml
<manifest>
  <!-- Géolocalisation -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

  <!-- Appareil Photo -->
  <uses-permission android:name="android.permission.CAMERA" />

  <!-- Biométrie -->
  <uses-permission android:name="android.permission.USE_BIOMETRIC" />
  <uses-permission android:name="android.permission.USE_FINGERPRINT" />

  <!-- Internet -->
  <uses-permission android:name="android.permission.INTERNET" />

  <!-- Stockage -->
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
</manifest>
```

### 5. Exemple: Client API

**Fichier: `src/api/client.js`**

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://votre-domaine.ma/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentification
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { token, user } = response.data;
  await AsyncStorage.setItem('authToken', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return { token, user };
};

// Pointage
export const checkIn = async (gpsData, photo) => {
  const response = await apiClient.post('/attendance/checkin', {
    gps: gpsData,
    photo: photo,
    timestamp: new Date().toISOString(),
  });
  return response.data;
};

export const checkOut = async (checkInId, gpsData) => {
  const response = await apiClient.post('/attendance/checkout', {
    checkInId: checkInId,
    gps: gpsData,
    timestamp: new Date().toISOString(),
  });
  return response.data;
};

// Congés
export const getLeaves = async () => {
  const response = await apiClient.get('/leaves');
  return response.data;
};

export const requestLeave = async (leaveData) => {
  const response = await apiClient.post('/leaves/request', leaveData);
  return response.data;
};

// Bulletins de paie
export const getPayslips = async () => {
  const response = await apiClient.get('/payslips');
  return response.data;
};

export const downloadPayslip = async (payslipId) => {
  const response = await apiClient.get(`/payslips/${payslipId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

export default apiClient;
```

### 6. Exemple: Écran de Pointage

**Fichier: `src/screens/CheckInScreen.js`**

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeBiometrics from 'react-native-biometrics';
import { checkIn, checkOut } from '../api/client';

const CheckInScreen = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckInId, setCurrentCheckInId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      // 1. Obtenir la position GPS
      const gpsData = await getCurrentLocation();

      // 2. Authentification biométrique (optionnelle)
      const rnBiometrics = new ReactNativeBiometrics();
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirmez votre identité',
      });

      if (!success) {
        Alert.alert('Erreur', 'Authentification biométrique échouée');
        setLoading(false);
        return;
      }

      // 3. Envoyer le check-in
      const result = await checkIn(gpsData, null);

      if (result.validated) {
        setIsCheckedIn(true);
        setCurrentCheckInId(result.id);
        Alert.alert('Succès', 'Pointage d\'entrée enregistré!');
      } else {
        Alert.alert(
          'Attention',
          'Pointage enregistré mais nécessite une validation: ' +
            result.anomalies.map(a => a.message).join(', ')
        );
      }

    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible d\'effectuer le pointage');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const gpsData = await getCurrentLocation();
      const result = await checkOut(currentCheckInId, gpsData);

      setIsCheckedIn(false);
      setCurrentCheckInId(null);
      Alert.alert('Succès', 'Pointage de sortie enregistré!');

    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible d\'effectuer le pointage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pointage</Text>

      <TouchableOpacity
        style={[
          styles.button,
          isCheckedIn ? styles.checkOutButton : styles.checkInButton,
        ]}
        onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? 'Chargement...'
            : isCheckedIn
            ? '🔴 Pointer la Sortie'
            : '🔵 Pointer l\'Entrée'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        {isCheckedIn
          ? 'Vous êtes actuellement au travail'
          : 'Cliquez pour pointer votre arrivée'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  checkInButton: {
    backgroundColor: '#3498db',
  },
  checkOutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    marginTop: 30,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default CheckInScreen;
```

---

## 🦋 Configuration Flutter

### 1. Installation

```bash
# Télécharger Flutter SDK
# https://flutter.dev/docs/get-started/install

# Vérifier l'installation
flutter doctor

# Créer le projet
flutter create app_rh
cd app_rh
```

### 2. Dépendances

**Fichier: `pubspec.yaml`**

```yaml
dependencies:
  flutter:
    sdk: flutter

  # HTTP Client
  http: ^1.1.0
  dio: ^5.3.3

  # Stockage local
  shared_preferences: ^2.2.2
  sqflite: ^2.3.0

  # Géolocalisation
  geolocator: ^10.1.0
  permission_handler: ^11.0.1

  # Biométrie
  local_auth: ^2.1.7

  # Appareil photo
  camera: ^0.10.5
  image_picker: ^1.0.4

  # PDF Viewer
  flutter_pdfview: ^1.3.2

  # Notifications
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.6

  # État
  provider: ^6.1.1

  # Navigation
  go_router: ^12.1.1
```

### 3. Exemple: Service API Flutter

**Fichier: `lib/services/api_service.dart`**

```dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://votre-domaine.ma/api';
  late Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
    ));

    // Intercepteur pour JWT
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('authToken');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  // Authentification
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('authToken', response.data['token']);

    return response.data;
  }

  // Pointage
  Future<Map<String, dynamic>> checkIn(Map<String, dynamic> gpsData) async {
    final response = await _dio.post('/attendance/checkin', data: {
      'gps': gpsData,
      'timestamp': DateTime.now().toIso8601String(),
    });
    return response.data;
  }

  Future<Map<String, dynamic>> checkOut(String checkInId, Map<String, dynamic> gpsData) async {
    final response = await _dio.post('/attendance/checkout', data: {
      'checkInId': checkInId,
      'gps': gpsData,
      'timestamp': DateTime.now().toIso8601String(),
    });
    return response.data;
  }

  // Congés
  Future<List<dynamic>> getLeaves() async {
    final response = await _dio.get('/leaves');
    return response.data;
  }
}
```

---

## 🔗 Intégration avec l'API

### Configuration Backend

Créez un backend Node.js/Express ou PHP Laravel pour servir l'API mobile.

**Exemple: API Node.js/Express**

```javascript
// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Middleware JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Valider les credentials (à implémenter)
  // const user = await User.findByCredentials(email, password);

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user });
});

app.post('/api/attendance/checkin', authenticateToken, async (req, res) => {
  const { gps, photo, timestamp } = req.body;

  // Valider GPS
  // Sauvegarder en DB
  // Retourner le résultat

  res.json({
    id: 'checkin_123',
    validated: true,
    anomalies: [],
  });
});

app.listen(3000, () => {
  console.log('API Server running on port 3000');
});
```

---

## 📲 Notifications Push

### Configuration Firebase Cloud Messaging (FCM)

1. **Créer un projet Firebase**
   - Allez sur [Firebase Console](https://console.firebase.google.com)
   - Créez un nouveau projet "AppRH"

2. **Ajouter les apps iOS et Android**
   - Téléchargez `google-services.json` (Android)
   - Téléchargez `GoogleService-Info.plist` (iOS)

3. **Configuration React Native**

```javascript
// App.js
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Demander la permission
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken();
      }
    }

    // Obtenir le token FCM
    async function getFCMToken() {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      // Envoyer le token au serveur
      await apiClient.post('/users/fcm-token', { token: fcmToken });
    }

    // Écouter les notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification reçue!', remoteMessage);
      // Afficher une alerte locale
    });

    requestUserPermission();

    return unsubscribe;
  }, []);

  return <YourApp />;
}
```

4. **Envoyer des Notifications depuis le Backend**

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(fcmToken, title, body, data) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: data,
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification envoyée:', response);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exemple: Notifier une validation de congé
sendNotification(
  userFCMToken,
  'Congé approuvé',
  'Votre demande de congé a été approuvée par votre manager',
  { type: 'leave_approved', leaveId: '123' }
);
```

---

## 🔒 Sécurité

### 1. Authentification JWT

- ✅ Tokens avec expiration (7 jours recommandés)
- ✅ Refresh tokens pour renouvellement
- ✅ Stockage sécurisé (Keychain iOS, Keystore Android)

### 2. HTTPS Obligatoire

- ✅ Certificat SSL/TLS valide
- ✅ Certificate Pinning pour empêcher MITM

```javascript
// React Native - Certificate Pinning
import { NetworkInfo } from 'react-native-network-info';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Pinning SSL
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
    cert: fs.readFileSync('path/to/cert.pem'),
  }),
});
```

### 3. Chiffrement des Données Sensibles

```javascript
import CryptoJS from 'crypto-js';

const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

### 4. Validation Côté Serveur

- ✅ Toujours valider les données côté serveur
- ✅ Ne jamais faire confiance aux données du client
- ✅ Rate limiting pour éviter les abus

---

## 🚀 Déploiement

### iOS - App Store

1. **Créer un compte Apple Developer** (99$/an)
2. **Configurer Xcode**
3. **Créer les certificats et profils**
4. **Build et Archive**
5. **Upload vers App Store Connect**
6. **Soumettre pour review**

**Temps estimé:** 5-7 jours de review

### Android - Google Play Store

1. **Créer un compte Google Play Console** (25$ one-time)
2. **Générer un keystore de signature**
3. **Build APK/AAB**
4. **Upload vers Google Play Console**
5. **Soumettre pour review**

**Temps estimé:** 1-3 jours de review

### Distribution Interne (Beta Testing)

**TestFlight (iOS):**
- Gratuit
- Jusqu'à 10 000 testeurs
- Liens de téléchargement directs

**Google Play Internal Testing:**
- Gratuit
- Distribution instantanée
- Pas de review

---

## 📊 Checklist de Lancement

- [ ] API backend déployée et sécurisée (HTTPS)
- [ ] Base de données configurée
- [ ] Firebase/FCM configuré
- [ ] Tests sur plusieurs appareils (iOS et Android)
- [ ] Tests GPS dans tous les bureaux
- [ ] Tests de pointage en conditions réelles
- [ ] Tests de workflows complets
- [ ] Notifications push fonctionnelles
- [ ] Mode hors ligne testé
- [ ] Performances optimisées
- [ ] Sécurité validée (penetration testing)
- [ ] Privacy Policy et Terms of Service rédigés
- [ ] Screenshots et description pour les stores
- [ ] Support/FAQ préparé

---

## 💰 Estimation des Coûts

### Développement
- **React Native**: 15 000 - 25 000 MAD (développeur freelance)
- **Flutter**: 18 000 - 30 000 MAD
- **Agence**: 50 000 - 100 000 MAD

### Hébergement (mensuel)
- **VPS Backend**: 200 - 500 MAD/mois
- **Firebase**: Gratuit jusqu'à 10K utilisateurs
- **Nom de domaine**: 100 MAD/an
- **Certificat SSL**: Gratuit (Let's Encrypt)

### Stores
- **Apple Developer**: 99$/an ≈ 1000 MAD/an
- **Google Play**: 25$ one-time ≈ 250 MAD

### Total première année: 15 000 - 30 000 MAD

---

## 🆘 Support

Pour toute question sur l'intégration mobile, consultez:
- [React Native Docs](https://reactnative.dev)
- [Flutter Docs](https://flutter.dev)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Dernière mise à jour**: Janvier 2025
