// TODO (Job Portal) - Check API

'use client';

import Loader from '@/lib/components/commonV2/Loader';
import styles from '@/lib/styles/screens/uploadCV.module.scss';
import { useAppContext } from '@/lib/context/ContextV2';
import { assetConstants, pathConstants } from '@/lib/utils/constantsV2';
import { checkFile } from '@/lib/utils/helpersV2';
import { CORE_API_URL } from '@/lib/Utils';
import axios from 'axios';
import Markdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';

export default function () {
  const fileInputRef = useRef(null);
  const { user, setModalType } = useAppContext();
  const [buildingCV, setBuildingCV] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [digitalCV, setDigitalCV] = useState(null);
  const [editingCV, setEditingCV] = useState(null);
  const [file, setFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [userCV, setUserCV] = useState(null);
  const [career, setCareer] = useState(null);
  const [preScreeningAnswers, setPreScreeningAnswers] = useState({});
  const cvSections = [
    'Introduction',
    'Current Position',
    'Contact Info',
    'Skills',
    'Experience',
    'Education',
    'Projects',
    'Certifications',
    'Awards',
  ];
  const step = ['Submit CV', 'Pre-Screening Questions', 'Review Next Steps'];
  const stepStatus = ['Completed', 'Pending', 'In Progress'];

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  }

  function handleEditCV(section) {
    setEditingCV(section);

    if (section != null) {
      setTimeout(() => {
        const sectionDetails = document.getElementById(section);

        if (sectionDetails) {
          sectionDetails.focus();
        }
      }, 100);
    }
  }

  function handleFile(files) {
    const file = checkFile(files);

    if (file) {
      setFile(file);
      handleFileSubmit(file);
    }
  }

  function handleFileChange(e) {
    const files = e.target.files;

    if (files.length > 0) {
      handleFile(files);
    }
  }

  function handleModal() {
    setModalType('jobDescription');
  }

  function handleRedirection(type) {
    if (type == 'dashboard') {
      window.location.href = pathConstants.dashboard;
    }

    if (type == 'interview') {
      sessionStorage.setItem('interviewRedirection', pathConstants.dashboard);
      window.location.href = `/interview/${interview.interviewID}`;
    }
  }

  function handleRemoveFile(e) {
    e.stopPropagation();
    e.target.value = '';

    setFile(null);
    setHasChanges(false);
    setUserCV(null);

    const storedCV = localStorage.getItem('userCV');

    if (storedCV != 'null') {
      setDigitalCV(storedCV);
    } else {
      setDigitalCV(null);
    }
  }

  function handleReviewCV() {
    const parsedUserCV = JSON.parse(digitalCV);
    const formattedCV = {};

    cvSections.forEach((section, index) => {
      formattedCV[section] = parsedUserCV.digitalCV[index].content.trim() || '';
    });

    setFile(parsedUserCV.fileInfo);
    setUserCV(formattedCV);
  }

  function handleUploadCV() {
    fileInputRef.current.click();
  }

  function processState(index, isAdvance = false) {
    const currentStepIndex = step.indexOf(currentStep);

    if (currentStepIndex == index) {
      if (index == stepStatus.length - 1) {
        return stepStatus[0];
      }

      return isAdvance || userCV || buildingCV ? stepStatus[2] : stepStatus[1];
    }

    if (currentStepIndex > index) {
      return stepStatus[0];
    }

    return stepStatus[1];
  }

  function formatNumberWithCommas(value: string | number): string {
    if (!value) return '';
    const numStr = String(value).replace(/,/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  }

  function parseNumberFromFormatted(value: string): string {
    if (!value) return '';
    return value.replace(/,/g, '');
  }

  useEffect(() => {
    const storedSelectedCareer = sessionStorage.getItem('selectedCareer');
    const storedCV = localStorage.getItem('userCV');

    if (storedCV && storedCV != 'null') {
      setDigitalCV(storedCV);
    }

    if (storedSelectedCareer) {
      const parseStoredSelectedCareer = JSON.parse(storedSelectedCareer);
      fetchInterview(parseStoredSelectedCareer.id);
    } else {
      alert('No application is currently being managed.');
      window.location.href = pathConstants.dashboard;
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('hasChanges', JSON.stringify(hasChanges));
  }, [hasChanges]);

  function fetchInterview(interviewID) {
    axios({
      method: 'POST',
      url: '/api/job-portal/fetch-interviews',
      data: { email: user.email, interviewID },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.error);
          window.location.href = pathConstants.dashboard;
        } else {
          if (result[0].cvStatus) {
            alert('This application has already been processed.');
            window.location.href = pathConstants.dashboard;
          } else {
            const interviewData = result[0];
            setInterview(interviewData);

            if (interviewData) {
              setCareer(interviewData);
            }

            console.log(interviewData);
            setCurrentStep(step[0]);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        alert('Error fetching existing applied jobs.');
        window.location.href = pathConstants.dashboard;
        console.log(err);
      });
  }

  function handleCVSubmit() {
    if (editingCV != null) {
      alert('Please save the changes first.');
      return false;
    }

    const allEmpty = Object.values(userCV).every(
      (value: any) => value.trim() == ''
    );

    if (allEmpty) {
      alert('No details to be save.');
      return false;
    }

    let parsedDigitalCV = {
      errorRemarks: null,
      digitalCV: null,
    };

    if (digitalCV) {
      parsedDigitalCV = JSON.parse(digitalCV);

      if (parsedDigitalCV.errorRemarks) {
        alert(
          'Please fix the errors in the CV first.\n\n' +
            parsedDigitalCV.errorRemarks
        );
        return false;
      }
    }

    if (hasChanges) {
      const formattedUserCV = cvSections.map((section) => ({
        name: section,
        content: userCV[section]?.trim() || '',
      }));

      parsedDigitalCV.digitalCV = formattedUserCV;

      const data = {
        name: user.name,
        cvData: parsedDigitalCV,
        email: user.email,
        fileInfo: null,
      };

      if (file) {
        data.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }

      axios({
        method: 'POST',
        url: `/api/whitecloak/save-cv`,
        data,
      })
        .then(() => {
          localStorage.setItem(
            'userCV',
            JSON.stringify({ ...data, ...data.cvData })
          );
          setCurrentStep(step[1]);
        })
        .catch((err) => {
          alert('Error saving CV. Please try again.');
          console.log(err);
        })
        .finally(() => {
          setHasChanges(false);
        });
    } else {
      setCurrentStep(step[1]);
    }
  }

  function handlePreScreeningSubmit() {
    const hasPreScreeningQuestions =
      career?.preScreeningQuestions && career.preScreeningQuestions.length > 0;

    if (hasPreScreeningQuestions) {
      const allAnswered = career.preScreeningQuestions.every((q: any) => {
        const answer = preScreeningAnswers[q.id];
        if (!answer) return false;

        if (q.type === 'range') {
          return answer.minimum !== undefined && answer.maximum !== undefined;
        }

        return answer && answer.toString().trim() !== '';
      });

      if (!allAnswered) {
        alert('Please answer all pre-screening questions before proceeding.');
        return false;
      }
    }

    setLoading(true);

    axios({
      url: '/api/whitecloak/screen-cv',
      method: 'POST',
      data: {
        interviewID: interview.interviewID,
        userEmail: user.email,
        preScreeningAnswers: preScreeningAnswers,
      },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.message);
          setLoading(false);
        } else {
          setScreeningResult(result);
          setCurrentStep(step[2]);
          setLoading(false);
        }
      })
      .catch((err) => {
        alert('Error processing application. Please try again.');
        setLoading(false);
        console.log(err);
      });
  }

  function handleFileSubmit(file) {
    setBuildingCV(true);
    setHasChanges(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fName', file.name);
    formData.append('userEmail', user.email);

    axios({
      method: 'POST',
      url: `${CORE_API_URL}/upload-cv`,
      data: formData,
    })
      .then((res) => {
        axios({
          method: 'POST',
          url: `/api/whitecloak/digitalize-cv`,
          data: { chunks: res.data.cvChunks },
        })
          .then((res) => {
            const result = res.data.result;
            const parsedUserCV = JSON.parse(result);
            const formattedCV = {};

            cvSections.forEach((section, index) => {
              formattedCV[section] =
                parsedUserCV.digitalCV[index].content.trim();
            });

            setDigitalCV(result);
            setUserCV(formattedCV);
          })
          .catch((err) => {
            alert('Error building CV. Please try again.');
            console.log(err);
          })
          .finally(() => {
            setBuildingCV(false);
          });
      })
      .catch((err) => {
        alert('Error building CV. Please try again.');
        setBuildingCV(false);
        console.log(err);
      });
  }

  return (
    <>
      {loading && <Loader loaderData={''} loaderType={''} />}

      {interview && (
        <div className={styles.uploadCVSection}>
          <div className={styles.uploadCVContainer}>
            <div className={styles.uploadCVHeader}>
              {interview.organization && interview.organization.image && (
                <img alt='' src={interview.organization.image} />
              )}
              <div className={styles.textContainer}>
                <span className={styles.tag}>You're applying for</span>
                <span className={styles.title}>{interview.jobTitle}</span>
                {interview.organization && interview.organization.name && (
                  <span className={styles.name}>
                    {interview.organization.name}
                  </span>
                )}
                <span className={styles.description} onClick={handleModal}>
                  View job description
                </span>
              </div>
            </div>

            <div className={styles.stepContainer}>
              <div className={styles.step}>
                {step.map((_, index) => (
                  <div className={styles.stepBar} key={index}>
                    <img
                      alt=''
                      src={
                        assetConstants[
                          processState(index, true)
                            .toLowerCase()
                            .replace(' ', '_')
                        ]
                      }
                    />
                    {index < step.length - 1 && (
                      <hr
                        className={
                          styles[
                            processState(index).toLowerCase().replace(' ', '_')
                          ]
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.step}>
                {step.map((item, index) => (
                  <span
                    className={`${styles.stepDetails} ${
                      styles[
                        processState(index, true)
                          .toLowerCase()
                          .replace(' ', '_')
                      ]
                    }`}
                    key={index}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {currentStep == step[0] && (
              <>
                {!buildingCV && !userCV && !file && (
                  <div className={styles.cvManageContainer}>
                    <div
                      className={styles.cvContainer}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <img alt='' src={assetConstants.uploadV2} />
                      <button onClick={handleUploadCV}>Upload CV</button>
                      <span>
                        Choose or drag and drop a file here. Our AI tools will
                        automatically pre-fill your CV and also check how well
                        it matches the role.
                      </span>
                    </div>
                    <input
                      type='file'
                      accept='.pdf,.doc,.docx,.txt'
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />

                    <div className={styles.cvContainer}>
                      <img alt='' src={assetConstants.review} />
                      <button
                        className={`${digitalCV ? '' : 'disabled'}`}
                        disabled={!digitalCV}
                        onClick={handleReviewCV}
                      >
                        Review Current CV
                      </button>
                      <span>
                        Already uploaded a CV? Take a moment to review your
                        details before we proceed.
                      </span>
                    </div>
                  </div>
                )}

                {buildingCV && file && (
                  <div className={styles.cvDetailsContainer}>
                    <div className={styles.gradient}>
                      <div className={styles.cvDetailsCard}>
                        <span className={styles.sectionTitle}>
                          <img alt='' src={assetConstants.account} />
                          Submit CV
                        </span>
                        <div className={styles.detailsContainer}>
                          <span className={styles.fileTitle}>
                            <img alt='' src={assetConstants.completed} />
                            {file.name}
                          </span>
                          <div className={styles.loadingContainer}>
                            <img alt='' src={assetConstants.loading} />
                            <div className={styles.textContainer}>
                              <span className={styles.title}>
                                Extracting information from your CV...
                              </span>
                              <span className={styles.description}>
                                Jia is building your profile...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!buildingCV && userCV && (
                  <div className={styles.cvDetailsContainer}>
                    <div className={styles.gradient}>
                      <div className={styles.cvDetailsCard}>
                        <span className={styles.sectionTitle}>
                          <img alt='' src={assetConstants.account} />
                          Submit CV
                          <div className={styles.editIcon}>
                            <img
                              alt=''
                              src={
                                file ? assetConstants.xV2 : assetConstants.save
                              }
                              onClick={file ? handleRemoveFile : handleUploadCV}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                          <input
                            type='file'
                            accept='.pdf,.doc,.docx,.txt'
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </span>

                        <div className={styles.detailsContainer}>
                          {file ? (
                            <span className={styles.fileTitle}>
                              <img alt='' src={assetConstants.completed} />
                              {file.name}
                            </span>
                          ) : (
                            <span className={styles.fileTitle}>
                              <img alt='' src={assetConstants.fileV2} />
                              You can also upload your CV and let our AI
                              automatically fill in your profile information.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {cvSections.map((section, index) => (
                      <div key={index} className={styles.gradient}>
                        <div className={styles.cvDetailsCard}>
                          <span className={styles.sectionTitle}>
                            {section}

                            <div className={styles.editIcon}>
                              <img
                                alt=''
                                src={
                                  editingCV == section
                                    ? assetConstants.save
                                    : assetConstants.edit
                                }
                                onClick={() =>
                                  handleEditCV(
                                    editingCV == section ? null : section
                                  )
                                }
                                onContextMenu={(e) => e.preventDefault()}
                              />
                            </div>
                          </span>

                          <div className={styles.detailsContainer}>
                            {editingCV == section ? (
                              <textarea
                                id={section}
                                placeholder='Upload your CV to auto-fill this section.'
                                value={
                                  userCV && userCV[section]
                                    ? userCV[section]
                                    : ''
                                }
                                onBlur={(e) => {
                                  e.target.placeholder =
                                    'Upload your CV to auto-fill this section.';
                                }}
                                onChange={(e) => {
                                  setUserCV({
                                    ...userCV,
                                    [section]: e.target.value,
                                  });
                                  setHasChanges(true);
                                }}
                                onFocus={(e) => {
                                  e.target.placeholder = '';
                                }}
                              />
                            ) : (
                              <span
                                className={`${styles.sectionDetails} ${
                                  userCV &&
                                  userCV[section] &&
                                  userCV[section].trim()
                                    ? styles.withDetails
                                    : ''
                                }`}
                              >
                                <Markdown>
                                  {userCV &&
                                  userCV[section] &&
                                  userCV[section].trim()
                                    ? userCV[section].trim()
                                    : 'Upload your CV to auto-fill this section.'}
                                </Markdown>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={handleCVSubmit}>Submit CV</button>
                  </div>
                )}
              </>
            )}

            {currentStep == step[1] && (
              <div>
                {career?.preScreeningQuestions &&
                career.preScreeningQuestions.length > 0 ? (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <h2
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: '#000',
                          marginBottom: 8,
                        }}
                      >
                        Quick Pre-screening
                      </h2>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#666',
                          margin: 0,
                        }}
                      >
                        Just a few short questions to help your recruiters
                        assess you faster. Takes less than a minute.
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {career.preScreeningQuestions.map(
                        (question: any, index: number) => (
                          <div
                            key={question.id || index}
                            style={{
                              position: 'relative',
                              padding: '8px 0px 0px',
                              borderRadius: 24,
                              background:
                                'linear-gradient(90deg, rgba(159, 202, 237, 1) 0%, rgba(206, 182, 218, 1) 34%, rgba(235, 172, 201, 1) 67%, rgba(252, 206, 192, 1) 100%)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                padding: 8,
                                background: '#F8F9FC',
                                borderRadius: 24,
                              }}
                            >
                              <div
                                style={{
                                  padding: '4px 12px',
                                }}
                              >
                                <label
                                  style={{
                                    fontFamily: 'Satoshi, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    lineHeight: '1.5em',
                                    color: '#414651',
                                    display: 'block',
                                  }}
                                >
                                  {question.question}
                                </label>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  gap: 8,
                                  padding: '24px',
                                  background: '#FFFFFF',
                                  borderRadius: 16,
                                  boxShadow:
                                    'inset 0px 0px 2px 0px rgba(0, 16, 53, 0.16)',
                                }}
                              >
                                {question.type === 'short-answer' && (
                                  <input
                                    type='text'
                                    placeholder='Your answer'
                                    value={
                                      preScreeningAnswers[question.id] || ''
                                    }
                                    onChange={(e) =>
                                      setPreScreeningAnswers({
                                        ...preScreeningAnswers,
                                        [question.id]: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      fontFamily: 'Satoshi, sans-serif',
                                      fontSize: '16px',
                                      fontWeight: 500,
                                      lineHeight: '1.5em',
                                      color: '#181D27',
                                      border: '1px solid #D5D7DA',
                                      borderRadius: 8,
                                      padding: '10px 14px',
                                      outline: 'none',
                                      background: '#FFFFFF',
                                      boxShadow:
                                        '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                                      transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) =>
                                      (e.target.style.borderColor = '#999')
                                    }
                                    onBlur={(e) =>
                                      (e.target.style.borderColor = '#D5D7DA')
                                    }
                                  />
                                )}

                                {question.type === 'long-answer' && (
                                  <textarea
                                    rows={4}
                                    placeholder='Your answer'
                                    value={
                                      preScreeningAnswers[question.id] || ''
                                    }
                                    onChange={(e) =>
                                      setPreScreeningAnswers({
                                        ...preScreeningAnswers,
                                        [question.id]: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      fontFamily: 'Satoshi, sans-serif',
                                      fontSize: '16px',
                                      fontWeight: 500,
                                      lineHeight: '1.5em',
                                      color: '#181D27',
                                      border: '1px solid #D5D7DA',
                                      borderRadius: 8,
                                      padding: '10px 14px',
                                      outline: 'none',
                                      background: '#FFFFFF',
                                      boxShadow:
                                        '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                                      transition: 'border-color 0.2s',
                                      resize: 'vertical',
                                    }}
                                    onFocus={(e) =>
                                      (e.target.style.borderColor = '#999')
                                    }
                                    onBlur={(e) =>
                                      (e.target.style.borderColor = '#D5D7DA')
                                    }
                                  />
                                )}

                                {question.type === 'dropdown' && (
                                  <div className='dropdown-wrapper'>
                                    <CustomDropdown
                                      onSelectSetting={(value: string) =>
                                        setPreScreeningAnswers({
                                          ...preScreeningAnswers,
                                          [question.id]: value,
                                        })
                                      }
                                      screeningSetting={
                                        preScreeningAnswers[question.id] || ''
                                      }
                                      settingList={
                                        question.options?.map(
                                          (option: string) => ({
                                            name: option,
                                          })
                                        ) || []
                                      }
                                      placeholder='Select an option'
                                      borderColor='#D5D7DA'
                                      hideCheckmark={true}
                                    />
                                  </div>
                                )}

                                {question.type === 'checkboxes' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 12,
                                    }}
                                  >
                                    {question.options?.map(
                                      (option: string, optIndex: number) => (
                                        <label
                                          key={optIndex}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            cursor: 'pointer',
                                            fontFamily: 'Satoshi, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            lineHeight: '1.5em',
                                            color: '#181D27',
                                          }}
                                        >
                                          <input
                                            type='checkbox'
                                            checked={
                                              preScreeningAnswers[
                                                question.id
                                              ]?.includes(option) || false
                                            }
                                            onChange={(e) => {
                                              const currentAnswers =
                                                preScreeningAnswers[
                                                  question.id
                                                ] || [];
                                              const newAnswers = e.target
                                                .checked
                                                ? [...currentAnswers, option]
                                                : currentAnswers.filter(
                                                    (a: string) => a !== option
                                                  );
                                              setPreScreeningAnswers({
                                                ...preScreeningAnswers,
                                                [question.id]: newAnswers,
                                              });
                                            }}
                                            style={{
                                              width: 18,
                                              height: 18,
                                              cursor: 'pointer',
                                              accentColor: '#6366f1',
                                            }}
                                          />
                                          {option}
                                        </label>
                                      )
                                    )}
                                  </div>
                                )}

                                {question.type === 'range' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      width: '100%',
                                      // gridTemplateColumns: '1fr 1fr',
                                      gap: 16,
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <label
                                        style={{
                                          display: 'block',
                                          marginBottom: 6,
                                          fontFamily: 'Satoshi, sans-serif',
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          lineHeight: '1.4285714285714286em',
                                          color: '#414651',
                                        }}
                                      >
                                        Minimum Salary
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          border: '1px solid #E9EAEB',
                                          borderRadius: 8,
                                          padding: '10px 0px 10px 14px',
                                          gap: 8,
                                          background: '#FFFFFF',
                                          boxShadow:
                                            '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                                          transition: 'border-color 0.2s',
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontFamily: 'Satoshi, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            lineHeight: '1.5em',
                                            color: '#717680',
                                          }}
                                        >
                                          {question.currency === 'PHP'
                                            ? '₱'
                                            : question.currency === 'USD'
                                            ? '$'
                                            : question.currency === 'EUR'
                                            ? '€'
                                            : question.currency === 'GBP'
                                            ? '£'
                                            : question.currency === 'JPY'
                                            ? '¥'
                                            : question.currency === 'AUD'
                                            ? 'A$'
                                            : question.currency === 'CAD'
                                            ? 'C$'
                                            : question.currency === 'SGD'
                                            ? 'S$'
                                            : '₱'}
                                        </span>
                                        <input
                                          type='text'
                                          className={styles.salaryInput}
                                          placeholder='0'
                                          value={formatNumberWithCommas(
                                            preScreeningAnswers[question.id]
                                              ?.minimum || ''
                                          )}
                                          onChange={(e) => {
                                            const rawValue =
                                              parseNumberFromFormatted(
                                                e.target.value
                                              );
                                            // Only allow numbers
                                            if (
                                              rawValue === '' ||
                                              /^\d+$/.test(rawValue)
                                            ) {
                                              setPreScreeningAnswers({
                                                ...preScreeningAnswers,
                                                [question.id]: {
                                                  ...(preScreeningAnswers[
                                                    question.id
                                                  ] || {}),
                                                  minimum: rawValue,
                                                },
                                              });
                                            }
                                          }}
                                          style={{
                                            flex: 1,
                                            fontFamily: 'Satoshi, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            lineHeight: '1.5em',
                                            color: '#181D27',
                                            outline: 'none',
                                            background: 'transparent',
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <label
                                        style={{
                                          display: 'block',
                                          marginBottom: 6,
                                          fontFamily: 'Satoshi, sans-serif',
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          lineHeight: '1.4285714285714286em',
                                          color: '#414651',
                                        }}
                                      >
                                        Maximum Salary
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          border: '1px solid #E9EAEB',
                                          borderRadius: 8,
                                          padding: '10px 0px 10px 14px',
                                          gap: 8,
                                          background: '#FFFFFF',
                                          boxShadow:
                                            '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                                          transition: 'border-color 0.2s',
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontFamily: 'Satoshi, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            lineHeight: '1.5em',
                                            color: '#717680',
                                          }}
                                        >
                                          {question.currency === 'PHP'
                                            ? '₱'
                                            : question.currency === 'USD'
                                            ? '$'
                                            : question.currency === 'EUR'
                                            ? '€'
                                            : question.currency === 'GBP'
                                            ? '£'
                                            : question.currency === 'JPY'
                                            ? '¥'
                                            : question.currency === 'AUD'
                                            ? 'A$'
                                            : question.currency === 'CAD'
                                            ? 'C$'
                                            : question.currency === 'SGD'
                                            ? 'S$'
                                            : '₱'}
                                        </span>
                                        <input
                                          type='text'
                                          className={styles.salaryInput}
                                          placeholder='0'
                                          value={formatNumberWithCommas(
                                            preScreeningAnswers[question.id]
                                              ?.maximum || ''
                                          )}
                                          onChange={(e) => {
                                            const rawValue =
                                              parseNumberFromFormatted(
                                                e.target.value
                                              );
                                            // Only allow numbers
                                            if (
                                              rawValue === '' ||
                                              /^\d+$/.test(rawValue)
                                            ) {
                                              setPreScreeningAnswers({
                                                ...preScreeningAnswers,
                                                [question.id]: {
                                                  ...(preScreeningAnswers[
                                                    question.id
                                                  ] || {}),
                                                  maximum: rawValue,
                                                },
                                              });
                                            }
                                          }}
                                          style={{
                                            flex: 1,
                                            fontFamily: 'Satoshi, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            lineHeight: '1.5em',
                                            color: '#181D27',
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      position: 'relative',
                      padding: '8px 0px 0px',
                      borderRadius: 24,
                      background:
                        'linear-gradient(90deg, rgba(159, 202, 237, 1) 0%, rgba(206, 182, 218, 1) 34%, rgba(235, 172, 201, 1) 67%, rgba(252, 206, 192, 1) 100%)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        padding: '48px 24px',
                        background: '#F8F9FC',
                        borderRadius: 24,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: '#E8F5E9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          width='28'
                          height='28'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'
                            fill='#4CAF50'
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '18px',
                            fontWeight: 700,
                            lineHeight: '1.4em',
                            color: '#181D27',
                            marginBottom: 8,
                          }}
                        >
                          No pre-screening questions
                        </h3>
                        <p
                          style={{
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '1.5em',
                            color: '#717680',
                            margin: 0,
                          }}
                        >
                          Great! You can skip this step and proceed directly to
                          the next stage of your application.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 24,
                  }}
                >
                  <button
                    onClick={handlePreScreeningSubmit}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: '1.5em',
                      color: '#FFFFFF',
                      background: '#181D27',
                      border: '1px solid #181D27',
                      borderRadius: 999,
                      cursor: 'pointer',
                      boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = '0.9')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <span>
                      {career?.preScreeningQuestions &&
                      career.preScreeningQuestions.length > 0
                        ? 'Submit Answers'
                        : 'Continue'}
                    </span>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M8 5L12 10L8 15'
                        stroke='#FFFFFF'
                        strokeWidth='1.67'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {currentStep == step[2] && screeningResult && (
              <div className={styles.cvResultContainer}>
                {screeningResult.applicationStatus == 'Dropped' ? (
                  <>
                    <img alt='' src={assetConstants.userRejected} />
                    <span className={styles.title}>
                      This role may not be the best match.
                    </span>
                    <span className={styles.description}>
                      Based on your CV, it looks like this position might not be
                      the right fit at the moment.
                    </span>
                    <br />
                    <span className={styles.description}>
                      Review your screening results and see recommended next
                      steps.
                    </span>
                    <div className={styles.buttonContainer}>
                      <button onClick={() => handleRedirection('dashboard')}>
                        View Dashboard
                      </button>
                    </div>
                  </>
                ) : screeningResult.status == 'For AI Interview' ? (
                  <>
                    <img alt='' src={assetConstants.checkV3} />
                    <span className={styles.title}>
                      Hooray! You’re a strong fit for this role.
                    </span>
                    <span className={styles.description}>
                      Jia thinks you might be a great match.
                    </span>
                    <br />
                    <span className={`${styles.description} ${styles.bold}`}>
                      Ready to take the next step?
                    </span>
                    <span className={styles.description}>
                      You may start your AI interview now.
                    </span>
                    <div className={styles.buttonContainer}>
                      <button onClick={() => handleRedirection('interview')}>
                        Start AI Interview
                      </button>
                      <button
                        className='secondaryBtn'
                        onClick={() => handleRedirection('dashboard')}
                      >
                        View Dashboard
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <img alt='' src={assetConstants.userCheck} />
                    <span className={styles.title}>
                      Your CV is now being reviewed by the hiring team.
                    </span>
                    <span className={styles.description}>
                      We’ll be in touch soon with updates about your
                      application.
                    </span>
                    <div className={styles.buttonContainer}>
                      <button onClick={() => handleRedirection('dashboard')}>
                        View Dashboard
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
