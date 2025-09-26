import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';

const OnboardingPage = () => {
  const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
  const { notify } = useToast();

  const handleToggle = (entryId: string, team: string, index: number, checked: boolean) => {
    setData((draft) => {
      const entry = draft.onboarding.find((item) => item.id === entryId);
      if (!entry) return;
      const tasks = (entry.checklist as Record<string, { label: string; due: string; done: boolean }[]>)[team];
      if (tasks && tasks[index]) {
        tasks[index].done = checked;
      }
    });
    notify('Checklist mise à jour', 'success');
  };

  return (
    <section className="data-card">
      <div className="section-header">
        <h2>Onboarding</h2>
        <span className="badge">{data.onboarding.length} dossiers</span>
      </div>
      <div className="grid" style={{ gap: '1.4rem' }}>
        {data.onboarding.map((entry) => {
          const candidate = data.candidates.find((c) => c.id === entry.candidatId);
          const checklist = entry.checklist as Record<string, { label: string; due: string; done: boolean }[]>;
          return (
            <div className="data-card" key={entry.id} style={{ padding: '1.4rem' }}>
              <div className="section-header">
                <div>
                  <h3>{entry.poste}</h3>
                  <span className="badge">{candidate ? `${candidate.prenom} ${candidate.nom}` : 'Candidat'}</span>
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {Object.entries(checklist).map(([team, tasks]) => (
                  <div key={team}>
                    <strong>{team}</strong>
                    <ul className="timeline">
                      {tasks.map((task, index) => (
                        <li key={task.label}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={(event) => handleToggle(entry.id, team, index, event.target.checked)}
                            />
                            <span>
                              {task.label} – {task.due}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OnboardingPage;
