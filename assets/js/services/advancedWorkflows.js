/**
 * Système de Workflows Avancés
 * Gestion des workflows RH avec automatisations, validations multi-niveaux et notifications
 */

import { getData, setData } from '../data/store.js';
import { showToast } from './utils.js';

/**
 * Types de workflows disponibles
 */
export const WORKFLOW_TYPES = {
  LEAVE_REQUEST: {
    id: 'leave_request',
    name: 'Demande de congé',
    description: 'Workflow de validation des demandes de congé',
    steps: ['employee_submit', 'manager_review', 'hr_validation', 'completed'],
    autoApprovalRules: {
      daysThreshold: 1, // Auto-approuver si <= 1 jour
      requiresManagerApproval: true,
      requiresHRApproval: true
    }
  },
  EXPENSE_CLAIM: {
    id: 'expense_claim',
    name: 'Note de frais',
    description: 'Workflow de validation des notes de frais',
    steps: ['employee_submit', 'manager_review', 'finance_validation', 'completed'],
    autoApprovalRules: {
      amountThreshold: 500, // Auto-approuver si <= 500 MAD
      requiresManagerApproval: true,
      requiresFinanceApproval: true
    }
  },
  RECRUITMENT: {
    id: 'recruitment',
    name: 'Processus de recrutement',
    description: 'Workflow complet de recrutement',
    steps: ['job_posting', 'screening', 'interview_1', 'interview_2', 'offer', 'onboarding'],
    autoApprovalRules: null
  },
  TRAINING_REQUEST: {
    id: 'training_request',
    name: 'Demande de formation',
    description: 'Workflow de validation des demandes de formation',
    steps: ['employee_submit', 'manager_review', 'hr_validation', 'budget_approval', 'completed'],
    autoApprovalRules: {
      costThreshold: 2000,
      requiresManagerApproval: true,
      requiresHRApproval: true,
      requiresBudgetApproval: true
    }
  },
  DOCUMENT_REQUEST: {
    id: 'document_request',
    name: 'Demande de document',
    description: 'Workflow de demande de certificats et attestations',
    steps: ['employee_submit', 'hr_processing', 'completed'],
    autoApprovalRules: {
      autoGenerate: true, // Auto-générer certains documents
      requiresHRApproval: false
    }
  },
  SALARY_ADVANCE: {
    id: 'salary_advance',
    name: 'Avance sur salaire',
    description: 'Workflow de demande d\'avance sur salaire',
    steps: ['employee_submit', 'manager_review', 'hr_validation', 'finance_approval', 'completed'],
    autoApprovalRules: {
      maxPercentage: 30, // Max 30% du salaire
      requiresManagerApproval: true,
      requiresHRApproval: true,
      requiresFinanceApproval: true
    }
  },
  PERFORMANCE_REVIEW: {
    id: 'performance_review',
    name: 'Évaluation de performance',
    description: 'Workflow d\'évaluation annuelle',
    steps: ['self_assessment', 'manager_review', 'hr_validation', 'final_meeting', 'completed'],
    autoApprovalRules: null
  }
};

/**
 * Moteur de workflow
 */
export class WorkflowEngine {
  constructor() {
    this.workflows = [];
    this.automationRules = [];
    this.loadWorkflows();
  }

  /**
   * Charger les workflows depuis le store
   */
  loadWorkflows() {
    const data = getData();
    this.workflows = data.workflows || [];
    this.automationRules = data.workflowAutomations || [];
  }

  /**
   * Sauvegarder les workflows
   */
  saveWorkflows() {
    const data = getData();
    data.workflows = this.workflows;
    data.workflowAutomations = this.automationRules;
    setData(data);
  }

