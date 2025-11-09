'use client';

import '@/lib/styles/career-details-styles.scss';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';
import InterviewQuestionModal from '../../InterviewQuestionModal';
import FullScreenLoadingAnimation from '../../FullScreenLoadingAnimation';

const questionCategories = [
  'CV Validation / Experience',
  'Technical',
  'Behavioral',
  'Analytical',
  'Others',
];

export default function AIInterviewQuestionsCard({
  questions = [],
  setQuestions,
  jobTitle,
  description,
  hasError = false,
}: {
  questions?: any[];
  setQuestions: (questions: any[]) => void;
  jobTitle: string;
  description: string;
  hasError?: boolean;
}) {
  const {
    isGeneratingQuestions,
    showQuestionModal,
    setShowQuestionModal,
    questionModalGroupId,
    setQuestionModalGroupId,
    questionModalQuestion,
    setQuestionModalQuestion,
    addQuestion,
    editQuestion,
    deleteQuestion,
    generateAllQuestions,
    generateQuestions,
    handleReorderCategories,
    handleReorderQuestions,
  } = useInterviewQuestions(questions, setQuestions, jobTitle, description);

  const totalQuestionCount =
    questions?.reduce(
      (total, category) => total + (category?.questions?.length || 0),
      0
    ) || 0;

  const getCategoryQuestions = (category: string) => {
    return questions?.find((q) => q.category === category)?.questions || [];
  };

  const getCategoryGroup = (category: string) => {
    return questions?.find((q) => q.category === category);
  };

  return (
    <>
      <div
        className='career-card'
      >
        <div className='card-heading'>
          <div className='heading-wrapper'>
            <div className='heading-with-badge'>
              <span className='heading-text'>AI Interview Questions</span>
              <div
                className='question-count-badge'
              >
                <span>{totalQuestionCount}</span>
              </div>
            </div>
            <button
              type='button'
              className='generate-all-button'
              onClick={generateAllQuestions}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10 2.5L12.5 7.5L18 8.75L14 12.5L14.75 18L10 15.5L5.25 18L6 12.5L2 8.75L7.5 7.5L10 2.5Z'
                  stroke='#FFFFFF'
                  strokeWidth='1.67'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Generate all questions</span>
            </button>
          </div>
        </div>
        <div className='card-content'>
          {hasError && totalQuestionCount < 5 && (
            <div
              style={{
                fontSize: 14,
                color: '#F04438',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                gap: 6,
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8 1.33334L1.33334 13.3333H14.6667L8 1.33334Z'
                  stroke='#F04438'
                  strokeWidth='1.33'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M8 5.33334V8.66667M8 11.3333H8.00667'
                  stroke='#F04438'
                  strokeWidth='1.33'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Please add at least 5 interview questions.</span>
            </div>
          )}
          <div className='interview-questions-section'>
            <div className='main-container'>
              {questions.map((group, index) => {
                const categoryQuestions = group.questions || [];
                const hasQuestions = categoryQuestions.length > 0;

                return (
                  <div
                    key={group.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('categoryId', group.id.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const bounding = target.getBoundingClientRect();
                      const offset = bounding.y + bounding.height / 2;

                      if (e.clientY - offset > 0) {
                        target.style.borderBottom = '3px solid';
                        target.style.borderImage =
                          'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1';
                        target.style.borderTop = 'none';
                      } else {
                        target.style.borderTop = '3px solid';
                        target.style.borderImage =
                          'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1';
                        target.style.borderBottom = 'none';
                      }
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderTop = 'none';
                      e.currentTarget.style.borderBottom = 'none';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderTop = 'none';
                      e.currentTarget.style.borderBottom = 'none';

                      const bounding = e.currentTarget.getBoundingClientRect();
                      const offset = bounding.y + bounding.height / 2;
                      const insertIndex =
                        e.clientY - offset > 0 ? index + 1 : index;

                      const categoryId = Number(
                        e.dataTransfer.getData('categoryId')
                      );
                      if (!isNaN(categoryId) && categoryId !== group.id) {
                        handleReorderCategories(categoryId, insertIndex);
                      }

                      const draggedQuestionId =
                        e.dataTransfer.getData('questionId');
                      const fromCategoryId = Number(
                        e.dataTransfer.getData('fromCategoryId')
                      );
                      if (draggedQuestionId && !isNaN(fromCategoryId)) {
                        handleReorderQuestions(
                          draggedQuestionId,
                          fromCategoryId,
                          group.id
                        );
                      }
                    }}
                  >
                    <div className='question-category-section'>
                      <div className='category-heading'>{group.category}</div>
                      {hasQuestions && (
                        <div className='questions-container'>
                          {categoryQuestions.map(
                            (question: any, questionIndex: number) => (
                              <div
                                key={question.id}
                                className='interview-question-item'
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData(
                                    'questionId',
                                    question.id.toString()
                                  );
                                  e.dataTransfer.setData(
                                    'fromCategoryId',
                                    group.id.toString()
                                  );
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  const target = e.currentTarget;
                                  const bounding =
                                    target.getBoundingClientRect();
                                  const offset =
                                    bounding.y + bounding.height / 2;

                                  if (e.clientY - offset > 0) {
                                    target.style.borderBottom = '2px solid';
                                    target.style.borderImage =
                                      'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1';
                                    target.style.borderTop = 'none';
                                  } else {
                                    target.style.borderTop = '2px solid';
                                    target.style.borderImage =
                                      'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1';
                                    target.style.borderBottom = 'none';
                                  }
                                }}
                                onDragLeave={(e) => {
                                  e.currentTarget.style.borderTop = 'none';
                                  e.currentTarget.style.borderBottom = 'none';
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  e.currentTarget.style.borderTop = 'none';
                                  e.currentTarget.style.borderBottom = 'none';

                                  const draggedQuestionId =
                                    e.dataTransfer.getData('questionId');
                                  const fromCategoryId = Number(
                                    e.dataTransfer.getData('fromCategoryId')
                                  );

                                  if (
                                    draggedQuestionId &&
                                    !isNaN(fromCategoryId)
                                  ) {
                                    const bounding =
                                      e.currentTarget.getBoundingClientRect();
                                    const offset =
                                      bounding.y + bounding.height / 2;
                                    const insertIndex =
                                      e.clientY - offset > 0
                                        ? questionIndex + 1
                                        : questionIndex;

                                    handleReorderQuestions(
                                      draggedQuestionId,
                                      fromCategoryId,
                                      group.id,
                                      insertIndex
                                    );
                                  }
                                }}
                              >
                                <div className='question-drag-and-text'>
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
                                        d='M7.5 5H5V7.5H7.5V5ZM7.5 10H5V12.5H7.5V10ZM7.5 15H5V17.5H7.5V15ZM12.5 5H10V7.5H12.5V5ZM12.5 10H10V12.5H12.5V10ZM12.5 15H10V17.5H12.5V15ZM17.5 5H15V7.5H17.5V5ZM17.5 10H15V12.5H17.5V10ZM17.5 15H15V17.5H17.5V15Z'
                                        fill='#A4A7AE'
                                      />
                                    </svg>
                                  </button>
                                  <span className='question-text'>
                                    {question.question}
                                  </span>
                                </div>
                                <div className='question-actions'>
                                  <button
                                    type='button'
                                    className='edit-question-button'
                                    onClick={() => {
                                      setShowQuestionModal('edit');
                                      setQuestionModalGroupId(group.id);
                                      setQuestionModalQuestion(question);
                                    }}
                                  >
                                    <svg
                                      width='16'
                                      height='16'
                                      viewBox='0 0 16 16'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        d='M11.3333 2.00001C11.5084 1.8249 11.7163 1.68605 11.9447 1.59128C12.1731 1.49651 12.4178 1.44763 12.6667 1.44763C12.9155 1.44763 13.1602 1.49651 13.3886 1.59128C13.617 1.68605 13.8249 1.8249 14 2.00001C14.1751 2.17512 14.314 2.38305 14.4087 2.61144C14.5035 2.83983 14.5524 3.08455 14.5524 3.33334C14.5524 3.58213 14.5035 3.82685 14.4087 4.05524C14.314 4.28363 14.1751 4.49156 14 4.66667L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z'
                                        stroke='#414651'
                                        strokeWidth='1.33'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                    </svg>
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type='button'
                                    className='delete-question-button'
                                    onClick={() => {
                                      setShowQuestionModal('delete');
                                      setQuestionModalGroupId(group.id);
                                      setQuestionModalQuestion(question);
                                    }}
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
                                        stroke='#B32318'
                                        strokeWidth='1.33'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                      <path
                                        d='M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333'
                                        stroke='#D92D20'
                                        strokeWidth='1.33'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                      <div className='category-actions'>
                        <div className='button-group'>
                          <button
                            type='button'
                            className='generate-button'
                            onClick={() => generateQuestions(group.category)}
                          >
                            <svg
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M10 2.5L12.5 7.5L18 8.75L14 12.5L14.75 18L10 15.5L5.25 18L6 12.5L2 8.75L7.5 7.5L10 2.5Z'
                                stroke='#FFFFFF'
                                strokeWidth='1.67'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <span>Generate questions</span>
                          </button>
                          <button
                            type='button'
                            className='manually-add-button'
                            onClick={() => {
                              setShowQuestionModal('add');
                              setQuestionModalGroupId(group.id);
                            }}
                          >
                            <svg
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M10 4.16667V15.8333M4.16667 10H15.8333'
                                stroke='#414651'
                                strokeWidth='1.67'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <span>Manually add</span>
                          </button>
                        </div>
                        {hasQuestions && (
                          <div className='category-question-count'>
                            <span># of questions to ask</span>
                            <input
                              type='number'
                              value={
                                group.questionCountToAsk !== null
                                  ? group.questionCountToAsk
                                  : ''
                              }
                              max={group.questions.length}
                              min={0}
                              onChange={(e) => {
                                let value = parseInt(e.target.value);

                                if (isNaN(value)) {
                                  value = null;
                                }

                                if (value > group.questions.length) {
                                  value = group.questions.length;
                                }

                                e.target.value =
                                  value === null ? '' : value.toString();

                                const updatedQuestions = [...questions];
                                updatedQuestions[index].questionCountToAsk =
                                  value;
                                setQuestions(updatedQuestions);
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
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {index < questions.length - 1 && (
                      <div className='category-divider'></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showQuestionModal && (
        <InterviewQuestionModal
          groupId={questionModalGroupId}
          questionToEdit={questionModalQuestion}
          action={showQuestionModal}
          onAction={(action, groupId, question, questionId) => {
            setShowQuestionModal('');
            setQuestionModalQuestion(null);
            setQuestionModalGroupId(0);

            if (action === 'add' && groupId && question) {
              addQuestion(groupId, question);
            }

            if (action === 'edit' && groupId && question && questionId) {
              editQuestion(groupId, question, questionId.toString());
            }

            if (action === 'delete' && groupId && questionId) {
              deleteQuestion(groupId, questionId.toString());
            }
          }}
        />
      )}
      {isGeneratingQuestions && (
        <FullScreenLoadingAnimation
          title='Generating questions...'
          subtext='Please wait while Jia is generating the questions'
        />
      )}
    </>
  );
}
