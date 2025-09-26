import { FormEvent, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';

const TimePage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Présent');
  const [motif, setMotif] = useState('');
  const [employeeId, setEmployeeId] = useState(data.employees[0]?.id ?? '');
  const [importText, setImportText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData((draft) => {
      draft.attendance.push({
        id: `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        employeeId,
        date,
        status,
        motif
      });
    });
    notify('Pointage ajouté', 'success');
    setMotif('');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    try {
      const rows = JSON.parse(importText);
      if (!Array.isArray(rows)) throw new Error('Format invalide');
      setData((draft) => {
        rows.forEach((row: any) => {
          draft.attendance.push({
            id: row.id || `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            employeeId: row.employeeId || row.EmployeeId,
            date: row.date || row.Date,
            status: row.status || row.Status,
            motif: row.motif || row.Motif || ''
          });
        });
      });
      notify('Import réussi', 'success');
      setImportText('');
    } catch (error) {
      console.error(error);
      notify('Import invalide', 'warn');
    }
  };

  const handleOvertimeSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setData((draft) => {
      Object.keys(draft.settings.payrollParams.overtime).forEach((key) => {
        const value = Number(formData.get(key));
        draft.settings.payrollParams.overtime[key as keyof typeof draft.settings.payrollParams.overtime] = value;
      });
    });
    notify('Règles mises à jour', 'success');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Temps & Pointage</h2>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Salarié</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Motif</th>
              </tr>
            </thead>
            <tbody>
              {data.attendance.map((row) => {
                const employee = data.employees.find((emp) => emp.id === row.employeeId);
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{employee ? `${employee.prenom} ${employee.nom}` : row.employeeId}</td>
                    <td>{row.date}</td>
                    <td>{row.status}</td>
                    <td>{row.motif}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-card">
        <h3>Ajouter une ligne de pointage</h3>
        <form className="grid" onSubmit={handleSubmit} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label>
            Salarié
            <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
              {data.employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.prenom} {emp.nom}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            Statut
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Présent">Présent</option>
              <option value="Absent">Absent</option>
              <option value="Retard">Retard</option>
            </select>
          </label>
          <label>
            Motif
            <input value={motif} onChange={(event) => setMotif(event.target.value)} />
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-pill">
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <section className="data-card">
        <h3>Importer (JSON)</h3>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Collez un tableau JSON (ID, employeeId, date, status, motif)"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-pill" onClick={handleImport}>
            Importer
          </button>
        </div>
      </section>

      <section className="data-card">
        <h3>Règles heures supplémentaires</h3>
        <form
          className="grid"
          onSubmit={handleOvertimeSave}
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
        >
          {Object.entries(data.settings.payrollParams.overtime).map(([key, value]) => (
            <label key={key}>
              {key}
              <input type="number" min="0" max="200" name={key} defaultValue={value} />
            </label>
          ))}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-pill">
              Enregistrer
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default TimePage;
