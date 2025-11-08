'use client';

import RichTextEditor from '@/lib/components/CareerComponents/RichTextEditor';
import '@/lib/styles/career-details-styles.scss';

export default function JobDescriptionCard({
  description,
  setDescription,
}: {
  description: string;
  setDescription: (value: string) => void;
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
          <RichTextEditor setText={setDescription} text={description} />
        </div>
      </div>
    </div>
  );
}
