import { downloadBlob } from './utils.js';

const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx || {};

export const exportDocx = async ({ title = 'Document', sections = [], fileName = 'document.docx' }) => {
  if (!Document) throw new Error('Librairie docx non chargée');
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 })
        ].concat(
          sections.flatMap((section) => {
            const heading = new Paragraph({
              text: section.heading,
              heading: HeadingLevel.HEADING_2
            });
            const content = section.entries.map((entry) =>
              new Paragraph({ text: `• ${entry.label}: ${entry.value}` })
            );
            return [heading, ...content, new Paragraph('')];
          })
        )
      }
    ]
  });
  const buffer = await Packer.toBlob(doc);
  downloadBlob(buffer, fileName);
};

export const exportDocxFromTemplate = async (templateName, variables, fileName = 'document.docx') => {
  const sections = [
    {
      heading: templateName,
      entries: Object.entries(variables).map(([key, value]) => ({
        label: key,
        value: Array.isArray(value) ? value.join(', ') : String(value ?? '')
      }))
    }
  ];
  await exportDocx({ title: templateName, sections, fileName });
};

export const exportXlsx = ({ sheetName = 'Data', data = [], fileName = 'export.xlsx' }) => {
  if (!window.XLSX) throw new Error('SheetJS non disponible');
  const workbook = window.XLSX.utils.book_new();
  const sheet = window.XLSX.utils.json_to_sheet(data);
  window.XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  window.XLSX.writeFile(workbook, fileName);
};

export const openWordOnlinePlaceholder = (fileName) => {
  window.open(`https://www.office.com/launch/word?auth=2&from=Atlas&file=${encodeURIComponent(fileName)}`, '_blank');
};

export const openExcelOnlinePlaceholder = (fileName) => {
  window.open(`https://www.office.com/launch/excel?auth=2&from=Atlas&file=${encodeURIComponent(fileName)}`, '_blank');
};

export const openInExcelGraph = (fileName, data) => {
  console.info('Placeholder Graph upload for', fileName, data);
  // Exemple d'utilisation Microsoft Graph :
  // 1. POST /drives/{drive-id}/root:/{path}/{fileName}:/content (upload)
  // 2. POST /workbook/worksheets('Feuil1')/tables/add pour créer une table
  // 3. PATCH /tables/{id}/rows/add pour injecter les données
};

/**
 * Exporter une déclaration CNSS au format Damancom
 */
export const exportDeclarationCNSS = async (declaration, employees, companyInfo) => {
  // Import dynamique du service de conformité
  const { generateDamancomFile } = await import('./moroccanCompliance.js');

  const damancomFile = generateDamancomFile(declaration, employees, companyInfo);

  // Créer un Blob et télécharger
  const blob = new Blob([damancomFile.content], { type: damancomFile.format });
  downloadBlob(blob, damancomFile.filename);
};

/**
 * Exporter une déclaration IR au format SIMPL-IR XML
 */
export const exportDeclarationIR = async (declaration, employees, companyInfo) => {
  // Import dynamique du service de conformité
  const { generateSIMPLIRXML } = await import('./moroccanCompliance.js');

  const xmlFile = generateSIMPLIRXML(declaration, employees, companyInfo);

  // Créer un Blob et télécharger
  const blob = new Blob([xmlFile.content], { type: xmlFile.format });
  downloadBlob(blob, xmlFile.filename);
};

/**
 * Exporter un bulletin de paie au format PDF (via HTML)
 */
export const exportBulletinPaie = async (bulletin) => {
  // Générer le HTML du bulletin
  const html = generateBulletinPaieHTML(bulletin);

  // Créer une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();

  // Attendre que le contenu soit chargé puis imprimer
  printWindow.onload = () => {
    printWindow.print();
  };
};

/**
 * Générer le HTML d'un bulletin de paie
 */
