export interface CareerFormData {
  jobTitle: string;
  description: string;
  employmentType: string;
  workSetup: string;
  workSetupRemarks?: string;
  country: string;
  province: string;
  city: string;
  salaryNegotiable: boolean;
  minimumSalary: string | number;
  maximumSalary: string | number;
  screeningSetting: string;
  requireVideo?: boolean;
  secretPrompt?: string;
  preScreeningQuestions?: any[];
  questions?: any[];
  teamMembers?: any[];
}

export const defaultCareerFormValues: CareerFormData = {
  jobTitle: '',
  description: '',
  employmentType: 'Full-Time',
  workSetup: '',
  workSetupRemarks: '',
  country: 'Philippines',
  province: '',
  city: '',
  salaryNegotiable: true,
  minimumSalary: '',
  maximumSalary: '',
  screeningSetting: 'Good Fit and Above',
  requireVideo: true,
  secretPrompt: '',
  preScreeningQuestions: [],
  questions: [],
  teamMembers: [],
};

/**
 * Checks if a step has any user-inputted data (ignoring auto-filled fields)
 */
export const hasStepData = (
  step: number,
  formData: Partial<CareerFormData>
): boolean => {
  switch (step) {
    case 0: {
      const hasJobTitle = !!formData.jobTitle?.trim();
      const hasDescription = !!formData.description?.trim();

      return hasJobTitle || hasDescription;
    }

    case 1: {
      const hasSecretPrompt = !!formData.secretPrompt?.trim();
      const hasPreScreeningQuestions =
        Array.isArray(formData.preScreeningQuestions) &&
        formData.preScreeningQuestions.length > 0;

      return hasSecretPrompt || hasPreScreeningQuestions;
    }

    case 2: {
      const hasQuestions =
        Array.isArray(formData.questions) &&
        formData.questions.some(q => q.questions?.length > 0);

      return hasQuestions;
    }

    case 3: {
      return false;
    }

    case 4: {
      return false;
    }

    default:
      return false;
  }
};

/**
 * Validates required fields for a step
 */
export const validateStep = (
  step: number,
  formData: Partial<CareerFormData>
): boolean => {
  switch (step) {
    case 0:
      return (
        !!formData.jobTitle?.trim() &&
        !!formData.description?.trim() &&
        !!formData.workSetup?.trim()
      );

    case 1:
      return true;

    case 2:
      return true;

    case 3:
      return true;

    case 4:
      return (
        !!formData.jobTitle?.trim() &&
        !!formData.description?.trim() &&
        !!formData.workSetup?.trim()
      );

    default:
      return false;
  }
};

export const employmentTypeOptions = [
  { name: 'Full-Time' },
  { name: 'Part-Time' },
];

export const workSetupOptions = [
  { name: 'Fully Remote' },
  { name: 'Onsite' },
  { name: 'Hybrid' },
];

export const screeningSettingList = [
  {
    name: 'Good Fit and above',
    icon: 'la la-check',
  },
  {
    name: 'Only Strong Fit',
    icon: 'la la-check-double',
  },
  {
    name: 'No Automatic Promotion',
    icon: 'la la-times',
  },
];
