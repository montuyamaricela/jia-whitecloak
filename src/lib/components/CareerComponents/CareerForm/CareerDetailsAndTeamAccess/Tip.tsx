'use client'

import '@/lib/styles/career-details-styles.scss'

const tipsContent = [
  {
    heading: 'Use clear, standard job titles',
    description:
      'for better searchability (e.g., "Software Engineer" instead of "Code Ninja" or "Tech Rockstar").',
  },
  {
    heading: 'Avoid abbreviations',
    description:
      'or internal role codes that applicants may not understand (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").',
  },
  {
    heading: 'Keep it concise',
    description:
      '– job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms.',
  },
]

export default function Tip() {
  return (
    <div className='tips-card'>
      <div className='tips-heading'>
        <div className='heading-wrapper'>
          <div className='heading-container'>
            <img
              src='/icons/career/tips_and_updates.svg'
              alt='Tips and updates'
              className='tips-icon'
              width='20'
              height='20'
            />
            <span className='heading-text'>Tips</span>
          </div>
        </div>
      </div>
      <div className='tips-content'>
        {tipsContent.map((tip, index) => (
          <div key={index} className='tips-text'>
            <span className='tips-heading-text'>{tip.heading}</span> {tip.description}
          </div>
        ))}
      </div>
    </div>
  )
}

