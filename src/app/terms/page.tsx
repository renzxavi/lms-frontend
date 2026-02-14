import { FileText, AlertTriangle, CheckCircle, XCircle, Scale, Zap } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-700 to-gray-900 rounded-3xl mb-6 shadow-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600">
            Última actualización: Febrero 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
          
          {/* Intro */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <p className="text-gray-800 leading-relaxed">
              Al utilizar <strong>uyCoding</strong>, aceptas los siguientes términos y condiciones. 
              Por favor, léelos cuidadosamente antes de crear tu cuenta.
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">1. Aceptación de Términos</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>
                Al registrarte y usar uyCoding, confirmas que:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tienes al menos 13 años de edad (o cuentas con permiso de un tutor)</li>
                <li>La información que proporcionas es veraz y actualizada</li>
                <li>Aceptas cumplir con estos términos y nuestra política de privacidad</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">2. Uso del Servicio</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>
                uyCoding es una plataforma educativa gratuita. Te comprometes a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar la plataforma únicamente con fines educativos</li>
                <li>No compartir tu cuenta con terceros</li>
                <li>No intentar hackear, modificar o dañar el sistema</li>
                <li>Respetar el contenido y la propiedad intelectual</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">3. Propiedad Intelectual</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>
                Todo el contenido de uyCoding (ejercicios, videos, historias, código) es propiedad de uyCoding o sus licenciantes.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Puedes usar el contenido para tu aprendizaje personal</li>
                <li>No puedes copiar, distribuir o vender el contenido</li>
                <li>No puedes crear cursos derivados sin autorización</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">4. Conductas Prohibidas</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p className="font-semibold text-red-700">Está estrictamente prohibido:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar bots o scripts automáticos para completar ejercicios</li>
                <li>Crear múltiples cuentas para ganar puntos</li>
                <li>Publicar contenido ofensivo, spam o inapropiado</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Realizar ingeniería inversa del código de la plataforma</li>
              </ul>
              <p className="text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-3">
                ⚠️ <strong>El incumplimiento puede resultar en la suspensión permanente de tu cuenta.</strong>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">5. Limitación de Responsabilidad</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>
                uyCoding se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Interrupciones del servicio o errores técnicos</li>
                <li>Pérdida de datos o progreso (aunque hacemos respaldos regulares)</li>
                <li>Daños indirectos derivados del uso de la plataforma</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">6. Modificaciones</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios significativos se notificarán por correo electrónico.
              </p>
              <p className="font-semibold">
                Tu uso continuado de la plataforma después de los cambios constituye la aceptación de los nuevos términos.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">7. Terminación de Cuenta</h2>
            </div>
            <div className="pl-13 space-y-3 text-gray-700 leading-relaxed">
              <p>Puedes eliminar tu cuenta en cualquier momento desde la configuración.</p>
              <p>
                Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.
              </p>
            </div>
          </section>

          {/* Beta Notice */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="font-bold text-purple-900 mb-2">Versión Beta</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  uyCoding está en desarrollo activo. Algunas funcionalidades pueden cambiar, 
                  y pueden existir errores ocasionales. ¡Gracias por ayudarnos a mejorar!
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">¿Preguntas sobre estos términos?</h3>
            <p className="text-gray-700 mb-3">Contáctanos en:</p>
            <a href="mailto:legal@uycoding.com" className="text-blue-600 hover:underline font-semibold">
              legal@uycoding.com
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}