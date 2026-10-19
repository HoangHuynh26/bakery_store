/**
 * Maison Douce Bakery - Formatting & Localization Utilities
 */

/**
 * Formats a monetary number into Vietnamese Dong (VND) currency
 * @param {number|string} amount
 * @returns {string} e.g. "450.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

/**
 * Formats UTC timestamp to Asia/Ho_Chi_Minh localized display
 * @param {string|Date} dateInput
 * @param {boolean} includeTime
 * @returns {string}
 */
export const formatDateTime = (dateInput, includeTime = true) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const options = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat('vi-VN', options).format(date);
};

/**
 * Truncates text with trailing ellipsis
 * @param {string} text
 * @param {number} max
 */
export const truncateText = (text, max = 100) => {
  if (!text || text.length <= max) return text || '';
  return `${text.substring(0, max)}...`;
};

// Aliases for convenient usage across modules
export const formatVND = formatCurrency;
export const formatDateTimeVN = formatDateTime;

