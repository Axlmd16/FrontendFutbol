import { Link } from 'react-router-dom';
import NavbarPublic from '../../components/navbarPublic';
import { Award, BarChart3, Calendar, ChevronRight, Shield, TrendingUp, Users, Zap } from 'lucide-react';

const LandingPage = () => {
	const features = [
		{
			icon: Users,
			title: 'Gestión de Atletas',
			description: 'Ficha completa del deportista con datos personales, representante y estadísticas de rendimiento.',
			color: 'text-primary',
			badge: 'Registro'
		},
		{
			icon: Calendar,
			title: 'Control de Asistencia',
			description: 'Registra presencia en entrenamientos con hora de entrada, salida y gestión de justificaciones.',
			color: 'text-secondary',
			badge: 'Control'
		},
		{
			icon: BarChart3,
			title: 'Evaluaciones Deportivas',
			description: 'Pruebas físicas y técnicas: YoYo Test, Sprint, Resistencia y evaluaciones de habilidades.',
			color: 'text-accent',
			badge: 'Pruebas'
		}
	];

	const benefits = [
		{ icon: Zap, text: 'Acceso rápido y eficiente' },
		{ icon: Shield, text: 'Datos seguros y protegidos' },
		{ icon: TrendingUp, text: 'Análisis de rendimiento' },
		{ icon: Award, text: 'Seguimiento personalizado' }
	];

	return (
		<div className="min-h-screen bg-linear-to-br from-base-200 via-base-300 to-base-200">
			<NavbarPublic />

			<main>
				{/* Hero Section */}
				<section className="hero min-h-[90vh] relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/5"></div>

					<div className="hero-content flex-col lg:flex-row gap-12 z-10 max-w-7xl">
						<div className="max-w-2xl space-y-8">
							<div className="inline-block">
								<div className="badge badge-primary badge-lg gap-2 shadow-lg">
									<Zap className="h-4 w-4" />
									Gestión Deportiva Profesional
								</div>
							</div>

							<h1 className="text-5xl lg:text-7xl font-bold leading-tight">
								<span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
									Gestión inteligente
								</span>
								<br />
								<span className="text-base-content">
									de entrenamientos
								</span>
							</h1>

							<p className="text-xl text-base-content/70 leading-relaxed">
								Centraliza atletas, controla asistencia y evalúa el rendimiento con pruebas físicas y técnicas. Todo en una plataforma moderna y fácil de usar.
							</p>

							<div className="flex flex-wrap gap-4">
								<a href="/auth/login" className="btn btn-primary btn-lg shadow-lg hover:shadow-xl gap-2">
									Iniciar sesión
									<ChevronRight className="h-5 w-5" />
								</a>
								<a href="#features" className="btn btn-outline btn-lg gap-2">
									Ver características
									<BarChart3 className="h-5 w-5" />
								</a>
							</div>

							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
								{benefits.map((benefit, index) => (
									<div key={index} className="flex items-center gap-2 text-sm">
										<benefit.icon className="h-5 w-5 text-primary shrink-0" />
										<span className="text-base-content/70">{benefit.text}</span>
									</div>
								))}
							</div>
						</div>

						<div className="w-full max-w-lg">
							<div className="card bg-base-100 shadow-2xl border border-base-300 hover:shadow-3xl transition-all duration-300">
								<div className="card-body p-6">
									<div className="flex items-center justify-between mb-4">
										<h2 className="card-title text-xl">Módulos Principales</h2>
										<div className="badge badge-primary badge-sm">3 Módulos</div>
									</div>

									<ul className="space-y-3">
										{features.map((feature, index) => (
											<li key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors">
												<div className="flex items-center gap-3">
													<feature.icon className={`h-6 w-6 ${feature.color}`} />
													<span className="font-medium">{feature.title}</span>
												</div>
												<span className="badge badge-outline badge-sm">{feature.badge}</span>
											</li>
										))}
									</ul>

									<div className="card-actions justify-end mt-6">
										<a href="/auth/login" className="btn btn-primary btn-block gap-2 shadow-md">
											Acceder al panel
											<ChevronRight className="h-4 w-4" />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="py-20 px-4 bg-base-100">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<div className="badge badge-primary badge-lg mb-4">Características</div>
							<h2 className="text-4xl lg:text-5xl font-bold mb-4">
								Todo lo que necesitas para
								<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"> gestionar tu equipo</span>
							</h2>
							<p className="text-lg text-base-content/60 max-w-2xl mx-auto">
								Herramientas profesionales diseñadas para entrenadores y gestores deportivos
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{features.map((feature, index) => (
								<div
									key={index}
									className="card bg-linear-to-br from-base-200 to-base-100 shadow-xl border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
								>
									<div className="card-body">
										<div className={`w-14 h-14 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4`}>
											<feature.icon className={`h-7 w-7 ${feature.color}`} />
										</div>

										<h3 className="card-title text-xl mb-2">{feature.title}</h3>
										<p className="text-base-content/70 leading-relaxed">
											{feature.description}
										</p>

										<div className="card-actions justify-end mt-4">
											<div className="badge badge-outline gap-1">
												{feature.badge}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 px-4 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10">
					<div className="mx-auto max-w-4xl text-center space-y-8">
						<h2 className="text-4xl lg:text-5xl font-bold">
							¿Listo para optimizar
							<br />
							<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
								la gestión de tu equipo?
							</span>
						</h2>

						<p className="text-xl text-base-content/70 max-w-2xl mx-auto">
							Únete a los entrenadores que ya están utilizando SportTrack para llevar el rendimiento de sus atletas al siguiente nivel.
						</p>

						<div className="flex flex-wrap gap-4 justify-center pt-4">
							<a href="/auth/login" className="btn btn-primary btn-lg shadow-lg gap-2">
								Comenzar ahora
								<ChevronRight className="h-5 w-5" />
							</a>
							<a href="#" className="btn btn-outline btn-lg gap-2">
								Solicitar demo
							</a>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="footer footer-center p-10 bg-base-200 text-base-content">
				<aside>
					<p className="font-bold text-lg">SportTrack</p>
					<p className="text-base-content/60">Gestión deportiva profesional desde 2024</p>
				</aside>
			</footer>
		</div>
	);
};

export default LandingPage;