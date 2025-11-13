/**
 * API Mobile pour Atlas HR Suite
 * Endpoints REST simulés pour applications mobiles (iOS/Android)
 * En production, ces endpoints seraient sur un serveur backend
 */

import { getData, setData } from '../data/store.js';
import { checkIn, checkOut, getCurrentLocation, captureFacePhoto } from './advancedTimeTracking.js';
import { simulatePayroll } from './payroll.js';

/**
 * Configuration de l'API
 */
export const API_CONFIG = {
  version: '1.0.0',
  baseUrl: '/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  authType: 'JWT',

  // Endpoints disponibles
  endpoints: {
    // Authentification
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    resetPassword: '/auth/reset-password',

    // Employé
    getProfile: '/employee/profile',
    updateProfile: '/employee/profile',
    getDocuments: '/employee/documents',

    // Pointage
    checkIn: '/attendance/check-in',
    checkOut: '/attendance/check-out',
    getAttendanceHistory: '/attendance/history',
    getAttendanceStats: '/attendance/stats',

    // Congés
    getLeaves: '/leaves',
    requestLeave: '/leaves/request',
    cancelLeave: '/leaves/:id/cancel',
    getLeaveBalance: '/leaves/balance',

    // Paie
    getPayslips: '/payroll/payslips',
    getPayslipDetail: '/payroll/payslips/:id',
    downloadPayslip: '/payroll/payslips/:id/download',

    // Demandes
    getRequests: '/requests',
    createRequest: '/requests',
    updateRequest: '/requests/:id',

    // Notifications
    getNotifications: '/notifications',
    markAsRead: '/notifications/:id/read',

    // Équipe (pour managers)
    getTeam: '/team',
    getTeamAttendance: '/team/attendance',
    approveLeave: '/team/leaves/:id/approve',
    rejectLeave: '/team/leaves/:id/reject'
  }
};

/**
 * Classe pour gérer les requêtes API
 */
class MobileAPIClient {
  constructor() {
    this.authToken = null;
    this.refreshToken = null;
    this.user = null;
  }

  /**
   * Authentification
   */
  async login(credentials) {
    const { username, password, deviceId, deviceToken } = credentials;

    // Simulation d'authentification (en production, vérifier côté serveur)
    const data = getData();
    const employee = data.employees.find(e =>
      e.email === username || e.matricule === username
    );

    if (!employee) {
      throw new APIError('Identifiants invalides', 401);
    }

    // Générer des tokens JWT (simulation)
    const authToken = this.generateToken(employee.id, '24h');
    const refreshToken = this.generateToken(employee.id, '30d');

    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.user = {
      id: employee.id,
      matricule: employee.matricule,
      nom: `${employee.prenom} ${employee.nom}`,
      email: employee.email,
      poste: employee.poste,
      departement: employee.departement,
      photo: employee.photo,
      role: employee.role || 'employee',
      permissions: this.getPermissions(employee.role)
    };

    // Enregistrer le device pour les notifications push
    if (deviceId && deviceToken) {
      this.registerDevice(employee.id, deviceId, deviceToken);
    }

    return {
      success: true,
      data: {
        user: this.user,
        authToken: authToken,
        refreshToken: refreshToken,
        expiresIn: 86400 // 24h en secondes
      }
    };
  }

  /**
   * Déconnexion
   */
  async logout() {
    this.authToken = null;
    this.refreshToken = null;
    this.user = null;
    return { success: true, message: 'Déconnexion réussie' };
  }

  /**
   * Rafraîchir le token
   */
  async refreshAuthToken(refreshToken) {
    if (!refreshToken) {
      throw new APIError('Refresh token manquant', 401);
    }

    // Vérifier et générer un nouveau token
    const newAuthToken = this.generateToken(this.user.id, '24h');
    this.authToken = newAuthToken;

    return {
      success: true,
      data: {
        authToken: newAuthToken,
        expiresIn: 86400
      }
    };
  }

