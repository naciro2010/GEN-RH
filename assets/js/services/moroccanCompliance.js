/**
 * Service de Conformité Marocaine
 * Gestion des formats officiels CNSS, IR, certificats et bulletins
 */

import { formatDate, formatMAD } from './utils.js';

/**
 * Génère un fichier Damancom pour la CNSS (format texte tabulé)
 * Format officiel pour la télétransmission CNSS
 */
export const generateDamancomFile = (declaration, employees, companyInfo) => {
  const lines = [];
  const periode = declaration.periode; // Format: "2025-01"
  const [year, month] = periode.split('-');

  // En-tête Damancom
  lines.push([
    'ENREG',
    'MATRICULE_CNSS',
    'NUMERO_IMMATRICULATION',
    'NOM',
    'PRENOM',
    'SALAIRE_BRUT',
    'NOMBRE_JOURS',
    'SALAIRE_SOUMIS',
    'COTISATION_SALARIE',
    'COTISATION_PATRONALE',
    'DATE_DEBUT',
    'DATE_FIN'
  ].join('\t'));

  // Lignes des employés
  declaration.details?.forEach((detail, index) => {
    const employee = employees.find(e => e.id === detail.employeeId);
    if (!employee) return;

    const salaireBrut = detail.salaireBrut || 0;
    const salaireSoumis = Math.min(salaireBrut, 6000); // Plafond CNSS
    const cotisationSalarie = salaireSoumis * 0.0674; // 4.48% + 2.26%
    const cotisationPatronale = salaireBrut * 0.2109; // 6.4% + 8.98% + 4.11% + 1.6%

    lines.push([
      `E${String(index + 1).padStart(6, '0')}`, // ENREG
      employee.matriculeCNSS || '',
      employee.numeroImmatriculation || employee.cnss || '',
      employee.nom.toUpperCase(),
      employee.prenom.toUpperCase(),
      salaireBrut.toFixed(2),
      detail.nombreJours || '26',
      salaireSoumis.toFixed(2),
      cotisationSalarie.toFixed(2),
      cotisationPatronale.toFixed(2),
      `${year}-${month}-01`,
      `${year}-${month}-${new Date(year, month, 0).getDate()}`
    ].join('\t'));
  });

  // Ligne récapitulative
  const totaux = declaration.details?.reduce((acc, detail) => {
    const salaireBrut = detail.salaireBrut || 0;
    const salaireSoumis = Math.min(salaireBrut, 6000);
    acc.brut += salaireBrut;
    acc.soumis += salaireSoumis;
    acc.salarie += salaireSoumis * 0.0674;
    acc.patronale += salaireBrut * 0.2109;
    return acc;
  }, { brut: 0, soumis: 0, salarie: 0, patronale: 0 }) || {};

  lines.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    totaux.brut.toFixed(2),
    '',
    totaux.soumis.toFixed(2),
    totaux.salarie.toFixed(2),
    totaux.patronale.toFixed(2),
    '',
    ''
  ].join('\t'));

  return {
    filename: `CNSS_${companyInfo.ice}_${periode}.txt`,
    content: lines.join('\n'),
    format: 'text/plain',
    encoding: 'UTF-8'
  };
};

/**
 * Génère un fichier XML SIMPL-IR pour la DGI
 * Format officiel pour la télédéclaration IR
 */
