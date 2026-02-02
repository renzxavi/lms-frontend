import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo y Copyright */}
        <div className="flex items-center space-x-3">
          <span className="text-xl">🧩</span>
          <span className="font-bold text-gray-900 tracking-tight">AssessMas</span>
          <span className="hidden md:block text-gray-300">|</span>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>

        {/* Links y Contacto (Obligatorio) */}
        <div className="flex items-center space-x-6">
          <nav className="hidden sm:flex space-x-4 text-xs font-medium text-gray-500">
            <Link href="/privacy" className="hover:text-orange-600 transition">Privacidad</Link>
            <Link href="/terms" className="hover:text-orange-600 transition">Términos</Link>
          </nav>
          
          <Link
            href="/contact"
            className="text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
          >
            Soporte y Contacto
          </Link>
        </div>

      </div>
    </footer>
  );
}