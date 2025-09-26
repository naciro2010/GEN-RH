const madFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 2
});

export const formatMAD = (value = 0) => madFormatter.format(value || 0);

export const formatNumber = (value = 0) => new Intl.NumberFormat('fr-FR').format(value || 0);

export const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR').format(new Date(value));
};

export const maskCnie = (value = '') => {
  if (!value) return '';
  const last = value.slice(-4);
  return `*** *** ${last}`;
};

let idCounter = 1000;
export const generateId = (prefix = 'ID') => `${prefix}-${++idCounter}`;

export const showToast = (message, variant = 'info') => {
  const corner = document.getElementById('toast-corner');
  if (!corner) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.variant = variant;
  toast.textContent = message;
  corner.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    toast.style.opacity = '0';
  }, 3200);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const ensureDir = (isRtl) => {
  document.body.classList.toggle('rtl', isRtl);
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
};
