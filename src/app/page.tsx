import { BookOpen, TrendingUp, Target, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-700 font-medium text-sm">Plataforma educativa interactiva</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent leading-tight">
            Bienvenido a uyCoding
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
            Plataforma de ejercicios educativos con seguimiento de progreso personalizado
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/register" 
              className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Comenzar ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a 
              href="/login" 
              className="px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all shadow-md border-2 border-red-200 hover:border-red-300 w-full sm:w-auto"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-red-200">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-red-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ejercicios Variados
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Amplia biblioteca de ejercicios adaptados a diferentes niveles y áreas de conocimiento
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-red-200">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-red-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Seguimiento de Progreso
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitorea tu avance con estadísticas detalladas y visualiza tu mejora continua
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-red-200">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-red-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Aprendizaje Personalizado
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Contenido adaptado a tu ritmo y estilo de aprendizaje para maximizar resultados
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-red-100 text-lg">Ejercicios disponibles</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-red-100 text-lg">Estudiantes activos</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-red-100 text-lg">Tasa de satisfacción</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}