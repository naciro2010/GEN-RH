const metricsData = [
  {
    scope: "public",
    items: [
      { label: "Temps de traitement des concours", value: "18 j", change: "+22% plus rapide" },
      { label: "Traçabilité budgétaire", value: "100%", change: "Audit IGF réussi" },
      { label: "Agents formés", value: "2 450", change: "Plan national 2024" }
    ]
  },
  {
    scope: "private",
    items: [
      { label: "Onboarding digital", value: "96 h", change: "Réduction -35%" },
      { label: "Satisfaction collaborateurs", value: "4.6/5", change: "Baromètre QVT 2023" },
      { label: "Paie certifiée", value: "ISO 27001", change: "Certification renouvelée" }
    ]
  }
];

const solutionsData = [
  {
    icon: "👥",
    title: "Recrutement & concours",
    description:
      "Gestion des concours publics, viviers de talents et mobilité interne multi-ministères."
  },
  {
    icon: "💳",
    title: "Paie marocaine intégrée",
    description: "Calcul multi-statut, bulletin digital, intégration CNSS, CIMR, Mutuelles."
  },
  {
    icon: "📊",
    title: "Analytique & BI RH",
    description: "Rapports dynamiques Power BI, suivi régional, pilotage des objectifs."
  },
  {
    icon: "🧭",
    title: "Gestion des compétences",
    description: "Référentiels métiers marocains, cartographie GPEC et plans de formation."
  },
  {
    icon: "📄",
    title: "Marchés publics & conformité",
    description: "Workflows alignés aux décrets marocains, contrôle DGCL et audits IGF."
  },
  {
    icon: "🤝",
    title: "Expérience collaborateur",
    description: "Portail libre-service multilingue (FR/AR), assistance virtuelle et mobile."
  }
];

const modulesData = {
  public: {
    highlights: [
      {
        title: "Portail citoyen & concours",
        description: "Publication en ligne, anonymisation des candidatures et scoring automatique."
      },
      {
        title: "Budgets et effectifs",
        description: "Projection pluriannuelle, contrôle budgétaire et suivi des vacants."
      },
      {
        title: "Conformité renforcée",
        description: "Audit trail complet pour la Cour des comptes et exports DAMANCOM."
      }
    ],
    modules: [
      {
        name: "Gestion administrative multi-statut",
        badge: "DGCL ready",
        description: "Fonctionnaires, contractuels, vacataires et assimilés avec règles spécifiques.",
        items: [
          "Génération d'arrêtés, arrêtés de titularisation, avancements et sanctions",
          "Synchronisation SIGRH et intégration GED étatique",
          "Workflow hiérarchique configurable (ministère, wilaya, commune)"
        ]
      },
      {
        name: "Pilotage des concours & examens",
        badge: "eConcours",
        description: "Planification, gestion des jurys, publication des résultats en ligne.",
        items: [
          "Banque de sujets centralisée et anonymisation des copies",
          "Notation collaborative et génération automatique des procès-verbaux",
          "Statistiques en temps réel pour la Direction du Budget"
        ]
      },
      {
        name: "Gestion des carrières publiques",
        badge: "360°",
        description: "Suivi des plans de carrière, mobilités inter-ministérielles et détachements.",
        items: [
          "Cartographie des compétences par grade et corps",
          "Scénarios de mobilité géographique et sectorielle",
          "Plan de succession et suivi des talents critiques"
        ]
      },
      {
        name: "Observatoire social & dialogue",
        badge: "Social",
        description: "Suivi des indicateurs sociaux et des conventions collectives locales.",
        items: [
          "Analyse des réclamations citoyennes et agents",
          "Préparation des commissions paritaires et réunions de dialogue social",
          "Reporting automatisé vers la Primature"
        ]
      }
    ]
  },
  private: {
    highlights: [
      {
        title: "Culture data-driven",
        description: "Dashboards Power BI prêts à l'emploi, exports Excel compatibles Microsoft."
      },
      {
        title: "Onboarding digital",
        description: "Portail mobile, signature électronique Barid eSign et checklists métiers."
      },
      {
        title: "Paie fiable",
        description: "Calcul multi-convention, DSN Maroc, intégration Sage et SAP."
      }
    ],
    modules: [
      {
        name: "Recrutement & ATS intelligent",
        badge: "IA",
        description: "Matching automatique, multi-jobboards marocains, statistiques EDI.",
        items: [
          "Connecteurs Rekrute, AmalJob, LinkedIn et Candidature spontanée",
          "Analyse sémantique bilingue FR/AR pour short-listing",
          "Pipeline visuel Kanban avec alertes SLA"
        ]
      },
      {
        name: "Gestion de la paie & déclarations",
        badge: "CNSS",
        description: "Calcul multi-sites, primes, heures sup, indemnités et déclarations sociales.",
        items: [
          "Export DAMANCOM, CIMR, AMO, mutuelles et affiliations OMPIC",
          "Gestion des avances et prêts salariés avec workflows d'approbation",
          "Tableau de contrôle des écarts et audit trail complet"
        ]
      },
      {
        name: "Performance & objectifs",
        badge: "OKR",
        description: "Objectifs alignés, évaluations 360°, feedbacks continus et reconnaissance.",
        items: [
          "Bibliothèque d'objectifs sectoriels (industrie, banque, retail)",
          "Campagnes d'évaluation multi-niveaux avec signatures digitales",
          "Analyse de la performance par région et par métier"
        ]
      },
      {
        name: "Engagement & QVT",
        badge: "Pulse",
        description: "Baromètre social, sondages pulse et suggestions anonymes.",
        items: [
          "Application mobile en darija, arabe et français",
          "Kiosques interactifs pour sites industriels",
          "Moteur de recommandations de plans d'action"
        ]
      }
    ]
  }
};

