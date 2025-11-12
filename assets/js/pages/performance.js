import { setData } from '../data/store.js';
import { showToast, formatDate } from '../services/utils.js';

export const performanceRoute = {
  path: '#/performance',
  labelKey: 'nav.performance',
  render: (container, { data }) => {
    const { objectives = [], evaluations = [], talentPools = [], successionPlans = [], entretiensAnnuels = [], employees = [] } = data;

    const findEmployee = (id) => employees.find((e) => e.id === id) || { prenom: '?', nom: '?' };

    container.innerHTML = `
      <div class="page-header">
        <h1 data-i18n="performance.title">Performance & Talents</h1>
        <p data-i18n="performance.subtitle">Gestion des objectifs, évaluations, talents et plans de succession</p>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab id="tab-objectives">Objectifs</fluent-tab>
        <fluent-tab id="tab-evaluations">Évaluations</fluent-tab>
        <fluent-tab id="tab-talents">Talents</fluent-tab>
        <fluent-tab id="tab-succession">Plans de Succession</fluent-tab>
        <fluent-tab id="tab-annual">Entretiens Annuels</fluent-tab>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Objectifs</h2>
            <fluent-button id="addObjective" appearance="accent">+ Nouvel Objectif</fluent-button>
          </div>
          <div class="data-grid">
            ${objectives.map((obj) => {
              const emp = findEmployee(obj.employeeId);
              return `
                <div class="card objective-card">
                  <div class="card-header">
                    <div>
                      <strong>${obj.titre}</strong>
                      <small>${emp.prenom} ${emp.nom}</small>
                    </div>
                    <fluent-badge fill="accent" color="${obj.statut === 'En cours' ? 'informational' : obj.statut === 'Complété' ? 'success' : 'warning'}">
                      ${obj.statut}
                    </fluent-badge>
                  </div>
                  <p>${obj.description}</p>
                  <div class="objective-meta">
                    <span><strong>Catégorie:</strong> ${obj.categorie}</span>
                    <span><strong>Poids:</strong> ${obj.poids}%</span>
                    <span><strong>Échéance:</strong> ${formatDate(obj.dateEcheance)}</span>
                  </div>
                  <div class="progress-container">
                    <div class="progress-bar" style="--progress: ${obj.progression}%">
                      <div class="progress-fill"></div>
                      <span class="progress-label">${obj.progression}%</span>
                    </div>
                  </div>
                  <div class="kpis">
                    <strong>KPIs:</strong>
                    <ul>
                      ${obj.kpis.map((kpi) => `<li>${kpi}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Évaluations</h2>
            <fluent-button id="addEvaluation" appearance="accent">+ Nouvelle Évaluation</fluent-button>
          </div>
          <div class="data-grid">
            ${evaluations.map((eval_) => {
              const emp = findEmployee(eval_.employeeId);
              return `
                <div class="card evaluation-card">
                  <div class="card-header">
                    <div>
                      <strong>${emp.prenom} ${emp.nom}</strong>
                      <small>Évaluation ${eval_.type} ${eval_.periode}</small>
                    </div>
                    <div class="note-globale">
                      <span class="note-value">${eval_.noteGlobale.toFixed(2)}</span>
                      <span class="note-max">/5</span>
                    </div>
                  </div>
                  <fluent-badge fill="accent" color="${eval_.statut === 'Complétée' ? 'success' : 'warning'}">
                    ${eval_.statut}
                  </fluent-badge>
                  <div class="evaluation-period">
                    <span>Du ${formatDate(eval_.dateDebut)} au ${formatDate(eval_.dateFin)}</span>
                  </div>

                  <div class="competences-grid">
                    <strong>Compétences évaluées:</strong>
                    ${Object.entries(eval_.competences).map(([comp, note]) => `
                      <div class="competence-item">
                        <span>${comp}</span>
                        <div class="rating">
                          ${Array.from({ length: 5 }, (_, i) => {
                            const filled = i < Math.floor(note);
                            const half = i < note && i >= Math.floor(note);
                            return filled ? '★' : half ? '⯨' : '☆';
                          }).join('')}
                          <span class="note-text">${note}</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <div class="evaluation-feedback">
                    <div>
                      <strong>Points forts:</strong>
                      <ul>${eval_.pointsForts.map((p) => `<li>${p}</li>`).join('')}</ul>
                    </div>
                    <div>
                      <strong>Axes d'amélioration:</strong>
                      <ul>${eval_.axesAmelioration.map((a) => `<li>${a}</li>`).join('')}</ul>
                    </div>
                  </div>

                  ${eval_.evaluateurs.length > 0 ? `
                    <details class="evaluateurs-details">
                      <summary><strong>Évaluateurs (${eval_.evaluateurs.length})</strong></summary>
                      ${eval_.evaluateurs.map((ev) => {
                        const evaluateur = findEmployee(ev.id);
                        return `
                          <div class="evaluateur-item">
                            <span>${evaluateur.prenom} ${evaluateur.nom} (${ev.role})</span>
                            <span class="note">${ev.note}/5</span>
                            <p class="commentaire">"${ev.commentaire}"</p>
                          </div>
                        `;
                      }).join('')}
                    </details>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Pools de Talents</h2>
            <fluent-button id="addTalentPool" appearance="accent">+ Nouveau Pool</fluent-button>
          </div>
          <div class="data-grid">
            ${talentPools.map((pool) => `
              <div class="card talent-pool-card">
                <div class="card-header">
                  <strong>${pool.nom}</strong>
                  <fluent-badge>${pool.membres.length} membres</fluent-badge>
                </div>
                <p>${pool.description}</p>
                <div class="criteres">
                  <strong>Critères:</strong>
                  <ul>${pool.criteres.map((c) => `<li>${c}</li>`).join('')}</ul>
                </div>
                <div class="membres-list">
                  <strong>Membres:</strong>
                  <div class="avatars-group">
                    ${pool.membres.map((empId) => {
                      const emp = findEmployee(empId);
                      return `<fluent-avatar name="${emp.prenom} ${emp.nom}" title="${emp.prenom} ${emp.nom}"></fluent-avatar>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Plans de Succession</h2>
            <fluent-button id="addSuccessionPlan" appearance="accent">+ Nouveau Plan</fluent-button>
          </div>
          <div class="data-grid">
            ${successionPlans.map((plan) => {
              const titulaire = findEmployee(plan.titulaire);
              return `
                <div class="card succession-card">
                  <div class="card-header">
                    <div>
                      <strong>${plan.posteClef}</strong>
                      <small>Titulaire: ${titulaire.prenom} ${titulaire.nom}</small>
                    </div>
                    <fluent-badge fill="accent" color="${plan.risque === 'Élevé' ? 'danger' : plan.risque === 'Moyen' ? 'warning' : 'success'}">
                      Risque ${plan.risque}
                    </fluent-badge>
                  </div>

                  <div class="successeurs-list">
                    <strong>Successeurs identifiés:</strong>
                    ${plan.successeurs.map((succ) => {
                      const emp = findEmployee(succ.employeeId);
                      return `
                        <div class="successeur-item">
                          <div class="successeur-info">
                            <fluent-avatar name="${emp.prenom} ${emp.nom}"></fluent-avatar>
                            <div>
                              <strong>${emp.prenom} ${emp.nom}</strong>
                              <small>${emp.poste}</small>
                            </div>
                          </div>
                          <div class="readiness">
                            <span>${succ.readiness}</span>
                            <div class="score-badge">${succ.score}%</div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <div class="actions-preparation">
                    <strong>Actions de préparation:</strong>
                    <ul>
                      ${plan.actionsPreparation.map((action) => `<li>${action}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Entretiens Annuels</h2>
            <fluent-button id="addAnnualReview" appearance="accent">+ Nouvel Entretien</fluent-button>
          </div>
          <div class="data-grid">
            ${entretiensAnnuels.map((entretien) => {
              const emp = findEmployee(entretien.employeeId);
              const manager = findEmployee(entretien.managerId);
              return `
                <div class="card annual-review-card">
                  <div class="card-header">
                    <div>
                      <strong>${emp.prenom} ${emp.nom}</strong>
                      <small>Manager: ${manager.prenom} ${manager.nom}</small>
                    </div>
                    <fluent-badge fill="accent" color="success">${entretien.statut}</fluent-badge>
                  </div>

                  <div class="review-meta">
                    <span><strong>Date:</strong> ${formatDate(entretien.date)}</span>
                    <span><strong>Durée:</strong> ${entretien.duree} min</span>
                  </div>

                  <div class="review-section">
                    <strong>Objectifs année écoulée:</strong>
                    <ul>${entretien.objectifsAnneeEcoulee.map((obj) => `<li>${obj}</li>`).join('')}</ul>
                    <p class="bilan"><em>${entretien.bilanObjectifs}</em></p>
                  </div>

                  <div class="review-section">
                    <strong>Objectifs année prochaine:</strong>
                    <ul>${entretien.objectifsAnneeProchaine.map((obj) => `<li>${obj}</li>`).join('')}</ul>
                  </div>

                  <div class="review-section">
                    <strong>Souhaits d'évolution:</strong>
                    <p>${entretien.souhaitsEvolution}</p>
                  </div>

                  <div class="review-section">
                    <strong>Formations souhaitées:</strong>
                    <ul>${entretien.formationsSouhaitees.map((f) => `<li>${f}</li>`).join('')}</ul>
                  </div>

                  <div class="review-comments">
                    <div class="comment-box manager-comment">
                      <strong>Commentaire Manager:</strong>
                      <p>"${entretien.commentaireManager}"</p>
                    </div>
                    <div class="comment-box employee-comment">
                      <strong>Commentaire Employé:</strong>
                      <p>"${entretien.commentaireEmploye}"</p>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    // Event listeners for adding new items (placeholder functionality)
    container.querySelector('#addObjective')?.addEventListener('click', () => {
      showToast('Fonctionnalité: Ajouter un objectif (à implémenter)');
    });

    container.querySelector('#addEvaluation')?.addEventListener('click', () => {
      showToast('Fonctionnalité: Nouvelle évaluation (à implémenter)');
    });

    container.querySelector('#addTalentPool')?.addEventListener('click', () => {
      showToast('Fonctionnalité: Créer un pool de talents (à implémenter)');
    });

    container.querySelector('#addSuccessionPlan')?.addEventListener('click', () => {
      showToast('Fonctionnalité: Créer un plan de succession (à implémenter)');
    });

    container.querySelector('#addAnnualReview')?.addEventListener('click', () => {
      showToast('Fonctionnalité: Planifier un entretien annuel (à implémenter)');
    });
  }
};
