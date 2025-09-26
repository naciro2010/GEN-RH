const madFormatter = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2
});
export const formatMAD = (value = 0) => madFormatter.format(value || 0);
export const formatNumber = (value = 0) => new Intl.NumberFormat('fr-FR').format(value || 0);
export const formatDate = (value) => {
    if (!value)
        return '';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(value));
};
export const maskCnie = (value = '') => {
    if (!value)
        return '';
    const last = value.slice(-4);
    return `*** *** ${last}`;
};
