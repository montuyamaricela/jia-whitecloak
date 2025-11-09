'use client';

import { useState } from 'react';
import '@/lib/styles/career-details-styles.scss';

const suggestedQuestions = [
  {
    id: 1,
    title: 'Notice Period',
    question: 'How long is your notice period?',
    type: 'dropdown' as const,
    options: ['Immediately', '< 30 days', '> 30 days'],
  },
  {
    id: 2,
    title: 'Work Setup',
    question: 'How often are you willing to report to the office each week?',
    type: 'dropdown' as const,
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
    type: 'range' as const,
    currency: 'PHP',
  },
];

const questionTypes = [
  { value: 'short-answer', label: 'Short Answer', icon: 'user' },
  { value: 'long-answer', label: 'Long Answer', icon: 'align-left' },
  { value: 'dropdown', label: 'Dropdown', icon: 'user' },
  { value: 'checkboxes', label: 'Checkboxes', icon: 'user' },
  { value: 'range', label: 'Range', icon: 'sliders' },
];

type QuestionType = 'short-answer' | 'long-answer' | 'dropdown' | 'checkboxes' | 'range';

interface CustomQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  currency?: string;
}

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
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState<string | null>(null);
  const [questionCountToAsk, setQuestionCountToAsk] = useState<number | null>(null);

  const handleAddQuestion = (questionId: number) => {
    setAddedQuestions((prev) => new Set(prev).add(questionId));
    const question = suggestedQuestions.find((q) => q.id === questionId);
    if (question) {
      setQuestionValues((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          type: question.type,
          allOptions: question.options ? [...question.options] : undefined,
        },
      }));
    }
  };

  const handleDeleteQuestion = (questionId: number | string) => {
    if (typeof questionId === 'number') {
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
    } else {
      setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }
  };

  const handleAddCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: `custom-${Date.now()}`,
      question: '',
      type: 'short-answer',
    };
    setCustomQuestions((prev) => [...prev, newQuestion]);
    setIsAddingCustom(true);
  };

  const handleUpdateCustomQuestion = (id: string, field: string, value: any) => {
    setCustomQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleChangeQuestionType = (id: string | number, type: QuestionType) => {
    if (typeof id === 'number') {
      // Suggested question
      setQuestionValues((prev) => {
        const updated: any = { ...prev[id], type };

        if (type === 'dropdown' || type === 'checkboxes') {
          const originalQuestion = suggestedQuestions.find((q) => q.id === id);
          updated.allOptions = originalQuestion?.options || [''];
        } else if (type === 'range') {
          updated.currency = 'PHP';
        }

        return { ...prev, [id]: updated };
      });
    } else {
      // Custom question
      const updatedQuestion: Partial<CustomQuestion> = { type };

      if (type === 'dropdown' || type === 'checkboxes') {
        updatedQuestion.options = [''];
      } else if (type === 'range') {
        updatedQuestion.currency = 'PHP';
      }

      setCustomQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
      );
    }
    setShowTypeDropdown(null);
  };

  const handleAddOption = (questionId: number | string) => {
    if (typeof questionId === 'number') {
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
    } else {
      setCustomQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, options: [...(q.options || []), ''] }
            : q
        )
      );
    }
  };

  const handleUpdateOption = (
    questionId: number | string,
    optionIndex: number,
    value: string
  ) => {
    if (typeof questionId === 'number') {
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
    } else {
      setCustomQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.options) {
            const newOptions = [...q.options];
            newOptions[optionIndex] = value;
            return { ...q, options: newOptions };
          }
          return q;
        })
      );
    }
  };

  const handleRemoveOption = (questionId: number | string, optionIndex: number) => {
    if (typeof questionId === 'number') {
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
    } else {
      setCustomQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.options) {
            return {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex),
            };
          }
          return q;
        })
      );
    }
  };

  const handleUpdateRange = (
    questionId: number | string,
    field: 'minimum' | 'maximum',
    value: string
  ) => {
    if (typeof questionId === 'number') {
      setQuestionValues((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [field]: value,
        },
      }));
    }
  };

  const renderCustomQuestionField = (question: CustomQuestion) => {
    return (
      <div key={question.id} className='added-question-wrapper'>
        <button
          type='button'
          className='question-drag-handle'
          aria-label='Drag to reorder question'
        >
          <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
            <path d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z' fill='#A4A7AE'/>
          </svg>
        </button>
        <div className='question-field'>
          <div className='question-header'>
            <div className='question-label-wrapper'>
              <input
                type='text'
                className='question-label-input'
                value={question.question}
                onChange={(e) =>
                  handleUpdateCustomQuestion(question.id, 'question', e.target.value)
                }
                placeholder='Enter your question'
              />
            </div>
            <div className='question-type-selector'>
              <button
                type='button'
                className='question-type-dropdown-trigger'
                onClick={() =>
                  setShowTypeDropdown(
                    showTypeDropdown === question.id ? null : question.id
                  )
                }
              >
                {getTypeIcon(question.type)}
                <span>{getTypeLabel(question.type)}</span>
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path d='M5 8.33333L10 13.3333L15 8.33333' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </button>
              {showTypeDropdown === question.id && (
                <div className='question-type-dropdown-menu'>
                  {questionTypes.map((type) => (
                    <button
                      key={type.value}
                      type='button'
                      className={`question-type-option ${
                        question.type === type.value ? 'selected' : ''
                      }`}
                      onClick={() =>
                        handleChangeQuestionType(question.id, type.value as QuestionType)
                      }
                    >
                      {getTypeIcon(type.value as QuestionType)}
                      <span>{type.label}</span>
                      {question.type === type.value && (
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='checkmark'>
                          <path d='M13.3333 4L6 11.3333L2.66667 8' stroke='#5E5ADB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {question.type === 'short-answer' && (
            <div className='question-preview-field'>
              <input
                type='text'
                className='preview-input'
                placeholder='Short answer text'
                disabled
              />
            </div>
          )}

          {question.type === 'long-answer' && (
            <div className='question-preview-field'>
              <textarea
                className='preview-textarea'
                placeholder='Long answer text'
                rows={4}
                disabled
              />
            </div>
          )}

          {(question.type === 'dropdown' || question.type === 'checkboxes') && (
            <div className='dropdown-options-list'>
              {question.options?.map((option, index) => (
                <div key={index} className='dropdown-option-item'>
                  <div className='option-input-container'>
                    <div className='option-number'>{index + 1}</div>
                    <input
                      type='text'
                      className='option-input'
                      value={option}
                      onChange={(e) =>
                        handleUpdateOption(question.id, index, e.target.value)
                      }
                      placeholder='Enter option'
                    />
                  </div>
                  <button
                    type='button'
                    className='remove-option-button'
                    onClick={() => handleRemoveOption(question.id, index)}
                  >
                    <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                      <path d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z' fill='#666'/>
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type='button'
                className='add-option-button'
                onClick={() => handleAddOption(question.id)}
              >
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 4V12M4 8H12' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <span>Add Option</span>
              </button>
            </div>
          )}

          {question.type === 'range' && (
            <div className='range-inputs'>
              <div className='range-input-group'>
                <label className='range-label'>Minimum</label>
                <div className='currency-input'>
                  <span className='currency-symbol'>{question.currency || 'PHP'}</span>
                  <input
                    type='number'
                    className='range-input'
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
                  <span className='currency-symbol'>{question.currency || 'PHP'}</span>
                  <input
                    type='number'
                    className='range-input'
                    placeholder='60,000'
                  />
                  <select className='currency-select'>
                    <option>PHP</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className='question-actions'>
            <div className='question-divider'></div>
            <button
              type='button'
              className='delete-question-button'
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                <path d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
              <span>Delete Question</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'short-answer':
        return (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path d='M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z' stroke='currentColor' strokeWidth='1.5'/>
            <path d='M3 14C3 11.7909 5.23858 10 8 10C10.7614 10 13 11.7909 13 14' stroke='currentColor' strokeWidth='1.5'/>
          </svg>
        );
      case 'long-answer':
        return (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path d='M2 3H14M2 6H14M2 9H14M2 12H10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
          </svg>
        );
      case 'dropdown':
      case 'checkboxes':
        return (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <circle cx='8' cy='5' r='2' stroke='currentColor' strokeWidth='1.5'/>
            <path d='M3 13C3 10.7909 5.23858 9 8 9C10.7614 9 13 10.7909 13 13' stroke='currentColor' strokeWidth='1.5'/>
          </svg>
        );
      case 'range':
        return (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <circle cx='4' cy='4' r='1.5' fill='currentColor'/>
            <circle cx='12' cy='4' r='1.5' fill='currentColor'/>
            <circle cx='4' cy='12' r='1.5' fill='currentColor'/>
            <circle cx='12' cy='12' r='1.5' fill='currentColor'/>
          </svg>
        );
    }
  };

  const getTypeLabel = (type: QuestionType) => {
    const typeObj = questionTypes.find((t) => t.value === type);
    return typeObj?.label || type;
  };

  const renderSuggestedQuestionField = (question: typeof suggestedQuestions[0]) => {
    const isAdded = addedQuestions.has(question.id);
    if (!isAdded) return null;

    const currentType = (questionValues[question.id]?.type || question.type) as QuestionType;

    if (currentType === 'dropdown' || currentType === 'checkboxes') {
      const isNoticePeriod = question.id === 1;
      const allOptions = isNoticePeriod
        ? questionValues[question.id]?.allOptions || question.options
        : [...question.options, ...(questionValues[question.id]?.options || [])];

      return (
        <div className='added-question-wrapper'>
          <button type='button' className='question-drag-handle' aria-label='Drag to reorder question'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z' fill='#A4A7AE'/>
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='question-type-selector'>
                <button
                  type='button'
                  className='question-type-dropdown-trigger'
                  onClick={() =>
                    setShowTypeDropdown(
                      showTypeDropdown === `suggested-${question.id}` ? null : `suggested-${question.id}`
                    )
                  }
                >
                  {getTypeIcon(currentType)}
                  <span>{getTypeLabel(currentType)}</span>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path d='M5 8.33333L10 13.3333L15 8.33333' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
                {showTypeDropdown === `suggested-${question.id}` && (
                  <div className='question-type-dropdown-menu'>
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type='button'
                        className={`question-type-option ${
                          currentType === type.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          handleChangeQuestionType(question.id, type.value as QuestionType)
                        }
                      >
                        {getTypeIcon(type.value as QuestionType)}
                        <span>{type.label}</span>
                        {currentType === type.value && (
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='checkmark'>
                            <path d='M13.3333 4L6 11.3333L2.66667 8' stroke='#5E5ADB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='dropdown-options-list'>
              {allOptions.map((option, index) => {
                const isCustomOption = !isNoticePeriod && index >= question.options.length;
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
                                const currentOptions = prev[question.id]?.allOptions || question.options;
                                const newOptions = [...currentOptions];
                                newOptions[index] = e.target.value;
                                return {
                                  ...prev,
                                  [question.id]: { ...prev[question.id], allOptions: newOptions },
                                };
                              });
                            } else {
                              handleUpdateOption(question.id, index - question.options.length, e.target.value);
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
                              const currentOptions = prev[question.id]?.allOptions || question.options;
                              const newOptions = currentOptions.filter((_, idx) => idx !== index);
                              return {
                                ...prev,
                                [question.id]: { ...prev[question.id], allOptions: newOptions },
                              };
                            });
                          } else {
                            handleRemoveOption(question.id, index - question.options.length);
                          }
                        }}
                      >
                        <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                          <path d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z' fill='#666'/>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              <button type='button' className='add-option-button' onClick={() => handleAddOption(question.id)}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 4V12M4 8H12' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <span>Add Option</span>
              </button>
            </div>
            <div className='question-divider'></div>
            <div className='question-actions'>
              <button type='button' className='delete-question-button' onClick={() => handleDeleteQuestion(question.id)}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <span>Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentType === 'short-answer') {
      return (
        <div className='added-question-wrapper'>
          <button type='button' className='question-drag-handle' aria-label='Drag to reorder question'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z' fill='#A4A7AE'/>
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='question-type-selector'>
                <button
                  type='button'
                  className='question-type-dropdown-trigger'
                  onClick={() =>
                    setShowTypeDropdown(
                      showTypeDropdown === `suggested-${question.id}` ? null : `suggested-${question.id}`
                    )
                  }
                >
                  {getTypeIcon(currentType)}
                  <span>{getTypeLabel(currentType)}</span>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path d='M5 8.33333L10 13.3333L15 8.33333' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
                {showTypeDropdown === `suggested-${question.id}` && (
                  <div className='question-type-dropdown-menu'>
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type='button'
                        className={`question-type-option ${
                          currentType === type.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          handleChangeQuestionType(question.id, type.value as QuestionType)
                        }
                      >
                        {getTypeIcon(type.value as QuestionType)}
                        <span>{type.label}</span>
                        {currentType === type.value && (
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='checkmark'>
                            <path d='M13.3333 4L6 11.3333L2.66667 8' stroke='#5E5ADB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='question-preview-field'>
              <input
                type='text'
                className='preview-input'
                placeholder='Short answer text'
                disabled
              />
            </div>
            <div className='question-actions'>
              <div className='question-divider'></div>
              <button type='button' className='delete-question-button' onClick={() => handleDeleteQuestion(question.id)}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <span>Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentType === 'long-answer') {
      return (
        <div className='added-question-wrapper'>
          <button type='button' className='question-drag-handle' aria-label='Drag to reorder question'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z' fill='#A4A7AE'/>
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='question-type-selector'>
                <button
                  type='button'
                  className='question-type-dropdown-trigger'
                  onClick={() =>
                    setShowTypeDropdown(
                      showTypeDropdown === `suggested-${question.id}` ? null : `suggested-${question.id}`
                    )
                  }
                >
                  {getTypeIcon(currentType)}
                  <span>{getTypeLabel(currentType)}</span>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path d='M5 8.33333L10 13.3333L15 8.33333' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
                {showTypeDropdown === `suggested-${question.id}` && (
                  <div className='question-type-dropdown-menu'>
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type='button'
                        className={`question-type-option ${
                          currentType === type.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          handleChangeQuestionType(question.id, type.value as QuestionType)
                        }
                      >
                        {getTypeIcon(type.value as QuestionType)}
                        <span>{type.label}</span>
                        {currentType === type.value && (
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='checkmark'>
                            <path d='M13.3333 4L6 11.3333L2.66667 8' stroke='#5E5ADB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='question-preview-field'>
              <textarea
                className='preview-textarea'
                placeholder='Long answer text'
                rows={4}
                disabled
              />
            </div>
            <div className='question-actions'>
              <div className='question-divider'></div>
              <button type='button' className='delete-question-button' onClick={() => handleDeleteQuestion(question.id)}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <span>Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentType === 'range') {
      const minimum = questionValues[question.id]?.minimum || '';
      const maximum = questionValues[question.id]?.maximum || '';

      return (
        <div className='added-question-wrapper'>
          <button type='button' className='question-drag-handle' aria-label='Drag to reorder question'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path d='M5.83333 3.33333H3.33333V5.83333H5.83333V3.33333ZM5.83333 8.33333H3.33333V10.8333H5.83333V8.33333ZM5.83333 13.3333H3.33333V15.8333H5.83333V13.3333ZM10.8333 3.33333H8.33333V5.83333H10.8333V3.33333ZM10.8333 8.33333H8.33333V10.8333H10.8333V8.33333ZM10.8333 13.3333H8.33333V15.8333H10.8333V13.3333ZM15.8333 3.33333H13.3333V5.83333H15.8333V3.33333ZM15.8333 8.33333H13.3333V10.8333H15.8333V8.33333ZM15.8333 13.3333H13.3333V15.8333H15.8333V13.3333Z' fill='#A4A7AE'/>
            </svg>
          </button>
          <div className='question-field'>
            <div className='question-header'>
              <div className='question-label-wrapper'>
                <label className='question-label'>{question.question}</label>
              </div>
              <div className='question-type-selector'>
                <button
                  type='button'
                  className='question-type-dropdown-trigger'
                  onClick={() =>
                    setShowTypeDropdown(
                      showTypeDropdown === `suggested-${question.id}` ? null : `suggested-${question.id}`
                    )
                  }
                >
                  {getTypeIcon(currentType)}
                  <span>{getTypeLabel(currentType)}</span>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path d='M5 8.33333L10 13.3333L15 8.33333' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
                {showTypeDropdown === `suggested-${question.id}` && (
                  <div className='question-type-dropdown-menu'>
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type='button'
                        className={`question-type-option ${
                          currentType === type.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          handleChangeQuestionType(question.id, type.value as QuestionType)
                        }
                      >
                        {getTypeIcon(type.value as QuestionType)}
                        <span>{type.label}</span>
                        {currentType === type.value && (
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='checkmark'>
                            <path d='M13.3333 4L6 11.3333L2.66667 8' stroke='#5E5ADB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='range-inputs'>
              <div className='range-input-group'>
                <label className='range-label'>Minimum</label>
                <div className='currency-input'>
                  <span className='currency-symbol'>{question.currency}</span>
                  <input type='number' className='range-input' value={minimum} onChange={(e) => handleUpdateRange(question.id, 'minimum', e.target.value)} placeholder='40,000'/>
                  <select className='currency-select'><option>PHP</option></select>
                </div>
              </div>
              <div className='range-input-group'>
                <label className='range-label'>Maximum</label>
                <div className='currency-input'>
                  <span className='currency-symbol'>{question.currency}</span>
                  <input type='number' className='range-input' value={maximum} onChange={(e) => handleUpdateRange(question.id, 'maximum', e.target.value)} placeholder='60,000'/>
                  <select className='currency-select'><option>PHP</option></select>
                </div>
              </div>
            </div>
            <div className='question-actions'>
              <div className='question-divider'></div>
              <button type='button' className='delete-question-button' onClick={() => handleDeleteQuestion(question.id)}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M2 4H14M12.6667 4V13.3333C12.6667 14.0667 12.0667 14.6667 11.3333 14.6667H4.66667C3.93333 14.6667 3.33333 14.0667 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93333 5.93333 1.33333 6.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667V4' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333' stroke='currentColor' strokeWidth='1.33' strokeLinecap='round' strokeLinejoin='round'/>
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

  const totalQuestionsCount = addedQuestions.size + customQuestions.length;

  return (
    <div className='career-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <div className='heading-with-badge'>
            <span className='heading-text'>2. Pre-Screening Questions (optional)</span>
            <div className='question-count-badge'>
              <span>{totalQuestionsCount}</span>
            </div>
          </div>
          <button type='button' className='add-custom-button' onClick={handleAddCustomQuestion}>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path d='M10 4.16667V15.8333' stroke='#FFFFFF' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
              <path d='M4.16667 10H15.8333' stroke='#FFFFFF' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
            <span>Add custom</span>
          </button>
        </div>
      </div>
      <div className='card-content'>
        <div className='pre-screening-questions-section'>
          {(addedQuestions.size > 0 || customQuestions.length > 0) && (
            <>
              <div className='added-questions-list'>
                {suggestedQuestions.filter((q) => addedQuestions.has(q.id)).map((question) => (
                  <div key={question.id}>{renderSuggestedQuestionField(question)}</div>
                ))}
                {customQuestions.map((question) => renderCustomQuestionField(question))}
              </div>

              <div className='category-question-count' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', color: '#414651', fontWeight: 500 }}># of questions to ask</span>
                <input
                  type='number'
                  value={questionCountToAsk !== null ? questionCountToAsk : ''}
                  max={totalQuestionsCount}
                  min={0}
                  style={{
                    maxWidth: '60px',
                    height: '40px',
                    padding: '8px 12px',
                    border: '1px solid #D5D7DA',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                  onChange={(e) => {
                    let value = parseInt(e.target.value);

                    if (isNaN(value)) {
                      value = null;
                    }

                    if (value > totalQuestionsCount) {
                      value = totalQuestionsCount;
                    }

                    e.target.value = value === null ? '' : value.toString();
                    setQuestionCountToAsk(value);
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={totalQuestionsCount.toString()}
                />
              </div>

              <div style={{ margin: '0 0 24px 0', borderBottom: '1px solid #EAECF5' }}></div>
            </>
          )}

          <div className='suggested-questions-section'>
            <div className='suggested-questions-heading'>Suggested Pre-screening Questions:</div>
            <div className='suggested-questions-list'>
              {suggestedQuestions.map((question) => {
                const isAdded = addedQuestions.has(question.id);
                return (
                  <div key={question.id} className='suggested-question-item'>
                    <div className='question-content'>
                      <div className='question-title' style={{ color: isAdded ? '#D5D7DA' : undefined }}>
                        {question.title}
                      </div>
                      <div className='question-text' style={{ color: isAdded ? '#D5D7DA' : undefined }}>
                        {question.question}
                      </div>
                    </div>
                    <button type='button' className='add-question-button' onClick={() => handleAddQuestion(question.id)} disabled={isAdded}>
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
