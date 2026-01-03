/**
 * AthletesListPage - Página de gestión de Deportistas y Representantes
 * Optimizado con TanStack Query para caching
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Componentes
import AthletesTable from "../components/AthletesTable";
import RepresentativesTable from "../components/RepresentativesTable";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Modal from "@/shared/components/Modal";
import Loader from "@/shared/components/Loader";

// Servicios
import athletesApi from "../services/athletes.api";
import representativesApi from "../services/representatives.api";

// Hooks
import useDebounce from "@/shared/hooks/useDebounce";
import {
  useAthletes,
  useRepresentatives,
  useInvalidateInscriptions,
} from "../hooks/useInscriptions";

// Config
import {
  ROUTES,
  MESSAGES,
  ESTAMENTO_FILTER_OPTIONS,
} from "@/app/config/constants";

// Iconos
import {
  Search,
  UserPlus,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  UsersRound,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

const AthletesListPage = () => {
  // Tab activo
  const [activeTab, setActiveTab] = useState("athletes");

  // Filtros y paginación - Deportistas
  const [athleteSearch, setAthleteSearch] = useState("");
  const [estamentoFilter, setEstamentoFilter] = useState("");
  const [athletePage, setAthletePage] = useState(1);
  const athleteLimit = 10;

  // Filtros y paginación - Representantes
  const [repSearch, setRepSearch] = useState("");
  const [repPage, setRepPage] = useState(1);
  const repLimit = 10;

  // Debounce
  const debouncedAthleteSearch = useDebounce(athleteSearch, 500);
  const debouncedRepSearch = useDebounce(repSearch, 500);

  // Modal de confirmación
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    item: null,
    type: null,
    loading: false,
  });

  const navigate = useNavigate();
  const { invalidateAthletes, invalidateRepresentatives } =
    useInvalidateInscriptions();

  // ========================================
  // TANSTACK QUERY - DEPORTISTAS
  // ========================================
  const {
    data: athletesData,
    isLoading: athletesLoading,
    error: athletesError,
    refetch: refetchAthletes,
  } = useAthletes({
    page: athletePage,
    limit: athleteLimit,
    search: debouncedAthleteSearch || undefined,
    type_athlete: estamentoFilter || undefined,
  });

  const athletes = athletesData?.items || [];
  const athletesTotal = athletesData?.total || 0;

  // ========================================
  // TANSTACK QUERY - REPRESENTANTES
  // ========================================
  const {
    data: representativesData,
    isLoading: representativesLoading,
    error: representativesError,
    refetch: refetchRepresentatives,
  } = useRepresentatives({
    page: repPage,
    limit: repLimit,
    search: debouncedRepSearch || undefined,
  });

  const representatives = representativesData?.items || [];
  const representativesTotal = representativesData?.total || 0;

  // ========================================
  // HANDLERS DE DEPORTISTAS
  // ========================================
  const handleAthleteStatusClick = (athlete) => {
    setStatusModal({
      isOpen: true,
      item: athlete,
      type: "athlete",
      loading: false,
    });
  };

  const handleAthleteCreate = () => navigate(ROUTES.INSCRIPTION_CREATE);
  const handleAthleteEdit = (athlete) =>
    navigate(ROUTES.INSCRIPTION_EDIT.replace(":id", athlete.id));
  const handleAthleteView = (athlete) =>
    navigate(ROUTES.ATHLETE_DETAIL.replace(":id", athlete.id));
  const handleAthletePageChange = (newPage) => setAthletePage(newPage);

  // ========================================
  // HANDLERS DE REPRESENTANTES
  // ========================================
  const handleRepresentativeStatusClick = (rep) => {
    setStatusModal({
      isOpen: true,
      item: rep,
      type: "representative",
      loading: false,
    });
  };

  const handleRepresentativeEdit = (rep) => {
    navigate(ROUTES.REPRESENTATIVE_EDIT.replace(":id", rep.id));
  };

  const handleViewAthleteFromRep = (athlete) => {
    navigate(ROUTES.ATHLETE_DETAIL.replace(":id", athlete.id));
  };

  const handleRepPageChange = (newPage) => setRepPage(newPage);

  // ========================================
  // CONFIRMAR CAMBIO DE ESTADO
  // ========================================
  const handleStatusConfirm = async () => {
    if (!statusModal.item) return;

    setStatusModal((prev) => ({ ...prev, loading: true }));
    const isActive = statusModal.item.is_active;

    try {
      if (statusModal.type === "athlete") {
        if (isActive) {
          await athletesApi.desactivate(statusModal.item.id);
          toast.success(MESSAGES.SUCCESS.ATHLETE_DEACTIVATED);
        } else {
          await athletesApi.activate(statusModal.item.id);
          toast.success(MESSAGES.SUCCESS.ATHLETE_ACTIVATED);
        }
        invalidateAthletes();
      } else {
        if (isActive) {
          await representativesApi.deactivate(statusModal.item.id);
          toast.success("Representante desactivado");
        } else {
          await representativesApi.activate(statusModal.item.id);
          toast.success("Representante activado");
        }
        invalidateRepresentatives();
      }
      setStatusModal({ isOpen: false, item: null, type: null, loading: false });
    } catch (err) {
      toast.error("Error al cambiar estado", { description: err.message });
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleStatusCancel = () => {
    setStatusModal({ isOpen: false, item: null, type: null, loading: false });
  };

  // Refresh manual
  const handleRefresh = useCallback(() => {
    if (activeTab === "athletes") {
      refetchAthletes();
      toast.success("Datos actualizados");
    } else {
      refetchRepresentatives();
      toast.success("Datos actualizados");
    }
  }, [activeTab, refetchAthletes, refetchRepresentatives]);

  // Cálculos de paginación
  const athleteTotalPages = Math.ceil(athletesTotal / athleteLimit);
  const repTotalPages = Math.ceil(representativesTotal / repLimit);

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <Users size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Inscripciones
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Inscripciones
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Administra deportistas y representantes del club
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
              title="Actualizar datos"
            >
              <RefreshCw size={16} />
            </Button>

            {activeTab === "athletes" && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAthleteCreate}
                className="gap-2"
              >
                <UserPlus size={16} />
                Nuevo Deportista UNL
              </Button>
            )}

            {activeTab === "representatives" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER_SCHOOL)}
                className="gap-2"
              >
                <GraduationCap size={16} />
                Agregar Deportista Escuela
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("athletes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === "athletes"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-600 border border-base-300 hover:bg-slate-50"
            }`}
          >
            <User size={16} />
            Deportistas
            {athletesTotal > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "athletes"
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {athletesTotal}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("representatives")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === "representatives"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-600 border border-base-300 hover:bg-slate-50"
            }`}
          >
            <UsersRound size={16} />
            Representantes
            {representativesTotal > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "representatives"
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {representativesTotal}
              </span>
            )}
          </button>
        </div>

        {/* ========================================
            TAB: DEPORTISTAS
        ======================================== */}
        {activeTab === "athletes" && (
          <>
            {/* Filters */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={16} className="text-primary" />
                  <span className="font-medium text-base-content text-sm">
                    Filtros
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      type="text"
                      placeholder="Buscar por nombre, DNI..."
                      value={athleteSearch}
                      onChange={(e) => {
                        setAthleteSearch(e.target.value);
                        setAthletePage(1);
                      }}
                      icon={
                        <Search size={16} className="text-base-content/50" />
                      }
                    />
                  </div>
                  <select
                    value={estamentoFilter}
                    onChange={(e) => {
                      setEstamentoFilter(e.target.value);
                      setAthletePage(1);
                    }}
                    className="select select-bordered w-full bg-base-100"
                  >
                    {ESTAMENTO_FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error */}
            {athletesError && (
              <div className="alert alert-error mt-4">
                <span>{athletesError.message}</span>
              </div>
            )}

            {/* Content */}
            {athletesLoading ? (
              <div className="flex justify-center py-16">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <AthletesTable
                  athletes={athletes}
                  onEdit={handleAthleteEdit}
                  onDelete={handleAthleteStatusClick}
                  onViewDetail={handleAthleteView}
                  loading={athletesLoading}
                />

                {/* Pagination */}
                {athletesTotal > athleteLimit && (
                  <div className="flex items-center justify-between bg-base-100 px-4 py-3 rounded-xl border border-base-300 mt-4">
                    <div className="text-sm text-base-content/60">
                      Mostrando{" "}
                      <span className="font-medium text-base-content">
                        {(athletePage - 1) * athleteLimit + 1}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium text-base-content">
                        {Math.min(athletePage * athleteLimit, athletesTotal)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium text-base-content">
                        {athletesTotal}
                      </span>{" "}
                      resultados
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-sm btn-ghost"
                        disabled={athletePage === 1}
                        onClick={() => handleAthletePageChange(athletePage - 1)}
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </button>
                      <div className="join">
                        {[...Array(Math.min(5, athleteTotalPages))].map(
                          (_, i) => {
                            const pageNum =
                              athletePage <= 3 ? i + 1 : athletePage + i - 2;
                            if (pageNum > athleteTotalPages || pageNum < 1)
                              return null;
                            return (
                              <button
                                key={pageNum}
                                className={`join-item btn btn-sm ${
                                  athletePage === pageNum
                                    ? "btn-primary"
                                    : "btn-ghost"
                                }`}
                                onClick={() => handleAthletePageChange(pageNum)}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>
                      <button
                        className="btn btn-sm btn-ghost"
                        disabled={athletePage >= athleteTotalPages}
                        onClick={() => handleAthletePageChange(athletePage + 1)}
                      >
                        Siguiente
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ========================================
            TAB: REPRESENTANTES
        ======================================== */}
        {activeTab === "representatives" && (
          <>
            {/* Filters */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={16} className="text-primary" />
                  <span className="font-medium text-base-content text-sm">
                    Buscar Representante
                  </span>
                </div>
                <Input
                  type="text"
                  placeholder="Buscar por nombre, DNI..."
                  value={repSearch}
                  onChange={(e) => {
                    setRepSearch(e.target.value);
                    setRepPage(1);
                  }}
                  icon={<Search size={16} className="text-base-content/50" />}
                />
              </div>
            </div>

            {/* Error */}
            {representativesError && (
              <div className="alert alert-error mt-4">
                <span>{representativesError.message}</span>
              </div>
            )}

            {/* Content */}
            {representativesLoading ? (
              <div className="flex justify-center py-16">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <RepresentativesTable
                  representatives={representatives}
                  onEdit={handleRepresentativeEdit}
                  onToggleStatus={handleRepresentativeStatusClick}
                  onViewAthlete={handleViewAthleteFromRep}
                  loading={representativesLoading}
                />

                {/* Pagination */}
                {representativesTotal > repLimit && (
                  <div className="flex items-center justify-between bg-base-100 px-4 py-3 rounded-xl border border-base-300 mt-4">
                    <div className="text-sm text-base-content/60">
                      Mostrando{" "}
                      <span className="font-medium text-base-content">
                        {(repPage - 1) * repLimit + 1}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium text-base-content">
                        {Math.min(repPage * repLimit, representativesTotal)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium text-base-content">
                        {representativesTotal}
                      </span>{" "}
                      resultados
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-sm btn-ghost"
                        disabled={repPage === 1}
                        onClick={() => handleRepPageChange(repPage - 1)}
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </button>
                      <div className="join">
                        {[...Array(Math.min(5, repTotalPages))].map((_, i) => {
                          const pageNum =
                            repPage <= 3 ? i + 1 : repPage + i - 2;
                          if (pageNum > repTotalPages || pageNum < 1)
                            return null;
                          return (
                            <button
                              key={pageNum}
                              className={`join-item btn btn-sm ${
                                repPage === pageNum
                                  ? "btn-primary"
                                  : "btn-ghost"
                              }`}
                              onClick={() => handleRepPageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        className="btn btn-sm btn-ghost"
                        disabled={repPage >= repTotalPages}
                        onClick={() => handleRepPageChange(repPage + 1)}
                      >
                        Siguiente
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Modal de cambio de estado */}
        <Modal
          isOpen={statusModal.isOpen}
          onClose={handleStatusCancel}
          title={
            statusModal.item?.is_active
              ? `Desactivar ${
                  statusModal.type === "athlete"
                    ? "deportista"
                    : "representante"
                }`
              : `Activar ${
                  statusModal.type === "athlete"
                    ? "deportista"
                    : "representante"
                }`
          }
        >
          <p className="text-base-content/70">
            {statusModal.item?.is_active ? (
              <>
                ¿Estás seguro de desactivar a{" "}
                <strong className="text-base-content">
                  {statusModal.item?.full_name}
                </strong>
                ? Esta acción lo marcará como inactivo.
              </>
            ) : (
              <>
                ¿Deseas activar nuevamente a{" "}
                <strong className="text-base-content">
                  {statusModal.item?.full_name}
                </strong>
                ?
              </>
            )}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={handleStatusCancel}
              disabled={statusModal.loading}
            >
              Cancelar
            </Button>
            <Button
              variant={statusModal.item?.is_active ? "danger" : "success"}
              onClick={handleStatusConfirm}
              loading={statusModal.loading}
            >
              {statusModal.item?.is_active ? "Confirmar" : "Activar"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AthletesListPage;
