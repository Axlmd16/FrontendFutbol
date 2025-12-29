import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Save, CalendarCheck, RefreshCw } from "lucide-react";

// Componentes
import AttendanceForm from "../components/AttendanceComponents/AttendanceForm";
import AttendanceTable from "../components/AttendanceComponents/AttendanceTable";
import Button from "@/shared/components/Button";

// Servicios
import attendanceApi from "../services/attendance.api";
import athletesApi from "../services/athletes.api";

// Hooks
import useDebounce from "@/shared/hooks/useDebounce";

/**
 * Página principal de registro de asistencia de atletas.
 * Permite seleccionar fecha, filtrar por tipo de atleta,
 * marcar presente/ausente y guardar en lote.
 */
function AttendancePage() {
  // Estado de filtros
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Estado de datos
  const [athletes, setAthletes] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ==========================================
  // CARGAR ATLETAS
  // ==========================================

  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type_athlete: typeFilter || undefined,
      };

      const response = await athletesApi.getAll(params);

      if (response.status === "success" && response.data) {
        const athletesList = response.data.items || [];
        setAthletes(athletesList);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));

        // Inicializar datos de asistencia (todos presentes por defecto)
        const initialAttendance = {};
        athletesList.forEach((athlete) => {
          // Mantener estado previo si existe, sino inicializar como presente
          initialAttendance[athlete.id] = attendanceData[athlete.id] || {
            is_present: true,
            justification: "",
          };
        });
        setAttendanceData(initialAttendance);
      }
    } catch (error) {
      console.error("Error al cargar atletas:", error);
      toast.error("Error al cargar atletas", {
        description: error.message || "Intente nuevamente",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, typeFilter]);

  // Cargar atletas cuando cambien los filtros
  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // ==========================================
  // HANDLERS DE ASISTENCIA
  // ==========================================

  /**
   * Alternar estado de asistencia de un atleta
   */
  const handleToggleAttendance = (athleteId, isPresent) => {
    setAttendanceData((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        is_present: isPresent,
        // Limpiar justificación si está presente
        justification: isPresent ? "" : prev[athleteId]?.justification || "",
      },
    }));
  };

  /**
   * Actualizar justificación de un atleta
   */
  const handleJustificationChange = (athleteId, justification) => {
    setAttendanceData((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        justification,
      },
    }));
  };

  /**
   * Marcar todos los atletas como presentes
   */
  const handleMarkAllPresent = () => {
    const updatedData = {};
    athletes.forEach((athlete) => {
      updatedData[athlete.id] = {
        is_present: true,
        justification: "",
      };
    });
    setAttendanceData(updatedData);
    toast.success("Todos marcados como presentes");
  };

  // ==========================================
  // GUARDAR ASISTENCIA
  // ==========================================

  const handleSaveAttendance = async () => {
    if (athletes.length === 0) {
      toast.warning("No hay atletas para registrar");
      return;
    }

    setSaving(true);

    try {
      // Preparar registros
      const records = athletes.map((athlete) => ({
        athlete_id: athlete.id,
        is_present: attendanceData[athlete.id]?.is_present ?? true,
        justification: attendanceData[athlete.id]?.justification || null,
      }));

      // Preparar payload
      const payload = {
        date: date,
        time: time || undefined, // Si no hay hora, el backend usa la actual
        records: records,
      };

      const response = await attendanceApi.createBulk(payload);

      if (response.status === "success") {
        const { created_count, updated_count } = response.data || {};

        // Mostrar mensaje con hora usada
        const timeUsed =
          time ||
          new Date().toLocaleTimeString("es-EC", {
            hour: "2-digit",
            minute: "2-digit",
          });

        toast.success("Asistencia guardada exitosamente", {
          description: `📅 ${date} ⏰ ${timeUsed} — ${
            created_count || 0
          } nuevos, ${updated_count || 0} actualizados`,
        });
      }
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      toast.error("Error al guardar asistencia", {
        description: error.message || "Intente nuevamente",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">
              Registro de Asistencia
            </h1>
          </div>
          <p className="text-gray-600">
            Selecciona una fecha y registra la asistencia de los atletas.
            Utiliza los filtros para encontrar atletas específicos.
          </p>
        </div>

        {/* Filtros */}
        <AttendanceForm
          date={date}
          time={time}
          typeFilter={typeFilter}
          searchTerm={searchTerm}
          onDateChange={setDate}
          onTimeChange={setTime}
          onTypeFilterChange={setTypeFilter}
          onSearchChange={setSearchTerm}
        />

        {/* Tabla de atletas */}
        <AttendanceTable
          athletes={athletes}
          attendanceData={attendanceData}
          onToggleAttendance={handleToggleAttendance}
          onJustificationChange={handleJustificationChange}
          onMarkAllPresent={handleMarkAllPresent}
          loading={loading}
        />

        {/* Barra de acciones flotante */}
        {athletes.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Info */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">{athletes.length}</span> atletas
                seleccionados para la fecha{" "}
                <span className="font-medium text-primary">{date}</span>
                {time && (
                  <>
                    {" "}
                    a las{" "}
                    <span className="font-medium text-secondary">{time}</span>
                  </>
                )}
              </div>

              {/* Botones */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={fetchAthletes}
                  disabled={loading}
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                  Actualizar
                </Button>

                <Button
                  variant="primary"
                  onClick={handleSaveAttendance}
                  loading={saving}
                  disabled={saving || athletes.length === 0}
                  className="gap-2"
                >
                  <Save size={18} />
                  Guardar Asistencia
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Espaciador para la barra flotante */}
        {athletes.length > 0 && <div className="h-24"></div>}
      </div>
    </div>
  );
}

export default AttendancePage;
