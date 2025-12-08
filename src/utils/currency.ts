export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrencyInput = (text: string): string => {
    // Remove non-numeric chars
    const numberString = text.replace(/[^0-9]/g, '');
    if (!numberString) return '';
    
    // Format with format: Rp. X,XXX
    const number = parseInt(numberString, 10);
    return 'Rp ' + number.toLocaleString('id-ID');
};

export const currencyToNumber = (text: string): number => {
    return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
};
