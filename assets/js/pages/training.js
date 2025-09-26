import { getData } from '../data/store.js';
import { formatMAD, formatNumber } from '../services/utils.js';

export const trainingRoute = {
  id: 'formation',
  path: '#/formation',
  labelKey: 'nav.formation',
  render: (container) => {
    const data = getData();
    const totalBudget = data.formations.reduce((sum, action) => sum + (action.budget || 0), 0);
    const totalParticipants = data.formations.reduce(
      (sum, action) => sum + action.sessions.reduce((acc, session) => acc + (session.participants || 0), 0),
      0
    );
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Plan de formation</h2>
          <span class="badge">Budget total ${formatMAD(totalBudget)} – Participants ${formatNumber(totalParticipants)}</span>
        </div>
        <div class="grid">
          ${data.formations
            .map(
              (action) => `
                <div class="data-card">
                  <div class="flex-between">
                    <h3>${action.intitule}</h3>
                    <span class="badge">${formatMAD(action.budget)}</span>
                  </div>
                  <ul>
                    ${action.sessions
                      .map(
                        (session) => `
                          <li>${session.date} – ${session.lieu} – ${session.participants} inscrits / ${session.presence} présents – Evaluation ${session.evaluation}</li>
                        `
                      )
                      .join('')}
                  </ul>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="data-card">
        <h3>Rappel TFP</h3>
        <p>La Taxe de Formation Professionnelle (TFP) représente ${data.settings.payrollParams.cnss.tfp_pct_employeur || 1.6}% de la masse salariale et constitue un coût employeur affecté aux actions de formation. Utilisez les données ci-dessus pour piloter ce budget.</p>
      </section>
    `;
  }
};
