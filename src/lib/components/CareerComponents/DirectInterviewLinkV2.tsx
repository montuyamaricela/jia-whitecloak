import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/lib/context/AppContext';
import {
  candidateActionToast,
  copyTextToClipboard,
  loadingToast,
  successToast,
} from '@/lib/Utils';
import { toast } from 'react-toastify';

export default function DirectInterviewLinkV2(props: {
  formData: any;
  setFormData: (formData: any) => void;
}) {
  const { user } = useAppContext();

  const { formData, setFormData } = props;

  async function updateCareer(
    dataUpdates: any,
    loadingMessage: string,
    sucessMessage: string
  ) {
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    loadingToast(loadingMessage);
    // Handle slug if it's an array or string

    const response = await axios.post('/api/update-career', {
      _id: formData._id,
      lastEditedBy: userInfoSlice,
      ...dataUpdates,
    });

    if (response.status === 200) {
      successToast(sucessMessage, 1200);
      toast.dismiss('loading-toast');
    }
  }

  const [shareLink, setLink] = useState(null);

  async function generateLink() {
    const directLink = `/direct-interview/${formData._id}`;
    const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;

    await updateCareer(
      {
        directInterviewLink: directLink,
        updatedAt: Date.now(),
      },
      'Generating Link...',
      'Sucessfully Created Direct Link'
    );

    let dynamicLink = `${baseUrl}${directLink}`;
    setLink(dynamicLink);
    copyTextToClipboard(dynamicLink);
    setFormData({
      ...formData,
      directInterviewLink: `/direct-interview/${formData._id}`,
    });
  }

  async function disableLink() {
    await updateCareer(
      {
        directInterviewLink: null,
        updatedAt: Date.now(),
      },
      'Removing Direct Link',
      'Sucessfully Removed Direct Link'
    );

    setLink(null);
    setFormData({ ...formData, directInterviewLink: null });
  }

  useEffect(() => {
    if (formData?.directInterviewLink) {
      const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
      let dynamicLink = `${baseUrl}${formData.directInterviewLink}`;

      setLink(dynamicLink);
    }
  }, [formData?.directInterviewLink]);

  return (
    <>
      {formData && (
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
                Direct Interview Link
              </span>
            </div>

            <div
              className='layered-card-content'
              style={{
                padding: '16px',
                gap: '16px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: 'inset 0px 0px 2px 0px rgba(0, 16, 53, 0.16)',
              }}
            >
              <>
                {shareLink && (
                  <>
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
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#717680',
                        fontFamily: "'Satoshi', sans-serif",
                        lineHeight: '1.4285714285714286em',
                      }}
                    >
                      Share the link to an applicant for a direct interview.
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 12,
                        width: '100%',
                      }}
                    >
                      <a href={shareLink} target='_blank' style={{ flex: 1 }}>
                        <button
                          style={{
                            color: '#414651',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            background: '#fff',
                            border: '1px solid #D5D7DA',
                            padding: '8px 14px',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontWeight: 700,
                            fontSize: 14,
                            fontFamily: "'Satoshi', sans-serif",
                            width: '100%',
                          }}
                        >
                          <i
                            className='la la-link'
                            style={{ fontSize: 20 }}
                          ></i>{' '}
                          Open link
                        </button>
                      </a>
                      <button
                        style={{
                          color: '#B32318',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          background: '#FEF3F2',
                          border: '1px solid #FEF3F2',
                          padding: '8px 14px',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          fontWeight: 700,
                          fontSize: 14,
                          fontFamily: "'Satoshi', sans-serif",
                          flex: 1,
                          boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                        }}
                        onClick={disableLink}
                      >
                        <i
                          className='la la-unlink'
                          style={{ fontSize: 20 }}
                        ></i>{' '}
                        Disable link
                      </button>
                    </div>
                  </>
                )}
              </>

              {!shareLink && (
                <button
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    background: '#fff',
                    border: '1px solid #D5D7DA',
                    padding: '8px 16px',
                    borderRadius: '60px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={generateLink}
                >
                  <i className='la la-link text-success' /> Generate Direct
                  Interview Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
