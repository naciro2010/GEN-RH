import { setData } from '../data/store.js';
import { showToast, formatDate } from '../services/utils.js';

export const integrationsRoute = {
  path: '#/integrations',
  labelKey: 'nav.integrations',
  render: (container, { data }) => {
    const { apiKeys = [], webhooks = [], connecteursComptables = [] } = data;

    container.innerHTML = `
      <div class="page-header">
        <h1 data-i18n="integrations.title">Intégrations & APIs</h1>
        <p data-i18n="integrations.subtitle">Connecteurs comptables, APIs et webhooks</p>
      </div>

      <fluent-tabs class="module-tabs">
        <fluent-tab id="tab-apis">Clés API</fluent-tab>
        <fluent-tab id="tab-webhooks">Webhooks</fluent-tab>
        <fluent-tab id="tab-comptables">Connecteurs Comptables</fluent-tab>
        <fluent-tab id="tab-documentation">Documentation API</fluent-tab>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Clés API</h2>
            <fluent-button id="addAPI" appearance="accent">+ Nouvelle Clé API</fluent-button>
          </div>

          <div class="info-banner">
            <span class="icon">🔐</span>
            <div>
              <strong>Sécurité API</strong>
              <p>Les clés API permettent l'accès programmatique aux données RH. Conservez-les en sécurité.</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Service</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date Création</th>
                  <th>Dernière Utilisation</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${apiKeys.map((api) => `
                  <tr>
                    <td><strong>${api.nom}</strong></td>
                    <td>${api.service}</td>
                    <td><code>${api.type}</code></td>
                    <td>
                      <fluent-badge fill="accent" color="${api.statut === 'Active' ? 'success' : 'danger'}">
                        ${api.statut}
                      </fluent-badge>
                    </td>
                    <td>${formatDate(api.dateCreation)}</td>
                    <td>${formatDate(api.derniereUtilisation)}</td>
                    <td>
                      <div class="permissions-list">
                        ${api.permissions.map((p) => `<code class="permission-tag">${p}</code>`).join(' ')}
                      </div>
                    </td>
                    <td>
                      <fluent-button appearance="stealth" size="small">🔄 Regénérer</fluent-button>
                      <fluent-button appearance="stealth" size="small">🗑️ Révoquer</fluent-button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Webhooks</h2>
            <fluent-button id="addWebhook" appearance="accent">+ Nouveau Webhook</fluent-button>
          </div>

          <div class="info-banner">
            <span class="icon">🔔</span>
            <div>
              <strong>Notifications en temps réel</strong>
              <p>Les webhooks envoient des notifications HTTP lorsque des événements se produisent dans Atlas HR.</p>
            </div>
          </div>

          <div class="data-grid">
            ${webhooks.map((hook) => `
              <div class="card webhook-card">
                <div class="card-header">
                  <div>
                    <strong>${hook.nom}</strong>
                    <code class="url-display">${hook.url}</code>
                  </div>
                  <fluent-badge fill="accent" color="${hook.statut === 'Actif' ? 'success' : 'danger'}">
                    ${hook.statut}
                  </fluent-badge>
                </div>

                <div class="webhook-events">
                  <strong>Événements déclencheurs:</strong>
                  <div class="events-list">
                    ${hook.evenements.map((evt) => `
                      <span class="event-tag">${evt}</span>
                    `).join('')}
                  </div>
                </div>

                <div class="webhook-security">
                  <div class="security-item">
                    <span class="label">Secret de signature:</span>
                    <code class="secret-display">${hook.secret}</code>
                    <fluent-button appearance="stealth" size="small">👁️ Afficher</fluent-button>
                  </div>
                </div>

                <div class="webhook-stats">
                  <div class="stat">
                    <span class="value">0</span>
                    <span class="label">Envois (24h)</span>
                  </div>
                  <div class="stat">
                    <span class="value">100%</span>
                    <span class="label">Taux succès</span>
                  </div>
                  <div class="stat">
                    <span class="value">-</span>
                    <span class="label">Dernier envoi</span>
                  </div>
                </div>

                <div class="card-actions">
                  <fluent-button appearance="stealth" size="small">📊 Logs</fluent-button>
                  <fluent-button appearance="stealth" size="small">🧪 Tester</fluent-button>
                  <fluent-button appearance="stealth" size="small">✏️ Modifier</fluent-button>
                  <fluent-button appearance="stealth" size="small">🗑️ Supprimer</fluent-button>
                </div>
              </div>
            `).join('')}
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="panel-header">
            <h2>Connecteurs Comptables</h2>
            <fluent-button id="addConnector" appearance="accent">+ Nouveau Connecteur</fluent-button>
          </div>

          <div class="connectors-grid">
            ${connecteursComptables.map((conn) => `
              <div class="card connector-card">
                <div class="card-header">
                  <div>
                    <strong>${conn.nom}</strong>
                    <small>${conn.type}</small>
                  </div>
                  <fluent-badge fill="accent" color="${conn.statut === 'Connecté' ? 'success' : 'danger'}">
                    ${conn.statut}
                  </fluent-badge>
                </div>

                <div class="sync-info">
                  <div class="sync-status">
                    <span class="icon">🔄</span>
                    <div>
                      <strong>Dernière synchronisation</strong>
                      <small>${new Date(conn.dernierSync).toLocaleString('fr-FR')}</small>
                    </div>
                  </div>
                </div>

                <div class="connector-params">
                  <strong>Paramètres de mapping:</strong>
                  <div class="params-grid">
                    ${Object.entries(conn.parametres).filter(([k]) => k !== 'apiUrl').map(([key, value]) => `
                      <div class="param-item">
                        <span class="param-key">${key}:</span>
                        <code class="param-value">${value}</code>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="connector-features">
                  <strong>Fonctionnalités:</strong>
                  <ul>
                    <li>✅ Export écritures paie vers journal comptable</li>
                    <li>✅ Synchronisation automatique mensuelle</li>
                    <li>✅ Réconciliation comptes de charges</li>
                    <li>⏳ Import budget prévisionnel (à venir)</li>
                  </ul>
                </div>

                <div class="card-actions">
                  <fluent-button appearance="accent" size="small">🔄 Synchroniser maintenant</fluent-button>
                  <fluent-button appearance="stealth" size="small">⚙️ Configurer</fluent-button>
                  <fluent-button appearance="stealth" size="small">📊 Historique</fluent-button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="available-connectors">
            <h3>Connecteurs Disponibles</h3>
            <div class="marketplace-grid">
              ${[
                { name: 'Sage 100 Cloud', logo: '📊', status: 'Connecté' },
                { name: 'Cegid', logo: '💼', status: 'Disponible' },
                { name: 'QuickBooks', logo: '📗', status: 'Disponible' },
                { name: 'Odoo', logo: '🔷', status: 'Disponible' },
                { name: 'Excel Online', logo: '📈', status: 'Bientôt' }
              ].map((connector) => `
                <div class="marketplace-item ${connector.status === 'Connecté' ? 'connected' : ''}">
                  <span class="connector-logo">${connector.logo}</span>
                  <strong>${connector.name}</strong>
                  <span class="connector-status">${connector.status}</span>
                  ${connector.status === 'Disponible' ? `
                    <fluent-button appearance="accent" size="small">Connecter</fluent-button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </fluent-tab-panel>

        <fluent-tab-panel>
          <div class="api-documentation">
            <h2>Documentation API Atlas HR Suite</h2>

            <div class="doc-section">
              <h3>🚀 Démarrage Rapide</h3>
              <p>L'API Atlas HR Suite est une API REST qui utilise JSON pour les échanges de données.</p>

              <h4>Base URL</h4>
              <code class="code-block">https://api.atlas-hr.local/v1</code>

              <h4>Authentication</h4>
              <p>Utilisez l'en-tête <code>Authorization</code> avec votre clé API:</p>
              <code class="code-block">Authorization: Bearer YOUR_API_KEY</code>
            </div>

            <div class="doc-section">
              <h3>📚 Endpoints Principaux</h3>

              <div class="endpoint-item">
                <div class="endpoint-header">
                  <span class="method get">GET</span>
                  <code>/employees</code>
                </div>
                <p>Liste tous les employés</p>
                <details>
                  <summary>Voir exemple</summary>
                  <pre class="code-example">
curl -X GET https://api.atlas-hr.local/v1/employees \\
  -H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </details>
              </div>

              <div class="endpoint-item">
                <div class="endpoint-header">
                  <span class="method post">POST</span>
                  <code>/employees</code>
                </div>
                <p>Créer un nouvel employé</p>
                <details>
                  <summary>Voir exemple</summary>
                  <pre class="code-example">
curl -X POST https://api.atlas-hr.local/v1/employees \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prenom": "Ahmed",
    "nom": "Benjelloun",
    "email": "ahmed@company.ma",
    "poste": "Développeur"
  }'
                  </pre>
                </details>
              </div>

              <div class="endpoint-item">
                <div class="endpoint-header">
                  <span class="method get">GET</span>
                  <code>/payroll/{period}</code>
                </div>
                <p>Récupérer les données de paie pour une période</p>
              </div>

              <div class="endpoint-item">
                <div class="endpoint-header">
                  <span class="method post">POST</span>
                  <code>/leaves</code>
                </div>
                <p>Créer une demande de congé</p>
              </div>
            </div>

            <div class="doc-section">
              <h3>🔔 Événements Webhook</h3>
              <ul>
                <li><code>employee.created</code> - Un nouvel employé a été créé</li>
                <li><code>employee.updated</code> - Un employé a été modifié</li>
                <li><code>employee.deleted</code> - Un employé a été supprimé</li>
                <li><code>leave.requested</code> - Une demande de congé a été soumise</li>
                <li><code>leave.approved</code> - Une demande de congé a été approuvée</li>
                <li><code>payroll.completed</code> - La paie a été clôturée</li>
              </ul>
            </div>

            <div class="doc-section">
              <h3>📖 Ressources</h3>
              <ul>
                <li><a href="#" target="_blank">Documentation complète API</a></li>
                <li><a href="#" target="_blank">Postman Collection</a></li>
                <li><a href="#" target="_blank">SDKs (Python, Node.js, PHP)</a></li>
                <li><a href="#" target="_blank">Support développeurs</a></li>
              </ul>
            </div>
          </div>
        </fluent-tab-panel>
      </fluent-tabs>
    `;

    container.querySelector('#addAPI')?.addEventListener('click', () => {
      showToast('Création clé API (à implémenter)');
    });

    container.querySelector('#addWebhook')?.addEventListener('click', () => {
      showToast('Création webhook (à implémenter)');
    });

    container.querySelector('#addConnector')?.addEventListener('click', () => {
      showToast('Ajout connecteur (à implémenter)');
    });
  }
};
