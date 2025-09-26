import { getData, setData, resetData } from '../data/store.js';
import { setLocale } from '../i18n.js';
import { ensureDir, showToast } from '../services/utils.js';

export const adminRoute = {
  id: 'admin',
  path: '#/admin',
  labelKey: 'nav.admin',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Administration</h2>
          <fluent-button id="resetData" appearance="stealth">Réinitialiser jeu de données</fluent-button>
        </div>
        <form id="adminForm" class="grid">
          <label>Thème
            <fluent-select name="theme" value="${data.settings.theme}">
              <fluent-option value="light">Clair</fluent-option>
              <fluent-option value="dark">Sombre</fluent-option>
            </fluent-select>
          </label>
          <label>Langue / لغة
            <fluent-select name="locale" value="${data.settings.locale}">
              <fluent-option value="fr">Français</fluent-option>
              <fluent-option value="ar">العربية</fluent-option>
            </fluent-select>
          </label>
          <label>Période conservation (années)
            <fluent-number-field name="retention" min="1" value="${data.settings.legalRetentionYears}"></fluent-number-field>
          </label>
          <label>Rôles (séparés par ;)
            <fluent-text-area name="roles">${data.settings.roles.join('; ')}</fluent-text-area>
          </label>
          <label>Connecteur Graph (statut)
            <fluent-text-field name="graph" value="${data.settings.connectors.graph.status}"></fluent-text-field>
          </label>
          <div class="toolbar" style="grid-column:1 / -1; justify-content:flex-end;">
            <fluent-button type="submit" appearance="accent">Enregistrer</fluent-button>
          </div>
        </form>
      </section>
    `;

    container.querySelector('#adminForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const locale = form.get('locale');
      const theme = form.get('theme');
      setData((draft) => {
        draft.settings.locale = locale;
        draft.settings.theme = theme;
        draft.settings.legalRetentionYears = Number(form.get('retention'));
        draft.settings.roles = (form.get('roles') || '')
          .split(';')
          .map((r) => r.trim())
          .filter(Boolean);
        draft.settings.connectors.graph.status = form.get('graph');
      });
      setLocale(locale);
      ensureDir(locale === 'ar');
      document.documentElement.dataset.theme = theme;
      showToast('Paramètres admin enregistrés');
    });

    container.querySelector('#resetData').addEventListener('click', () => {
      if (confirm('Réinitialiser les données de démonstration ?')) {
        resetData();
        showToast('Jeu de données réinitialisé');
      }
    });
  }
};
