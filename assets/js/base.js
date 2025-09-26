(() => {
  const THEME_KEY = 'atlas-theme';
  const USER_KEY = 'atlas-active-user';
  const rootUrl = new URL(document.body?.dataset?.root ?? './', window.location.href);

  const accounts = [
    {
      email: 'public.admin@atlas.local',
      password: 'Public#2024',
      scope: 'public',
      displayName: 'Administrateur Secteur Public',
      organisation: 'Ministère de l’Intérieur',
      avatarColor: '#2563eb',
      lastLogin: '2024-10-12T09:15:00Z'
    },
    {
      email: 'private.director@atlas.local',
      password: 'Private#2024',
      scope: 'private',
      displayName: 'HR Suite Manager',
      organisation: 'Atlas Industries Group',
      avatarColor: '#9333ea',
      lastLogin: '2024-10-10T08:05:00Z'
    }
  ];

  const resolvePath = (relativePath) => new URL(relativePath, rootUrl).href;

  const storeUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const readUser = () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Impossible de lire l’utilisateur local, purge du cache', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  };

  const signIn = (email, password) => {
    const account = accounts.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!account || account.password !== password) {
      return {
        success: false,
        error:
          "Identifiants invalides. Utilisez les comptes de démonstration fournis ci-dessous."
      };
    }

    const authUser = {
      email: account.email,
      scope: account.scope,
      displayName: account.displayName,
      organisation: account.organisation,
      avatarColor: account.avatarColor,
      lastLogin: new Date().toISOString()
    };

    storeUser(authUser);
    return { success: true, user: authUser };
  };

  const signOut = () => {
    localStorage.removeItem(USER_KEY);
  };

  const requireScope = (scope, { redirect = true } = {}) => {
    const active = readUser();
    if (!active) {
      if (redirect) {
        const params = new URLSearchParams({ scope, status: 'unauthorized' });
        window.location.href = `${resolvePath('pages/login.html')}?${params.toString()}`;
      }
      return null;
    }

    if (scope && active.scope !== scope) {
      if (redirect) {
        const params = new URLSearchParams({ scope, status: 'forbidden' });
        window.location.href = `${resolvePath('pages/login.html')}?${params.toString()}`;
      }
      return null;
    }

    return active;
  };

  const getDashboardPath = (scope) => {
    if (scope === 'public') return resolvePath('pages/dashboard-public.html');
    if (scope === 'private') return resolvePath('pages/dashboard-private.html');
    return resolvePath('index.html');
  };

  const observeReveal = (selector) => {
    const elements =
      typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : selector ?? [];

    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  };

  const setTheme = (mode) => {
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem(THEME_KEY, mode);
  };

  const toggleTheme = () => {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  };

  const registerThemeToggle = () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      toggleTheme();
      const label = document.body.classList.contains('dark')
        ? 'Activer le thème clair'
        : 'Activer le thème sombre';
      toggle.setAttribute('aria-label', label);
    });
  };

  const attachSignedOutHandlers = () => {
    document.querySelectorAll('[data-action="sign-out"]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        signOut();
        window.location.href = resolvePath('pages/login.html');
      });
    });
  };

  initTheme();
  document.addEventListener('DOMContentLoaded', () => {
    registerThemeToggle();
    attachSignedOutHandlers();
  });

  window.AtlasPaths = {
    root: rootUrl.href,
    home: resolvePath('index.html'),
    login: resolvePath('pages/login.html'),
    dashboards: {
      public: resolvePath('pages/dashboard-public.html'),
      private: resolvePath('pages/dashboard-private.html')
    }
  };

  window.AtlasAuth = {
    accounts: accounts.map(({ password, ...rest }) => rest),
    getDemoAccounts: () => accounts.map((item) => ({ ...item })),
    signIn,
    signOut,
    requireScope,
    getActiveUser: readUser,
    getDashboardPath,
    resolvePath
  };

  window.AtlasUI = {
    observeReveal
  };
})();
