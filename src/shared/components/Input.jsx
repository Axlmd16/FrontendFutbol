/**
 * ==============================================
 * Input Base - Kallpa UNL
 * ==============================================
 * 
 * Input reutilizable con:
 * - label
 * - error
 * - icon (opcional)
 */

import PropTypes from 'prop-types';

const Input = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}{props.required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span> : null}

        <input
          id={inputId}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
            icon ? 'pl-10' : '',
            error ? 'border-red-300' : 'border-gray-300',
            className,
          ].join(' ')}
          {...props}
        />
      </div>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
