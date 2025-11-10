'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import philippineCitiesAndProvinces from '../../../../../public/philippines-locations.json';
import { errorToast } from '@/lib/Utils';
import { useAppContext } from '@/lib/context/AppContext';
import CareerActionModal from '../CareerActionModal';
import FullScreenLoadingAnimation from '../FullScreenLoadingAnimation';
import CareerFormStepActions from './CareerFormStepActions';
import CareerDetailsAndTeamAccess from './CareerDetailsAndTeamAccess/CareerDetailsAndTeamAccess';
import SegmentedFormLayout from './SegmentedFormLayout';
import SegmentPlaceholder from './SegmentPlaceholder';
import Tip from './CareerDetailsAndTeamAccess/Tip';
import CVReviewSettingsCard from './CVReview/CVReviewSettingsCard';
import PreScreeningQuestionsCard from './CVReview/PreScreeningQuestionsCard';
import AIInterviewSettingsCard from './InterviewSetup/AIInterviewSettingsCard';
import AIInterviewQuestionsCard from './InterviewSetup/AIInterviewQuestionsCard';
import Review from './Review/Review';
import { hasStepData } from './schema/careerFormSchema';
import { saveCareerOperation } from './utils/careerOperations';
import * as segmentHandlers from './utils/segmentHandlers';
import * as memberHandlers from './utils/memberHandlers';
import { useCareerFormState } from './hooks/useCareerFormState';

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

  const formState = useCareerFormState(career, setValue, trigger);

  useEffect(() => {
    register('jobTitle', {
      required: 'This is a required field.',
      validate: (value) =>
        value.trim().length > 0 || 'This is a required field.',
    });
    register('description', {
      required: 'This is a required field.',
      validate: (value) =>
        value.trim().length > 0 || 'This is a required field.',
    });
    register('employmentType', { required: 'This is a required field.' });
    register('workSetup', { required: 'This is a required field.' });
    register('province', { required: 'This is a required field.' });
    register('city', { required: 'This is a required field.' });
    register('minimumSalary', {
      validate: (value) => {
        const isNegotiable = watch('salaryNegotiable');

        if (isNegotiable || value === 'negotiable') {
          return true;
        }

        if (!value || value === '' || value === '0') {
          return 'This is a required field.';
        }

        const minSalary = Number(value);
        const maxSalaryValue = watch('maximumSalary');
        const maxSalary = Number(maxSalaryValue);

        if (isNaN(minSalary)) {
          return 'Minimum salary must be a valid number';
        }

        if (minSalary <= 0) {
          return 'Minimum salary must be greater than 0';
        }

        if (
          maxSalaryValue &&
          maxSalaryValue !== '' &&
          maxSalaryValue !== 'negotiable' &&
          maxSalary > 0 &&
          minSalary > maxSalary
        ) {
          return 'Minimum salary cannot be greater than maximum salary';
        }

        return true;
      },
    });
    register('maximumSalary', {
      validate: (value) => {
        const isNegotiable = watch('salaryNegotiable');

        if (isNegotiable || value === 'negotiable') {
          return true;
        }

        if (!value || value === '' || value === '0') {
          return 'This is a required field.';
        }

        const maxSalary = Number(value);
        const minSalaryValue = watch('minimumSalary');
        const minSalary = Number(minSalaryValue);

        if (isNaN(maxSalary)) {
          return 'Maximum salary must be a valid number';
        }

        if (maxSalary <= 0) {
          return 'Maximum salary must be greater than 0';
        }

        if (
          minSalaryValue &&
          minSalaryValue !== '' &&
          minSalaryValue !== 'negotiable' &&
          minSalary > 0 &&
          maxSalary < minSalary
        ) {
          return 'Maximum salary cannot be less than minimum salary';
        }

        return true;
      },
    });
  }, [register, watch]);

  type StepState =
    | 'active-pending'
    | 'active-in-progress'
    | 'active-completed'
    | 'inactive'
    | 'pending-empty'
    | 'error';

  const {
    currentStep,
    setCurrentStep,
    stepErrors,
    setStepErrors,
    jobTitle,
    updateJobTitle,
    description,
    updateDescription,
    workSetup,
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
    updateEmploymentType,
    requireVideo,
    setRequireVideo,
    salaryNegotiable,
    setSalaryNegotiable,
    minimumSalary,
    updateMinimumSalary,
    maximumSalary,
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
  } = formState;

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
      const basicsValid =
        jobTitle?.trim().length > 0 &&
        description?.trim().length > 0 &&
        workSetup?.trim().length > 0;

      if (salaryNegotiable) {
        return basicsValid;
      }

      return (
        basicsValid &&
        minimumSalary?.trim().length > 0 &&
        maximumSalary?.trim().length > 0
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

  const buildCareerData = () => ({
    _id: career?._id,
    jobTitle,
    description,
    workSetup,
    workSetupRemarks,
    questions,
    screeningSetting,
    requireVideo,
    salaryNegotiable,
    minimumSalary,
    maximumSalary,
    country,
    province,
    city,
    employmentType,
    secretPrompt,
    preScreeningQuestions,
    orgID,
  });

  const updateCareer = async (status: string) => {
    await saveCareerOperation({
      actionType: 'update',
      shouldRedirect: true,
      status,
      careerData: buildCareerData(),
      user,
      onSavingStateChange: setIsSavingCareer,
    });
  };

  const confirmSaveCareer = (status: string) => {
    if (
      !salaryNegotiable &&
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

    await saveCareerOperation({
      actionType: 'create',
      shouldRedirect: true,
      status,
      careerData: buildCareerData(),
      user,
      savingRef: savingCareerRef,
      onSavingStateChange: setIsSavingCareer,
    });
  };

  const handleAddMember = (memberId: string) => {
    memberHandlers.handleAddMember(
      memberId,
      members,
      availableMembers,
      setMembers
    );
  };

  const handleRemoveMember = (memberId: string) => {
    memberHandlers.handleRemoveMember(memberId, members, setMembers);
  };

  const handleUpdateRole = (memberId: string, role: string) => {
    memberHandlers.handleUpdateRole(memberId, role, members, setMembers);
  };

  useEffect(() => {
    if (formType === 'add' && members.length === 0 && user) {
      setMembers([memberHandlers.initializeOwner(user)]);
    }
  }, [formType, user, members.length]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersData = await memberHandlers.fetchAvailableMembers(orgID);
      setAvailableMembers(membersData);
    };

    fetchMembers();
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
    segmentHandlers.handleStepClick(stepIndex, currentStep, setCurrentStep);
  };

  const handleNextStep = () => {
    segmentHandlers.handleNextStep(currentStep, steps.length, setCurrentStep);
  };

  const handleSaveAndContinue = async () => {
    await segmentHandlers.handleSaveAndContinue({
      currentStep,
      stepErrors,
      setStepErrors,
      trigger,
      questions,
      handleNextStep,
    });
  };

  const saveCareerWithoutRedirect = async (status: string) => {
    await saveCareerOperation({
      actionType: 'create',
      shouldRedirect: false,
      status,
      careerData: buildCareerData(),
      user,
      savingRef: savingCareerRef,
      onSavingStateChange: setIsSavingCareer,
    });
  };

  const updateCareerWithoutRedirect = async (status: string) => {
    await saveCareerOperation({
      actionType: 'update',
      shouldRedirect: false,
      status,
      careerData: buildCareerData(),
      user,
      onSavingStateChange: setIsSavingCareer,
    });
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
            setMinimumSalary={updateMinimumSalary}
            maximumSalary={maximumSalary}
            setMaximumSalary={updateMaximumSalary}
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
              onQuestionsChange={(updatedQuestions) => {
                setPreScreeningQuestions(updatedQuestions);
              }}
              onAddCustom={() => {
                console.log('Add custom question');
              }}
              onAddSuggested={(questionId) => {
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
        return (
          <Review
            jobTitle={jobTitle}
            employmentType={employmentType}
            workSetup={workSetup}
            country={country}
            province={province}
            city={city}
            minimumSalary={minimumSalary}
            maximumSalary={maximumSalary}
            salaryNegotiable={salaryNegotiable}
            description={description}
            members={members}
            screeningSetting={screeningSetting}
            secretPrompt={secretPrompt}
            preScreeningQuestions={preScreeningQuestions}
            interviewScreeningSetting={interviewScreeningSetting}
            requireVideo={requireVideo}
            interviewSecretPrompt={interviewSecretPrompt}
            interviewQuestions={questions}
            pipelineStages={[]}
          />
        );
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