export const generateSIMPLIRXML = (declaration, employees, companyInfo) => {
  const periode = declaration.periode;
  const [year, month] = periode.split('-');
  const numeroDeclaration = declaration.numeroDeclaration || `IR${year}${month}${Date.now()}`;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<DeclarationIR xmlns="http://www.tax.gov.ma/simpl-ir" version="2.0">\n';

  // En-tête de la déclaration
  xml += '  <EnTete>\n';
  xml += `    <Exercice>${year}</Exercice>\n`;
  xml += `    <Periode>${month}</Periode>\n`;
  xml += `    <TypeDeclaration>MENSUELLE</TypeDeclaration>\n`;
  xml += `    <NumeroDeclaration>${numeroDeclaration}</NumeroDeclaration>\n`;
  xml += `    <DateDepot>${formatDate(new Date())}</DateDepot>\n`;
  xml += '  </EnTete>\n';

  // Informations de l'entreprise
  xml += '  <Declarant>\n';
  xml += `    <ICE>${companyInfo.ice || ''}</ICE>\n`;
  xml += `    <IF>${companyInfo.identifiantFiscal || ''}</IF>\n`;
  xml += `    <RaisonSociale>${escapeXML(companyInfo.nom || '')}</RaisonSociale>\n`;
  xml += `    <Adresse>${escapeXML(companyInfo.adresse || '')}</Adresse>\n`;
  xml += `    <Ville>${escapeXML(companyInfo.ville || '')}</Ville>\n`;
  xml += '  </Declarant>\n';

  // Détail des employés
  xml += '  <Salaries>\n';
  declaration.details?.forEach((detail, index) => {
    const employee = employees.find(e => e.id === detail.employeeId);
    if (!employee) return;

    xml += '    <Salarie>\n';
    xml += `      <Ordre>${index + 1}</Ordre>\n`;
    xml += `      <CIN>${employee.cnie || ''}</CIN>\n`;
    xml += `      <Nom>${escapeXML(employee.nom)}</Nom>\n`;
    xml += `      <Prenom>${escapeXML(employee.prenom)}</Prenom>\n`;
    xml += `      <SalaireBrut>${(detail.salaireBrut || 0).toFixed(2)}</SalaireBrut>\n`;
    xml += `      <CotisationsCNSS>${(detail.cotisationsCNSS || 0).toFixed(2)}</CotisationsCNSS>\n`;
    xml += `      <AutresDeductions>${(detail.autresDeductions || 0).toFixed(2)}</AutresDeductions>\n`;
    xml += `      <SalaireNet>${(detail.salaireNet || 0).toFixed(2)}</SalaireNet>\n`;
    xml += `      <SalaireImposable>${(detail.salaireImposable || 0).toFixed(2)}</SalaireImposable>\n`;
    xml += `      <MontantIR>${(detail.montantIR || 0).toFixed(2)}</MontantIR>\n`;
    xml += `      <NombreJours>${detail.nombreJours || 26}</NombreJours>\n`;
    xml += '    </Salarie>\n';
  });
  xml += '  </Salaries>\n';

  // Récapitulatif
  const totaux = declaration.details?.reduce((acc, detail) => {
    acc.brut += detail.salaireBrut || 0;
    acc.imposable += detail.salaireImposable || 0;
    acc.ir += detail.montantIR || 0;
    return acc;
  }, { brut: 0, imposable: 0, ir: 0 }) || {};

  xml += '  <Recapitulatif>\n';
  xml += `    <NombreEmployes>${declaration.nbEmployes || 0}</NombreEmployes>\n`;
  xml += `    <MasseSalarialeBrute>${totaux.brut.toFixed(2)}</MasseSalarialeBrute>\n`;
  xml += `    <MasseSalarialeImposable>${totaux.imposable.toFixed(2)}</MasseSalarialeImposable>\n`;
  xml += `    <MontantIRTotal>${totaux.ir.toFixed(2)}</MontantIRTotal>\n`;
  xml += '  </Recapitulatif>\n';

  xml += '</DeclarationIR>\n';

  return {
    filename: `SIMPL_IR_${companyInfo.ice}_${periode}.xml`,
    content: xml,
    format: 'application/xml',
    encoding: 'UTF-8'
  };
};

/**
 * Génère un bulletin de paie officiel conforme à la législation marocaine
 */
