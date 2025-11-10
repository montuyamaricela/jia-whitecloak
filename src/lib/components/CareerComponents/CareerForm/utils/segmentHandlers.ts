import { errorToast } from '@/lib/Utils';

interface StepErrors {
  [key: number]: boolean;
}

interface HandleSaveAndContinueParams {
  currentStep: number;
  stepErrors: StepErrors;
  setStepErrors: (errors: StepErrors) => void;
  trigger: (fields?: any) => Promise<boolean>;
  questions: any[];
  handleNextStep: () => void;
}

/**
 * Handles step click navigation - only allows moving to previous or current step
 */
export const handleStepClick = (
  stepIndex: number,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  if (stepIndex <= currentStep) {
    setCurrentStep(stepIndex);
  }
};

/**
 * Advances to the next step if available
 */
export const handleNextStep = (
  currentStep: number,
  stepsLength: number,
  setCurrentStep: (step: number) => void
) => {
  if (currentStep < stepsLength - 1) {
    setCurrentStep(currentStep + 1);
  }
};

/**
 * Validates current step and proceeds to next step if valid
 */
export const handleSaveAndContinue = async ({
  currentStep,
  stepErrors,
  setStepErrors,
  trigger,
  questions,
  handleNextStep,
}: HandleSaveAndContinueParams): Promise<void> => {
  if (currentStep === 0) {
    const fieldsToValidate = [
      'jobTitle',
      'description',
      'employmentType',
      'workSetup',
      'province',
      'city',
      'minimumSalary',
      'maximumSalary',
    ];

    const isValid = await trigger(fieldsToValidate as any);

    if (!isValid) {
      errorToast('Please fill in all required fields', 1300);
      setStepErrors({ ...stepErrors, 0: true });
      return;
    }

    setStepErrors({ ...stepErrors, 0: false });
  }

  if (currentStep === 2) {
    const totalQuestionCount = questions.reduce(
      (total, category) => total + (category?.questions?.length || 0),
      0
    );

    if (totalQuestionCount < 5) {
      errorToast('Please add at least 5 interview questions', 1300);
      setStepErrors({ ...stepErrors, 2: true });
      return;
    }

    setStepErrors({ ...stepErrors, 2: false });
  }

  handleNextStep();
};
