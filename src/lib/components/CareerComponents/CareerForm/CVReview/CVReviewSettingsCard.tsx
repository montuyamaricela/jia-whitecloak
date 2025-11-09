'use client';

import { useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';

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
  const [showTooltip, setShowTooltip] = useState(false);

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

          <div className='secret-prompt-section'>
            <div>
              <div className='secret-prompt-heading'>
                <img
                  src='/icons/career/auto-awesome.svg'
                  alt='auto awesome'
                  width='20'
                  height='20'
                  style={{ flexShrink: 0 }}
                />
                <span className='section-heading'>
                  CV Secret Prompt <span>(optional)</span>
                </span>
                <div
                  className='help-icon-wrapper'
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z'
                      stroke='#717680'
                      strokeWidth='1.33'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M8 11.3333V8'
                      stroke='#717680'
                      strokeWidth='1.33'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M8 4.66667H8.00667'
                      stroke='#717680'
                      strokeWidth='1.33'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {showTooltip && (
                    <div className='secret-prompt-tooltip'>
                      These prompts remain hidden from candidates and the public
                      job portal. Additionally, only Admins and the Job Owner
                      can view the secret prompt.
                    </div>
                  )}
                </div>
              </div>
              <div className='section-description'>
                Secret Prompts give you extra control over Jia's evaluation
                style, complementing her accurate assessment of requirements
                from the job description.
              </div>
            </div>
            <div className='secret-prompt-textarea'>
              <textarea
                value={secretPrompt}
                onChange={(e) => setSecretPrompt(e.target.value)}
                placeholder='Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackathons or competitions.)'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
