import { getData, setData } from '../data/store.js';
import { formatMAD, maskCnie, showToast } from '../services/utils.js';

const renderTable = (container, data) => {
  const tbody = container.querySelector('#employeesTable tbody');
  tbody.innerHTML = data.employees
    .map(
      (emp) => `
        <tr data-id="${emp.id}">
          <td>${emp.id}</td>
          <td>${emp.prenom} ${emp.nom}</td>
          <td>${emp.poste}</td>
          <td>${emp.department}</td>
          <td>${formatMAD(emp.salaireBase)}</td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('tr').forEach((row) => {
    row.addEventListener('click', () => {
      const selected = data.employees.find((emp) => emp.id === row.dataset.id);
      renderDetail(container, selected);
    });
  });

  if (data.employees[0]) {
    renderDetail(container, data.employees[0]);
  }
};

const renderDetail = (container, employee) => {
  const detail = container.querySelector('#employeeDetail');
  if (!employee) {
    detail.innerHTML = '<p>Sélectionnez un salarié</p>';
    return;
  }
  detail.innerHTML = `
    <h3>${employee.prenom} ${employee.nom}</h3>
    <form id="employeeForm" class="grid">
      <input type="hidden" name="id" value="${employee.id}" />
      <label>Poste
        <fluent-text-field name="poste" value="${employee.poste || ''}"></fluent-text-field>
      </label>
      <label>Département
        <fluent-text-field name="department" value="${employee.department || ''}"></fluent-text-field>
      </label>
      <label>Salaire de base (MAD)
        <fluent-number-field name="salaireBase" value="${employee.salaireBase || 0}" min="0"></fluent-number-field>
      </label>
      <label>Primes
        <fluent-number-field name="primes" value="${employee.primes || 0}" min="0"></fluent-number-field>
      </label>
      <label>CNIE
        <fluent-text-field name="cnie" value="${employee.cnie || ''}"></fluent-text-field>
      </label>
      <label>CNSS
        <fluent-text-field name="cnss" value="${employee.cnss || ''}"></fluent-text-field>
      </label>
      <label>RIB
        <fluent-text-field name="rib" value="${employee.rib || ''}"></fluent-text-field>
      </label>
      <label>Adresse
        <fluent-text-area name="adresse">${employee.adresse || ''}</fluent-text-area>
      </label>
      <label>ICE/IF
        <fluent-text-field name="ice" value="${employee.ice || ''}"></fluent-text-field>
      </label>
      <label>Situation familiale
        <fluent-text-field name="situationFamiliale" value="${employee.situationFamiliale || ''}"></fluent-text-field>
      </label>
      <label>CIMR
        <fluent-switch name="cimr" ${employee.cimr ? 'checked' : ''}></fluent-switch>
      </label>
      <label>Ayants droit (séparés par ;)
        <fluent-text-area name="ayantsDroit">${employee.ayantsDroit?.join('; ') || ''}</fluent-text-area>
      </label>
      <div class="toolbar" style="grid-column: 1 / -1; justify-content: flex-end;">
        <fluent-button type="submit" appearance="accent">Enregistrer</fluent-button>
      </div>
    </form>
    <div class="data-card">
      <h4>Documents liés</h4>
      <ul>
        <li>Contrat ${employee.contrat || 'CDI'} – ${employee.dateEmbauche || 'à préciser'}</li>
        <li>Attestation CNSS générée le ${new Date().toLocaleDateString('fr-FR')}</li>
      </ul>
      <h4>Journal d’accès</h4>
      <ul>
        <li>${new Date().toLocaleString('fr-FR')} – Consultation par Admin RH</li>
        <li>${new Date(Date.now() - 86400000).toLocaleString('fr-FR')} – Export bulletin</li>
      </ul>
    </div>
  `;

  detail.querySelector('#employeeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = form.get('id');
    setData((draft) => {
      const target = draft.employees.find((emp) => emp.id === id);
      if (!target) return;
      target.poste = form.get('poste');
      target.department = form.get('department');
      target.salaireBase = Number(form.get('salaireBase') || 0);
      target.primes = Number(form.get('primes') || 0);
      target.cnie = form.get('cnie');
      target.cnieMasquee = maskCnie(form.get('cnie'));
      target.cnss = form.get('cnss');
      target.rib = form.get('rib');
      target.adresse = form.get('adresse');
      target.ice = form.get('ice');
      target.situationFamiliale = form.get('situationFamiliale');
      target.cimr = form.get('cimr') === 'on' || form.get('cimr') === true;
      target.ayantsDroit = (form.get('ayantsDroit') || '')
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean);
    });
    showToast('Salarié mis à jour');
  });
};

export const employeesRoute = {
  id: 'salaries',
  path: '#/salaries',
  labelKey: 'nav.salaries',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Salariés</h2>
          <fluent-button id="addEmployee" appearance="accent">Ajouter</fluent-button>
        </div>
        <div class="table-wrapper">
          <table class="fluent-table" id="employeesTable">
            <thead>
              <tr><th>ID</th><th>Nom</th><th>Poste</th><th>Département</th><th>Salaire</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
      <section class="data-card" id="employeeDetail"></section>
    `;

    renderTable(container, data);

    container.querySelector('#addEmployee').addEventListener('click', () => {
      const id = prompt('Identifiant ?');
      const prenom = prompt('Prénom ?');
      const nom = prompt('Nom ?');
      if (!prenom || !nom) return;
      setData((draft) => {
        draft.employees.push({
          id: id || `EMP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          prenom,
          nom,
          poste: 'Nouveau poste',
          department: 'À définir',
          salaireBase: 8000,
          primes: 0,
          cnss: '',
          cnie: '',
          cnieMasquee: '',
          rib: '',
          adresse: '',
          ice: '',
          if: '',
          situationFamiliale: '',
          contrat: 'CDI',
          dateEmbauche: new Date().toISOString().slice(0, 10),
          cimr: false,
          ayantsDroit: []
        });
      });
      renderTable(container, getData());
      showToast('Salarié ajouté');
    });
  }
};
