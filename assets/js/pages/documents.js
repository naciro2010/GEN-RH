import { getData } from '../data/store.js';
import { exportDocxFromTemplate, exportXlsx, openInExcelGraph } from '../services/exports.js';
import { showToast } from '../services/utils.js';

export const documentsRoute = {
  id: 'documents',
  path: '#/documents',
  labelKey: 'nav.documents',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Modèles DOCX</h2>
          <fluent-button id="generateDoc" appearance="accent">Générer Word</fluent-button>
        </div>
        <fluent-select id="templateSelect">
          ${data.documents.map((doc) => `<fluent-option value="${doc.id}">${doc.nom}</fluent-option>`).join('')}
        </fluent-select>
        <p>Variables disponibles : <span id="templateVars"></span></p>
      </section>

      <section class="data-card">
        <div class="section-header">
          <h3>Exports Excel</h3>
          <div class="toolbar">
            <fluent-button id="exportEmployees" appearance="accent">Salariés</fluent-button>
            <fluent-button id="exportTraining" appearance="stealth">Formations</fluent-button>
            <fluent-button id="pushExcelGraph" appearance="stealth">Ouvrir dans Excel (Graph)</fluent-button>
          </div>
        </div>
        <p>Utilisez ces exports pour préparer des rapports ou alimenter Microsoft 365.</p>
      </section>
    `;

    const templateInfo = () => {
      const select = container.querySelector('#templateSelect');
      const doc = data.documents.find((d) => d.id === select.value);
      container.querySelector('#templateVars').textContent = doc?.variables.join(', ');
    };
    templateInfo();
    container.querySelector('#templateSelect').addEventListener('change', templateInfo);

    container.querySelector('#generateDoc').addEventListener('click', async () => {
      const doc = data.documents.find((d) => d.id === container.querySelector('#templateSelect').value);
      if (!doc) return;
      const sampleEmployee = data.employees[0];
      const vars = {
        societe: 'Atlas HR Suite',
        nom: sampleEmployee?.nom || '',
        prenom: sampleEmployee?.prenom || '',
        cnss: sampleEmployee?.cnss || '',
        cnie_masque: sampleEmployee?.cnieMasquee || '',
        poste: sampleEmployee?.poste || '',
        salaire_mensuel: sampleEmployee?.salaireBase || '',
        date_debut: sampleEmployee?.dateEmbauche || new Date().toISOString().slice(0, 10)
      };
      await exportDocxFromTemplate(doc.nom, vars, `${doc.nom}.docx`);
      showToast('Document généré');
    });

    container.querySelector('#exportEmployees').addEventListener('click', () => {
      exportXlsx({
        sheetName: 'Salariés',
        data: data.employees.map((emp) => ({
          ID: emp.id,
          Nom: `${emp.prenom} ${emp.nom}`,
          Poste: emp.poste,
          Département: emp.department,
          Salaire: emp.salaireBase
        })),
        fileName: 'salaries.xlsx'
      });
    });

    container.querySelector('#exportTraining').addEventListener('click', () => {
      exportXlsx({
        sheetName: 'Formations',
        data: data.formations.map((formation) => ({
          Intitulé: formation.intitule,
          Budget: formation.budget,
          Sessions: formation.sessions.length
        })),
        fileName: 'formations.xlsx'
      });
    });

    container.querySelector('#pushExcelGraph').addEventListener('click', () => {
      const payload = data.employees.slice(0, 5).map((emp) => ({ Nom: `${emp.prenom} ${emp.nom}`, Salaire: emp.salaireBase }));
      openInExcelGraph('salaries.xlsx', payload);
      showToast('Simulation upload Graph (placeholder)');
    });
  }
};
