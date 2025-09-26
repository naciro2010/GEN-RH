import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
const AdminPage = () => {
    const { data, setData, reset } = useAtlasStore((state) => ({
        data: state.data,
        setData: state.setData,
        reset: state.reset
    }));
    const { notify } = useToast();
    const [theme, setTheme] = useState(data.settings.theme);
    const [locale, setLocale] = useState(data.settings.locale);
    const [retention, setRetention] = useState(String(data.settings.legalRetentionYears));
    const [roles, setRoles] = useState(data.settings.roles.join('; '));
    const [graphStatus, setGraphStatus] = useState(data.settings.connectors.graph.status);
    const handleSubmit = (event) => {
        event.preventDefault();
        setData((draft) => {
            draft.settings.theme = theme;
            draft.settings.locale = locale;
            draft.settings.rtl = locale === 'ar';
            draft.settings.legalRetentionYears = Number(retention) || 5;
            draft.settings.roles = roles
                .split(';')
                .map((role) => role.trim())
                .filter(Boolean);
            draft.settings.connectors.graph.status = graphStatus;
        });
        notify('Paramètres admin enregistrés', 'success');
    };
    const handleReset = () => {
        if (confirm('Réinitialiser les données de démonstration ?')) {
            reset();
            notify('Jeu de données réinitialisé', 'success');
        }
    };
    return (_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Administration" }), _jsx("button", { type: "button", className: "btn-pill", onClick: handleReset, children: "R\u00E9initialiser jeu de donn\u00E9es" })] }), _jsxs("form", { className: "grid", onSubmit: handleSubmit, style: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }, children: [_jsxs("label", { children: ["Th\u00E8me", _jsxs("select", { value: theme, onChange: (event) => setTheme(event.target.value), children: [_jsx("option", { value: "light", children: "Clair" }), _jsx("option", { value: "dark", children: "Sombre" })] })] }), _jsxs("label", { children: ["Langue / \u0644\u063A\u0629", _jsxs("select", { value: locale, onChange: (event) => setLocale(event.target.value), children: [_jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "ar", children: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" })] })] }), _jsxs("label", { children: ["P\u00E9riode conservation (ann\u00E9es)", _jsx("input", { value: retention, onChange: (event) => setRetention(event.target.value) })] }), _jsxs("label", { style: { gridColumn: '1 / -1' }, children: ["R\u00F4les (s\u00E9par\u00E9s par ;)", _jsx("textarea", { value: roles, onChange: (event) => setRoles(event.target.value), rows: 4 })] }), _jsxs("label", { children: ["Connecteur Graph (statut)", _jsx("input", { value: graphStatus, onChange: (event) => setGraphStatus(event.target.value) })] }), _jsx("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { type: "submit", className: "btn-pill", children: "Enregistrer" }) })] })] }));
};
export default AdminPage;
