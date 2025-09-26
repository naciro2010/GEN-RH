import { useAtlasStore } from '../store/useAtlasStore';
import { formatMAD, formatNumber } from '../utils/format';

const TrainingPage = () => {
  const data = useAtlasStore((state) => state.data);
  const totalBudget = data.formations.reduce((sum, action) => sum + (action.budget || 0), 0);
  const totalParticipants = data.formations.reduce(
    (sum, action) => sum + action.sessions.reduce((acc, session) => acc + (session.participants || 0), 0),
    0
  );

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Plan de formation</h2>
          <span className="badge">
            Budget total {formatMAD(totalBudget)} – Participants {formatNumber(totalParticipants)}
          </span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {data.formations.map((action) => (
            <div className="data-card" key={action.id} style={{ padding: '1.4rem' }}>
              <div className="section-header">
                <h3>{action.intitule}</h3>
                <span className="badge">{formatMAD(action.budget)}</span>
              </div>
              <ul className="timeline">
                {action.sessions.map((session) => (
                  <li key={session.date}>
                    <strong>{session.date}</strong>
                    <small>
                      {session.lieu} – {session.participants} inscrits / {session.presence} présents – Évaluation {session.evaluation}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="data-card">
        <h3>Rappel TFP</h3>
        <p>
          La Taxe de Formation Professionnelle (TFP) représente {data.settings.payrollParams.cnss.tfp_pct_employeur || 1.6}%
          de la masse salariale et constitue un coût employeur affecté aux actions de formation. Utilisez les données ci-dessus pour piloter ce budget.
        </p>
      </section>
    </>
  );
};

export default TrainingPage;
