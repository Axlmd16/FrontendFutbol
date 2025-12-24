import NavbarPublic from '../../components/navbarPublic';
import LoginForm from '../../../modules/auth/pages/LoginForm';

function LoginPage() {
    return (
        <div className="min-h-screen bg-base-200">
            <NavbarPublic />

            <div className="hero">
                <div className="hero-content flex-col lg:flex-row-reverse w-full">
                    <div className="text-center lg:text-left max-w-xl">
                        <h1 className="text-4xl lg:text-5xl font-bold">Inicia sesión</h1>
                        <p className="py-6 text-base-content/70">
                            Accede al panel para gestionar atletas, asistencia y evaluaciones.
                        </p>
                    </div>

                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <LoginForm
                                onSubmit={async (values) => {
                                    // TODO: conectar con endpoint real de autenticación
                                    console.log('login', values);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage