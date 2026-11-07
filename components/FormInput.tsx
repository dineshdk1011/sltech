import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  id?: string;
  required?: boolean;
  className?: string;
  icon?: React.ElementType; // optional icon to show inside the input
}

export type InputFieldProps = BaseProps & { fieldType?: 'input' } & InputHTMLAttributes<HTMLInputElement>;
export type SelectFieldProps = BaseProps & { fieldType: 'select'; options: SelectOption[] } & SelectHTMLAttributes<HTMLSelectElement>;
export type TextareaFieldProps = BaseProps & { fieldType: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type FormInputProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export const FormInput: React.FC<FormInputProps> = (props) => {
  const {
    label,
    error,
    containerClassName = 'mb-3 flex flex-col gap-1',
    id,
    required,
    className = '',
  } = props as BaseProps;

  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
  const baseStyles = `w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B8B]/25 focus:border-[#002B8B] ${error ? 'border-red-500' : ''} ${className}`;

  const iconPresent = !!(props as BaseProps).icon;

  const inputStyle = {
    paddingLeft: iconPresent ? '2.75rem' : undefined,
    paddingRight: props.fieldType === 'select' ? '2.75rem' : undefined,
  } as React.CSSProperties;

  const commonProps = {
    id: inputId,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error && inputId ? `${inputId}-error` : undefined,
  };

  const Icon = (props as BaseProps).icon;
  const iconStyle = { left: '0.9rem' } as const;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {props.fieldType === 'select' && (
        <div className="relative">
          {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" style={iconStyle} />}
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            {...(() => {
              const { fieldType: _fieldType, options: _options, containerClassName: _containerClassName, error: _error, label: _label, icon: _icon, id: _id, required: _required, className: _className, ...selectProps } = props;
              void _fieldType; void _options; void _containerClassName; void _error; void _label; void _icon; void _id; void _required; void _className;
              return selectProps;
            })()}
            {...commonProps}
            className={`${baseStyles} h-11 appearance-none`}
            style={inputStyle}
          >
            {props.options.map((option, index) => (
              <option key={`${option.value}-${index}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {props.fieldType === 'textarea' && (
        <div className="relative">
          {Icon && <Icon className="pointer-events-none absolute left-4 top-3 text-slate-400 h-4 w-4" style={iconStyle} />}
          <textarea
            {...(() => {
              const { fieldType: _fieldType, containerClassName: _containerClassName, error: _error, label: _label, icon: _icon, id: _id, required: _required, className: _className, ...textareaProps } = props;
              void _fieldType; void _containerClassName; void _error; void _label; void _icon; void _id; void _required; void _className;
              return textareaProps;
            })()}
            {...commonProps}
            className={`${baseStyles} min-h-[120px] resize-y`}
            style={inputStyle}
          />
        </div>
      )}

      {(props.fieldType === 'input' || !props.fieldType) && (
        <div className="relative">
          {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" style={iconStyle} />}
          <input
            {...(() => {
              const { fieldType: _fieldType, containerClassName: _containerClassName, error: _error, label: _label, icon: _icon, id: _id, required: _required, className: _className, ...inputProps } = props;
              void _fieldType; void _containerClassName; void _error; void _label; void _icon; void _id; void _required; void _className;
              return inputProps;
            })()}
            {...commonProps}
            className={baseStyles}
            style={inputStyle}
          />
        </div>
      )}

      {error && (
        <span id={inputId ? `${inputId}-error` : undefined} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;