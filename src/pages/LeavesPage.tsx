import { useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
import { formatDate } from '../utils/format';

const LeavesPage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();
  const [sector, setSector] = useState<'private' | 'public'>('private');

  const handleStatusChange = (id: string, value: string) => {
    setData((draft) => {
      const leave = draft.leaves.find((item) => item.id === id);
      if (leave) leave.statut = value;
    });
    notify('Statut mis à jour', 'success');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Congés</h2>
          <span className="badge">{data.leaves.length} demandes</span>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Salarié</th>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {data.leaves.map((leave) => {
                const employee = data.employees.find((emp) => emp.id === leave.employeeId);
                return (
                  <tr key={leave.id}>
                    <td>{leave.id}</td>
                    <td>{employee ? `${employee.prenom} ${employee.nom}` : leave.employeeId}</td>
                    <td>{leave.type}</td>
                    <td>{leave.debut}</td>
                    <td>{leave.fin}</td>
                    <td>
                      <select value={leave.statut} onChange={(event) => handleStatusChange(leave.id, event.target.value)}>
                        <option value="En attente">En attente</option>
                        <option value="Approuvé">Approuvé</option>
                        <option value="Refusé">Refusé</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Calendrier jours fériés</h3>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className={`btn-pill ${sector === 'private' ? 'is-active' : ''}`}
              onClick={() => setSector('private')}
            >
              Secteur privé
            </button>
            <button
              type="button"
              className={`btn-pill ${sector === 'public' ? 'is-active' : ''}`}
              onClick={() => setSector('public')}
            >
              Secteur public
            </button>
          </div>
        </div>
        <ul className="timeline">
          {data.settings.holidays[sector].map((holiday) => (
            <li key={holiday.date}>
              <strong>{formatDate(holiday.date)}</strong>
              <small>{holiday.label}</small>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default LeavesPage;
