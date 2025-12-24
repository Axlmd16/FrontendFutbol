/**
 * ==============================================
 * Gráfico de Rendimiento (placeholder) - Kallpa UNL
 * ==============================================
 * 
 * Placeholder para gráfico de rendimiento.
 * Listo para integrar Chart.js o similar.
 */

import PropTypes from 'prop-types';

const PerformanceChart = ({ title = 'Rendimiento' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="h-48 flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded">
        Gráfico (pendiente integrar Chart.js)
      </div>
    </div>
  );
};

PerformanceChart.propTypes = {
  title: PropTypes.string,
};

export default PerformanceChart;
