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
            <path
              d='M9.99965 6.66666V9.99999M9.99965 13.3333H10.008M8.57465 2.38333L1.51632 14.1667C1.37079 14.4187 1.29379 14.7044 1.29298 14.9954C1.29216 15.2864 1.36756 15.5726 1.51167 15.8254C1.65579 16.0783 1.86359 16.2889 2.11441 16.4365C2.36523 16.5841 2.65032 16.6635 2.94132 16.6667H17.058C17.349 16.6635 17.6341 16.5841 17.8849 16.4365C18.1357 16.2889 18.3435 16.0783 18.4876 15.8254C18.6317 15.5726 18.7071 15.2864 18.7063 14.9954C18.7055 14.7044 18.6285 14.4187 18.483 14.1667L11.4247 2.38333C11.2761 2.13841 11.0669 1.93593 10.8173 1.7954C10.5677 1.65487 10.2861 1.58104 9.99965 1.58104C9.71321 1.58104 9.43159 1.65487 9.18199 1.7954C8.93238 1.93593 8.72321 2.13841 8.57465 2.38333Z'
              stroke='#F04438'
              stroke-width='1.67'
              stroke-linecap='round'
              stroke-linejoin='round'
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
