import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const proofLogos = ['FinanceTech', 'Dar El IT', 'Atlas Public', 'Medina Services', 'North Africa Steel'];

const cards = [
  {
    icon: '👥',
    title: 'Core RH & Social',
    body: 'Administration du personnel, dossier salarié 360°, workflow CNSS, contrats bilingues.',
    bullets: ['Checklists onboarding multi-équipes', 'Gestion des documents RH chiffrés', 'Historique légal 5 ans']
  },
  {
    icon: '💼',
    title: 'Paie Maroc',
    body: 'Calculs CNSS/AMO/TFP, IR 2025, variables mensuelles, exports Damancom & SIMPL‑IR.',
    bullets: ['Simulation masse salariale temps réel', 'Bulletins Word / Excel générés en 1 clic', 'Campagnes de régularisation']
  },
  {
    icon: '⭐',
    title: 'Talents & Compétences',
    body: 'Recrutement en kanban, évaluations, plans de succession et entretiens annuels.',
    bullets: ['Job boards multi-sources', 'Profils compétences et matrices 9-box', 'Campagnes d’entretiens multilingues']
  },
  {
    icon: '🤝',
    title: 'Self-service collaborateur',
    body: 'Portail salarié, demandes de congés, déclarations de pointage, workflow managers.',
    bullets: ['Accès mobile responsive', 'Notifications Fluent UI', 'Signature électronique intégrée']
  }
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="landing">
      <header className="site-header" id="top">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/assets/icon.svg" alt="Atlas HR Suite" />
            <span>Atlas HR Suite</span>
          </Link>
          <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
            <a href="#vision">Vision</a>
            <a href="#modules">Modules</a>
            <a href="#experience">Expérience</a>
            <a href="#references">Références</a>
            <Link to="/app">Se connecter</Link>
          </nav>
          <button className="nav-toggle" aria-label="Ouvrir le menu" onClick={() => setMenuOpen((prev) => !prev)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="vision">
          <div className="container hero__grid">
            <div className="hero__content">
              <span className="pill">SIRH marocain nouvelle génération</span>
              <h1>Le pilotage RH qui rivalise avec les leaders SIRH nationaux.</h1>
              <p>
                Atlas HR Suite couvre l’intégralité du cycle de vie collaborateur : recrutement, onboarding, paie Maroc,
                compétences et engagement. Une expérience moderne, inspirée d’AGIRH, enrichie par nos innovations
                analytics et Microsoft 365.
              </p>
              <div className="hero__actions">
                <Link to="/app" className="pill">
                  Découvrir la démo
                </Link>
                <a href="#modules" className="pill pill--ghost">
                  Voir les modules
                </a>
              </div>
              <ul className="hero__badges">
                <li>
                  <strong>+30</strong> processus prêts à l’emploi
                </li>
                <li>
                  <strong>CNSS / SIMPL‑IR</strong> conformes 2025
                </li>
                <li>
                  <strong>FR / AR</strong> avec mode RTL
                </li>
              </ul>
            </div>
            <div className="hero__visual" aria-hidden="true">
              <div className="device-frame">
                <div className="device-header">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <div className="device-body">
                  <div className="device-chip">
                    <span>Paie en direct</span>
                    <strong>Net moyen : 12 540 MAD</strong>
                    <small>Mise à jour à 09:42</small>
                  </div>
                  <div className="device-stats">
                    <div>
                      <span>Recrutement</span>
                      <strong>18</strong>
                      <small>candidats actifs</small>
                    </div>
                    <div>
                      <span>Formations</span>
                      <strong>7</strong>
                      <small>sessions à venir</small>
                    </div>
                    <div>
                      <span>Absences</span>
                      <strong>3</strong>
                      <small>aujourd’hui</small>
                    </div>
                  </div>
                  <div className="device-footer">
                    <span className="tag">Mode Excel</span>
                    <span className="tag">Power BI Ready</span>
                    <span className="tag">Self-Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="social-proof" id="references">
          <div className="container">
            <p>Adoptée par des entreprises marocaines et africaines ambitieuses</p>
            <div className="proof-logos">
              {proofLogos.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="modules" id="modules">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="pill pill--ghost">Plateforme modulaire</span>
                <h2>Tout le SIRH en un hub, au niveau des leaders du marché.</h2>
                <p>
                  Retrouvez les parcours et bonnes pratiques AGIRH : Core RH, paie, talents, self-service et pilotage
                  stratégique… avec une ergonomie modernisée et des exports Microsoft 365 prêts à l’emploi.
                </p>
              </div>
              <Link to="/app" className="pill">
                Entrer dans l’application
              </Link>
            </div>
            <div className="card-grid">
              {cards.map((card) => (
                <article className="card" key={card.title}>
                  <span className="card-icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="metrics">
          <div className="container metrics__grid">
            <div>
              <h3>Des gains mesurables.</h3>
              <p>
                Les organisations qui migrent depuis des solutions historiques réduisent l’administratif de 38% et
                accélèrent leurs campagnes paie et talent management.
              </p>
            </div>
            <div className="metric-card">
              <strong>-40%</strong>
              <span>Temps de préparation paie</span>
            </div>
            <div className="metric-card">
              <strong>95%</strong>
              <span>Adoption du portail collaborateurs</span>
            </div>
            <div className="metric-card">
              <strong>&lt;30 j</strong>
              <span>Projet moyen de mise en service</span>
            </div>
          </div>
        </section>

        <section className="experience" id="experience">
          <div className="container experience__grid">
            <div className="experience__visual" aria-hidden="true">
              <div className="panel">
                <span className="panel-title">Vue Manager</span>
                <p>Validation multi-niveaux, suivi budget, to-do list quotidienne.</p>
              </div>
              <div className="panel panel--two">
                <span className="panel-title">Portail Collaborateur</span>
                <p>Demandes congés, bulletins, attestations disponibles 24/7.</p>
              </div>
              <div className="panel panel--three">
                <span className="panel-title">Analytics</span>
                <p>Widgets Power BI, turnover, masse salariale, diversité.</p>
              </div>
            </div>
            <div className="experience__content">
              <span className="pill pill--ghost">Expérience utilisateur</span>
              <h2>Une interface riche et rassurante, pensée pour les usages quotidiens.</h2>
              <ul>
                <li>Ribbon type Office pour les actions clés, navigation latérale structurée.</li>
                <li>Mode Excel vert pour les experts paie, mode standard pour tout le monde.</li>
                <li>Accessibilité FR / AR, prise en charge RTL et thèmes clair/sombre.</li>
              </ul>
              <Link to="/app" className="pill">
                Tester le tableau de bord
              </Link>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <div className="cta__content">
              <h2>Prêt à proposer mieux que votre SIRH actuel ?</h2>
              <p>
                Nous paramétrons Atlas HR Suite en moins d’un mois avec reprise des données, paramétrage légal Maroc,
                intégrations Microsoft 365 et formation des équipes.
              </p>
            </div>
            <div className="cta__actions">
              <a href="mailto:support@atlas-suite.ma" className="pill">
                Planifier une démo
              </a>
              <Link to="/app" className="pill pill--ghost">
                Ouvrir la sandbox
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div>
            <strong>Atlas HR Suite</strong>
            <p>Suite RH complète, inspirée des meilleures pratiques SIRH marocaines.</p>
          </div>
          <div className="footer-links">
            <a href="#modules">Modules</a>
            <a href="#experience">Expérience</a>
            <Link to="/app">Accès application</Link>
          </div>
          <span className="footer-copy">© {year} Atlas HR Suite — Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
