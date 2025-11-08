'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
}

/**
 * FormField - Reusable form field wrapper component
 * Replicates shadcn FormField pattern with SASS styling support
 *
 * @example
 * <FormField
 *   name="jobTitle"
 *   label="Job Title"
 *   description="Enter the position title"
 *   error={errors.jobTitle}
 *   required
 * >
 *   <input
 *     className="form-control"
 *     value={jobTitle}
 *     onChange={(e) => setJobTitle(e.target.value)}
 *   />
 * </FormField>
 */
export default function FormField({
  name,
  label,
  description,
  error,
  children,
  className = '',
  labelClassName = '',
  controlClassName = '',
}: FormFieldProps) {
  return (
    <div className={`form-field ${className}`} data-field-name={name}>
      {label && (
        <label
          htmlFor={name}
          className={`form-field-label ${labelClassName}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 6,
            fontFamily: "'Satoshi', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '1.4285714285714286em',
            color: '#414651',
          }}
        >
          <span>{label}</span>
        </label>
      )}

      <div className={`form-field-control ${controlClassName}`}>{children}</div>

      {description && !error && (
        <div
          className='form-field-description'
          style={{
            fontSize: 12,
            color: '#667085',
            marginTop: 6,
          }}
        >
          {description}
        </div>
      )}

      {error && (
        <div
          className='form-field-error'
          style={{
            fontSize: 12,
            color: '#DC6803',
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className='la la-exclamation-circle' style={{ fontSize: 14 }}></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
