// ============================================
// Atlas HR Suite - Main Application
// ============================================

// Data Store
class DataStore {
    constructor() {
        this.key = 'atlas-hr-data';
        this.listeners = [];
        this.data = this.load();
    }

    load() {
        try {
            const stored = localStorage.getItem(this.key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading data:', e);
        }
        return this.getDefaultData();
    }

    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.data));
            this.notify();
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    get(path) {
        if (!path) return this.data;
        return path.split('.').reduce((obj, key) => obj?.[key], this.data);
    }

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.data);
        target[lastKey] = value;
        this.save();
    }

    update(updater) {
        updater(this.data);
        this.save();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.data));
    }

    reset() {
        this.data = this.getDefaultData();
        this.save();
    }

    export() {
        return JSON.stringify(this.data, null, 2);
    }

    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = { ...this.getDefaultData(), ...imported };
            this.save();
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }

    getDefaultData() {
        return {
            settings: {
                theme: 'light',
                locale: 'fr'
            },
            employees: [
                {
                    id: 'EMP001',
                    prenom: 'Ahmed',
                    nom: 'Benali',
                    email: 'ahmed.benali@example.com',
                    telephone: '+212 6 12 34 56 78',
                    poste: 'Développeur Senior',
                    departement: 'IT',
                    dateEmbauche: '2020-03-15',
                    salaire: 18000,
                    statut: 'Actif',
                    manager: null
                },
                {
                    id: 'EMP002',
                    prenom: 'Fatima',
                    nom: 'El Amrani',
                    email: 'fatima.elamrani@example.com',
                    telephone: '+212 6 23 45 67 89',
                    poste: 'Responsable RH',
                    departement: 'RH',
                    dateEmbauche: '2019-01-10',
                    salaire: 22000,
                    statut: 'Actif',
                    manager: null
                },
                {
                    id: 'EMP003',
                    prenom: 'Youssef',
                    nom: 'Idrissi',
                    email: 'youssef.idrissi@example.com',
                    telephone: '+212 6 34 56 78 90',
                    poste: 'Commercial',
                    departement: 'Ventes',
                    dateEmbauche: '2021-06-01',
                    salaire: 15000,
                    statut: 'Actif',
                    manager: 'EMP001'
                },
                {
                    id: 'EMP004',
                    prenom: 'Zineb',
                    nom: 'Alaoui',
                    email: 'zineb.alaoui@example.com',
                    telephone: '+212 6 45 67 89 01',
                    poste: 'Comptable',
                    departement: 'Finance',
                    dateEmbauche: '2020-09-15',
                    salaire: 16000,
                    statut: 'Actif',
                    manager: 'EMP002'
                },
                {
                    id: 'EMP005',
                    prenom: 'Mohamed',
                    nom: 'Tazi',
                    email: 'mohamed.tazi@example.com',
                    telephone: '+212 6 56 78 90 12',
                    poste: 'Designer UI/UX',
                    departement: 'IT',
                    dateEmbauche: '2022-02-01',
                    salaire: 14000,
                    statut: 'Actif',
                    manager: 'EMP001'
                }
            ],
            candidats: [
                {
                    id: 'CAN001',
                    prenom: 'Karim',
                    nom: 'Benjelloun',
                    email: 'karim.benjelloun@email.com',
                    telephone: '+212 6 11 22 33 44',
                    poste: 'Développeur Full Stack',
                    statut: 'Entretien',
                    datePostulation: '2025-11-01',
                    cv: 'cv-karim-benjelloun.pdf',
                    experience: '5 ans'
                },
                {
                    id: 'CAN002',
                    prenom: 'Amina',
                    nom: 'Chakir',
                    email: 'amina.chakir@email.com',
                    telephone: '+212 6 22 33 44 55',
                    poste: 'Chef de Projet',
                    statut: 'Présélection',
                    datePostulation: '2025-11-05',
                    cv: 'cv-amina-chakir.pdf',
                    experience: '7 ans'
                },
                {
                    id: 'CAN003',
                    prenom: 'Rachid',
                    nom: 'Sabri',
                    email: 'rachid.sabri@email.com',
                    telephone: '+212 6 33 44 55 66',
                    poste: 'Ingénieur DevOps',
                    statut: 'Nouveau',
                    datePostulation: '2025-11-08',
                    cv: 'cv-rachid-sabri.pdf',
                    experience: '3 ans'
                }
            ],
            conges: [
                {
                    id: 'LEAVE001',
                    employeeId: 'EMP001',
                    type: 'Congé payé',
                    dateDebut: '2025-12-20',
                    dateFin: '2025-12-31',
                    jours: 10,
                    statut: 'Approuvé',
                    motif: 'Vacances de fin d\'année'
                },
                {
                    id: 'LEAVE002',
                    employeeId: 'EMP003',
                    type: 'Congé maladie',
                    dateDebut: '2025-11-15',
                    dateFin: '2025-11-17',
                    jours: 3,
                    statut: 'En attente',
                    motif: 'Consultation médicale'
                }
            ],
            formations: [
                {
                    id: 'TRAIN001',
                    titre: 'Leadership et Management',
                    description: 'Formation sur les compétences managériales',
                    dateDebut: '2025-12-01',
                    dateFin: '2025-12-03',
                    formateur: 'Institut de Formation Pro',
                    participants: ['EMP002', 'EMP001'],
                    budget: 15000,
                    statut: 'Planifié'
                },
                {
                    id: 'TRAIN002',
                    titre: 'Sécurité Informatique',
                    description: 'Sensibilisation à la cybersécurité',
                    dateDebut: '2025-11-25',
                    dateFin: '2025-11-25',
                    formateur: 'CyberSec Academy',
                    participants: ['EMP001', 'EMP003', 'EMP005'],
                    budget: 8000,
                    statut: 'Planifié'
                }
            ],
            evaluations: [
                {
                    id: 'EVAL001',
                    employeeId: 'EMP001',
                    evaluateur: 'EMP002',
                    date: '2025-06-15',
                    periode: '2024-2025',
                    noteGlobale: 4.5,
                    competences: {
                        technique: 5,
                        communication: 4,
                        travailEquipe: 5,
                        initiative: 4
                    },
                    commentaires: 'Excellent travail, leadership démontré',
                    objectifs: 'Continuer à mentorer l\'équipe'
                }
            ],
            departements: [
                { id: 'DEP001', nom: 'IT', responsable: 'EMP001', budget: 500000 },
                { id: 'DEP002', nom: 'RH', responsable: 'EMP002', budget: 300000 },
                { id: 'DEP003', nom: 'Finance', responsable: 'EMP004', budget: 400000 },
                { id: 'DEP004', nom: 'Ventes', responsable: 'EMP003', budget: 600000 }
            ],
            paie: {
                mois: '2025-11',
                traitee: false,
                details: []
            }
        };
    }
}

