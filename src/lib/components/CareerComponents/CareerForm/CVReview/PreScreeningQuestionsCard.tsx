'use client';

import { useState } from 'react';
import '@/lib/styles/career-details-styles.scss';

const suggestedQuestions = [
  {
    id: 1,
    title: 'Notice Period',
    question: 'How long is your notice period?',
    type: 'dropdown',
    options: ['Immediately', '< 30 days', '> 30 days'],
  },
  {
    id: 2,
    title: 'Work Setup',
    question: 'How often are you willing to report to the office each week?',
    type: 'dropdown',
    options: [
      'At most 1-2x a week',
      'At most 3-4x a week',
      'Open to fully onsite work',
      'Only open to fully remote work',
    ],
  },
  {
    id: 3,
    title: 'Asking Salary',
    question: 'How much is your expected monthly salary?',
    type: 'range',
    currency: 'PHP',
  },
];

export default function PreScreeningQuestionsCard({
  questions = [],
  onAddCustom,
  onAddSuggested,
}: {
  questions?: any[];
  onAddCustom?: () => void;
  onAddSuggested?: (questionData: any) => void;
}) {
  const [addedQuestions, setAddedQuestions] = useState<Set<number>>(new Set());
  const [questionValues, setQuestionValues] = useState<Record<number, any>>({});

  const handleAddQuestion = (questionId: number) => {
    setAddedQuestions((prev) => new Set(prev).add(questionId));
    // For Notice Period (id: 1), initialize all options in state so they're editable
    const question = suggestedQuestions.find((q) => q.id === questionId);
    if (questionId === 1 && question) {
      setQuestionValues((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          allOptions: [...question.options],
        },
      }));
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    setAddedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    setQuestionValues((prev) => {
      const newValues = { ...prev };
      delete newValues[questionId];
      return newValues;
    });
  };

  const handleAddOption = (questionId: number) => {
    const isNoticePeriod = questionId === 1;
    setQuestionValues((prev) => {
      if (isNoticePeriod) {
        const currentOptions =
          prev[questionId]?.allOptions ||
          suggestedQuestions.find((q) => q.id === questionId)?.options ||
          [];
        return {
          ...prev,
          [questionId]: {
            ...prev[questionId],
            allOptions: [...currentOptions, ''],
          },
        };
      } else {
        const currentOptions = prev[questionId]?.options || [];
        return {
          ...prev,
          [questionId]: {
            ...prev[questionId],
            options: [...currentOptions, ''],
          },
        };
      }
    });
  };

  const handleUpdateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestionValues((prev) => {
      const currentOptions = prev[questionId]?.options || [];
      const newOptions = [...currentOptions];
      newOptions[optionIndex] = value;
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          options: newOptions,
        },
      };
    });
  };

  const handleRemoveOption = (questionId: number, optionIndex: number) => {
    setQuestionValues((prev) => {
      const currentOptions = prev[questionId]?.options || [];
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          options: currentOptions.filter((_, idx) => idx !== optionIndex),
        },
      };
    });
  };

  const handleUpdateRange = (
    questionId: number,
    field: 'minimum' | 'maximum',
    value: string
  ) => {
    setQuestionValues((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const renderQuestionField = (question: (typeof suggestedQuestions)[0]) => {
    const isAdded = addedQuestions.has(question.id);
    if (!isAdded) return null;

    if (question.type === 'dropdown') {
      const isNoticePeriod = question.id === 1;
      // For Notice Period, use allOptions from state; otherwise use original + custom
      const allOptions = isNoticePeriod
        ? questionValues[question.id]?.allOptions || question.options
        : [
            ...question.options,
            ...(questionValues[question.id]?.options || []),
          ];

      return (
        <div className='added-question-wrapper'>
          <button
            type='button'
            className='question-drag-handle'
            aria-label='Drag to reorder question'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z'
                fill='#A4A7AE'
              />
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='dropdown-input-wrapper'>
                <div className='dropdown-preview'>
                  <svg
                    className='dropdown-icon'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M5 8.33333L10 13.3333L15 8.33333'
                      stroke='currentColor'
                      strokeWidth='1.67'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span>Dropdown</span>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M5 8.33333L10 13.3333L15 8.33333'
                      stroke='currentColor'
                      strokeWidth='1.67'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='dropdown-options-list'>
              {allOptions.map((option, index) => {
                const isCustomOption =
                  !isNoticePeriod && index >= question.options.length;
                // For Notice Period, all options are editable; otherwise only custom ones
                const isEditable = isNoticePeriod || isCustomOption;

                return (
                  <div key={index} className='dropdown-option-item'>
                    <div className='option-input-container'>
                      <div className='option-number'>{index + 1}</div>
                      {isEditable ? (
                        <input
                          type='text'
                          className='option-input'
                          value={option}
                          onChange={(e) => {
                            if (isNoticePeriod) {
                              setQuestionValues((prev) => {
                                const currentOptions =
                                  prev[question.id]?.allOptions ||
                                  question.options;
                                const newOptions = [...currentOptions];
                                newOptions[index] = e.target.value;
                                return {
                                  ...prev,
                                  [question.id]: {
                                    ...prev[question.id],
                                    allOptions: newOptions,
                                  },
                                };
                              });
                            } else {
                              handleUpdateOption(
                                question.id,
                                index - question.options.length,
                                e.target.value
                              );
                            }
                          }}
                          placeholder='Enter option'
                        />
                      ) : (
                        <span className='option-text'>{option}</span>
                      )}
                    </div>
                    {isEditable && (
                      <button
                        type='button'
                        className='remove-option-button'
                        onClick={() => {
                          if (isNoticePeriod) {
                            setQuestionValues((prev) => {
                              const currentOptions =
                                prev[question.id]?.allOptions ||
                                question.options;
                              const newOptions = currentOptions.filter(
                                (_, idx) => idx !== index
                              );
                              return {
                                ...prev,
                                [question.id]: {
                                  ...prev[question.id],
                                  allOptions: newOptions,
                                },
                              };
                            });
                          } else {
                            handleRemoveOption(
                              question.id,
                              index - question.options.length
                            );
                          }
                        }}
                      >
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z'
                            fill='#666'
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type='button'
                className='add-option-button'
                onClick={() => handleAddOption(question.id)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 4V12M4 8H12'
                    stroke='currentColor'
                    strokeWidth='1.67'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>Add Option</span>
              </button>
            </div>
            <div className='question-divider'></div>

            <div className='question-actions'>
              <button
                type='button'
                className='delete-question-button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4'
                    stroke='currentColor'
                    strokeWidth='1.33'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333'
                    stroke='currentColor'
                    strokeWidth='1.33'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (question.type === 'range') {
      const minimum = questionValues[question.id]?.minimum || '';
      const maximum = questionValues[question.id]?.maximum || '';

      return (
        <div className='added-question-wrapper'>
          <button
            type='button'
            className='question-drag-handle'
            aria-label='Drag to reorder question'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z'
                fill='#A4A7AE'
              />
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='question-type-badge range'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle cx='4' cy='4' r='1.5' fill='currentColor' />
                  <circle cx='12' cy='4' r='1.5' fill='currentColor' />
                  <circle cx='4' cy='12' r='1.5' fill='currentColor' />
                  <circle cx='12' cy='12' r='1.5' fill='currentColor' />
                </svg>
                <span>Range</span>
              </div>
            </div>
            <div className='range-inputs'>
              <div className='range-input-group'>
                <label className='range-label'>Minimum</label>
                <div className='currency-input'>
                  <span className='currency-symbol'>{question.currency}</span>
                  <input
                    type='number'
                    className='range-input'
                    value={minimum}
                    onChange={(e) =>
                      handleUpdateRange(question.id, 'minimum', e.target.value)
                    }
                    placeholder='40,000'
                  />
                  <select className='currency-select'>
                    <option>PHP</option>
                  </select>
                </div>
              </div>
              <div className='range-input-group'>
                <label className='range-label'>Maximum</label>
                <div className='currency-input'>
                  <span className='currency-symbol'>{question.currency}</span>
                  <input
                    type='number'
                    className='range-input'
                    value={maximum}
                    onChange={(e) =>
                      handleUpdateRange(question.id, 'maximum', e.target.value)
                    }
                    placeholder='60,000'
                  />
                  <select className='currency-select'>
                    <option>PHP</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='question-actions'>
              <div className='question-divider'></div>
              <button
                type='button'
                className='delete-question-button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4'
                    stroke='currentColor'
                    strokeWidth='1.33'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333'
                    stroke='currentColor'
                    strokeWidth='1.33'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const getAddedQuestionsData = () => {
    return Array.from(addedQuestions).filter(
      (id) => !suggestedQuestions.some((q) => q.id === id)
    );
  };

  return (
    <div className='career-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <div className='heading-with-badge'>
            <span className='heading-text'>
              2. Pre-Screening Questions (optional)
            </span>
            <div className='question-count-badge'>
              <span>{addedQuestions.size}</span>
            </div>
          </div>
          <button
            type='button'
            className='add-custom-button'
            onClick={onAddCustom}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 4.16667V15.8333'
                stroke='#FFFFFF'
                strokeWidth='1.67'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M4.16667 10H15.8333'
                stroke='#FFFFFF'
                strokeWidth='1.67'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>Add custom</span>
          </button>
        </div>
      </div>
      <div className='card-content'>
        <div className='pre-screening-questions-section'>
          {addedQuestions.size > 0 && (
            <div className='added-questions-list'>
              {suggestedQuestions
                .filter((q) => addedQuestions.has(q.id))
                .map((question) => (
                  <div key={question.id}>{renderQuestionField(question)}</div>
                ))}
            </div>
          )}

          {addedQuestions.size > 0 && (
            <div
              style={{ margin: '24px 0', borderBottom: '1px solid #EAECF5' }}
            ></div>
          )}

          <div className='suggested-questions-section'>
            <div className='suggested-questions-heading'>
              Suggested Pre-screening Questions:
            </div>
            <div className='suggested-questions-list'>
              {suggestedQuestions.map((question) => {
                const isAdded = addedQuestions.has(question.id);
                return (
                  <div key={question.id} className='suggested-question-item'>
                    <div className='question-content'>
                      <div
                        className='question-title'
                        style={{ color: isAdded ? '#D5D7DA' : undefined }}
                      >
                        {question.title}
                      </div>
                      <div
                        className='question-text'
                        style={{ color: isAdded ? '#D5D7DA' : undefined }}
                      >
                        {question.question}
                      </div>
                    </div>
                    <button
                      type='button'
                      className='add-question-button'
                      onClick={() => handleAddQuestion(question.id)}
                      disabled={isAdded}
                    >
                      <span>{isAdded ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
