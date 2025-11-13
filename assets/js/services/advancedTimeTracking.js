/**
 * Service de Pointage Avancé
 * Gestion du pointage avec GPS, biométrie, reconnaissance faciale et mobile
 */

import { formatDate, showToast } from './utils.js';

/**
 * Configuration du système de pointage
 */
export const timeTrackingConfig = {
  // Validation GPS
  gps: {
    enabled: true,
    requiredForCheckIn: true,
    requiredForCheckOut: true,
    maxDistanceMeters: 100, // Distance maximale autorisée du bureau
    officeLocations: [
      { name: 'Siège Casablanca', lat: 33.5731, lng: -7.5898, radius: 100 },
      { name: 'Agence Rabat', lat: 34.0209, lng: -6.8416, radius: 100 },
      { name: 'Agence Marrakech', lat: 31.6295, lng: -7.9811, radius: 100 }
    ]
  },

  // Biométrie
  biometric: {
    enabled: true,
    types: ['fingerprint', 'face', 'iris'],
    requiredForCheckIn: false,
    requiredForCheckOut: false,
    fallbackToPin: true
  },

  // Reconnaissance faciale
  faceRecognition: {
    enabled: true,
    confidenceThreshold: 0.85, // Seuil de confiance minimal
    livenessDetection: true, // Détection de vivacité (anti-spoofing)
    maxAttempts: 3
  },

  // Horaires
  schedule: {
    workDayStart: '08:00',
    workDayEnd: '17:00',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    graceMinutes: 15, // Tolérance de retard
    overtimeThreshold: 480 // Minutes (8 heures)
  },

  // Règles
  rules: {
    maxConsecutiveWorkDays: 6,
    minRestHours: 11, // Entre deux journées
    maxDailyHours: 10,
    requireCheckOutSameDay: true,
    autoCheckOutAfterHours: 12 // Auto-checkout après 12h sans checkout
  }
};

/**
 * Vérifie si l'employé est dans le périmètre autorisé
 */
export const validateGPSLocation = (latitude, longitude, officeLocations = timeTrackingConfig.gps.officeLocations) => {
  if (!timeTrackingConfig.gps.enabled) {
    return { valid: true, message: 'GPS désactivé' };
  }

  for (const office of officeLocations) {
    const distance = calculateDistance(latitude, longitude, office.lat, office.lng);
    if (distance <= office.radius) {
      return {
        valid: true,
        location: office.name,
        distance: Math.round(distance),
        message: `Pointage autorisé depuis ${office.name}`
      };
    }
  }

  // Trouver le bureau le plus proche
  const closest = officeLocations.reduce((prev, curr) => {
    const distPrev = calculateDistance(latitude, longitude, prev.lat, prev.lng);
    const distCurr = calculateDistance(latitude, longitude, curr.lat, curr.lng);
    return distCurr < distPrev ? curr : prev;
  });

  const closestDistance = calculateDistance(latitude, longitude, closest.lat, closest.lng);

  return {
    valid: false,
    closestLocation: closest.name,
    distance: Math.round(closestDistance),
    message: `Vous êtes à ${Math.round(closestDistance)}m de ${closest.name}. Distance max autorisée: ${closest.radius}m`
  };
};

/**
 * Calcule la distance entre deux coordonnées GPS (formule de Haversine)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Effectue un pointage d'entrée
 */
