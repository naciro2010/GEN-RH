import { formatDate, showToast } from '../services/utils.js';

export const rgpdRoute = {
  path: '#/rgpd',
  labelKey: 'nav.rgpd',
  render: (container, { data }) => {
    const { consentements = [], demandesPortabilite = [], auditsRGPD = [], registreTraitements = [], employees = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1>RGPD & Conformité</h1>
        <p>Gestion des données personnelles et conformité RGPD</p>
      </div>
      <fluent-tabs>
        <fluent-tab>Consentements</fluent-tab>
        <fluent-tab>Portabilité</fluent-tab>
        <fluent-tab>Audits</fluent-tab>
        <fluent-tab>Registre Traitements</fluent-tab>
        <fluent-tab-panel>
          <h2>Consentements</h2>
          <table>
            <thead><tr><th>Employé</th><th>Type</th><th>Date</th><th>Statut</th><th>Version</th></tr></thead>
            <tbody>
              ${consentements.map((cons) => {
                const emp = employees.find((e) => e.id === cons.employeeId);
                return `
                  <tr>
                    <td>${emp?.prenom} ${emp?.nom}</td>
                    <td>${cons.type}</td>
                    <td>${formatDate(cons.dateConsentement)}</td>
                    <td><fluent-badge fill="accent" color="success">${cons.statut}</fluent-badge></td>
                    <td>${cons.version}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Demandes de Portabilité</h2>
          <table>
            <thead><tr><th>Employé</th><th>Date</th><th>Type</th><th>Format</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              ${demandesPortabilite.map((dem) => {
                const emp = employees.find((e) => e.id === dem.employeeId);
                return `
                  <tr>
                    <td>${emp?.prenom} ${emp?.nom}</td>
                    <td>${formatDate(dem.dateDemande)}</td>
                    <td>${dem.typeExport}</td>
                    <td>${dem.formatSouhaite}</td>
                    <td><fluent-badge>${dem.statut}</fluent-badge></td>
                    <td><fluent-button appearance="accent" size="small">Générer export</fluent-button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Audits RGPD</h2>
          <div class="data-grid">
            ${auditsRGPD.map((audit) => `
              <div class="card">
                <h3>${audit.type}</h3>
                <div><strong>Période:</strong> ${formatDate(audit.dateDebut)} - ${formatDate(audit.dateFin)}</div>
                <div><strong>Auditeur:</strong> ${audit.auditeur}</div>
                <div><strong>Score:</strong> ${audit.score}/100</div>
                <div><strong>Non-conformités:</strong> ${audit.nonConformites}</div>
                <fluent-badge fill="accent" color="${audit.score >= 80 ? 'success' : 'warning'}">${audit.statut}</fluent-badge>
                <details>
                  <summary>Recommandations</summary>
                  <ul>${audit.recommandations.map((r) => `<li>${r}</li>`).join('')}</ul>
                </details>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>
        <fluent-tab-panel>
          <h2>Registre des Traitements</h2>
          ${registreTraitements.map((trait) => `
            <div class="card">
              <h3>${trait.nom}</h3>
              <div><strong>Finalité:</strong> ${trait.finalite}</div>
              <div><strong>Catégories données:</strong> ${trait.categoriesDonnees.join(', ')}</div>
              <div><strong>Destinataires:</strong> ${trait.destinataires.join(', ')}</div>
              <div><strong>Durée conservation:</strong> ${trait.dureeConservation}</div>
              <div><strong>Base juridique:</strong> ${trait.baseJuridique}</div>
              <div><strong>Mesures sécurité:</strong> ${trait.mesuresSecurite.join(', ')}</div>
            </div>
          `).join('')}
        </fluent-tab-panel>
      </fluent-tabs>
    `;
  }
};
