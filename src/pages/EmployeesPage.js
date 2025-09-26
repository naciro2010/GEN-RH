import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { maskCnie, formatMAD } from '../utils/format';
import { useToast } from '../components/ui/ToastProvider';
const EmployeesPage = () => {
    const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
    const { notify } = useToast();
    const [selectedId, setSelectedId] = useState(data.employees[0]?.id ?? '');
    const selectedEmployee = useMemo(() => data.employees.find((employee) => employee.id === selectedId), [data.employees, selectedId]);
    const handleSelect = (employee) => {
        setSelectedId(employee.id);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        setData((draft) => {
            const target = draft.employees.find((employee) => employee.id === selectedId);
            if (!target)
                return;
            target.poste = String(payload.poste || '');
            target.department = String(payload.department || '');
            target.salaireBase = Number(payload.salaireBase || 0);
            target.primes = Number(payload.primes || 0);
            target.cnie = String(payload.cnie || '');
            target.cnieMasquee = maskCnie(target.cnie);
            target.cnss = String(payload.cnss || '');
            target.rib = String(payload.rib || '');
            target.adresse = String(payload.adresse || '');
            target.ice = String(payload.ice || '');
            target.situationFamiliale = String(payload.situationFamiliale || '');
            target.cimr = payload.cimr === 'on';
            target.ayantsDroit = String(payload.ayantsDroit || '')
                .split(';')
                .map((item) => item.trim())
                .filter(Boolean);
        });
        notify('Salarié mis à jour', 'success');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsx("div", { className: "section-header", children: _jsx("h2", { children: "Salari\u00E9s" }) }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Nom" }), _jsx("th", { children: "Poste" }), _jsx("th", { children: "D\u00E9partement" }), _jsx("th", { children: "Salaire" })] }) }), _jsx("tbody", { children: data.employees.map((employee) => (_jsxs("tr", { onClick: () => handleSelect(employee), style: {
                                            cursor: 'pointer',
                                            backgroundColor: employee.id === selectedId ? 'rgba(81, 170, 250, 0.16)' : undefined
                                        }, children: [_jsx("td", { children: employee.id }), _jsxs("td", { children: [employee.prenom, " ", employee.nom] }), _jsx("td", { children: employee.poste }), _jsx("td", { children: employee.department }), _jsx("td", { children: formatMAD(employee.salaireBase) })] }, employee.id))) })] }) })] }), _jsx("section", { className: "data-card", children: selectedEmployee ? (_jsxs("form", { className: "grid", onSubmit: handleSubmit, style: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }, children: [_jsxs("h3", { style: { gridColumn: '1 / -1' }, children: [selectedEmployee.prenom, " ", selectedEmployee.nom] }), _jsx("input", { type: "hidden", name: "id", value: selectedEmployee.id }), _jsxs("label", { children: ["Poste", _jsx("input", { name: "poste", defaultValue: selectedEmployee.poste })] }), _jsxs("label", { children: ["D\u00E9partement", _jsx("input", { name: "department", defaultValue: selectedEmployee.department })] }), _jsxs("label", { children: ["Salaire de base (MAD)", _jsx("input", { name: "salaireBase", type: "number", min: "0", defaultValue: selectedEmployee.salaireBase })] }), _jsxs("label", { children: ["Primes", _jsx("input", { name: "primes", type: "number", min: "0", defaultValue: selectedEmployee.primes })] }), _jsxs("label", { children: ["CNIE", _jsx("input", { name: "cnie", defaultValue: selectedEmployee.cnie })] }), _jsxs("label", { children: ["CNSS", _jsx("input", { name: "cnss", defaultValue: selectedEmployee.cnss })] }), _jsxs("label", { children: ["RIB", _jsx("input", { name: "rib", defaultValue: selectedEmployee.rib })] }), _jsxs("label", { children: ["Adresse", _jsx("textarea", { name: "adresse", defaultValue: selectedEmployee.adresse })] }), _jsxs("label", { children: ["ICE / IF", _jsx("input", { name: "ice", defaultValue: selectedEmployee.ice })] }), _jsxs("label", { children: ["Situation familiale", _jsx("input", { name: "situationFamiliale", defaultValue: selectedEmployee.situationFamiliale })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsx("input", { type: "checkbox", name: "cimr", defaultChecked: selectedEmployee.cimr }), " CIMR"] }), _jsxs("label", { style: { gridColumn: '1 / -1' }, children: ["Ayants droit (s\u00E9par\u00E9s par ;)", _jsx("textarea", { name: "ayantsDroit", defaultValue: selectedEmployee.ayantsDroit?.join('; ') ?? '' })] }), _jsx("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "submit", className: "btn-pill", children: "Enregistrer" }) })] })) : (_jsx("p", { children: "S\u00E9lectionnez un salari\u00E9" })) })] }));
};
export default EmployeesPage;