  /**
   * Créer une nouvelle instance de workflow
   */
  createWorkflow(type, initiatorId, data, options = {}) {
    const workflowType = WORKFLOW_TYPES[type.toUpperCase()];
    if (!workflowType) {
      throw new Error(`Type de workflow invalide: ${type}`);
    }

    const workflow = {
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: workflowType.id,
      typeName: workflowType.name,
      initiatorId: initiatorId,
      status: 'active',
      currentStep: workflowType.steps[0],
      currentStepIndex: 0,
      steps: workflowType.steps,
      data: data,
      history: [{
        step: workflowType.steps[0],
        action: 'created',
        userId: initiatorId,
        timestamp: new Date().toISOString(),
        comment: options.initialComment || 'Workflow créé'
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      priority: options.priority || 'normal',
      dueDate: options.dueDate || null,
      metadata: options.metadata || {}
    };

    this.workflows.push(workflow);
    this.saveWorkflows();

    // Vérifier les règles d'auto-approbation
    this.checkAutoApprovalRules(workflow);

    // Envoyer les notifications
    this.sendNotifications(workflow, 'created');

    return workflow;
  }

  /**
   * Faire avancer un workflow à l'étape suivante
   */
  advanceWorkflow(workflowId, userId, action, comment = '', additionalData = {}) {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow non trouvé');
    }

    if (workflow.status !== 'active') {
      throw new Error('Le workflow n\'est pas actif');
    }

    // Vérifier les permissions
    if (!this.canPerformAction(workflow, userId, action)) {
      throw new Error('Vous n\'avez pas la permission d\'effectuer cette action');
    }

    // Enregistrer l'action dans l'historique
    workflow.history.push({
      step: workflow.currentStep,
      action: action,
      userId: userId,
      timestamp: new Date().toISOString(),
      comment: comment,
      data: additionalData
    });

    // Traiter l'action
    if (action === 'approve') {
      // Passer à l'étape suivante
      workflow.currentStepIndex++;

      if (workflow.currentStepIndex >= workflow.steps.length) {
        // Workflow terminé
        workflow.status = 'completed';
        workflow.completedAt = new Date().toISOString();
        workflow.currentStep = 'completed';
      } else {
        workflow.currentStep = workflow.steps[workflow.currentStepIndex];
      }
    } else if (action === 'reject') {
      workflow.status = 'rejected';
      workflow.completedAt = new Date().toISOString();
    } else if (action === 'cancel') {
      workflow.status = 'cancelled';
      workflow.completedAt = new Date().toISOString();
    } else if (action === 'request_changes') {
      // Retourner à l'étape précédente
      if (workflow.currentStepIndex > 0) {
        workflow.currentStepIndex--;
        workflow.currentStep = workflow.steps[workflow.currentStepIndex];
      }
    }

    workflow.updatedAt = new Date().toISOString();
    this.saveWorkflows();

    // Envoyer les notifications
    this.sendNotifications(workflow, action);

    // Exécuter les automatisations
    this.executeAutomations(workflow, action);

    return workflow;
  }

  /**
   * Vérifier si un utilisateur peut effectuer une action
   */
  canPerformAction(workflow, userId, action) {
    const allData = getData();
    const user = allData.employees.find(e => e.id === userId);

    if (!user) return false;

    // L'initiateur peut toujours annuler
    if (action === 'cancel' && workflow.initiatorId === userId) {
      return true;
    }

    // Admin peut tout faire
    if (user.role === 'admin') return true;

    // Vérifier selon l'étape actuelle
    const step = workflow.currentStep;

    if (step.includes('manager') && (user.role === 'manager' || user.role === 'admin')) {
      return true;
    }

    if (step.includes('hr') && (user.role === 'hr' || user.role === 'admin')) {
      return true;
    }

    if (step.includes('finance') && (user.role === 'finance' || user.role === 'admin')) {
      return true;
    }

    // Pour l'étape employee, seul l'initiateur peut agir
    if (step.includes('employee') && workflow.initiatorId === userId) {
      return true;
    }

    return false;
  }

  /**
   * Vérifier les règles d'auto-approbation
   */
  checkAutoApprovalRules(workflow) {
    const workflowType = WORKFLOW_TYPES[workflow.type.toUpperCase()];
    const rules = workflowType?.autoApprovalRules;

    if (!rules) return;

    let shouldAutoApprove = false;

    switch (workflow.type) {
      case 'leave_request':
        if (workflow.data.days <= rules.daysThreshold) {
          shouldAutoApprove = true;
        }
        break;

      case 'expense_claim':
        if (workflow.data.amount <= rules.amountThreshold) {
          shouldAutoApprove = true;
        }
        break;

      case 'training_request':
        if (workflow.data.cost <= rules.costThreshold) {
          shouldAutoApprove = true;
        }
        break;

      case 'document_request':
        if (rules.autoGenerate) {
          shouldAutoApprove = true;
        }
        break;
    }

    if (shouldAutoApprove) {
      // Auto-approuver en passant automatiquement les étapes
      setTimeout(() => {
        this.advanceWorkflow(
          workflow.id,
          'system',
          'approve',
          'Approbation automatique selon les règles définies'
        );
      }, 100);
    }
  }

  /**
   * Envoyer des notifications
   */
  sendNotifications(workflow, action) {
    const allData = getData();
    const initiator = allData.employees.find(e => e.id === workflow.initiatorId);

    let recipients = [];
    let message = '';

    switch (action) {
      case 'created':
        // Notifier les approbateurs de la prochaine étape
        recipients = this.getStepApprovers(workflow);
        message = `Nouvelle ${workflow.typeName} de ${initiator?.prenom} ${initiator?.nom}`;
        break;

      case 'approve':
        if (workflow.status === 'completed') {
          // Notifier l'initiateur de la complétion
          recipients = [workflow.initiatorId];
          message = `Votre ${workflow.typeName} a été approuvée`;
        } else {
          // Notifier les approbateurs de la prochaine étape
          recipients = this.getStepApprovers(workflow);
          message = `Nouvelle ${workflow.typeName} en attente de votre validation`;
        }
        break;

      case 'reject':
        // Notifier l'initiateur du rejet
        recipients = [workflow.initiatorId];
        message = `Votre ${workflow.typeName} a été rejetée`;
        break;

      case 'request_changes':
        // Notifier l'initiateur de la demande de modifications
        recipients = [workflow.initiatorId];
        message = `Des modifications sont requises sur votre ${workflow.typeName}`;
        break;
    }

    // Créer les notifications
    if (!allData.notifications) allData.notifications = [];

    recipients.forEach(recipientId => {
      allData.notifications.push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: recipientId,
        type: `workflow_${action}`,
        title: workflow.typeName,
        message: message,
        metadata: {
          workflowId: workflow.id,
          workflowType: workflow.type,
          action: action
        },
        read: false,
        timestamp: new Date().toISOString()
      });
    });

