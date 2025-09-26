import { FormEvent, useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
import { downloadFile } from '../utils/download';

const STAGES = ['Sourcing', 'Entretien', 'Test', 'Offre', 'Embauche'] as const;
type Stage = (typeof STAGES)[number];
type CandidateDocument = { type: string; nom: string };

const RecruitmentPage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();
  const [selectedOfferId, setSelectedOfferId] = useState(data.offers[0]?.id ?? '');
  const [formValues, setFormValues] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cnie: '',
    offre: data.offers[0]?.id ?? '',
    source: 'LinkedIn',
    notes: '',
    consentement: false
  });

  const pipeline = useMemo(() => {
    const map: Record<Stage, { offerId: string; candidateId: string }[]> = {
      Sourcing: [],
      Entretien: [],
      Test: [],
      Offre: [],
      Embauche: []
    };
    data.offers.forEach((offer) => {
      const record = offer.pipeline as Record<string, string[]>;
      STAGES.forEach((stage) => {
        (record[stage] || []).forEach((candidateId) => {
          map[stage].push({ offerId: offer.id, candidateId });
        });
      });
    });
    return map;
  }, [data.offers]);

  const candidatesById = useMemo(() => {
    const map = new Map(data.candidates.map((candidate) => [candidate.id, candidate]));
    return map;
  }, [data.candidates]);

  const handleStageChange = (offerId: string, candidateId: string, nextStage: Stage) => {
    setData((draft) => {
      const offer = draft.offers.find((item) => item.id === offerId);
      if (!offer) return;
      const record = offer.pipeline as Record<string, string[]>;
      STAGES.forEach((stage) => {
        record[stage] = (record[stage] || []).filter((id) => id !== candidateId);
      });
      record[nextStage] = record[nextStage] || [];
      record[nextStage].push(candidateId);
    });
    notify('Pipeline mis à jour');
  };

  const handleExport = () => {
    const rows = data.candidates.map((candidate) => ({
      ID: candidate.id,
      Nom: `${candidate.prenom} ${candidate.nom}`,
      Offre: candidate.offre,
      Email: candidate.email,
      Telephone: candidate.telephone,
      Source: candidate.source,
      Consentement: candidate.consentement ? 'Oui' : 'Non'
    }));
    downloadFile(JSON.stringify(rows, null, 2), 'candidats.json', 'application/json');
    notify('Export JSON généré');
  };

  const generateId = () => `CAN-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const handleAddCandidate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData((draft) => {
      const candidate = {
        id: generateId(),
        offre: formValues.offre,
        prenom: formValues.prenom,
        nom: formValues.nom,
        email: formValues.email,
        telephone: formValues.telephone,
        cnie: formValues.cnie,
        source: formValues.source,
        notes: formValues.notes,
        consentement: formValues.consentement,
        documents: [] as CandidateDocument[]
      };
      draft.candidates.push(candidate);
      const offer = draft.offers.find((item) => item.id === candidate.offre);
      if (offer) {
        offer.pipeline.Sourcing = offer.pipeline.Sourcing || [];
        offer.pipeline.Sourcing.push(candidate.id);
      }
    });
    setFormValues({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      cnie: '',
      offre: formValues.offre,
      source: 'LinkedIn',
      notes: '',
      consentement: false
    });
    notify('Candidat ajouté');
  };

  return (
    <>
      <section className="data-card">
        <div className="section-header">
          <h2>Recrutement</h2>
          <div className="toolbar" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn-pill" onClick={handleExport}>
              Export JSON
            </button>
          </div>
        </div>
        <div className="kanban">
          {STAGES.map((stage) => {
            const items = pipeline[stage] ?? [];
            return (
              <div className="kanban-column" key={stage}>
                <div className="section-header">
                  <h3>{stage}</h3>
                  <span className="badge">{items.length}</span>
                </div>
                {items.length === 0 && <span>Aucun candidat</span>}
                {items.map(({ offerId, candidateId }) => {
                  const candidate = candidatesById.get(candidateId);
                  if (!candidate) return null;
                  return (
                    <div className="kanban-item" key={candidate.id}>
                      <strong>
                        {candidate.prenom} {candidate.nom}
                      </strong>
                      <span>{data.offers.find((offer) => offer.id === offerId)?.titre}</span>
                      <select
                        value={stage}
                        onChange={(event) => handleStageChange(offerId, candidateId, event.target.value as Stage)}
                      >
                        {STAGES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Ajouter un candidat</h3>
        </div>
        <form
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          onSubmit={handleAddCandidate}
        >
          <label>
            Nom
            <input
              required
              value={formValues.nom}
              onChange={(event) => setFormValues((prev) => ({ ...prev, nom: event.target.value }))}
            />
          </label>
          <label>
            Prénom
            <input
              required
              value={formValues.prenom}
              onChange={(event) => setFormValues((prev) => ({ ...prev, prenom: event.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={formValues.email}
              onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <label>
            Téléphone
            <input
              required
              value={formValues.telephone}
              onChange={(event) => setFormValues((prev) => ({ ...prev, telephone: event.target.value }))}
            />
          </label>
          <label>
            CNIE
            <input
              required
              value={formValues.cnie}
              onChange={(event) => setFormValues((prev) => ({ ...prev, cnie: event.target.value }))}
            />
          </label>
          <label>
            Offre
            <select
              required
              value={formValues.offre}
              onChange={(event) => setFormValues((prev) => ({ ...prev, offre: event.target.value }))}
            >
              {data.offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.titre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source
            <select
              value={formValues.source}
              onChange={(event) => setFormValues((prev) => ({ ...prev, source: event.target.value }))}
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Rekrute">Rekrute</option>
              <option value="Cooptation">Cooptation</option>
              <option value="Salon">Salon</option>
              <option value="Autre">Autre</option>
            </select>
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Notes
            <textarea
              value={formValues.notes}
              onChange={(event) => setFormValues((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              checked={formValues.consentement}
              onChange={(event) => setFormValues((prev) => ({ ...prev, consentement: event.target.checked }))}
            />
            <span>Consentement loi 09-08</span>
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button
              type="reset"
              onClick={() =>
                setFormValues((prev) => ({
                  ...prev,
                  nom: '',
                  prenom: '',
                  email: '',
                  telephone: '',
                  cnie: '',
                  notes: '',
                  consentement: false
                }))
              }
            >
              Annuler
            </button>
            <button type="submit" className="btn-pill">
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <section className="data-card">
        <div className="section-header">
          <h3>Liste candidats</h3>
          <select value={selectedOfferId} onChange={(event) => setSelectedOfferId(event.target.value)}>
            {data.offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.titre}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="fluent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {data.candidates
                .filter((candidate) => candidate.offre === selectedOfferId)
                .map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.id}</td>
                    <td>
                      {candidate.prenom} {candidate.nom}
                    </td>
                    <td>{candidate.email}</td>
                    <td>{candidate.telephone}</td>
                    <td>{candidate.source}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default RecruitmentPage;
