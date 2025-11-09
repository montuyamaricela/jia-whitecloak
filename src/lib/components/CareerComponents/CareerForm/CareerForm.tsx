'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import InterviewQuestionGeneratorV2 from '../InterviewQuestionGeneratorV2';
import philippineCitiesAndProvinces from '../../../../../public/philippines-locations.json';
import { candidateActionToast, errorToast } from '@/lib/Utils';
import { useAppContext } from '@/lib/context/AppContext';
import axios from 'axios';
import CareerActionModal from '../CareerActionModal';
import FullScreenLoadingAnimation from '../FullScreenLoadingAnimation';
import CareerFormStepActions from './CareerFormStepActions';
import CareerInformationCard from './CareerInformationCard';
import SettingsCard from './SettingsCard';
import AdditionalInformationCard from './AdditionalInformationCard';
import CareerDetailsAndTeamAccess from './CareerDetailsAndTeamAccess/CareerDetailsAndTeamAccess';
import SegmentedFormLayout from './SegmentedFormLayout';
import SegmentPlaceholder from './SegmentPlaceholder';
import Tip from './CareerDetailsAndTeamAccess/Tip';
import CVReviewSettingsCard from './CVReview/CVReviewSettingsCard';
import PreScreeningQuestionsCard from './CVReview/PreScreeningQuestionsCard';
import AIInterviewSettingsCard from './InterviewSetup/AIInterviewSettingsCard';
import AIInterviewQuestionsCard from './InterviewSetup/AIInterviewQuestionsCard';
import { hasStepData } from './schema/careerFormSchema';

