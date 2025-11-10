'use client'

import { useState } from 'react'
import CareerDetailsAndTeamAccessReviewCard from './CareerDetailsAndTeamAccessReviewCard'
import CVReviewAndPreScreeningReviewCard from './CVReviewAndPreScreeningReviewCard'
import AIInterviewSetupReviewCard from './AIInterviewSetupReviewCard'
import PipelineStagesReviewCard from './PipelineStagesReviewCard'
import '@/lib/styles/career-details-styles.scss'

export default function Review({
  // Career Details & Team Access
  jobTitle,
  employmentType,
  workSetup,
  country,
  province,
  city,
  minimumSalary,
  maximumSalary,
  salaryNegotiable,
  description,
  members = [],
  // CV Review
  screeningSetting,
  secretPrompt,
  preScreeningQuestions = [],
  // AI Interview
  interviewScreeningSetting,
  requireVideo,
  interviewSecretPrompt,
  interviewQuestions = [],
  // Pipeline Stages
  pipelineStages = [],
  // Edit callback
  onEdit,
  onEditStep,
  // Display options
  hideTeamAccess = false,
}: {
  jobTitle?: string
  employmentType?: string
  workSetup?: string
  country?: string
  province?: string
  city?: string
  minimumSalary?: string
  maximumSalary?: string
  salaryNegotiable?: boolean
  description?: string
  members?: any[]
  screeningSetting?: string
  secretPrompt?: string
  preScreeningQuestions?: any[]
  interviewScreeningSetting?: string
  requireVideo?: boolean
  interviewSecretPrompt?: string
  interviewQuestions?: any[]
  pipelineStages?: any[]
  onEdit?: () => void
  onEditStep?: (step: number) => void
  hideTeamAccess?: boolean
}) {
  const [expandedCard, setExpandedCard] = useState<string | null>(
    'career-details'
  )

  const handleToggle = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <div className='review-container'>
      <CareerDetailsAndTeamAccessReviewCard
        isExpanded={expandedCard === 'career-details'}
        onToggle={() => handleToggle('career-details')}
        onEdit={onEditStep ? () => onEditStep(0) : onEdit}
        jobTitle={jobTitle}
        employmentType={employmentType}
        workSetup={workSetup}
        country={country}
        province={province}
        city={city}
        minimumSalary={minimumSalary}
        maximumSalary={maximumSalary}
        salaryNegotiable={salaryNegotiable}
        description={description}
        members={members}
        hideTeamAccess={hideTeamAccess}
      />
      <CVReviewAndPreScreeningReviewCard
        isExpanded={expandedCard === 'cv-review'}
        onToggle={() => handleToggle('cv-review')}
        onEdit={onEditStep ? () => onEditStep(1) : onEdit}
        screeningSetting={screeningSetting}
        secretPrompt={secretPrompt}
        preScreeningQuestions={preScreeningQuestions}
      />
      <AIInterviewSetupReviewCard
        isExpanded={expandedCard === 'ai-interview'}
        onToggle={() => handleToggle('ai-interview')}
        onEdit={onEditStep ? () => onEditStep(2) : onEdit}
        interviewScreeningSetting={interviewScreeningSetting}
        requireVideo={requireVideo}
        interviewSecretPrompt={interviewSecretPrompt}
        interviewQuestions={interviewQuestions}
      />
      <PipelineStagesReviewCard
        isExpanded={expandedCard === 'pipeline-stages'}
        onToggle={() => handleToggle('pipeline-stages')}
        onEdit={onEditStep ? () => onEditStep(3) : onEdit}
        pipelineStages={pipelineStages}
      />
    </div>
  )
}

