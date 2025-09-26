import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { useToast } from '../components/ui/ToastProvider';
import { downloadFile } from '../utils/download';
const STAGES = ['Sourcing', 'Entretien', 'Test', 'Offre', 'Embauche'];
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
        const map = {
            Sourcing: [],
            Entretien: [],
            Test: [],
            Offre: [],
            Embauche: []
        };
        data.offers.forEach((offer) => {
            const record = offer.pipeline;
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
    const handleStageChange = (offerId, candidateId, nextStage) => {
        setData((draft) => {
            const offer = draft.offers.find((item) => item.id === offerId);
            if (!offer)
                return;
            const record = offer.pipeline;
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
    const handleAddCandidate = (event) => {
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
                documents: []
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
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Recrutement" }), _jsx("div", { className: "toolbar", style: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }, children: _jsx("button", { type: "button", className: "btn-pill", onClick: handleExport, children: "Export JSON" }) })] }), _jsx("div", { className: "kanban", children: STAGES.map((stage) => {
                            const items = pipeline[stage] ?? [];
                            return (_jsxs("div", { className: "kanban-column", children: [_jsxs("div", { className: "section-header", children: [_jsx("h3", { children: stage }), _jsx("span", { className: "badge", children: items.length })] }), items.length === 0 && _jsx("span", { children: "Aucun candidat" }), items.map(({ offerId, candidateId }) => {
                                        const candidate = candidatesById.get(candidateId);
                                        if (!candidate)
                                            return null;
                                        return (_jsxs("div", { className: "kanban-item", children: [_jsxs("strong", { children: [candidate.prenom, " ", candidate.nom] }), _jsx("span", { children: data.offers.find((offer) => offer.id === offerId)?.titre }), _jsx("select", { value: stage, onChange: (event) => handleStageChange(offerId, candidateId, event.target.value), children: STAGES.map((option) => (_jsx("option", { value: option, children: option }, option))) })] }, candidate.id));
                                    })] }, stage));
                        }) })] }), _jsxs("section", { className: "data-card", children: [_jsx("div", { className: "section-header", children: _jsx("h3", { children: "Ajouter un candidat" }) }), _jsxs("form", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }, onSubmit: handleAddCandidate, children: [_jsxs("label", { children: ["Nom", _jsx("input", { required: true, value: formValues.nom, onChange: (event) => setFormValues((prev) => ({ ...prev, nom: event.target.value })) })] }), _jsxs("label", { children: ["Pr\u00E9nom", _jsx("input", { required: true, value: formValues.prenom, onChange: (event) => setFormValues((prev) => ({ ...prev, prenom: event.target.value })) })] }), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", required: true, value: formValues.email, onChange: (event) => setFormValues((prev) => ({ ...prev, email: event.target.value })) })] }), _jsxs("label", { children: ["T\u00E9l\u00E9phone", _jsx("input", { required: true, value: formValues.telephone, onChange: (event) => setFormValues((prev) => ({ ...prev, telephone: event.target.value })) })] }), _jsxs("label", { children: ["CNIE", _jsx("input", { required: true, value: formValues.cnie, onChange: (event) => setFormValues((prev) => ({ ...prev, cnie: event.target.value })) })] }), _jsxs("label", { children: ["Offre", _jsx("select", { required: true, value: formValues.offre, onChange: (event) => setFormValues((prev) => ({ ...prev, offre: event.target.value })), children: data.offers.map((offer) => (_jsx("option", { value: offer.id, children: offer.titre }, offer.id))) })] }), _jsxs("label", { children: ["Source", _jsxs("select", { value: formValues.source, onChange: (event) => setFormValues((prev) => ({ ...prev, source: event.target.value })), children: [_jsx("option", { value: "LinkedIn", children: "LinkedIn" }), _jsx("option", { value: "Rekrute", children: "Rekrute" }), _jsx("option", { value: "Cooptation", children: "Cooptation" }), _jsx("option", { value: "Salon", children: "Salon" }), _jsx("option", { value: "Autre", children: "Autre" })] })] }), _jsxs("label", { style: { gridColumn: '1 / -1' }, children: ["Notes", _jsx("textarea", { value: formValues.notes, onChange: (event) => setFormValues((prev) => ({ ...prev, notes: event.target.value })) })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsx("input", { type: "checkbox", checked: formValues.consentement, onChange: (event) => setFormValues((prev) => ({ ...prev, consentement: event.target.checked })) }), _jsx("span", { children: "Consentement loi 09-08" })] }), _jsxs("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }, children: [_jsx("button", { type: "reset", onClick: () => setFormValues((prev) => ({
                                            ...prev,
                                            nom: '',
                                            prenom: '',
                                            email: '',
                                            telephone: '',
                                            cnie: '',
                                            notes: '',
                                            consentement: false
                                        })), children: "Annuler" }), _jsx("button", { type: "submit", className: "btn-pill", children: "Ajouter" })] })] })] }), _jsxs("section", { className: "data-card", children: [_jsxs("div", { className: "section-header", children: [_jsx("h3", { children: "Liste candidats" }), _jsx("select", { value: selectedOfferId, onChange: (event) => setSelectedOfferId(event.target.value), children: data.offers.map((offer) => (_jsx("option", { value: offer.id, children: offer.titre }, offer.id))) })] }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "fluent-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Nom" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "T\u00E9l\u00E9phone" }), _jsx("th", { children: "Source" })] }) }), _jsx("tbody", { children: data.candidates
                                        .filter((candidate) => candidate.offre === selectedOfferId)
                                        .map((candidate) => (_jsxs("tr", { children: [_jsx("td", { children: candidate.id }), _jsxs("td", { children: [candidate.prenom, " ", candidate.nom] }), _jsx("td", { children: candidate.email }), _jsx("td", { children: candidate.telephone }), _jsx("td", { children: candidate.source })] }, candidate.id))) })] }) })] })] }));
};
export default RecruitmentPage;
