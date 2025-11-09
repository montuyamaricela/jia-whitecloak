'use client';

import '@/lib/styles/career-form-styles.scss';

type StepState =
  | 'active-pending'
  | 'active-in-progress'
  | 'active-completed'
  | 'inactive'
  | 'pending-empty'
  | 'error';

interface StepProgressProps {
  title: string;
  subtext: string;
  state: StepState;
  isLast?: boolean;
}

export default function StepProgress({
  title,
  subtext,
  state,
  isLast = false,
}: StepProgressProps) {
  const getStepIcon = () => {
    switch (state) {
      case 'active-completed':
        return (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='10' cy='10' r='10' fill='url(#completedGradient)' />
            <path
              d='M6.66667 10L9.16667 12.5L13.3333 8.33333'
              stroke='#FFFFFF'
              strokeWidth='1.67'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <defs>
              <linearGradient
                id='completedGradient'
                x1='0'
                y1='0'
                x2='20'
                y2='20'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#000000' />
                <stop offset='1' stopColor='#000000' />
              </linearGradient>
            </defs>
          </svg>
        );
      case 'active-in-progress':
        return (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='10' cy='10' r='10' fill='#FFFFFF' />
            <circle
              cx='10'
              cy='10'
              r='8.33'
              fill='none'
              stroke='#181D27'
              strokeWidth='1.67'
            />
            <circle cx='10' cy='10' r='3.33' fill='#181D27' />
          </svg>
        );
      case 'active-pending':
        return (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='10' cy='10' r='10' fill='#FFFFFF' />
            <circle
              cx='10'
              cy='10'
              r='8.33'
              fill='none'
              stroke='#181D27'
              strokeWidth='1.67'
            />
            <circle cx='10' cy='10' r='3.33' fill='#181D27' />
          </svg>
        );
      case 'error':
        return (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='10' cy='10' r='10' fill='#FFFFFF' />
            <path
              d='M10 6.66667V10M10 13.3333H10.0083'
              stroke='#F04438'
              strokeWidth='1.67'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle
              cx='10'
              cy='10'
              r='8.33'
              fill='none'
              stroke='#F04438'
              strokeWidth='1.67'
            />
          </svg>
        );
      case 'inactive':
        return (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='10' cy='10' r='10' fill='#FFFFFF' />
            <circle
              cx='10'
              cy='10'
              r='8.33'
              fill='none'
              stroke='#D5D7DA'
              strokeWidth='1.67'
            />
            <circle cx='10' cy='10' r='3.33' fill='#D5D7DA' />
          </svg>
        );
      case 'pending-empty':
        return null;
      default:
        return null;
    }
  };

  const getTitleColor = () => {
    if (
      state === 'active-pending' ||
      state === 'active-in-progress' ||
      state === 'active-completed'
    ) {
      return '#181D27';
    }
    if (state === 'error') {
      return '#181D27';
    }
    return '#717680';
  };

  const isPendingEmpty = state === 'pending-empty';

  return (
    <div className={`step-progress step-progress-${state}`}>
      {!isPendingEmpty ? (
        <>
          <div className='step-progress-container'>
            <div className='step-icon'>{getStepIcon()}</div>
            {!isLast && <div className='step-connector'></div>}
          </div>
          <div className='step-text-group'>
            <div className='step-title' style={{ color: getTitleColor() }}>
              {title}
            </div>
          </div>
        </>
      ) : (
        <div className='step-progress-container-pending'>
          <div className='step-text-group-pending'>
            <div className='step-title' style={{ color: getTitleColor() }}>
              {title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
