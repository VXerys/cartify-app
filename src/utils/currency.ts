/**
 * Cartify Currency Utility
 * Handles strict Indonesian Rupiah formatting.
 */

/**
 * Formats a number into Indonesian Rupiah (IDR) string.
 * Example: 25000 -> "Rp 25.000"
 * Example: 1500000 -> "Rp 1.500.000"
 *
 * @param amount - The numerical amount to format.
 * @returns Formatted string with 'Rp' prefix and dot separators.
 */
export const formatCurrency = (amount: number): string => {
  // Use Intl.NumberFormat for robust locale support
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // IDR usually doesn't need decimal cents for shopping
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Parses a Rupiah string back to number (if needed for input handling).
 * Example: "Rp 25.000" -> 25000
 */
export const parseCurrency = (currencyString: string): number => {
  return parseInt(currencyString.replace(/[^0-9]/g, ''), 10) || 0;
};
