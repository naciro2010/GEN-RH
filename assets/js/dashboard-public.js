const kpiData = {
  month: [
    {
      title: 'Concours en publication',
      value: 12,
      unit: '',
      trend: 'up',
      trendLabel: '+3 vs mois-1',
      description: 'Annonces multi-ministères actives'
    },
    {
      title: 'Agents titularisés',
      value: 184,
      unit: '',
      trend: 'up',
      trendLabel: '+18 dossiers clos',
      description: 'Titularisations validées par la DGCL'
    },
    {
      title: 'Crédits consommés',
      value: 68,
      unit: '%',
      trend: 'stable',
      trendLabel: 'Budget 2024',
      description: 'Budgets fonctionnement RH'
    },
    {
      title: 'Dossiers CNDP',
      value: 4,
      unit: '',
      trend: 'down',
      trendLabel: '-2 vs mois-1',
      description: 'Incidents de conformité ouverts'
    }
  ],
  quarter: [
    {
      title: 'Concours traités',
      value: 38,
      unit: '',
      trend: 'up',
      trendLabel: '+12% QoQ',
      description: 'Inclut mobilités inter-ministérielles'
    },
    {
      title: 'Agents formés',
      value: 960,
      unit: '',
      trend: 'up',
      trendLabel: '+140 stagiaires',
      description: 'Formations certifiantes CFTRH'
    },
    {
      title: 'Taux de vacance',
      value: 7.4,
      unit: '%',
      trend: 'down',
      trendLabel: '-0,6 pt',
      description: 'Postes critiques pourvus'
    },
    {
      title: 'Infractions audit IGF',
      value: 0,
      unit: '',
      trend: 'stable',
      trendLabel: 'Conformité totale',
      description: 'Périmètre 12 directions'
    }
  ],
  year: [
    {
      title: 'Agents gérés',
      value: 32450,
      unit: '',
      trend: 'up',
      trendLabel: '+1 250 agents',
      description: 'Tous statuts confondus'
    },
    {
      title: 'Campagnes concours',
      value: 112,
      unit: '',
      trend: 'up',
      trendLabel: '+14 campagnes',
      description: 'Plateforme eConcours'
    },
    {
      title: 'Budget RH engagé',
      value: 92,
      unit: '%',
      trend: 'stable',
      trendLabel: 'vs Loi de Finance',
      description: 'Montants consolidés'
    },
    {
      title: 'Missions audit clôturées',
      value: 9,
      unit: '',
      trend: 'up',
      trendLabel: '+2 audits',
      description: 'Cour des comptes & IGF'
    }
  ]
};

const timelineItems = [
  {
    title: 'Publication concours Attachés',
    owner: 'DRH Ministère de l’Intérieur',
    due: '12 mai',
    status: 'En cours de diffusion'
  },
  {
    title: 'Jury mobilité inter-régions',
    owner: 'Secrétariat général',
    due: '21 mai',
    status: 'Complet'
  },
  {
    title: 'Campagne titularisation contractuels',
    owner: 'Commission nationale',
    due: '5 juin',
    status: 'Préparation dossier'
  }
];

const complianceItems = [
  {
    label: 'CNDP – Registre traitements',
    status: 'Conforme',
    owner: 'DPO Ministériel'
  },
  {
    label: 'Cour des comptes – Marchés RH',
    status: 'Audit planifié',
    owner: 'Direction Budget'
  },
  {
    label: 'IGF – Masse salariale',
    status: 'En alerte',
    owner: 'Direction Financière'
  }
];

const budgetData = [
  {
    label: 'Budget formation',
    used: 12.5,
    total: 18.0
  },
  {
    label: 'Budget masse salariale',
    used: 68,
    total: 92
  },
  {
    label: 'Budget logistique concours',
    used: 7.2,
    total: 9.5
  }
];

const workforceData = [
  {
    label: 'Administrations centrales',
    count: 14860,
    ratio: 46
  },
  {
    label: 'Services déconcentrés',
    count: 10340,
    ratio: 32
  },
  {
    label: 'Collectivités territoriales',
    count: 5200,
    ratio: 16
  },
  {
    label: 'Organismes sous tutelle',
    count: 2050,
    ratio: 6
  }
];

const heatmapData = [
  {
    label: 'Direction du Budget',
    score: 88,
    comment: 'Baromètre en amélioration'
  },
  {
    label: 'Direction des Affaires Administratives',
    score: 74,
    comment: 'Plans d’action en déploiement'
  },
  {
    label: 'Région Casablanca-Settat',
    score: 69,
    comment: 'Suivi mobilité à renforcer'
  },
  {
    label: 'Région Souss-Massa',
    score: 82,
    comment: 'Forte adhésion au SIRH'
  }
];