export const checkIn = async (employeeId, options = {}) => {
  const timestamp = new Date();
  const checkInData = {
    id: `ci_${employeeId}_${timestamp.getTime()}`,
    employeeId: employeeId,
    type: 'CHECK_IN',
    timestamp: timestamp.toISOString(),
    date: timestamp.toISOString().split('T')[0],
    time: timestamp.toTimeString().split(' ')[0],

    // Localisation GPS
    gps: options.gps ? {
      latitude: options.gps.latitude,
      longitude: options.gps.longitude,
      accuracy: options.gps.accuracy,
      altitude: options.gps.altitude,
      validated: false,
      location: null
    } : null,

    // Biométrie
    biometric: options.biometric ? {
      type: options.biometric.type, // fingerprint, face, iris
      confidence: options.biometric.confidence,
      deviceId: options.biometric.deviceId,
      validated: false
    } : null,

    // Photo de pointage (reconnaissance faciale)
    photo: options.photo ? {
      dataUrl: options.photo.dataUrl,
      confidence: options.photo.confidence,
      livenessScore: options.photo.livenessScore,
      validated: false
    } : null,

    // Appareil
    device: {
      type: options.device?.type || 'web', // web, mobile, terminal
      model: options.device?.model || navigator.userAgent,
      os: options.device?.os || detectOS(),
      ip: options.device?.ip || 'unknown',
      imei: options.device?.imei || null
    },

    // Validation
    validated: false,
    validatedBy: null,
    validatedAt: null,
    notes: options.notes || '',

    // Anomalies détectées
    anomalies: []
  };

  // Validation GPS
  if (checkInData.gps && timeTrackingConfig.gps.enabled) {
    const gpsValidation = validateGPSLocation(
      checkInData.gps.latitude,
      checkInData.gps.longitude
    );
    checkInData.gps.validated = gpsValidation.valid;
    checkInData.gps.location = gpsValidation.location;

    if (!gpsValidation.valid) {
      checkInData.anomalies.push({
        type: 'GPS_OUT_OF_RANGE',
        message: gpsValidation.message,
        severity: 'warning'
      });
    }
  } else if (timeTrackingConfig.gps.requiredForCheckIn) {
    checkInData.anomalies.push({
      type: 'GPS_MISSING',
      message: 'Localisation GPS requise mais non fournie',
      severity: 'error'
    });
  }

  // Validation biométrique
  if (checkInData.biometric) {
    checkInData.biometric.validated = checkInData.biometric.confidence >= 0.9;
    if (!checkInData.biometric.validated) {
      checkInData.anomalies.push({
        type: 'BIOMETRIC_LOW_CONFIDENCE',
        message: `Confiance biométrique faible: ${(checkInData.biometric.confidence * 100).toFixed(0)}%`,
        severity: 'warning'
      });
    }
  }

  // Validation reconnaissance faciale
  if (checkInData.photo) {
    const faceConfig = timeTrackingConfig.faceRecognition;
    checkInData.photo.validated =
      checkInData.photo.confidence >= faceConfig.confidenceThreshold &&
      (!faceConfig.livenessDetection || checkInData.photo.livenessScore >= 0.8);

    if (!checkInData.photo.validated) {
      checkInData.anomalies.push({
        type: 'FACE_RECOGNITION_FAILED',
        message: 'La reconnaissance faciale n\'a pas réussi',
        severity: 'warning'
      });
    }
  }

  // Vérifier les horaires (retard, etc.)
  const scheduleCheck = checkScheduleCompliance(timestamp, 'CHECK_IN');
  if (!scheduleCheck.compliant) {
    checkInData.anomalies.push(...scheduleCheck.anomalies);
  }

  // Auto-validation si toutes les vérifications passent
  checkInData.validated = checkInData.anomalies.filter(a => a.severity === 'error').length === 0;

  return checkInData;
};

/**
 * Effectue un pointage de sortie
 */
export const checkOut = async (employeeId, checkInId, options = {}) => {
  const timestamp = new Date();
  const checkOutData = {
    id: `co_${employeeId}_${timestamp.getTime()}`,
    checkInId: checkInId,
    employeeId: employeeId,
    type: 'CHECK_OUT',
    timestamp: timestamp.toISOString(),
    date: timestamp.toISOString().split('T')[0],
    time: timestamp.toTimeString().split(' ')[0],

    gps: options.gps ? {
      latitude: options.gps.latitude,
      longitude: options.gps.longitude,
      accuracy: options.gps.accuracy,
      validated: false
    } : null,

    biometric: options.biometric ? {
      type: options.biometric.type,
      confidence: options.biometric.confidence,
      validated: false
    } : null,

    device: {
      type: options.device?.type || 'web',
      model: options.device?.model || navigator.userAgent,
      os: options.device?.os || detectOS(),
      ip: options.device?.ip || 'unknown'
    },

    validated: false,
    notes: options.notes || '',
    anomalies: []
  };

  // Validation GPS
  if (checkOutData.gps && timeTrackingConfig.gps.enabled) {
    const gpsValidation = validateGPSLocation(
      checkOutData.gps.latitude,
      checkOutData.gps.longitude
    );
    checkOutData.gps.validated = gpsValidation.valid;

    if (!gpsValidation.valid) {
      checkOutData.anomalies.push({
        type: 'GPS_OUT_OF_RANGE',
        message: gpsValidation.message,
        severity: 'warning'
      });
    }
  }

  // Vérifier les horaires
  const scheduleCheck = checkScheduleCompliance(timestamp, 'CHECK_OUT');
  if (!scheduleCheck.compliant) {
    checkOutData.anomalies.push(...scheduleCheck.anomalies);
  }

  checkOutData.validated = checkOutData.anomalies.filter(a => a.severity === 'error').length === 0;

  return checkOutData;
};

/**
 * Vérifie la conformité avec les horaires
 */
