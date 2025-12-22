import NavbarPublic from '../../components/navbarPublic';
import LoginForm from '../../../modules/auth/pages/LoginForm';
import { BarChart3, Shield, Users } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-300 to-base-200">
            <NavbarPublic />

            <div className="hero min-h-[calc(100vh-4rem)] py-8">
                <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-6xl gap-12">
                    <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300">
                        <div className="card-body p-8">
                            <h2 className="card-title text-2xl font-bold mb-2">Iniciar Sesión</h2>
                            <p className="text-base-content/60 mb-6">
                                Ingresa tus credenciales para continuar
                            </p>

                            <LoginForm
                                onSubmit={async (values) => {
                                    console.log('login', values);
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                }}
                            />

                            <div className="divider text-sm text-base-content/50">o</div>

                            <p className="text-center text-sm text-base-content/60">
                                ¿No tienes cuenta?{' '}
                                <a className="link link-primary font-medium">
                                    Contacta al administrador
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;