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

import PropTypes from "prop-types";

const Input = ({ label, error, icon, className = "", id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="label py-0.5">
          <span className="label-text text-xs font-medium text-slate-600">
            {label}
            {props.required ? <span className="text-error"> *</span> : null}
          </span>
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        ) : null}

        <input
          id={inputId}
          className={[
            "input input-bordered input-sm w-full bg-white",
            icon ? "pl-10" : "",
            error ? "border-red-300" : "border-gray-300",
            className,
          ].join(" ")}
          {...props}
        />
      </div>

      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
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
