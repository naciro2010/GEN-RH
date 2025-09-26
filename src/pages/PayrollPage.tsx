import { FormEvent, useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { simulatePayroll } from '../services/payroll';
import { formatMAD, formatNumber } from '../utils/format';
import { downloadFile } from '../utils/download';
import { useToast } from '../components/ui/ToastProvider';
import type { AtlasData } from '../data/defaultData';

const PayrollPage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();
  type PayrollVar = {
    heuresSup?: Partial<{ jour: number; nuit: number; repos: number; jourHebdo: number }>;
    primes?: number;
    absences?: number;
  };
  const payrollVariables = data.payrollVariables.variables as Record<string, PayrollVar>;
  const [simulation, setSimulation] = useState(() =>
    simulatePayroll(data.employees, payrollVariables, data.settings.payrollParams)
  );
  const [baremeText, setBaremeText] = useState(
    JSON.stringify(data.settings.payrollParams.ir_bareme_2025, null, 2)
  );
  const [ancienneteText, setAncienneteText] = useState(
    JSON.stringify(data.settings.payrollParams.prime_anciennete, null, 2)
  );

  const cnssKeys = useMemo(() => Object.keys(data.settings.payrollParams.cnss), [data.settings.payrollParams.cnss]);

  const handleCnssChange = (key: string, value: number) => {
    setData((draft) => {
      const record = draft.settings.payrollParams.cnss as Record<string, number>;
      record[key] = value;
    });
  };

  const handleSaveParams = (event: FormEvent) => {
    event.preventDefault();
    try {
      const bareme = JSON.parse(baremeText);
      const anciennete = JSON.parse(ancienneteText);
      setData((draft) => {
        draft.settings.payrollParams.ir_bareme_2025 = bareme;
        draft.settings.payrollParams.prime_anciennete = anciennete;
      });
      notify('Paramètres enregistrés', 'success');
    } catch (error) {
      console.error(error);
      notify('JSON invalide', 'warn');
    }
  };

  const handleRunSimulation = () => {
    const fresh = simulatePayroll(data.employees, payrollVariables, data.settings.payrollParams);
    setSimulation(fresh);
    notify('Simulation recalculée', 'success');
  };

  const handleExportCnss = () => {
    const rows = simulation.results.map((row) => ({
      Employe: row.nom,
      Brut: row.brut,
      Retenues_CNSS: row.cnss.totalRetenuesSalarie
    }));
    downloadFile(JSON.stringify(rows, null, 2), 'cnss-damancom.json', 'application/json');
    notify('Export CNSS généré');
  };

  const handleExportSimpl = () => {
    const rows = simulation.results.map((row) => ({ Employe: row.nom, BaseIR: row.baseImposable, IR: row.ir }));
    const xml = `<SIMPLIR>${rows
      .map((row) => `<LIGNE nom="${row.Employe}" base="${row.BaseIR}" ir="${row.IR}" />`)
      .join('')}</SIMPLIR>`;
    downloadFile(xml, 'simpl-ir.xml', 'application/xml');
    notify('Fichier SIMPL-IR généré');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Simulation de paie</h2>
          <button type="button" className="btn-pill" onClick={handleRunSimulation}>
            Lancer simulation
          </button>
        </div>
        <form className="grid" onSubmit={handleSaveParams} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div>
            <h4>Paramètres CNSS</h4>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {cnssKeys.map((key) => (
                <label key={key}>
                  {key}
                  <input
                    type="number"
                    step="0.01"
                    value={(data.settings.payrollParams.cnss as Record<string, number>)[key] ?? 0}
                    onChange={(event) => handleCnssChange(key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="grid">
            <label>
              Barème IR (JSON)
              <textarea value={baremeText} onChange={(event) => setBaremeText(event.target.value)} rows={8} />
            </label>
            <label>
              Prime ancienneté (JSON)
              <textarea value={ancienneteText} onChange={(event) => setAncienneteText(event.target.value)} rows={6} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-pill">
                Enregistrer paramètres
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Variables du mois ({data.payrollVariables.currentPeriod})</h3>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>Salarié</th>
                <th>HS 25%</th>
                <th>HS 50%</th>
                <th>Repos</th>
                <th>Jour hebdo</th>
                <th>Primes</th>
                <th>Absences</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map((employee) => {
                const vars = payrollVariables[employee.id] || { heuresSup: {}, primes: 0, absences: 0 };
                return (
                  <tr key={employee.id}>
                    <td>
                      {employee.prenom} {employee.nom}
                    </td>
                    <td>{formatNumber(vars.heuresSup?.jour || 0)}</td>
                    <td>{formatNumber(vars.heuresSup?.nuit || 0)}</td>
                    <td>{formatNumber(vars.heuresSup?.repos || 0)}</td>
                    <td>{formatNumber(vars.heuresSup?.jourHebdo || 0)}</td>
                    <td>{formatMAD(vars.primes || 0)}</td>
                    <td>{formatNumber(vars.absences || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Résultats simulation</h3>
          <span className="badge">Masse salariale : {formatMAD(simulation.masseSalariale)}</span>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>Salarié</th>
                <th>Brut</th>
                <th>CNSS</th>
                <th>IR</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {simulation.results.map((row) => (
                <tr key={row.employeeId}>
                  <td>{row.nom}</td>
                  <td>{formatMAD(row.brut)}</td>
                  <td>{formatMAD(row.cnss.totalRetenuesSalarie)}</td>
                  <td>{formatMAD(row.ir)}</td>
                  <td>{formatMAD(row.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn-pill" onClick={handleExportCnss}>
            Export CNSS
          </button>
          <button type="button" className="btn-pill" onClick={handleExportSimpl}>
            SIMPL-IR
          </button>
        </div>
      </section>
    </>
  );
};

export default PayrollPage;
