import { getData, setData } from '../data/store.js';
import { simulatePayroll } from '../services/payroll.js';
import { exportDocxFromTemplate, exportXlsx, openExcelOnlinePlaceholder } from '../services/exports.js';
import { formatMAD, showToast } from '../services/utils.js';

let lastSimulation = null;

const renderVariables = (container, data) => {
  const tbody = container.querySelector('#variablesTable tbody');
  tbody.innerHTML = data.employees
    .map((emp) => {
      const vars = data.payrollVariables.variables[emp.id] || { heuresSup: {}, primes: 0, absences: 0 };
      return `
        <tr data-id="${emp.id}">
          <td>${emp.prenom} ${emp.nom}</td>
          <td><fluent-number-field name="jour" value="${vars.heuresSup?.jour || 0}" min="0"></fluent-number-field></td>
          <td><fluent-number-field name="nuit" value="${vars.heuresSup?.nuit || 0}" min="0"></fluent-number-field></td>
          <td><fluent-number-field name="repos" value="${vars.heuresSup?.repos || 0}" min="0"></fluent-number-field></td>
          <td><fluent-number-field name="jourHebdo" value="${vars.heuresSup?.jourHebdo || 0}" min="0"></fluent-number-field></td>
          <td><fluent-number-field name="primes" value="${vars.primes || 0}" min="0"></fluent-number-field></td>
          <td><fluent-number-field name="absences" value="${vars.absences || 0}" min="0"></fluent-number-field></td>
        </tr>
      `;
    })
    .join('');

  tbody.querySelectorAll('fluent-number-field').forEach((input) => {
    input.addEventListener('change', () => {
      const row = input.closest('tr');
      const empId = row.dataset.id;
      const inputs = row.querySelectorAll('fluent-number-field');
      const values = {};
      inputs.forEach((field) => {
        values[field.name] = Number(field.value || 0);
      });
      setData((draft) => {
        draft.payrollVariables.variables[empId] = draft.payrollVariables.variables[empId] || { heuresSup: {} };
        draft.payrollVariables.variables[empId].heuresSup = {
          jour: values.jour,
          nuit: values.nuit,
          repos: values.repos,
          jourHebdo: values.jourHebdo
        };
        draft.payrollVariables.variables[empId].primes = values.primes;
        draft.payrollVariables.variables[empId].absences = values.absences;
      });
    });
  });
};

