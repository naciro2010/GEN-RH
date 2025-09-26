import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import clsx from 'clsx';
import { useAtlasStore } from './store/useAtlasStore';
import { atlasDarkTheme, atlasLightTheme, excelTheme } from './theme/themes';
import { ToastProvider } from './components/ui/ToastProvider';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import RecruitmentPage from './pages/RecruitmentPage';
import OnboardingPage from './pages/OnboardingPage';
import EmployeesPage from './pages/EmployeesPage';
import PayrollPage from './pages/PayrollPage';
import TimePage from './pages/TimePage';
import LeavesPage from './pages/LeavesPage';
import TrainingPage from './pages/TrainingPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const { data, ui } = useAtlasStore((state) => ({ data: state.data, ui: state.ui }));
  const themeName = data.settings.theme ?? 'light';
  const isDark = themeName === 'dark';
  const baseTheme = isDark ? atlasDarkTheme : atlasLightTheme;
  const theme = ui.excelMode ? excelTheme : baseTheme;

  useEffect(() => {
    document.documentElement.lang = data.settings.locale ?? 'fr';
    const rtl = data.settings.rtl ?? data.settings.locale === 'ar';
    document.body.dir = rtl ? 'rtl' : 'ltr';
  }, [data.settings.locale, data.settings.rtl]);

  return (
    <FluentProvider theme={theme} className={clsx({ excel: ui.excelMode })}>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="recrutement" element={<RecruitmentPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="salaries" element={<EmployeesPage />} />
            <Route path="temps" element={<TimePage />} />
            <Route path="conges" element={<LeavesPage />} />
            <Route path="paie" element={<PayrollPage />} />
            <Route path="formation" element={<TrainingPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </FluentProvider>
  );
};

export default App;
