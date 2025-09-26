import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
import { formatDate } from '../utils/format';
const LeavesPage = () => {
    const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
    const { notify } = useToast();
    const [sector, setSector] = useState('private');
    const handleStatusChange = (id, value) => {
        setData((draft) => {
            const leave = draft.leaves.find((item) => item.id === id);
            if (leave)
                leave.statut = value;
        });
        notify('Statut mis à jour', 'success');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Cong\u00E9s" }), _jsxs("span", { className: "badge", children: [data.leaves.length, " demandes"] })] }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Salari\u00E9" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "D\u00E9but" }), _jsx("th", { children: "Fin" }), _jsx("th", { children: "Statut" })] }) }), _jsx("tbody", { children: data.leaves.map((leave) => {
                                        const employee = data.employees.find((emp) => emp.id === leave.employeeId);
                                        return (_jsxs("tr", { children: [_jsx("td", { children: leave.id }), _jsx("td", { children: employee ? `${employee.prenom} ${employee.nom}` : leave.employeeId }), _jsx("td", { children: leave.type }), _jsx("td", { children: leave.debut }), _jsx("td", { children: leave.fin }), _jsx("td", { children: _jsxs("select", { value: leave.statut, onChange: (event) => handleStatusChange(leave.id, event.target.value), children: [_jsx("option", { value: "En attente", children: "En attente" }), _jsx("option", { value: "Approuv\u00E9", children: "Approuv\u00E9" }), _jsx("option", { value: "Refus\u00E9", children: "Refus\u00E9" })] }) })] }, leave.id));
                                    }) })] }) })] }), _jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h3", { children: "Calendrier jours f\u00E9ri\u00E9s" }), _jsxs("div", { style: { display: 'flex', gap: '0.6rem' }, children: [_jsx("button", { type: "button", className: `btn-pill ${sector === 'private' ? 'is-active' : ''}`, onClick: () => setSector('private'), children: "Secteur priv\u00E9" }), _jsx("button", { type: "button", className: `btn-pill ${sector === 'public' ? 'is-active' : ''}`, onClick: () => setSector('public'), children: "Secteur public" })] })] }), _jsx("ul", { className: "timeline", children: data.settings.holidays[sector].map((holiday) => (_jsxs("li", { children: [_jsx("strong", { children: formatDate(holiday.date) }), _jsx("small", { children: holiday.label })] }, holiday.date))) })] })] }));
};
export default LeavesPage;
