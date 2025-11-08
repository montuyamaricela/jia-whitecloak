'use client';

import { useEffect, useRef, useState } from 'react';
import InterviewQuestionGeneratorV2 from '../InterviewQuestionGeneratorV2';
import philippineCitiesAndProvinces from '../../../../../public/philippines-locations.json';
import { candidateActionToast, errorToast } from '@/lib/Utils';
import { useAppContext } from '@/lib/context/AppContext';
import axios from 'axios';
import CareerActionModal from '../CareerActionModal';
import FullScreenLoadingAnimation from '../FullScreenLoadingAnimation';
import CareerFormHeader from './CareerFormHeader';
import CareerInformationCard from './CareerInformationCard';
import SettingsCard from './SettingsCard';
import AdditionalInformationCard from './AdditionalInformationCard';

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
  const [jobTitle, setJobTitle] = useState(career?.jobTitle || '');
  const [description, setDescription] = useState(career?.description || '');
  const [workSetup, setWorkSetup] = useState(career?.workSetup || '');
  const [workSetupRemarks, setWorkSetupRemarks] = useState(
    career?.workSetupRemarks || ''
  );
  const [screeningSetting, setScreeningSetting] = useState(
    career?.screeningSetting || 'Good Fit and above'
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
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState('');
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);

  const isFormValid = () => {
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

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      if (!career?.province) {
        setProvince(defaultProvince.name);
      }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      if (!career?.location) {
        setCity(cities[0].name);
      }
    };
    parseProvinces();
  }, [career]);

  return (
    <div className='col'>
      <CareerFormHeader
        formType={formType}
        isFormValid={isFormValid()}
        isSavingCareer={isSavingCareer}
        onSaveUnpublished={() => {
          if (formType === 'add') {
            confirmSaveCareer('inactive');
          } else {
            updateCareer('inactive');
          }
        }}
        onSavePublished={() => {
          if (formType === 'add') {
            confirmSaveCareer('active');
          } else {
            updateCareer('active');
          }
        }}
        onCancel={() => {
          setShowEditModal?.(false);
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          gap: 16,
          alignItems: 'flex-start',
          marginTop: 16,
        }}
      >
        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <CareerInformationCard
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            description={description}
            setDescription={setDescription}
          />

          <InterviewQuestionGeneratorV2
            questions={questions}
            setQuestions={(questions) => setQuestions(questions)}
            jobTitle={jobTitle}
            description={description}
          />
        </div>

        <div
          style={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <SettingsCard
            screeningSetting={screeningSetting}
            setScreeningSetting={setScreeningSetting}
            requireVideo={requireVideo}
            setRequireVideo={setRequireVideo}
          />

          <AdditionalInformationCard
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            workSetup={workSetup}
            setWorkSetup={setWorkSetup}
            workSetupRemarks={workSetupRemarks}
            setWorkSetupRemarks={setWorkSetupRemarks}
            salaryNegotiable={salaryNegotiable}
            setSalaryNegotiable={setSalaryNegotiable}
            minimumSalary={minimumSalary}
            setMinimumSalary={setMinimumSalary}
            maximumSalary={maximumSalary}
            setMaximumSalary={setMaximumSalary}
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
          />
        </div>
      </div>
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
