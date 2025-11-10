'use client';

import Image from 'next/image';
import ReviewCard from './ReviewCard';

export default function CVReviewAndPreScreeningReviewCard({
  isExpanded,
  onToggle,
  screeningSetting,
  secretPrompt,
  preScreeningQuestions = [],
}: {
  isExpanded: boolean;
  onToggle: () => void;
  screeningSetting?: string;
  secretPrompt?: string;
  preScreeningQuestions?: any[];
}) {
  const getScreeningBadgeText = (setting: string) => {
    if (setting?.includes('Good Fit')) return 'Good Fit';
    if (setting?.includes('Strong Fit')) return 'Strong Fit';
    return setting || '—';
  };

  return (
    <ReviewCard
      title='CV Review & Pre-Screening Questions'
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className='review-section-container'>
        <div className='review-row-horizontal-group'>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>CV Screening</div>
            <div className='review-value-with-badge-inline'>
              <span>Automatically endorse candidates who are </span>
              <span className='review-badge review-badge-blue'>
                {getScreeningBadgeText(screeningSetting || '')}
              </span>
              <span> and above</span>
            </div>
          </div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row review-row-column-center'>
          <div className='review-label-with-icon'>
            <Image
              src='/icons/career/auto-awesome.svg'
              alt='auto awesome'
              width={20}
              height={20}
            />
            <span>CV Secret Prompt</span>
          </div>
          <div className='review-value review-secret-prompt'>
            {secretPrompt ? (
              <ul>
                {secretPrompt.split('\n').map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              '—'
            )}
          </div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row review-row-column-center'>
          <div className='review-label-with-badge'>
            <span>Pre-Screening Questions</span>
            <span className='review-badge review-badge-gray'>
              {preScreeningQuestions.length}
            </span>
          </div>
          <div className='review-questions-list-simple'>
            {preScreeningQuestions.length > 0 ? (
              preScreeningQuestions.map((question, index) => (
                <div
                  key={question.id || index}
                  className='review-question-item'
                >
                  <div className='review-question-number-and-text'>
                    {index + 1}. {question.question}
                  </div>
                  {(question.type === 'dropdown' ||
                    question.type === 'checkboxes') &&
                    question.options &&
                    question.options.length > 0 && (
                      <ul className='review-question-options-list'>
                        {question.options.map((option: string, idx: number) => (
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    )}
                  {question.type === 'range' &&
                    (question.minimum || question.maximum) && (
                      <ul className='review-question-options-list'>
                        <li>
                          Preferred: {question.currency || 'PHP'}{' '}
                          {question.minimum
                            ? Number(question.minimum).toLocaleString()
                            : '0'}{' '}
                          - {question.currency || 'PHP'}{' '}
                          {question.maximum
                            ? Number(question.maximum).toLocaleString()
                            : '∞'}
                        </li>
                      </ul>
                    )}
                  {question.preferredAnswer && (
                    <ul className='review-question-options-list'>
                      <li>Preferred: {question.preferredAnswer}</li>
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className='review-value'>—</div>
            )}
          </div>
        </div>
      </div>
    </ReviewCard>
  );
}
