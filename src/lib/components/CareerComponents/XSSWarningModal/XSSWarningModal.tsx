'use client';

import React, { useState } from 'react';
import styles from './XSSWarningModal.module.scss';

interface SanitizationWarning {
  field: string;
  message: string;
  original: string;
  sanitized: string;
}

interface XSSWarningModalProps {
  warnings: SanitizationWarning[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function XSSWarningModal({
  warnings,
  onConfirm,
  onCancel,
}: XSSWarningModalProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const toggleExpand = (field: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(field)) {
      newExpanded.delete(field);
    } else {
      newExpanded.add(field);
    }
    setExpandedFields(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <i className="la la-exclamation-triangle" style={{ fontSize: 28, color: '#F59E0B' }}></i>
          </div>
          <h2 className={styles.title}>Security Warning</h2>
          <p className={styles.subtitle}>
            Potentially unsafe content detected in your submission
          </p>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            We detected content that may pose security risks. The following fields will be sanitized to remove potentially harmful code:
          </p>

          <div className={styles.warningsList}>
            {warnings.map((warning, index) => {
              const isExpanded = expandedFields.has(warning.field);
              const shouldTruncate = warning.original.length > 100 || warning.sanitized.length > 100;

              return (
                <div key={index} className={styles.warningItem}>
                  <div className={styles.warningHeader}>
                    <span className={styles.fieldName}>{warning.field}</span>
                    <span className={styles.warningMessage}>{warning.message}</span>
                  </div>

                  <div className={styles.comparisonContainer}>
                    <div className={styles.comparisonColumn}>
                      <div className={styles.comparisonLabel}>
                        <i className="la la-times-circle" style={{ color: '#EF4444', marginRight: 4 }}></i>
                        Original (Unsafe)
                      </div>
                      <div className={styles.codeBlock} style={{ borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' }}>
                        <code>
                          {isExpanded || !shouldTruncate
                            ? warning.original
                            : truncateText(warning.original)}
                        </code>
                      </div>
                    </div>

                    <div className={styles.comparisonColumn}>
                      <div className={styles.comparisonLabel}>
                        <i className="la la-check-circle" style={{ color: '#10B981', marginRight: 4 }}></i>
                        Sanitized (Safe)
                      </div>
                      <div className={styles.codeBlock} style={{ borderColor: '#D1FAE5', backgroundColor: '#F0FDF4' }}>
                        <code>
                          {isExpanded || !shouldTruncate
                            ? warning.sanitized
                            : truncateText(warning.sanitized)}
                        </code>
                      </div>
                    </div>
                  </div>

                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(warning.field)}
                      className={styles.expandButton}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                      <i className={`la la-angle-${isExpanded ? 'up' : 'down'}`} style={{ marginLeft: 4 }}></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.infoBox}>
            <i className="la la-info-circle" style={{ fontSize: 18, color: '#3B82F6', marginRight: 8 }}></i>
            <p>
              You can choose to proceed with the sanitized version or cancel to edit your content.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onCancel} className={styles.cancelButton}>
            <i className="la la-times" style={{ marginRight: 6 }}></i>
            Cancel & Edit
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            <i className="la la-check" style={{ marginRight: 6 }}></i>
            Proceed with Sanitized Content
          </button>
        </div>
      </div>
    </div>
  );
}