  /**
   * Obtenir le profil de l'employé
   */
  async getProfile() {
    this.ensureAuthenticated();

    const data = getData();
    const employee = data.employees.find(e => e.id === this.user.id);

    if (!employee) {
      throw new APIError('Employé non trouvé', 404);
    }

    return {
      success: true,
      data: {
        ...employee,
        balanceConges: this.calculateLeaveBalance(employee.id, data.absences),
        attestations: data.documents?.filter(d => d.employeeId === employee.id) || []
      }
    };
  }

  /**
   * Pointage d'entrée (mobile)
   */
  async mobileCheckIn(options = {}) {
    this.ensureAuthenticated();

    try {
      // Obtenir la géolocalisation
      let gpsData = null;
      if (options.enableGPS !== false) {
        try {
          gpsData = await getCurrentLocation();
        } catch (error) {
          console.warn('GPS non disponible:', error);
        }
      }

      // Capturer la photo (reconnaissance faciale)
      let photoData = null;
      if (options.enableFaceRecognition) {
        try {
          photoData = await captureFacePhoto();
        } catch (error) {
          console.warn('Photo non disponible:', error);
        }
      }

      // Effectuer le pointage
      const checkInData = await checkIn(this.user.id, {
        gps: gpsData,
        photo: photoData,
        biometric: options.biometric,
        device: {
          type: 'mobile',
          model: options.deviceModel,
          os: options.deviceOS,
          imei: options.deviceIMEI
        },
        notes: options.notes
      });

      // Sauvegarder dans le store
      const data = getData();
      if (!data.attendance) data.attendance = [];
      data.attendance.push(checkInData);
      setData(data);

      return {
        success: true,
        data: checkInData,
        message: checkInData.validated
          ? 'Pointage d\'entrée enregistré avec succès'
          : 'Pointage enregistré mais nécessite une validation'
      };
    } catch (error) {
      throw new APIError(`Erreur lors du pointage: ${error.message}`, 500);
    }
  }

  /**
   * Pointage de sortie (mobile)
   */
  async mobileCheckOut(checkInId, options = {}) {
    this.ensureAuthenticated();

    try {
      // Obtenir la géolocalisation
      let gpsData = null;
      if (options.enableGPS !== false) {
        try {
          gpsData = await getCurrentLocation();
        } catch (error) {
          console.warn('GPS non disponible:', error);
        }
      }

      // Effectuer le pointage de sortie
      const checkOutData = await checkOut(this.user.id, checkInId, {
        gps: gpsData,
        biometric: options.biometric,
        device: {
          type: 'mobile',
          model: options.deviceModel,
          os: options.deviceOS
        },
        notes: options.notes
      });

      // Sauvegarder
      const data = getData();
      if (!data.attendance) data.attendance = [];
      data.attendance.push(checkOutData);
      setData(data);

      return {
        success: true,
        data: checkOutData,
        message: 'Pointage de sortie enregistré avec succès'
      };
    } catch (error) {
      throw new APIError(`Erreur lors du pointage: ${error.message}`, 500);
    }
  }

