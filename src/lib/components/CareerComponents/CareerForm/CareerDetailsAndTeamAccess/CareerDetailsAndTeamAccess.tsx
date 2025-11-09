'use client';

import CareerInformationCard from './CareerInformationCard';
import JobDescriptionCard from './JobDescriptionCard';
import TeamAccessCard from './TeamAccessCard';
import CVReviewSettingsCard from '../CVReview/CVReviewSettingsCard';
import PreScreeningQuestionsCard from '../CVReview/PreScreeningQuestionsCard';
import '@/lib/styles/career-details-styles.scss';

export default function CareerDetailsAndTeamAccess({
  // Career Information
  jobTitle,
  setJobTitle,
  employmentType,
  setEmploymentType,
  workSetup,
  setWorkSetup,
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  provinceList,
  setProvinceList,
  cityList,
  setCityList,
  salaryNegotiable,
  setSalaryNegotiable,
  minimumSalary,
  setMinimumSalary,
  maximumSalary,
  setMaximumSalary,
  // Job Description
  description,
  setDescription,
  // Team Access
  members = [],
  availableMembers = [],
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  currentUser,
  // CV Review Settings
  screeningSetting = 'Good Fit and Above',
  setScreeningSetting,
  secretPrompt = '',
  setSecretPrompt,
  // Pre-Screening Questions
  preScreeningQuestions = [],
  onAddCustomQuestion,
  onAddSuggestedQuestion,
}: {
  // Career Information
  jobTitle: string;
  setJobTitle: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  provinceList: any[];
  setProvinceList: (value: any[]) => void;
  cityList: any[];
  setCityList: (value: any[]) => void;
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
  // Job Description
  description: string;
  setDescription: (value: string) => void;
  // Team Access
  members?: any[];
  availableMembers?: any[];
  onAddMember?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: string) => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  // CV Review Settings
  screeningSetting?: string;
  setScreeningSetting?: (value: string) => void;
  secretPrompt?: string;
  setSecretPrompt?: (value: string) => void;
  // Pre-Screening Questions
  preScreeningQuestions?: any[];
  onAddCustomQuestion?: () => void;
  onAddSuggestedQuestion?: (questionId: number) => void;
}) {
  return (
    <div className='career-details-container'>
      <div className='career-details-content'>
        <CareerInformationCard
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          workSetup={workSetup}
          setWorkSetup={setWorkSetup}
          country={country}
          setCountry={setCountry}
          province={province}
          setProvince={setProvince}
          city={city}
          setCity={setCity}
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
        />
        <JobDescriptionCard
          description={description}
          setDescription={setDescription}
        />
        <TeamAccessCard
          members={members}
          availableMembers={availableMembers}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
          onUpdateRole={onUpdateRole}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
