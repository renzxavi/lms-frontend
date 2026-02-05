import Link from "next/link";
import { Rocket, Shield, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-4 border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo y Copyright */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border-2 border-red-300">
            <Rocket className="w-6 h-6 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-gray-900 tracking-wide text-lg uppercase">
              uyCoding
            </span>
            <p className="text-xs text-gray-700 font-semibold uppercase tracking-wider">
              © {new Date().getFullYear()} Todos los Derechos Reservados
            </p>
          </div>
        </div>

        {/* Links y Contacto */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Links */}
          <nav className="hidden sm:flex space-x-3 text-xs font-bold">
            <Link 
              href="/privacy" 
              className="flex items-center gap-1.5 text-gray-900 hover:text-red-600 bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all uppercase tracking-wide border-2 border-red-100 hover:border-red-300"
            >
              <Shield className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              Privacidad
            </Link>
            <Link 
              href="/terms" 
              className="flex items-center gap-1.5 text-gray-900 hover:text-red-600 bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all uppercase tracking-wide border-2 border-red-100 hover:border-red-300"
            >
              <FileText className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              Términos
            </Link>
          </nav>
          
          {/* Botón Contacto */}
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm font-black text-white bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 uppercase tracking-wide border-2 border-white"
          >
            <Mail className="w-5 h-5" strokeWidth={2.5} />
            Soporte y Contacto
          </Link>
        </div>

      </div>
    </footer>
  );
}