export default function CareerForm({
  career,
  formType,
  setShowEditModal,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
}) {
  const { user, orgID } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      jobTitle: career?.jobTitle || '',
      description: career?.description || '',
      employmentType: career?.employmentType || 'Full-Time',
      workSetup: career?.workSetup || '',
      country: career?.country || 'Philippines',
      province: career?.province || '',
      city: career?.location || '',
      salaryNegotiable: career?.salaryNegotiable ?? true,
      minimumSalary: career?.minimumSalary || '',
      maximumSalary: career?.maximumSalary || '',
      screeningSetting: career?.screeningSetting || 'Good Fit and Above',
      secretPrompt: career?.secretPrompt || '',
      preScreeningQuestions: career?.preScreeningQuestions || [],
    },
  });

  useEffect(() => {
    register('jobTitle', {
      required: 'This is a required field.',
      validate: (value) => value.trim().length > 0 || 'This is a required field.'
    });
    register('description', {
      required: 'This is a required field.',
      validate: (value) => value.trim().length > 0 || 'This is a required field.'
    });
    register('employmentType', { required: 'This is a required field.' });
    register('workSetup', { required: 'This is a required field.' });
    register('province', { required: 'This is a required field.' });
    register('city', { required: 'This is a required field.' });
  }, [register]);

  type StepState =
    | 'active-pending'
    | 'active-in-progress'
    | 'active-completed'
    | 'inactive'
    | 'pending-empty'
    | 'error';

  const getFormData = () => ({
    jobTitle,
    description,
    workSetup,
    province,
    city,
    secretPrompt,
    preScreeningQuestions,
    questions,
  });

  const getStepState = (stepIndex: number): StepState => {
    if (stepIndex === currentStep) {
      if (stepErrors[stepIndex]) {
        return 'error';
      }
      const formData = getFormData();
      return hasStepData(stepIndex, formData)
        ? 'active-in-progress'
        : 'active-pending';
    }

    if (stepIndex < currentStep) {
      return 'active-completed';
    }

    return 'inactive';
  };

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
    career?.interviewQuestions || []
  );
  const [employmentType, setEmploymentType] = useState(
    career?.employmentType || 'Full-Time'
  );
  const [requireVideo, setRequireVideo] = useState(
    career?.requireVideo || true
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable || true
  );
  const [minimumSalary, setMinimumSalary] = useState(
    career?.minimumSalary || ''
  );
  const [maximumSalary, setMaximumSalary] = useState(
    career?.maximumSalary || ''
  );
  const [questions, setQuestions] = useState(
    career?.questions || [
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
    ]
  );

  const [country, setCountry] = useState(career?.country || 'Philippines');
  const [province, setProvince] = useState(career?.province || '');
  const [city, setCity] = useState(career?.location || '');

  const updateJobTitle = (value: string) => {
    setJobTitle(value);
    setValue('jobTitle', value, { shouldValidate: true });
  };

  const updateDescription = (value: string) => {
    setDescription(value);
    setValue('description', value, { shouldValidate: true });
  };

  const updateEmploymentType = (value: string) => {
    setEmploymentType(value);
    setValue('employmentType', value, { shouldValidate: true });
  };

  const updateWorkSetup = (value: string) => {
    setWorkSetup(value);
    setValue('workSetup', value, { shouldValidate: true });
  };

  const updateProvince = (value: string) => {
    setProvince(value);
    setValue('province', value, { shouldValidate: true });
  };

  const updateCity = (value: string) => {
    setCity(value);
    setValue('city', value, { shouldValidate: true });
  };
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState('');
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);
  const [members, setMembers] = useState<any[]>(career?.teamMembers || []);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);

  const steps: Array<{ title: string; subtext: string; state: StepState }> = [
    {
      title: 'Career Details & Team Access',
      subtext: 'Enter the job title, location and requirements.',
      state: getStepState(0),
    },
    {
      title: 'CV Review & Pre-screening',
      subtext:
        'Choose a pipeline to organize your candidates via pre-defined stages.',
      state: getStepState(1),
    },
    {
      title: 'AI Interview Setup',
      subtext: 'Assign team members and define their roles for this career.',
      state: getStepState(2),
    },
    {
      title: 'Pipeline Stages',
      subtext: 'Assign team members and define their roles for this career.',
      state: getStepState(3),
    },
    {
      title: 'Review Career',
      subtext: 'Set up screening, video requirements, and interview questions.',
      state: getStepState(4),
    },
  ];

  const currentUserData = {
    id: user?.email,
    name: user?.name,
    email: user?.email,
    avatar: user?.image,
  };

  const isFormValid = () => {
    // Step-specific validation
    if (currentStep === 0) {
      // Step 0: Career Details & Team Access
      return (
        jobTitle?.trim().length > 0 &&
        description?.trim().length > 0 &&
        workSetup?.trim().length > 0
      );
    }
    if (currentStep === 1) {
      // Step 1: CV Review & Pre-screening (no required fields for now)
      return true;
    }
    // For other steps, use full validation
    return (
      jobTitle?.trim().length > 0 &&
      description?.trim().length > 0 &&
      questions.some((q) => q.questions.length > 0) &&
      workSetup?.trim().length > 0
    );
  };

  const updateCareer = async (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast('Minimum salary cannot be greater than maximum salary', 1300);
      return;
    }
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const updatedCareer = {
      _id: career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      country,
      province,
      // Backwards compatibility
      location: city,
      employmentType,
    };
    try {
      setIsSavingCareer(true);
      const response = await axios.post('/api/update-career', updatedCareer);
      if (response.status === 200) {
        candidateActionToast(
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
              Career updated
            </span>
          </div>,
          1300,
          <i
            className='la la-check-circle'
            style={{ color: '#039855', fontSize: 32 }}
          ></i>
        );
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
        }, 1300);
      }
    } catch (error) {
      console.error(error);
      errorToast('Failed to update career', 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const confirmSaveCareer = (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast('Minimum salary cannot be greater than maximum salary', 1300);
      return;
    }

    setShowSaveModal(status);
  };

  const saveCareer = async (status: string) => {
    setShowSaveModal('');
    if (!status) {
      return;
    }

    if (!savingCareerRef.current) {
      setIsSavingCareer(true);
      savingCareerRef.current = true;
      let userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
      const career = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        questions,
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting,
        orgID,
        requireVideo,
        salaryNegotiable,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        country,
        province,
        // Backwards compatibility
        location: city,
        status,
        employmentType,
      };

      try {
        const response = await axios.post('/api/add-career', career);
        if (response.status === 200) {
          candidateActionToast(
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
                Career added {status === 'active' ? 'and published' : ''}
              </span>
            </div>,
            1300,
            <i
              className='la la-check-circle'
              style={{ color: '#039855', fontSize: 32 }}
            ></i>
          );
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
        }
      } catch (error) {
        errorToast('Failed to add career', 1300);
      } finally {
        savingCareerRef.current = false;
        setIsSavingCareer(false);
      }
    }
  };

  const handleAddMember = (memberId: string) => {
    const member = availableMembers.find((m) => m.id === memberId);
    if (member) {
      setMembers([...members, { ...member, role: 'Contributor' }]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleUpdateRole = (memberId: string, role: string) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)));
  };

  useEffect(() => {
    if (formType === 'add' && members.length === 0 && user) {
      setMembers([
        {
          id: user.email,
          name: user.name,
          email: user.email,
          avatar: user.image,
          role: 'Job Owner',
          isOwner: true,
        },
      ]);
    }
  }, [formType, user]);

  useEffect(() => {
    const fetchAvailableMembers = async () => {
      if (!orgID) return;

      try {
        const response = await axios.get(
          `/api/search-members?orgID=${orgID}&limit=100`
        );
        if (response.status === 200) {
          const membersData = response.data.members.map((m: any) => ({
            id: m._id?.toString() || m.email,
            name: m.name,
            email: m.email,
            avatar: m.image,
          }));
          setAvailableMembers(membersData);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    fetchAvailableMembers();
  }, [orgID]);

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      if (!career?.province) {
        setProvince(defaultProvince.name);
        setValue('province', defaultProvince.name);
      }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      if (!career?.location) {
        setCity(cities[0].name);
        setValue('city', cities[0].name);
      }
    };
    parseProvinces();
  }, [career, setValue]);

  useEffect(() => {
    setValue('employmentType', employmentType);
    setValue('country', country);
  }, [employmentType, country, setValue]);

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndContinue = async () => {
    if (currentStep === 0) {
      const fieldsToValidate = [
        'jobTitle',
        'description',
        'employmentType',
        'workSetup',
        'province',
        'city',
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

  const saveCareerWithoutRedirect = async (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast('Minimum salary cannot be greater than maximum salary', 1300);
      return;
    }

    if (!savingCareerRef.current) {
      setIsSavingCareer(true);
      savingCareerRef.current = true;
      let userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
      const careerData = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        questions,
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting,
        orgID,
        requireVideo,
        salaryNegotiable,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        country,
        province,
        location: city,
        status,
        employmentType,
        secretPrompt,
        preScreeningQuestions,
      };

      try {
        const response = await axios.post('/api/add-career', careerData);
        if (response.status === 200) {
          candidateActionToast(
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
                Progress saved
              </span>
            </div>,
            1300,
            <i
              className='la la-check-circle'
              style={{ color: '#039855', fontSize: 32 }}
            ></i>
          );
        }
      } catch (error) {
        errorToast('Failed to save progress', 1300);
      } finally {
        savingCareerRef.current = false;
        setIsSavingCareer(false);
      }
    }
  };

  const updateCareerWithoutRedirect = async (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast('Minimum salary cannot be greater than maximum salary', 1300);
      return;
    }
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const updatedCareer = {
      _id: career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      country,
      province,
      location: city,
      employmentType,
      secretPrompt,
      preScreeningQuestions,
    };
    try {
      setIsSavingCareer(true);
      const response = await axios.post('/api/update-career', updatedCareer);
      if (response.status === 200) {
        candidateActionToast(
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
              Progress saved
            </span>
          </div>,
          1300,
          <i
            className='la la-check-circle'
            style={{ color: '#039855', fontSize: 32 }}
          ></i>
        );
      }
    } catch (error) {
      console.error(error);
      errorToast('Failed to save progress', 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CareerDetailsAndTeamAccess
            jobTitle={jobTitle}
            setJobTitle={updateJobTitle}
            employmentType={employmentType}
            setEmploymentType={updateEmploymentType}
            workSetup={workSetup}
            setWorkSetup={updateWorkSetup}
            country={country}
            setCountry={setCountry}
            province={province}
            setProvince={updateProvince}
            city={city}
            setCity={updateCity}
            provinceList={provinceList}
            setProvinceList={setProvinceList}
            cityList={cityList}
            setCityList={setCityList}
            salaryNegotiable={salaryNegotiable}
            setSalaryNegotiable={setSalaryNegotiable}
            minimumSalary={minimumSalary}
            setMinimumSalary={setMinimumSalary}
            maximumSalary={maximumSalary}
            setMaximumSalary={setMaximumSalary}
            description={description}
            setDescription={updateDescription}
            screeningSetting={screeningSetting}
            setScreeningSetting={setScreeningSetting}
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
            preScreeningQuestions={preScreeningQuestions}
            onAddCustomQuestion={() => {
              console.log('Add custom question');
            }}
            onAddSuggestedQuestion={(questionId) => {
              console.log('Add suggested question', questionId);
            }}
            members={members}
            availableMembers={availableMembers}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateRole}
            currentUser={currentUserData}
            errors={errors}
          />
        );
      case 1:
        return (
          <>
            <CVReviewSettingsCard
              screeningSetting={screeningSetting}
              setScreeningSetting={setScreeningSetting || (() => {})}
              secretPrompt={secretPrompt}
              setSecretPrompt={setSecretPrompt || (() => {})}
            />
            <PreScreeningQuestionsCard
              questions={preScreeningQuestions}
              onAddCustom={() => {
                // TODO: Implement add custom question functionality
                console.log('Add custom question');
              }}
              onAddSuggested={(questionId) => {
                // TODO: Implement add suggested question functionality
                console.log('Add suggested question', questionId);
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <AIInterviewSettingsCard
              interviewScreeningSetting={interviewScreeningSetting}
              setInterviewScreeningSetting={setInterviewScreeningSetting}
              requireVideo={requireVideo}
              setRequireVideo={setRequireVideo}
              secretPrompt={interviewSecretPrompt}
              setSecretPrompt={setInterviewSecretPrompt}
            />
            <AIInterviewQuestionsCard
              questions={questions}
              setQuestions={setQuestions}
              jobTitle={jobTitle}
              description={description}
              hasError={stepErrors[2]}
            />
          </>
        );
      case 3:
        return <SegmentPlaceholder title='Pipeline Stages' />;
      case 4:
        return <SegmentPlaceholder title='Review Career' />;
      default:
        return null;
    }
  };

  return (
    <div className='col'>
      <CareerFormStepActions
        currentStep={currentStep}
        jobTitle={jobTitle}
        isFormValid={isFormValid()}
        isSavingCareer={isSavingCareer}
        onSaveUnpublished={() => {
          if (formType === 'add') {
            confirmSaveCareer('inactive');
          } else {
            updateCareer('inactive');
          }
        }}
        onSaveAndContinue={handleSaveAndContinue}
      />

      <SegmentedFormLayout
        currentStep={currentStep}
        steps={steps}
        onStepClick={handleStepClick}
      >
        <div className='form-step-content'>
          <div className='form-step-main'>{renderStepContent()}</div>
          {(currentStep === 0 || currentStep === 1 || currentStep === 2) && (
            <div className='form-step-sidebar'>
              <Tip />
            </div>
          )}
        </div>
      </SegmentedFormLayout>

      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => saveCareer(action)}
        />
      )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation
          title={formType === 'add' ? 'Saving career...' : 'Updating career...'}
          subtext={`Please wait while we are ${
            formType === 'add' ? 'saving' : 'updating'
          } the career`}
        />
      )}
    </div>
  );
}
