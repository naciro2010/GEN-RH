import { useMemo } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { simulatePayroll } from '../services/payroll';
import { formatMAD, formatNumber } from '../utils/format';

const DashboardPage = () => {
  const data = useAtlasStore((state) => state.data);

  const payrollSim = useMemo(() => {
    return simulatePayroll(
      data.employees,
      data.payrollVariables.variables as any,
      data.settings.payrollParams
    );
  }, [data]);

  const hiresInProgress = useMemo(
    () =>
      data.offers.reduce(
        (acc, offer) => acc + (offer.pipeline.Offre?.length || 0) + (offer.pipeline.Embauche?.length || 0),
        0
      ),
    [data.offers]
  );

  const today = new Date().toISOString().slice(0, 10);
  const absToday = data.attendance.filter((item) => item.date === today && item.status?.toLowerCase() === 'absent').length;

  const upcomingTraining = data.formations.reduce((count, formation) => {
    return (
      count + formation.sessions.filter((session) => new Date(session.date) >= new Date()).length
    );
  }, 0);

  return (
    <>
      <section className="grid kpi">
        <div className="kpi-card">
          <span className="badge">Embauches en cours</span>
          <strong>{formatNumber(hiresInProgress)}</strong>
        </div>
        <div className="kpi-card">
          <span className="badge">Absences du jour</span>
          <strong>{formatNumber(absToday)}</strong>
        </div>
        <div className="kpi-card">
          <span className="badge">Masse salariale du mois</span>
          <strong>{formatMAD(payrollSim.masseSalariale)}</strong>
        </div>
        <div className="kpi-card">
          <span className="badge">Sessions de formation à venir</span>
          <strong>{formatNumber(upcomingTraining)}</strong>
        </div>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h2>Tableau de bord</h2>
          <div className="quick-links">
            <button type="button" className="btn-pill" onClick={() => window.open('#/app/recrutement', '_self')}>
              Recruter
            </button>
            <button type="button" className="btn-pill" onClick={() => window.open('#/app/paie', '_self')}>
              Lancer paie
            </button>
            <button
              type="button"
              className="btn-pill"
              onClick={() => window.open('https://www.cnss.ma/fr/tele-services', '_blank')}
            >
              Déclarer CNSS
            </button>
            <button
              type="button"
              className="btn-pill"
              onClick={() => window.open('https://simpl-ir.tax.gov.ma/', '_blank')}
            >
              SIMPL-IR
            </button>
          </div>
        </div>
        <div className="grid">
          <div>
            <h3>Pipeline recrutement</h3>
            <ul className="timeline">
              {data.offers.map((offer) => (
                <li key={offer.id}>
                  <strong>{offer.titre}</strong>
                  <small>
                    {formatNumber(offer.pipeline.Entretien?.length || 0)} entretiens,{' '}
                    {formatNumber(offer.pipeline.Test?.length || 0)} tests
                  </small>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Alertes paie & conformité</h3>
            <ul className="timeline">
              <li>
                <strong>SIMPL-IR</strong>
                <small>Échéance prochaine : 30/05</small>
              </li>
              <li>
                <strong>Damancom</strong>
                <small>Déclaration prévisionnelle prête</small>
              </li>
              <li>
                <strong>Loi 09-08</strong>
                <small>Audit accès data prévu S3</small>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
