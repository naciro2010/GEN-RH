import { getData, setData } from '../data/store.js';
import { showToast } from '../services/utils.js';

const renderLeaves = (container, data) => {
  const tbody = container.querySelector('#leaveTable tbody');
  tbody.innerHTML = data.leaves
    .map((leave) => {
      const employee = data.employees.find((e) => e.id === leave.employeeId);
      return `
        <tr data-id="${leave.id}">
          <td>${leave.id}</td>
          <td>${employee ? employee.prenom + ' ' + employee.nom : leave.employeeId}</td>
          <td>${leave.type}</td>
          <td>${leave.debut}</td>
          <td>${leave.fin}</td>
          <td><fluent-select data-status>
            <fluent-option value="En attente" ${leave.statut === 'En attente' ? 'selected' : ''}>En attente</fluent-option>
            <fluent-option value="Approuvé" ${leave.statut === 'Approuvé' ? 'selected' : ''}>Approuvé</fluent-option>
            <fluent-option value="Refusé" ${leave.statut === 'Refusé' ? 'selected' : ''}>Refusé</fluent-option>
          </fluent-select></td>
        </tr>
      `;
    })
    .join('');

  tbody.querySelectorAll('[data-status]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const row = event.target.closest('tr');
      const id = row.dataset.id;
      const value = event.target.value;
      setData((draft) => {
        const leave = draft.leaves.find((item) => item.id === id);
        if (leave) leave.statut = value;
      });
      showToast('Statut mis à jour');
    });
  });
};

const renderHolidays = (container, data, sector) => {
  const list = container.querySelector('#holidayList');
  list.innerHTML = data.settings.holidays[sector]
    .map((holiday) => `<li>${holiday.date} – ${holiday.label}</li>`)
    .join('');
};

export const leavesRoute = {
  id: 'conges',
  path: '#/conges',
  labelKey: 'nav.conges',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Congés</h2>
          <fluent-button id="addLeave" appearance="accent">Ajouter</fluent-button>
        </div>
        <div class="table-wrapper">
          <table class="fluent-table" id="leaveTable">
            <thead><tr><th>ID</th><th>Salarié</th><th>Type</th><th>Début</th><th>Fin</th><th>Statut</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="data-card">
        <div class="flex-between">
          <h3>Calendrier jours fériés</h3>
          <fluent-radio-group id="holidaySector" orientation="horizontal" value="private">
            <fluent-radio value="private">Secteur privé</fluent-radio>
            <fluent-radio value="public">Secteur public</fluent-radio>
          </fluent-radio-group>
        </div>
        <ul id="holidayList"></ul>
      </section>
    `;

    renderLeaves(container, data);
    renderHolidays(container, data, 'private');

    container.querySelector('#holidaySector').addEventListener('change', (event) => {
      renderHolidays(container, getData(), event.target.value);
    });

    container.querySelector('#addLeave').addEventListener('click', () => {
      const employeeId = prompt('ID salarié ?');
      const type = prompt('Type de congé ?');
      const debut = prompt('Date début (YYYY-MM-DD) ?');
      const fin = prompt('Date fin (YYYY-MM-DD) ?');
      if (!employeeId || !debut || !fin) return;
      setData((draft) => {
        draft.leaves.push({
          id: `LV-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          employeeId,
          type: type || 'Annuel',
          debut,
          fin,
          statut: 'En attente',
          approbateur: ''
        });
      });
      renderLeaves(container, getData());
      showToast('Demande ajoutée');
    });
  }
};
