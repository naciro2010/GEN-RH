import { setData, getData } from '../data/store.js';
import { t } from '../i18n.js';
import { maskCnie, showToast } from '../services/utils.js';
import { exportXlsx, exportDocxFromTemplate, openWordOnlinePlaceholder } from '../services/exports.js';

const stages = ['Sourcing', 'Entretien', 'Test', 'Offre', 'Embauche'];

const candidateRow = (candidate) => ({
  ID: candidate.id,
  Offre: candidate.offre,
  Nom: `${candidate.prenom} ${candidate.nom}`,
  Email: candidate.email,
  Téléphone: candidate.telephone,
  Source: candidate.source,
  Consentement: candidate.consentement ? 'Oui' : 'Non'
});

const renderKanban = (container, data) => {
  const kanban = container.querySelector('.kanban');
  if (!kanban) return;
  kanban.innerHTML = stages
    .map((stage) => {
      const cards = data.offers
        .flatMap((offer) => (offer.pipeline[stage] || []).map((candidateId) => ({ offer, candidateId })))
        .map(({ offer, candidateId }) => {
          const candidate = data.candidates.find((c) => c.id === candidateId);
          if (!candidate) return '';
          return `
            <div class="kanban-item" data-id="${candidate.id}" data-offer="${offer.id}">
              <strong>${candidate.prenom} ${candidate.nom}</strong>
              <span>${offer.titre}</span>
              <span class="badge">${candidate.source}</span>
              <fluent-select appearance="outline" data-stage-select>
                ${stages
                  .map((s) => `<fluent-option value="${s}" ${s === stage ? 'selected' : ''}>${s}</fluent-option>`)
                  .join('')}
              </fluent-select>
            </div>
          `;
        })
        .join('');
      return `
        <div class="kanban-column" data-stage="${stage}">
          <div class="flex-between"><h3>${stage}</h3><span class="badge">${data.offers.reduce((acc, offer) => acc + (offer.pipeline[stage]?.length || 0), 0)}</span></div>
          ${cards || '<span>Aucun candidat</span>'}
        </div>
      `;
    })
    .join('');

  kanban.querySelectorAll('[data-stage-select]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const card = event.target.closest('.kanban-item');
      const candidateId = card.dataset.id;
      const offerId = card.dataset.offer;
      const newStage = event.target.value;
      setData((draft) => {
        const offer = draft.offers.find((o) => o.id === offerId);
        if (!offer) return;
        stages.forEach((stage) => {
          offer.pipeline[stage] = (offer.pipeline[stage] || []).filter((id) => id !== candidateId);
        });
        offer.pipeline[newStage] = offer.pipeline[newStage] || [];
        offer.pipeline[newStage].push(candidateId);
      });
      renderKanban(container, getData());
      showToast('Pipeline mis à jour');
    });
  });
};

