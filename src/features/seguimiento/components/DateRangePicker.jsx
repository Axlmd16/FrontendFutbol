/**
 * Componente Selector de Rango de Fechas
 * 
 * Permite seleccionar un rango de fechas para filtrar reportes.
 */

import { useState } from "react";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { Calendar, X } from "lucide-react";

const DateRangePicker = ({ onDateRangeChange, disabled = false }) => {
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    if (dateRange.start_date && dateRange.end_date) {
      if (new Date(dateRange.start_date) > new Date(dateRange.end_date)) {
        alert("La fecha de inicio no puede ser mayor a la fecha de fin");
        return;
      }
      onDateRangeChange(dateRange);
    } else if (!dateRange.start_date && !dateRange.end_date) {
      // Permitir limpiar fechas
      onDateRangeChange({ start_date: "", end_date: "" });
    }
  };

  const handleClear = () => {
    const clearedDates = { start_date: "", end_date: "" };
    setDateRange(clearedDates);
    onDateRangeChange(clearedDates);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar size={20} />
        Rango de Fechas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Fecha Inicio"
          type="date"
          value={dateRange.start_date}
          onChange={(e) => handleDateChange("start_date", e.target.value)}
          disabled={disabled}
        />
        <Input
          label="Fecha Fin"
          type="date"
          value={dateRange.end_date}
          onChange={(e) => handleDateChange("end_date", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleClear}
          variant="secondary"
          disabled={disabled}
        >
          <X size={16} />
          Limpiar
        </Button>
        <Button
          onClick={handleApply}
          variant="primary"
          disabled={disabled}
        >
          <Calendar size={16} />
          Aplicar
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
