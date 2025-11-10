'use client';

import { useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import '@/lib/styles/career-details-styles.scss';
import SecretPromptQuestion from '../CVReview/SecretPromptQuestion';
import Image from 'next/image';

const interviewScreeningOptions = [
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

export default function AIInterviewSettingsCard({
  interviewScreeningSetting,
  setInterviewScreeningSetting,
  requireVideo,
  setRequireVideo,
  secretPrompt,
  setSecretPrompt,
}: {
  interviewScreeningSetting: string;
  setInterviewScreeningSetting: (value: string) => void;
  requireVideo: boolean;
  setRequireVideo: (value: boolean) => void;
  secretPrompt: string;
  setSecretPrompt: (value: string) => void;
}) {
  return (
    <div className='career-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <span className='heading-text'>AI Interview Settings</span>
        </div>
      </div>
      <div className='card-content'>
        <div className='cv-review-settings-section'>
          <div className='cv-screening-section'>
            <div>
              <div className='section-heading'>AI Interview Screening</div>
              <div className='section-description'>
                Jia automatically endorses candidates who meet the chosen
                criteria.
              </div>
            </div>
            <div className='cv-screening-dropdown'>
              <CustomDropdown
                onSelectSetting={setInterviewScreeningSetting}
                screeningSetting={interviewScreeningSetting}
                settingList={interviewScreeningOptions}
                placeholder='Choose screening setting'
              />
            </div>
          </div>

          <div className='divider'></div>

          <div className='require-video-section'>
            <div className='require-video-text-section'>
              <div className='section-heading'>Require Video on Interview</div>
              <div className='section-description'>
                Require candidates to keep their camera on. Recordings will
                appear on their analysis page.
              </div>
            </div>
            <div className='require-video-status-container'>
              <div className='require-video-status-item'>
                <Image
                  src='/icons/career/videocam.svg'
                  alt='Video'
                  width={24}
                  height={24}
                />
                <span className='require-video-label'>
                  Require Video Interview
                </span>
              </div>
              <div className='toggle-wrapper'>
                <div
                  className={`toggle-switch ${requireVideo ? 'active' : ''}`}
                  onClick={() => setRequireVideo(!requireVideo)}
                >
                  <div className='toggle-slider'></div>
                </div>
                <span className='toggle-label'>
                  {requireVideo ? 'Yes' : 'No'}
                </span>
              </div>
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
