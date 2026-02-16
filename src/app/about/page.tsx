import { Code2, Heart, Target, Users, Zap, Rocket, Award, Globe, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-6">
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-red-700 font-semibold text-sm">Nuestra Historia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Sobre uyCoding
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Haciendo que aprender a programar sea divertido, accesible y efectivo para todos
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-12 border-2 border-red-100">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Nuestra Misión</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Optimizar el aprendizaje de la programación a través de una plataforma interactiva, 
                divertida y automatizada que permite a los estudiantes aprender a su propio ritmo 
                mientras ahorra tiempo valioso a los educadores.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Creemos que <strong className="text-red-600">todos pueden aprender a programar</strong>, 
                y que la tecnología debe potenciar, no reemplazar, el rol del profesor.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Eficiencia</h3>
            <p className="text-gray-700 leading-relaxed">
              Ahorramos tiempo a profesores automatizando correcciones y seguimiento del progreso.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Innovación</h3>
            <p className="text-gray-700 leading-relaxed">
              Gamificación y storytelling para hacer el aprendizaje más efectivo y entretenido.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Calidad</h3>
            <p className="text-gray-700 leading-relaxed">
              Contenido probado en aulas reales, diseñado con 3 años de experiencia educativa.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-8 sm:p-12 mb-12 text-white shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-4">Nuestra Historia</h2>
              <div className="space-y-4 text-red-50 leading-relaxed">
                <p>
                  uyCoding nació en <strong className="text-white">Uruguay 🇺🇾</strong> en 2024 desde la experiencia real 
                  de dictar <strong className="text-white">talleres de informática en un colegio durante 3 años</strong>.
                </p>
                <p>
                  Como profesor, me enfrentaba constantemente al desafío de corregir decenas de ejercicios manualmente, 
                  dar feedback personalizado a cada estudiante y mantener la motivación alta. 
                  <strong className="text-white"> Necesitaba una solución que me ahorrara tiempo</strong> sin sacrificar la calidad educativa.
                </p>
                <p>
                  Así nació uyCoding: una plataforma que <strong className="text-white">automatiza la corrección</strong>, 
                  <strong className="text-white"> gamifica el aprendizaje</strong> y permite que los estudiantes avancen a su ritmo 
                  mientras yo me enfoco en lo que realmente importa: <strong className="text-white">enseñar y acompañar</strong>.
                </p>
                <p>
                  Actualmente estamos en <strong className="text-white">versión Beta</strong>, mejorando constantemente 
                  gracias al feedback de nuestros estudiantes y otros educadores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
            <div className="text-4xl font-black text-indigo-600 mb-2">100+</div>
            <p className="text-gray-600 font-semibold">Ejercicios</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
            <div className="text-4xl font-black text-purple-600 mb-2">11</div>
            <p className="text-gray-600 font-semibold">Módulos</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
            <div className="text-4xl font-black text-green-600 mb-2">3</div>
            <p className="text-gray-600 font-semibold">Años de Experiencia</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
            <div className="text-4xl font-black text-red-600 mb-2">500+</div>
            <p className="text-gray-600 font-semibold">Estudiantes</p>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-12 border-2 border-gray-200">
          <div className="text-center mb-8">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-gray-900 mb-3">El Emprendimiento</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un proyecto nacido desde la experiencia real en el aula, desarrollado por un profesor 
              que vivió en primera persona los desafíos de enseñar programación.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h3 className="font-black text-gray-900">Hecho con ❤️ en Uruguay</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Combinamos 3 años de experiencia educativa real con tecnología moderna 
              para crear una herramienta que resuelve problemas reales de profesores y estudiantes.
            </p>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-xl font-black text-purple-900 mb-2">Estamos en Beta</h3>
              <p className="text-purple-800 leading-relaxed mb-4">
                uyCoding está en constante evolución. Agregamos nuevas funcionalidades cada semana 
                basadas en feedback real de aulas y estudiantes. Tu opinión es invaluable para nosotros.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
              >
                Enviar Feedback
                <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-gray-600 mb-8">
            Únete a nuestra comunidad y comienza tu aventura de aprendizaje hoy
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Crear cuenta
            <Rocket className="w-5 h-5" />
          </Link>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}