const privateKpiData = {
  week: [
    {
      title: 'Onboardings finalisés',
      value: 38,
      unit: '',
      trend: 'up',
      trendLabel: '+6 vs semaine dernière',
      description: 'Welcome Pack digital complété'
    },
    {
      title: 'Taux de complétion objectifs',
      value: 64,
      unit: '%',
      trend: 'up',
      trendLabel: '+4 pts',
      description: 'Campagne OKR Q2'
    },
    {
      title: 'Engagement pulse',
      value: 4.3,
      unit: '/5',
      trend: 'stable',
      trendLabel: 'Tous sites',
      description: 'Sondage hebdomadaire'
    },
    {
      title: 'Alertes paie critiques',
      value: 2,
      unit: '',
      trend: 'down',
      trendLabel: '-3 incidents',
      description: 'Corrections CNSS effectuées'
    }
  ],
  month: [
    {
      title: 'Recrutements signés',
      value: 126,
      unit: '',
      trend: 'up',
      trendLabel: '+18 vs mois-1',
      description: 'Profils industriels & retail'
    },
    {
      title: 'Turnover',
      value: 1.9,
      unit: '%',
      trend: 'down',
      trendLabel: '-0,4 pt',
      description: 'Stabilisation des équipes'
    },
    {
      title: 'Taux de paie validé',
      value: 99.4,
      unit: '%',
      trend: 'up',
      trendLabel: '+0,6 pt',
      description: 'Contrôles DAMANCOM'
    },
    {
      title: 'Heures formation',
      value: 1840,
      unit: '',
      trend: 'up',
      trendLabel: '+320 h',
      description: 'Académie Atlas'
    }
  ],
  quarter: [
    {
      title: 'Mobilités internes',
      value: 42,
      unit: '',
      trend: 'up',
      trendLabel: '+28%',
      description: 'Programme mobilité Groupe'
    },
    {
      title: 'Index égalité',
      value: 94,
      unit: '/100',
      trend: 'stable',
      trendLabel: '+1 pt',
      description: 'Déclaration 2024'
    },
    {
      title: 'Budget formation engagé',
      value: 72,
      unit: '%',
      trend: 'up',
      trendLabel: '+5 pts',
      description: 'Plan Campus Atlas'
    },
    {
      title: 'Satisfaction managers',
      value: 4.5,
      unit: '/5',
      trend: 'up',
      trendLabel: '+0,2',
      description: 'Enquêtes Teams'
    }
  ]
};

const pipelineData = [
  {
    stage: 'Sourcing',
    items: [
      { name: 'Aya B.', role: 'Responsable supply chain', eta: '8j' },
      { name: 'Malik O.', role: 'Ingénieur maintenance', eta: '5j' }
    ]
  },
  {
    stage: 'Entretiens',
    items: [
      { name: 'Salma T.', role: 'Manager retail', eta: '3j' },
      { name: 'Yassine H.', role: 'Data analyst', eta: '2j' }
    ]
  },
  {
    stage: 'Offres',
    items: [
      { name: 'Hajar F.', role: 'HR Business Partner', eta: 'Signature' },
      { name: 'Nadir R.', role: 'Chef de projet IT', eta: 'En cours' }
    ]
  },
  {
    stage: 'Onboarding',
    items: [
      { name: 'Imane Z.', role: 'Superviseur site Meknès', eta: 'Jour 2' }
    ]
  }
];

const engagementData = [
  { site: 'Usine Casablanca', score: 82, trend: '+4 pts' },
  { site: 'Plateforme Tanger', score: 74, trend: '+2 pts' },
  { site: 'Hub e-commerce', score: 91, trend: '+6 pts' },
  { site: 'Réseau retail Sud', score: 68, trend: '-1 pt' }
];

const programData = [
  {
    title: 'Programme leadership féminin',
    value: '68%',
    detail: 'parcours mentors 2024',
    trend: '+12 participantes'
  },
  {
    title: 'Academy digital',
    value: '420 h',
    detail: 'formations LMS',
    trend: '+65 h vs N-1'
  },
  {
    title: 'Projet mobilité Groupe',
    value: '32 profils',
    detail: 'matching IA multi-filiales',
    trend: '+8 mobilités validées'
  }
];

