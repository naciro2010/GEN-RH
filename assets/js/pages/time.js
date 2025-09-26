import { getData, setData } from '../data/store.js';
import { showToast } from '../services/utils.js';

const renderAttendance = (container, data) => {
  const tbody = container.querySelector('#attendanceTable tbody');
  tbody.innerHTML = data.attendance
    .map(
      (row) => {
        const employee = data.employees.find((e) => e.id === row.employeeId);
        return `<tr><td>${row.id}</td><td>${employee ? employee.prenom + ' ' + employee.nom : row.employeeId}</td><td>${row.date}</td><td>${row.status}</td><td>${row.motif || ''}</td></tr>`;
      }
    )
    .join('');
};

const handleImport = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = window.XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = window.XLSX.utils.sheet_to_json(sheet, { defval: '' });
  setData((draft) => {
    json.forEach((item) => {
      draft.attendance.push({
        id: item.ID || `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        employeeId: item.EmployeeId || item.employeeId,
        date: item.Date || item.date,
        status: item.Status || item.status,
        motif: item.Motif || item.motif
      });
    });
  });
};

export const timeRoute = {
  id: 'temps',
  path: '#/temps',
  labelKey: 'nav.temps',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Temps & Pointage</h2>
          <div class="toolbar">
            <fluent-button appearance="accent" id="importAttendance">Importer XLSX</fluent-button>
            <input type="file" id="attendanceFile" accept=".xlsx,.csv" hidden />
          </div>
        </div>
        <div class="table-wrapper">
          <table class="fluent-table" id="attendanceTable">
            <thead><tr><th>ID</th><th>Salarié</th><th>Date</th><th>Statut</th><th>Motif</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="data-card">
        <h3>Ajouter une ligne de pointage</h3>
        <form id="attendanceForm" class="grid">
          <label>Salarié
            <fluent-select name="employeeId" required>
              ${data.employees.map((emp) => `<fluent-option value="${emp.id}">${emp.prenom} ${emp.nom}</fluent-option>`).join('')}
            </fluent-select>
          </label>
          <label>Date
            <fluent-text-field type="date" name="date" required value="${new Date().toISOString().slice(0, 10)}"></fluent-text-field>
          </label>
          <label>Statut
            <fluent-select name="status">
              <fluent-option value="Présent">Présent</fluent-option>
              <fluent-option value="Absent">Absent</fluent-option>
              <fluent-option value="Retard">Retard</fluent-option>
            </fluent-select>
          </label>
          <label>Motif
            <fluent-text-field name="motif"></fluent-text-field>
          </label>
          <div class="toolbar" style="grid-column: 1 / -1; justify-content: flex-end;">
            <fluent-button type="submit" appearance="accent">Ajouter</fluent-button>
          </div>
        </form>
      </section>

      <section class="data-card">
        <h3>Règles heures supplémentaires</h3>
        <p>Paramétrez les pourcentages d’augmentation applicables selon la configuration.</p>
        <form id="overtimeForm" class="grid">
          ${['jour_pct', 'nuit_pct', 'repos_pct', 'jourHebdo_pct']
            .map(
              (field) => `<label>${field.replace('_', ' ')}
                <fluent-number-field min="0" max="200" name="${field}" value="${data.settings.payrollParams.overtime[field]}"></fluent-number-field>
              </label>`
            )
            .join('')}
          <div class="toolbar" style="grid-column: 1 / -1; justify-content: flex-end;">
            <fluent-button type="submit" appearance="accent">Enregistrer</fluent-button>
          </div>
        </form>
      </section>
    `;

    renderAttendance(container, data);

    container.querySelector('#attendanceForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setData((draft) => {
        draft.attendance.push({
          id: `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          employeeId: form.get('employeeId'),
          date: form.get('date'),
          status: form.get('status'),
          motif: form.get('motif')
        });
      });
      renderAttendance(container, getData());
      showToast('Pointage ajouté');
      event.currentTarget.reset();
    });

    const fileInput = container.querySelector('#attendanceFile');
    container.querySelector('#importAttendance').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      await handleImport(file);
      renderAttendance(container, getData());
      showToast('Import réalisé');
      fileInput.value = '';
    });

    container.querySelector('#overtimeForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setData((draft) => {
        Object.keys(draft.settings.payrollParams.overtime).forEach((field) => {
          draft.settings.payrollParams.overtime[field] = Number(form.get(field));
        });
      });
      showToast('Règles mises à jour');
    });
  }
};
