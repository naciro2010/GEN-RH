import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
const TimePage = () => {
    const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
    const { notify } = useToast();
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [status, setStatus] = useState('Présent');
    const [motif, setMotif] = useState('');
    const [employeeId, setEmployeeId] = useState(data.employees[0]?.id ?? '');
    const [importText, setImportText] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        setData((draft) => {
            draft.attendance.push({
                id: `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                employeeId,
                date,
                status,
                motif
            });
        });
        notify('Pointage ajouté', 'success');
        setMotif('');
    };
    const handleImport = () => {
        if (!importText.trim())
            return;
        try {
            const rows = JSON.parse(importText);
            if (!Array.isArray(rows))
                throw new Error('Format invalide');
            setData((draft) => {
                rows.forEach((row) => {
                    draft.attendance.push({
                        id: row.id || `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                        employeeId: row.employeeId || row.EmployeeId,
                        date: row.date || row.Date,
                        status: row.status || row.Status,
                        motif: row.motif || row.Motif || ''
                    });
                });
            });
            notify('Import réussi', 'success');
            setImportText('');
        }
        catch (error) {
            console.error(error);
            notify('Import invalide', 'warn');
        }
    };
    const handleOvertimeSave = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setData((draft) => {
            Object.keys(draft.settings.payrollParams.overtime).forEach((key) => {
                const value = Number(formData.get(key));
                draft.settings.payrollParams.overtime[key] = value;
            });
        });
        notify('Règles mises à jour', 'success');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsx("div", { className: "section-header", children: _jsx("h2", { children: "Temps & Pointage" }) }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Salari\u00E9" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Statut" }), _jsx("th", { children: "Motif" })] }) }), _jsx("tbody", { children: data.attendance.map((row) => {
                                        const employee = data.employees.find((emp) => emp.id === row.employeeId);
                                        return (_jsxs("tr", { children: [_jsx("td", { children: row.id }), _jsx("td", { children: employee ? `${employee.prenom} ${employee.nom}` : row.employeeId }), _jsx("td", { children: row.date }), _jsx("td", { children: row.status }), _jsx("td", { children: row.motif })] }, row.id));
                                    }) })] }) })] }), _jsxs("section", { className: "data-card", children: [_jsx("h3", { children: "Ajouter une ligne de pointage" }), _jsxs("form", { className: "grid", onSubmit: handleSubmit, style: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }, children: [_jsxs("label", { children: ["Salari\u00E9", _jsx("select", { value: employeeId, onChange: (event) => setEmployeeId(event.target.value), children: data.employees.map((emp) => (_jsxs("option", { value: emp.id, children: [emp.prenom, " ", emp.nom] }, emp.id))) })] }), _jsxs("label", { children: ["Date", _jsx("input", { type: "date", value: date, onChange: (event) => setDate(event.target.value) })] }), _jsxs("label", { children: ["Statut", _jsxs("select", { value: status, onChange: (event) => setStatus(event.target.value), children: [_jsx("option", { value: "Pr\u00E9sent", children: "Pr\u00E9sent" }), _jsx("option", { value: "Absent", children: "Absent" }), _jsx("option", { value: "Retard", children: "Retard" })] })] }), _jsxs("label", { children: ["Motif", _jsx("input", { value: motif, onChange: (event) => setMotif(event.target.value) })] }), _jsx("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "submit", className: "btn-pill", children: "Ajouter" }) })] })] }), _jsxs("section", { className: "data-card", children: [_jsx("h3", { children: "Importer (JSON)" }), _jsx("textarea", { value: importText, onChange: (event) => setImportText(event.target.value), placeholder: "Collez un tableau JSON (ID, employeeId, date, status, motif)" }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "button", className: "btn-pill", onClick: handleImport, children: "Importer" }) })] }), _jsxs("section", { className: "data-card", children: [_jsx("h3", { children: "R\u00E8gles heures suppl\u00E9mentaires" }), _jsxs("form", { className: "grid", onSubmit: handleOvertimeSave, style: { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }, children: [Object.entries(data.settings.payrollParams.overtime).map(([key, value]) => (_jsxs("label", { children: [key, _jsx("input", { type: "number", min: "0", max: "200", name: key, defaultValue: value })] }, key))), _jsx("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "submit", className: "btn-pill", children: "Enregistrer" }) })] })] })] }));
};
export default TimePage;
