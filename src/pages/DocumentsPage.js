import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
        if (!doc)
            return;
        const employee = data.employees[0];
        const payload = doc.variables.reduce((acc, variable) => {
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
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Mod\u00E8les DOCX (d\u00E9mo)" }), _jsx("button", { type: "button", className: "btn-pill", onClick: handleGenerateDoc, children: "G\u00E9n\u00E9rer JSON" })] }), _jsx("select", { value: templateId, onChange: (event) => setTemplateId(event.target.value), children: data.documents.map((doc) => (_jsx("option", { value: doc.id, children: doc.nom }, doc.id))) }), _jsxs("p", { children: ["Variables disponibles :", ' ', data.documents.find((doc) => doc.id === templateId)?.variables.join(', ') || ''] })] }), _jsxs("section", { className: "data-card", children: [_jsx("div", { className: "section-header", children: _jsx("h3", { children: "Exports" }) }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { type: "button", className: "btn-pill", onClick: handleExportEmployees, children: "Salari\u00E9s JSON" }), _jsx("button", { type: "button", className: "btn-pill", onClick: handleExportTraining, children: "Formations JSON" })] })] })] }));
};
export default DocumentsPage;
