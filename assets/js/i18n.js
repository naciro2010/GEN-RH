import { setData, getData } from './data/store.js';

const dictionary = {
  'brand.subtitle': { fr: 'Gestion RH 360°', ar: 'منصة الموارد البشرية الشاملة' },
  'theme.light': { fr: 'Clair', ar: 'مضيء' },
  'theme.dark': { fr: 'Sombre', ar: 'داكن' },
  'nav.dashboard': { fr: 'Tableau de bord', ar: 'لوحة القيادة' },
  'nav.recrutement': { fr: 'Recrutement', ar: 'التوظيف' },
  'nav.onboarding': { fr: 'Onboarding', ar: 'الاندماج' },
  'nav.salaries': { fr: 'Salariés', ar: 'الموظفون' },
  'nav.temps': { fr: 'Temps & Pointage', ar: 'الوقت والحضور' },
  'nav.conges': { fr: 'Congés', ar: 'الإجازات' },
  'nav.paie': { fr: 'Paie', ar: 'الأجور' },
  'nav.formation': { fr: 'Formation', ar: 'التكوين' },
  'nav.documents': { fr: 'Documents', ar: 'الوثائق' },
  'nav.admin': { fr: 'Admin', ar: 'الإدارة' },
  'nav.export': { fr: 'Exporter données', ar: 'تصدير البيانات' },
  'nav.import': { fr: 'Importer données', ar: 'استيراد البيانات' },
  'dashboard.kpi.hires': { fr: 'Embauches en cours', ar: 'توظيفات جارية' },
  'dashboard.kpi.absences': { fr: 'Absences du jour', ar: 'غيابات اليوم' },
  'dashboard.kpi.payroll': { fr: 'Masse salariale du mois', ar: 'كتلة الأجور لهذا الشهر' },
  'dashboard.kpi.training': { fr: 'Sessions de formation à venir', ar: 'جلسات التكوين القادمة' },
  'dashboard.quick.recruiting': { fr: 'Recruter', ar: 'توظيف' },
  'dashboard.quick.payroll': { fr: 'Lancer paie', ar: 'تشغيل الأجور' },
  'dashboard.quick.cnss': { fr: 'Déclarer CNSS', ar: 'تصريح CNSS' },
  'dashboard.quick.simpl': { fr: 'SIMPL-IR', ar: 'SIMPL-IR' },
  'actions.add': { fr: 'Ajouter', ar: 'إضافة' },
  'actions.save': { fr: 'Enregistrer', ar: 'حفظ' },
  'actions.cancel': { fr: 'Annuler', ar: 'إلغاء' },
  'actions.exportWord': { fr: 'Générer Word', ar: 'إنشاء وورد' },
  'actions.exportExcel': { fr: 'Exporter Excel', ar: 'تصدير إكسل' },
  'toast.saved': { fr: 'Données enregistrées', ar: 'تم حفظ البيانات' }
};

let locale = getData().settings.locale || 'fr';

export const getLocale = () => locale;

export const t = (key) => {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[locale] ?? entry.fr ?? key;
};

export const applyTranslations = (root = document) => {
  root.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    node.textContent = t(key);
  });
};

export const toggleLocale = () => {
  locale = locale === 'fr' ? 'ar' : 'fr';
  setData((draft) => {
    draft.settings.locale = locale;
    draft.settings.rtl = locale === 'ar';
  });
  applyTranslations();
  document.body.classList.toggle('rtl', locale === 'ar');
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  return locale;
};

export const setLocale = (value) => {
  locale = value;
  applyTranslations();
  document.body.classList.toggle('rtl', value === 'ar');
  document.documentElement.setAttribute('lang', value);
  document.documentElement.setAttribute('dir', value === 'ar' ? 'rtl' : 'ltr');
};
