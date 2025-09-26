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
  ]
};
