import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { simulatePayroll } from '../services/payroll';
import { formatMAD, formatNumber } from '../utils/format';
import { downloadFile } from '../utils/download';
import { useToast } from '../components/ui/ToastProvider';
const PayrollPage = () => {
    const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
    const { notify } = useToast();
    const payrollVariables = data.payrollVariables.variables;
    const [simulation, setSimulation] = useState(() => simulatePayroll(data.employees, payrollVariables, data.settings.payrollParams));
    const [baremeText, setBaremeText] = useState(JSON.stringify(data.settings.payrollParams.ir_bareme_2025, null, 2));
    const [ancienneteText, setAncienneteText] = useState(JSON.stringify(data.settings.payrollParams.prime_anciennete, null, 2));
    const cnssKeys = useMemo(() => Object.keys(data.settings.payrollParams.cnss), [data.settings.payrollParams.cnss]);
    const handleCnssChange = (key, value) => {
        setData((draft) => {
            const record = draft.settings.payrollParams.cnss;
            record[key] = value;
        });
    };
    const handleSaveParams = (event) => {
        event.preventDefault();
        try {
            const bareme = JSON.parse(baremeText);
            const anciennete = JSON.parse(ancienneteText);
            setData((draft) => {
                draft.settings.payrollParams.ir_bareme_2025 = bareme;
                draft.settings.payrollParams.prime_anciennete = anciennete;
            });
            notify('Paramètres enregistrés', 'success');
        }
        catch (error) {
            console.error(error);
            notify('JSON invalide', 'warn');
        }
    };
    const handleRunSimulation = () => {
        const fresh = simulatePayroll(data.employees, payrollVariables, data.settings.payrollParams);
        setSimulation(fresh);
        notify('Simulation recalculée', 'success');
    };
    const handleExportCnss = () => {
        const rows = simulation.results.map((row) => ({
            Employe: row.nom,
            Brut: row.brut,
            Retenues_CNSS: row.cnss.totalRetenuesSalarie
        }));
        downloadFile(JSON.stringify(rows, null, 2), 'cnss-damancom.json', 'application/json');
        notify('Export CNSS généré');
    };
    const handleExportSimpl = () => {
        const rows = simulation.results.map((row) => ({ Employe: row.nom, BaseIR: row.baseImposable, IR: row.ir }));
        const xml = `<SIMPLIR>${rows
            .map((row) => `<LIGNE nom="${row.Employe}" base="${row.BaseIR}" ir="${row.IR}" />`)
            .join('')}</SIMPLIR>`;
        downloadFile(xml, 'simpl-ir.xml', 'application/xml');
        notify('Fichier SIMPL-IR généré');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Simulation de paie" }), _jsx("button", { type: "button", className: "btn-pill", onClick: handleRunSimulation, children: "Lancer simulation" })] }), _jsxs("form", { className: "grid", onSubmit: handleSaveParams, style: { gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }, children: [_jsxs("div", { children: [_jsx("h4", { children: "Param\u00E8tres CNSS" }), _jsx("div", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }, children: cnssKeys.map((key) => (_jsxs("label", { children: [key, _jsx("input", { type: "number", step: "0.01", value: data.settings.payrollParams.cnss[key] ?? 0, onChange: (event) => handleCnssChange(key, Number(event.target.value)) })] }, key))) })] }), _jsxs("div", { className: "grid", children: [_jsxs("label", { children: ["Bar\u00E8me IR (JSON)", _jsx("textarea", { value: baremeText, onChange: (event) => setBaremeText(event.target.value), rows: 8 })] }), _jsxs("label", { children: ["Prime anciennet\u00E9 (JSON)", _jsx("textarea", { value: ancienneteText, onChange: (event) => setAncienneteText(event.target.value), rows: 6 })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "submit", className: "btn-pill", children: "Enregistrer param\u00E8tres" }) })] })] })] }), _jsxs("section", { className: "data-card", children: [_jsx("div", { className: "section-header", children: _jsxs("h3", { children: ["Variables du mois (", data.payrollVariables.currentPeriod, ")"] }) }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Salari\u00E9" }), _jsx("th", { children: "HS 25%" }), _jsx("th", { children: "HS 50%" }), _jsx("th", { children: "Repos" }), _jsx("th", { children: "Jour hebdo" }), _jsx("th", { children: "Primes" }), _jsx("th", { children: "Absences" })] }) }), _jsx("tbody", { children: data.employees.map((employee) => {
                                        const vars = payrollVariables[employee.id] || { heuresSup: {}, primes: 0, absences: 0 };
                                        return (_jsxs("tr", { children: [_jsxs("td", { children: [employee.prenom, " ", employee.nom] }), _jsx("td", { children: formatNumber(vars.heuresSup?.jour || 0) }), _jsx("td", { children: formatNumber(vars.heuresSup?.nuit || 0) }), _jsx("td", { children: formatNumber(vars.heuresSup?.repos || 0) }), _jsx("td", { children: formatNumber(vars.heuresSup?.jourHebdo || 0) }), _jsx("td", { children: formatMAD(vars.primes || 0) }), _jsx("td", { children: formatNumber(vars.absences || 0) })] }, employee.id));
                                    }) })] }) })] }), _jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h3", { children: "R\u00E9sultats simulation" }), _jsxs("span", { className: "badge", children: ["Masse salariale : ", formatMAD(simulation.masseSalariale)] })] }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Salari\u00E9" }), _jsx("th", { children: "Brut" }), _jsx("th", { children: "CNSS" }), _jsx("th", { children: "IR" }), _jsx("th", { children: "Net" })] }) }), _jsx("tbody", { children: simulation.results.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.nom }), _jsx("td", { children: formatMAD(row.brut) }), _jsx("td", { children: formatMAD(row.cnss.totalRetenuesSalarie) }), _jsx("td", { children: formatMAD(row.ir) }), _jsx("td", { children: formatMAD(row.net) })] }, row.employeeId))) })] }) }), _jsxs("div", { className: "toolbar", style: { justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", className: "btn-pill", onClick: handleExportCnss, children: "Export CNSS" }), _jsx("button", { type: "button", className: "btn-pill", onClick: handleExportSimpl, children: "SIMPL-IR" })] })] })] }));
};
export default PayrollPage;
