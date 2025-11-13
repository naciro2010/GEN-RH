import { setData } from '../data/store.js';
import { showToast, formatDate, formatMAD } from '../services/utils.js';

export const employeePortalRoute = {
  path: '#/portail-employe',
  labelKey: 'nav.employeePortal',
  render: (container, { data }) => {
    const { demandesEmploye = [], documentsEmploye = [], leaves = [], notifications = [], employees = [] } = data;

    // Simuler l'employé connecté (EMP-001)
    const currentEmployeeId = 'EMP-001';
    const currentEmployee = employees.find((e) => e.id === currentEmployeeId) || {};

    const myDemandes = demandesEmploye.filter((d) => d.employeeId === currentEmployeeId);
    const myDocuments = documentsEmploye.filter((d) => d.employeeId === currentEmployeeId);
    const myLeaves = leaves.filter((l) => l.employeeId === currentEmployeeId);
    const myNotifications = notifications.filter((n) => n.userId === currentEmployeeId);

    container.innerHTML = `
      <div class="page-header">
        <h1 data-i18n="employeePortal.title">Mon Portail Employé</h1>
        <p data-i18n="employeePortal.subtitle">Espace personnel et self-service</p>
      </div>

      <div class="portal-welcome">
        <div class="welcome-card">
          <fluent-avatar name="${currentEmployee.prenom} ${currentEmployee.nom}" size="large"></fluent-avatar>
          <div class="welcome-info">
            <h2>Bonjour ${currentEmployee.prenom} 👋</h2>
            <p>${currentEmployee.poste} - ${currentEmployee.department}</p>
          </div>
        </div>
        <div class="quick-stats">
          <div class="stat-card">
            <span class="stat-value">${myLeaves.length}</span>
            <span class="stat-label">Demandes congés</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${myDocuments.length}</span>
            <span class="stat-label">Documents</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${myNotifications.filter((n) => !n.lue).length}</span>
            <span class="stat-label">Notifications</span>
          </div>
        </div>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab id="tab-mes-infos">Mes Informations</fluent-tab>
        <fluent-tab id="tab-mes-demandes">Mes Demandes</fluent-tab>
        <fluent-tab id="tab-mes-documents">Mes Documents</fluent-tab>
        <fluent-tab id="tab-mes-conges">Mes Congés</fluent-tab>
        <fluent-tab id="tab-notifications">Notifications</fluent-tab>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Mes Informations Personnelles</h2>
            <fluent-button id="editProfile" appearance="accent">✏️ Modifier</fluent-button>
          </div>

          <div class="info-sections">
            <div class="info-section">
              <h3>Informations Générales</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Nom complet:</span>
                  <span class="value">${currentEmployee.prenom} ${currentEmployee.nom}</span>
                </div>
                <div class="info-item">
                  <span class="label">Genre:</span>
                  <span class="value">${currentEmployee.genre === 'F' ? 'Féminin' : 'Masculin'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date de naissance:</span>
                  <span class="value">${formatDate(currentEmployee.dateNaissance)}</span>
                </div>
                <div class="info-item">
                  <span class="label">CNIE:</span>
                  <span class="value">${currentEmployee.cnieMasquee || currentEmployee.cnie}</span>
                </div>
                <div class="info-item">
                  <span class="label">Adresse:</span>
                  <span class="value">${currentEmployee.adresse}</span>
                </div>
                <div class="info-item">
                  <span class="label">Situation familiale:</span>
                  <span class="value">${currentEmployee.situationFamiliale}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Informations Professionnelles</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Poste:</span>
                  <span class="value"><strong>${currentEmployee.poste}</strong></span>
                </div>
                <div class="info-item">
                  <span class="label">Département:</span>
                  <span class="value">${currentEmployee.department}</span>
                </div>
                <div class="info-item">
                  <span class="label">Type contrat:</span>
                  <span class="value">${currentEmployee.contrat}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date d'embauche:</span>
                  <span class="value">${formatDate(currentEmployee.dateEmbauche)}</span>
                </div>
                <div class="info-item">
                  <span class="label">Ancienneté:</span>
                  <span class="value">${Math.floor((new Date() - new Date(currentEmployee.dateEmbauche)) / (365.25 * 24 * 60 * 60 * 1000))} ans</span>
                </div>
                <div class="info-item">
                  <span class="label">N° CNSS:</span>
                  <span class="value"><code>${currentEmployee.cnss}</code></span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Informations Bancaires</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">RIB:</span>
                  <span class="value"><code>${currentEmployee.rib}</code></span>
                </div>
                <div class="info-item">
                  <span class="label">ICE:</span>
                  <span class="value"><code>${currentEmployee.ice}</code></span>
                </div>
                <div class="info-item">
                  <span class="label">IF:</span>
                  <span class="value"><code>${currentEmployee.if}</code></span>
                </div>
                <div class="info-item">
                  <span class="label">CIMR:</span>
                  <span class="value">${currentEmployee.cimr ? '✅ Adhérent' : '❌ Non adhérent'}</span>
                </div>
              </div>
            </div>

            ${currentEmployee.ayantsDroit && currentEmployee.ayantsDroit.length > 0 ? `
              <div class="info-section">
                <h3>Ayants Droit</h3>
                <ul class="ayants-droit-list">
                  ${currentEmployee.ayantsDroit.map((ad) => `<li>${ad}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Mes Demandes</h2>
            <fluent-button id="newDemande" appearance="accent">+ Nouvelle Demande</fluent-button>
          </div>

          <div class="demandes-types">
            <fluent-button appearance="stealth" id="demandeAttestation">📄 Attestation de travail</fluent-button>
            <fluent-button appearance="stealth" id="demandeAvance">💰 Avance sur salaire</fluent-button>
            <fluent-button appearance="stealth" id="demandeRIB">🏦 Modification RIB</fluent-button>
            <fluent-button appearance="stealth" id="demandeAutre">📝 Autre demande</fluent-button>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date Demande</th>
                  <th>Statut</th>
                  <th>Traité par</th>
                  <th>Date Traitement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${myDemandes.map((dem) => {
                  const traiteur = dem.traitePar ? employees.find((e) => e.id === dem.traitePar) : null;
                  return `
                    <tr>
                      <td><strong>${dem.type}</strong></td>
                      <td>${formatDate(dem.dateDemande)}</td>
                      <td>
                        <fluent-badge fill="accent" color="${dem.statut === 'Approuvée' ? 'success' : dem.statut === 'Refusée' ? 'danger' : 'warning'}">
                          ${dem.statut}
                        </fluent-badge>
                      </td>
                      <td>${traiteur ? `${traiteur.prenom} ${traiteur.nom}` : '-'}</td>
                      <td>${dem.dateTraitement ? formatDate(dem.dateTraitement) : '-'}</td>
                      <td>
                        <fluent-button appearance="stealth" size="small">👁️ Détails</fluent-button>
                      </td>
                    </tr>
                  `;
                }).join('')}
                ${myDemandes.length === 0 ? '<tr><td colspan="6" style="text-align:center">Aucune demande</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Mes Documents</h2>
            <fluent-button id="requestDocument" appearance="accent">📄 Demander un document</fluent-button>
          </div>

          <div class="documents-grid">
            ${myDocuments.map((doc) => `
              <div class="card document-card">
                <div class="document-icon">
                  ${doc.type.includes('Bulletin') ? '💼' : doc.type.includes('Attestation') ? '📄' : '📋'}
                </div>
                <div class="document-info">
                  <strong>${doc.type}</strong>
                  ${doc.periode ? `<small>Période: ${doc.periode}</small>` : ''}
                  <small>Généré le ${formatDate(doc.dateGeneration)}</small>
                  <small class="file-size">${doc.taille}</small>
                </div>
                <div class="document-actions">
                  <fluent-button appearance="accent" size="small">📥 Télécharger</fluent-button>
                  <fluent-button appearance="stealth" size="small">👁️ Visualiser</fluent-button>
                </div>
              </div>
            `).join('')}
            ${myDocuments.length === 0 ? '<p style="text-align:center;padding:2rem;">Aucun document disponible</p>' : ''}
          </div>

          <div class="documents-categories">
            <h3>Catégories de Documents</h3>
            <div class="categories-grid">
              <div class="category-card">
                <span class="icon">💼</span>
                <strong>Bulletins de paie</strong>
                <span class="count">${myDocuments.filter((d) => d.type.includes('Bulletin')).length}</span>
              </div>
              <div class="category-card">
                <span class="icon">📄</span>
                <strong>Attestations</strong>
                <span class="count">${myDocuments.filter((d) => d.type.includes('Attestation')).length}</span>
              </div>
              <div class="category-card">
                <span class="icon">📋</span>
                <strong>Contrats</strong>
                <span class="count">0</span>
              </div>
              <div class="category-card">
                <span class="icon">📊</span>
                <strong>Autres</strong>
                <span class="count">0</span>
              </div>
            </div>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Mes Congés</h2>
            <fluent-button id="newLeave" appearance="accent">+ Demander un congé</fluent-button>
          </div>

          <div class="conges-summary">
            <div class="summary-card">
              <span class="label">Solde congés annuels</span>
              <span class="value">18 jours</span>
            </div>
            <div class="summary-card">
              <span class="label">Congés pris (2024)</span>
              <span class="value">7 jours</span>
            </div>
            <div class="summary-card">
              <span class="label">Congés en attente</span>
              <span class="value">${myLeaves.filter((l) => l.statut === 'En attente').length}</span>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Durée</th>
                  <th>Statut</th>
                  <th>Approbateur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${myLeaves.map((leave) => {
                  const debut = new Date(leave.debut);
                  const fin = new Date(leave.fin);
                  const duree = Math.ceil((fin - debut) / (24 * 60 * 60 * 1000)) + 1;
                  const approbateur = employees.find((e) => e.id === leave.approbateur);

                  return `
                    <tr>
                      <td><strong>${leave.type}</strong></td>
                      <td>${formatDate(leave.debut)}</td>
                      <td>${formatDate(leave.fin)}</td>
                      <td>${duree} jours</td>
                      <td>
                        <fluent-badge fill="accent" color="${leave.statut === 'Approuvé' ? 'success' : leave.statut === 'Refusé' ? 'danger' : 'warning'}">
                          ${leave.statut}
                        </fluent-badge>
                      </td>
                      <td>${approbateur ? `${approbateur.prenom} ${approbateur.nom}` : '-'}</td>
                      <td>
                        ${leave.statut === 'En attente' ? `
                          <fluent-button appearance="stealth" size="small">🗑️ Annuler</fluent-button>
                        ` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
                ${myLeaves.length === 0 ? '<tr><td colspan="7" style="text-align:center">Aucune demande de congé</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Notifications</h2>
            <fluent-button id="markAllRead" appearance="stealth">✅ Tout marquer comme lu</fluent-button>
          </div>

          <div class="notifications-list">
            ${myNotifications.map((notif) => `
              <div class="notification-item ${notif.lue ? 'read' : 'unread'}">
                <div class="notif-icon ${notif.type}">
                  ${notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div class="notif-content">
                  <strong>${notif.titre}</strong>
                  <p>${notif.message}</p>
                  <small>${new Date(notif.date).toLocaleString('fr-FR')}</small>
                </div>
                ${notif.lien ? `
                  <fluent-button appearance="stealth" size="small" onclick="window.location.hash='${notif.lien}'">
                    →
                  </fluent-button>
                ` : ''}
              </div>
            `).join('')}
            ${myNotifications.length === 0 ? '<p style="text-align:center;padding:2rem;">Aucune notification</p>' : ''}
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    container.querySelector('#newDemande')?.addEventListener('click', () => {
      showToast('Nouvelle demande (à implémenter)');
    });

    container.querySelector('#newLeave')?.addEventListener('click', () => {
      showToast('Demande de congé (à implémenter)');
    });

    container.querySelector('#editProfile')?.addEventListener('click', () => {
      showToast('Modification profil (à implémenter)');
    });
  }
};
