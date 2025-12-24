import {
    Users,
    Calendar,
    Activity,
    ClipboardCheck,
    Clock,
    Target,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
};

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => (
    <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-base-content/60 mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-base-content/50 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`bg-${color}/10 text-${color} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

type AthleteRowProps = {
    name: string;
    category: string;
    lastAttendance: string;
    status: 'present' | 'absent' | 'pending';
};

const AthleteRow = ({ name, category, lastAttendance, status }: AthleteRowProps) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
            <div className="avatar placeholder">
                <div className="bg-base-300 text-base-content rounded-full w-10">
                    <span className="text-sm">
                        {name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                    </span>
                </div>
            </div>
            <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-base-content/60">{category}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-base-content/50">{lastAttendance}</span>
            <span
                className={`badge badge-sm ${status === 'present'
                    ? 'badge-success'
                    : status === 'absent'
                        ? 'badge-error'
                        : 'badge-warning'
                    }`}
            >
                {status === 'present' ? 'Presente' : status === 'absent' ? 'Ausente' : 'Pendiente'}
            </span>
        </div>
    </div>
);

export const CoachDashboard = () => {
    // TODO: Estos datos vendrán de la API
    const stats = {
        myAthletes: 24,
        attendanceToday: 18,
        pendingEvaluations: 5,
        completedThisWeek: 12,
    };

    const todaySchedule = [
        { id: 1, time: '08:00', activity: 'Entrenamiento Sub-15', location: 'Cancha Principal' },
        { id: 2, time: '10:30', activity: 'Evaluación Física', location: 'Gimnasio' },
        { id: 3, time: '15:00', activity: 'Entrenamiento Sub-17', location: 'Cancha B' },
        { id: 4, time: '17:00', activity: 'Reunión técnica', location: 'Sala de reuniones' },
    ];

    const recentAthletes: AthleteRowProps[] = [
        { name: 'Carlos Mendoza', category: 'Sub-15', lastAttendance: 'Hoy', status: 'present' },
        { name: 'María López', category: 'Sub-17', lastAttendance: 'Hoy', status: 'present' },
        { name: 'Juan Pérez', category: 'Sub-15', lastAttendance: 'Ayer', status: 'absent' },
        { name: 'Ana García', category: 'Sub-17', lastAttendance: 'Hoy', status: 'pending' },
        { name: 'Pedro Ruiz', category: 'Sub-15', lastAttendance: 'Hoy', status: 'present' },
    ];

    const upcomingEvaluations = [
        { id: 1, name: 'Test YoYo - Sub-15', date: 'Mañana', athletes: 12 },
        { id: 2, name: 'Evaluación Técnica - Sub-17', date: 'Miércoles', athletes: 8 },
        { id: 3, name: 'Test de Velocidad', date: 'Viernes', athletes: 20 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard Entrenador</h1>
                <p className="text-base-content/60 mt-1">
                    Bienvenido, aquí está el resumen de tu día
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Mis Atletas"
                    value={stats.myAthletes}
                    subtitle="Asignados a ti"
                    icon={<Users className="h-6 w-6" />}
                    color="primary"
                />
                <StatCard
                    title="Asistencia Hoy"
                    value={stats.attendanceToday}
                    subtitle={`de ${stats.myAthletes} atletas`}
                    icon={<Calendar className="h-6 w-6" />}
                    color="success"
                />
                <StatCard
                    title="Evaluaciones Pendientes"
                    value={stats.pendingEvaluations}
                    subtitle="Por completar"
                    icon={<Target className="h-6 w-6" />}
                    color="warning"
                />
                <StatCard
                    title="Completadas"
                    value={stats.completedThisWeek}
                    subtitle="Esta semana"
                    icon={<TrendingUp className="h-6 w-6" />}
                    color="accent"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    to="/app/attendance/today"
                    className="btn btn-primary btn-lg justify-start gap-3 h-auto py-4"
                >
                    <ClipboardCheck className="h-6 w-6" />
                    <div className="text-left">
                        <p className="font-semibold">Tomar Asistencia</p>
                        <p className="text-xs opacity-80">Registrar asistencia del día</p>
                    </div>
                </Link>
                <Link
                    to="/app/assessments/new"
                    className="btn btn-secondary btn-lg justify-start gap-3 h-auto py-4"
                >
                    <Activity className="h-6 w-6" />
                    <div className="text-left">
                        <p className="font-semibold">Nueva Evaluación</p>
                        <p className="text-xs opacity-80">Iniciar sesión de pruebas</p>
                    </div>
                </Link>
                <Link
                    to="/app/athletes"
                    className="btn btn-accent btn-lg justify-start gap-3 h-auto py-4"
                >
                    <Users className="h-6 w-6" />
                    <div className="text-left">
                        <p className="font-semibold">Ver Atletas</p>
                        <p className="text-xs opacity-80">Lista de mis deportistas</p>
                    </div>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today Schedule */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Agenda de Hoy
                        </h2>
                        <div className="space-y-3 mt-2">
                            {todaySchedule.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 p-3 bg-base-200/50 rounded-lg"
                                >
                                    <div className="text-primary font-mono font-bold text-sm">
                                        {item.time}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{item.activity}</p>
                                        <p className="text-xs text-base-content/60">
                                            {item.location}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Athletes */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title text-lg">Atletas Recientes</h2>
                            <Link
                                to="/app/athletes"
                                className="btn btn-ghost btn-sm gap-1"
                            >
                                Ver todos
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-base-200">
                            {recentAthletes.map((athlete, idx) => (
                                <AthleteRow key={idx} {...athlete} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Evaluations */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-accent" />
                            Próximas Evaluaciones
                        </h2>
                        <div className="space-y-3 mt-2">
                            {upcomingEvaluations.map((evaluation) => (
                                <div
                                    key={evaluation.id}
                                    className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{evaluation.name}</p>
                                        <p className="text-xs text-base-content/60">
                                            {evaluation.date} • {evaluation.athletes} atletas
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-base-content/40" />
                                </div>
                            ))}
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/app/assessments" className="btn btn-ghost btn-sm">
                                Ver todas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachDashboard;
