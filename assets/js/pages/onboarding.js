import { getData, setData } from '../data/store.js';
import { exportDocxFromTemplate } from '../services/exports.js';
import { generateId, showToast } from '../services/utils.js';

const renderChecklist = (container, data) => {
  const section = container.querySelector('#onboardingList');
  section.innerHTML = data.onboarding
    .map((entry) => {
      const candidate = data.candidates.find((c) => c.id === entry.candidatId);
      const name = candidate ? `${candidate.prenom} ${candidate.nom}` : 'Candidat supprimé';
      return `
        <div class="data-card" data-id="${entry.id}">
          <div class="flex-between">
            <h3>${entry.poste}</h3>
            <span class="badge">${name}</span>
          </div>
          <div class="grid">
            ${Object.entries(entry.checklist)
              .map(
                ([team, tasks]) => `
                  <div>
                    <strong>${team}</strong>
                    ${tasks
                      .map(
                        (task, idx) => `
                        <label class="flex-between">
                          <span>${task.label} – ${task.due}</span>
                          <fluent-checkbox data-team="${team}" data-index="${idx}" ${task.done ? 'checked' : ''}></fluent-checkbox>
                        </label>
                      `
                      )
                      .join('')}
                  </div>
                `
              )
              .join('')}
          </div>
          <div class="toolbar">
            <fluent-button appearance="accent" data-action="contract">Contrat</fluent-button>
            <fluent-button appearance="stealth" data-action="attestation">Attestation</fluent-button>
          </div>
        </div>
      `;
    })
    .join('');

  section.querySelectorAll('fluent-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const card = event.target.closest('.data-card');
      const entryId = card.dataset.id;
      const team = event.target.dataset.team;
      const index = Number(event.target.dataset.index);
      setData((draft) => {
        const entry = draft.onboarding.find((item) => item.id === entryId);
        if (!entry) return;
        entry.checklist[team][index].done = event.target.checked;
      });
      showToast('Checklist mise à jour');
    });
  });

  section.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('.data-card');
      const entryId = card.dataset.id;
      const dataFresh = getData();
      const entry = dataFresh.onboarding.find((item) => item.id === entryId);
      const candidate = dataFresh.candidates.find((c) => c.id === entry?.candidatId) || {};
      const variables = {
        societe: 'Atlas HR Suite',
        nom: candidate.nom || '',
        prenom: candidate.prenom || '',
        poste: entry.poste,
        date_debut: entry.dateDebut || new Date().toLocaleDateString('fr-FR'),
        cnss: '',
        cnie_masque: candidate.cnie ? '*** *** ' + candidate.cnie.slice(-4) : ''
      };
      if (button.dataset.action === 'contract') {
        await exportDocxFromTemplate('Contrat CDI', variables, `Contrat-${candidate.prenom || ''}-${candidate.nom || ''}.docx`);
      } else {
        await exportDocxFromTemplate('Attestation', variables, `Attestation-${candidate.prenom || ''}-${candidate.nom || ''}.docx`);
      }
      showToast('Document généré');
    });
  });
};

export const onboardingRoute = {
  id: 'onboarding',
  path: '#/onboarding',
  labelKey: 'nav.onboarding',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>Onboarding</h2>
          <div class="toolbar">
            <fluent-button id="createFromCandidate" appearance="accent">Créer dossier salarié</fluent-button>
          </div>
        </div>
        <div id="onboardingList" class="grid"></div>
      </section>

      <section class="data-card">
        <h3>Créer checklist personnalisée</h3>
        <form id="onboardingForm" class="grid">
          <label>Poste
            <fluent-text-field name="poste" required></fluent-text-field>
          </label>
          <label>Candidat
            <fluent-select name="candidat" required>
              ${data.candidates.map((c) => `<fluent-option value="${c.id}">${c.prenom} ${c.nom}</fluent-option>`).join('')}
            </fluent-select>
          </label>
          <label>Équipe IT tâches (séparées par ;)
            <fluent-text-area name="it"></fluent-text-area>
          </label>
          <label>Équipe RH tâches
            <fluent-text-area name="rh"></fluent-text-area>
          </label>
          <label>Manager tâches
            <fluent-text-area name="manager"></fluent-text-area>
          </label>
          <div class="toolbar" style="grid-column: 1 / -1; justify-content: flex-end;">
            <fluent-button type="submit" appearance="accent">Ajouter</fluent-button>
          </div>
        </form>
      </section>
    `;

    const render = () => renderChecklist(container, getData());
    render();

    container.querySelector('#onboardingForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const poste = form.get('poste');
      const candidatId = form.get('candidat');
      const parseTasks = (value) =>
        value
          .split(';')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((label) => ({ label, due: new Date().toISOString().slice(0, 10), done: false }));

      setData((draft) => {
        draft.onboarding.push({
          id: generateId('ONB'),
          candidatId,
          poste,
          checklist: {
            IT: parseTasks(form.get('it') || ''),
            RH: parseTasks(form.get('rh') || ''),
            Manager: parseTasks(form.get('manager') || '')
          }
        });
      });
      event.currentTarget.reset();
      render();
      showToast('Checklist créée');
    });

    container.querySelector('#createFromCandidate').addEventListener('click', () => {
      const fresh = getData();
      const candidateId = prompt('ID candidat à convertir ? (ex: CAN-001)');
      const candidate = fresh.candidates.find((c) => c.id === candidateId);
      if (!candidate) {
        showToast('Candidat introuvable', 'warn');
        return;
      }
      setData((draft) => {
        draft.employees.push({
          id: generateId('EMP'),
          prenom: candidate.prenom,
          nom: candidate.nom,
          poste: draft.offers.find((o) => o.id === candidate.offre)?.titre || 'Poste',
          department: 'À préciser',
          salaireBase: 10000,
          primes: 0,
          cnss: '',
          cnie: candidate.cnie,
          cnieMasquee: mask(candidate.cnie),
          rib: '',
          adresse: '',
          ice: '',
          if: '',
          situationFamiliale: '',
          contrat: 'CDI',
          dateEmbauche: new Date().toISOString().slice(0, 10),
          cimr: false,
          ayantsDroit: []
        });
      });
      showToast('Salarié créé');
    });
  }
};

const mask = (value) => (!value ? '' : `*** *** ${value.slice(-4)}`);
