import Link from "next/link";
import { Code2, Shield, FileText, Mail, Heart, Sparkles, ExternalLink } from 'lucide-react';

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
                <div className="text-xs font-medium text-indigo-600">Aprende programando</div>
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

          {/* Links Column */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <nav className="space-y-3">
              <Link 
                href="/privacy" 
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Shield className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                Política de Privacidad
              </Link>
              <Link 
                href="/terms" 
                className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                Términos y Condiciones
              </Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Soporte
            </h3>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              Contactar Soporte
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-xs text-slate-500 mt-3 font-medium">
              Respuesta en menos de 24 horas
            </p>
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
                Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> en Uruguay
              </span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
              <Link 
                href="/about" 
                className="hover:text-indigo-600 transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/faq" 
                className="hover:text-indigo-600 transition-colors"
              >
                Preguntas Frecuentes
              </Link>
              <Link 
                href="/blog" 
                className="hover:text-indigo-600 transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Datos Protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">Educación de Calidad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}