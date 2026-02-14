"use client";

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Zap, BookOpen, Lock, Award, Settings, Mail } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Cuenta
  {
    category: "Cuenta",
    question: "¿Cómo creo una cuenta?",
    answer: "Haz clic en 'Registrarse' en la página principal, completa el formulario con tu nombre, email y contraseña. ¡Es gratis y toma menos de 1 minuto!"
  },
  {
    category: "Cuenta",
    question: "¿Puedo cambiar mi correo electrónico?",
    answer: "Actualmente estamos trabajando en esta función. Por ahora, si necesitas cambiar tu correo, contacta a soporte@uycoding.com y te ayudaremos."
  },
  {
    category: "Cuenta",
    question: "¿Cómo elimino mi cuenta?",
    answer: "Ve a Configuración → Cuenta → Eliminar Cuenta. Ten en cuenta que esta acción es permanente y perderás todo tu progreso."
  },
  {
    category: "Cuenta",
    question: "Olvidé mi contraseña, ¿qué hago?",
    answer: "Haz clic en '¿Olvidaste tu contraseña?' en la página de inicio de sesión. Te enviaremos un correo con instrucciones para restablecerla."
  },
  
  // Progreso
  {
    category: "Progreso",
    question: "¿Cómo desbloqueo nuevos niveles?",
    answer: "Debes completar todos los ejercicios del módulo actual para desbloquear el siguiente. Asegúrate de obtener todos los puntos disponibles."
  },
  {
    category: "Progreso",
    question: "¿Puedo resetear mi progreso?",
    answer: "Sí, ve a Configuración → Progreso → Reiniciar Progreso. Esta acción eliminará todos tus puntos y logros, así que úsala con cuidado."
  },
  {
    category: "Progreso",
    question: "¿Qué son los puntos y para qué sirven?",
    answer: "Los puntos miden tu progreso y te motivan a completar ejercicios. Cada ejercicio otorga puntos según su dificultad. ¡Acumula puntos para desbloquear logros!"
  },
  {
    category: "Progreso",
    question: "¿Se guarda automáticamente mi progreso?",
    answer: "Sí, cada vez que completas un ejercicio correctamente, tu progreso se guarda automáticamente en la nube."
  },

  // Ejercicios
  {
    category: "Ejercicios",
    question: "¿Qué tipos de ejercicios hay?",
    answer: "Tenemos 4 tipos: Ejercicios de código (escribe JavaScript), Videos educativos, Lecturas interactivas y Ejercicios de formato en Word."
  },
  {
    category: "Ejercicios",
    question: "¿Puedo repetir un ejercicio?",
    answer: "¡Por supuesto! Puedes repetir cualquier ejercicio las veces que quieras para practicar y mejorar tu comprensión."
  },
  {
    category: "Ejercicios",
    question: "Mi código no funciona, ¿qué hago?",
    answer: "Revisa la consola de errores (botón rojo). Lee el mensaje de error y revisa las pistas del ejercicio. Si sigues atascado, contacta a soporte."
  },
  {
    category: "Ejercicios",
    question: "¿Hay límite de intentos?",
    answer: "No, puedes intentar resolver los ejercicios tantas veces como necesites. ¡Aprender es un proceso!"
  },

  // Técnico
  {
    category: "Técnico",
    question: "¿En qué navegadores funciona uyCoding?",
    answer: "Funciona mejor en Chrome, Firefox, Safari y Edge actualizados. Recomendamos usar la última versión de tu navegador favorito."
  },
  {
    category: "Técnico",
    question: "¿Funciona en móviles?",
    answer: "Sí, la plataforma es responsive. Sin embargo, para los ejercicios de código, recomendamos usar una computadora para una mejor experiencia."
  },
  {
    category: "Técnico",
    question: "¿Necesito instalar algo?",
    answer: "No, uyCoding funciona 100% en el navegador. No necesitas instalar ningún software adicional."
  },

  // General
  {
    category: "General",
    question: "¿uyCoding es gratis?",
    answer: "Sí, uyCoding es completamente gratis y lo seguirá siendo. Nuestro objetivo es democratizar el aprendizaje de la programación."
  },
  {
    category: "General",
    question: "¿Qué es la versión Beta?",
    answer: "Estamos en fase de pruebas. Esto significa que podemos tener algunos errores y que añadimos mejoras constantemente. ¡Tu feedback es muy valioso!"
  },
  {
    category: "General",
    question: "¿Ofrecen certificados?",
    answer: "Actualmente no, pero estamos trabajando en un sistema de certificados digitales que podrás compartir en LinkedIn. ¡Próximamente!"
  },
  {
    category: "General",
    question: "¿Puedo sugerir nuevas funcionalidades?",
    answer: "¡Absolutamente! Envíanos tus ideas a feedback@uycoding.com. Leemos todas las sugerencias y muchas se implementan."
  }
];

const categories = ["Todos", "Cuenta", "Progreso", "Ejercicios", "Técnico", "General"];
const categoryIcons: Record<string, any> = {
  "Cuenta": Lock,
  "Progreso": Award,
  "Ejercicios": BookOpen,
  "Técnico": Settings,
  "General": HelpCircle
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredFAQs = selectedCategory === "Todos" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-semibold text-sm">Centro de Ayuda</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas rápidas a las dudas más comunes
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.map((faq, index) => {
            const Icon = categoryIcons[faq.category] || HelpCircle;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:border-indigo-300 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 bg-gray-50 border-t-2 border-gray-100">
                    <p className="text-gray-700 leading-relaxed pl-14">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-black mb-3">¿No encontraste tu respuesta?</h2>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Nuestro equipo de soporte está listo para ayudarte con cualquier duda
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
          >
            <Mail className="w-5 h-5" />
            Contactar Soporte
          </Link>
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