export const recruitmentRoute = {
  id: 'recrutement',
  path: '#/recrutement',
  labelKey: 'nav.recrutement',
  render: (container) => {
    const data = getData();
    container.innerHTML = `
      <section class="data-card">
        <div class="section-header">
          <h2>${t('nav.recrutement')}</h2>
          <div class="toolbar">
            <fluent-button id="exportCandidates" appearance="accent">${t('actions.exportExcel')}</fluent-button>
            <fluent-button id="generateOffer" appearance="stealth">${t('actions.exportWord')}</fluent-button>
            <fluent-button id="openWord" appearance="stealth">Ouvrir dans Word</fluent-button>
          </div>
        </div>
        <div class="kanban"></div>
      </section>

      <section class="data-card">
        <div class="section-header">
          <h3>Ajouter un candidat / إضافة مترشح</h3>
        </div>
        <form id="candidateForm" class="grid" autocomplete="off">
          <label>Nom / الاسم
            <fluent-text-field name="nom" required></fluent-text-field>
          </label>
          <label>Prénom / الإسم الشخصي
            <fluent-text-field name="prenom" required></fluent-text-field>
          </label>
          <label>Email
            <fluent-text-field type="email" name="email" required></fluent-text-field>
          </label>
          <label>Téléphone / الهاتف
            <fluent-text-field name="telephone" required></fluent-text-field>
          </label>
          <label>CNIE / البطاقة الوطنية
            <fluent-text-field name="cnie" required></fluent-text-field>
          </label>
          <label>Offre
            <fluent-select name="offre" required>
              ${data.offers.map((offer) => `<fluent-option value="${offer.id}">${offer.titre}</fluent-option>`).join('')}
            </fluent-select>
          </label>
          <label>Source
            <fluent-select name="source">
              <fluent-option value="LinkedIn">LinkedIn</fluent-option>
              <fluent-option value="Rekrute">Rekrute</fluent-option>
              <fluent-option value="Cooptation">Cooptation</fluent-option>
              <fluent-option value="Salon">Salon</fluent-option>
              <fluent-option value="Autre">Autre</fluent-option>
            </fluent-select>
          </label>
          <label>Notes / ملاحظات
            <fluent-text-area name="notes"></fluent-text-area>
          </label>
          <label>CV
            <input type="file" name="cv" accept="application/pdf" />
          </label>
          <label class="flex-between" style="grid-column: 1 / -1">
            <span>Consentement loi 09-08 / موافقة القانون 09-08</span>
            <fluent-switch name="consentement"></fluent-switch>
          </label>
          <div class="toolbar" style="grid-column: 1 / -1; justify-content: flex-end;">
            <fluent-button type="reset">${t('actions.cancel')}</fluent-button>
            <fluent-button type="submit" appearance="accent">${t('actions.add')}</fluent-button>
          </div>
        </form>
      </section>

      <section class="data-card">
        <div class="section-header">
          <h3>Liste candidats</h3>
          <fluent-select id="candidateSelect">
            ${data.candidates.map((candidate) => `<fluent-option value="${candidate.id}">${candidate.prenom} ${candidate.nom}</fluent-option>`).join('')}
          </fluent-select>
        </div>
        <p>Sélectionnez un candidat pour générer une lettre d’offre personnalisée.</p>
      </section>
    `;

    renderKanban(container, data);

    container.querySelector('#exportCandidates').addEventListener('click', () => {
      const fresh = getData();
      exportXlsx({ sheetName: 'Candidats', data: fresh.candidates.map(candidateRow), fileName: 'candidats.xlsx' });
      showToast('Export Excel prêt');
    });

    container.querySelector('#generateOffer').addEventListener('click', async () => {
      const fresh = getData();
      const selectedId = container.querySelector('#candidateSelect').value;
      const candidate = fresh.candidates.find((c) => c.id === selectedId);
      if (!candidate) {
        showToast('Sélectionnez un candidat', 'warn');
        return;
      }
      const offer = fresh.offers.find((o) => o.id === candidate.offre);
      await exportDocxFromTemplate('Lettre offre', {
        societe: 'Atlas HR Suite',
        nom: candidate.nom,
        prenom: candidate.prenom,
        poste: offer?.titre || '',
        salaire_mensuel: offer?.salaire || 'Négociation',
        cnss: '',
        cnie_masque: maskCnie(candidate.cnie),
        date_debut: new Date().toLocaleDateString('fr-FR')
      }, `Lettre-offre-${candidate.prenom}-${candidate.nom}.docx`);
      showToast('Lettre générée');
    });

    container.querySelector('#openWord').addEventListener('click', () => {
      openWordOnlinePlaceholder('Lettre-offre.docx');
    });

    container.querySelector('#candidateForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const candidate = Object.fromEntries(formData.entries());
      candidate.id = `CAN-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      candidate.consentement = formData.get('consentement') === 'on';
      candidate.documents = [];
      const file = event.currentTarget.querySelector('input[name="cv"]').files[0];
      if (file) {
        candidate.documents.push({ type: 'CV', nom: file.name });
      }
      setData((draft) => {
        draft.candidates.push(candidate);
        const offer = draft.offers.find((o) => o.id === candidate.offre);
        if (offer) {
          offer.pipeline.Sourcing = offer.pipeline.Sourcing || [];
          offer.pipeline.Sourcing.push(candidate.id);
        }
      });
      event.currentTarget.reset();
      renderKanban(container, getData());
      showToast('Candidat ajouté');
    });
  }
};
