import { useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
import { downloadFile } from '../utils/download';

const DocumentsPage = () => {
  const data = useAtlasStore((state) => state.data);
  const { notify } = useToast();
  const [templateId, setTemplateId] = useState(data.documents[0]?.id ?? '');

  const handleGenerateDoc = () => {
    const doc = data.documents.find((item) => item.id === templateId);
    if (!doc) return;
    const employee = data.employees[0];
    const payload = doc.variables.reduce<Record<string, string>>((acc, variable) => {
      switch (variable) {
        case 'societe':
          acc[variable] = 'Atlas HR Suite';
          break;
        case 'nom':
          acc[variable] = employee?.nom ?? '';
          break;
        case 'prenom':
          acc[variable] = employee?.prenom ?? '';
          break;
        case 'cnss':
          acc[variable] = employee?.cnss ?? '';
          break;
        case 'cnie_masque':
          acc[variable] = employee?.cnieMasquee ?? '';
          break;
        case 'poste':
          acc[variable] = employee?.poste ?? '';
          break;
        case 'salaire_mensuel':
          acc[variable] = String(employee?.salaireBase ?? '');
          break;
        case 'date_debut':
          acc[variable] = employee?.dateEmbauche ?? '';
          break;
        default:
          acc[variable] = '';
      }
      return acc;
    }, {});
    downloadFile(JSON.stringify(payload, null, 2), `${doc.nom}.json`, 'application/json');
    notify('Gabarit généré (JSON)', 'success');
  };

  const handleExportEmployees = () => {
    downloadFile(JSON.stringify(data.employees, null, 2), 'salaries.json', 'application/json');
    notify('Export salariés JSON', 'success');
  };

  const handleExportTraining = () => {
    downloadFile(JSON.stringify(data.formations, null, 2), 'formations.json', 'application/json');
    notify('Export formations JSON', 'success');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Modèles DOCX (démo)</h2>
          <button type="button" className="btn-pill" onClick={handleGenerateDoc}>
            Générer JSON
          </button>
        </div>
        <select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          {data.documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.nom}
            </option>
          ))}
        </select>
        <p>
          Variables disponibles :{' '}
          {data.documents.find((doc) => doc.id === templateId)?.variables.join(', ') || ''}
        </p>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Exports</h3>
        </div>
        <div className="toolbar">
          <button type="button" className="btn-pill" onClick={handleExportEmployees}>
            Salariés JSON
          </button>
          <button type="button" className="btn-pill" onClick={handleExportTraining}>
            Formations JSON
          </button>
        </div>
      </section>
    </>
  );
};

export default DocumentsPage;
