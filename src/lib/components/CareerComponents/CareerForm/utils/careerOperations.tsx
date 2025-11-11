import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { candidateActionToast, errorToast } from '@/lib/Utils';
import XSSWarningModal from '../../XSSWarningModal/XSSWarningModal';

interface UserInfo {
  image: string;
  name: string;
  email: string;
}

interface CareerData {
  _id?: string;
  jobTitle: string;
  description: string;
  workSetup: string;
  workSetupRemarks: string;
  questions: any[];
  screeningSetting: string;
  requireVideo: boolean;
  salaryNegotiable: boolean;
  minimumSalary: string | number;
  maximumSalary: string | number;
  country: string;
  province: string;
  city: string;
  employmentType: string;
  secretPrompt: string;
  preScreeningQuestions: any[];
  interviewScreeningSetting?: string;
  interviewSecretPrompt?: string;
  teamMembers?: any[];
  orgID?: string;
  currentStep?: number;
  completedSteps?: number[];
}

interface SaveCareerParams {
  actionType: 'create' | 'update';
  shouldRedirect?: boolean;
  status: string;
  careerData: CareerData;
  user: UserInfo;
  savingRef?: React.MutableRefObject<boolean>;
  onSavingStateChange: (isSaving: boolean) => void;
}

interface SanitizationWarning {
  field: string;
  message: string;
  original: string;
  sanitized: string;
}

/**
 * Shows XSS warning modal and returns user's decision
 */
function showXSSWarningModal(warnings: SanitizationWarning[]): Promise<boolean> {
  return new Promise((resolve) => {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'xss-warning-modal-container';
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(modalContainer);
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    root.render(
      <XSSWarningModal
        warnings={warnings}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  });
}

/**
 * Unified function to save or update career data
 * @param actionType - 'create' for new career, 'update' for existing career
 * @param shouldRedirect - Whether to redirect after successful save (default: false)
 * @param status - Career status ('active', 'inactive', 'draft')
 * @param careerData - Career form data
 * @param user - Current user info
 * @param savingRef - Optional ref to prevent duplicate saves
 * @param onSavingStateChange - Callback to update saving state
 * @returns Success status
 */
export const saveCareerOperation = async ({
  actionType,
  shouldRedirect = false,
  status,
  careerData,
  user,
  savingRef,
  onSavingStateChange,
}: SaveCareerParams): Promise<boolean> => {
  const { minimumSalary, maximumSalary } = careerData;

  if (
    Number(minimumSalary) &&
    Number(maximumSalary) &&
    Number(minimumSalary) > Number(maximumSalary)
  ) {
    errorToast('Minimum salary cannot be greater than maximum salary', 1300);
    return false;
  }

  if (savingRef?.current) {
    return false;
  }

  if (savingRef) {
    savingRef.current = true;
  }

  onSavingStateChange(true);

  const userInfoSlice: UserInfo = {
    image: user.image,
    name: user.name,
    email: user.email,
  };

  const payload = {
    ...careerData,
    lastEditedBy: userInfoSlice,
    status,
    minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
    maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
    location: careerData.city,
    ...(actionType === 'create' && { createdBy: userInfoSlice }),
    ...(actionType === 'update' && {
      _id: careerData._id,
      updatedAt: Date.now(),
    }),
  };

  try {
    const endpoint =
      actionType === 'create' ? '/api/add-career' : '/api/update-career';

    const response = await axios.post(endpoint, payload);

    if (response.status === 200 && response.data.requiresConfirmation) {
      onSavingStateChange(false);
      if (savingRef) {
        savingRef.current = false;
      }

      const userConfirmed = await showXSSWarningModal(response.data.warnings);

      if (!userConfirmed) {
        return false;
      }

      if (savingRef) {
        savingRef.current = true;
      }
      onSavingStateChange(true);

      const confirmedPayload = {
        ...payload,
        confirmSanitization: true,
      };

      const confirmedResponse = await axios.post(endpoint, confirmedPayload);

      if (confirmedResponse.status === 200) {
        const successMessage = shouldRedirect
          ? actionType === 'create'
            ? `Career added ${status === 'active' ? 'and published' : ''}`
            : 'Career updated'
          : 'Progress saved';

        candidateActionToast(
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
              {successMessage}
            </span>
          </div>,
          1300,
          <i
            className='la la-check-circle'
            style={{ color: '#039855', fontSize: 32 }}
          ></i>
        );

        if (shouldRedirect) {
          setTimeout(() => {
            const redirectUrl =
              actionType === 'create'
                ? '/recruiter-dashboard/careers'
                : `/recruiter-dashboard/careers/manage/${careerData._id}`;
            window.location.href = redirectUrl;
          }, 1300);
        }

        return true;
      }

      return false;
    }

    if (response.status === 200) {
      const successMessage = shouldRedirect
        ? actionType === 'create'
          ? `Career added ${status === 'active' ? 'and published' : ''}`
          : 'Career updated'
        : 'Progress saved';

      candidateActionToast(
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginLeft: 8,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: '#181D27' }}>
            {successMessage}
          </span>
        </div>,
        1300,
        <i
          className='la la-check-circle'
          style={{ color: '#039855', fontSize: 32 }}
        ></i>
      );

      if (shouldRedirect) {
        setTimeout(() => {
          const redirectUrl =
            actionType === 'create'
              ? '/recruiter-dashboard/careers'
              : `/recruiter-dashboard/careers/manage/${careerData._id}`;
          window.location.href = redirectUrl;
        }, 1300);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    const errorMessage = shouldRedirect
      ? actionType === 'create'
        ? 'Failed to add career'
        : 'Failed to update career'
      : 'Failed to save progress';
    errorToast(errorMessage, 1300);
    return false;
  } finally {
    if (savingRef) {
      savingRef.current = false;
    }
    onSavingStateChange(false);
  }
};
