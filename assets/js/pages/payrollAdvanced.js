import { setData } from '../data/store.js';
import { showToast, formatDate, formatMAD } from '../services/utils.js';
import { exportDeclarationCNSS, exportDeclarationIR } from '../services/exports.js';

export const payrollAdvancedRoute = {
  path: '#/paie-avancee',
  labelKey: 'nav.payrollAdvanced',
  render: (container, { data }) => {
    const { declarationsCNSS = [], declarationsIR = [], mutuelles = [], cimrAdhesions = [], employees = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1 data-i18n="payrollAdvanced.title">Paie Avancée & Déclarations</h1>
        <p data-i18n="payrollAdvanced.subtitle">Gestion CNSS, SIMPL-IR, mutuelles et CIMR</p>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab id="tab-cnss">Déclarations CNSS</fluent-tab>
        <fluent-tab id="tab-ir">Déclarations IR</fluent-tab>
        <fluent-tab id="tab-mutuelles">Mutuelles & Assurances</fluent-tab>
        <fluent-tab id="tab-cimr">CIMR</fluent-tab>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Déclarations CNSS</h2>
            <div class="actions-group">
              <fluent-button id="generateCNSS" appearance="accent">+ Générer Déclaration</fluent-button>
              <fluent-button id="exportDamancom" appearance="stealth">Export Damancom</fluent-button>
            </div>
          </div>

          <div class="info-banner">
            <span class="icon">ℹ️</span>
            <div>
              <strong>Format Damancom</strong>
              <p>Les déclarations sont générées au format Damancom pour télétransmission vers le portail CNSS</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Statut</th>
                  <th>Nb Employés</th>
                  <th>Masse Salariale</th>
                  <th>Cotisations Patronales</th>
                  <th>Cotisations Salariales</th>
                  <th>Total</th>
                  <th>Date Génération</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${declarationsCNSS.map((decl) => `
                  <tr>
                    <td><strong>${decl.periode}</strong></td>
                    <td>
                      <fluent-badge fill="accent" color="${decl.statut === 'Télétransmise' ? 'success' : 'warning'}">
                        ${decl.statut}
                      </fluent-badge>
                    </td>
                    <td>${decl.nbEmployes}</td>
                    <td>${formatMAD(decl.masseSalarialeDeclaree)}</td>
                    <td>${formatMAD(decl.cotisationsPatronales)}</td>
                    <td>${formatMAD(decl.cotisationsSalariales)}</td>
                    <td><strong>${formatMAD(decl.cotisationsPatronales + decl.cotisationsSalariales)}</strong></td>
                    <td>${formatDate(decl.dateGeneration)}</td>
                    <td>
                      <fluent-button appearance="stealth" size="small" data-action="download" data-id="${decl.id}">
                        📥 Télécharger
                      </fluent-button>
                      ${decl.statut === 'Télétransmise' ? `
                        <div class="recepisse-info">
                          <small>📋 ${decl.numeroRecepisse}</small>
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="cnss-help">
            <h3>Aide Déclaration CNSS</h3>
            <ul>
              <li><strong>Allocations familiales:</strong> 6.4% (employeur uniquement)</li>
              <li><strong>Prestations sociales:</strong> 8.98% (employeur) + 4.48% (salarié) - Plafonné à 6000 MAD</li>
              <li><strong>AMO:</strong> 4.11% (employeur) + 2.26% (salarié)</li>
              <li><strong>TFP:</strong> 1.6% (employeur)</li>
            </ul>
            <p><a href="https://www.cnss.ma" target="_blank">→ Accéder au portail CNSS</a></p>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Déclarations IR (SIMPL-IR)</h2>
            <div class="actions-group">
              <fluent-button id="generateIR" appearance="accent">+ Générer Déclaration</fluent-button>
              <fluent-button id="exportSIMPL" appearance="stealth">Export XML SIMPL</fluent-button>
            </div>
          </div>

          <div class="info-banner">
            <span class="icon">📄</span>
            <div>
              <strong>Format SIMPL-IR XML</strong>
              <p>Les déclarations sont générées au format XML SIMPL-IR pour télédéclaration sur le portail DGI</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Statut</th>
                  <th>Nb Employés</th>
                  <th>Montant IR Total</th>
                  <th>Date Génération</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${declarationsIR.map((decl) => `
                  <tr>
                    <td><strong>${decl.periode}</strong></td>
                    <td>
                      <fluent-badge fill="accent" color="${decl.statut === 'Télédéclarée' ? 'success' : 'warning'}">
                        ${decl.statut}
                      </fluent-badge>
                    </td>
                    <td>${decl.nbEmployes}</td>
                    <td><strong>${formatMAD(decl.montantIRTotal)}</strong></td>
                    <td>${formatDate(decl.dateGeneration)}</td>
                    <td>
                      <fluent-button appearance="stealth" size="small" data-action="download-ir" data-id="${decl.id}">
                        📥 Télécharger XML
                      </fluent-button>
                      ${decl.statut === 'Télédéclarée' ? `
                        <div class="declaration-info">
                          <small>📋 ${decl.numeroDeclaration}</small>
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="ir-bareme">
            <h3>Barème IR 2025</h3>
            <table class="bareme-table">
              <thead>
                <tr>
                  <th>Tranche annuelle</th>
                  <th>Taux</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>0 - 40 000 MAD</td><td>0%</td></tr>
                <tr><td>40 001 - 60 000 MAD</td><td>10%</td></tr>
                <tr><td>60 001 - 80 000 MAD</td><td>20%</td></tr>
                <tr><td>80 001 - 100 000 MAD</td><td>30%</td></tr>
                <tr><td>100 001 - 180 000 MAD</td><td>34%</td></tr>
                <tr><td>> 180 000 MAD</td><td>37%</td></tr>
              </tbody>
            </table>
            <p><a href="https://portail.tax.gov.ma" target="_blank">→ Accéder à SIMPL-IR</a></p>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Mutuelles & Assurances Groupe</h2>
            <fluent-button id="addMutuelle" appearance="accent">+ Ajouter Mutuelle</fluent-button>
          </div>

          <div class="data-grid">
            ${mutuelles.map((mut) => {
              const nbEmployes = mut.employesConcernes === 'all' ? employees.length : mut.employesConcernes.length;
              return `
                <div class="card mutuelle-card">
                  <div class="card-header">
                    <div>
                      <strong>${mut.nom}</strong>
                      <small>${mut.type}</small>
                    </div>
                    <fluent-badge>${nbEmployes} employés</fluent-badge>
                  </div>

                  <div class="mutuelle-details">
                    <div class="detail-item">
                      <span class="label">N° Adhésion:</span>
                      <span class="value">${mut.numeroAdhesion}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Cotisation Patronale:</span>
                      <span class="value">${mut.tauxCotisationPatron}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Cotisation Salariale:</span>
                      <span class="value">${mut.tauxCotisationSalarie}%</span>
                    </div>
                    ${mut.plafondRemboursement ? `
                      <div class="detail-item">
                        <span class="label">Plafond Remboursement:</span>
                        <span class="value">${formatMAD(mut.plafondRemboursement)}</span>
                      </div>
                    ` : ''}
                    ${mut.capitalDeces ? `
                      <div class="detail-item">
                        <span class="label">Capital Décès:</span>
                        <span class="value">${formatMAD(mut.capitalDeces)}</span>
                      </div>
                    ` : ''}
                  </div>

                  <div class="garanties-list">
                    <strong>Garanties:</strong>
                    <div class="tags">
                      ${mut.garanties.map((g) => `<span class="tag">${g}</span>`).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>CIMR - Caisse Interprofessionnelle Marocaine de Retraite</h2>
            <fluent-button id="addCIMR" appearance="accent">+ Ajouter Adhésion</fluent-button>
          </div>

          <div class="info-banner">
            <span class="icon">🏦</span>
            <div>
              <strong>Régime de retraite complémentaire</strong>
              <p>Cotisation: 3% employeur + 3% salarié (plafond 3000 MAD/mois)</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Employé</th>
                  <th>Poste</th>
                  <th>N° Adhérent</th>
                  <th>Date Adhésion</th>
                  <th>Cotisation Mensuelle</th>
                  <th>Ancienneté</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${cimrAdhesions.map((adh) => {
                  const emp = employees.find((e) => e.id === adh.employeeId) || {};
                  const dateAdh = new Date(adh.dateAdhesion);
                  const today = new Date();
                  const anciennete = Math.floor((today - dateAdh) / (365.25 * 24 * 60 * 60 * 1000));
                  const salaireBase = emp.salaireBase || 0;
                  const assietteCIMR = Math.min(salaireBase, adh.plafondCotisation);
                  const cotisationMensuelle = assietteCIMR * (adh.tauxCotisationPatron + adh.tauxCotisationSalarie) / 100;

                  return `
                    <tr>
                      <td><strong>${emp.prenom || '?'} ${emp.nom || '?'}</strong></td>
                      <td>${emp.poste || '-'}</td>
                      <td><code>${adh.numeroAdherent}</code></td>
                      <td>${formatDate(adh.dateAdhesion)}</td>
                      <td><strong>${formatMAD(cotisationMensuelle)}</strong></td>
                      <td>${anciennete} ans</td>
                      <td>
                        <fluent-button appearance="stealth" size="small">📄 Attestation</fluent-button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="cimr-summary">
            <h3>Récapitulatif CIMR</h3>
            <div class="summary-cards">
              <div class="summary-card">
                <span class="label">Nb Adhérents</span>
                <span class="value">${cimrAdhesions.length}</span>
              </div>
              <div class="summary-card">
                <span class="label">Cotisations Mensuelles</span>
                <span class="value">${formatMAD(cimrAdhesions.reduce((sum, adh) => {
                  const emp = employees.find((e) => e.id === adh.employeeId) || {};
                  const assietteCIMR = Math.min(emp.salaireBase || 0, adh.plafondCotisation);
                  return sum + (assietteCIMR * 6 / 100);
                }, 0))}</span>
              </div>
              <div class="summary-card">
                <span class="label">Part Employeur</span>
                <span class="value">${formatMAD(cimrAdhesions.reduce((sum, adh) => {
                  const emp = employees.find((e) => e.id === adh.employeeId) || {};
                  const assietteCIMR = Math.min(emp.salaireBase || 0, adh.plafondCotisation);
                  return sum + (assietteCIMR * 3 / 100);
                }, 0))}</span>
              </div>
            </div>
            <p><a href="https://www.cimr.ma" target="_blank">→ Accéder au portail CIMR</a></p>
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    // Event listeners
    container.querySelector('#generateCNSS')?.addEventListener('click', () => {
      showToast('Génération déclaration CNSS en cours...');
      // Logique de génération à implémenter
    });

    container.querySelector('#generateIR')?.addEventListener('click', () => {
      showToast('Génération déclaration SIMPL-IR en cours...');
      // Logique de génération à implémenter
    });

    container.querySelector('#addMutuelle')?.addEventListener('click', () => {
      showToast('Ajout mutuelle (à implémenter)');
    });

    container.querySelector('#addCIMR')?.addEventListener('click', () => {
      showToast('Ajout adhésion CIMR (à implémenter)');
    });
  }
};
