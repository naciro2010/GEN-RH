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
  // Exemple d’utilisation Microsoft Graph :
  // 1. POST /drives/{drive-id}/root:/{path}/{fileName}:/content (upload)
  // 2. POST /workbook/worksheets('Feuil1')/tables/add pour créer une table
  // 3. PATCH /tables/{id}/rows/add pour injecter les données
};
