import { routes } from './pages/index.js';
import { getData, subscribe, exportData as exportDataset, importData as importDataset, setData } from './data/store.js';
import { applyTranslations, setLocale, toggleLocale, t, getLocale } from './i18n.js';
import { showToast, ensureDir, downloadBlob } from './services/utils.js';

const content = document.getElementById('app-content');
const sideNav = document.getElementById('sideNav');
const breadcrumb = document.getElementById('breadcrumb-current');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const exportButton = document.getElementById('exportData');
const importButton = document.getElementById('importData');
const importFile = document.getElementById('importFile');
const userAvatar = document.getElementById('userAvatar');

const routeMap = new Map(routes.map((route) => [route.path, route]));
const defaultRoute = routes[0];

const buildNav = () => {
  sideNav.innerHTML = '';
  routes.forEach((route) => {
    const button = document.createElement('fluent-button');
    button.setAttribute('appearance', 'stealth');
    button.textContent = t(route.labelKey);
    button.dataset.route = route.path;
    button.addEventListener('click', () => navigate(route.path));
    sideNav.appendChild(button);
  });
};

const setActiveNav = (path) => {
  sideNav.querySelectorAll('fluent-button').forEach((btn) => {
    btn.appearance = btn.dataset.route === path ? 'accent' : 'stealth';
  });
};

const renderRoute = (path) => {
  const target = routeMap.get(path) || defaultRoute;
  setActiveNav(target.path);
  breadcrumb.textContent = t(target.labelKey);
  content.innerHTML = '';
  target.render(content, {
    data: getData(),
    navigate
  });
  applyTranslations(content);
  content.focus();
};

const getHashPath = () => {
  const hash = window.location.hash || defaultRoute.path;
  const [path] = hash.split('?');
  return routeMap.has(path) ? path : defaultRoute.path;
};

export const navigate = (path) => {
  if (window.location.hash !== path) {
    window.location.hash = path;
  } else {
    renderRoute(path);
  }
};

window.addEventListener('hashchange', () => {
  const path = getHashPath();
  renderRoute(path);
});

const initTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'light' ? t('theme.light') : t('theme.dark');
};

const toggleTheme = () => {
  const data = getData();
  const next = data.settings.theme === 'light' ? 'dark' : 'light';
  setData((draft) => {
    draft.settings.theme = next;
  });
  initTheme(next);
};

themeToggle.addEventListener('click', toggleTheme);

langToggle.addEventListener('click', () => {
  const locale = toggleLocale();
  showToast(locale === 'ar' ? 'تم تغيير اللغة' : 'Langue changée');
  buildNav();
});

exportButton.addEventListener('click', () => {
  const json = exportDataset();
  downloadBlob(new Blob([json], { type: 'application/json' }), 'atlas-data.json');
});

importButton.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    importDataset(text);
    showToast('Import réussi');
    renderRoute(getHashPath());
  } catch (error) {
    showToast(error.message, 'warn');
  }
  importFile.value = '';
});

subscribe((state) => {
  initTheme(state.settings.theme);
});

const initApp = () => {
  const state = getData();
  setLocale(state.settings.locale || 'fr');
  ensureDir(state.settings.rtl);
  try {
    const user = JSON.parse(localStorage.getItem('atlasUser') || 'null');
    if (user && userAvatar) {
      userAvatar.setAttribute('name', user.name || 'Utilisateur');
      userAvatar.title = user.email || '';
    }
  } catch {}
  // Ensure demo freshness: add one absence today and one future training session if missing
  const today = new Date().toISOString().slice(0, 10);
  const hasTodayAttendance = state.attendance?.some((a) => a.date === today);
  if (!hasTodayAttendance && state.employees?.length) {
    setData((draft) => {
      draft.attendance.push({
        id: `ATT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        employeeId: draft.employees[0].id,
        date: today,
        status: 'Absent',
        motif: 'Maladie'
      });
    });
  }
  const hasFutureTraining = state.formations?.some((f) => f.sessions?.some((s) => new Date(s.date) >= new Date()));
  if (!hasFutureTraining && state.formations?.length) {
    setData((draft) => {
      const target = draft.formations[0];
      const d = new Date();
      d.setDate(d.getDate() + 14);
      target.sessions.push({ date: d.toISOString().slice(0, 10), lieu: 'Casablanca', participants: 15, presence: 0, evaluation: 0 });
    });
  }
  buildNav();
  renderRoute(getHashPath());
  applyTranslations(document.body);
};

initApp();
