import { dashboardRoute } from './dashboard.js';
import { recruitmentRoute } from './recruitment.js';
import { onboardingRoute } from './onboarding.js';
import { employeesRoute } from './employees.js';
import { timeRoute } from './time.js';
import { leavesRoute } from './leaves.js';
import { payrollRoute } from './payroll.js';
import { trainingRoute } from './training.js';
import { documentsRoute } from './documents.js';
import { adminRoute } from './admin.js';
// Nouveaux modules
import { performanceRoute } from './performance.js';
import { payrollAdvancedRoute } from './payrollAdvanced.js';
import { multisiteRoute } from './multisite.js';
import { integrationsRoute } from './integrations.js';
import { employeePortalRoute } from './employeePortal.js';
import { managerPortalRoute } from './managerPortal.js';
import { analyticsRoute } from './analytics.js';
import { mobilityRoute } from './mobility.js';
import { communicationRoute } from './communication.js';
import { rgpdRoute } from './rgpd.js';
import { workflowsRoute } from './workflows.js';

export const routes = [
  dashboardRoute,
  recruitmentRoute,
  onboardingRoute,
  employeesRoute,
  timeRoute,
  leavesRoute,
  payrollRoute,
  payrollAdvancedRoute,
  trainingRoute,
  performanceRoute,
  multisiteRoute,
  integrationsRoute,
  documentsRoute,
  employeePortalRoute,
  managerPortalRoute,
  analyticsRoute,
  mobilityRoute,
  communicationRoute,
  rgpdRoute,
  workflowsRoute,
  adminRoute
];
