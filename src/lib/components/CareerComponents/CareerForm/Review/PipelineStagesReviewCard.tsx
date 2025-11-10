'use client'

import ReviewCard from './ReviewCard'

export default function PipelineStagesReviewCard({
  isExpanded,
  onToggle,
  pipelineStages = [],
}: {
  isExpanded: boolean
  onToggle: () => void
  pipelineStages?: any[]
}) {
  return (
    <ReviewCard
      title='Pipeline Stages'
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className='review-section-container'>
        <div className='review-row'>
          <div className='review-label'>Pipeline Stages</div>
          <div className='review-pipeline-stages'>
            {pipelineStages.length > 0 ? (
              pipelineStages.map((stage, index) => (
                <div key={stage.id || index} className='review-pipeline-stage'>
                  {stage.name || `Stage ${index + 1}`}
                </div>
              ))
            ) : (
              <div className='review-value'>—</div>
            )}
          </div>
        </div>
      </div>
    </ReviewCard>
  )
}

