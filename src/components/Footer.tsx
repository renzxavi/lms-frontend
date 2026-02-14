import Link from "next/link";
import { Code2, Mail, Heart, Sparkles, MessageCircle, HelpCircle, BookOpen, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  uyCoding
                </span>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-indigo-600">Aprende programando</div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500 rounded-full">
                    <Zap className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white">BETA</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-slate-600 font-medium mb-4 max-w-md leading-relaxed">
              Plataforma educativa interactiva que hace que aprender a programar sea divertido y accesible para todos.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Aprende a tu propio ritmo</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Recursos
            </h3>
            <nav className="space-y-3">
              <Link 
                href="/about" 
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
                Sobre Nosotros
              </Link>
              <Link 
                href="/faq" 
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
                Preguntas Frecuentes
              </Link>
              <Link 
                href="/contact" 
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
                Contacto
              </Link>
            </nav>
          </div>

          {/* Links Column 2 - Soporte */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              Soporte
            </h3>
            
            <div className="space-y-3 mb-4">
              <a 
                href="mailto:soporte@uycoding.com"
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                soporte@uycoding.com
              </a>
              <a 
                href="mailto:feedback@uycoding.com"
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                feedback@uycoding.com
              </a>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:scale-105 text-sm"
            >
              <Mail className="w-4 h-4" />
              Contactar
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <span>© {currentYear} uyCoding</span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1">
                Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> en Uruguay
              </span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
              <Link 
                href="/about" 
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Sobre Nosotros
              </Link>
              <Link 
                href="/faq" 
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                Contacto
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Gratis para Siempre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Educación de Calidad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Versión Beta</span>
            </div>
          </div>
        </div>

        {/* Beta Feedback Banner */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-purple-900">¿Encontraste un error o tienes una sugerencia?</p>
                <p className="text-xs text-purple-700">Tu feedback nos ayuda a mejorar la plataforma</p>
              </div>
            </div>
            <Link 
              href="/contact"
              className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap"
            >
              Enviar Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}