const alertItems = [
  {
    title: 'Contrats arrivant à échéance',
    detail: '24 contractuels à renouveler avant le 31 mai'
  },
  {
    title: 'Rapports concours manquants',
    detail: '4 procès-verbaux en attente de signature digitale'
  },
  {
    title: 'Budget formation à arbitrer',
    detail: 'Crédits à ventiler entre directions régionales'
  }
];

const initiatives = [
  {
    name: 'Portail agent unique',
    lead: 'Direction du numérique',
    due: 'Juin 2024'
  },
  {
    name: 'Cartographie des compétences',
    lead: 'Département GPEC',
    due: 'Septembre 2024'
  },
  {
    name: 'Programme mobilité Sud',
    lead: 'Secrétariat général',
    due: 'Décembre 2024'
  }
];

const tags = [
  'eConcours',
  'Mobilité nationale',
  'Déconcentration',
  'Audit IGF',
  'Paie multi-statut',
  'Plan de formation',
  'Dialogue social'
];

const kpiGrid = document.getElementById('kpiGrid');
const timelineList = document.getElementById('timelineList');
const complianceStatus = document.getElementById('complianceStatus');
const budgetList = document.getElementById('budgetList');
const workforceDistribution = document.getElementById('workforceDistribution');
const serviceHeatmap = document.getElementById('serviceHeatmap');
const alertList = document.getElementById('alertList');
const tagList = document.getElementById('tagList');
const initiativeTableBody = document.querySelector('#initiativeTable tbody');

const renderKpis = (range = 'month') => {
  const dataset = kpiData[range] ?? kpiData.month;
  kpiGrid.innerHTML = dataset
    .map((item) => {
      const value = item.unit === '%' ? `${item.value}${item.unit}` : window.AtlasDashboard.formatNumber(item.value) + item.unit;
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

const renderTimeline = () => {
  timelineList.innerHTML = timelineItems
    .map(
      (item) => `
        <li>
          <time>${item.due}</time>
          <strong>${item.title}</strong>
          <span>${item.owner}</span>
        </li>
      `
    )
    .join('');
};

const renderCompliance = () => {
  complianceStatus.innerHTML = complianceItems
    .map(
      (item) => `
        <div class="status-row">
          <div>
            <strong>${item.label}</strong>
            <span>${item.owner}</span>
          </div>
          <span class="badge">${item.status}</span>
        </div>
      `
    )
    .join('');
};

const renderBudgets = () => {
  budgetList.innerHTML = budgetData
    .map((item) => {
      const percent = Math.round((item.used / item.total) * 100);
      return `
        <div class="progress-row">
          <strong>
            <span>${item.label}</span>
            <span>${percent}%</span>
          </strong>
          <div class="progress-bar"><span style="width: ${percent}%"></span></div>
          <span class="metric-trend">${window.AtlasDashboard.formatCurrency(item.used)} / ${window.AtlasDashboard.formatCurrency(item.total)}</span>
        </div>
      `;
    })
    .join('');
};

const renderWorkforce = () => {
  workforceDistribution.innerHTML = workforceData
    .map(
      (item) => `
        <div class="distribution-row">
          <header>
            <span>${item.label}</span>
            <strong>${window.AtlasDashboard.formatNumber(item.count)}</strong>
          </header>
          <div class="distribution-bar"><span style="width: ${item.ratio}%"></span></div>
        </div>
      `
    )
    .join('');
};

const renderHeatmap = () => {
  serviceHeatmap.innerHTML = heatmapData
    .map(
      (item) => `
        <div class="heatmap-row">
          <strong>${item.label}</strong>
          <progress value="${item.score}" max="100"></progress>
          <span>${item.comment}</span>
        </div>
      `
    )
    .join('');
};

const renderAlerts = () => {
  alertList.innerHTML = alertItems
    .map(
      (item) => `
        <li>
          <strong>${item.title}</strong>
          <span>${item.detail}</span>
        </li>
      `
    )
    .join('');
};

const renderTags = () => {
  tagList.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join('');
};

const renderInitiatives = () => {
  initiativeTableBody.innerHTML = initiatives
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.lead}</td>
          <td>${item.due}</td>
        </tr>
      `
    )
    .join('');
};

window.AtlasDashboard?.init('public', {
  defaultNav: 'overview',
  onReady: () => {
    renderKpis('month');
    renderTimeline();
    renderCompliance();
    renderBudgets();
    renderWorkforce();
    renderHeatmap();
    renderAlerts();
    renderTags();
    renderInitiatives();

    window.AtlasDashboard.registerSegmentedControl('#kpiControls', (value) => {
      renderKpis(value ?? 'month');
    });
  }
});
