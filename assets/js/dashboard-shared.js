(() => {
  const avatarElement = document.querySelector('[data-user-avatar]');
  const userNameElement = document.querySelector('[data-user-name]');
  const userOrgElement = document.querySelector('[data-user-organisation]');
  const dateElements = document.querySelectorAll('[data-current-date]');
  const navButtons = Array.from(document.querySelectorAll('[data-nav-target]'));

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';
    return Number(value).toLocaleString('fr-FR');
  };

  const formatPercent = (value, digits = 1) => {
    if (value === null || value === undefined) return '0%';
    return `${Number(value).toFixed(digits).replace('.', ',')}%`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0 MAD';
    return `${Number(value).toLocaleString('fr-FR')} MAD`;
  };

  const populateUser = (user) => {
    if (!user) return;
    if (avatarElement) {
      const initials = user.displayName
        ?.split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();
      avatarElement.textContent = initials;
      avatarElement.style.background = user.avatarColor ?? 'var(--accent-solid)';
    }
    if (userNameElement) userNameElement.textContent = user.displayName;
    if (userOrgElement) userOrgElement.textContent = user.organisation ?? '';
  };

  const setCurrentDate = () => {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long'
    });
    dateElements.forEach((element) => {
      element.textContent = formatter.format(new Date());
    });
  };

  const setActiveNav = (target) => {
    navButtons.forEach((button) => {
      const isActive = button.dataset.navTarget === target;
      button.dataset.active = isActive ? 'true' : 'false';
    });
  };

  const registerNav = () => {
    navButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveNav(button.dataset.navTarget);
      });
    });
  };

  const registerSegmentedControl = (containerSelector, callback) => {
    const container =
      typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll('button'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          item.dataset.selected = item === button ? 'true' : 'false';
        });
        callback?.(button.dataset.value ?? button.dataset.range ?? button.value, button);
      });
    });
  };

  const init = (scope, { defaultNav = null, onReady } = {}) => {
    const user = window.AtlasAuth?.requireScope?.(scope);
    if (!user) return;
    populateUser(user);
    setCurrentDate();
    registerNav();
    if (defaultNav) {
      setActiveNav(defaultNav);
    }
    onReady?.(user);
  };

  window.AtlasDashboard = {
    init,
    formatNumber,
    formatPercent,
    formatCurrency,
    setActiveNav,
    registerSegmentedControl
  };
})();