function generateBulletinPaieHTML(bulletin) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Bulletin de Paie - ${bulletin.periode}</title>
  <style>
    @media print {
      @page { margin: 1cm; }
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      margin: 0;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .company-info, .employee-info {
      flex: 1;
    }
    .title {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin: 20px 0;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .amount {
      text-align: right;
    }
    .total-row {
      font-weight: bold;
      background-color: #e0e0e0;
    }
    .net-row {
      font-weight: bold;
      background-color: #d0d0d0;
      font-size: 12pt;
    }
    .footer {
      margin-top: 30px;
      font-size: 9pt;
      border-top: 1px solid #000;
      padding-top: 10px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <strong>${bulletin.entreprise.nom}</strong><br>
      ${bulletin.entreprise.adresse}<br>
      ${bulletin.entreprise.ville}<br>
      ICE: ${bulletin.entreprise.ice}<br>
      CNSS: ${bulletin.entreprise.cnss}
    </div>
    <div class="employee-info" style="text-align: right;">
      <strong>${bulletin.salarie.nom}</strong><br>
      Matricule: ${bulletin.salarie.matricule}<br>
      Poste: ${bulletin.salarie.poste}<br>
      CNSS: ${bulletin.salarie.cnss}<br>
      CNIE: ${bulletin.salarie.cnie}
    </div>
  </div>

  <div class="title">Bulletin de Paie<br>${bulletin.periode}</div>

  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="amount">Base</th>
        <th class="amount">Taux</th>
        <th class="amount">Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Salaire de base</td>
        <td class="amount">${bulletin.elements.salaireBrut.toFixed(2)}</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.elements.salaireBrut.toFixed(2)}</td>
      </tr>
      ${bulletin.elements.primeAnciennete > 0 ? `
      <tr>
        <td>Prime d'ancienneté</td>
        <td class="amount">-</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.elements.primeAnciennete.toFixed(2)}</td>
      </tr>` : ''}
      ${bulletin.elements.heuresSupplementaires > 0 ? `
      <tr>
        <td>Heures supplémentaires</td>
        <td class="amount">-</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.elements.heuresSupplementaires.toFixed(2)}</td>
      </tr>` : ''}
      ${bulletin.elements.primes > 0 ? `
      <tr>
        <td>Primes diverses</td>
        <td class="amount">-</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.elements.primes.toFixed(2)}</td>
      </tr>` : ''}
      <tr class="total-row">
        <td colspan="3">TOTAL BRUT</td>
        <td class="amount">${bulletin.elements.totalBrut.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="4" style="background-color: #f8f8f8; font-weight: bold;">RETENUES</td>
      </tr>
      <tr>
        <td>CNSS - Prestations sociales</td>
        <td class="amount">${Math.min(bulletin.elements.totalBrut, 6000).toFixed(2)}</td>
        <td class="amount">4.48%</td>
        <td class="amount">${bulletin.cotisations.cnss.prestationsSocialesSalarie.toFixed(2)}</td>
      </tr>
      <tr>
        <td>AMO</td>
        <td class="amount">${bulletin.elements.totalBrut.toFixed(2)}</td>
        <td class="amount">2.26%</td>
        <td class="amount">${bulletin.cotisations.cnss.amoSalarie.toFixed(2)}</td>
      </tr>
      ${bulletin.cotisations.cimr > 0 ? `
      <tr>
        <td>CIMR</td>
        <td class="amount">${Math.min(bulletin.elements.totalBrut, 3000).toFixed(2)}</td>
        <td class="amount">3%</td>
        <td class="amount">${bulletin.cotisations.cimr.toFixed(2)}</td>
      </tr>` : ''}
      ${bulletin.cotisations.mutuelle > 0 ? `
      <tr>
        <td>Mutuelle</td>
        <td class="amount">-</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.cotisations.mutuelle.toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td>Impôt sur le Revenu (IR)</td>
        <td class="amount">${bulletin.impots.salaireImposable.toFixed(2)}</td>
        <td class="amount">-</td>
        <td class="amount">${bulletin.impots.ir.toFixed(2)}</td>
      </tr>
      <tr class="net-row">
        <td colspan="3">NET À PAYER</td>
        <td class="amount">${bulletin.netAPayer.toFixed(2)} MAD</td>
      </tr>
    </tbody>
  </table>

  <div style="margin: 20px 0; padding: 10px; background-color: #f0f0f0;">
    <strong>Net à payer en lettres:</strong> ${bulletin.netAPayerLettre} dirhams
  </div>

  <div style="margin: 20px 0;">
    <strong>Mode de paiement:</strong> ${bulletin.paiement.mode}<br>
    ${bulletin.paiement.rib ? `<strong>RIB:</strong> ${bulletin.paiement.rib}<br>` : ''}
    <strong>Date de paiement:</strong> ${bulletin.paiement.datePaiement}
  </div>

  <div class="footer">
    ${bulletin.mentionsLegales.map(m => `<p style="margin: 5px 0;">${m}</p>`).join('')}
  </div>

  <div class="signature-section">
    <div>
      <strong>Signature de l'Employeur</strong><br><br><br>
      _____________________
    </div>
    <div>
      <strong>Signature du Salarié</strong><br>
      (Pour réception)<br><br>
      _____________________
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Exporter une attestation de travail au format PDF
 */
export const exportAttestationTravail = async (attestation) => {
  const html = generateAttestationHTML(attestation);

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

/**
 * Générer le HTML d'une attestation
 */
function generateAttestationHTML(attestation) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Attestation de Travail</title>
  <style>
    @media print { @page { margin: 2cm; } }
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.8;
      margin: 0;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .company-name {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .document-title {
      font-size: 16pt;
      font-weight: bold;
      text-decoration: underline;
      margin: 40px 0;
      text-align: center;
    }
    .content {
      text-align: justify;
      margin: 30px 0;
    }
    .signature {
      margin-top: 60px;
      text-align: right;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 10pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">${attestation.entreprise.nom}</div>
    <div>${attestation.entreprise.adresse}</div>
    <div>${attestation.entreprise.ville}</div>
    <div>ICE: ${attestation.entreprise.ice} - RC: ${attestation.entreprise.rc}</div>
    <div>Tél: ${attestation.entreprise.telephone}</div>
  </div>

  <div class="document-title">ATTESTATION DE TRAVAIL</div>

  <div style="text-align: right; margin: 20px 0;">
    N° ${attestation.numero}<br>
    ${attestation.entreprise.ville}, le ${attestation.dateEmission}
  </div>

  <div class="content">
    <p>${attestation.texte}</p>
  </div>

  <div class="signature">
    <p>${attestation.signature.signataireNom}<br>
    ${attestation.signature.signatairePoste}</p>
    <br><br>
    ${attestation.signature.cachet ? '<p style="border: 2px solid #000; padding: 40px; display: inline-block;">CACHET DE L\'ENTREPRISE</p>' : ''}
  </div>

  <div class="footer">
    <p>Ce document est délivré à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Exporter un certificat au format DOCX
 */
export const exportCertificatDocx = async (certificat) => {
  if (!Document) throw new Error('Librairie docx non chargée');

  const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = window.docx;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: certificat.entreprise.nom,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: certificat.entreprise.adresse,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: `ICE: ${certificat.entreprise.ice}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: certificat.type.replace('_', ' '),
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 }
        }),
        new Paragraph({
          text: `N° ${certificat.numero}`,
          alignment: AlignmentType.RIGHT
        }),
        new Paragraph({
          text: `${certificat.entreprise?.ville || certificat.signature.lieu}, le ${certificat.dateEmission}`,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: certificat.texte,
          spacing: { before: 400, after: 400 }
        }),
        new Paragraph({
          text: certificat.signature.signataireNom || certificat.signature.nom,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 600 }
        }),
        new Paragraph({
          text: certificat.signature.signatairePoste || '',
          alignment: AlignmentType.RIGHT
        })
      ]
    }]
  });

  const buffer = await Packer.toBlob(doc);
  downloadBlob(buffer, `${certificat.type}_${certificat.numero}.docx`);
};
