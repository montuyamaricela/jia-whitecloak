'use client'

import { ReactNode } from 'react'
import StepProgress from './StepProgress'
import '@/lib/styles/career-form-styles.scss'

type StepState = 'active-pending' | 'active-in-progress' | 'active-completed' | 'inactive' | 'pending-empty' | 'error'

interface Step {
  title: string
  subtext: string
  state: StepState
}

interface SegmentedFormLayoutProps {
  currentStep: number
  steps: Step[]
  children: ReactNode
  onStepClick?: (stepIndex: number) => void
}

export default function SegmentedFormLayout({
  currentStep,
  steps,
  children,
  onStepClick,
}: SegmentedFormLayoutProps) {
  const handleStepClick = (index: number) => {
    if (onStepClick && index <= currentStep) {
      onStepClick(index)
    }
  }

  return (
    <div className='segmented-form-layout'>
      <div className='step-progress-bar'>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isPendingEmpty = step.state === 'pending-empty'
          
          return (
            <div
              key={index}
              className={`step-progress-wrapper ${index <= currentStep ? 'clickable' : ''} ${isPendingEmpty ? 'pending-empty' : ''}`}
              onClick={() => handleStepClick(index)}
            >
              <StepProgress
                title={step.title}
                subtext={step.subtext}
                state={step.state}
                isLast={isLast}
              />
            </div>
          )
        })}
      </div>
      <div className='form-content'>{children}</div>
    </div>
  )
}

