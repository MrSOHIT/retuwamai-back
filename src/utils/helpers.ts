import fs from 'fs';
import path from 'path';
import { PAGINATION_DEFAULTS } from './constants';

/**
 * Validate and sanitize pagination parameters
 */
export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);

  return {
    page: Math.max(1, isNaN(pageNum) ? PAGINATION_DEFAULTS.PAGE : pageNum),
    limit: Math.min(
      PAGINATION_DEFAULTS.MAX_LIMIT,
      Math.max(1, isNaN(limitNum) ? PAGINATION_DEFAULTS.LIMIT : limitNum)
    ),
  };
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null,
  };
};

/**
 * Ensure directory exists, create if it doesn't
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Delete file safely
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

/**
 * Generate unique filename
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = getFileExtension(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  
  return `${name}-${timestamp}-${random}${ext}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Sanitize string for search (remove special characters, normalize)
 */
export const sanitizeSearchTerm = (term: string): string => {
  return term
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, '') // Keep only alphanumeric and Devanagari characters
    .replace(/\s+/g, ' ');
};

/**
 * Convert English numbers to Nepali numbers
 */
export const toNepaliNumber = (num: number | string): string => {
  const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num)
    .split('')
    .map(digit => nepaliNumerals[parseInt(digit)] || digit)
    .join('');
};

/**
 * Convert Nepali numbers to English numbers
 */
export const toEnglishNumber = (nepaliNum: string): string => {
  const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  
  return nepaliNum
    .split('')
    .map(char => {
      const index = nepaliNumerals.indexOf(char);
      return index !== -1 ? englishNumerals[index] : char;
    })
    .join('');
};

/**
 * Validate Nepali phone number
 */
export const isValidNepaliPhoneNumber = (phone: string): boolean => {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid Nepali mobile number (10 digits starting with 98/97)
  const mobilePattern = /^(98|97)\d{8}$/;
  
  // Check if it's a valid landline number (7-8 digits with area code)
  const landlinePattern = /^0[1-9]\d{6,7}$/;
  
  return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if date is within last N days
 */
export const isWithinLastDays = (date: Date, days: number): boolean => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

/**
 * Format date to Nepali format
 */
export const formatNepaliDate = (date: Date): string => {
  // This is a simplified version - in real implementation, 
  // you'd use a proper Nepali calendar conversion library
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  return new Intl.DateTimeFormat('ne-NP', options).format(date);
};

/**
 * Debounce function for search optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};