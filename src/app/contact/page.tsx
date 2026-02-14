import { Mail, MapPin, Clock, Send, MessageCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm">Estamos aquí para ayudarte</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Contacta con Soporte
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro equipo está listo para resolver tus dudas y ayudarte en tu aprendizaje
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Email Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Email de Soporte</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Envíanos un correo y te responderemos en menos de 24 horas
            </p>
            <a 
              href="mailto:soporte@uycoding.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl group"
            >
              <Send className="w-5 h-5" />
              soporte@uycoding.com
            </a>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-medium">Respuesta en menos de 24h</span>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Feedback & Sugerencias</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ¿Encontraste un error? ¿Tienes ideas para mejorar? ¡Cuéntanos!
            </p>
            <a 
              href="mailto:feedback@uycoding.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl group"
            >
              <Send className="w-5 h-5" />
              feedback@uycoding.com
            </a>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Tu opinión nos ayuda a mejorar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          {/* Horario */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <Clock className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-black text-gray-900 mb-2">Horario de Atención</h3>
            <p className="text-sm text-gray-700">
              Lunes a Viernes<br />
              <span className="font-bold">9:00 - 18:00 (GMT-3)</span>
            </p>
          </div>

          {/* Ubicación */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <MapPin className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-black text-gray-900 mb-2">Ubicación</h3>
            <p className="text-sm text-gray-700">
              Montevideo, Uruguay<br />
              <span className="font-bold">🇺🇾 Hecho en Uruguay</span>
            </p>
          </div>

          {/* Beta */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <Zap className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-black text-gray-900 mb-2">Versión Beta</h3>
            <p className="text-sm text-gray-700">
              Agradecemos tu paciencia<br />
              <span className="font-bold">¡Estamos mejorando!</span>
            </p>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            ¿Necesitas ayuda rápida?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              href="/faq"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 border-2 border-gray-200 transition-all group"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Preguntas Frecuentes</p>
                <p className="text-xs text-gray-600">Encuentra respuestas rápidas</p>
              </div>
            </Link>
            <Link 
              href="/about"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:border-purple-300 border-2 border-gray-200 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Sobre Nosotros</p>
                <p className="text-xs text-gray-600">Conoce nuestro equipo</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}