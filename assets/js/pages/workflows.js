import { formatDate, showToast } from '../services/utils.js';

export const workflowsRoute = {
  path: '#/workflows',
  labelKey: 'nav.workflows',
  render: (container, { data }) => {
    const { workflows = [], instancesWorkflow = [], escalades = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1>Workflows & Approbations</h1>
        <p>Gestion des workflows et processus d'approbation</p>
      </div>
      <fluent-tabs>
        <fluent-tab>Workflows</fluent-tab>
        <fluent-tab>Instances en cours</fluent-tab>
        <fluent-tab>Escalades</fluent-tab>
        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Workflows Configurés</h2>
            <fluent-button id="newWorkflow" appearance="accent">+ Nouveau Workflow</fluent-button>
          </div>
          <div class="data-grid">
            ${workflows.map((wf) => `
              <div class="card workflow-card">
                <div class="card-header">
                  <strong>${wf.nom}</strong>
                  <fluent-badge fill="accent" color="${wf.actif ? 'success' : 'neutral'}">
                    ${wf.actif ? 'Actif' : 'Inactif'}
                  </fluent-badge>
                </div>
                <div><strong>Type:</strong> ${wf.type}</div>
                <div class="workflow-steps">
                  <strong>Étapes (${wf.etapes.length}):</strong>
                  <ol>
                    ${wf.etapes.map((etape) => `
                      <li>
                        <strong>${etape.role}</strong> - ${etape.action}
                        <small>(${etape.delai}h)</small>
                        ${etape.condition ? `<br><em>Si ${etape.condition}</em>` : ''}
                      </li>
                    `).join('')}
                  </ol>
                </div>
                <fluent-button appearance="stealth" size="small">✏️ Modifier</fluent-button>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Instances en Cours</h2>
          <table>
            <thead><tr><th>Workflow</th><th>Référence</th><th>Date Début</th><th>Étape</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              ${instancesWorkflow.map((inst) => {
                const wf = workflows.find((w) => w.id === inst.workflowId);
                return `
                  <tr>
                    <td>${wf?.nom}</td>
                    <td><code>${inst.referenceId}</code></td>
                    <td>${formatDate(inst.dateDebut)}</td>
                    <td>Étape ${inst.etapeCourante}/${wf?.etapes.length}</td>
                    <td><fluent-badge>${inst.statut}</fluent-badge></td>
                    <td><fluent-button appearance="stealth" size="small">📊 Détails</fluent-button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Escalades</h2>
          <table>
            <thead><tr><th>Instance</th><th>Raison</th><th>Date</th><th>Niveau</th><th>Escaladé vers</th><th>Statut</th></tr></thead>
            <tbody>
              ${escalades.map((esc) => `
                <tr>
                  <td><code>${esc.workflowInstanceId}</code></td>
                  <td>${esc.raison}</td>
                  <td>${formatDate(esc.dateEscalade)}</td>
                  <td>Niveau ${esc.niveauEscalade}</td>
                  <td>${esc.escaladeVers}</td>
                  <td><fluent-badge fill="accent" color="warning">${esc.statut}</fluent-badge></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    container.querySelector('#newWorkflow')?.addEventListener('click', () => showToast('Nouveau workflow (à implémenter)'));
  }
};
