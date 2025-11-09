'use client';

export default function CareerFormStepActions({
  isFormValid,
  isSavingCareer,
  onSaveUnpublished,
  onSaveAndContinue,
}: {
  isFormValid: boolean;
  isSavingCareer: boolean;
  onSaveUnpublished: () => void;
  onSaveAndContinue: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: '35px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      <button
        disabled={!isFormValid || isSavingCareer}
        style={{
          width: 'fit-content',
          color: '#414651',
          background: '#fff',
          border: '1px solid #D5D7DA',
          padding: '8px 16px',
          borderRadius: '60px',
          cursor: !isFormValid || isSavingCareer ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '1.4285714285714286em',
          transition: 'all 0.2s',
        }}
        onClick={onSaveUnpublished}
        onMouseEnter={(e) => {
          if (!isFormValid || isSavingCareer) return;
          e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        Save as Unpublished
      </button>
      <button
        disabled={!isFormValid || isSavingCareer}
        style={{
          width: 'fit-content',
          background: !isFormValid || isSavingCareer ? '#D5D7DA' : '#181D27',
          color: '#fff',
          border: '1px solid #E9EAEB',
          padding: '8px 16px',
          borderRadius: '60px',
          cursor: !isFormValid || isSavingCareer ? 'not-allowed' : 'pointer',
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
        onClick={onSaveAndContinue}
        onMouseEnter={(e) => {
          if (!isFormValid || isSavingCareer) return;
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <span>Save and Continue</span>
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
  );
}
