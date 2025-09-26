const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const statusBanner = document.getElementById('authStatus');
const accountList = document.getElementById('accountList');
const rememberCheckbox = document.getElementById('remember');

const PREF_SCOPE_KEY = 'atlas-preferred-scope';
const REMEMBER_KEY = 'atlas-remember-email';

const scopeLabels = {
  public: 'Secteur public',
  private: 'Secteur privé'
};

const scopeDescriptions = {
  public: "Pilotage des concours, gestion statutaire et conformité budgétaire.",
  private: "Portail grands comptes avec workflows paie, QVT et performance."
};

const demoAccounts = window.AtlasAuth?.getDemoAccounts?.() ?? [
  {
    email: 'public.admin@atlas.local',
    password: 'Public#2024',
    scope: 'public',
    displayName: 'Administrateur Secteur Public',
    organisation: 'Ministère de l’Intérieur',
    avatarColor: '#2563eb'
  },
  {
    email: 'private.director@atlas.local',
    password: 'Private#2024',
    scope: 'private',
    displayName: 'HR Suite Manager',
    organisation: 'Atlas Industries Group',
    avatarColor: '#9333ea'
  }
];

const showStatus = (message, state = '') => {
  if (!statusBanner) return;
  statusBanner.textContent = message;
  if (state) {
    statusBanner.dataset.state = state;
  } else {
    delete statusBanner.dataset.state;
  }
};

const highlightAccount = (scope) => {
  accountList.querySelectorAll('.demo-account').forEach((item) => {
    item.dataset.active = item.dataset.scope === scope ? 'true' : 'false';
  });
};

const prefillAccount = (account) => {
  emailInput.value = account.email;
  passwordInput.value = account.password;
  highlightAccount(account.scope);
  showStatus(
    `Identifiants préremplis pour le portail ${scopeLabels[account.scope]}.`,
    'success'
  );
};

const renderAccounts = (preferredScope) => {
  accountList.innerHTML = '';
  demoAccounts.forEach((account) => {
    const listItem = document.createElement('li');
    listItem.className = 'demo-account';
    listItem.dataset.scope = account.scope;

    const header = document.createElement('div');
    header.className = 'demo-account__header';
    header.innerHTML = `
      <span>${account.displayName}</span>
      <span class="badge">${scopeLabels[account.scope]}</span>
    `;

    const meta = document.createElement('div');
    meta.className = 'demo-account__chips';
    meta.innerHTML = `
      <code>${account.email}</code>
      <code>${account.password}</code>
    `;

    const description = document.createElement('p');
    description.textContent = scopeDescriptions[account.scope] ?? '';

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'btn btn-outline';
    action.textContent = 'Préremplir';
    action.addEventListener('click', () => prefillAccount(account));

    listItem.append(header, meta, description, action);
    accountList.appendChild(listItem);
  });

  if (preferredScope) {
    const target = demoAccounts.find((account) => account.scope === preferredScope);
    if (target) {
      highlightAccount(preferredScope);
    }
  }
};

const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
if (rememberedEmail) {
  emailInput.value = rememberedEmail;
  rememberCheckbox.checked = true;
}

const urlParams = new URLSearchParams(window.location.search);
const statusParam = urlParams.get('status');
const scopeParam = urlParams.get('scope');
const redirectParam = urlParams.get('redirect');

const sessionScope = sessionStorage.getItem(PREF_SCOPE_KEY);
const preferredScope = scopeParam || sessionScope || (demoAccounts[0]?.scope ?? 'public');

renderAccounts(preferredScope);

if (preferredScope) {
  const preferredAccount = demoAccounts.find((item) => item.scope === preferredScope);
  if (preferredAccount && !rememberedEmail) {
    prefillAccount(preferredAccount);
  }
}

if (statusParam === 'unauthorized') {
  showStatus('Merci de vous connecter pour accéder à votre portail.', 'error');
} else if (statusParam === 'forbidden') {
  showStatus('Veuillez choisir le compte correspondant au portail demandé.', 'error');
}

const activeUser = window.AtlasAuth?.getActiveUser?.();
if (activeUser) {
  const portalUrl = window.AtlasAuth.getDashboardPath(activeUser.scope);
  statusBanner.innerHTML = `
    Connecté en tant que <strong>${activeUser.displayName}</strong>. <a href="${portalUrl}">Ouvrir le portail</a>.
  `;
  statusBanner.dataset.state = 'success';
}

const resolveRedirect = (value, scope) => {
  if (!value) return window.AtlasAuth.getDashboardPath(scope);
  try {
    const maybeUrl = new URL(value, window.location.href);
    return maybeUrl.href;
  } catch (error) {
    console.warn('Redirection invalide, utilisation du portail par défaut', error);
    return window.AtlasAuth.getDashboardPath(scope);
  }
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showStatus('Veuillez renseigner votre e-mail et votre mot de passe.', 'error');
    return;
  }

  const result = window.AtlasAuth?.signIn?.(email, password);
  if (!result?.success) {
    showStatus(result?.error ?? 'Connexion impossible.', 'error');
    return;
  }

  if (rememberCheckbox.checked) {
    localStorage.setItem(REMEMBER_KEY, email);
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }

  sessionStorage.removeItem(PREF_SCOPE_KEY);
  const destination = resolveRedirect(redirectParam, result.user.scope);
  showStatus('Connexion réussie, redirection en cours…', 'success');

  setTimeout(() => {
    window.location.href = destination;
  }, 450);
});