const timelineData = [
  {
    title: "Déploiement portail agents",
    description: "Lancement sur 12 régions avec connecteurs intranet Microsoft 365.",
    date: "T2 2024"
  },
  {
    title: "Certification ISO 27001 renouvelée",
    description: "Audit externe mené par Bureau Veritas, périmètre data centers Rabat/Casa.",
    date: "T3 2024"
  },
  {
    title: "Programme de mobilité inter-groupe",
    description: "Matching IA des profils entre filiales industrielles et retail.",
    date: "T1 2025"
  }
];

const complianceData = [
  {
    title: "Loi 09-08 & CNDP",
    status: "Conforme",
    description: "Traçabilité des consentements et registre des traitements, hébergement Maroc."
  },
  {
    title: "AMO & CNSS",
    status: "Automatisé",
    description: "Exports DAMANCOM, pré-déclaration et contrôle des anomalies en temps réel."
  },
  {
    title: "Marchés publics",
    status: "Sécurisé",
    description: "Clauses CCAG-TIC intégrées, gestion des avenants et pièces justificatives."
  }
];

const testimonials = [
  {
    quote:
      "« Atlas HR Suite a transformé notre direction des ressources humaines. Les concours sont digitalisés et la mobilité est maîtrisée. »",
    author: "Direction des Ressources Humaines – Ministère de l'Intérieur"
  },
  {
    quote:
      "« L'intégration à Microsoft 365 et à notre paie SAP s'est faite sans friction. Les équipes ont adopté l'interface immédiatement. »",
    author: "CHRO – Holding industriel marocain"
  },
  {
    quote:
      "« Le module d'engagement multilingue nous permet d'écouter nos collaborateurs sur tous nos sites au Maroc. »",
    author: "DRH – Banque régionale"
  }
];

const heroMetrics = document.getElementById("heroMetrics");
const solutionGrid = document.getElementById("solutionGrid");
const moduleGrid = document.getElementById("moduleGrid");
const moduleHighlights = document.getElementById("moduleHighlights");
const scopeButtons = document.querySelectorAll(".scope-button");
const heroButtons = document.querySelectorAll(".hero-actions .btn");
const projectTimeline = document.getElementById("projectTimeline");
const compliancePanel = document.getElementById("compliancePanel");
const testimonialTrack = document.getElementById("testimonialTrack");
const currentYear = document.getElementById("currentYear");
const loginLinks = document.querySelectorAll('a[href$="login.html"]');

let currentScope = "public";