const payrollData = [
  {
    site: 'Maroc / Casablanca HQ',
    status: 'Calculé',
    control: 'Audit OK',
    anomalies: 0
  },
  {
    site: 'Maroc / Tanger Plant',
    status: 'En validation',
    control: '2 contrôles restants',
    anomalies: 3
  },
  {
    site: 'France / Paris filiale',
    status: 'Synchronisé',
    control: 'Exports DSN OK',
    anomalies: 1
  },
  {
    site: 'Espagne / Madrid retail',
    status: 'En cours',
    control: 'Vérification TVA',
    anomalies: 2
  }
];

const actionItems = [
  {
    title: 'Valider la campagne bonus',
    owner: 'Direction Finance',
    due: '15 mai',
    status: 'En cours'
  },
  {
    title: 'Clôturer onboarding site Tanger',
    owner: 'RH Site Nord',
    due: '10 mai',
    status: 'À faire'
  },
  {
    title: 'Partager rapport QVT',
    owner: 'People Care',
    due: '12 mai',
    status: 'En revue'
  },
  {
    title: 'Synchroniser effectifs SAP',
    owner: 'IT RH',
    due: 'Aujourd’hui',
    status: 'Prioritaire'
  }
];

const privateKpiGrid = document.getElementById('privateKpiGrid');
const pipelineBoard = document.getElementById('pipelineBoard');
const engagementMap = document.getElementById('engagementMap');
const programCards = document.getElementById('programCards');
const payrollTableBody = document.querySelector('#payrollTable tbody');
const actionTableBody = document.querySelector('#actionTable tbody');

const renderPrivateKpis = (range = 'week') => {
  const dataset = privateKpiData[range] ?? privateKpiData.week;
  privateKpiGrid.innerHTML = dataset
    .map((item) => {
      const value = item.unit.includes('%')
        ? `${item.value}${item.unit}`
        : `${window.AtlasDashboard.formatNumber(item.value)}${item.unit}`;
      return `
        <article class="metric-card">
          <header>
            <span>${item.title}</span>
            <span class="metric-trend" data-trend="${item.trend}">${item.trendLabel}</span>
          </header>
          <div class="metric-value">${value}</div>
          <p class="metric-trend">${item.description}</p>
        </article>
      `;
    })
    .join('');
};

const renderPipeline = () => {
  pipelineBoard.innerHTML = pipelineData
    .map(
      (column) => `
        <div class="kanban-column">
          <h4>${column.stage}</h4>
          ${column.items
            .map(
              (card) => `
                <div class="kanban-card">
                  <strong>${card.name}</strong>
                  <span>${card.role}</span>
                  <span>SLA : ${card.eta}</span>
                </div>
              `
            )
            .join('')}
        </div>
      `
    )
    .join('');
};

const renderEngagement = () => {
  engagementMap.innerHTML = engagementData
    .map(
      (item) => `
        <div class="energy-row">
          <strong>${item.site}</strong>
          <div class="energy-bar"><span style="width: ${item.score}%"></span></div>
          <span class="score-pill">${item.score}/100 &nbsp; ${item.trend}</span>
        </div>
      `
    )
    .join('');
};

const renderPrograms = () => {
  programCards.innerHTML = programData
    .map(
      (item) => `
        <div class="performance-card">
          <span>${item.title}</span>
          <strong>${item.value}</strong>
          <span>${item.detail}</span>
          <span class="metric-trend" data-trend="up">${item.trend}</span>
        </div>
      `
    )
    .join('');
};

const renderPayroll = () => {
  payrollTableBody.innerHTML = payrollData
    .map(
      (item) => `
        <tr>
          <td>${item.site}</td>
          <td>${item.status}</td>
          <td>${item.control}</td>
          <td>${item.anomalies}</td>
        </tr>
      `
    )
    .join('');
};

const renderActions = () => {
  actionTableBody.innerHTML = actionItems
    .map(
      (item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.owner}</td>
          <td>${item.due}</td>
          <td>${item.status}</td>
        </tr>
      `
    )
    .join('');
};

window.AtlasDashboard?.init('private', {
  defaultNav: 'overview',
  onReady: () => {
    renderPrivateKpis('week');
    renderPipeline();
    renderEngagement();
    renderPrograms();
    renderPayroll();
    renderActions();

    window.AtlasDashboard.registerSegmentedControl('#privateKpiControls', (value) => {
      renderPrivateKpis(value ?? 'week');
    });
  }
});
