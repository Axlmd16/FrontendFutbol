import {
    Users,
    Calendar,
    Activity,
    TrendingUp,
    UserPlus,
    ClipboardCheck,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type StatCardProps = {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
};

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
    <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-base-content/60 mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {change !== undefined && (
                        <p
                            className={`text-sm mt-1 flex items-center gap-1 ${change >= 0 ? 'text-success' : 'text-error'
                                }`}
                        >
                            {change >= 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(change)}% vs mes anterior
                        </p>
                    )}
                </div>
                <div className={`bg-${color}/10 text-${color} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

type QuickActionProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
    color: string;
};

const QuickAction = ({ title, description, icon, to, color }: QuickActionProps) => (
    <Link
        to={to}
        className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md hover:border-primary/30 transition-all group"
    >
        <div className="card-body p-5">
            <div className={`${color} p-3 rounded-xl w-fit mb-3`}>{icon}</div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-sm text-base-content/60">{description}</p>
        </div>
    </Link>
);

export const AdminDashboard = () => {
    // TODO: Estos datos vendrán de la API
    const stats = {
        totalAthletes: 156,
        athletesChange: 12,
        totalUsers: 8,
        usersChange: 2,
        attendanceToday: 89,
        attendanceChange: 5,
        evaluationsMonth: 45,
        evaluationsChange: -3,
    };

    const recentActivities = [
        { id: 1, action: 'Nuevo atleta registrado', user: 'Carlos Pérez', time: 'Hace 5 min' },
        { id: 2, action: 'Evaluación completada', user: 'María García', time: 'Hace 15 min' },
        { id: 3, action: 'Asistencia registrada', user: 'Juan López', time: 'Hace 30 min' },
        { id: 4, action: 'Usuario creado', user: 'Admin', time: 'Hace 1 hora' },
    ];

    const pendingTasks = [
        { id: 1, task: 'Revisar evaluaciones pendientes', count: 5 },
        { id: 2, task: 'Atletas sin asistencia esta semana', count: 12 },
        { id: 3, task: 'Reportes por generar', count: 3 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard Administrador</h1>
                <p className="text-base-content/60 mt-1">
                    Resumen general del sistema
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Atletas"
                    value={stats.totalAthletes}
                    change={stats.athletesChange}
                    icon={<Users className="h-6 w-6" />}
                    color="primary"
                />
                <StatCard
                    title="Usuarios Sistema"
                    value={stats.totalUsers}
                    change={stats.usersChange}
                    icon={<TrendingUp className="h-6 w-6" />}
                    color="secondary"
                />
                <StatCard
                    title="Asistencia Hoy"
                    value={`${stats.attendanceToday}%`}
                    change={stats.attendanceChange}
                    icon={<Calendar className="h-6 w-6" />}
                    color="success"
                />
                <StatCard
                    title="Evaluaciones Mes"
                    value={stats.evaluationsMonth}
                    change={stats.evaluationsChange}
                    icon={<Activity className="h-6 w-6" />}
                    color="accent"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction
                        title="Nuevo Atleta"
                        description="Registrar un nuevo deportista"
                        icon={<UserPlus className="h-5 w-5 text-primary" />}
                        to="/app/athletes/new"
                        color="bg-primary/10"
                    />
                    <QuickAction
                        title="Tomar Asistencia"
                        description="Registrar asistencia del día"
                        icon={<ClipboardCheck className="h-5 w-5 text-success" />}
                        to="/app/attendance/today"
                        color="bg-success/10"
                    />
                    <QuickAction
                        title="Nueva Evaluación"
                        description="Crear sesión de evaluación"
                        icon={<Activity className="h-5 w-5 text-accent" />}
                        to="/app/assessments/new"
                        color="bg-accent/10"
                    />
                    <QuickAction
                        title="Nuevo Usuario"
                        description="Agregar entrenador o admin"
                        icon={<Users className="h-5 w-5 text-secondary" />}
                        to="/app/users/new"
                        color="bg-secondary/10"
                    />
                </div>
            </div>

            {/* Two columns: Activity + Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-lg">Actividad Reciente</h2>
                        <div className="divide-y divide-base-200">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="py-3 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{activity.action}</p>
                                        <p className="text-xs text-base-content/60">
                                            por {activity.user}
                                        </p>
                                    </div>
                                    <span className="text-xs text-base-content/50">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/app/activity" className="btn btn-ghost btn-sm">
                                Ver todo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-lg">Tareas Pendientes</h2>
                        <div className="space-y-3">
                            {pendingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-warning" />
                                        <span className="text-sm">{task.task}</span>
                                    </div>
                                    <span className="badge badge-warning badge-sm">
                                        {task.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/app/tasks" className="btn btn-ghost btn-sm">
                                Ver todas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
