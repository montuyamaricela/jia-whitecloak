'use client';

export default function CareerFormStepActions({
  currentStep,
  jobTitle,
  isFormValid,
  isSavingCareer,
  careerStatus,
  formType,
  onSaveUnpublished,
  onSaveAndContinue,
  onPublish,
}: {
  currentStep: number;
  jobTitle: string;
  isFormValid: boolean;
  isSavingCareer: boolean;
  careerStatus?: string;
  formType?: string;
  onSaveUnpublished: () => void;
  onSaveAndContinue: () => void;
  onPublish?: () => void;
}) {
  const getTitle = () => {
    if (formType === 'edit') {
      return null;
    }
    if (formType === 'add' && currentStep === 0) {
      return 'Add new Career';
    }
    return (
      <>
        {careerStatus === 'inactive' && (
          <><span style={{ color: '#717680' }}>[Unpublished]</span>{' '}</>
        )}
        {jobTitle || 'Untitled Career'}
      </>
    );
  };

  return (
    <div
      style={{
        marginBottom: '35px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: formType === 'edit' ? 'flex-end' : 'space-between',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      {formType !== 'edit' && (
        <h1 style={{ fontSize: '24px', fontWeight: 550, color: '#111827' }}>
          {getTitle()}
        </h1>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}
      >
      <button
        disabled={isSavingCareer}
        style={{
          width: 'fit-content',
          color: '#414651',
          background: '#fff',
          border: '1px solid #D5D7DA',
          padding: '8px 16px',
          borderRadius: '60px',
          cursor: isSavingCareer ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '1.4285714285714286em',
          transition: 'all 0.2s',
        }}
        onClick={onSaveUnpublished}
        onMouseEnter={(e) => {
          if (isSavingCareer) return;
          e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        Save as Unpublished
      </button>
      <button
        disabled={isSavingCareer}
        style={{
          width: 'fit-content',
          background: isSavingCareer ? '#D5D7DA' : '#181D27',
          color: '#fff',
          border: '1px solid #E9EAEB',
          padding: '8px 16px',
          borderRadius: '60px',
          cursor: isSavingCareer ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '1.4285714285714286em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          transition: 'opacity 0.2s',
        }}
        onClick={currentStep === 4 && onPublish ? onPublish : onSaveAndContinue}
        onMouseEnter={(e) => {
          if (isSavingCareer) return;
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <span>{currentStep === 4 ? 'Publish' : 'Save and Continue'}</span>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{ flexShrink: 0 }}
        >
          <path
            d='M7.5 15L12.5 10L7.5 5'
            stroke='#FFFFFF'
            strokeWidth='1.67'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      </div>
    </div>
  );
}
