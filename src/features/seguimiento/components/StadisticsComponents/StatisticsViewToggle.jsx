/**
 * StatisticsViewToggle Component
 *
 * Botones para cambiar entre vistas de estadísticas:
 * General, Asistencia y Tests.
 */

import React from "react";
import PropTypes from "prop-types";
import { BarChart3, CalendarCheck, Activity } from "lucide-react";

const views = [
  { id: "overview", label: "General", icon: BarChart3 },
  { id: "attendance", label: "Asistencia", icon: CalendarCheck },
  { id: "tests", label: "Tests", icon: Activity },
];

function StatisticsViewToggle({ activeView, onViewChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`btn btn-sm gap-2 ${
            activeView === view.id
              ? "btn-primary"
              : "btn-ghost border border-base-300"
          }`}
        >
          <view.icon size={16} />
          {view.label}
        </button>
      ))}
    </div>
  );
}

StatisticsViewToggle.propTypes = {
  activeView: PropTypes.oneOf(["overview", "attendance", "tests"]).isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default StatisticsViewToggle;