export const generateBulletinPaie = (employee, payrollData, companyInfo, periode) => {
  const [year, month] = periode.split('-');
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const monthName = monthNames[parseInt(month) - 1];

  const bulletin = {
    // En-tête entreprise
    entreprise: {
      nom: companyInfo.nom,
      adresse: companyInfo.adresse,
      ville: companyInfo.ville,
      ice: companyInfo.ice,
      cnss: companyInfo.cnss,
      patente: companyInfo.patente,
      rc: companyInfo.rc,
      telephone: companyInfo.telephone
    },

    // Période
    periode: `${monthName} ${year}`,
    periodeCode: periode,

    // Informations salarié
    salarie: {
      matricule: employee.matricule,
      nom: `${employee.prenom} ${employee.nom}`,
      poste: employee.poste,
      cnss: employee.cnss,
      cnie: employee.cnie,
      dateEmbauche: formatDate(employee.dateEmbauche),
      departement: employee.departement,
      service: employee.service
    },

    // Éléments de rémunération
    elements: {
      salaireBrut: payrollData.base || 0,
      primeAnciennete: payrollData.primeAnciennete || 0,
      heuresSupplementaires: payrollData.heuresSup || 0,
      primes: payrollData.primes || 0,
      autresAvantages: payrollData.autres || 0,
      totalBrut: payrollData.brut || 0
    },

    // Cotisations sociales
    cotisations: {
      cnss: {
        prestationsSocialesSalarie: payrollData.cnss?.prestSocSalarie || 0,
        amoSalarie: payrollData.cnss?.amoSalarie || 0,
        totalSalarie: payrollData.cnss?.totalRetenuesSalarie || 0,
        prestationsSocialesPatron: payrollData.cnss?.prestSocEmployeur || 0,
        allocationsFamiliales: payrollData.cnss?.allocationsFamiliales || 0,
        amoPatron: payrollData.cnss?.amoEmployeur || 0,
        tfp: payrollData.cnss?.tfpEmployeur || 0,
        totalPatron: payrollData.cnss?.totalChargesEmployeur || 0
      },
      cimr: payrollData.cimr || 0,
      mutuelle: payrollData.mutuelle || 0
    },

    // Impôts
    impots: {
      salaireImposable: payrollData.baseImposable || 0,
      ir: payrollData.ir || 0
    },

    // Net à payer
    netAPayer: payrollData.net || 0,
    netAPayerLettre: numberToWords(payrollData.net || 0),

    // Informations de paiement
    paiement: {
      mode: employee.modePaiement || 'Virement',
      banque: employee.banque,
      rib: employee.rib,
      datePaiement: formatDate(new Date(year, month, 0)) // Dernier jour du mois
    },

    // Mentions légales
    mentionsLegales: [
      'Ce bulletin de paie est établi conformément aux dispositions du Code du Travail marocain',
      'Les cotisations CNSS sont calculées selon les taux en vigueur',
      'L\'impôt sur le revenu est calculé selon le barème IR 2025',
      'Conserver ce document sans limitation de durée'
    ]
  };

  return bulletin;
};

/**
 * Génère une attestation de travail officielle
 */
export const generateAttestationTravail = (employee, companyInfo, motif = 'À qui de droit') => {
  const today = new Date();
  const dateEmbauche = new Date(employee.dateEmbauche);
  const anciennete = Math.floor((today - dateEmbauche) / (365.25 * 24 * 60 * 60 * 1000));
  const moisAnciennete = Math.floor(((today - dateEmbauche) / (30.44 * 24 * 60 * 60 * 1000)) % 12);

  return {
    type: 'ATTESTATION_TRAVAIL',
    numero: `AT-${employee.matricule}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`,
    dateEmission: formatDate(today),

    entreprise: {
      nom: companyInfo.nom,
      adresse: companyInfo.adresse,
      ville: companyInfo.ville,
      ice: companyInfo.ice,
      rc: companyInfo.rc,
      telephone: companyInfo.telephone
    },

    salarie: {
      nom: `${employee.prenom} ${employee.nom}`,
      cnie: employee.cnie,
      poste: employee.poste,
      dateEmbauche: formatDate(employee.dateEmbauche),
      anciennete: `${anciennete} an${anciennete > 1 ? 's' : ''} et ${moisAnciennete} mois`,
      salaire: formatMAD(employee.salaireBase),
      typeContrat: employee.typeContrat || 'CDI',
      cnss: employee.cnss
    },

    motif: motif,

    texte: `Nous soussignés ${companyInfo.nom}, ICE: ${companyInfo.ice}, attestons par la présente que ${employee.prenom} ${employee.nom}, ` +
           `titulaire de la CNIE n° ${employee.cnie}, exerce au sein de notre société les fonctions de ${employee.poste} ` +
           `depuis le ${formatDate(employee.dateEmbauche)}.\n\n` +
           `L'intéressé(e) perçoit un salaire mensuel brut de ${formatMAD(employee.salaireBase)}.\n\n` +
           `Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.\n\n` +
           `Fait à ${companyInfo.ville}, le ${formatDate(today)}`,

    signature: {
      lieu: companyInfo.ville,
      date: formatDate(today),
      signataireNom: companyInfo.directeur || 'Le Directeur Général',
      signatairePoste: 'Direction Générale',
      cachet: true
    }
  };
};

/**
 * Génère un certificat de salaire
 */
