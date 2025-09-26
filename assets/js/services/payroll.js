import { formatMAD } from './utils.js';

const monthsBetween = (start) => {
  if (!start) return 0;
  const startDate = new Date(start);
  const now = new Date();
  return (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
};

export const calcPrimeAnciennete = (base, annees, grille) => {
  if (!Array.isArray(grille)) return 0;
  const applicable = [...grille].sort((a, b) => b.min_annees - a.min_annees).find((row) => annees >= row.min_annees);
  if (!applicable) return 0;
  return (base * (applicable.taux / 100));
};

export const calcHeuresSup = (hNorm = 0, h25 = 0, h50 = 0, h100 = 0, tauxHoraire = 0, config = {}) => {
  const { jour_pct = 25, nuit_pct = 50, repos_pct = 50, jourHebdo_pct = 100 } = config;
  const base = (hNorm || 0) * tauxHoraire;
  const bonus25 = (h25 || 0) * tauxHoraire * (jour_pct / 100);
  const bonus50 = (h50 || 0) * tauxHoraire * (nuit_pct / 100);
  const bonus100 = (h100 || 0) * tauxHoraire * (jourHebdo_pct / 100);
  return {
    montant: base + bonus25 + bonus50 + bonus100,
    detail: { base, bonus25, bonus50, bonus100 }
  };
};

export const calcCNSS = (brut, params) => {
  const { cnss } = params;
  const plafond = cnss.plafond_prestationsSociales_MAD;
  const assiette = Math.min(brut, plafond);
  const prestSocSalarie = assiette * (cnss.prestationsSociales_pct_salarie / 100);
  const prestSocEmployeur = assiette * (cnss.prestationsSociales_pct_employeur / 100);
  const allocFamiliales = brut * (cnss.allocationsFamiliales_pct_employeur / 100);
  const amoSalarie = brut * (cnss.amo_pct_salarie / 100);
  const amoEmployeur = brut * (cnss.amo_pct_employeur / 100);
  const tfpEmployeur = brut * (cnss.tfp_pct_employeur / 100);
  return {
    allocationsFamiliales: allocFamiliales,
    prestSocSalarie,
    prestSocEmployeur,
    amoSalarie,
    amoEmployeur,
    tfpEmployeur,
    totalRetenuesSalarie: prestSocSalarie + amoSalarie,
    totalChargesEmployeur: allocFamiliales + prestSocEmployeur + amoEmployeur + tfpEmployeur
  };
};

export const calcBaseImposable = (brut, retenuesCNSS, abattements = 0) => {
  const base = brut - (retenuesCNSS ?? 0) - (abattements ?? 0);
  return Math.max(base, 0);
};

export const calcIR = (baseIR, bareme) => {
  let restant = baseIR;
  let impots = 0;
  let previousMax = 0;
  for (const tranche of bareme) {
    const trancheMax = tranche.max ?? Infinity;
    const trancheMontant = Math.min(restant, trancheMax - previousMax);
    if (trancheMontant < 0) break;
    impots += trancheMontant * (tranche.taux / 100) - (tranche.deduction || 0);
    restant -= trancheMontant;
    previousMax = trancheMax;
    if (restant <= 0) break;
  }
  return Math.max(impots, 0);
};

export const calcNetAPayer = (brut, totalRetenues, ir) => {
  return brut - (totalRetenues ?? 0) - (ir ?? 0);
};

export const simulatePayroll = (employees, variables, params) => {
  const results = [];
  let masseSalariale = 0;
  employees.forEach((employee) => {
    const varEmp = variables[employee.id] || { heuresSup: {}, primes: 0, absences: 0 };
    const base = employee.salaireBase || 0;
    const annees = Math.floor(monthsBetween(employee.dateEmbauche) / 12);
    const primeAnciennete = calcPrimeAnciennete(base, annees, params.prime_anciennete);
    const tauxHoraire = base / 173.33;
    const overtime = calcHeuresSup(
      0,
      varEmp.heuresSup?.jour,
      (varEmp.heuresSup?.nuit || 0) + (varEmp.heuresSup?.repos || 0),
      varEmp.heuresSup?.jourHebdo,
      tauxHoraire,
      params.overtime
    );
    const brut = base + (varEmp.primes || 0) + (varEmp.autres || 0) + primeAnciennete + overtime.montant;
    const cnss = calcCNSS(brut, params);
    const baseImposable = calcBaseImposable(brut, cnss.totalRetenuesSalarie, 0);
    const ir = calcIR(baseImposable, params.ir_bareme_2025);
    const net = calcNetAPayer(brut, cnss.totalRetenuesSalarie, ir);
    masseSalariale += net + cnss.totalChargesEmployeur + cnss.totalRetenuesSalarie;
    results.push({
      employeeId: employee.id,
      nom: `${employee.prenom} ${employee.nom}`,
      base,
      primeAnciennete,
      heuresSup: overtime.montant,
      primes: varEmp.primes || 0,
      brut,
      cnss,
      baseImposable,
      ir,
      net,
      netFormat: formatMAD(net)
    });
  });
  return { masseSalariale, results };
};
