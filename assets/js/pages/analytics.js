import { formatMAD } from '../services/utils.js';

export const analyticsRoute = {
  path: '#/analytics',
  labelKey: 'nav.analytics',
  render: (container, { data }) => {
    const { employees = [], leaves = [], payrollVariables = {} } = data;

    const effectifTotal = employees.length;
    const tauxFemmes = (employees.filter((e) => e.genre === 'F').length / effectifTotal * 100).toFixed(1);
    const salaireMoyen = employees.reduce((sum, e) => sum + (e.salaireBase || 0), 0) / effectifTotal;
    const masseSalarialeTotale = employees.reduce((sum, e) => sum + (e.salaireBase || 0) + (e.primes || 0), 0);

    container.innerHTML = `
      <div class="page-header">
        <h1>Analytics & Rapports Avancés</h1>
        <p>Tableaux de bord et indicateurs clés</p>
      </div>

      <div class="analytics-summary">
        <div class="summary-card"><h3>Effectif Total</h3><div class="big-number">${effectifTotal}</div></div>
        <div class="summary-card"><h3>Masse Salariale</h3><div class="big-number">${formatMAD(masseSalarialeTotale)}</div></div>
        <div class="summary-card"><h3>Salaire Moyen</h3><div class="big-number">${formatMAD(salaireMoyen)}</div></div>
        <div class="summary-card"><h3>Diversité (F)</h3><div class="big-number">${tauxFemmes}%</div></div>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab>Vue d'ensemble</fluent-tab>
        <fluent-tab>Effectifs & Diversité</fluent-tab>
        <fluent-tab>Masse Salariale</fluent-tab>
        <fluent-tab>Turnover</fluent-tab>
        <fluent-tab-panel>
          <h2>Tableau de Bord Principal</h2>
          <div class="chart-placeholder"><p>📊 Graphique évolution effectif (Power BI / Chart.js)</p></div>
          <div class="metrics-grid">
            <div class="metric-card"><strong>Recrutements 2024</strong><span>5</span></div>
            <div class="metric-card"><strong>Départs 2024</strong><span>2</span></div>
            <div class="metric-card"><strong>Turnover</strong><span>4.2%</span></div>
            <div class="metric-card"><strong>Ancienneté moy</strong><span>8.3 ans</span></div>
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Effectifs & Diversité</h2>
          <h3>Répartition Genre</h3>
          <div class="stat-bar">
            <div class="bar-segment" style="width:${tauxFemmes}%;background:#e91e63">Femmes ${tauxFemmes}%</div>
            <div class="bar-segment" style="width:${100 - tauxFemmes}%;background:#2196f3">Hommes ${(100 - tauxFemmes).toFixed(1)}%</div>
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Analyse Masse Salariale</h2>
          <table><thead><tr><th>Département</th><th>Effectif</th><th>Masse</th></tr></thead><tbody>
            ${[...new Set(employees.map((e) => e.department))].map((dept) => {
              const deptEmp = employees.filter((e) => e.department === dept);
              const masse = deptEmp.reduce((sum, e) => sum + (e.salaireBase || 0), 0);
              return `<tr><td>${dept}</td><td>${deptEmp.length}</td><td>${formatMAD(masse)}</td></tr>`;
            }).join('')}
          </tbody></table>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Turnover</h2>
          <div class="turnover-metrics">
            <div class="metric-card"><h4>Taux Annuel</h4><div class="big-number">4.2%</div></div>
            <div class="metric-card"><h4>Rétention</h4><div class="big-number">95.8%</div></div>
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;
  }
};