function checkScheduleCompliance(timestamp, type) {
  const config = timeTrackingConfig.schedule;
  const time = timestamp.toTimeString().split(' ')[0]; // HH:MM:SS
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  const anomalies = [];
  let compliant = true;

  if (type === 'CHECK_IN') {
    const [startHours, startMinutes] = config.workDayStart.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const lateMinutes = totalMinutes - startTotalMinutes - config.graceMinutes;

    if (lateMinutes > 0) {
      anomalies.push({
        type: 'LATE_ARRIVAL',
        message: `Retard de ${lateMinutes} minutes`,
        severity: lateMinutes > 30 ? 'error' : 'warning',
        minutes: lateMinutes
      });
      compliant = false;
    } else if (totalMinutes < startTotalMinutes - 60) {
      anomalies.push({
        type: 'EARLY_ARRIVAL',
        message: `Arrivée anticipée de ${Math.abs(totalMinutes - startTotalMinutes)} minutes`,
        severity: 'info',
        minutes: Math.abs(totalMinutes - startTotalMinutes)
      });
    }
  } else if (type === 'CHECK_OUT') {
    const [endHours, endMinutes] = config.workDayEnd.split(':').map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;
    const earlyMinutes = endTotalMinutes - totalMinutes;

    if (earlyMinutes > config.graceMinutes) {
      anomalies.push({
        type: 'EARLY_DEPARTURE',
        message: `Départ anticipé de ${earlyMinutes} minutes`,
        severity: 'warning',
        minutes: earlyMinutes
      });
      compliant = false;
    } else if (totalMinutes > endTotalMinutes + 60) {
      const overtimeMinutes = totalMinutes - endTotalMinutes;
      anomalies.push({
        type: 'OVERTIME',
        message: `Heures supplémentaires: ${Math.floor(overtimeMinutes / 60)}h${overtimeMinutes % 60}`,
        severity: 'info',
        minutes: overtimeMinutes
      });
    }
  }

  return { compliant, anomalies };
}

/**
 * Calcule les statistiques de pointage pour une période
 */
export const calculateTimeStats = (attendanceRecords, startDate, endDate) => {
  const records = attendanceRecords.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const stats = {
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    earlyDepartures: 0,
    totalHoursWorked: 0,
    totalOvertimeMinutes: 0,
    averageArrivalTime: null,
    averageDepartureTime: null,
    anomalies: {
      total: 0,
      byType: {}
    }
  };

  // Grouper par date
  const byDate = records.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {});

  Object.entries(byDate).forEach(([date, dayRecords]) => {
    stats.totalDays++;

    const checkIn = dayRecords.find(r => r.type === 'CHECK_IN');
    const checkOut = dayRecords.find(r => r.type === 'CHECK_OUT');

    if (checkIn) {
      stats.presentDays++;

      // Vérifier les retards
      if (checkIn.anomalies?.some(a => a.type === 'LATE_ARRIVAL')) {
        stats.lateDays++;
      }

      // Calculer les heures travaillées
      if (checkOut) {
        const checkInTime = new Date(checkIn.timestamp);
        const checkOutTime = new Date(checkOut.timestamp);
        const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        stats.totalHoursWorked += hoursWorked;

        // Vérifier départs anticipés
        if (checkOut.anomalies?.some(a => a.type === 'EARLY_DEPARTURE')) {
          stats.earlyDepartures++;
        }

        // Calculer heures sup
        const overtimeAnomaly = checkOut.anomalies?.find(a => a.type === 'OVERTIME');
        if (overtimeAnomaly) {
          stats.totalOvertimeMinutes += overtimeAnomaly.minutes || 0;
        }
      }

      // Compter les anomalies
      [...(checkIn.anomalies || []), ...(checkOut?.anomalies || [])].forEach(anomaly => {
        stats.anomalies.total++;
        stats.anomalies.byType[anomaly.type] = (stats.anomalies.byType[anomaly.type] || 0) + 1;
      });
    } else {
      stats.absentDays++;
    }
  });

  // Calculer les moyennes
  if (stats.presentDays > 0) {
    stats.averageHoursPerDay = stats.totalHoursWorked / stats.presentDays;
  }

  return stats;
};

/**
 * Détecte le système d'exploitation
 */
function detectOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Win') !== -1) return 'Windows';
  if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
  if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  if (userAgent.indexOf('Android') !== -1) return 'Android';
  if (userAgent.indexOf('iOS') !== -1) return 'iOS';
  return 'Unknown';
}

/**
 * Interface pour la capture photo/vidéo (reconnaissance faciale)
 */
export const captureFacePhoto = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      reject(new Error('La caméra n\'est pas disponible sur cet appareil'));
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Attendre que la vidéo soit prête
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);

          // Arrêter le stream
          stream.getTracks().forEach(track => track.stop());

          // Simuler une analyse de reconnaissance faciale
          const confidence = 0.85 + Math.random() * 0.14; // 85-99%
          const livenessScore = 0.8 + Math.random() * 0.19; // 80-99%

          resolve({
            dataUrl: canvas.toDataURL('image/jpeg', 0.8),
            confidence: confidence,
            livenessScore: livenessScore,
            timestamp: new Date().toISOString()
          });
        });
      })
      .catch(error => {
        reject(new Error(`Erreur d'accès à la caméra: ${error.message}`));
      });
  });
};

/**
 * Interface pour la géolocalisation
 */
export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas disponible sur cet appareil'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: new Date(position.timestamp).toISOString()
        });
      },
      error => {
        reject(new Error(`Erreur de géolocalisation: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export default {
  timeTrackingConfig,
  validateGPSLocation,
  checkIn,
  checkOut,
  calculateTimeStats,
  captureFacePhoto,
  getCurrentLocation
};
