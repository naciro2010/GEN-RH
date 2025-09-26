import { FormEvent, useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { maskCnie, formatMAD } from '../utils/format';
import { useToast } from '../components/ui/ToastProvider';
import type { Employee } from '../types/atlas';

const EmployeesPage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();
  const [selectedId, setSelectedId] = useState<string>(data.employees[0]?.id ?? '');

  const selectedEmployee = useMemo(
    () => data.employees.find((employee) => employee.id === selectedId),
    [data.employees, selectedId]
  );

  const handleSelect = (employee: Employee) => {
    setSelectedId(employee.id);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setData((draft) => {
      const target = draft.employees.find((employee) => employee.id === selectedId);
      if (!target) return;
      target.poste = String(payload.poste || '');
      target.department = String(payload.department || '');
      target.salaireBase = Number(payload.salaireBase || 0);
      target.primes = Number(payload.primes || 0);
      target.cnie = String(payload.cnie || '');
      target.cnieMasquee = maskCnie(target.cnie);
      target.cnss = String(payload.cnss || '');
      target.rib = String(payload.rib || '');
      target.adresse = String(payload.adresse || '');
      target.ice = String(payload.ice || '');
      target.situationFamiliale = String(payload.situationFamiliale || '');
      target.cimr = payload.cimr === 'on';
      target.ayantsDroit = String(payload.ayantsDroit || '')
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean);
    });

    notify('Salarié mis à jour', 'success');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Salariés</h2>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Poste</th>
                <th>Département</th>
                <th>Salaire</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: employee.id === selectedId ? 'rgba(81, 170, 250, 0.16)' : undefined
                  }}
                >
                  <td>{employee.id}</td>
                  <td>
                    {employee.prenom} {employee.nom}
                  </td>
                  <td>{employee.poste}</td>
                  <td>{employee.department}</td>
                  <td>{formatMAD(employee.salaireBase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-card">
        {selectedEmployee ? (
          <form className="grid" onSubmit={handleSubmit} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <h3 style={{ gridColumn: '1 / -1' }}>
              {selectedEmployee.prenom} {selectedEmployee.nom}
            </h3>
            <input type="hidden" name="id" value={selectedEmployee.id} />
            <label>
              Poste
              <input name="poste" defaultValue={selectedEmployee.poste} />
            </label>
            <label>
              Département
              <input name="department" defaultValue={selectedEmployee.department} />
            </label>
            <label>
              Salaire de base (MAD)
              <input name="salaireBase" type="number" min="0" defaultValue={selectedEmployee.salaireBase} />
            </label>
            <label>
              Primes
              <input name="primes" type="number" min="0" defaultValue={selectedEmployee.primes} />
            </label>
            <label>
              CNIE
              <input name="cnie" defaultValue={selectedEmployee.cnie} />
            </label>
            <label>
              CNSS
              <input name="cnss" defaultValue={selectedEmployee.cnss} />
            </label>
            <label>
              RIB
              <input name="rib" defaultValue={selectedEmployee.rib} />
            </label>
            <label>
              Adresse
              <textarea name="adresse" defaultValue={selectedEmployee.adresse} />
            </label>
            <label>
              ICE / IF
              <input name="ice" defaultValue={selectedEmployee.ice} />
            </label>
            <label>
              Situation familiale
              <input name="situationFamiliale" defaultValue={selectedEmployee.situationFamiliale} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input type="checkbox" name="cimr" defaultChecked={selectedEmployee.cimr} /> CIMR
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              Ayants droit (séparés par ;)
              <textarea name="ayantsDroit" defaultValue={selectedEmployee.ayantsDroit?.join('; ') ?? ''} />
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-pill">
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <p>Sélectionnez un salarié</p>
        )}
      </section>
    </>
  );
};

export default EmployeesPage;