    setData(allData);
  }

  /**
   * Obtenir les approbateurs pour l'étape actuelle
   */
  getStepApprovers(workflow) {
    const allData = getData();
    const step = workflow.currentStep;
    const approvers = [];

    if (step.includes('manager')) {
      // Trouver le manager de l'initiateur
      const initiator = allData.employees.find(e => e.id === workflow.initiatorId);
      if (initiator?.managerId) {
        approvers.push(initiator.managerId);
      }
    }

    if (step.includes('hr')) {
      // Trouver les RH
      const hrUsers = allData.employees.filter(e => e.role === 'hr' || e.role === 'admin');
      approvers.push(...hrUsers.map(u => u.id));
    }

    if (step.includes('finance')) {
      // Trouver les responsables financiers
      const financeUsers = allData.employees.filter(e => e.role === 'finance' || e.role === 'admin');
      approvers.push(...financeUsers.map(u => u.id));
    }

    return [...new Set(approvers)]; // Dédupliquer
  }

  /**
   * Exécuter les automatisations configurées
   */
  executeAutomations(workflow, action) {
    const applicableAutomations = this.automationRules.filter(rule =>
      rule.workflowType === workflow.type &&
      rule.trigger === action &&
      rule.enabled
    );

    applicableAutomations.forEach(automation => {
      try {
        this.executeAutomation(automation, workflow);
      } catch (error) {
        console.error('Erreur lors de l\'exécution de l\'automation:', error);
      }
    });
  }

  /**
   * Exécuter une automatisation spécifique
   */
  executeAutomation(automation, workflow) {
    const actions = automation.actions || [];

    actions.forEach(action => {
      switch (action.type) {
        case 'send_email':
          this.sendEmail(action.params, workflow);
          break;

        case 'update_field':
          this.updateField(action.params, workflow);
          break;

        case 'create_task':
          this.createTask(action.params, workflow);
          break;

        case 'generate_document':
          this.generateDocument(action.params, workflow);
          break;

        case 'update_calendar':
          this.updateCalendar(action.params, workflow);
          break;

        case 'webhook':
          this.triggerWebhook(action.params, workflow);
          break;
      }
    });
  }

  /**
   * Obtenir les workflows d'un employé
   */
  getEmployeeWorkflows(employeeId, filters = {}) {
    let workflows = this.workflows.filter(w => w.initiatorId === employeeId);

    if (filters.type) {
      workflows = workflows.filter(w => w.type === filters.type);
    }

    if (filters.status) {
      workflows = workflows.filter(w => w.status === filters.status);
    }

    return workflows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Obtenir les workflows en attente de validation pour un utilisateur
   */
  getPendingWorkflows(userId) {
    const allData = getData();
    const user = allData.employees.find(e => e.id === userId);

    if (!user) return [];

    return this.workflows.filter(w => {
      if (w.status !== 'active') return false;

      const step = w.currentStep;

      // Vérifier si l'utilisateur peut approuver cette étape
      if (user.role === 'admin') return true;

      if (step.includes('manager') && user.role === 'manager') {
        // Vérifier si c'est le manager de l'initiateur
        const initiator = allData.employees.find(e => e.id === w.initiatorId);
        return initiator?.managerId === userId;
      }

      if (step.includes('hr') && user.role === 'hr') return true;
      if (step.includes('finance') && user.role === 'finance') return true;

      return false;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Obtenir les statistiques des workflows
   */
  getWorkflowStats(filters = {}) {
    let workflows = this.workflows;

    if (filters.startDate) {
      workflows = workflows.filter(w => new Date(w.createdAt) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      workflows = workflows.filter(w => new Date(w.createdAt) <= new Date(filters.endDate));
    }

    const stats = {
      total: workflows.length,
      byStatus: {},
      byType: {},
      averageCompletionTime: 0,
      completionRate: 0
    };

    // Par statut
    workflows.forEach(w => {
      stats.byStatus[w.status] = (stats.byStatus[w.status] || 0) + 1;
      stats.byType[w.type] = (stats.byType[w.type] || 0) + 1;
    });

    // Temps moyen de complétion
    const completed = workflows.filter(w => w.status === 'completed');
    if (completed.length > 0) {
      const totalTime = completed.reduce((sum, w) => {
        const created = new Date(w.createdAt);
        const completedDate = new Date(w.completedAt);
        return sum + (completedDate - created);
      }, 0);
      stats.averageCompletionTime = totalTime / completed.length / (1000 * 60 * 60 * 24); // en jours
      stats.completionRate = (completed.length / workflows.length) * 100;
    }

    return stats;
  }

  // Méthodes d'automatisation (stubs - à implémenter selon les besoins)

  sendEmail(params, workflow) {
    console.log('Envoi email:', params, workflow);
    // Implémenter l'envoi d'email
  }

  updateField(params, workflow) {
    console.log('Mise à jour champ:', params, workflow);
    // Implémenter la mise à jour de champs
  }

  createTask(params, workflow) {
    console.log('Création tâche:', params, workflow);
    // Implémenter la création de tâches
  }

  generateDocument(params, workflow) {
    console.log('Génération document:', params, workflow);
    // Implémenter la génération de documents
  }

  updateCalendar(params, workflow) {
    console.log('Mise à jour calendrier:', params, workflow);
    // Implémenter la mise à jour du calendrier
  }

  triggerWebhook(params, workflow) {
    console.log('Déclenchement webhook:', params, workflow);
    // Implémenter l'appel de webhook
  }
}

/**
 * Instance singleton du moteur de workflow
 */
export const workflowEngine = new WorkflowEngine();

/**
 * Fonctions helper pour les workflows courants
 */

export const createLeaveRequestWorkflow = (employeeId, leaveData) => {
  return workflowEngine.createWorkflow('leave_request', employeeId, {
    type: leaveData.type,
    startDate: leaveData.startDate,
    endDate: leaveData.endDate,
    days: leaveData.days,
    reason: leaveData.reason,
    documents: leaveData.documents || []
  }, {
    priority: leaveData.urgent ? 'high' : 'normal',
    dueDate: leaveData.startDate
  });
};

export const createExpenseClaimWorkflow = (employeeId, expenseData) => {
  return workflowEngine.createWorkflow('expense_claim', employeeId, {
    amount: expenseData.amount,
    category: expenseData.category,
    description: expenseData.description,
    date: expenseData.date,
    receipts: expenseData.receipts || []
  });
};

export const createTrainingRequestWorkflow = (employeeId, trainingData) => {
  return workflowEngine.createWorkflow('training_request', employeeId, {
    title: trainingData.title,
    provider: trainingData.provider,
    cost: trainingData.cost,
    startDate: trainingData.startDate,
    endDate: trainingData.endDate,
    justification: trainingData.justification
  });
};

export const createDocumentRequestWorkflow = (employeeId, documentData) => {
  return workflowEngine.createWorkflow('document_request', employeeId, {
    documentType: documentData.documentType,
    purpose: documentData.purpose,
    urgency: documentData.urgency || 'normal'
  });
};

export default {
  WORKFLOW_TYPES,
  WorkflowEngine,
  workflowEngine,
  createLeaveRequestWorkflow,
  createExpenseClaimWorkflow,
  createTrainingRequestWorkflow,
  createDocumentRequestWorkflow
};
