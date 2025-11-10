'use client';

import { useEffect, useState } from 'react';
import { candidateActionToast } from '../../Utils';

export default function CareerLink(props: { career: any }) {
  const { career } = props;
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
    let careerRedirection = 'applicant';
    if (career.orgID === '682d3fc222462d03263b0881') {
      careerRedirection = 'whitecloak';
    }
    setShareLink(`${baseUrl}/${careerRedirection}/job-openings/${career._id}`);
  }, [career]);

  return (
    <div className='layered-card-outer'>
      <div className='layered-card-middle' style={{ borderRadius: '16px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '4px 12px',
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: '#181D27',
              fontWeight: 700,
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Career Link
          </span>
        </div>
        {shareLink && (
          <div
            className='layered-card-content'
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              boxShadow: 'inset 0px 0px 2px 0px rgba(0, 16, 53, 0.16)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                width: '100%',
              }}
            >
              <input
                type='text'
                className='form-control'
                value={shareLink}
                readOnly={true}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: '#FFFFFF',
                  border: '1px solid #E9EAEB',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 500,
                  color: '#181D27',
                  fontFamily: "'Satoshi', sans-serif",
                  boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                }}
              />
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  padding: 12,
                  boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  candidateActionToast(
                    'Career Link Copied to Clipboard',
                    1300,
                    <i className='la la-link mr-1 text-info'></i>
                  );
                }}
              >
                <i
                  className='la la-copy'
                  style={{ fontSize: 20, color: '#535862' }}
                ></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
