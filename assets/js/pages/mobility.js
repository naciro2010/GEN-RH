import { formatDate, formatMAD, showToast } from '../services/utils.js';

export const mobilityRoute = {
  path: '#/mobilite',
  labelKey: 'nav.mobility',
  render: (container, { data }) => {
    const { postesInternes = [], candidaturesInternes = [], employees = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1>Mobilité Interne</h1>
        <p>Opportunités internes et gestion des carrières</p>
      </div>
      <fluent-tabs>
        <fluent-tab>Postes Ouverts</fluent-tab>
        <fluent-tab>Mes Candidatures</fluent-tab>
        <fluent-tab-panel>
          <h2>Postes Ouverts en Interne</h2>
          <div class="data-grid">
            ${postesInternes.map((poste) => `
              <div class="card">
                <h3>${poste.titre}</h3>
                <p>${poste.description}</p>
                <div><strong>Département:</strong> ${poste.departement}</div>
                <div><strong>Type:</strong> ${poste.type}</div>
                <div><strong>Expérience:</strong> ${poste.experienceRequise}</div>
                <div><strong>Salaire:</strong> ${formatMAD(poste.salaireMin)} - ${formatMAD(poste.salaireMax)}</div>
                <div><strong>Compétences:</strong> ${poste.competencesRequises.join(', ')}</div>
                <fluent-button appearance="accent">Postuler</fluent-button>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Mes Candidatures</h2>
          <table>
            <thead><tr><th>Poste</th><th>Date</th><th>Statut</th><th>Support Manager</th></tr></thead>
            <tbody>
              ${candidaturesInternes.map((cand) => {
                const poste = postesInternes.find((p) => p.id === cand.posteId);
                return `
                  <tr>
                    <td>${poste?.titre}</td>
                    <td>${formatDate(cand.dateCandidature)}</td>
                    <td><fluent-badge>${cand.statut}</fluent-badge></td>
                    <td>${cand.supportManager ? '✅' : '❌'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </fluent-tab-panel>
      </fluent-tabs>
    `;
  }
};
