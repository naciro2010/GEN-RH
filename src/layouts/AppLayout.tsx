import { useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Tab, TabList, TabValue, Tooltip } from '@fluentui/react-components';
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
] as const;

const SHEET_TABS: TabValue[] = ['dashboard', 'recrutement', 'salaries', 'paie', 'documents'];

const AppLayout = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleNavigate = (slug: string) => {
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        importData(text);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const sheetValue = SHEET_TABS.includes(current as TabValue) ? (current as TabValue) : SHEET_TABS[0];

  return (
    <div className={clsx('shell-root', { excel: ui.excelMode })}>
      <header className="app-header" role="banner">
        <div className="app-brand">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <div>
            <span className="brand-title">Atlas HR Suite</span>
            <span className="brand-subtitle">Gestion RH 360°</span>
          </div>
        </div>
        <div className="header-middle">
          <nav aria-label="Fil d'Ariane" className="breadcrumbs">
            <span>Tableau de bord</span>
            <span aria-current="page">{breadcrumbs}</span>
          </nav>
          <Input
            type="search"
            placeholder="Rechercher"
            value={search}
            onChange={(_, data) => setSearch(data.value)}
          />
          <div className="header-highlights" aria-hidden="true">
            <span>CNSS / Damancom</span>
            <span>SIMPL-IR XML</span>
            <span>FR • AR • RTL</span>
          </div>
        </div>
        <div className="header-actions">
          <Button appearance="transparent" onClick={handleThemeToggle}>
            {themeLabel}
          </Button>
          <Button appearance="transparent" onClick={toggleExcelMode}>
            Mode Excel
          </Button>
          <Button appearance="transparent" onClick={handleLocaleToggle}>
            {data.settings.locale === 'ar' ? 'AR / FR' : 'FR / AR'}
          </Button>
          <Avatar name="A. Admin" aria-label="Utilisateur" />
        </div>
      </header>
      <div className="ribbon" role="toolbar" aria-label="Ruban">
        <div className="ribbon-groups">
          <div className="ribbon-group" aria-label="Navigation rapide">
            <Button appearance="primary" onClick={() => handleNavigate('dashboard')}>
              Tableau de bord
            </Button>
            <Button appearance="primary" onClick={() => handleNavigate('recrutement')}>
              Recrutement
            </Button>
            <Button appearance="primary" onClick={() => handleNavigate('salaries')}>
              Salariés
            </Button>
            <Button appearance="primary" onClick={() => handleNavigate('paie')}>
              Paie
            </Button>
          </div>
          <div className="ribbon-group" aria-label="Exports">
            <Tooltip content="Exporter le jeu de données" relationship="label">
              <Button icon={<ArrowDownloadRegular />} onClick={handleExport}>
                Export JSON
              </Button>
            </Tooltip>
            <Tooltip content="Importer un jeu JSON" relationship="label">
              <Button icon={<ArrowUploadRegular />} onClick={() => fileInputRef.current?.click()}>
                Import JSON
              </Button>
            </Tooltip>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImport}
            />
          </div>
        </div>
      </div>
      <div className="app-shell">
        <aside className="app-nav" aria-label="Navigation principale">
          <div className="nav-list" role="list">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                appearance={item.path === current ? 'primary' : 'secondary'}
                className={clsx('nav-button', { 'is-active': item.path === current })}
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="nav-footer">
            <Button appearance="primary" icon={<ArrowDownloadRegular />} onClick={handleExport}>
              Exporter données
            </Button>
            <Button appearance="secondary" icon={<ArrowUploadRegular />} onClick={() => fileInputRef.current?.click()}>
              Importer données
            </Button>
          </div>
        </aside>
        <main id="app-content" role="main">
          <Outlet />
        </main>
      </div>
      <footer className="sheet-tabs" aria-label="Feuilles">
        <TabList selectedValue={sheetValue} onTabSelect={(_, data) => handleNavigate(data.value as string)}>
          <Tab value="dashboard">Tableau de bord</Tab>
          <Tab value="recrutement">Recrutement</Tab>
          <Tab value="salaries">Salariés</Tab>
          <Tab value="paie">Paie</Tab>
          <Tab value="documents">Documents</Tab>
        </TabList>
      </footer>
    </div>
  );
};

export default AppLayout;
