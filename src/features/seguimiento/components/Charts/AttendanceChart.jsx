/**
 * ==============================================
 * Gráfico de Asistencia (placeholder) - Kallpa UNL
 * ==============================================
 * 
 * Este componente queda listo para integrar Chart.js.
 * Por ahora es un placeholder para mantener la estructura.
 */

import PropTypes from 'prop-types';

const AttendanceChart = ({ title = 'Asistencia' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="h-48 flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded">
        Gráfico (pendiente integrar Chart.js)
      </div>
    </div>
  );
};

AttendanceChart.propTypes = {
  title: PropTypes.string,
};

export default AttendanceChart;
