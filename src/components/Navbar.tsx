'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Rocket, Home, Star, LogOut, Menu, X, Key, Sparkles, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-red-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Rocket className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                uyCoding
              </span>
              <div className="text-xs font-medium text-red-600">Aprende programando</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                >
                  <Home className="w-4 h-4" />
                  Inicio
                </Link>

                <Link
                  href="/exercises"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                >
                  <Star className="w-4 h-4" />
                  Ejercicios
                </Link>

                {/* Usuario */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  <Key className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  Inicio
                </Link>

                <Link
                  href="/exercises"
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Star className="w-5 h-5" />
                  Ejercicios
                </Link>

                <div className="pt-4 mt-4 space-y-2 border-t border-gray-100">
                  <div className="flex items-center space-x-3 py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-base font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Key className="w-5 h-5" />
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow-sm transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="w-5 h-5" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}