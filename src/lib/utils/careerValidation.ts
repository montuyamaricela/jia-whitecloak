import sanitizeHtml from 'sanitize-html';

export interface ValidationError {
  field: string;
  message: string;
}

export interface SanitizationWarning {
  field: string;
  message: string;
  original: string;
  sanitized: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: SanitizationWarning[];
  sanitizedData?: any;
  requiresConfirmation?: boolean;
}

const MAX_LENGTHS = {
  jobTitle: 200,
  description: 10000,
  location: 200,
  workSetup: 100,
  workSetupRemarks: 500,
  secretPrompt: 2000,
  interviewSecretPrompt: 2000,
  employmentType: 100,
  country: 100,
  province: 100,
  email: 255,
};

const ALLOWED_HTML_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'span', 'div',
];

const ALLOWED_HTML_ATTRIBUTES = {
  a: ['href', 'target', 'rel'],
  '*': ['class'],
};

const UPDATABLE_FIELDS = [
  'jobTitle',
  'description',
  'questions',
  'location',
  'workSetup',
  'workSetupRemarks',
  'screeningSetting',
  'requireVideo',
  'status',
  'salaryNegotiable',
  'minimumSalary',
  'maximumSalary',
  'country',
  'province',
  'employmentType',
  'secretPrompt',
  'preScreeningQuestions',
  'interviewScreeningSetting',
  'interviewSecretPrompt',
  'teamMembers',
  'lastEditedBy',
  'currentStep',
  'completedSteps',
];

/**
 * Sanitizes HTML content, allowing only safe tags and attributes
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_HTML_TAGS,
    allowedAttributes: ALLOWED_HTML_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
    },
    transformTags: {
      'a': (tagName, attribs) => {
        return {
          tagName: 'a',
          attribs: {
            ...attribs,
            rel: 'noopener noreferrer',
          },
        };
      },
    },
  });
}

/**
 * Sanitizes plain text by removing all HTML tags
 */
export function sanitizePlainText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Detects potentially malicious content in a string
 */
export function hasMaliciousContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;

  const maliciousPatterns = [
    /<script[\s\S]*?>/i,
    /<iframe[\s\S]*?>/i,
    /<object[\s\S]*?>/i,
    /<embed[\s\S]*?>/i,
    /on\w+\s*=/i,
    /javascript:/i,
    /<svg[\s\S]*?on\w+/i,
    /data:text\/html/i,
    /<form[\s\S]*?>/i,
  ];

  return maliciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Detects malicious content and creates warnings with before/after comparison
 */
export function detectMaliciousContent(data: any): SanitizationWarning[] {
  const warnings: SanitizationWarning[] = [];

  const checkField = (fieldName: string, value: string, sanitizeFunc: (v: string) => string) => {
    if (!value || typeof value !== 'string') return;

    if (hasMaliciousContent(value)) {
      const sanitized = sanitizeFunc(value);
      if (value !== sanitized) {
        warnings.push({
          field: fieldName,
          message: 'Contains potentially unsafe HTML that will be removed',
          original: value,
          sanitized: sanitized,
        });
      }
    }
  };

  checkField('description', data.description, sanitizeHTML);
  checkField('jobTitle', data.jobTitle, sanitizePlainText);
  checkField('location', data.location, sanitizePlainText);
  checkField('workSetupRemarks', data.workSetupRemarks, sanitizePlainText);
  checkField('secretPrompt', data.secretPrompt, sanitizePlainText);
  checkField('interviewSecretPrompt', data.interviewSecretPrompt, sanitizePlainText);

  if (Array.isArray(data.questions)) {
    data.questions.forEach((q: any, index: number) => {
      if (q && typeof q.question === 'string') {
        checkField(`questions[${index}].question`, q.question, sanitizePlainText);
      }
    });
  }

  if (Array.isArray(data.preScreeningQuestions)) {
    data.preScreeningQuestions.forEach((q: any, index: number) => {
      if (q && typeof q.question === 'string') {
        checkField(`preScreeningQuestions[${index}].question`, q.question, sanitizePlainText);
      }
    });
  }

  return warnings;
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (!value) return null;

  if (value.length > maxLength) {
    return {
      field: fieldName,
      message: `Exceeds maximum length of ${maxLength} characters`,
    };
  }

  return null;
}

/**
 * Sanitizes an array of objects recursively
 */
export function sanitizeArray(arr: any[]): any[] {
  if (!Array.isArray(arr)) return [];

  return arr.map(item => {
    if (typeof item === 'string') {
      return sanitizePlainText(item);
    }
    if (typeof item === 'object' && item !== null) {
      return sanitizeObject(item);
    }
    return item;
  });
}

/**
 * Recursively sanitizes an object's string values
 */
export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizePlainText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitizes career data before database operations
 */
