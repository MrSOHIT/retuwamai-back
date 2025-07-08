import { isValidEmail, isValidNepaliPhoneNumber } from './helpers';

/**
 * Validate business name
 */
export const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Business name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Business name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Business name must not exceed 100 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate contact person name
 */
export const validateContactPerson = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Contact person name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Contact person name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Contact person name must not exceed 50 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!isValidNepaliPhoneNumber(phone)) {
    return { isValid: false, error: 'Please enter a valid Nepali phone number' };
  }
  
  return { isValid: true };
};

/**
 * Validate email address (optional)
 */
export const validateEmail = (email?: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: true }; // Email is optional
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate ward number
 */
export const validateWardNumber = (ward: number): { isValid: boolean; error?: string } => {
  if (!ward) {
    return { isValid: false, error: 'Ward number is required' };
  }
  
  if (!Number.isInteger(ward) || ward < 1 || ward > 50) {
    return { isValid: false, error: 'Ward number must be between 1 and 50' };
  }
  
  return { isValid: true };
};

/**
 * Validate investment amount
 */
export const validateInvestment = (amount?: number): { isValid: boolean; error?: string } => {
  if (amount === undefined || amount === null) {
    return { isValid: true }; // Investment is optional
  }
  
  if (amount < 0) {
    return { isValid: false, error: 'Investment amount cannot be negative' };
  }
  
  if (amount > 999999999999) { // 999 billion limit
    return { isValid: false, error: 'Investment amount is too large' };
  }
  
  return { isValid: true };
};

/**
 * Validate employee count
 */
export const validateEmployeeCount = (count?: number): { isValid: boolean; error?: string } => {
  if (count === undefined || count === null) {
    return { isValid: true }; // Employee count is optional
  }
  
  if (!Number.isInteger(count) || count < 0) {
    return { isValid: false, error: 'Employee count must be a non-negative integer' };
  }
  
  if (count > 50000) {
    return { isValid: false, error: 'Employee count seems unrealistic (max: 50,000)' };
  }
  
  return { isValid: true };
};

/**
 * Validate salary amount
 */
export const validateSalary = (amount?: number): { isValid: boolean; error?: string } => {
  if (amount === undefined || amount === null) {
    return { isValid: true }; // Salary is optional
  }
  
  if (amount < 0) {
    return { isValid: false, error: 'Salary amount cannot be negative' };
  }
  
  if (amount > 10000000) { // 10 million limit
    return { isValid: false, error: 'Salary amount seems unrealistic' };
  }
  
  return { isValid: true };
};

/**
 * Validate year
 */
export const validateYear = (year?: string): { isValid: boolean; error?: string } => {
  if (!year || year.trim().length === 0) {
    return { isValid: true }; // Year is optional
  }
  
  // Accept both English and Nepali numerals
  const yearPattern = /^[0-9०-९]{4}$/;
  if (!yearPattern.test(year.trim())) {
    return { isValid: false, error: 'Year must be 4 digits' };
  }
  
  return { isValid: true };
};

/**
 * Validate category name
 */
export const validateCategoryName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Category name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Category name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Category name must not exceed 50 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate username
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.trim().length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (username.trim().length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters' };
  }
  
  const usernamePattern = /^[a-zA-Z0-9_]+$/;
  if (!usernamePattern.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 100) {
    return { isValid: false, error: 'Password must not exceed 100 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate pagination parameters
 */
export const validatePaginationParams = (
  page?: string, 
  limit?: string
): { isValid: boolean; error?: string; page?: number; limit?: number } => {
  let pageNum = 1;
  let limitNum = 10;
  
  if (page) {
    pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return { isValid: false, error: 'Page must be a positive integer' };
    }
    if (pageNum > 1000) {
      return { isValid: false, error: 'Page number too large' };
    }
  }
  
  if (limit) {
    limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      return { isValid: false, error: 'Limit must be a positive integer' };
    }
    if (limitNum > 100) {
      return { isValid: false, error: 'Limit cannot exceed 100' };
    }
  }
  
  return { isValid: true, page: pageNum, limit: limitNum };
};

/**
 * Validate search term
 */
export const validateSearchTerm = (term?: string): { isValid: boolean; error?: string } => {
  if (!term) {
    return { isValid: true }; // Search term is optional
  }
  
  if (term.trim().length === 0) {
    return { isValid: true }; // Empty search is valid
  }
  
  if (term.trim().length > 100) {
    return { isValid: false, error: 'Search term must not exceed 100 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: Express.Multer.File): { isValid: boolean; error?: string } => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
  ];
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Only PDF, DOC, DOCX, images, and text files are allowed.' 
    };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size exceeds 5MB limit' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate business data completeness
 */
export const validateBusinessCompleteness = (business: any): { 
  isValid: boolean; 
  missingFields: string[];
  completionPercentage: number;
} => {
  const requiredFields = [
    'businessName',
    'contactPerson', 
    'businessAddress',
    'contactNumber',
    'wardNumber'
  ];
  
  const optionalFields = [
    'email',
    'businessType',
    'businessField',
    'totalInvestment',
    'permanentEmployees',
    'ownershipType'
  ];
  
  const missingRequired = requiredFields.filter(field => !business[field]);
  const filledOptional = optionalFields.filter(field => business[field]).length;
  
  const totalFields = requiredFields.length + optionalFields.length;
  const filledFields = requiredFields.length - missingRequired.length + filledOptional;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  
  return {
    isValid: missingRequired.length === 0,
    missingFields: missingRequired,
    completionPercentage
  };
};

/**
 * Batch validate business creation data
 */
export const validateCreateBusinessData = (data: any): { 
  isValid: boolean; 
  errors: Array<{ field: string; message: string }>;
} => {
  const errors: Array<{ field: string; message: string }> = [];
  
  // Validate required fields
  const businessNameValidation = validateBusinessName(data.businessName);
  if (!businessNameValidation.isValid) {
    errors.push({ field: 'businessName', message: businessNameValidation.error! });
  }
  
  const contactPersonValidation = validateContactPerson(data.contactPerson);
  if (!contactPersonValidation.isValid) {
    errors.push({ field: 'contactPerson', message: contactPersonValidation.error! });
  }
  
  const phoneValidation = validatePhoneNumber(data.contactNumber);
  if (!phoneValidation.isValid) {
    errors.push({ field: 'contactNumber', message: phoneValidation.error! });
  }
  
  const wardValidation = validateWardNumber(data.wardNumber);
  if (!wardValidation.isValid) {
    errors.push({ field: 'wardNumber', message: wardValidation.error! });
  }
  
  // Validate optional fields if provided
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push({ field: 'email', message: emailValidation.error! });
    }
  }
  
  if (data.totalInvestment !== undefined) {
    const investmentValidation = validateInvestment(data.totalInvestment);
    if (!investmentValidation.isValid) {
      errors.push({ field: 'totalInvestment', message: investmentValidation.error! });
    }
  }
  
  if (data.permanentEmployees !== undefined) {
    const employeesValidation = validateEmployeeCount(data.permanentEmployees);
    if (!employeesValidation.isValid) {
      errors.push({ field: 'permanentEmployees', message: employeesValidation.error! });
    }
  }
  
  if (data.avgSalary !== undefined) {
    const salaryValidation = validateSalary(data.avgSalary);
    if (!salaryValidation.isValid) {
      errors.push({ field: 'avgSalary', message: salaryValidation.error! });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};