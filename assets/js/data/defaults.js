export const defaultData = {
  meta: {
    version: '2024.05.Prototype',
    generatedAt: new Date().toISOString()
  },
  settings: {
    locale: 'fr',
    rtl: false,
    theme: 'light',
    legalRetentionYears: 5,
    roles: ['Admin RH', 'Paie', 'Manager', 'Employé', 'Auditeur'],
    payrollParams: {
      cnss: {
        allocationsFamiliales_pct_employeur: 6.4,
        prestationsSociales_pct_salarie: 4.48,
        prestationsSociales_pct_employeur: 8.98,
        plafond_prestationsSociales_MAD: 6000,
        tfp_pct_employeur: 1.6,
        amo_pct_salarie: 2.26,
        amo_pct_employeur: 4.11
      },
      ir_bareme_2025: [
        { max: 40000, taux: 0, deduction: 0 },
        { max: 60000, taux: 10, deduction: 0 },
        { max: 80000, taux: 20, deduction: 0 },
        { max: 100000, taux: 30, deduction: 0 },
        { max: 180000, taux: 34, deduction: 0 },
        { max: null, taux: 37, deduction: 0 }
      ],
      prime_anciennete: [
        { min_annees: 2, taux: 5 },
        { min_annees: 5, taux: 10 },
        { min_annees: 12, taux: 15 },
        { min_annees: 20, taux: 20 },
        { min_annees: 25, taux: 25 }
      ],
      overtime: {
        jour_pct: 25,
        nuit_pct: 50,
        repos_pct: 50,
        jourHebdo_pct: 100
      }
    },
    connectors: {
      graph: {
        status: 'placeholder',
        note: 'Prévoir upload OneDrive via Microsoft Graph beta /drives/{drive-id}/root:/path:/content'
      }
    },
    holidays: {
      public: [
        { date: '2024-01-11', label: 'Manifeste de l’Indépendance' },
        { date: '2024-03-11', label: 'Aïd Al-Fitr (1)' },
        { date: '2024-03-12', label: 'Aïd Al-Fitr (2)' },
        { date: '2024-04-10', label: 'Aïd Al-Adha (1)' },
        { date: '2024-04-11', label: 'Aïd Al-Adha (2)' },
        { date: '2024-07-30', label: 'Fête du Trône' },
        { date: '2024-08-14', label: 'Allégeance Oued Eddahab' },
        { date: '2024-08-20', label: 'Révolution du Roi et du Peuple' },
        { date: '2024-08-21', label: 'Fête de la Jeunesse' },
        { date: '2024-11-06', label: 'Marche Verte' },
        { date: '2024-11-18', label: 'Fête de l’Indépendance' }
      ],
      private: [
        { date: '2024-01-01', label: 'Nouvel An' },
        { date: '2024-05-01', label: 'Fête du Travail' },
        { date: '2024-07-30', label: 'Fête du Trône' },
        { date: '2024-11-06', label: 'Marche Verte' },
        { date: '2024-11-18', label: 'Fête de l’Indépendance' }
      ]
    }
  },
  offers: [
    {
      id: 'OFF-001',
      titre: 'Responsable Paie',
      departement: 'Finance',
      statut: 'Ouverte',
      pipeline: {
        Sourcing: ['CAN-001', 'CAN-005'],
        Entretien: ['CAN-002'],
        Test: ['CAN-006'],
        Offre: [],
        Embauche: []
      }
    },
    {
      id: 'OFF-002',
      titre: 'Ingénieur Systèmes',
      departement: 'IT',
      statut: 'Ouverte',
      pipeline: {
        Sourcing: ['CAN-010'],
        Entretien: ['CAN-011', 'CAN-004'],
        Test: ['CAN-012'],
        Offre: ['CAN-003'],
        Embauche: []
      }
    }
  ],
  candidates: [
    {
      id: 'CAN-001',
      offre: 'OFF-001',
      prenom: 'Sara',
      nom: 'Bennani',
      email: 'sara.bennani@example.com',
      telephone: '+212612345678',
      cnie: 'AB123456',
      source: 'LinkedIn',
      notes: 'Expert paie Sage, bon niveau anglais',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-002',
      offre: 'OFF-001',
      prenom: 'Youssef',
      nom: 'El Amrani',
      email: 'youssef.amrani@example.com',
      telephone: '+212655889900',
      cnie: 'BE998877',
      source: 'Cooptation',
      notes: 'Disponible sous 1 mois',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-003',
      offre: 'OFF-002',
      prenom: 'Farah',
      nom: 'El Idrissi',
      email: 'farah.idrissi@example.com',
      telephone: '+212647889911',
      cnie: 'CD776655',
      source: 'Rekrute',
      notes: 'Ex-Oracle, forte expérience cloud',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-004',
      offre: 'OFF-002',
      prenom: 'Omar',
      nom: 'Naoui',
      email: 'omar.naoui@example.com',
      telephone: '+212622334455',
      cnie: 'EF556644',
      source: 'Salon emploi',
      notes: 'Certification AZ-104',
      consentement: false,
      documents: []
    },
    {
      id: 'CAN-005',
      offre: 'OFF-001',
      prenom: 'Leila',
      nom: 'Cherkaoui',
      email: 'leila.cherkaoui@example.com',
      telephone: '+212633221144',
      cnie: 'GH223344',
      source: 'Jobboard interne',
      notes: 'Disponible immédiatement',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-006',
      offre: 'OFF-001',
      prenom: 'Hicham',
      nom: 'Benjelloun',
      email: 'hicham.benjelloun@example.com',
      telephone: '+212655002233',
      cnie: 'JK998877',
      source: 'CVthèque',
      notes: 'Bonne connaissance DSN Maroc',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-010',
      offre: 'OFF-002',
      prenom: 'Imane',
      nom: 'Harrak',
      email: 'imane.harrak@example.com',
      telephone: '+212677889900',
      cnie: 'LM334455',
      source: 'LinkedIn',
      notes: 'Azure DevOps, Terraform',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-011',
      offre: 'OFF-002',
      prenom: 'Adil',
      nom: 'Skalli',
      email: 'adil.skalli@example.com',
      telephone: '+212688990011',
      cnie: 'NO223355',
      source: 'Cooptation',
      notes: 'Fort sur SecOps',
      consentement: true,
      documents: []
    },
    {
      id: 'CAN-012',
      offre: 'OFF-002',
      prenom: 'Meriem',
      nom: 'Alaoui',
      email: 'meriem.alaoui@example.com',
      telephone: '+212612210099',
      cnie: 'PQ445566',
      source: 'Recruteur externe',
      notes: 'Ex-SocGen Casablanca',
      consentement: true,
      documents: []
    }
  ],
  onboarding: [
    {
      id: 'ONB-001',
      candidatId: 'CAN-003',
      poste: 'Ingénieur Systèmes',
      checklist: {
        IT: [
          { label: 'Création compte Azure AD', due: '2024-05-10', done: false },
          { label: 'PC portable livré', due: '2024-05-12', done: false }
        ],
        RH: [
          { label: 'Contrat signé', due: '2024-05-09', done: false },
          { label: 'Badge d’accès', due: '2024-05-11', done: true }
        ],
        Manager: [
          { label: 'Plan de formation 30-60-90', due: '2024-05-25', done: false }
        ]
      }
    }
  ],
  employees: [
    {
      id: 'EMP-001',
      prenom: 'Amal',
      nom: 'El Fakir',
      genre: 'F',
      dateNaissance: '1989-03-12',
      dateEmbauche: '2015-04-01',
      poste: 'Directrice RH',
      department: 'Ressources Humaines',
      contrat: 'CDI',
      salaireBase: 28000,
      primes: 4000,
      cnss: '1234567',
      cnie: 'AB123456',
      cnieMasquee: '*** *** 3456',
      rib: 'MA640001234567890123456789',
      adresse: 'Casablanca, Maarif',
      ice: '00123456700013',
      if: '12345678',
      situationFamiliale: 'Mariée 2 enfants',
      cimr: true,
      ayantsDroit: ['Aya (8 ans)', 'Yassine (5 ans)']
    },
    {
      id: 'EMP-002',
      prenom: 'Hassan',
      nom: 'Bourkia',
      genre: 'M',
      dateNaissance: '1982-06-21',
      dateEmbauche: '2010-01-15',
      poste: 'Responsable Paie',
      department: 'Finance',
      contrat: 'CDI',
      salaireBase: 18000,
      primes: 2500,
      cnss: '2233445',
      cnie: 'BC234567',
      cnieMasquee: '*** *** 4567',
      rib: 'MA640009876543210987654321',
      adresse: 'Rabat, Agdal',
      ice: '00987654300021',
      if: '87654321',
      situationFamiliale: 'Marié 1 enfant',
      cimr: false,
      ayantsDroit: ['Adam (10 ans)']
    },
    {
      id: 'EMP-003',
      prenom: 'Salma',
      nom: 'Ammor',
      genre: 'F',
      dateNaissance: '1991-11-04',
      dateEmbauche: '2016-09-20',
      poste: 'Chargée Recrutement',
      department: 'Ressources Humaines',
      contrat: 'CDI',
      salaireBase: 11000,
      primes: 1500,
      cnss: '3344556',
      cnie: 'CD345678',
      cnieMasquee: '*** *** 5678',
      rib: 'MA642210987612345612345678',
      adresse: 'Casablanca, Ain Sebaa',
      ice: '00123490000007',
      if: '23456789',
      situationFamiliale: 'Célibataire',
      cimr: false,
      ayantsDroit: []
    },
    {
      id: 'EMP-004',
      prenom: 'Younes',
      nom: 'El Mehdi',
      genre: 'M',
      dateNaissance: '1987-08-13',
      dateEmbauche: '2014-02-01',
      poste: 'Responsable IT',
      department: 'IT',
      contrat: 'CDI',
      salaireBase: 22000,
      primes: 3000,
      cnss: '4455667',
      cnie: 'DE456789',
      cnieMasquee: '*** *** 6789',
      rib: 'MA640045612345678909876543',
      adresse: 'Casablanca, Sidi Maarouf',
      ice: '00654321000011',
      if: '65432109',
      situationFamiliale: 'Marié',
      cimr: true,
      ayantsDroit: ['Imane (3 ans)']
    },
    {
      id: 'EMP-005',
      prenom: 'Oumaima',
      nom: 'Chami',
      genre: 'F',
      dateNaissance: '1995-12-09',
      dateEmbauche: '2020-01-10',
      poste: 'Analyste BI',
      department: 'Data',
      contrat: 'CDI',
      salaireBase: 15000,
      primes: 1800,
      cnss: '5566778',
      cnie: 'EF567890',
      cnieMasquee: '*** *** 7890',
      rib: 'MA645500987600123456789001',
      adresse: 'Casablanca, Bourgogne',
      ice: '00543210000012',
      if: '54321098',
      situationFamiliale: 'Célibataire',
      cimr: false,
      ayantsDroit: []
    },
    {
      id: 'EMP-006',
      prenom: 'Nabil',
      nom: 'Kabbaj',
      genre: 'M',
      dateNaissance: '1979-04-03',
      dateEmbauche: '2005-05-02',
      poste: 'Directeur Industriel',
      department: 'Operations',
      contrat: 'CDI',
      salaireBase: 32000,
      primes: 6000,
      cnss: '6677889',
      cnie: 'FG678901',
      cnieMasquee: '*** *** 8901',
      rib: 'MA640033221100998877665544',
      adresse: 'Tanger, Malabata',
      ice: '00432100000045',
      if: '43210098',
      situationFamiliale: 'Marié 3 enfants',
      cimr: true,
      ayantsDroit: ['Rania (14 ans)', 'Malek (12 ans)', 'Selma (6 ans)']
    },
    {
      id: 'EMP-007',
      prenom: 'Aya',
      nom: 'Tahiri',
      genre: 'F',
      dateNaissance: '1993-09-19',
      dateEmbauche: '2018-07-16',
      poste: 'Juriste',
      department: 'Juridique',
      contrat: 'CDI',
      salaireBase: 13000,
      primes: 1200,
      cnss: '7788990',
      cnie: 'GH789012',
      cnieMasquee: '*** *** 9012',
      rib: 'MA640012340000998877665500',
      adresse: 'Rabat, Hay Riad',
      ice: '00345670000088',
      if: '34567098',
      situationFamiliale: 'Mariée',
      cimr: false,
      ayantsDroit: []
    },
    {
      id: 'EMP-008',
      prenom: 'Karim',
      nom: 'Mouline',
      genre: 'M',
      dateNaissance: '1997-02-15',
      dateEmbauche: '2022-03-01',
      poste: 'Technicien Support',
      department: 'IT',
      contrat: 'CDI',
      salaireBase: 9000,
      primes: 600,
      cnss: '8899001',
      cnie: 'HI890123',
      cnieMasquee: '*** *** 0123',
      rib: 'MA640078900011223344556677',
      adresse: 'Casablanca, Derb Omar',
      ice: '00234560000077',
      if: '23456097',
      situationFamiliale: 'Célibataire',
      cimr: false,
      ayantsDroit: []
    },
    {
      id: 'EMP-009',
      prenom: 'Soukaina',
      nom: 'El Hadaoui',
      genre: 'F',
      dateNaissance: '1985-07-28',
      dateEmbauche: '2012-10-05',
      poste: 'Chef Comptable',
      department: 'Finance',
      contrat: 'CDI',
      salaireBase: 20000,
      primes: 2500,
      cnss: '9900112',
      cnie: 'IJ901234',
      cnieMasquee: '*** *** 1234',
      rib: 'MA642212345600987612340987',
      adresse: 'Casablanca, Californie',
      ice: '00123450000033',
      if: '12345098',
      situationFamiliale: 'Mariée 1 enfant',
      cimr: true,
      ayantsDroit: ['Hiba (9 ans)']
    },
    {
      id: 'EMP-010',
      prenom: 'Walid',
      nom: 'Jad',
      genre: 'M',
      dateNaissance: '1990-01-31',
      dateEmbauche: '2017-05-10',
      poste: 'Responsable Logistique',
      department: 'Logistique',
      contrat: 'CDI',
      salaireBase: 14000,
      primes: 1600,
      cnss: '1001123',
      cnie: 'JK012345',
      cnieMasquee: '*** *** 2345',
      rib: 'MA640011112223334445556667',
      adresse: 'Settat',
      ice: '00112233000044',
      if: '11223344',
      situationFamiliale: 'Marié',
      cimr: false,
      ayantsDroit: []
    }
  ],
  payrollVariables: {
    currentPeriod: '2024-05',
    variables: {
      'EMP-001': { heuresSup: { jour: 4, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 4000, absences: 0 },
      'EMP-002': { heuresSup: { jour: 6, nuit: 2, repos: 0, jourHebdo: 0 }, primes: 2500, absences: 1 },
      'EMP-003': { heuresSup: { jour: 0, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 1500, absences: 0 },
      'EMP-004': { heuresSup: { jour: 5, nuit: 3, repos: 2, jourHebdo: 1 }, primes: 3500, absences: 0 },
      'EMP-005': { heuresSup: { jour: 2, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 1800, absences: 0 },
      'EMP-006': { heuresSup: { jour: 0, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 6000, absences: 0 },
      'EMP-007': { heuresSup: { jour: 1, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 1200, absences: 0 },
      'EMP-008': { heuresSup: { jour: 3, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 600, absences: 0 },
      'EMP-009': { heuresSup: { jour: 2, nuit: 1, repos: 0, jourHebdo: 0 }, primes: 2500, absences: 0 },
      'EMP-010': { heuresSup: { jour: 1, nuit: 0, repos: 0, jourHebdo: 0 }, primes: 1600, absences: 0 }
    }
  },
  attendance: [
    { id: 'ATT-001', employeeId: 'EMP-008', date: '2024-05-02', status: 'Absent', motif: 'Maladie' },
    { id: 'ATT-002', employeeId: 'EMP-005', date: '2024-05-03', status: 'Présent', motif: '' },
    { id: 'ATT-003', employeeId: 'EMP-002', date: '2024-05-03', status: 'Présent', motif: '' },
    { id: 'ATT-004', employeeId: 'EMP-006', date: '2024-05-03', status: 'Présent', motif: '' }
  ],
  leaves: [
    { id: 'LV-001', employeeId: 'EMP-003', type: 'Congé annuel', debut: '2024-06-01', fin: '2024-06-05', statut: 'En attente', approbateur: 'EMP-001' },
    { id: 'LV-002', employeeId: 'EMP-007', type: 'Congé maternité', debut: '2024-07-10', fin: '2024-11-10', statut: 'Approuvé', approbateur: 'EMP-001' },
    { id: 'LV-003', employeeId: 'EMP-009', type: 'Congé exceptionnel', debut: '2024-05-15', fin: '2024-05-16', statut: 'En attente', approbateur: 'EMP-002' }
  ],
  timeRules: {
    hoursPerDay: 8,
    overtimeAppliesFrom: 41
  },
  formations: [
    {
      id: 'FOR-001',
      intitule: 'Leadership 360',
      budget: 60000,
      cote: 'RH',
      sessions: [
        { date: '2026-05-20', lieu: 'Casablanca', participants: 12, presence: 10, evaluation: 4.5 },
        { date: '2026-06-15', lieu: 'Rabat', participants: 10, presence: 9, evaluation: 4.2 }
      ]
    },
    {
      id: 'FOR-002',
      intitule: 'Certification Azure AZ-305',
      budget: 45000,
      cote: 'IT',
      sessions: [
        { date: '2026-05-27', lieu: 'En ligne', participants: 8, presence: 8, evaluation: 4.7 }
      ]
    },
    {
      id: 'FOR-003',
      intitule: 'Paie avancée Maroc',
      budget: 32000,
      cote: 'Finance',
      sessions: [
        { date: '2026-04-30', lieu: 'Casablanca', participants: 6, presence: 6, evaluation: 4.9 }
      ]
    },
    {
      id: 'FOR-004',
      intitule: 'Sensibilisation Loi 09-08',
      budget: 15000,
      cote: 'Compliance',
      sessions: [
        { date: '2026-03-19', lieu: 'Teams', participants: 30, presence: 26, evaluation: 4.0 }
      ]
    }
  ],
  documents: [
    {
      id: 'DOC-TPL-001',
      nom: 'Contrat CDI Standard',
      type: 'contrat',
      variables: ['societe', 'nom', 'prenom', 'cnss', 'cnie_masque', 'poste', 'salaire_mensuel']
    },
    {
      id: 'DOC-TPL-002',
      nom: 'Lettre offre',
      type: 'offre',
      variables: ['societe', 'nom', 'prenom', 'poste', 'salaire_mensuel', 'date_debut']
    }
  ],
  // MODULE 5 - Performance Management
  objectives: [
    {
      id: 'OBJ-001',
      employeeId: 'EMP-001',
      titre: 'Digitaliser 100% des processus RH',
      description: 'Implémenter et déployer Atlas HR Suite dans tous les départements',
      dateDebut: '2024-01-01',
      dateEcheance: '2024-12-31',
      statut: 'En cours',
      progression: 65,
      poids: 40,
      categorie: 'Stratégique',
      kpis: ['Taux d\'adoption >90%', 'Satisfaction utilisateurs >4/5']
    },
    {
      id: 'OBJ-002',
      employeeId: 'EMP-002',
      titre: 'Optimiser le cycle de paie',
      description: 'Réduire le temps de traitement de la paie de 40%',
      dateDebut: '2024-01-01',
      dateEcheance: '2024-06-30',
      statut: 'En cours',
      progression: 80,
      poids: 35,
      categorie: 'Opérationnel',
      kpis: ['Temps traitement <3 jours', '0 erreur CNSS']
    },
    {
      id: 'OBJ-003',
      employeeId: 'EMP-004',
      titre: 'Migration Cloud Azure',
      description: 'Migrer l\'infrastructure IT vers Azure avec HA',
      dateDebut: '2024-02-01',
      dateEcheance: '2024-08-31',
      statut: 'En cours',
      progression: 45,
      poids: 50,
      categorie: 'Projet',
      kpis: ['Uptime >99.9%', 'Coûts réduits 25%']
    }
  ],
  evaluations: [
    {
      id: 'EVAL-001',
      employeeId: 'EMP-003',
      type: '360',
      periode: '2024',
      statut: 'Complétée',
      dateDebut: '2024-03-01',
      dateFin: '2024-03-15',
      evaluateurs: [
        { id: 'EMP-001', role: 'Manager', note: 4.2, commentaire: 'Excellente performance en recrutement' },
        { id: 'EMP-002', role: 'Pair', note: 4.0, commentaire: 'Bonne collaboration' },
        { id: 'EMP-005', role: 'Pair', note: 4.5, commentaire: 'Très proactive' }
      ],
      noteGlobale: 4.23,
      competences: {
        'Communication': 4.5,
        'Leadership': 3.8,
        'Technique': 4.0,
        'Organisation': 4.5
      },
      pointsForts: ['Sourcing candidats', 'Relation candidat', 'Rapidité traitement'],
      axesAmelioration: ['Négociation salariale', 'Maîtrise outils analytics']
    },
    {
      id: 'EVAL-002',
      employeeId: 'EMP-008',
      type: 'Annuelle',
      periode: '2024',
      statut: 'En cours',
      dateDebut: '2024-04-01',
      dateFin: '2024-04-20',
      evaluateurs: [
        { id: 'EMP-004', role: 'Manager', note: 3.5, commentaire: 'Performance satisfaisante, besoin formation' }
      ],
      noteGlobale: 3.5,
      competences: {
        'Technique': 3.8,
        'Service client': 4.0,
        'Autonomie': 3.0,
        'Réactivité': 4.2
      },
      pointsForts: ['Rapidité résolution incidents', 'Relation utilisateurs'],
      axesAmelioration: ['Certifications IT', 'Autonomie technique']
    }
  ],
  talentPools: [
    {
      id: 'POOL-001',
      nom: 'High Potentials',
      description: 'Collaborateurs à haut potentiel identifiés pour succession management',
      membres: ['EMP-003', 'EMP-005', 'EMP-007'],
      criteres: ['Performance >4/5', 'Potentiel évolution', 'Mobilité géographique']
    },
    {
      id: 'POOL-002',
      nom: 'Experts Techniques',
      description: 'Pool d\'experts techniques clés',
      membres: ['EMP-004', 'EMP-005'],
      criteres: ['Certifications', 'Expertise reconnue', '5+ ans expérience']
    }
  ],
  successionPlans: [
    {
      id: 'SUCC-001',
      posteClef: 'Directeur RH',
      titulaire: 'EMP-001',
      successeurs: [
        { employeeId: 'EMP-003', readiness: 'Prêt dans 1-2 ans', score: 75 },
        { employeeId: 'EMP-007', readiness: 'Prêt dans 2-3 ans', score: 65 }
      ],
      risque: 'Moyen',
      actionsPreparation: [
        'Formation stratégie RH',
        'Participation CODIR',
        'Gestion projet envergure'
      ]
    },
    {
      id: 'SUCC-002',
      posteClef: 'Responsable IT',
      titulaire: 'EMP-004',
      successeurs: [
        { employeeId: 'EMP-008', readiness: 'Prêt dans 3+ ans', score: 45 }
      ],
      risque: 'Élevé',
      actionsPreparation: [
        'Certifications Azure',
        'Lead projets critiques',
        'Formation management'
      ]
    }
  ],
  entretiensAnnuels: [
    {
      id: 'ENT-001',
      employeeId: 'EMP-003',
      managerId: 'EMP-001',
      date: '2024-03-20',
      statut: 'Réalisé',
      duree: 90,
      objectifsAnneeEcoulee: ['Recruter 15 profils', 'Optimiser process'],
      bilanObjectifs: 'Objectifs atteints à 90%',
      objectifsAnneeProchaine: ['Digitalisation recrutement', 'Employer branding'],
      souhaitsEvolution: 'Responsable Recrutement',
      formationsSouhaitees: ['Certif GPEC', 'Recrutement digital'],
      commentaireManager: 'Excellente année, promotion envisagée',
      commentaireEmploye: 'Année enrichissante, souhaite plus de responsabilités'
    }
  ],
  // MODULE 6 - Paie Avancée
  declarationsCNSS: [
    {
      id: 'CNSS-2024-05',
      periode: '2024-05',
      dateGeneration: '2024-06-05',
      statut: 'Générée',
      format: 'Damancom',
      nbEmployes: 10,
      masseSalarialeDeclaree: 180000,
      cotisationsPatronales: 15606,
      cotisationsSalariales: 8064,
      fichier: 'CNSS_202405_ATLAS.txt'
    },
    {
      id: 'CNSS-2024-04',
      periode: '2024-04',
      dateGeneration: '2024-05-06',
      statut: 'Télétransmise',
      dateTeletransmission: '2024-05-07',
      format: 'Damancom',
      nbEmployes: 10,
      masseSalarialeDeclaree: 178500,
      cotisationsPatronales: 15476,
      cotisationsSalariales: 8009,
      numeroRecepisse: 'REC-2024-04-123456'
    }
  ],
  declarationsIR: [
    {
      id: 'IR-2024-05',
      periode: '2024-05',
      dateGeneration: '2024-06-10',
      statut: 'Générée',
      format: 'SIMPL-IR XML',
      nbEmployes: 10,
      montantIRTotal: 18450,
      fichier: 'SIMPL_IR_202405_ATLAS.xml'
    },
    {
      id: 'IR-2024-04',
      periode: '2024-04',
      dateGeneration: '2024-05-10',
      statut: 'Télédéclarée',
      dateTeletransmission: '2024-05-11',
      format: 'SIMPL-IR XML',
      nbEmployes: 10,
      montantIRTotal: 18200,
      numeroDeclaration: 'DGI-2024-04-987654'
    }
  ],
  mutuelles: [
    {
      id: 'MUT-001',
      nom: 'Saham Assurance',
      type: 'Mutuelle santé',
      numeroAdhesion: 'SAH-123456',
      tauxCotisationPatron: 3.5,
      tauxCotisationSalarie: 2.0,
      plafondRemboursement: 50000,
      garanties: ['Hospitalisation', 'Soins courants', 'Dentaire', 'Optique'],
      employesConcernes: ['EMP-001', 'EMP-002', 'EMP-004', 'EMP-006', 'EMP-009']
    },
    {
      id: 'MUT-002',
      nom: 'Wafa Assurance',
      type: 'Assurance groupe',
      numeroAdhesion: 'WAF-789012',
      tauxCotisationPatron: 2.5,
      tauxCotisationSalarie: 1.5,
      capitalDeces: 200000,
      garanties: ['Décès', 'Invalidité permanente'],
      employesConcernes: 'all'
    }
  ],
  cimrAdhesions: [
    {
      id: 'CIMR-001',
      employeeId: 'EMP-001',
      dateAdhesion: '2015-04-01',
      tauxCotisationPatron: 3.0,
      tauxCotisationSalarie: 3.0,
      plafondCotisation: 3000,
      numeroAdherent: 'CIMR-2015-001234'
    },
    {
      id: 'CIMR-002',
      employeeId: 'EMP-004',
      dateAdhesion: '2014-02-01',
      tauxCotisationPatron: 3.0,
      tauxCotisationSalarie: 3.0,
      plafondCotisation: 3000,
      numeroAdherent: 'CIMR-2014-005678'
    },
    {
      id: 'CIMR-003',
      employeeId: 'EMP-006',
      dateAdhesion: '2005-05-02',
      tauxCotisationPatron: 3.0,
      tauxCotisationSalarie: 3.0,
      plafondCotisation: 3000,
      numeroAdherent: 'CIMR-2005-009012'
    },
    {
      id: 'CIMR-004',
      employeeId: 'EMP-009',
      dateAdhesion: '2012-10-05',
      tauxCotisationPatron: 3.0,
      tauxCotisationSalarie: 3.0,
      plafondCotisation: 3000,
      numeroAdherent: 'CIMR-2012-003456'
    }
  ],
  // MODULE 7 - Multisite
  etablissements: [
    {
      id: 'ETB-001',
      nom: 'Siège Social Casablanca',
      type: 'Siège',
      adresse: 'Twin Center, Tour A, Casablanca',
      ville: 'Casablanca',
      pays: 'Maroc',
      ice: '001234567000001',
      rc: 'CAS-123456',
      cnss: '1234567',
      patente: 'PAT-12345678',
      nbEmployes: 45,
      actif: true,
      dateOuverture: '2010-01-15'
    },
    {
      id: 'ETB-002',
      nom: 'Agence Rabat',
      type: 'Agence',
      adresse: 'Hay Riad, Rabat',
      ville: 'Rabat',
      pays: 'Maroc',
      ice: '001234567000002',
      rc: 'RAB-789012',
      cnss: '7890123',
      patente: 'PAT-87654321',
      nbEmployes: 12,
      actif: true,
      dateOuverture: '2015-06-01'
    },
    {
      id: 'ETB-003',
      nom: 'Usine Tanger',
      type: 'Site industriel',
      adresse: 'Zone Franche Tanger',
      ville: 'Tanger',
      pays: 'Maroc',
      ice: '001234567000003',
      rc: 'TAN-345678',
      cnss: '3456789',
      patente: 'PAT-34567890',
      nbEmployes: 85,
      actif: true,
      dateOuverture: '2018-03-20'
    }
  ],
  centresCouts: [
    {
      id: 'CC-001',
      code: 'RH-001',
      libelle: 'Ressources Humaines',
      etablissement: 'ETB-001',
      responsable: 'EMP-001',
      budget: 500000,
      type: 'Support'
    },
    {
      id: 'CC-002',
      code: 'FIN-001',
      libelle: 'Finance & Comptabilité',
      etablissement: 'ETB-001',
      responsable: 'EMP-009',
      budget: 400000,
      type: 'Support'
    },
    {
      id: 'CC-003',
      code: 'IT-001',
      libelle: 'Systèmes d\'Information',
      etablissement: 'ETB-001',
      responsable: 'EMP-004',
      budget: 800000,
      type: 'Support'
    },
    {
      id: 'CC-004',
      code: 'OPS-001',
      libelle: 'Production Tanger',
      etablissement: 'ETB-003',
      responsable: 'EMP-006',
      budget: 2500000,
      type: 'Opérationnel'
    }
  ],
  departements: [
    {
      id: 'DEPT-001',
      nom: 'Ressources Humaines',
      code: 'RH',
      responsable: 'EMP-001',
      etablissement: 'ETB-001',
      centreCout: 'CC-001',
      effectif: 3
    },
    {
      id: 'DEPT-002',
      nom: 'Finance',
      code: 'FIN',
      responsable: 'EMP-009',
      etablissement: 'ETB-001',
      centreCout: 'CC-002',
      effectif: 2
    },
    {
      id: 'DEPT-003',
      nom: 'IT',
      code: 'IT',
      responsable: 'EMP-004',
      etablissement: 'ETB-001',
      centreCout: 'CC-003',
      effectif: 2
    },
    {
      id: 'DEPT-004',
      nom: 'Operations',
      code: 'OPS',
      responsable: 'EMP-006',
      etablissement: 'ETB-003',
      centreCout: 'CC-004',
      effectif: 85
    }
  ],
  // MODULE 8 - Intégrations
  apiKeys: [
    {
      id: 'API-001',
      nom: 'Integration Sage Comptabilité',
      service: 'Sage',
      type: 'REST API',
      statut: 'Active',
      dateCreation: '2024-01-15',
      derniereUtilisation: '2024-05-20',
      permissions: ['read:accounting', 'write:journal']
    },
    {
      id: 'API-002',
      nom: 'Export Power BI',
      service: 'Microsoft Power BI',
      type: 'OData',
      statut: 'Active',
      dateCreation: '2024-02-01',
      derniereUtilisation: '2024-05-21',
      permissions: ['read:analytics']
    }
  ],
  webhooks: [
    {
      id: 'HOOK-001',
      nom: 'Notification nouvel employé',
      url: 'https://api.atlas.local/webhooks/new-employee',
      evenements: ['employee.created', 'employee.updated'],
      statut: 'Actif',
      secret: 'whsec_***************'
    },
    {
      id: 'HOOK-002',
      nom: 'Sync paie vers comptabilité',
      url: 'https://api.sage.local/webhooks/payroll',
      evenements: ['payroll.completed'],
      statut: 'Actif',
      secret: 'whsec_***************'
    }
  ],
  connecteursComptables: [
    {
      id: 'CONN-001',
      nom: 'Sage 100 Cloud',
      type: 'Comptabilité',
      statut: 'Connecté',
      dernierSync: '2024-05-20T10:30:00',
      parametres: {
        journalPaie: 'JOU-SAL',
        compteCharges: '6411',
        compteCotisations: '4370',
        apiUrl: 'https://api.sage.com/v1'
      }
    }
  ],
  // MODULE 9 - Portail Employé
  demandesEmploye: [
    {
      id: 'DEM-001',
      employeeId: 'EMP-008',
      type: 'Attestation de travail',
      dateDemande: '2024-05-15',
      statut: 'Approuvée',
      dateTraitement: '2024-05-16',
      traitePar: 'EMP-001',
      motif: 'Demande banque pour crédit'
    },
    {
      id: 'DEM-002',
      employeeId: 'EMP-005',
      type: 'Avance sur salaire',
      montant: 3000,
      dateDemande: '2024-05-18',
      statut: 'En attente',
      motif: 'Dépense imprévue'
    },
    {
      id: 'DEM-003',
      employeeId: 'EMP-007',
      type: 'Modification RIB',
      nouveauRIB: 'MA640099887766554433221100',
      dateDemande: '2024-05-10',
      statut: 'Approuvée',
      dateTraitement: '2024-05-11',
      traitePar: 'EMP-002'
    }
  ],
  documentsEmploye: [
    {
      id: 'DOCEMP-001',
      employeeId: 'EMP-001',
      type: 'Bulletin paie',
      periode: '2024-05',
      nom: 'Bulletin_Mai_2024_ELFAKIR.pdf',
      dateGeneration: '2024-06-05',
      taille: '245KB'
    },
    {
      id: 'DOCEMP-002',
      employeeId: 'EMP-001',
      type: 'Attestation travail',
      nom: 'Attestation_Travail_ELFAKIR_20240516.pdf',
      dateGeneration: '2024-05-16',
      taille: '180KB'
    }
  ],
  // MODULE 10 - Portail Manager
  validationsManager: [
    {
      id: 'VAL-001',
      managerId: 'EMP-001',
      type: 'Congé',
      referenceId: 'LV-001',
      employeeConcerne: 'EMP-003',
      dateDemande: '2024-05-10',
      statut: 'En attente',
      priorite: 'Normal'
    },
    {
      id: 'VAL-002',
      managerId: 'EMP-004',
      type: 'Heures supplémentaires',
      referenceId: 'HS-001',
      employeeConcerne: 'EMP-008',
      dateDemande: '2024-05-12',
      heures: 8,
      statut: 'Approuvé',
      dateValidation: '2024-05-13'
    }
  ],
  budgetsEquipe: [
    {
      id: 'BUD-001',
      managerId: 'EMP-001',
      departement: 'Ressources Humaines',
      annee: 2024,
      budgetTotal: 500000,
      masseSalariale: 420000,
      formationsRecrutement: 60000,
      autresCharges: 20000,
      consomme: 275000,
      pourcentageConsommation: 55
    },
    {
      id: 'BUD-002',
      managerId: 'EMP-004',
      departement: 'IT',
      annee: 2024,
      budgetTotal: 800000,
      masseSalariale: 520000,
      infraCloud: 200000,
      formationsLicences: 80000,
      consomme: 480000,
      pourcentageConsommation: 60
    }
  ],
  kpisEquipe: [
    {
      managerId: 'EMP-001',
      mois: '2024-05',
      effectifEquipe: 3,
      tauxAbsenteisme: 2.1,
      heuresSupMoyennes: 1.5,
      tauxTurnover: 0,
      satisfactionEquipe: 4.3,
      objectifsAtteints: 78
    },
    {
      managerId: 'EMP-004',
      mois: '2024-05',
      effectifEquipe: 2,
      tauxAbsenteisme: 0.5,
      heuresSupMoyennes: 6.2,
      tauxTurnover: 0,
      satisfactionEquipe: 4.1,
      objectifsAtteints: 82
    }
  ],
  // MODULE 13 - Mobilité Interne
  postesInternes: [
    {
      id: 'MOBIL-001',
      titre: 'Responsable Recrutement',
      departement: 'Ressources Humaines',
      etablissement: 'ETB-001',
      type: 'Promotion',
      description: 'Piloter la stratégie recrutement et manager l\'équipe',
      competencesRequises: ['Management', 'Recrutement', 'GPEC'],
      experienceRequise: '3-5 ans',
      salaireMin: 15000,
      salaireMax: 18000,
      statut: 'Ouvert',
      datePublication: '2024-05-01',
      candidaturesInternes: ['EMP-003']
    },
    {
      id: 'MOBIL-002',
      titre: 'Lead DevOps',
      departement: 'IT',
      etablissement: 'ETB-001',
      type: 'Évolution',
      description: 'Lead transformation DevOps et Cloud',
      competencesRequises: ['Azure', 'DevOps', 'Leadership'],
      experienceRequise: '5+ ans',
      salaireMin: 25000,
      salaireMax: 30000,
      statut: 'Ouvert',
      datePublication: '2024-04-15',
      candidaturesInternes: []
    }
  ],
  candidaturesInternes: [
    {
      id: 'CINT-001',
      employeeId: 'EMP-003',
      posteId: 'MOBIL-001',
      dateCandidature: '2024-05-05',
      statut: 'En évaluation',
      lettreMotivation: 'Je souhaite évoluer vers un poste de management...',
      supportManager: true,
      commentaireManager: 'Candidate très qualifiée, recommande vivement'
    }
  ],
  // MODULE 14 - Communication
  annonces: [
    {
      id: 'ANN-001',
      titre: 'Déploiement Atlas HR Suite',
      contenu: 'Nous sommes ravis d\'annoncer le déploiement de notre nouvelle plateforme RH Atlas HR Suite...',
      type: 'Important',
      auteur: 'EMP-001',
      datePublication: '2024-05-01',
      dateFin: '2024-06-01',
      cible: 'all',
      priorite: 'Haute',
      lu: ['EMP-002', 'EMP-004', 'EMP-005']
    },
    {
      id: 'ANN-002',
      titre: 'Congés été 2024',
      contenu: 'Pensez à planifier vos congés d\'été avant le 31 mai...',
      type: 'Information',
      auteur: 'EMP-001',
      datePublication: '2024-04-20',
      dateFin: '2024-05-31',
      cible: 'all',
      priorite: 'Moyenne'
    }
  ],
  notifications: [
    {
      id: 'NOTIF-001',
      userId: 'EMP-003',
      titre: 'Demande de congé approuvée',
      message: 'Votre demande de congé du 01/06 au 05/06 a été approuvée',
      type: 'success',
      date: '2024-05-12T14:30:00',
      lue: false,
      lien: '#/conges'
    },
    {
      id: 'NOTIF-002',
      userId: 'EMP-004',
      titre: 'Validation en attente',
      message: 'Heures supplémentaires de Karim Mouline en attente de validation',
      type: 'info',
      date: '2024-05-12T09:15:00',
      lue: true,
      lien: '#/manager/validations'
    }
  ],
  sondages: [
    {
      id: 'SOND-001',
      titre: 'Satisfaction Déploiement Atlas HR',
      description: 'Votre avis sur la nouvelle plateforme RH',
      questions: [
        {
          id: 'Q1',
          texte: 'Êtes-vous satisfait de la nouvelle plateforme?',
          type: 'rating',
          echelle: 5
        },
        {
          id: 'Q2',
          texte: 'Quelles fonctionnalités utilisez-vous le plus?',
          type: 'multiple',
          options: ['Congés', 'Bulletins paie', 'Documents', 'Formations']
        },
        {
          id: 'Q3',
          texte: 'Suggestions d\'amélioration',
          type: 'text'
        }
      ],
      dateDebut: '2024-05-15',
      dateFin: '2024-05-31',
      statut: 'En cours',
      cible: 'all',
      reponses: 12,
      tauxParticipation: 27
    }
  ],
  // MODULE 15 - RGPD & Conformité
  consentements: [
    {
      id: 'CONS-001',
      employeeId: 'EMP-001',
      type: 'Traitement données RH',
      dateConsentement: '2024-01-15',
      statut: 'Accordé',
      version: '1.0',
      documentsLies: ['Politique confidentialité', 'Charte RGPD']
    },
    {
      id: 'CONS-002',
      employeeId: 'EMP-008',
      type: 'Photos usage interne',
      dateConsentement: '2024-03-10',
      statut: 'Accordé',
      version: '1.0'
    }
  ],
  demandesPortabilite: [
    {
      id: 'PORT-001',
      employeeId: 'EMP-010',
      dateDemande: '2024-05-18',
      statut: 'En cours',
      typeExport: 'Complet',
      formatSouhaite: 'JSON'
    }
  ],
  auditsRGPD: [
    {
      id: 'AUDIT-001',
      type: 'Audit annuel RGPD',
      dateDebut: '2024-03-01',
      dateFin: '2024-03-15',
      auditeur: 'Cabinet Juridique Alaoui',
      statut: 'Complété',
      score: 92,
      nonConformites: 2,
      recommandations: [
        'Renforcer chiffrement documents sensibles',
        'Mettre à jour registre traitements'
      ]
    }
  ],
  registreTraitements: [
    {
      id: 'TRAIT-001',
      nom: 'Gestion administrative personnel',
      finalite: 'Administration RH et paie',
      categoriesDonnees: ['Identité', 'Coordonnées', 'Situation familiale', 'Bancaire', 'Santé'],
      personnesConcernees: 'Salariés',
      destinataires: ['RH', 'Paie', 'CNSS', 'DGI'],
      dureeConservation: '5 ans après départ',
      mesuresSecurite: ['Chiffrement', 'Contrôle accès', 'Logs'],
      baseJuridique: 'Obligations légales'
    }
  ],
  // MODULE 16 - Workflows Avancés
  workflows: [
    {
      id: 'WF-001',
      nom: 'Validation congés',
      type: 'Approbation',
      etapes: [
        { ordre: 1, role: 'Manager direct', action: 'Approuver/Refuser', delai: 48 },
        { ordre: 2, role: 'RH', action: 'Validation finale', delai: 24, condition: 'Si >10 jours' }
      ],
      actif: true
    },
    {
      id: 'WF-002',
      nom: 'Recrutement complet',
      type: 'Process',
      etapes: [
        { ordre: 1, role: 'Recruteur', action: 'Sourcing', delai: 168 },
        { ordre: 2, role: 'Manager', action: 'Présélection', delai: 72 },
        { ordre: 3, role: 'Manager', action: 'Entretien', delai: 168 },
        { ordre: 4, role: 'RH', action: 'Tests/références', delai: 120 },
        { ordre: 5, role: 'Direction', action: 'Validation offre', delai: 48 },
        { ordre: 6, role: 'RH', action: 'Onboarding', delai: 240 }
      ],
      actif: true
    },
    {
      id: 'WF-003',
      nom: 'Note de frais',
      type: 'Approbation',
      etapes: [
        { ordre: 1, role: 'Manager', action: 'Validation', delai: 48 },
        { ordre: 2, role: 'Finance', action: 'Contrôle', delai: 72, condition: 'Si >5000 MAD' },
        { ordre: 3, role: 'Direction', action: 'Approbation', delai: 24, condition: 'Si >10000 MAD' }
      ],
      actif: true
    }
  ],
  instancesWorkflow: [
    {
      id: 'WFI-001',
      workflowId: 'WF-001',
      referenceId: 'LV-001',
      dateDebut: '2024-05-10',
      statut: 'En cours',
      etapeCourante: 1,
      historique: [
        { etape: 1, acteur: 'EMP-001', action: 'En attente', date: '2024-05-10T10:00:00' }
      ]
    }
  ],
  escalades: [
    {
      id: 'ESC-001',
      workflowInstanceId: 'WFI-001',
      raison: 'Délai dépassé',
      dateEscalade: '2024-05-13',
      niveauEscalade: 1,
      escaladeVers: 'EMP-001',
      statut: 'Ouverte'
    }
  ]
};