export function sanitizeCareerData(data: any): any {
  const sanitized: any = {};

  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;

    const value = data[key];

    switch (key) {
      case 'description':
        sanitized[key] = typeof value === 'string' ? sanitizeHTML(value) : value;
        break;

      case 'jobTitle':
      case 'location':
      case 'workSetup':
      case 'workSetupRemarks':
      case 'secretPrompt':
      case 'interviewSecretPrompt':
      case 'employmentType':
      case 'country':
      case 'province':
      case 'screeningSetting':
      case 'interviewScreeningSetting':
        sanitized[key] = typeof value === 'string' ? sanitizePlainText(value) : value;
        break;

      case 'questions':
      case 'preScreeningQuestions':
      case 'teamMembers':
      case 'completedSteps':
        sanitized[key] = Array.isArray(value) ? sanitizeArray(value) : value;
        break;

      case 'lastEditedBy':
      case 'createdBy':
        sanitized[key] = typeof value === 'object' && value !== null
          ? sanitizeObject(value)
          : value;
        break;

      default:
        sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validates career data fields
 */
export function validateCareerData(data: any, isUpdate = false): ValidationResult {
  const errors: ValidationError[] = [];
  const status = data.status;

  if (status === 'active' || (isUpdate && status !== 'inactive')) {
    if (!data.jobTitle || !data.jobTitle.trim()) {
      errors.push({
        field: 'jobTitle',
        message: 'Job title is required for active careers',
      });
    }

    if (!data.description || !data.description.trim()) {
      errors.push({
        field: 'description',
        message: 'Description is required for active careers',
      });
    }

    if (!data.location || !data.location.trim()) {
      errors.push({
        field: 'location',
        message: 'Location is required for active careers',
      });
    }

    if (!data.workSetup || !data.workSetup.trim()) {
      errors.push({
        field: 'workSetup',
        message: 'Work setup is required for active careers',
      });
    }
  }

  if (status === 'inactive' && (!data.jobTitle || !data.jobTitle.trim())) {
    errors.push({
      field: 'jobTitle',
      message: 'Job title is required',
    });
  }

  const lengthChecks = [
    { field: 'jobTitle', value: data.jobTitle, max: MAX_LENGTHS.jobTitle },
    { field: 'description', value: data.description, max: MAX_LENGTHS.description },
    { field: 'location', value: data.location, max: MAX_LENGTHS.location },
    { field: 'workSetup', value: data.workSetup, max: MAX_LENGTHS.workSetup },
    { field: 'workSetupRemarks', value: data.workSetupRemarks, max: MAX_LENGTHS.workSetupRemarks },
    { field: 'secretPrompt', value: data.secretPrompt, max: MAX_LENGTHS.secretPrompt },
    { field: 'interviewSecretPrompt', value: data.interviewSecretPrompt, max: MAX_LENGTHS.interviewSecretPrompt },
    { field: 'employmentType', value: data.employmentType, max: MAX_LENGTHS.employmentType },
    { field: 'country', value: data.country, max: MAX_LENGTHS.country },
    { field: 'province', value: data.province, max: MAX_LENGTHS.province },
  ];

  for (const check of lengthChecks) {
    if (check.value) {
      const error = validateLength(check.value, check.max, check.field);
      if (error) errors.push(error);
    }
  }

  if (data.lastEditedBy && data.lastEditedBy.email) {
    if (!isValidEmail(data.lastEditedBy.email)) {
      errors.push({
        field: 'lastEditedBy.email',
        message: 'Invalid email format',
      });
    }
  }

  if (data.createdBy && data.createdBy.email) {
    if (!isValidEmail(data.createdBy.email)) {
      errors.push({
        field: 'createdBy.email',
        message: 'Invalid email format',
      });
    }
  }

  if (data.teamMembers && Array.isArray(data.teamMembers)) {
    data.teamMembers.forEach((member: any, index: number) => {
      if (member.email && !isValidEmail(member.email)) {
        errors.push({
          field: `teamMembers[${index}].email`,
          message: 'Invalid email format',
        });
      }
    });
  }

  if (typeof data.minimumSalary === 'number' && data.minimumSalary < 0) {
    errors.push({
      field: 'minimumSalary',
      message: 'Minimum salary cannot be negative',
    });
  }

  if (typeof data.maximumSalary === 'number' && data.maximumSalary < 0) {
    errors.push({
      field: 'maximumSalary',
      message: 'Maximum salary cannot be negative',
    });
  }

  if (
    typeof data.minimumSalary === 'number' &&
    typeof data.maximumSalary === 'number' &&
    data.minimumSalary > data.maximumSalary
  ) {
    errors.push({
      field: 'salary',
      message: 'Minimum salary cannot exceed maximum salary',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Filters update data to only allow whitelisted fields
 */
export function filterUpdateFields(data: any): any {
  const filtered: any = {};

  for (const field of UPDATABLE_FIELDS) {
    if (data.hasOwnProperty(field)) {
      filtered[field] = data[field];
    }
  }

  return filtered;
}

/**
 * Complete validation and sanitization pipeline for career data
 */
export function validateAndSanitizeCareer(
  data: any,
  isUpdate = false,
  skipWarnings = false
): ValidationResult {
  if (!skipWarnings) {
    const warnings = detectMaliciousContent(data);
    if (warnings.length > 0) {
      return {
        isValid: false,
        errors: [],
        warnings,
        sanitizedData: sanitizeCareerData(data),
        requiresConfirmation: true,
      };
    }
  }

  const sanitizedData = sanitizeCareerData(data);

  const validationResult = validateCareerData(sanitizedData, isUpdate);

  if (!validationResult.isValid) {
    return validationResult;
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData,
  };
}
