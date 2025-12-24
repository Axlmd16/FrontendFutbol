/**
 * ==============================================
 * Tarjeta de Estadística - Kallpa UNL
 * ==============================================
 * 
 * Componente reutilizable para mostrar métricas
 * (ej: promedio, máximo, asistencia, etc.).
 */

import PropTypes from 'prop-types';

const StatsCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
        {icon ? <div className="text-gray-400">{icon}</div> : null}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
};

export default StatsCard;
