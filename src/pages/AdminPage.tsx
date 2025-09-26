import { FormEvent, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';

const AdminPage = () => {
  const { data, setData, reset } = useAtlasStore((state) => ({
    data: state.data,
    setData: state.setData,
    reset: state.reset
  }));
  const { notify } = useToast();
  const [theme, setTheme] = useState(data.settings.theme);
  const [locale, setLocale] = useState(data.settings.locale);
  const [retention, setRetention] = useState(String(data.settings.legalRetentionYears));
  const [roles, setRoles] = useState(data.settings.roles.join('; '));
  const [graphStatus, setGraphStatus] = useState(data.settings.connectors.graph.status);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData((draft) => {
      draft.settings.theme = theme as 'light' | 'dark';
      draft.settings.locale = locale as 'fr' | 'ar';
      draft.settings.rtl = locale === 'ar';
      draft.settings.legalRetentionYears = Number(retention) || 5;
      draft.settings.roles = roles
        .split(';')
        .map((role) => role.trim())
        .filter(Boolean);
      draft.settings.connectors.graph.status = graphStatus;
    });
    notify('Paramètres admin enregistrés', 'success');
  };

  const handleReset = () => {
    if (confirm('Réinitialiser les données de démonstration ?')) {
      reset();
      notify('Jeu de données réinitialisé', 'success');
    }
  };

  return (
    <section className="data-card">
      <div className="section-header">
        <h2>Administration</h2>
        <button type="button" className="btn-pill" onClick={handleReset}>
          Réinitialiser jeu de données
        </button>
      </div>
      <form className="grid" onSubmit={handleSubmit} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label>
          Thème
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </label>
        <label>
          Langue / لغة
          <select value={locale} onChange={(event) => setLocale(event.target.value)}>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <label>
          Période conservation (années)
          <input value={retention} onChange={(event) => setRetention(event.target.value)} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Rôles (séparés par ;)
          <textarea value={roles} onChange={(event) => setRoles(event.target.value)} rows={4} />
        </label>
        <label>
          Connecteur Graph (statut)
          <input value={graphStatus} onChange={(event) => setGraphStatus(event.target.value)} />
        </label>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-pill">
            Enregistrer
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminPage;
