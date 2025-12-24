import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import type { Role } from '../../core/types';

type AuthenticatedLayoutProps = {
    userRole: Role;
    userName: string;
    userEmail: string;
    onLogout?: () => void;
};

export const AuthenticatedLayout = ({
    userRole,
    userName,
    userEmail,
    onLogout,
}: AuthenticatedLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar
                userRole={userRole}
                userName={userName}
                userEmail={userEmail}
                onLogout={onLogout}
            />

            <main className="flex-1 overflow-auto">
                <div className="p-4 lg:p-6 pt-16 lg:pt-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AuthenticatedLayout;
