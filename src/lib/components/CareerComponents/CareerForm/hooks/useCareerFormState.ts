import { useState, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface Career {
  jobTitle?: string;
  description?: string;
  workSetup?: string;
  workSetupRemarks?: string;
  screeningSetting?: string;
  secretPrompt?: string;
  preScreeningQuestions?: any[];
  interviewScreeningSetting?: string;
  interviewSecretPrompt?: string;
  interviewQuestions?: any[];
  employmentType?: string;
  requireVideo?: boolean;
  salaryNegotiable?: boolean;
  minimumSalary?: string | number;
  maximumSalary?: string | number;
  questions?: any[];
  country?: string;
  province?: string;
  location?: string;
  teamMembers?: any[];
  currentStep?: number;
  completedSteps?: number[];
}

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    category: 'CV Validation / Experience',
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 2,
    category: 'Technical',
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 3,
    category: 'Behavioral',
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 4,
    category: 'Analytical',
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 5,
    category: 'Others',
    questionCountToAsk: null,
    questions: [],
  },
];

/**
 * Custom hook to manage all career form state
 */
export const useCareerFormState = (career?: Career, setValue?: UseFormSetValue<any>, trigger?: any, initialStep?: number) => {
  const [currentStep, setCurrentStep] = useState(initialStep !== undefined ? initialStep : (career?.currentStep || 0));
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});

  const [jobTitle, setJobTitle] = useState(career?.jobTitle || '');
  const [description, setDescription] = useState(career?.description || '');
  const [workSetup, setWorkSetup] = useState(career?.workSetup || '');
  const [workSetupRemarks, setWorkSetupRemarks] = useState(
    career?.workSetupRemarks || ''
  );
  const [screeningSetting, setScreeningSetting] = useState(
    career?.screeningSetting || 'Good Fit and Above'
  );
  const [secretPrompt, setSecretPrompt] = useState(career?.secretPrompt || '');
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>(
    career?.preScreeningQuestions || []
  );
  const [interviewScreeningSetting, setInterviewScreeningSetting] = useState(
    career?.interviewScreeningSetting || 'Good Fit and above'
  );
  const [interviewSecretPrompt, setInterviewSecretPrompt] = useState(
    career?.interviewSecretPrompt || ''
  );
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>(
    career?.interviewQuestions || DEFAULT_QUESTIONS
  );
  const [employmentType, setEmploymentType] = useState(
    career?.employmentType || 'Full-Time'
  );
  const [requireVideo, setRequireVideo] = useState(
    career?.requireVideo ?? true
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable ?? true
  );
  const [minimumSalary, setMinimumSalary] = useState(
    career?.minimumSalary ? String(career.minimumSalary) : ''
  );
  const [maximumSalary, setMaximumSalary] = useState(
    career?.maximumSalary ? String(career.maximumSalary) : ''
  );
  const [questions, setQuestions] = useState(
    career?.questions || DEFAULT_QUESTIONS
  );

  const [country, setCountry] = useState(career?.country || 'Philippines');
  const [province, setProvince] = useState(career?.province || '');
  const [city, setCity] = useState(career?.location || '');

  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState('');
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);
  const [members, setMembers] = useState<any[]>(career?.teamMembers || []);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);

  const updateJobTitle = (value: string) => {
    setJobTitle(value);
    setValue?.('jobTitle', value, { shouldValidate: true });
  };

  const updateDescription = (value: string) => {
    setDescription(value);
    setValue?.('description', value, { shouldValidate: true });
  };

  const updateEmploymentType = (value: string) => {
    setEmploymentType(value);
    setValue?.('employmentType', value, { shouldValidate: true });
  };

  const updateWorkSetup = (value: string) => {
    setWorkSetup(value);
    setValue?.('workSetup', value, { shouldValidate: true });
  };

  const updateProvince = (value: string) => {
    setProvince(value);
    setValue?.('province', value, { shouldValidate: true });
  };

  const updateCity = (value: string) => {
    setCity(value);
    setValue?.('city', value, { shouldValidate: true });
  };

  const updateMinimumSalary = (value: string) => {
    setMinimumSalary(value);
    setValue?.('minimumSalary', value, { shouldValidate: true });
    setTimeout(() => {
      trigger?.('maximumSalary');
    }, 0);
  };

  const updateMaximumSalary = (value: string) => {
    setMaximumSalary(value);
    setValue?.('maximumSalary', value, { shouldValidate: true });
    setTimeout(() => {
      trigger?.('minimumSalary');
    }, 0);
  };

  return {
    currentStep,
    setCurrentStep,
    stepErrors,
    setStepErrors,
    jobTitle,
    setJobTitle,
    updateJobTitle,
    description,
    setDescription,
    updateDescription,
    workSetup,
    setWorkSetup,
    updateWorkSetup,
    workSetupRemarks,
    setWorkSetupRemarks,
    screeningSetting,
    setScreeningSetting,
    secretPrompt,
    setSecretPrompt,
    preScreeningQuestions,
    setPreScreeningQuestions,
    interviewScreeningSetting,
    setInterviewScreeningSetting,
    interviewSecretPrompt,
    setInterviewSecretPrompt,
    interviewQuestions,
    setInterviewQuestions,
    employmentType,
    setEmploymentType,
    updateEmploymentType,
    requireVideo,
    setRequireVideo,
    salaryNegotiable,
    setSalaryNegotiable,
    minimumSalary,
    setMinimumSalary,
    updateMinimumSalary,
    maximumSalary,
    setMaximumSalary,
    updateMaximumSalary,
    questions,
    setQuestions,
    country,
    setCountry,
    province,
    setProvince,
    updateProvince,
    city,
    setCity,
    updateCity,
    provinceList,
    setProvinceList,
    cityList,
    setCityList,
    showSaveModal,
    setShowSaveModal,
    isSavingCareer,
    setIsSavingCareer,
    savingCareerRef,
    members,
    setMembers,
    availableMembers,
    setAvailableMembers,
  };
};
