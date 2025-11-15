# ✅ Checklist de Déploiement en Production

## 📋 Vue d'Ensemble

Ce document contient la liste complète de toutes les étapes à suivre avant de déployer l'application RH en production.

**Temps estimé total:** 2-4 semaines

---

## 🔧 1. Configuration Backend et Infrastructure

### 1.1 Base de Données

- [ ] **Choisir une base de données**
  - [ ] PostgreSQL (recommandé pour production)
  - [ ] MySQL/MariaDB
  - [ ] MongoDB (si NoSQL préféré)

- [ ] **Configuration de la base de données**
  - [ ] Créer la base de données
  - [ ] Configurer les utilisateurs et permissions
  - [ ] Créer les tables/collections
  - [ ] Définir les index pour performance
  - [ ] Configurer les backups automatiques (quotidiens)
  - [ ] Tester la restauration des backups

- [ ] **Migration des données**
  - [ ] Créer scripts de migration depuis localStorage
  - [ ] Mapper les données existantes
  - [ ] Tester la migration sur environnement de staging
  - [ ] Valider l'intégrité des données migrées

**Recommandation PostgreSQL:**
```sql
-- Exemple: Créer les tables principales
CREATE TABLE employees (
  id VARCHAR(50) PRIMARY KEY,
  matricule VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  cnss VARCHAR(15),
  cnie VARCHAR(20),
  role VARCHAR(20) DEFAULT 'employee',
  departement VARCHAR(100),
  salaire_base DECIMAL(10,2),
  date_embauche DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  id VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(50) REFERENCES employees(id),
  type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  gps_latitude DECIMAL(10,8),
  gps_longitude DECIMAL(11,8),
  gps_validated BOOLEAN DEFAULT false,
  validated BOOLEAN DEFAULT false,
  anomalies JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflows (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  initiator_id VARCHAR(50) REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'active',
  current_step VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payroll (
  id VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(50) REFERENCES employees(id),
  periode VARCHAR(7) NOT NULL, -- YYYY-MM
  salaire_brut DECIMAL(10,2),
  cotisations_cnss DECIMAL(10,2),
  ir DECIMAL(10,2),
  salaire_net DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_matricule ON employees(matricule);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, timestamp);
CREATE INDEX idx_workflows_initiator ON workflows(initiator_id, status);
CREATE INDEX idx_payroll_employee_periode ON payroll(employee_id, periode);
```

### 1.2 Serveur Backend

- [ ] **Choisir la technologie backend**
  - [ ] Node.js + Express (recommandé, compatible avec code existant)
  - [ ] PHP + Laravel
  - [ ] Python + Django/Flask
  - [ ] Ruby on Rails

- [ ] **Développer les APIs**
  - [ ] API d'authentification (JWT)
  - [ ] API de gestion des employés
  - [ ] API de pointage
  - [ ] API des workflows
  - [ ] API de paie
  - [ ] API des exports CNSS/IR
  - [ ] API mobile

- [ ] **Documentation API**
  - [ ] Documenter toutes les routes (Swagger/OpenAPI)
  - [ ] Exemples de requêtes/réponses
  - [ ] Codes d'erreur

### 1.3 Hébergement et Serveurs

- [ ] **Choisir un hébergeur**
  - [ ] VPS (OVH, DigitalOcean, AWS EC2, etc.)
  - [ ] Serveur dédié
  - [ ] Cloud (AWS, Google Cloud, Azure)