export const generateCertificatSalaire = (employee, payrollHistory, companyInfo, nbMois = 3) => {
  const today = new Date();
  const derniersMois = payrollHistory.slice(0, nbMois);
  const moyenneSalaire = derniersMois.reduce((sum, p) => sum + (p.net || 0), 0) / nbMois;

  return {
    type: 'CERTIFICAT_SALAIRE',
    numero: `CS-${employee.matricule}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`,
    dateEmission: formatDate(today),

    entreprise: {
      nom: companyInfo.nom,
      adresse: companyInfo.adresse,
      ice: companyInfo.ice,
      cnss: companyInfo.cnss
    },

    salarie: {
      nom: `${employee.prenom} ${employee.nom}`,
      cnie: employee.cnie,
      cnss: employee.cnss,
      poste: employee.poste,
      matricule: employee.matricule
    },

    periode: {
      nbMois: nbMois,
      moisInclu: derniersMois.map(p => p.periode)
    },

    salaires: derniersMois.map(p => ({
      periode: p.periode,
      brut: p.brut || 0,
      net: p.net || 0
    })),

    moyennes: {
      salaireBrutMoyen: derniersMois.reduce((sum, p) => sum + (p.brut || 0), 0) / nbMois,
      salaireNetMoyen: moyenneSalaire,
      salaireNetMoyenLettre: numberToWords(moyenneSalaire)
    },

    texte: `Nous soussignés ${companyInfo.nom} certifions que ${employee.prenom} ${employee.nom}, ` +
           `matricule ${employee.matricule}, CNSS n° ${employee.cnss}, exerçant les fonctions de ${employee.poste}, ` +
           `a perçu au cours des ${nbMois} derniers mois un salaire net moyen de ${formatMAD(moyenneSalaire)}.\n\n` +
           `Certificat établi à la demande de l'intéressé(e) pour servir et valoir ce que de droit.`,

    signature: {
      lieu: companyInfo.ville,
      date: formatDate(today),
      signataireNom: companyInfo.directeur || 'Le Directeur Général',
      cachet: true
    }
  };
};

/**
 * Génère un certificat de travail (fin de contrat)
 */
export const generateCertificatTravail = (employee, companyInfo, dateSortie, motifSortie) => {
  const dateEmbauche = new Date(employee.dateEmbauche);
  const dateFin = new Date(dateSortie);
  const dureeJours = Math.floor((dateFin - dateEmbauche) / (24 * 60 * 60 * 1000));
  const dureeAnnees = Math.floor(dureeJours / 365.25);
  const dureeMois = Math.floor((dureeJours % 365.25) / 30.44);

  return {
    type: 'CERTIFICAT_TRAVAIL',
    numero: `CT-${employee.matricule}-${dateFin.getFullYear()}`,
    dateEmission: formatDate(dateFin),

    entreprise: {
      nom: companyInfo.nom,
      adresse: companyInfo.adresse,
      ville: companyInfo.ville,
      ice: companyInfo.ice,
      rc: companyInfo.rc,
      cnss: companyInfo.cnss
    },

    salarie: {
      nom: `${employee.prenom} ${employee.nom}`,
      cnie: employee.cnie,
      cnss: employee.cnss,
      poste: employee.poste,
      dateEmbauche: formatDate(employee.dateEmbauche),
      dateSortie: formatDate(dateSortie),
      duree: `${dureeAnnees} an${dureeAnnees > 1 ? 's' : ''} et ${dureeMois} mois`
    },

    motifSortie: motifSortie,

    texte: `Nous soussignés ${companyInfo.nom}, certifions avoir employé ${employee.prenom} ${employee.nom}, ` +
           `né(e) le ${formatDate(employee.dateNaissance)}, CNIE n° ${employee.cnie}, ` +
           `en qualité de ${employee.poste}, du ${formatDate(employee.dateEmbauche)} au ${formatDate(dateSortie)}, ` +
           `soit une durée de ${dureeAnnees} an${dureeAnnees > 1 ? 's' : ''} et ${dureeMois} mois.\n\n` +
           `L'intéressé(e) quitte notre entreprise suite à ${motifSortie.toLowerCase()}.\n\n` +
           `Le présent certificat lui est délivré conformément aux dispositions de l'article 72 du Code du Travail ` +
           `pour servir et valoir ce que de droit.`,

    mentionsLegales: [
      'Certificat établi en application de l\'article 72 du Code du Travail',
      'L\'employé(e) est libre de tout engagement envers notre société'
    ],

    signature: {
      lieu: companyInfo.ville,
      date: formatDate(dateFin),
      signataireNom: companyInfo.directeur || 'Le Directeur Général',
      cachet: true
    }
  };
};

/**
 * Génère un solde de tout compte
 */