const registerReveal = () => {
  window.AtlasUI?.observeReveal?.(
    document.querySelectorAll(
      ".solution-card, .module-card, .dashboard-card, .testimonial-card"
    )
  );
};

const renderMetrics = (scope = "public") => {
  const data = metricsData.find((item) => item.scope === scope) ?? metricsData[0];
  heroMetrics.innerHTML = data.items
    .map(
      (metric) => `
        <li>
          <strong>${metric.value}</strong>
          <div>
            <span>${metric.label}</span>
            <small>${metric.change}</small>
          </div>
        </li>
      `
    )
    .join("");
};

const renderSolutions = () => {
  solutionGrid.innerHTML = solutionsData
    .map(
      (solution) => `
        <article class="solution-card">
          <span class="icon" aria-hidden="true">${solution.icon}</span>
          <h3>${solution.title}</h3>
          <p>${solution.description}</p>
        </article>
      `
    )
    .join("");
  registerReveal();
};

const renderModules = (scope = "public") => {
  const data = modulesData[scope];
  currentScope = scope;
  moduleHighlights.innerHTML = data.highlights
    .map(
      (highlight) => `
        <li>
          <strong>${highlight.title}</strong>
          <span>${highlight.description}</span>
        </li>
      `
    )
    .join("");

  moduleGrid.innerHTML = data.modules
    .map(
      (module) => `
        <article class="module-card" data-badge="${module.badge}">
          <h3>${module.name}</h3>
          <p>${module.description}</p>
          <ul>
            ${module.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
  registerReveal();
};

const renderTimeline = () => {
  projectTimeline.innerHTML = timelineData
    .map(
      (item) => `
        <li>
          <strong>${item.title}</strong>
          <span>${item.description}</span>
          <span class="badge">${item.date}</span>
        </li>
      `
    )
    .join("");
};

const renderCompliance = () => {
  compliancePanel.innerHTML = complianceData
    .map(
      (item) => `
        <div class="compliance-item">
          <strong>${item.title}</strong>
          <span>${item.description}</span>
          <span class="badge">${item.status}</span>
        </div>
      `
    )
    .join("");
};

const renderTestimonials = () => {
  testimonialTrack.innerHTML = testimonials
    .map(
      (item) => `
        <article class="testimonial-card">
          <blockquote>${item.quote}</blockquote>
          <cite>${item.author}</cite>
        </article>
      `
    )
    .join("");
  registerReveal();
};

const setActiveScopeButton = (scope) => {
  scopeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === scope);
  });
};

const animateCounters = () => {
  const counters = heroMetrics.querySelectorAll("strong");
  counters.forEach((counter) => {
    const value = counter.textContent;
    if (/^\d/.test(value)) {
      const numericValue = Number(value.replace(/[^0-9]/g, ""));
      if (!Number.isNaN(numericValue) && numericValue > 0) {
        let current = 0;
        const increment = Math.ceil(numericValue / 60);
        const interval = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            counter.textContent = value;
            clearInterval(interval);
          } else {
            counter.textContent = `${current.toLocaleString("fr-FR")}${value.replace(/^[0-9\s]+/, "")}`;
          }
        }, 16);
      }
    }
  });
};

renderMetrics();
renderSolutions();
renderModules();
renderTimeline();
renderCompliance();
renderTestimonials();
if (currentYear) currentYear.textContent = new Date().getFullYear();
animateCounters();

scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { scope } = button.dataset;
    renderModules(scope);
    renderMetrics(scope);
    setActiveScopeButton(scope);
    animateCounters();
  });
});

heroButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { scope } = button.dataset;
    sessionStorage.setItem("atlas-preferred-scope", scope);
    renderModules(scope);
    renderMetrics(scope);
    setActiveScopeButton(scope);
    document.querySelector("#modules").scrollIntoView({ behavior: "smooth" });
    animateCounters();
  });
});

loginLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("atlas-preferred-scope", currentScope);
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  alert(
    `Merci ${payload.name || ""}! Nous vous contacterons au ${payload.phone || "plus vite possible"} pour discuter de vos besoins RH.`
  );
  form.reset();
});
registerReveal();
