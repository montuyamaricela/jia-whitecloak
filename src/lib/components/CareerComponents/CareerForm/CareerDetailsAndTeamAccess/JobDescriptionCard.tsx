'use client';

import RichTextEditor from '@/lib/components/CareerComponents/RichTextEditor';
import '@/lib/styles/career-details-styles.scss';

export default function JobDescriptionCard({
  description,
  setDescription,
  errors,
}: {
  description: string;
  setDescription: (value: string) => void;
  errors?: any;
}) {
  return (
    <div className='career-card job-description-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <span className='heading-text'>2. Job Description</span>
        </div>
      </div>
      <div className='card-content textarea-content'>
        <div className='textarea-field'>
          <RichTextEditor
            setText={setDescription}
            text={description}
            hasError={!!errors?.description}
          />
        </div>
        {errors?.description && (
          <div
            style={{
              fontSize: 14,
              color: '#F04438',
              marginTop: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{errors.description.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
