import { formatDate, showToast } from '../services/utils.js';

export const communicationRoute = {
  path: '#/communication',
  labelKey: 'nav.communication',
  render: (container, { data }) => {
    const { annonces = [], sondages = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1>Communication Interne</h1>
        <p>Annonces, sondages et communication d'entreprise</p>
      </div>
      <fluent-tabs>
        <fluent-tab>Annonces</fluent-tab>
        <fluent-tab>Sondages</fluent-tab>
        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Annonces</h2>
            <fluent-button id="newAnnonce" appearance="accent">+ Nouvelle Annonce</fluent-button>
          </div>
          <div class="data-grid">
            ${annonces.map((ann) => `
              <div class="card annonce-card ${ann.priorite === 'Haute' ? 'priority-high' : ''}">
                <div class="card-header">
                  <strong>${ann.titre}</strong>
                  <fluent-badge fill="accent" color="${ann.priorite === 'Haute' ? 'danger' : 'informational'}">
                    ${ann.priorite}
                  </fluent-badge>
                </div>
                <p>${ann.contenu}</p>
                <div class="annonce-meta">
                  <small>Publié le ${formatDate(ann.datePublication)}</small>
                  <small>${ann.lu?.length || 0} lectures</small>
                </div>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Sondages</h2>
            <fluent-button id="newSondage" appearance="accent">+ Nouveau Sondage</fluent-button>
          </div>
          <div class="data-grid">
            ${sondages.map((sond) => `
              <div class="card">
                <h3>${sond.titre}</h3>
                <p>${sond.description}</p>
                <div class="sondage-stats">
                  <div><strong>Réponses:</strong> ${sond.reponses}</div>
                  <div><strong>Taux participation:</strong> ${sond.tauxParticipation}%</div>
                  <div><strong>Statut:</strong> ${sond.statut}</div>
                </div>
                <div class="progress-bar" style="--progress: ${sond.tauxParticipation}%">
                  <div class="progress-fill"></div>
                </div>
                <fluent-button appearance="stealth">Voir résultats</fluent-button>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    container.querySelector('#newAnnonce')?.addEventListener('click', () => showToast('Nouvelle annonce (à implémenter)'));
    container.querySelector('#newSondage')?.addEventListener('click', () => showToast('Nouveau sondage (à implémenter)'));
  }
};