const renderSimulation = (container, data) => {
  const resultZone = container.querySelector('#payrollResults');
  if (!lastSimulation) {
    resultZone.innerHTML = '<p>Lancez une simulation pour voir les résultats.</p>';
    return;
  }
  resultZone.innerHTML = `
    <div class="section-header">
      <h3>Résultats</h3>
      <span class="badge">Masse salariale : ${formatMAD(lastSimulation.masseSalariale)}</span>
    </div>
    <div class="table-wrapper">
      <table class="fluent-table">
        <thead><tr><th>Salarié</th><th>Brut</th><th>CNSS</th><th>IR</th><th>Net</th></tr></thead>
        <tbody>
          ${lastSimulation.results
            .map(
              (row) => `
                <tr data-id="${row.employeeId}">
                  <td>${row.nom}</td>
                  <td>${formatMAD(row.brut)}</td>
                  <td>${formatMAD(row.cnss.totalRetenuesSalarie)}</td>
                  <td>${formatMAD(row.ir)}</td>
                  <td>${formatMAD(row.net)}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="toolbar">
      <fluent-button id="exportPayrollXlsx" appearance="accent">Exporter Excel</fluent-button>
      <fluent-button id="exportPayrollDocx" appearance="stealth">Bulletin Word</fluent-button>
    </div>
  `;

  resultZone.querySelector('#exportPayrollXlsx').addEventListener('click', () => {
    const rows = lastSimulation.results.map((row) => ({
      Employe: row.nom,
      Brut: row.brut,
      Retenues_CNSS: row.cnss.totalRetenuesSalarie,
      IR: row.ir,
      Net: row.net
    }));
    exportXlsx({ sheetName: 'Simulation', data: rows, fileName: 'simulation-paie.xlsx' });
  });

  resultZone.querySelector('#exportPayrollDocx').addEventListener('click', async () => {
    const first = lastSimulation.results[0];
    if (!first) return;
    await exportDocxFromTemplate('Bulletin de paie', {
      nom: first.nom,
      brut: formatMAD(first.brut),
      retenues: formatMAD(first.cnss.totalRetenuesSalarie + first.ir),
      net: formatMAD(first.net)
    }, `Bulletin-${first.nom}.docx`);
  });
};

export const payrollRoute = {
  id: 'paie',
  path: '#/paie',
  labelKey: 'nav.paie',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Simulation de paie</h2>
          <fluent-button id="runSimulation" appearance="accent">Lancer simulation</fluent-button>
        </div>
        <div class="grid" id="paramGrid">
          <div>
            <h4>Paramètres CNSS</h4>
            ${Object.entries(data.settings.payrollParams.cnss)
              .map(
                ([key, value]) => `
                  <label>${key}
                    <fluent-number-field data-cnss="${key}" value="${value}" step="0.01"></fluent-number-field>
                  </label>
                `
              )
              .join('')}
          </div>
          <div>
            <h4>Barème IR (JSON)</h4>
            <fluent-text-area id="baremeInput" rows="6">${JSON.stringify(data.settings.payrollParams.ir_bareme_2025)}</fluent-text-area>
            <h4>Prime ancienneté (JSON)</h4>
            <fluent-text-area id="ancienneteInput" rows="4">${JSON.stringify(data.settings.payrollParams.prime_anciennete)}</fluent-text-area>
          </div>
        </div>
        <div class="toolbar" style="justify-content:flex-end">
          <fluent-button id="saveParams" appearance="stealth">Enregistrer paramètres</fluent-button>
        </div>
      </section>

      <section class="data-card">
        <div class="section-header">
          <h3>Variables du mois (${data.payrollVariables.currentPeriod})</h3>
        </div>
        <div class="table-wrapper">
          <table class="fluent-table" id="variablesTable">
            <thead><tr><th>Salarié</th><th>HS 25%</th><th>HS 50%</th><th>Repos</th><th>Jour hebdo</th><th>Primes</th><th>Absences</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </section>

      <section class="data-card" id="payrollResults"></section>

      <section class="data-card">
        <h3>Exports déclaratifs</h3>
        <div class="toolbar">
          <fluent-button id="exportCnss" appearance="accent">CNSS / Damancom</fluent-button>
          <fluent-button id="openCnss" appearance="stealth">Ouvrir portail CNSS</fluent-button>
          <fluent-button id="exportSimpl" appearance="accent">SIMPL-IR</fluent-button>
          <fluent-button id="openSimpl" appearance="stealth">Ouvrir portail SIMPL-IR</fluent-button>
        </div>
      </section>
    `;

    renderVariables(container, data);
    renderSimulation(container, data);

    container.querySelectorAll('[data-cnss]').forEach((input) => {
      input.addEventListener('change', () => {
        const key = input.dataset.cnss;
        setData((draft) => {
          draft.settings.payrollParams.cnss[key] = Number(input.value);
        });
      });
    });

    container.querySelector('#saveParams').addEventListener('click', () => {
      const baremeText = container.querySelector('#baremeInput').value;
      const ancienneteText = container.querySelector('#ancienneteInput').value;
      try {
        const bareme = JSON.parse(baremeText);
        const anciennete = JSON.parse(ancienneteText);
        setData((draft) => {
          draft.settings.payrollParams.ir_bareme_2025 = bareme;
          draft.settings.payrollParams.prime_anciennete = anciennete;
        });
        showToast('Paramètres enregistrés');
      } catch (error) {
        showToast('JSON invalide', 'warn');
      }
    });

    container.querySelector('#runSimulation').addEventListener('click', () => {
      const fresh = getData();
      lastSimulation = simulatePayroll(fresh.employees, fresh.payrollVariables.variables, fresh.settings.payrollParams);
      renderSimulation(container, fresh);
      showToast('Simulation terminée');
    });

    container.querySelector('#exportCnss').addEventListener('click', () => {
      if (!lastSimulation) {
        showToast('Lancez d\'abord une simulation', 'warn');
        return;
      }
      const rows = lastSimulation.results.map((row) => ({
        CNSS: row.cnss.totalRetenuesSalarie,
        Employe: row.nom,
        Brut: row.brut
      }));
      exportXlsx({ sheetName: 'CNSS', data: rows, fileName: 'cnss-damancom.xlsx' });
      openExcelOnlinePlaceholder('cnss-damancom.xlsx');
    });

    container.querySelector('#openCnss').addEventListener('click', () => {
      window.open('https://www.cnss.ma/fr/damancom', '_blank');
    });

    container.querySelector('#exportSimpl').addEventListener('click', () => {
      if (!lastSimulation) {
        showToast('Lancez une simulation', 'warn');
        return;
      }
      const rows = lastSimulation.results.map((row) => ({
        Employe: row.nom,
        BaseIR: row.baseImposable,
        IR: row.ir
      }));
      exportXlsx({ sheetName: 'SIMPL-IR', data: rows, fileName: 'simpl-ir.xlsx' });
      const xml = `<SIMPLIR>${rows
        .map((row) => `<LIGNE nom="${row.Employe}" base="${row.BaseIR}" ir="${row.IR}" />`)
        .join('')}</SIMPLIR>`;
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'simpl-ir.xml';
      link.click();
      URL.revokeObjectURL(url);
    });

    container.querySelector('#openSimpl').addEventListener('click', () => {
      window.open('https://simpl-ir.tax.gov.ma/', '_blank');
    });
  }
};
