export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
  ],
};

export const BUSINESS_TYPES = {
  PRODUCTION: 'उत्पादन',
  SERVICE: 'सेवा',
  TRADE: 'व्यापार',
  AGRICULTURE: 'कृषि',
  OTHER: 'अन्य',
};

export const OWNERSHIP_TYPES = {
  SOLE_PROPRIETORSHIP: 'एकल स्वामित्व',
  PARTNERSHIP: 'साझेदारी',
  PRIVATE_LIMITED: 'निजी लिमिटेड',
  PUBLIC_LIMITED: 'सार्वजनिक लिमिटेड',
  COOPERATIVE: 'सहकारी संस्था',
  OTHER: 'अन्य',
};

export const BUSINESS_FIELDS = {
  RETAIL_WHOLESALE: 'खुद्रा/थोक व्यापार',
  HOTEL_RESTAURANT: 'होटेल/रेस्टुरेन्ट',
  EDUCATIONAL_INSTITUTION: 'शैक्षिक संस्था',
  HEALTH_SERVICE: 'स्वास्थ्य सेवा',
  CONSTRUCTION: 'निर्माण',
  INFORMATION_TECHNOLOGY: 'सूचना प्रविधि',
  TOURISM: 'पर्यटन',
  FINANCIAL_INSTITUTION: 'वित्तीय संस्था',
  OTHER: 'अन्य',
};

export const INCOME_SOURCES = {
  LOCAL: 'स्थानीय',
  NATIONAL: 'राष्ट्रिय',
  INTERNATIONAL: 'अन्तर्राष्ट्रिय',
};

export const CHALLENGES = {
  FINANCIAL: 'वित्तीय चुनौती',
  HUMAN_RESOURCES: 'मानव स्रोतको कमी',
  POLICY_ISSUES: 'नीतिगत समस्या',
  OTHER: 'अन्य',
};

export const MUNICIPAL_SUPPORT = {
  TAX_RELIEF: 'कर सहुलियत',
  BUSINESS_TRAINING: 'व्यवसायिक तालिम',
  MARKET_ACCESS: 'बजारको पहुँच',
  OTHER: 'अन्य',
};

export const COMMUNITY_CONTRIBUTIONS = {
  SOCIAL_SERVICE: 'समाज सेवा',
  EDUCATION: 'शिक्षा',
  HEALTH: 'स्वास्थ्य',
  ENVIRONMENT: 'वातावरण',
  OTHER: 'अन्य',
};

export const WARD_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  WORKER: 'WORKER',
} as const;

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid username or password',
  TOKEN_EXPIRED: 'Token has expired',
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  DATABASE_ERROR: 'Database operation failed',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  BUSINESS_CREATED: 'Business created successfully',
  BUSINESS_UPDATED: 'Business updated successfully',
  BUSINESS_DELETED: 'Business deleted successfully',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  FILE_UPLOADED: 'File uploaded successfully',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-Powered-By': 'Ratuwamai Municipality',
};

export const CACHE_DURATION = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  DAILY: 24 * 60 * 60, // 24 hours
};

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  STRICT_ROUTES: ['/api/auth/login'],
  STRICT_MAX: 5,
};