export const generateSoldeToutCompte = (employee, companyInfo, dateSortie, elementsFinaux) => {
  const totalBrut = Object.values(elementsFinaux.elements || {}).reduce((sum, val) => sum + val, 0);
  const totalRetenues = Object.values(elementsFinaux.retenues || {}).reduce((sum, val) => sum + val, 0);
  const netAPayer = totalBrut - totalRetenues;

  return {
    type: 'SOLDE_TOUT_COMPTE',
    numero: `STC-${employee.matricule}-${new Date(dateSortie).getFullYear()}`,
    dateEmission: formatDate(dateSortie),

    entreprise: {
      nom: companyInfo.nom,
      adresse: companyInfo.adresse,
      ice: companyInfo.ice,
      cnss: companyInfo.cnss
    },

    salarie: {
      nom: `${employee.prenom} ${employee.nom}`,
      matricule: employee.matricule,
      cnss: employee.cnss,
      poste: employee.poste,
      dateEmbauche: formatDate(employee.dateEmbauche),
      dateSortie: formatDate(dateSortie)
    },

    elements: elementsFinaux.elements || {
      salaireProrata: 0,
      congesNonPris: 0,
      primeAnciennete: 0,
      indemnitePreavis: 0,
      indemniteLicenciement: 0,
      autresIndemnites: 0
    },

    retenues: elementsFinaux.retenues || {
      cnss: 0,
      amo: 0,
      ir: 0,
      avances: 0,
      pretsSociaux: 0,
      autresRetenues: 0
    },

    totaux: {
      totalBrut: totalBrut,
      totalRetenues: totalRetenues,
      netAPayer: netAPayer,
      netAPayerLettre: numberToWords(netAPayer)
    },

    paiement: {
      mode: employee.modePaiement || 'Virement',
      banque: employee.banque,
      rib: employee.rib,
      datePaiement: formatDate(dateSortie)
    },

    texte: `Nous soussignés ${companyInfo.nom} reconnaissons avoir réglé à ${employee.prenom} ${employee.nom}, ` +
           `la somme de ${formatMAD(netAPayer)} (${numberToWords(netAPayer)} dirhams) représentant le solde de tout compte ` +
           `pour la période travaillée jusqu'au ${formatDate(dateSortie)}.\n\n` +
           `L'intéressé(e) déclare avoir reçu cette somme à titre de solde de tout compte et ne rien avoir à réclamer ` +
           `de ce chef à la société.\n\n` +
           `Fait en double exemplaire, chaque partie en conservant un original.`,

    signatures: {
      employeur: {
        lieu: companyInfo.ville,
        date: formatDate(dateSortie),
        nom: companyInfo.directeur || 'Le Directeur Général',
        cachet: true
      },
      salarie: {
        date: formatDate(dateSortie),
        mention: 'Lu et approuvé'
      }
    },

    mentionsLegales: [
      'Document établi en application du Code du Travail marocain',
      'Ce reçu est libératoire de toutes sommes dues au titre du contrat de travail',
      'Délai de renonciation: 60 jours selon l\'article 75 du Code du Travail'
    ]
  };
};

// Fonctions utilitaires

function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function numberToWords(num) {
  // Conversion simple en lettres (peut être améliorée)
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  if (num === 0) return 'zéro';

  const integer = Math.floor(num);
  const decimal = Math.round((num - integer) * 100);

  let result = '';

  // Conversion simplifiée (à améliorer pour les grands nombres)
  if (integer >= 1000) {
    const thousands = Math.floor(integer / 1000);
    result += (thousands === 1 ? 'mille' : units[thousands] + ' mille');
    const remainder = integer % 1000;
    if (remainder > 0) result += ' ';
  }

  const hundreds = Math.floor((integer % 1000) / 100);
  if (hundreds > 0) {
    result += (hundreds === 1 ? 'cent' : units[hundreds] + ' cent');
    if (integer % 100 > 0) result += ' ';
  }

  const remainder = integer % 100;
  if (remainder >= 20) {
    const tensDigit = Math.floor(remainder / 10);
    const unitsDigit = remainder % 10;
    result += tens[tensDigit];
    if (unitsDigit > 0) result += '-' + units[unitsDigit];
  } else if (remainder >= 10) {
    result += teens[remainder - 10];
  } else if (remainder > 0) {
    result += units[remainder];
  }

  if (decimal > 0) {
    result += ` virgule ${decimal}`;
  }

  return result;
}

export default {
  generateDamancomFile,
  generateSIMPLIRXML,
  generateBulletinPaie,
  generateAttestationTravail,
  generateCertificatSalaire,
  generateCertificatTravail,
  generateSoldeToutCompte
};