  /**
   * Obtenir l'historique de pointage
   */
  async getAttendanceHistory(startDate, endDate, limit = 30) {
    this.ensureAuthenticated();

    const data = getData();
    const attendance = data.attendance || [];

    let records = attendance.filter(r => r.employeeId === this.user.id);

    if (startDate) {
      records = records.filter(r => new Date(r.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      records = records.filter(r => new Date(r.timestamp) <= new Date(endDate));
    }

    records = records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    records = records.slice(0, limit);

    return {
      success: true,
      data: records,
      total: records.length
    };
  }

  /**
   * Demander un congé
   */
  async requestLeave(leaveRequest) {
    this.ensureAuthenticated();

    const newLeave = {
      id: `leave_${Date.now()}`,
      employeeId: this.user.id,
      type: leaveRequest.type,
      dateDebut: leaveRequest.startDate,
      dateFin: leaveRequest.endDate,
      nbJours: leaveRequest.days,
      motif: leaveRequest.reason,
      statut: 'En attente',
      dateCreation: new Date().toISOString(),
      documents: leaveRequest.documents || []
    };

    const data = getData();
    if (!data.absences) data.absences = [];
    data.absences.push(newLeave);
    setData(data);

    // Créer une notification pour le manager
    this.createNotification(
      this.getManagerId(this.user.id),
      'leave_request',
      `${this.user.nom} a demandé un congé`,
      { leaveId: newLeave.id }
    );

    return {
      success: true,
      data: newLeave,
      message: 'Demande de congé envoyée avec succès'
    };
  }

  /**
   * Obtenir les bulletins de paie
   */
  async getPayslips(year, month) {
    this.ensureAuthenticated();

    const data = getData();
    const payslips = data.bulletinsPaie || [];

    let filtered = payslips.filter(p => p.employeeId === this.user.id);

    if (year) {
      filtered = filtered.filter(p => {
        const [pYear] = p.periode.split('-');
        return parseInt(pYear) === year;
      });
    }

    if (month) {
      filtered = filtered.filter(p => {
        const [, pMonth] = p.periode.split('-');
        return parseInt(pMonth) === month;
      });
    }

    return {
      success: true,
      data: filtered.sort((a, b) => b.periode.localeCompare(a.periode))
    };
  }

  /**
   * Obtenir les notifications
   */
  async getNotifications(unreadOnly = false) {
    this.ensureAuthenticated();

    const data = getData();
    const notifications = data.notifications || [];

    let filtered = notifications.filter(n => n.userId === this.user.id);

    if (unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    return {
      success: true,
      data: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      unreadCount: filtered.filter(n => !n.read).length
    };
  }

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(notificationId) {
    this.ensureAuthenticated();

    const data = getData();
    const notification = data.notifications?.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
      setData(data);
    }

    return { success: true };
  }

  /**
   * Obtenir les documents de l'employé
   */
  async getDocuments(type = null) {
    this.ensureAuthenticated();

    const data = getData();
    let documents = data.documents?.filter(d => d.employeeId === this.user.id) || [];

    if (type) {
      documents = documents.filter(d => d.type === type);
    }

    return {
      success: true,
      data: documents
    };
  }

  /**
   * Pour les managers: obtenir l'équipe
   */
  async getTeam() {
    this.ensureAuthenticated();
    this.ensureManager();

    const data = getData();
    const team = data.employees.filter(e => e.managerId === this.user.id);

    return {
      success: true,
      data: team
    };
  }

  /**
   * Pour les managers: obtenir le pointage de l'équipe
   */
  async getTeamAttendance(date = new Date().toISOString().split('T')[0]) {
    this.ensureAuthenticated();
    this.ensureManager();

    const data = getData();
    const team = data.employees.filter(e => e.managerId === this.user.id);
    const attendance = data.attendance || [];

    const teamAttendance = team.map(emp => {
      const empRecords = attendance.filter(a =>
        a.employeeId === emp.id && a.date === date
      );

      const checkIn = empRecords.find(r => r.type === 'CHECK_IN');
      const checkOut = empRecords.find(r => r.type === 'CHECK_OUT');

      return {
        employee: {
          id: emp.id,
          nom: `${emp.prenom} ${emp.nom}`,
          poste: emp.poste,
          photo: emp.photo
        },
        status: checkIn ? (checkOut ? 'completed' : 'present') : 'absent',
        checkIn: checkIn,
        checkOut: checkOut
      };
    });

    return {
      success: true,
      data: teamAttendance,
      date: date
    };
  }

  /**
   * Pour les managers: approuver un congé
   */
  async approveLeave(leaveId, comments = '') {
    this.ensureAuthenticated();
    this.ensureManager();

    const data = getData();
    const leave = data.absences?.find(l => l.id === leaveId);

    if (!leave) {
      throw new APIError('Congé non trouvé', 404);
    }

    leave.statut = 'Approuvé';
    leave.approvedBy = this.user.id;
    leave.approvedAt = new Date().toISOString();
    leave.comments = comments;
    setData(data);

    // Notifier l'employé
    this.createNotification(
      leave.employeeId,
      'leave_approved',
      'Votre demande de congé a été approuvée',
      { leaveId: leave.id }
    );

    return {
      success: true,
      data: leave,
      message: 'Congé approuvé avec succès'
    };
  }

  /**
   * Pour les managers: rejeter un congé
   */
  async rejectLeave(leaveId, reason) {
    this.ensureAuthenticated();
    this.ensureManager();

    const data = getData();
    const leave = data.absences?.find(l => l.id === leaveId);

    if (!leave) {
      throw new APIError('Congé non trouvé', 404);
    }

    leave.statut = 'Refusé';
    leave.rejectedBy = this.user.id;
    leave.rejectedAt = new Date().toISOString();
    leave.rejectionReason = reason;
    setData(data);

    // Notifier l'employé
    this.createNotification(
      leave.employeeId,
      'leave_rejected',
      'Votre demande de congé a été refusée',
      { leaveId: leave.id, reason: reason }
    );

    return {
      success: true,
      data: leave,
      message: 'Congé rejeté'
    };
  }

  // Méthodes utilitaires privées

  ensureAuthenticated() {
    if (!this.authToken || !this.user) {
      throw new APIError('Non authentifié', 401);
    }
  }

  ensureManager() {
    if (this.user.role !== 'manager' && this.user.role !== 'admin') {
      throw new APIError('Accès non autorisé', 403);
    }
  }

  generateToken(userId, duration) {
    // Simulation de génération JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: userId,
      exp: Date.now() + (duration === '24h' ? 86400000 : 2592000000)
    }));
    const signature = btoa(`signature_${userId}_${Date.now()}`);
    return `${header}.${payload}.${signature}`;
  }

  getPermissions(role) {
    const permissions = {
      employee: ['view_profile', 'check_in', 'check_out', 'request_leave', 'view_payslips'],
      manager: ['view_profile', 'check_in', 'check_out', 'request_leave', 'view_payslips',
                'view_team', 'approve_leave', 'reject_leave', 'view_team_attendance'],
      admin: ['*'] // Toutes les permissions
    };
    return permissions[role] || permissions.employee;
  }

  calculateLeaveBalance(employeeId, absences) {
    const currentYear = new Date().getFullYear();
    const yearAbsences = absences?.filter(a =>
      a.employeeId === employeeId &&
      a.statut === 'Approuvé' &&
      new Date(a.dateDebut).getFullYear() === currentYear
    ) || [];

    const taken = yearAbsences.reduce((sum, a) => sum + (a.nbJours || 0), 0);
    const annual = 22; // Jours de congé annuel standard au Maroc

    return {
      annual: annual,
      taken: taken,
      remaining: annual - taken,
      pending: absences?.filter(a =>
        a.employeeId === employeeId && a.statut === 'En attente'
      ).length || 0
    };
  }

  getManagerId(employeeId) {
    const data = getData();
    const employee = data.employees.find(e => e.id === employeeId);
    return employee?.managerId || null;
  }

  createNotification(userId, type, message, metadata = {}) {
    const data = getData();
    if (!data.notifications) data.notifications = [];

    data.notifications.push({
      id: `notif_${Date.now()}`,
      userId: userId,
      type: type,
      message: message,
      metadata: metadata,
      read: false,
      timestamp: new Date().toISOString()
    });

    setData(data);
  }

  registerDevice(userId, deviceId, deviceToken) {
    const data = getData();
    if (!data.devices) data.devices = [];

    // Supprimer l'ancien enregistrement du même device s'il existe
    data.devices = data.devices.filter(d => d.deviceId !== deviceId);

    data.devices.push({
      userId: userId,
      deviceId: deviceId,
      deviceToken: deviceToken,
      platform: detectPlatform(),
      registeredAt: new Date().toISOString()
    });

    setData(data);
  }
}

function detectPlatform() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  return 'web';
}

/**
 * Classe d'erreur API personnalisée
 */
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

// Instance singleton de l'API client
export const mobileAPI = new MobileAPIClient();

// Export des méthodes principales
export default {
  API_CONFIG,
  mobileAPI,
  APIError
};
