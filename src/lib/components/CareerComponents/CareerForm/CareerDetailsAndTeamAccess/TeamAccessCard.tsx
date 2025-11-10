'use client';

import { useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import '@/lib/styles/career-details-styles.scss';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOwner?: boolean;
}

const roleOptions = [
  {
    name: 'Job Owner',
    description:
      'Leads the hiring process for assigned jobs. Has access with all career settings.',
  },
  {
    name: 'Contributor',
    description:
      'Helps evaluate candidates and assist with hiring tasks. Can move candidates through the pipeline, but cannot change any career settings.',
  },
  {
    name: 'Reviewer',
    description:
      'Reviews candidates and provides feedback. Can only view candidate profiles and comment.',
  },
];

export default function TeamAccessCard({
  members = [],
  availableMembers = [],
  onAddMember,
  onRemoveMember,
  onUpdateRole,
}: {
  members?: TeamMember[];
  availableMembers?: TeamMember[];
  onAddMember?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: string) => void;
}) {
  const [selectedMember, setSelectedMember] = useState('');

  const handleRoleChange = (memberId: string, role: string) => {
    if (onUpdateRole) {
      onUpdateRole(memberId, role);
    }
  };

  const filteredAvailableMembers = availableMembers.filter(
    (member) => !members.some((m) => m.id === member.id)
  );

  const memberOptions = filteredAvailableMembers.map((member) => ({
    name: member.name,
    email: member.email,
    avatar: member.avatar,
    id: member.id,
  }));

  return (
    <div className='career-card' id='team-access-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <span className='heading-text'>5. Team Access</span>
        </div>
      </div>
      <div className='card-content'>
        <div className='team-access-section'>
          <div className='add-member-section'>
            <div className='add-member-header'>
              <div className='heading'>Add more members</div>
              <div className='supporting-text'>
                You can add other members to collaborate on this career.
              </div>
            </div>
            {memberOptions.length > 0 && (
              <div
                className='member-dropdown'
                style={{ position: 'relative', zIndex: 2000 }}
              >
                <CustomDropdown
                  onSelectSetting={(selectedName) => {
                    const option = memberOptions.find(
                      (opt) => opt.name === selectedName
                    );
                    if (option) {
                      const member = filteredAvailableMembers.find(
                        (m) => m.id === option.id
                      );
                      if (member && onAddMember) {
                        onAddMember(member.id);
                        setSelectedMember('');
                      }
                    }
                  }}
                  screeningSetting={selectedMember}
                  settingList={memberOptions}
                  placeholder='Add member'
                  showIcon={true}
                  showSearch={true}
                  showAvatar={true}
                />
              </div>
            )}
          </div>

          {members.length > 0 && (
            <>
              <div className='divider'></div>
              <div className='member-list'>
                {members.map((member) => (
                  <div key={member.id} className='member-item'>
                    <div className='member-info'>
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className='avatar'
                        />
                      ) : (
                        <div
                          className='avatar'
                          style={{
                            background: '#e9eaeb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#717680',
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className='member-details'>
                        <div className='member-name'>
                          {member.name}
                          {member.isOwner && ' (You)'}
                        </div>
                        <div className='member-email'>{member.email}</div>
                      </div>
                    </div>
                    <div className='member-actions'>
                      <div
                        className='role-dropdown'
                        style={{ position: 'relative', zIndex: 1000 }}
                      >
                        <CustomDropdown
                          onSelectSetting={(role) =>
                            handleRoleChange(member.id, role)
                          }
                          screeningSetting={member.role}
                          settingList={roleOptions}
                          placeholder='Select role'
                          showSupportingText={true}
                        />
                      </div>
                      {!member.isOwner && onRemoveMember && (
                        <button
                          className='remove-button'
                          onClick={() => onRemoveMember(member.id)}
                          type='button'
                        >
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M2.5 5H4.16667H17.5'
                              stroke='#535862'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5M15.8333 5V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5H15.8333Z'
                              stroke='#535862'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M8.33333 9.16667V14.1667'
                              stroke='#535862'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M11.6667 9.16667V14.1667'
                              stroke='#535862'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      )}
                      {member.isOwner && (
                        <button
                          className='remove-button'
                          disabled
                          type='button'
                        >
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M2.5 5H4.16667H17.5'
                              stroke='#D5D7DA'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5M15.8333 5V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5H15.8333Z'
                              stroke='#D5D7DA'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M8.33333 9.16667V14.1667'
                              stroke='#D5D7DA'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M11.6667 9.16667V14.1667'
                              stroke='#D5D7DA'
                              strokeWidth='1.67'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className='supporting-text'>
            *Admins can view all careers regardless of specific access settings.
          </div>
        </div>
      </div>
    </div>
  );
}
