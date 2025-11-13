import { setData } from '../data/store.js';
import { showToast, formatDate, formatMAD } from '../services/utils.js';

export const managerPortalRoute = {
  path: '#/portail-manager',
  labelKey: 'nav.managerPortal',
  render: (container, { data }) => {
    const { validationsManager = [], budgetsEquipe = [], kpisEquipe = [], employees = [] } = data;
    const managerId = 'EMP-001';
    
    const myValidations = validationsManager.filter((v) => v.managerId === managerId);
    const myBudgets = budgetsEquipe.filter((b) => b.managerId === managerId);
    const myKPIs = kpisEquipe.filter((k) => k.managerId === managerId);
    const myTeam = employees.filter((e) => e.id !== managerId).slice(0, 3);

    container.innerHTML = `
      <div class="page-header">
        <h1>Portail Manager</h1>
        <p>Gestion d'équipe, validations et KPIs</p>
      </div>

      <div class="manager-dashboard">
        <div class="dashboard-cards">
          <div class="dash-card">
            <h3>Validations en attente</h3>
            <div class="big-number">${myValidations.filter((v) => v.statut === 'En attente').length}</div>
          </div>
          <div class="dash-card">
            <h3>Mon équipe</h3>
            <div class="big-number">${myTeam.length}</div>
          </div>
          <div class="dash-card">
            <h3>Budget consommé</h3>
            <div class="big-number">${myBudgets[0]?.pourcentageConsommation || 0}%</div>
          </div>
        </div>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab>Validations</fluent-tab>
        <fluent-tab>Mon Équipe</fluent-tab>
        <fluent-tab>Budget</fluent-tab>
        <fluent-tab>KPIs</fluent-tab>

        <fluent-tab-panel>
          <h2>Validations en attente</h2>
          <div class="data-table">
            <table>
              <thead>
                <tr><th>Type</th><th>Employé</th><th>Date</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${myValidations.map((v) => {
                  const emp = employees.find((e) => e.id === v.employeeConcerne);
                  return `
                    <tr>
                      <td>${v.type}</td>
                      <td>${emp?.prenom} ${emp?.nom}</td>
                      <td>${formatDate(v.dateDemande)}</td>
                      <td><fluent-badge>${v.statut}</fluent-badge></td>
                      <td>
                        <fluent-button appearance="accent" size="small">✅ Approuver</fluent-button>
                        <fluent-button appearance="stealth" size="small">❌ Refuser</fluent-button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <h2>Mon Équipe</h2>
          <div class="team-grid">
            ${myTeam.map((emp) => `
              <div class="card">
                <fluent-avatar name="${emp.prenom} ${emp.nom}"></fluent-avatar>
                <strong>${emp.prenom} ${emp.nom}</strong>
                <small>${emp.poste}</small>
                <fluent-button appearance="stealth" size="small">📊 Performance</fluent-button>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <h2>Budget Équipe</h2>
          ${myBudgets.map((b) => `
            <div class="budget-details">
              <h3>${b.departement} - ${b.annee}</h3>
              <div class="budget-items">
                <div><strong>Budget total:</strong> ${formatMAD(b.budgetTotal)}</div>
                <div><strong>Consommé:</strong> ${formatMAD(b.consomme)} (${b.pourcentageConsommation}%)</div>
                <div><strong>Masse salariale:</strong> ${formatMAD(b.masseSalariale)}</div>
              </div>
              <div class="progress-bar" style="--progress: ${b.pourcentageConsommation}%">
                <div class="progress-fill"></div>
              </div>
            </div>
          `).join('')}
        </fluent-tab-panel>

        <fluent-tab-panel>
          <h2>KPIs Équipe</h2>
          ${myKPIs.map((k) => `
            <div class="kpis-grid">
              <div class="kpi-card">
                <span class="kpi-value">${k.effectifEquipe}</span>
                <span class="kpi-label">Effectif</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-value">${k.tauxAbsenteisme}%</span>
                <span class="kpi-label">Absentéisme</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-value">${k.heuresSupMoyennes}h</span>
                <span class="kpi-label">Heures sup (moy)</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-value">${k.satisfactionEquipe}/5</span>
                <span class="kpi-label">Satisfaction</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-value">${k.objectifsAtteints}%</span>
                <span class="kpi-label">Objectifs atteints</span>
              </div>
            </div>
          `).join('')}
        </fluent-tab-panel>
      </fluent-tabs>
    `;
  }
};
