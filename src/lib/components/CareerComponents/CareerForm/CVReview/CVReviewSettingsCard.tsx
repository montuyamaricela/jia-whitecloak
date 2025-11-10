'use client';

import { useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import SecretPromptQuestion from './SecretPromptQuestion';

const cvScreeningOptions = [
  {
    name: 'Good Fit and above',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M16.6667 5L7.50004 14.1667L3.33337 10'
          stroke='#717680'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    name: 'Only Strong Fit',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3.33333 10L6.66667 13.3333L16.6667 3.33333'
          stroke='#717680'
          strokeWidth='1.67'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.33333 15L6.66667 18.3333L16.6667 8.33333'
          stroke='#717680'
          strokeWidth='1.67'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    name: 'No Automatic Promotion',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M5 5L15 15M15 5L5 15'
          stroke='#717680'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
];

export default function CVReviewSettingsCard({
  screeningSetting,
  setScreeningSetting,
  secretPrompt,
  setSecretPrompt,
}: {
  screeningSetting: string;
  setScreeningSetting: (value: string) => void;
  secretPrompt: string;
  setSecretPrompt: (value: string) => void;
}) {

  return (
    <div className='career-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <span className='heading-text'>CV Review Settings</span>
        </div>
      </div>
      <div className='card-content'>
        <div className='cv-review-settings-section'>
          <div className='cv-screening-section'>
            <div>
              <div className='section-heading'>CV Screening</div>
              <div className='section-description'>
                Jia automatically endorses candidates who meet the chosen
                criteria.
              </div>
            </div>
            <div className='cv-screening-dropdown'>
              <CustomDropdown
                onSelectSetting={setScreeningSetting}
                screeningSetting={screeningSetting}
                settingList={cvScreeningOptions}
                placeholder='Choose screening setting'
              />
            </div>
          </div>

          <div className='divider'></div>

          <SecretPromptQuestion
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
          />
        </div>
      </div>
    </div>
  );
}
