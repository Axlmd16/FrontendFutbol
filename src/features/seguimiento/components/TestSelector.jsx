/**
 * ==============================================
 * Selector de Test - Kallpa UNL
 * ==============================================
 * 
 * Componente UI para seleccionar el tipo de test
 * deportivo a consultar/registrar.
 */

import PropTypes from 'prop-types';
import { TEST_TYPES } from '@/app/config/constants';

const options = [
  { value: TEST_TYPES.SPRINT, label: 'Sprint' },
  { value: TEST_TYPES.ENDURANCE, label: 'Resistencia' },
  { value: TEST_TYPES.YOYO, label: 'Yo-Yo Test' },
  { value: TEST_TYPES.TECHNICAL, label: 'Técnico' },
];

const TestSelector = ({ value, onChange, disabled = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de test</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

TestSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TestSelector;
