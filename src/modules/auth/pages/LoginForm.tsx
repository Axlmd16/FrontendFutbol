import { Mail, Lock, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

type LoginFormValues = {
    email: string;
    password: string;
    remember: boolean;
};

type LoginFormProps = {
    onSubmit?: (values: LoginFormValues) => void | Promise<void>;
    isSubmittingExternal?: boolean;
};

const LoginForm = ({ onSubmit, isSubmittingExternal }: LoginFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
        mode: 'onTouched',
    });

    const disabled = Boolean(isSubmittingExternal) || isSubmitting;

    return (
        <form
            className="space-y-5"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit?.(values);
            })}
        >
            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary transition-all">
                    <Mail className="h-5 w-5 opacity-60" />
                    <input
                        type="email"
                        className="grow"
                        placeholder="tu@email.com"
                        autoComplete="email"
                        {...register('email', {
                            required: 'El email es requerido',
                            validate: {
                                matchPattern: (value) =>
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                        value
                                    ) || 'Email inválido',
                            },
                        })}
                    />
                </label>
                {errors.email && (
                    <p className="text-sm text-error flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">Contraseña</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary transition-all">
                    <Lock className="h-5 w-5 opacity-60" />
                    <input
                        type="password"
                        className="grow"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: {
                                value: 8,
                                message: 'La contraseña debe tener al menos 8 caracteres',
                            },
                        })}
                    />
                </label>
                {errors.password && (
                    <p className="text-sm text-error flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <label className="label cursor-pointer gap-2 hover:opacity-80 transition-opacity">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        {...register('remember')}
                    />
                    <span className="label-text">Recordarme</span>
                </label>
                <a className="link link-hover link-primary text-sm font-medium">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
            <button
                type="submit"
                className="btn btn-primary btn-block shadow-lg hover:shadow-xl transition-all"
                disabled={disabled}
            >
                {disabled ? (
                    <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Ingresando...
                    </>
                ) : (
                    <>
                        Entrar
                        <ChevronRight className="h-4 w-4" />
                    </>
                )}

            </button>

        </form>
    );
};

export default LoginForm;