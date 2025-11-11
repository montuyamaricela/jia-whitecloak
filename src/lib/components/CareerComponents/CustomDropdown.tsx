'use client';
import { useState, useRef, useEffect, useId } from 'react';

/**
 * Decodes HTML entities to their corresponding characters
 * @param {string} text - Text containing HTML entities (e.g., "&lt;", "&gt;", "&amp;")
 * @returns {string} Decoded text (e.g., "<", ">", "&")
 */
function decodeHTMLEntities(text) {
  if (!text) return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export default function CustomDropdown(props) {
  const {
    onSelectSetting,
    screeningSetting,
    settingList,
    placeholder,
    showIcon = false,
    showSupportingText = false,
    showSearch = false,
    showAvatar = false,
    hasError = false,
    borderColor,
    hideCheckmark = false,
  } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const gradientId = useId();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const selectedSetting = settingList.find(
    (setting) => setting.name === screeningSetting
  );

  const filteredList = showSearch
    ? settingList.filter((setting) => {
        const searchLower = searchQuery.toLowerCase();
        const name = (setting.name || '').toLowerCase();
        const email = (setting.email || '').toLowerCase();
        return name.includes(searchLower) || email.includes(searchLower);
      })
    : settingList;

  return (
    <div
      className='custom-dropdown'
      ref={dropdownRef}
      style={{ position: 'relative', width: '100%', zIndex: 'inherit' }}
    >
      <button
        disabled={settingList.length === 0}
        type='button'
        onClick={() => setDropdownOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: '#FFFFFF',
          border: hasError
            ? '1px solid #DC6803'
            : borderColor
            ? `1px solid ${borderColor}`
            : '1px solid #E9EAEB',
          borderRadius: '8px',
          boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '1.5em',
          color: screeningSetting ? '#181D27' : '#717680',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {showIcon && (
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z'
                fill='#717680'
              />
              <path
                d='M10 12C5.58172 12 2 13.7909 2 16V20H18V16C18 13.7909 14.4183 12 10 12Z'
                fill='#717680'
              />
            </svg>
          )}
          {(() => {
            const selectedSetting = settingList.find(
              (setting) => setting.name === screeningSetting
            );
            if (selectedSetting?.icon) {
              // Check if icon is a React element
              if (
                typeof selectedSetting.icon === 'object' &&
                selectedSetting.icon !== null &&
                '$$typeof' in selectedSetting.icon
              ) {
                return selectedSetting.icon;
              }
              // Otherwise treat as className string
              return <i className={selectedSetting.icon}></i>;
            }
            return null;
          })()}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {decodeHTMLEntities(screeningSetting?.replace('_', ' ')) || placeholder}
          </span>
        </div>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{
            flexShrink: 0,
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d='M5 7.5L10 12.5L15 7.5'
            stroke='#717680'
            strokeWidth='1.67'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          className='org-dropdown-anim show'
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: hideCheckmark ? '0' : '4px',
            width: showSearch ? '317px' : '348px',
            minWidth: showSearch ? '317px' : '348px',
            background: '#FFFFFF',
            border: '1px solid #F5F5F5',
            borderRadius: '8px',
            boxShadow:
              '0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 12px 16px -4px rgba(10, 13, 18, 0.08)',
            padding: hideCheckmark ? '0' : showSearch ? '0' : '8px',
            zIndex: 10000, // Even higher to ensure it's above everything
            // maxHeight: showSearch ? 'none' : '400px',
            // overflowY: 'auto',
          }}
        >
          {showSearch && (
            <>
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    border: '1px solid #D5D7DA',
                    borderRadius: '8px',
                    boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                  }}
                >
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 14 14'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M6.41667 11.0833C8.99405 11.0833 11.0833 8.99405 11.0833 6.41667C11.0833 3.83929 8.99405 1.75 6.41667 1.75C3.83929 1.75 1.75 3.83929 1.75 6.41667C1.75 8.99405 3.83929 11.0833 6.41667 11.0833Z'
                      stroke='#A4A7AE'
                      strokeWidth='1.16667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12.25 12.25L9.71252 9.71252'
                      stroke='#A4A7AE'
                      strokeWidth='1.16667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <input
                    type='text'
                    placeholder='Search member'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '1.4285714285714286em',
                      color: '#A4A7AE',
                      background: 'transparent',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background: '#F5F5F5',
                }}
              ></div>
            </>
          )}
          <div
            style={{
              padding: hideCheckmark ? '0' : showSearch ? '4px 0px' : '0',
              maxHeight: showSearch ? '280px' : 'none',
              overflowY: showSearch ? 'auto' : 'visible',
            }}
          >
            {filteredList.map((setting, index) => {
              const isSelected = screeningSetting === setting.name;
              return (
                <button
                  key={index}
                  type='button'
                  onClick={() => {
                    onSelectSetting(setting.name);
                    setDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  style={{
                    width: '100%',
                    padding: showAvatar ? '10px 16px 10px 14px' : '10px 14px',
                    borderRadius: showAvatar ? '0' : '12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: showAvatar ? 'row' : 'column',
                    gap: showAvatar ? '8px' : '4px',
                    alignItems: showAvatar
                      ? 'center'
                      : hideCheckmark
                      ? 'center'
                      : 'stretch',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (hideCheckmark) {
                      e.currentTarget.style.background = '#F8F9FC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hideCheckmark) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {showAvatar && (
                    <>
                      {setting.avatar ? (
                        <img
                          src={setting.avatar}
                          alt={setting.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#E9EAEB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#717680',
                            fontSize: '10px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {setting.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '1.4285714285714286em',
                            color: '#181D27',
                          }}
                        >
                          {decodeHTMLEntities(setting.name?.replace('_', ' '))}
                        </span>
                        {setting.email && (
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '14px',
                              fontWeight: 500,
                              lineHeight: '1.4285714285714286em',
                              color: '#717680',
                            }}
                          >
                            {setting.email}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {!showAvatar && (
                    <>
                      {hideCheckmark ? (
                        <span
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: '16px',
                            fontWeight: 500,
                            lineHeight: '1.5em',
                            color: '#181D27',
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          {decodeHTMLEntities(setting.name?.replace('_', ' '))}
                        </span>
                      ) : (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px',
                                flex: 1,
                              }}
                            >
                              {setting.icon && (
                                <div style={{ flexShrink: 0 }}>
                                  {typeof setting.icon === 'object' &&
                                  setting.icon !== null &&
                                  '$$typeof' in setting.icon ? (
                                    setting.icon
                                  ) : (
                                    <i className={setting.icon}></i>
                                  )}
                                </div>
                              )}
                              <span
                                style={{
                                  fontFamily: "'Satoshi', sans-serif",
                                  fontSize: '14px',
                                  fontWeight: isSelected ? 700 : 500,
                                  lineHeight: '1.4285714285714286em',
                                  color: isSelected ? '#181D27' : '#414651',
                                }}
                              >
                                {decodeHTMLEntities(setting.name?.replace('_', ' '))}
                              </span>
                            </div>
                            {isSelected && (
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                style={{ flexShrink: 0 }}
                              >
                                <path
                                  d='M16.6667 5L7.50004 14.1667L3.33337 10'
                                  stroke={`url(#checkGradient-${gradientId})`}
                                  strokeWidth='1.67'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <defs>
                                  <linearGradient
                                    id={`checkGradient-${gradientId}`}
                                    x1='3.33337'
                                    y1='5'
                                    x2='16.6667'
                                    y2='14.1667'
                                    gradientUnits='userSpaceOnUse'
                                  >
                                    <stop stopColor='#9FCAED' />
                                    <stop offset='0.34' stopColor='#CEB6DA' />
                                    <stop offset='0.67' stopColor='#EBACC9' />
                                    <stop offset='1' stopColor='#FCCEC0' />
                                  </linearGradient>
                                </defs>
                              </svg>
                            )}
                          </div>
                          {showSupportingText && setting.description && (
                            <span
                              style={{
                                fontFamily: "'Satoshi', sans-serif",
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '1.4285714285714286em',
                                color: '#717680',
                              }}
                            >
                              {setting.description}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {showSearch && (
            <div
              style={{
                width: '100%',
                height: '1px',
                background: '#F5F5F5',
              }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}
