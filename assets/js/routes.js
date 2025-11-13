// ============================================
// Atlas HR Suite - Routes & Views
// ============================================

function registerRoutes() {
    const { router, store, UI } = window.App;
    const content = document.getElementById('appContent');

    // Dashboard
    router.register('/', () => {
        const data = store.get();
        const employees = data.employees || [];
        const candidats = data.candidats || [];
        const conges = data.conges || [];
        const formations = data.formations || [];

        const totalEmployees = employees.length;
        const activeCandidates = candidats.filter(c => c.statut !== 'Rejeté').length;
        const pendingLeaves = conges.filter(c => c.statut === 'En attente').length;
        const upcomingTraining = formations.filter(f => f.statut === 'Planifié').length;

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Tableau de bord</h1>
                <p class="page-subtitle">Vue d'ensemble de votre plateforme RH</p>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Employés actifs</div>
                    <div class="kpi-value">${totalEmployees}</div>
                    <div class="kpi-change">↗ Personnel total</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Candidatures actives</div>
                    <div class="kpi-value">${activeCandidates}</div>
                    <div class="kpi-change">🎯 En cours de traitement</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Demandes de congés</div>
                    <div class="kpi-value">${pendingLeaves}</div>
                    <div class="kpi-change">⏳ En attente d'approbation</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Formations planifiées</div>
                    <div class="kpi-value">${upcomingTraining}</div>
                    <div class="kpi-change">📚 Sessions à venir</div>
                </div>
            </div>

            <div class="grid grid-2">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Activités récentes</h2>
                    </div>
                    <div class="card-body">
                        <ul class="stats-list">
                            <li class="stats-item">
                                <span class="stats-label">Dernières embauches</span>
                                <span class="stats-value">${employees.slice(-3).map(e => e.prenom).join(', ')}</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Candidatures cette semaine</span>
                                <span class="stats-value">${candidats.length} nouvelles</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Formations ce mois-ci</span>
                                <span class="stats-value">${formations.length} sessions</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Actions rapides</h2>
                    </div>
                    <div class="card-body">
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="App.router.navigate('/employees')">
                                👥 Gérer les employés
                            </button>
                            <button class="btn btn-primary" onclick="App.router.navigate('/recruitment')">
                                🎯 Voir les candidatures
                            </button>
                            <button class="btn btn-primary" onclick="App.router.navigate('/leaves')">
                                🏖️ Approuver les congés
                            </button>
                            <button class="btn btn-secondary" onclick="App.router.navigate('/payroll')">
                                💰 Gérer la paie
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Employees
    router.register('/employees', () => {
        const employees = store.get('employees') || [];

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Gestion des employés</h1>
                <p class="page-subtitle">Liste complète du personnel</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Employés (${employees.length})</h2>
                    <button class="btn btn-primary" onclick="addEmployee()">➕ Ajouter un employé</button>
                </div>
                <div class="card-body">
                    ${employees.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <h3 class="empty-state-title">Aucun employé</h3>
                            <p class="empty-state-text">Commencez par ajouter votre premier employé</p>
                        </div>
                    ` : `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom complet</th>
                                    <th>Poste</th>
                                    <th>Département</th>
                                    <th>Email</th>
                                    <th>Date d'embauche</th>
                                    <th>Salaire</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${employees.map(emp => `
                                    <tr>
                                        <td><strong>${emp.id}</strong></td>
                                        <td>${emp.prenom} ${emp.nom}</td>
                                        <td>${emp.poste}</td>
                                        <td>${emp.departement}</td>
                                        <td>${emp.email}</td>
                                        <td>${UI.formatDate(emp.dateEmbauche)}</td>
                                        <td>${UI.formatCurrency(emp.salaire)}</td>
                                        <td><span class="badge badge-success">${emp.statut}</span></td>
                                        <td>
                                            <button class="btn btn-secondary" onclick="editEmployee('${emp.id}')">✏️</button>
                                            <button class="btn btn-danger" onclick="deleteEmployee('${emp.id}')">🗑️</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        `;
    });

    // Recruitment
    router.register('/recruitment', () => {
        const candidats = store.get('candidats') || [];

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Recrutement</h1>
                <p class="page-subtitle">Gestion des candidatures et processus de recrutement</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Candidatures (${candidats.length})</h2>
                    <button class="btn btn-primary" onclick="addCandidate()">➕ Nouvelle candidature</button>
                </div>
                <div class="card-body">
                    ${candidats.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">🎯</div>
                            <h3 class="empty-state-title">Aucune candidature</h3>
                            <p class="empty-state-text">Les nouvelles candidatures apparaîtront ici</p>
                        </div>
                    ` : `
                        <div class="grid grid-3">
                            ${candidats.map(can => `
                                <div class="card">
                                    <h3>${can.prenom} ${can.nom}</h3>
                                    <p><strong>Poste :</strong> ${can.poste}</p>
                                    <p><strong>Expérience :</strong> ${can.experience}</p>
                                    <p><strong>Email :</strong> ${can.email}</p>
                                    <p><strong>Téléphone :</strong> ${can.telephone}</p>
                                    <p><strong>Date de postulation :</strong> ${UI.formatDate(can.datePostulation)}</p>
                                    <p><span class="badge ${
                                        can.statut === 'Entretien' ? 'badge-warning' :
                                        can.statut === 'Présélection' ? 'badge-info' :
                                        can.statut === 'Accepté' ? 'badge-success' :
                                        'badge-info'
                                    }">${can.statut}</span></p>
                                    <div class="btn-group mt-2">
                                        <button class="btn btn-secondary" onclick="viewCandidate('${can.id}')">👁️ Voir</button>
                                        <button class="btn btn-primary" onclick="updateCandidateStatus('${can.id}')">✔️ Mettre à jour</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    });

    // Leaves
    router.register('/leaves', () => {
        const conges = store.get('conges') || [];
        const employees = store.get('employees') || [];

        const getEmployeeName = (empId) => {
            const emp = employees.find(e => e.id === empId);
            return emp ? `${emp.prenom} ${emp.nom}` : empId;
        };

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Gestion des congés</h1>
                <p class="page-subtitle">Demandes de congés et absences</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Demandes de congés (${conges.length})</h2>
                    <button class="btn btn-primary" onclick="addLeave()">➕ Nouvelle demande</button>
                </div>
                <div class="card-body">
                    ${conges.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">🏖️</div>
                            <h3 class="empty-state-title">Aucune demande de congé</h3>
                            <p class="empty-state-text">Les demandes de congés apparaîtront ici</p>
                        </div>
                    ` : `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employé</th>
                                    <th>Type</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Jours</th>
                                    <th>Motif</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${conges.map(leave => `
                                    <tr>
                                        <td><strong>${leave.id}</strong></td>
                                        <td>${getEmployeeName(leave.employeeId)}</td>
                                        <td>${leave.type}</td>
                                        <td>${UI.formatDate(leave.dateDebut)}</td>
                                        <td>${UI.formatDate(leave.dateFin)}</td>
                                        <td>${leave.jours}</td>
                                        <td>${leave.motif}</td>
                                        <td><span class="badge ${
                                            leave.statut === 'Approuvé' ? 'badge-success' :
                                            leave.statut === 'Rejeté' ? 'badge-danger' :
                                            'badge-warning'
                                        }">${leave.statut}</span></td>
                                        <td>
                                            ${leave.statut === 'En attente' ? `
                                                <button class="btn btn-success" onclick="approveLeave('${leave.id}')">✅</button>
                                                <button class="btn btn-danger" onclick="rejectLeave('${leave.id}')">❌</button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        `;
    });

    // Training
    router.register('/training', () => {
        const formations = store.get('formations') || [];
        const employees = store.get('employees') || [];

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Formations</h1>
                <p class="page-subtitle">Gestion du plan de formation</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Sessions de formation (${formations.length})</h2>
                    <button class="btn btn-primary" onclick="addTraining()">➕ Nouvelle formation</button>
                </div>
                <div class="card-body">
                    ${formations.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">📚</div>
                            <h3 class="empty-state-title">Aucune formation</h3>
                            <p class="empty-state-text">Créez votre première session de formation</p>
                        </div>
                    ` : `
                        <div class="grid grid-2">
                            ${formations.map(training => `
                                <div class="card">
                                    <h3>${training.titre}</h3>
                                    <p>${training.description}</p>
                                    <div class="stats-list">
                                        <div class="stats-item">
                                            <span class="stats-label">Date</span>
                                            <span class="stats-value">${UI.formatDate(training.dateDebut)} - ${UI.formatDate(training.dateFin)}</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Formateur</span>
                                            <span class="stats-value">${training.formateur}</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Participants</span>
                                            <span class="stats-value">${training.participants.length} employés</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Budget</span>
                                            <span class="stats-value">${UI.formatCurrency(training.budget)}</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Statut</span>
                                            <span class="stats-value"><span class="badge badge-info">${training.statut}</span></span>
                                        </div>
                                    </div>
                                    <div class="btn-group mt-2">
                                        <button class="btn btn-secondary" onclick="editTraining('${training.id}')">✏️ Modifier</button>
                                        <button class="btn btn-danger" onclick="deleteTraining('${training.id}')">🗑️ Supprimer</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    });

    // Performance
    router.register('/performance', () => {
        const evaluations = store.get('evaluations') || [];
        const employees = store.get('employees') || [];

        const getEmployeeName = (empId) => {
            const emp = employees.find(e => e.id === empId);
            return emp ? `${emp.prenom} ${emp.nom}` : empId;
        };

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Évaluations de performance</h1>
                <p class="page-subtitle">Suivi des performances et objectifs</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Évaluations (${evaluations.length})</h2>
                    <button class="btn btn-primary" onclick="addEvaluation()">➕ Nouvelle évaluation</button>
                </div>
                <div class="card-body">
                    ${evaluations.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">⭐</div>
                            <h3 class="empty-state-title">Aucune évaluation</h3>
                            <p class="empty-state-text">Créez votre première évaluation de performance</p>
                        </div>
                    ` : `
                        <div class="grid grid-2">
                            ${evaluations.map(eval => `
                                <div class="card">
                                    <h3>${getEmployeeName(eval.employeeId)}</h3>
                                    <p><strong>Évaluateur :</strong> ${getEmployeeName(eval.evaluateur)}</p>
                                    <p><strong>Période :</strong> ${eval.periode}</p>
                                    <p><strong>Date :</strong> ${UI.formatDate(eval.date)}</p>
                                    <div class="stats-list mt-2">
                                        <div class="stats-item">
                                            <span class="stats-label">Note globale</span>
                                            <span class="stats-value">${eval.noteGlobale}/5 ⭐</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Technique</span>
                                            <span class="stats-value">${eval.competences.technique}/5</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Communication</span>
                                            <span class="stats-value">${eval.competences.communication}/5</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Travail d'équipe</span>
                                            <span class="stats-value">${eval.competences.travailEquipe}/5</span>
                                        </div>
                                        <div class="stats-item">
                                            <span class="stats-label">Initiative</span>
                                            <span class="stats-value">${eval.competences.initiative}/5</span>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <strong>Commentaires :</strong>
                                        <p>${eval.commentaires}</p>
                                    </div>
                                    <div class="mt-2">
                                        <strong>Objectifs :</strong>
                                        <p>${eval.objectifs}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    });

    // Payroll
    router.register('/payroll', () => {
        const employees = store.get('employees') || [];
        const paieData = store.get('paie') || { mois: '2025-11', traitee: false, details: [] };

        const totalSalaires = employees.reduce((sum, emp) => sum + (emp.salaire || 0), 0);
        const avgSalaire = employees.length > 0 ? totalSalaires / employees.length : 0;

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Gestion de la paie</h1>
                <p class="page-subtitle">Traitement de la paie - ${paieData.mois}</p>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Masse salariale totale</div>
                    <div class="kpi-value">${UI.formatCurrency(totalSalaires)}</div>
                    <div class="kpi-change">💰 Mensuel</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Salaire moyen</div>
                    <div class="kpi-value">${UI.formatCurrency(avgSalaire)}</div>
                    <div class="kpi-change">📊 Par employé</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Employés payés</div>
                    <div class="kpi-value">${employees.length}</div>
                    <div class="kpi-change">👥 Total</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Statut</div>
                    <div class="kpi-value">${paieData.traitee ? '✅' : '⏳'}</div>
                    <div class="kpi-change">${paieData.traitee ? 'Traitée' : 'En attente'}</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Détails de la paie</h2>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="processPayroll()">▶️ Traiter la paie</button>
                        <button class="btn btn-secondary" onclick="exportPayroll()">📥 Exporter</button>
                    </div>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Employé</th>
                                <th>Département</th>
                                <th>Salaire de base</th>
                                <th>CNSS (4.48%)</th>
                                <th>AMO (2.26%)</th>
                                <th>IR</th>
                                <th>Salaire net</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(emp => {
                                const salaireBrut = emp.salaire || 0;
                                const cnss = salaireBrut * 0.0448;
                                const amo = salaireBrut * 0.0226;
                                const ir = salaireBrut * 0.10; // Simplifié
                                const salaireNet = salaireBrut - cnss - amo - ir;

                                return `
                                    <tr>
                                        <td>${emp.prenom} ${emp.nom}</td>
                                        <td>${emp.departement}</td>
                                        <td>${UI.formatCurrency(salaireBrut)}</td>
                                        <td>${UI.formatCurrency(cnss)}</td>
                                        <td>${UI.formatCurrency(amo)}</td>
                                        <td>${UI.formatCurrency(ir)}</td>
                                        <td><strong>${UI.formatCurrency(salaireNet)}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    // Reports
    router.register('/reports', () => {
        const data = store.get();
        const employees = data.employees || [];
        const candidats = data.candidats || [];
        const conges = data.conges || [];
        const formations = data.formations || [];
        const departements = data.departements || [];

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Rapports et statistiques</h1>
                <p class="page-subtitle">Vue d'ensemble des métriques RH</p>
            </div>

            <div class="grid grid-2">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Statistiques générales</h2>
                    </div>
                    <div class="card-body">
                        <ul class="stats-list">
                            <li class="stats-item">
                                <span class="stats-label">Total employés</span>
                                <span class="stats-value">${employees.length}</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Candidatures</span>
                                <span class="stats-value">${candidats.length}</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Demandes de congés</span>
                                <span class="stats-value">${conges.length}</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Formations</span>
                                <span class="stats-value">${formations.length}</span>
                            </li>
                            <li class="stats-item">
                                <span class="stats-label">Départements</span>
                                <span class="stats-value">${departements.length}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Départements</h2>
                    </div>
                    <div class="card-body">
                        <ul class="stats-list">
                            ${departements.map(dept => {
                                const deptEmployees = employees.filter(e => e.departement === dept.nom);
                                return `
                                    <li class="stats-item">
                                        <span class="stats-label">${dept.nom}</span>
                                        <span class="stats-value">${deptEmployees.length} employés</span>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Budget formation</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Budget total alloué :</strong></p>
                        <div class="kpi-value">${UI.formatCurrency(formations.reduce((sum, f) => sum + f.budget, 0))}</div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Actions rapides</h2>
                    </div>
                    <div class="card-body">
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="exportAllData()">📊 Exporter tout</button>
                            <button class="btn btn-secondary" onclick="printReport()">🖨️ Imprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Global action functions
window.addEmployee = function() {
    App.UI.showToast('Fonctionnalité en cours de développement', 'info');
};

window.editEmployee = function(id) {
    App.UI.showToast(`Édition de l'employé ${id}`, 'info');
};

window.deleteEmployee = function(id) {
    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
        App.store.update(data => {
            data.employees = data.employees.filter(e => e.id !== id);
        });
        App.UI.showToast('Employé supprimé', 'success');
        App.router.navigate('/employees');
    }
};

window.addCandidate = function() {
    App.UI.showToast('Fonctionnalité en cours de développement', 'info');
};

window.viewCandidate = function(id) {
    App.UI.showToast(`Affichage du candidat ${id}`, 'info');
};

window.updateCandidateStatus = function(id) {
    App.UI.showToast('Mise à jour du statut', 'info');
};

window.addLeave = function() {
    App.UI.showToast('Fonctionnalité en cours de développement', 'info');
};

window.approveLeave = function(id) {
    App.store.update(data => {
        const leave = data.conges.find(l => l.id === id);
        if (leave) leave.statut = 'Approuvé';
    });
    App.UI.showToast('Congé approuvé', 'success');
    App.router.handleRoute();
};

window.rejectLeave = function(id) {
    App.store.update(data => {
        const leave = data.conges.find(l => l.id === id);
        if (leave) leave.statut = 'Rejeté';
    });
    App.UI.showToast('Congé rejeté', 'warning');
    App.router.handleRoute();
};

window.addTraining = function() {
    App.UI.showToast('Fonctionnalité en cours de développement', 'info');
};

window.editTraining = function(id) {
    App.UI.showToast(`Édition de la formation ${id}`, 'info');
};

window.deleteTraining = function(id) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
        App.store.update(data => {
            data.formations = data.formations.filter(f => f.id !== id);
        });
        App.UI.showToast('Formation supprimée', 'success');
        App.router.handleRoute();
    }
};

window.addEvaluation = function() {
    App.UI.showToast('Fonctionnalité en cours de développement', 'info');
};

window.processPayroll = function() {
    App.store.update(data => {
        data.paie.traitee = true;
    });
    App.UI.showToast('Paie traitée avec succès', 'success');
    App.router.handleRoute();
};

window.exportPayroll = function() {
    App.UI.showToast('Export de la paie en cours...', 'info');
};

window.exportAllData = function() {
    const data = App.store.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-hr-full-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    App.UI.showToast('Données exportées', 'success');
};

window.printReport = function() {
    window.print();
};