- [ ] **Configuration du serveur**
  - [ ] Installer le système d'exploitation (Ubuntu 22.04 LTS recommandé)
  - [ ] Configurer le firewall (UFW)
  - [ ] Installer Node.js/PHP/Python
  - [ ] Installer PostgreSQL/MySQL
  - [ ] Installer Nginx ou Apache
  - [ ] Configurer SSL/TLS (Let's Encrypt)

- [ ] **Sécurité serveur**
  - [ ] Désactiver login root SSH
  - [ ] Configurer SSH avec clés publiques
  - [ ] Installer fail2ban
  - [ ] Configurer les mises à jour automatiques
  - [ ] Installer un antivirus (ClamAV)

**Exemple: Configuration Nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.ma www.votre-domaine.ma;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.ma www.votre-domaine.ma;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.ma/privkey.pem;

    # Frontend
    location / {
        root /var/www/app-rh/;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 2. Sécurité

### 2.1 HTTPS et SSL/TLS

- [ ] **Certificat SSL**
  - [ ] Acheter un certificat SSL ou utiliser Let's Encrypt (gratuit)
  - [ ] Installer le certificat sur le serveur
  - [ ] Configurer le renouvellement automatique
  - [ ] Tester avec [SSL Labs](https://www.ssllabs.com/ssltest/)
  - [ ] Obtenir un score A ou A+

- [ ] **Configuration HTTPS stricte**
  - [ ] Rediriger tout le HTTP vers HTTPS
  - [ ] Activer HSTS (HTTP Strict Transport Security)
  - [ ] Configurer les en-têtes de sécurité

### 2.2 Authentification et Autorisation

- [ ] **Système d'authentification**
  - [ ] Implémenter JWT avec expiration
  - [ ] Implémenter refresh tokens
  - [ ] Hachage des mots de passe (bcrypt, argon2)
  - [ ] Politique de mots de passe forts
  - [ ] Protection contre les attaques brute force
  - [ ] 2FA/MFA (optionnel mais recommandé)

- [ ] **Gestion des rôles**
  - [ ] Définir les rôles: admin, hr, manager, employee
  - [ ] Implémenter les permissions par rôle
  - [ ] Tester tous les scénarios d'accès

### 2.3 Protection des Données

- [ ] **Chiffrement**
  - [ ] Chiffrer les données sensibles en DB (salaires, etc.)
  - [ ] Chiffrer les backups
  - [ ] Chiffrer les communications (HTTPS/TLS)

- [ ] **Conformité RGPD/Privacy**
  - [ ] Créer une Privacy Policy
  - [ ] Obtenir le consentement utilisateur
  - [ ] Permettre l'export des données personnelles
  - [ ] Permettre la suppression des données (droit à l'oubli)
  - [ ] Logs d'accès aux données sensibles

- [ ] **Sécurité fichiers uploads**
  - [ ] Valider les types de fichiers
  - [ ] Scanner les fichiers (antivirus)
  - [ ] Limiter la taille des uploads
  - [ ] Stocker hors du webroot

### 2.4 Tests de Sécurité

- [ ] **Tests de pénétration**
  - [ ] SQL Injection
  - [ ] XSS (Cross-Site Scripting)
  - [ ] CSRF (Cross-Site Request Forgery)
  - [ ] Injection de commandes
  - [ ] Directory traversal
  - [ ] Upload de fichiers malveillants

- [ ] **Outils de scan**
  - [ ] OWASP ZAP
  - [ ] Burp Suite
  - [ ] Nmap
  - [ ] SQLMap

---

## 🏢 3. Conformité Légale Marocaine

### 3.1 CNSS (Caisse Nationale de Sécurité Sociale)

- [ ] **Configuration CNSS**
  - [ ] Vérifier le numéro CNSS de l'entreprise
  - [ ] Configurer le numéro d'affiliation
  - [ ] Vérifier les taux de cotisations 2025
  - [ ] Tester le format Damancom

- [ ] **Télétransmission CNSS**
  - [ ] Obtenir les accès au portail CNSS (www.cnss.ma)
  - [ ] Tester l'upload de fichiers Damancom
  - [ ] Valider avec la CNSS (test en environnement de démo si disponible)

### 3.2 DGI (Direction Générale des Impôts)

- [ ] **Configuration IR**
  - [ ] Vérifier l'Identifiant Fiscal (IF)
  - [ ] Vérifier l'ICE (Identifiant Commun de l'Entreprise)
  - [ ] Vérifier le barème IR 2025
  - [ ] Tester le format SIMPL-IR XML

- [ ] **Télédéclaration DGI**
  - [ ] Obtenir les accès SIMPL (www.tax.gov.ma)
  - [ ] Tester l'upload de fichiers XML
  - [ ] Valider avec la DGI

### 3.3 Code du Travail

- [ ] **Conformité légale**
  - [ ] Vérifier les horaires de travail (max 10h/jour)
  - [ ] Vérifier le repos hebdomadaire (min 24h consécutives)
  - [ ] Vérifier les congés payés (18 jours/an après 6 mois)
  - [ ] Vérifier les bulletins de paie (mentions obligatoires)
  - [ ] Vérifier les certificats de travail

---

## 📊 4. Tests et Validation

### 4.1 Tests Fonctionnels

- [ ] **Module Employés**
  - [ ] Création d'employé
  - [ ] Modification d'employé
  - [ ] Suppression d'employé
  - [ ] Recherche et filtres
  - [ ] Import/Export CSV

- [ ] **Module Pointage**
  - [ ] Check-in avec GPS
  - [ ] Check-out avec GPS
  - [ ] Validation de périmètre
  - [ ] Détection de retards
  - [ ] Détection d'anomalies
  - [ ] Calcul d'heures travaillées
  - [ ] Calcul d'heures supplémentaires

- [ ] **Module Congés**
  - [ ] Demande de congé
  - [ ] Validation manager
  - [ ] Validation RH
  - [ ] Calcul solde de congés
  - [ ] Calendrier des congés

- [ ] **Module Paie**
  - [ ] Calcul du salaire brut
  - [ ] Calcul des cotisations CNSS
  - [ ] Calcul de l'IR
  - [ ] Calcul du net à payer
  - [ ] Génération bulletin de paie
  - [ ] Export CNSS (Damancom)
  - [ ] Export IR (SIMPL-IR)

- [ ] **Module Workflows**
  - [ ] Création de workflow
  - [ ] Approbation
  - [ ] Rejet
  - [ ] Auto-approbation
  - [ ] Notifications
  - [ ] Historique

### 4.2 Tests de Performance

- [ ] **Load Testing**
  - [ ] Test avec 10 utilisateurs simultanés
  - [ ] Test avec 50 utilisateurs simultanés
  - [ ] Test avec 100 utilisateurs simultanés
  - [ ] Temps de réponse < 2 secondes
  - [ ] Pas de fuite mémoire

- [ ] **Outils recommandés**
  - [ ] Apache JMeter
  - [ ] k6
  - [ ] Artillery

### 4.3 Tests de Compatibilité

- [ ] **Navigateurs**
  - [ ] Chrome/Edge (dernière version)
  - [ ] Firefox (dernière version)
  - [ ] Safari (si utilisateurs Mac/iOS)

- [ ] **Appareils**
  - [ ] Desktop (Windows, Mac, Linux)
  - [ ] Tablette (iPad, Android)
  - [ ] Mobile (iPhone, Android)

- [ ] **Résolutions d'écran**
  - [ ] 1920x1080 (Full HD)
  - [ ] 1366x768 (Laptop)
  - [ ] 768x1024 (Tablette)
  - [ ] 375x667 (Mobile)

---

## 📱 5. Application Mobile (si applicable)

- [ ] **Configuration**
  - [ ] Compléter le [Guide d'Intégration Mobile](GUIDE_INTEGRATION_MOBILE.md)
  - [ ] Tests sur iOS et Android
  - [ ] Soumission App Store
  - [ ] Soumission Google Play

---

## 🔔 6. Notifications et Communications

### 6.1 Emails

- [ ] **Configuration SMTP**
  - [ ] Choisir un service (SendGrid, Mailgun, AWS SES)
  - [ ] Configurer les credentials
  - [ ] Tester l'envoi d'emails

- [ ] **Templates d'emails**
  - [ ] Email de bienvenue
  - [ ] Réinitialisation mot de passe
  - [ ] Notification de congé approuvé/rejeté
  - [ ] Notification de workflow
  - [ ] Bulletin de paie mensuel

### 6.2 SMS (optionnel)

- [ ] **Service SMS**
  - [ ] Twilio, Vonage, ou service local marocain
  - [ ] Notifications urgentes
  - [ ] Codes OTP pour 2FA

---

## 📈 7. Monitoring et Logs

### 7.1 Logs

- [ ] **Système de logging**
  - [ ] Logs applicatifs (Winston, Bunyan pour Node.js)
  - [ ] Logs serveur (Nginx, Apache)
  - [ ] Logs base de données
  - [ ] Rotation des logs
  - [ ] Archivage des logs (min 1 an)

- [ ] **Logs à capturer**
  - [ ] Connexions/Déconnexions
  - [ ] Accès aux données sensibles
  - [ ] Erreurs et exceptions
  - [ ] Actions administratives
  - [ ] Exports CNSS/IR

### 7.2 Monitoring

- [ ] **Monitoring serveur**
  - [ ] CPU, RAM, Disk
  - [ ] Uptime
  - [ ] Alertes si serveur down

- [ ] **Monitoring applicatif**
  - [ ] Temps de réponse API
  - [ ] Taux d'erreur
  - [ ] Nombre de requêtes
  - [ ] Alertes si anomalies

- [ ] **Outils recommandés**
  - [ ] Prometheus + Grafana
  - [ ] New Relic
  - [ ] Datadog
  - [ ] UptimeRobot (gratuit pour monitoring basique)

---

## 💾 8. Backups et Disaster Recovery

### 8.1 Backups

- [ ] **Backup base de données**
  - [ ] Backups quotidiens automatisés
  - [ ] Backups hebdomadaires (complets)
  - [ ] Backups mensuels (archivés)
  - [ ] Stockage externe (S3, Google Cloud Storage)
  - [ ] Chiffrement des backups

- [ ] **Backup fichiers**
  - [ ] Fichiers uploadés (photos, documents)
  - [ ] Code source (Git)
  - [ ] Configuration serveur

- [ ] **Tests de restauration**
  - [ ] Tester la restauration mensuelle
  - [ ] Documenter la procédure
  - [ ] Chronométrer le temps de restauration

**Script exemple PostgreSQL:**
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="app_rh"

# Backup complet
pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Chiffrer
gpg --encrypt --recipient admin@votre-domaine.ma $BACKUP_DIR/backup_$DATE.sql.gz

# Upload vers S3 (optionnel)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz.gpg s3://your-bucket/backups/

# Nettoyer les anciens backups (garder 30 jours)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### 8.2 Plan de Disaster Recovery

- [ ] **Documenter le plan**
  - [ ] Procédure de restauration complète
  - [ ] Contacts d'urgence
  - [ ] RTO (Recovery Time Objective): combien de temps pour restaurer ?
  - [ ] RPO (Recovery Point Objective): combien de données peut-on perdre ?

- [ ] **Tester le plan**
  - [ ] Simulation de panne complète
  - [ ] Chronométrer la restauration
  - [ ] Valider l'intégrité des données

---

## 📚 9. Documentation

### 9.1 Documentation Technique

- [ ] **Architecture**
  - [ ] Diagramme d'architecture système
  - [ ] Schéma base de données
  - [ ] Flow des données

- [ ] **Documentation API**
  - [ ] Swagger/OpenAPI
  - [ ] Exemples de requêtes
  - [ ] Codes d'erreur

- [ ] **Guide de déploiement**
  - [ ] Procédure d'installation
  - [ ] Configuration serveur
  - [ ] Variables d'environnement

### 9.2 Documentation Utilisateur

- [ ] **Manuel utilisateur**
  - [ ] Guide employé
  - [ ] Guide manager
  - [ ] Guide RH/Admin

- [ ] **Tutoriels vidéo**
  - [ ] Comment pointer
  - [ ] Comment demander un congé
  - [ ] Comment consulter son bulletin

- [ ] **FAQ**
  - [ ] Questions fréquentes
  - [ ] Résolution de problèmes courants

---

## 👥 10. Formation et Support

### 10.1 Formation

- [ ] **Former les administrateurs**
  - [ ] Gestion des employés
  - [ ] Configuration du système
  - [ ] Génération de rapports
  - [ ] Exports CNSS/IR

- [ ] **Former les managers**
  - [ ] Validation des congés
  - [ ] Validation des workflows
  - [ ] Consultation des rapports d'équipe

- [ ] **Former les employés**
  - [ ] Pointage
  - [ ] Demandes de congés
  - [ ] Consultation bulletins

### 10.2 Support

- [ ] **Système de support**
  - [ ] Email support: support@votre-domaine.ma
  - [ ] Téléphone (heures de bureau)
  - [ ] Chatbot (optionnel)

- [ ] **SLA Support**
  - [ ] Problème critique: réponse en 1h
  - [ ] Problème majeur: réponse en 4h
  - [ ] Problème mineur: réponse en 24h

---

## 🚀 11. Mise en Production

### 11.1 Pré-lancement

- [ ] **Validation finale**
  - [ ] Revue de tous les tests
  - [ ] Validation par les utilisateurs clés
  - [ ] Validation juridique/RH
  - [ ] Validation IT/Sécurité

- [ ] **Migration des données**
  - [ ] Backup complet de l'existant
  - [ ] Migration des données
  - [ ] Vérification intégrité
  - [ ] Tests post-migration

### 11.2 Lancement

- [ ] **Communication**
  - [ ] Annoncer le lancement (email, réunion)
  - [ ] Expliquer les changements
  - [ ] Calendrier de migration

- [ ] **Déploiement progressif** (recommandé)
  - [ ] Phase 1: Département pilote (1 semaine)
  - [ ] Phase 2: 50% des utilisateurs (1 semaine)
  - [ ] Phase 3: Tous les utilisateurs

- [ ] **Monitoring intensif**
  - [ ] Surveiller les erreurs
  - [ ] Surveiller la charge serveur
  - [ ] Support renforcé pendant 1 mois

### 11.3 Post-lancement

- [ ] **Collecte de feedback**
  - [ ] Sondage utilisateurs
  - [ ] Réunions de retour
  - [ ] Analyse des logs d'utilisation

- [ ] **Optimisations**
  - [ ] Corriger les bugs remontés
  - [ ] Optimiser les performances
  - [ ] Améliorer l'UX

---

## 📊 12. KPIs et Succès

### Définir les KPIs

- [ ] **Adoption**
  - [ ] % d'utilisateurs actifs quotidiens
  - [ ] % de pointages GPS réussis
  - [ ] % de demandes via workflow vs manuel

- [ ] **Performance**
  - [ ] Temps de réponse moyen < 2s
  - [ ] Uptime > 99.5%
  - [ ] Taux d'erreur < 0.1%

- [ ] **Satisfaction**
  - [ ] NPS (Net Promoter Score) > 50
  - [ ] Satisfaction utilisateurs > 4/5
  - [ ] Nombre de tickets support < 10/mois

---

## ✅ Validation Finale

- [ ] Tous les tests passent ✅
- [ ] Sécurité validée ✅
- [ ] Performance validée ✅
- [ ] Documentation complète ✅
- [ ] Formation effectuée ✅
- [ ] Support en place ✅
- [ ] Backups configurés ✅
- [ ] Monitoring actif ✅

## 🎉 GO LIVE !

**Date de mise en production:** _______________

**Responsable du projet:** _______________

**Approbation finale:** _______________

---

## 📞 Contacts d'Urgence

**Support Technique:**
- Nom:
- Téléphone:
- Email:

**Administrateur Système:**
- Nom:
- Téléphone:
- Email:

**Responsable RH:**
- Nom:
- Téléphone:
- Email:

---

**Version:** 2.0
**Dernière mise à jour:** Janvier 2025
