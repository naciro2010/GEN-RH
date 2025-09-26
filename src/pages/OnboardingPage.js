import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
const OnboardingPage = () => {
    const { data, setData } = useAtlasStore((state) => ({ data: state.data, setData: state.setData }));
    const { notify } = useToast();
    const handleToggle = (entryId, team, index, checked) => {
        setData((draft) => {
            const entry = draft.onboarding.find((item) => item.id === entryId);
            if (!entry)
                return;
            const tasks = entry.checklist[team];
            if (tasks && tasks[index]) {
                tasks[index].done = checked;
            }
        });
        notify('Checklist mise à jour', 'success');
    };
    return (_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Onboarding" }), _jsxs("span", { className: "badge", children: [data.onboarding.length, " dossiers"] })] }), _jsx("div", { className: "grid", style: { gap: '1.4rem' }, children: data.onboarding.map((entry) => {
                    const candidate = data.candidates.find((c) => c.id === entry.candidatId);
                    const checklist = entry.checklist;
                    return (_jsxs("div", { className: "data-card", style: { padding: '1.4rem' }, children: [_jsx("div", { className: "section-header", children: _jsxs("div", { children: [_jsx("h3", { children: entry.poste }), _jsx("span", { className: "badge", children: candidate ? `${candidate.prenom} ${candidate.nom}` : 'Candidat' })] }) }), _jsx("div", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }, children: Object.entries(checklist).map(([team, tasks]) => (_jsxs("div", { children: [_jsx("strong", { children: team }), _jsx("ul", { className: "timeline", children: tasks.map((task, index) => (_jsx("li", { children: _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsx("input", { type: "checkbox", checked: task.done, onChange: (event) => handleToggle(entry.id, team, index, event.target.checked) }), _jsxs("span", { children: [task.label, " \u2013 ", task.due] })] }) }, task.label))) })] }, team))) })] }, entry.id));
                }) })] }));
};
export default OnboardingPage;
