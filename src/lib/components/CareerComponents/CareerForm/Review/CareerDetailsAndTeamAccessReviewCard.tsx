'use client';

import ReviewCard from './ReviewCard';

export default function CareerDetailsAndTeamAccessReviewCard({
  isExpanded,
  onToggle,
  onEdit,
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
  hideTeamAccess = false,
}: {
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  jobTitle?: string;
  employmentType?: string;
  workSetup?: string;
  country?: string;
  province?: string;
  city?: string;
  minimumSalary?: string;
  maximumSalary?: string;
  salaryNegotiable?: boolean;
  description?: string;
  members?: any[];
  hideTeamAccess?: boolean;
}) {
  return (
    <ReviewCard
      title={hideTeamAccess ? 'Career Details' : 'Career Details & Team Access'}
      isExpanded={isExpanded}
      onToggle={onToggle}
      onEdit={onEdit}
    >
      <div className='review-section-container'>
        <div className='review-row review-row-single'>
          <div className='review-label'>Job Title</div>
          <div className='review-value'>{jobTitle || '—'}</div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row-group-horizontal'>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>Employment Type</div>
            <div className='review-value'>{employmentType || '—'}</div>
          </div>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>Work Arrangement</div>
            <div className='review-value'>{workSetup || '—'}</div>
          </div>
          <div className='review-row review-row-in-group'></div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row-group-horizontal'>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>Country</div>
            <div className='review-value'>{country || '—'}</div>
          </div>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>State / Province</div>
            <div className='review-value'>{province || '—'}</div>
          </div>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>City</div>
            <div className='review-value'>{city || '—'}</div>
          </div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row-group-horizontal'>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>Minimum Salary</div>
            <div className='review-value'>
              {salaryNegotiable
                ? 'Negotiable'
                : minimumSalary
                ? `${minimumSalary}`
                : '—'}
            </div>
          </div>
          <div className='review-row review-row-in-group'>
            <div className='review-label'>Maximum Salary</div>
            <div className='review-value'>
              {salaryNegotiable
                ? 'Negotiable'
                : maximumSalary
                ? `${maximumSalary}`
                : '—'}
            </div>
          </div>
          <div className='review-row review-row-in-group'></div>
        </div>

        <div className='review-divider'></div>

        <div className='review-row review-row-single'>
          <div className='review-label'>Job Description</div>
          <div
            className='review-value review-description'
            dangerouslySetInnerHTML={{
              __html: description || '—',
            }}
          />
        </div>

        {!hideTeamAccess && (
          <>
            <div className='review-divider'></div>

            <div className='review-row review-row-single'>
              <div className='review-label'>Team Access</div>
              <div className='review-team-members'>
                {members.length > 0 ? (
                  members.map((member) => (
                    <div key={member.id} className='review-team-member'>
                      <div className='review-team-member-info'>
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className='review-avatar'
                          />
                        ) : (
                          <div className='review-avatar review-avatar-placeholder'>
                            {member.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className='review-team-member-details'>
                          <div className='review-team-member-name'>
                            {member.name}
                            {member.isOwner && ' (You)'}
                          </div>
                          <div className='review-team-member-email'>
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <div className='review-team-member-role'>
                        {member.role}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='review-value'>—</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ReviewCard>
  );
}