// Router
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    register(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const handler = this.routes.get(hash) || this.routes.get('/');

        if (handler) {
            this.currentRoute = hash;
            handler();
        }
    }

    start() {
        this.handleRoute();
    }
}

// UI Utils
const UI = {
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
    },

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    },

    formatDate(date) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    },

    formatNumber(number) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }
};

// Application Instance
const store = new DataStore();
const router = new Router();

// Navigation Handler
function setupNavigation() {
    const navMenu = document.getElementById('navMenu');
    const routes = [
        { path: '/', icon: '📊', label: 'Tableau de bord' },
        { path: '/employees', icon: '👥', label: 'Employés' },
        { path: '/recruitment', icon: '🎯', label: 'Recrutement' },
        { path: '/leaves', icon: '🏖️', label: 'Congés' },
        { path: '/training', icon: '📚', label: 'Formations' },
        { path: '/performance', icon: '⭐', label: 'Évaluations' },
        { path: '/payroll', icon: '💰', label: 'Paie' },
        { path: '/reports', icon: '📈', label: 'Rapports' }
    ];

    navMenu.innerHTML = routes.map(route => `
        <button class="nav-item" data-route="${route.path}">
            <span>${route.icon} ${route.label}</span>
        </button>
    `).join('');

    navMenu.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-item');
        if (btn) {
            const path = btn.dataset.route;
            router.navigate(path);

            // Update active state
            navMenu.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            btn.classList.add('active');
        }
    });
}

// Theme Handler
function setupTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const currentTheme = store.get('settings.theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        store.set('settings.theme', newTheme);
        UI.showToast(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`);
    });
}

// Export Handler
function setupExport() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => {
        const data = store.export();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atlas-hr-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        UI.showToast('Données exportées avec succès', 'success');
    });
}

// Initialize App
function init() {
    setupNavigation();
    setupTheme();
    setupExport();

    // Register routes (defined in separate files)
    registerRoutes();

    // Start router
    router.start();

    console.log('Atlas HR Suite initialized ✓');
}

// Export for use in other modules
window.App = {
    store,
    router,
    UI
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
