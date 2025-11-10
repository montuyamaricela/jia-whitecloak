'use client'

import { ReactNode } from 'react'

const ChevronUpIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M15 12L10 7L5 12'
      stroke='#181D27'
      strokeWidth='1.67'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const ChevronDownIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5 8L10 13L15 8'
      stroke='#181D27'
      strokeWidth='1.67'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const EditIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M11.3333 2.00001C11.5084 1.82489 11.7163 1.68605 11.9447 1.59128C12.1731 1.49651 12.4177 1.44763 12.6667 1.44763C12.9156 1.44763 13.1602 1.49651 13.3886 1.59128C13.617 1.68605 13.8249 1.82489 14 2.00001C14.1751 2.17513 14.314 2.38301 14.4087 2.61141C14.5035 2.83981 14.5524 3.08439 14.5524 3.33334C14.5524 3.5823 14.5035 3.82688 14.4087 4.05528C14.314 4.28368 14.1751 4.49156 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z'
      stroke='#535862'
      strokeWidth='1.67'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

interface ReviewCardProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
}

export default function ReviewCard({
  title,
  isExpanded,
  onToggle,
  children,
}: ReviewCardProps) {
  return (
    <div className='review-card'>
      <div className='review-card-heading-wrapper' onClick={onToggle}>
        <div className='review-card-heading'>
          <div className='review-card-heading-container'>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            <span className='review-card-title'>{title}</span>
          </div>
        </div>
        <button
          type='button'
          className='review-card-edit-button'
          onClick={(e) => {
            e.stopPropagation()
            // TODO: Handle edit action
          }}
        >
          <EditIcon />
        </button>
      </div>
      {isExpanded && (
        <div className='review-card-content'>
          <div className='review-card-content-inner'>{children}</div>
        </div>
      )}
    </div>
  )
}

