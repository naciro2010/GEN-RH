import { navigate } from './app.js';
import { getData, exportData as exportDataset, importData as importDataset } from './data/store.js';
import { exportXlsx, exportDocxFromTemplate } from './services/exports.js';
import { showToast } from './services/utils.js';

const byId = (id) => document.getElementById(id);

// Navigation shortcuts
document.querySelectorAll('.ribbon [data-goto]')?.forEach((btn) => {
  btn.addEventListener('click', () => navigate(btn.dataset.goto));
});

// Data exports
byId('rbExportEmployees')?.addEventListener('click', () => {
  const data = getData();
  exportXlsx({
    sheetName: 'Salariés',
    data: data.employees.map((e) => ({ ID: e.id, Nom: `${e.prenom} ${e.nom}`, Poste: e.poste, Département: e.department, Salaire: e.salaireBase })),
    fileName: 'salaries.xlsx'
  });
  showToast('Export salariés prêt');
});

byId('rbExportDataset')?.addEventListener('click', () => {
  const blob = new Blob([exportDataset()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'atlas-data.json'; a.click();
  URL.revokeObjectURL(url);
});

byId('rbImportDataset')?.addEventListener('click', () => byId('rbImportFile')?.click());
byId('rbImportFile')?.addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return;
  const text = await file.text();
  try { importDataset(text); showToast('Import JSON terminé'); } catch(err) { showToast('Import invalide', 'warn'); }
  e.target.value = '';
});

// Macros
byId('rbRunPayroll')?.addEventListener('click', () => {
  navigate('#/paie');
  setTimeout(() => {
    document.getElementById('runSimulation')?.click();
  }, 60);
});

byId('rbOfferLetter')?.addEventListener('click', async () => {
  const data = getData();
  const c = data.candidates[0]; const o = data.offers.find((x) => x.id === c.offre);
  await exportDocxFromTemplate('Lettre offre', {
    societe: 'Atlas HR Suite', nom: c.nom, prenom: c.prenom, poste: o?.titre || '', salaire_mensuel: o?.salaire || 'Négociation'
  }, `Lettre-offre-${c.prenom}-${c.nom}.docx`);
  showToast('Lettre d\'offre générée');
});

byId('rbRecordMacro')?.addEventListener('click', () => {
  showToast('Enregistreur de macro (placeholder)');
});

// Excel mode toggle
document.getElementById('excelModeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('excel');
});

// Sheet tabs navigation
const sheetTabs = document.getElementById('sheetTabs');
sheetTabs?.addEventListener('change', () => {
  const active = sheetTabs.activeid ? document.getElementById(sheetTabs.activeid) : null;
  const route = active?.dataset?.route;
  if (route) navigate(route);
});
