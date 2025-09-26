import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Tab, TabList, Tooltip } from '@fluentui/react-components';
import { ArrowDownloadRegular, ArrowUploadRegular } from '@fluentui/react-icons';
import clsx from 'clsx';
import { useAtlasStore } from '../store/useAtlasStore';
import { downloadFile } from '../utils/download';
import '../styles/app-shell.css';
const NAV_ITEMS = [
    { path: 'dashboard', label: 'Tableau de bord' },
    { path: 'recrutement', label: 'Recrutement' },
    { path: 'onboarding', label: 'Onboarding' },
    { path: 'salaries', label: 'Salariés' },
    { path: 'temps', label: 'Temps & Pointage' },
    { path: 'conges', label: 'Congés' },
    { path: 'paie', label: 'Paie' },
    { path: 'formation', label: 'Formation' },
    { path: 'documents', label: 'Documents' },
    { path: 'admin', label: 'Admin' }
];
const SHEET_TABS = ['dashboard', 'recrutement', 'salaries', 'paie', 'documents'];
const AppLayout = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { data, setData, exportData, importData, toggleExcelMode, ui } = useAtlasStore((state) => ({
        data: state.data,
        setData: state.setData,
        exportData: state.exportData,
        importData: state.importData,
        toggleExcelMode: state.toggleExcelMode,
        ui: state.ui
    }));
    const [search, setSearch] = useState('');
    const segments = location.pathname.split('/').filter(Boolean);
    const current = segments[1] ?? 'dashboard';
    const handleNavigate = (slug) => {
        navigate(`/app/${slug}`);
    };
    const themeLabel = data.settings.theme === 'dark' ? 'Sombre' : 'Clair';
    const breadcrumbs = useMemo(() => {
        const active = NAV_ITEMS.find((item) => item.path === current);
        return active?.label ?? 'Tableau de bord';
    }, [current]);
    const handleThemeToggle = () => {
        setData((draft) => {
            draft.settings.theme = draft.settings.theme === 'dark' ? 'light' : 'dark';
        });
    };
    const handleLocaleToggle = () => {
        setData((draft) => {
            const next = draft.settings.locale === 'ar' ? 'fr' : 'ar';
            draft.settings.locale = next;
            draft.settings.rtl = next === 'ar';
        });
    };
    const handleExport = () => {
        const json = exportData();
        downloadFile(json, 'atlas-data.json', 'application/json');
    };
    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        file.text().then((text) => {
            try {
                importData(text);
            }
            catch (error) {
                console.error(error);
            }
        });
    };
    const sheetValue = SHEET_TABS.includes(current) ? current : SHEET_TABS[0];
    return (_jsxs("div", { className: clsx('shell-root', { excel: ui.excelMode }), children: [_jsxs("header", { className: "app-header", role: "banner", children: [_jsxs("div", { className: "app-brand", children: [_jsx("span", { className: "brand-mark", "aria-hidden": "true", children: "\u25C6" }), _jsxs("div", { children: [_jsx("span", { className: "brand-title", children: "Atlas HR Suite" }), _jsx("span", { className: "brand-subtitle", children: "Gestion RH 360\u00B0" })] })] }), _jsxs("div", { className: "header-middle", children: [_jsxs("nav", { "aria-label": "Fil d'Ariane", className: "breadcrumbs", children: [_jsx("span", { children: "Tableau de bord" }), _jsx("span", { "aria-current": "page", children: breadcrumbs })] }), _jsx(Input, { type: "search", placeholder: "Rechercher", value: search, onChange: (_, data) => setSearch(data.value) }), _jsxs("div", { className: "header-highlights", "aria-hidden": "true", children: [_jsx("span", { children: "CNSS / Damancom" }), _jsx("span", { children: "SIMPL-IR XML" }), _jsx("span", { children: "FR \u2022 AR \u2022 RTL" })] })] }), _jsxs("div", { className: "header-actions", children: [_jsx(Button, { appearance: "transparent", onClick: handleThemeToggle, children: themeLabel }), _jsx(Button, { appearance: "transparent", onClick: toggleExcelMode, children: "Mode Excel" }), _jsx(Button, { appearance: "transparent", onClick: handleLocaleToggle, children: data.settings.locale === 'ar' ? 'AR / FR' : 'FR / AR' }), _jsx(Avatar, { name: "A. Admin", "aria-label": "Utilisateur" })] })] }), _jsx("div", { className: "ribbon", role: "toolbar", "aria-label": "Ruban", children: _jsxs("div", { className: "ribbon-groups", children: [_jsxs("div", { className: "ribbon-group", "aria-label": "Navigation rapide", children: [_jsx(Button, { appearance: "primary", onClick: () => handleNavigate('dashboard'), children: "Tableau de bord" }), _jsx(Button, { appearance: "primary", onClick: () => handleNavigate('recrutement'), children: "Recrutement" }), _jsx(Button, { appearance: "primary", onClick: () => handleNavigate('salaries'), children: "Salari\u00E9s" }), _jsx(Button, { appearance: "primary", onClick: () => handleNavigate('paie'), children: "Paie" })] }), _jsxs("div", { className: "ribbon-group", "aria-label": "Exports", children: [_jsx(Tooltip, { content: "Exporter le jeu de donn\u00E9es", relationship: "label", children: _jsx(Button, { icon: _jsx(ArrowDownloadRegular, {}), onClick: handleExport, children: "Export JSON" }) }), _jsx(Tooltip, { content: "Importer un jeu JSON", relationship: "label", children: _jsx(Button, { icon: _jsx(ArrowUploadRegular, {}), onClick: () => fileInputRef.current?.click(), children: "Import JSON" }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "application/json", hidden: true, onChange: handleImport })] })] }) }), _jsxs("div", { className: "app-shell", children: [_jsxs("aside", { className: "app-nav", "aria-label": "Navigation principale", children: [_jsx("div", { className: "nav-list", role: "list", children: NAV_ITEMS.map((item) => (_jsx(Button, { appearance: item.path === current ? 'primary' : 'secondary', className: clsx('nav-button', { 'is-active': item.path === current }), onClick: () => handleNavigate(item.path), children: item.label }, item.path))) }), _jsxs("div", { className: "nav-footer", children: [_jsx(Button, { appearance: "primary", icon: _jsx(ArrowDownloadRegular, {}), onClick: handleExport, children: "Exporter donn\u00E9es" }), _jsx(Button, { appearance: "secondary", icon: _jsx(ArrowUploadRegular, {}), onClick: () => fileInputRef.current?.click(), children: "Importer donn\u00E9es" })] })] }), _jsx("main", { id: "app-content", role: "main", children: _jsx(Outlet, {}) })] }), _jsx("footer", { className: "sheet-tabs", "aria-label": "Feuilles", children: _jsxs(TabList, { selectedValue: sheetValue, onTabSelect: (_, data) => handleNavigate(data.value), children: [_jsx(Tab, { value: "dashboard", children: "Tableau de bord" }), _jsx(Tab, { value: "recrutement", children: "Recrutement" }), _jsx(Tab, { value: "salaries", children: "Salari\u00E9s" }), _jsx(Tab, { value: "paie", children: "Paie" }), _jsx(Tab, { value: "documents", children: "Documents" })] }) })] }));
};
export default AppLayout;
