import { setData } from '../data/store.js';
import { showToast, formatDate, formatMAD } from '../services/utils.js';

export const multisiteRoute = {
  path: '#/multisite',
  labelKey: 'nav.multisite',
  render: (container, { data }) => {
    const { etablissements = [], centresCouts = [], departements = [], employees = [] } = data;

    const findEmployee = (id) => employees.find((e) => e.id === id) || { prenom: '?', nom: '?' };

    container.innerHTML = `
      <div class="page-header">
        <h1 data-i18n="multisite.title">Gestion Multisite</h1>
        <p data-i18n="multisite.subtitle">Établissements, centres de coûts et départements</p>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab id="tab-etablissements">Établissements</fluent-tab>
        <fluent-tab id="tab-centres-couts">Centres de Coûts</fluent-tab>
        <fluent-tab id="tab-departements">Départements</fluent-tab>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Établissements</h2>
            <fluent-button id="addEtablissement" appearance="accent">+ Nouvel Établissement</fluent-button>
          </div>

          <div class="data-grid">
            ${etablissements.map((etb) => `
              <div class="card etablissement-card">
                <div class="card-header">
                  <div>
                    <strong>${etb.nom}</strong>
                    <small>${etb.type}</small>
                  </div>
                  <fluent-badge fill="accent" color="${etb.actif ? 'success' : 'warning'}">
                    ${etb.actif ? 'Actif' : 'Inactif'}
                  </fluent-badge>
                </div>

                <div class="etb-info">
                  <div class="info-item">
                    <span class="icon">📍</span>
                    <div>
                      <strong>${etb.ville}, ${etb.pays}</strong>
                      <small>${etb.adresse}</small>
                    </div>
                  </div>

                  <div class="info-item">
                    <span class="icon">👥</span>
                    <div>
                      <strong>${etb.nbEmployes} employés</strong>
                      <small>Effectif actuel</small>
                    </div>
                  </div>

                  <div class="info-item">
                    <span class="icon">📅</span>
                    <div>
                      <strong>${formatDate(etb.dateOuverture)}</strong>
                      <small>Date d'ouverture</small>
                    </div>
                  </div>
                </div>

                <div class="legal-info">
                  <div class="legal-item">
                    <span class="label">ICE:</span>
                    <code>${etb.ice}</code>
                  </div>
                  <div class="legal-item">
                    <span class="label">RC:</span>
                    <code>${etb.rc}</code>
                  </div>
                  <div class="legal-item">
                    <span class="label">CNSS:</span>
                    <code>${etb.cnss}</code>
                  </div>
                  <div class="legal-item">
                    <span class="label">Patente:</span>
                    <code>${etb.patente}</code>
                  </div>
                </div>

                <div class="card-actions">
                  <fluent-button appearance="stealth" size="small">✏️ Modifier</fluent-button>
                  <fluent-button appearance="stealth" size="small">📊 Tableau de bord</fluent-button>
                </div>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Centres de Coûts</h2>
            <fluent-button id="addCentreCout" appearance="accent">+ Nouveau Centre</fluent-button>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Libellé</th>
                  <th>Type</th>
                  <th>Établissement</th>
                  <th>Responsable</th>
                  <th>Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${centresCouts.map((cc) => {
                  const etb = etablissements.find((e) => e.id === cc.etablissement);
                  const resp = findEmployee(cc.responsable);
                  return `
                    <tr>
                      <td><code>${cc.code}</code></td>
                      <td><strong>${cc.libelle}</strong></td>
                      <td>
                        <fluent-badge fill="accent" color="${cc.type === 'Opérationnel' ? 'informational' : 'neutral'}">
                          ${cc.type}
                        </fluent-badge>
                      </td>
                      <td>${etb?.nom || '-'}</td>
                      <td>${resp.prenom} ${resp.nom}</td>
                      <td><strong>${formatMAD(cc.budget)}</strong></td>
                      <td>
                        <fluent-button appearance="stealth" size="small">✏️</fluent-button>
                        <fluent-button appearance="stealth" size="small">📊</fluent-button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="budget-summary">
            <h3>Récapitulatif Budgétaire</h3>
            <div class="summary-cards">
              <div class="summary-card">
                <span class="label">Budget Total</span>
                <span class="value">${formatMAD(centresCouts.reduce((sum, cc) => sum + cc.budget, 0))}</span>
              </div>
              <div class="summary-card">
                <span class="label">Centres Opérationnels</span>
                <span class="value">${centresCouts.filter((cc) => cc.type === 'Opérationnel').length}</span>
              </div>
              <div class="summary-card">
                <span class="label">Centres Support</span>
                <span class="value">${centresCouts.filter((cc) => cc.type === 'Support').length}</span>
              </div>
            </div>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Départements</h2>
            <fluent-button id="addDepartement" appearance="accent">+ Nouveau Département</fluent-button>
          </div>

          <div class="data-grid">
            ${departements.map((dept) => {
              const etb = etablissements.find((e) => e.id === dept.etablissement);
              const cc = centresCouts.find((c) => c.id === dept.centreCout);
              const resp = findEmployee(dept.responsable);
              return `
                <div class="card departement-card">
                  <div class="card-header">
                    <div>
                      <strong>${dept.nom}</strong>
                      <code>${dept.code}</code>
                    </div>
                    <fluent-badge>${dept.effectif} employés</fluent-badge>
                  </div>

                  <div class="dept-info">
                    <div class="info-row">
                      <span class="label">Responsable:</span>
                      <span class="value">${resp.prenom} ${resp.nom}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Établissement:</span>
                      <span class="value">${etb?.nom || '-'}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Centre de coût:</span>
                      <span class="value">${cc?.libelle || '-'} (${cc?.code || '-'})</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Budget:</span>
                      <span class="value"><strong>${formatMAD(cc?.budget || 0)}</strong></span>
                    </div>
                  </div>

                  <div class="card-actions">
                    <fluent-button appearance="stealth" size="small">👥 Employés</fluent-button>
                    <fluent-button appearance="stealth" size="small">📊 KPIs</fluent-button>
                    <fluent-button appearance="stealth" size="small">✏️ Modifier</fluent-button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="organigramme">
            <h3>Vue Organigramme</h3>
            <div class="org-chart">
              ${etablissements.map((etb) => `
                <div class="org-etb">
                  <div class="org-etb-header">
                    <strong>${etb.nom}</strong>
                    <span>${etb.ville}</span>
                  </div>
                  <div class="org-depts">
                    ${departements
                      .filter((d) => d.etablissement === etb.id)
                      .map((dept) => {
                        const resp = findEmployee(dept.responsable);
                        return `
                          <div class="org-dept">
                            <strong>${dept.nom}</strong>
                            <small>${resp.prenom} ${resp.nom}</small>
                            <span class="effectif">${dept.effectif} employés</span>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    container.querySelector('#addEtablissement')?.addEventListener('click', () => {
      showToast('Ajout établissement (à implémenter)');
    });

    container.querySelector('#addCentreCout')?.addEventListener('click', () => {
      showToast('Ajout centre de coût (à implémenter)');
    });

    container.querySelector('#addDepartement')?.addEventListener('click', () => {
      showToast('Ajout département (à implémenter)');
    });
  }
};
