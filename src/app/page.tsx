import { BookOpen, TrendingUp, Target, ArrowRight, Sparkles, Users, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-red-700 font-semibold text-sm">Plataforma educativa interactiva</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent leading-tight animate-slide-up">
            Aprende a Programar Jugando
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Descubre el mundo de la programación a través de{' '}
            <span className="font-bold text-red-600">aventuras interactivas</span> con personajes divertidos
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Comenzar gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-md border-2 border-red-200 hover:border-red-300 hover:shadow-lg w-full sm:w-auto"
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Gratis para siempre</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Sin tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            ¿Por qué elegir uyCoding?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Una plataforma diseñada para que aprender a programar sea divertido y efectivo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 hover:border-red-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <BookOpen className="w-8 h-8 text-red-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              11 Módulos de Aventuras
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Aprende con el gatito, el perrito, el león y muchos personajes más a través de historias interactivas
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Desde conceptos básicos hasta proyectos avanzados</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ejercicios de código, videos y lecturas</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 hover:border-red-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <TrendingUp className="w-8 h-8 text-red-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              Progreso Gamificado
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Gana puntos, desbloquea niveles y sigue tu evolución en tiempo real
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sistema de puntos y logros</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Estadísticas detalladas de tu desempeño</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 hover:border-red-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Target className="w-8 h-8 text-red-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              Aprendizaje Progresivo
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Desbloquea contenido a medida que avanzas, asegurando una curva de aprendizaje óptima
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sistema de desbloqueo secuencial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Aprende a tu propio ritmo</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl p-12 border-2 border-red-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Tu Aventura de Aprendizaje
            </h2>
            <p className="text-lg text-gray-600">
              Desde tus primeros pasos hasta proyectos complejos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200">
              <div className="text-4xl mb-3">🐱</div>
              <h4 className="font-bold text-gray-900 mb-2">Nivel 1-3</h4>
              <p className="text-sm text-gray-600">Variables, operaciones y bucles básicos</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-yellow-200">
              <div className="text-4xl mb-3">🦁</div>
              <h4 className="font-bold text-gray-900 mb-2">Nivel 4-6</h4>
              <p className="text-sm text-gray-600">Lógica, arrays y optimización</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="text-4xl mb-3">🐻</div>
              <h4 className="font-bold text-gray-900 mb-2">Nivel 7-9</h4>
              <p className="text-sm text-gray-600">Funciones, strings y objetos</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-red-300">
              <div className="text-4xl mb-3">🐢</div>
              <h4 className="font-bold text-gray-900 mb-2">Nivel 10+</h4>
              <p className="text-sm text-gray-600">Proyectos finales y desafíos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="transform hover:scale-105 transition-transform">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-5xl font-black mb-2">100+</div>
              <div className="text-red-100 text-lg font-medium">Ejercicios Interactivos</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-5xl font-black mb-2">500+</div>
              <div className="text-red-100 text-lg font-medium">Estudiantes Activos</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-5xl font-black mb-2">11</div>
              <div className="text-red-100 text-lg font-medium">Módulos de Aventura</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
          ¿Listo para comenzar tu aventura?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Únete a cientos de estudiantes que ya están aprendiendo a programar
        </p>
        <Link 
          href="/register"
          className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Crear cuenta gratis
          <ArrowRight className="w-6 h-6" />
        </Link>
      </section>

    </div>
  );
}