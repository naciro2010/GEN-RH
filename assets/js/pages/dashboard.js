import { simulatePayroll } from '../services/payroll.js';
import { formatMAD, formatNumber } from '../services/utils.js';
import { t } from '../i18n.js';

export const dashboardRoute = {
  id: 'dashboard',
  path: '#/',
  labelKey: 'nav.dashboard',
  render: (container, context) => {
    const { data, navigate } = context;
    const payrollParams = data.settings.payrollParams;
    const payrollSim = simulatePayroll(data.employees, data.payrollVariables.variables, payrollParams);

    const hiresInProgress = data.offers.reduce((acc, offer) => acc + (offer.pipeline.Offre?.length || 0) + (offer.pipeline.Embauche?.length || 0), 0);

    const today = new Date().toISOString().slice(0, 10);
    const absToday = data.attendance.filter((item) => item.date === today && item.status?.toLowerCase() === 'absent').length;

    const upcomingTraining = data.formations.reduce((count, formation) => {
      return (
        count +
        formation.sessions.filter((session) => new Date(session.date) >= new Date()).length
      );
    }, 0);

    container.innerHTML = `
      <section class="grid kpi">
        <div class="kpi-card">
          <span class="badge-dot">${t('dashboard.kpi.hires')}</span>
          <strong>${formatNumber(hiresInProgress)}</strong>
        </div>
        <div class="kpi-card">
          <span class="badge-dot">${t('dashboard.kpi.absences')}</span>
          <strong>${formatNumber(absToday)}</strong>
        </div>
        <div class="kpi-card">
          <span class="badge-dot">${t('dashboard.kpi.payroll')}</span>
          <strong>${formatMAD(payrollSim.masseSalariale)}</strong>
        </div>
        <div class="kpi-card">
          <span class="badge-dot">${t('dashboard.kpi.training')}</span>
          <strong>${formatNumber(upcomingTraining)}</strong>
        </div>
      </section>

      <section class="data-card">
        <div class="section-header">
          <h2>${t('nav.dashboard')}</h2>
          <div class="quick-links">
            <fluent-button appearance="accent" data-action="recrutement">${t('dashboard.quick.recruiting')}</fluent-button>
            <fluent-button appearance="accent" data-action="paie">${t('dashboard.quick.payroll')}</fluent-button>
            <fluent-button appearance="accent" data-action="cnss">${t('dashboard.quick.cnss')}</fluent-button>
            <fluent-button appearance="accent" data-action="simpl">${t('dashboard.quick.simpl')}</fluent-button>
          </div>
        </div>
        <div class="grid">
          <div>
            <h3>Pipeline recrutement</h3>
            <ul class="timeline">
              ${data.offers
                .map(
                  (offer) => `
                    <li>
                      <strong>${offer.titre}</strong>
                      <small>${offer.pipeline.Entretien?.length || 0} entretiens, ${offer.pipeline.Test?.length || 0} tests</small>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </div>
          <div>
            <h3>Alertes paie & conformité</h3>
            <ul class="timeline">
              <li><strong>SIMPL-IR</strong><small>Echéance prochaine : 30/05</small></li>
              <li><strong>Damancom</strong><small>Déclaration prévisionnelle prête</small></li>
              <li><strong>Loi 09-08</strong><small>Audit accès data prévu S3</small></li>
            </ul>
          </div>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'recrutement') navigate('#/recrutement');
        if (action === 'paie') navigate('#/paie');
        if (action === 'cnss') window.open('https://www.cnss.ma/fr/tele-services', '_blank');
        if (action === 'simpl') window.open('https://simpl-ir.tax.gov.ma/', '_blank');
      });
    });
  }
};
