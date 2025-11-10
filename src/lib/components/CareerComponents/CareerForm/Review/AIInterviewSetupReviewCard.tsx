'use client';

import Image from 'next/image';
import ReviewCard from './ReviewCard';

export default function AIInterviewSetupReviewCard({
  isExpanded,
  onToggle,
  onEdit,
  interviewScreeningSetting,
  requireVideo,
  interviewSecretPrompt,
  interviewQuestions = [],
}: {
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  interviewScreeningSetting?: string;
  requireVideo?: boolean;
  interviewSecretPrompt?: string;
  interviewQuestions?: any[];
}) {
  const getScreeningBadgeText = (setting: string) => {
    if (setting?.includes('Good Fit')) return 'Good Fit';
    if (setting?.includes('Strong Fit')) return 'Strong Fit';
    return setting || '—';
  };

  const totalQuestions = interviewQuestions.reduce(
    (total, category) => total + (category?.questions?.length || 0),
    0
  );

  return (
    <ReviewCard
      title='AI Interview Setup'
      isExpanded={isExpanded}
      onToggle={onToggle}
      onEdit={onEdit}
    >
      <div className='review-section-container'>
        <div className='review-row-horizontal-group'>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>AI Interview Screening</div>
            <div className='review-value-with-badge-inline'>
              <span>Automatically endorse candidates who are </span>
              <span className='review-badge review-badge-blue'>
                {getScreeningBadgeText(interviewScreeningSetting || '')}
              </span>
              <span> and above</span>
            </div>
          </div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row-horizontal-group'>
          <div className='review-row '>
            <div className='required-video-section'>
              <div className='review-label'>Require Video on Interview</div>
              <div className='review-value'>
                {requireVideo ? (
                  <>
                    <span>Yes</span>{' '}
                    <span className='review-badge review-badge-success'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M13.3333 4L6 11.3333L2.66667 8'
                          stroke='#039855'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                  </>
                ) : (
                  'No'
                )}
              </div>
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
            <span>AI Interview Secret Prompt</span>
          </div>
          <div className='review-value review-secret-prompt'>
            {interviewSecretPrompt ? (
              <ul>
                {interviewSecretPrompt.split('\n').map((line, index) => (
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
            <span>Interview Questions</span>
            <span className='review-badge review-badge-gray'>
              {totalQuestions}
            </span>
          </div>
          <div className='review-interview-questions'>
            {interviewQuestions.length > 0 ? (
              (() => {
                let questionNumber = 0;
                return interviewQuestions
                  .filter(
                    (category) =>
                      category.questions && category.questions.length > 0
                  )
                  .map((category, catIndex) => (
                    <div key={catIndex} className='review-question-category'>
                      <div className='review-question-category-title'>
                        {category.category}
                      </div>
                      <div className='review-question-category-questions'>
                        {category.questions.map(
                          (question: any, qIndex: number) => {
                            questionNumber++;
                            return (
                              <div
                                key={qIndex}
                                style={{ background: 'transparent' }}
                              >
                                {questionNumber}. {question.question}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ));
              })()
            ) : (
              <div className='review-value'>—</div>
            )}
          </div>
        </div>
      </div>
    </ReviewCard>
  );
}
