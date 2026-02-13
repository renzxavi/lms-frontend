'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentsAPI } from '@/lib/api';
import { Student, StudentFormData } from '@/types';
import { 
  Users, Plus, Trash2, Mail, Trophy, Loader2, Key, 
  GraduationCap, X, Search, Activity, TrendingUp, Target
} from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{ id: number; name: string } | null>(null);
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: '', 
    email: '', 
    password: '', 
    institution: '',
  });

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchStudents();
    }
  }, [user, authLoading]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsAPI.getAll();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentsAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', institution: '' });
      fetchStudents();
    } catch (error: any) {
      alert(error.message || 'Error al crear');
    }
  };

  const handleResetPassword = async () => {
    // Limpiar error previo
    setPasswordError('');
    setPasswordSuccess(false);

    // Validación frontend
    if (!newPassword) {
      setPasswordError('La contraseña es requerida');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!selectedStudent) return;

    try {
      await studentsAPI.resetPassword(selectedStudent, newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        fetchStudents();
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar la contraseña';
      setPasswordError(errorMessage);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await studentsAPI.delete(id);
      setShowDeleteModal(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.institution && s.institution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: students.length,
    points: students.reduce((acc, s) => acc + (s.total_points || 0), 0),
    avg: students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.total_points || 0), 0) / students.length) : 0,
  };

  if (authLoading || (loading && students.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header profesional */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Panel de <span className="text-indigo-600">Estudiantes</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium">Gestión completa de alumnos y progreso</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, email o grupo..."
                  className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-80 text-slate-700 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:block">Nuevo Estudiante</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Stats Cards Mejoradas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Estudiantes" 
            value={stats.total} 
            icon={<Users className="w-5 h-5" />} 
            gradient="from-blue-500 to-indigo-600"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <StatCard 
            title="Puntos Totales" 
            value={stats.points.toLocaleString()} 
            icon={<Trophy className="w-5 h-5" />} 
            gradient="from-amber-500 to-orange-600"
            bgGradient="from-amber-50 to-orange-50"
          />
          <StatCard 
            title="Promedio" 
            value={`${stats.avg} pts`} 
            icon={<TrendingUp className="w-5 h-5" />} 
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
          />
        </div>

        {/* Tabla de Estudiantes */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron estudiantes</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer estudiante'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
              >
                Agregar Estudiante
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Estudiante</span>
                    </th>
                    <th className="px-6 py-4 text-left hidden md:table-cell">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Grupo</span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Puntos</span>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-lg font-black text-indigo-700 group-hover:scale-110 transition-transform shadow-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-100">
                          <Users className="w-3.5 h-3.5" />
                          {student.institution || 'Sin grupo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-xl font-bold border border-amber-100">
                          <Trophy className="w-4 h-4" />
                          {student.total_points || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/students/${student.id}`}
                            className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors group/btn"
                            title="Ver perfil"
                          >
                            <GraduationCap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </Link>
                          <button 
                            onClick={() => { setSelectedStudent(student.id); setShowPasswordModal(true); }}
                            className="p-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors group/btn"
                            title="Cambiar contraseña"
                          >
                            <Key className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => {
                              setStudentToDelete({ id: student.id, name: student.name });
                              setShowDeleteModal(true);
                            }}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors group/btn"
                            title="Eliminar estudiante"
                          >
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CREACIÓN MEJORADO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => setShowModal(false)} 
          />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Nuevo Estudiante</h2>
                    <p className="text-indigo-100 text-sm font-medium">Completa los datos del alumno</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateStudent} className="p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <CustomInput 
                  label="Nombre Completo" 
                  icon={<Users className="w-4 h-4" />}
                  value={formData.name} 
                  onChange={(v: string) => setFormData({...formData, name: v})} 
                  required 
                  placeholder="Ej: Juan Pérez"
                />
                <CustomInput 
                  label="Correo Electrónico" 
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  value={formData.email} 
                  onChange={(v: string) => setFormData({...formData, email: v})} 
                  required 
                  placeholder="estudiante@email.com"
                />
              </div>
              
              <CustomInput 
                label="Grupo" 
                icon={<GraduationCap className="w-4 h-4" />}
                value={formData.institution || ''} 
                onChange={(v: string) => setFormData({...formData, institution: v})} 
                placeholder="Ej: 5to A, Matemáticas Avanzadas, etc."
              />
              
              <CustomInput 
                label="Contraseña Inicial" 
                type="password"
                icon={<Key className="w-4 h-4" />}
                value={formData.password} 
                onChange={(v: string) => setFormData({...formData, password: v})} 
                required 
                placeholder="Mínimo 8 caracteres"
              />

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all active:scale-95"
                >
                  Crear Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PASSWORD MEJORADO */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => {
              setShowPasswordModal(false);
              setPasswordError('');
              setPasswordSuccess(false);
              setNewPassword('');
            }} 
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Cambiar Contraseña</h3>
                  <p className="text-orange-100 text-sm font-medium">Ingresa la nueva contraseña</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-5">
              <CustomInput
                label="Nueva Contraseña"
                type="password"
                icon={<Key className="w-4 h-4" />}
                value={newPassword}
                onChange={(v: string) => {
                  setNewPassword(v);
                  setPasswordError(''); // Limpiar error al escribir
                }}
                placeholder="Mínimo 8 caracteres"
              />

              {/* Mensaje de error */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
                  <div className="flex gap-3">
                    <div className="text-red-600 flex-shrink-0">❌</div>
                    <p className="text-sm text-red-800 font-medium">
                      {passwordError}
                    </p>
                  </div>
                </div>
              )}

              {/* Mensaje de éxito */}
              {passwordSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
                  <div className="flex gap-3">
                    <div className="text-emerald-600 flex-shrink-0">✅</div>
                    <p className="text-sm text-emerald-800 font-medium">
                      ¡Contraseña actualizada exitosamente!
                    </p>
                  </div>
                </div>
              )}

              {/* Mensaje de ayuda */}
              {!passwordSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="text-blue-600 flex-shrink-0">💡</div>
                    <p className="text-sm text-blue-800 font-medium">
                      La contraseña debe tener mínimo 8 caracteres para mayor seguridad.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess(false);
                    setNewPassword('');
                  }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleResetPassword}
                  disabled={!newPassword || passwordSuccess}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSuccess ? '✓ Actualizada' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => {
              setShowDeleteModal(false);
              setStudentToDelete(null);
            }} 
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Confirmar Eliminación</h3>
                  <p className="text-red-100 text-sm font-medium">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
                <p className="text-slate-700 font-medium mb-2">
                  ¿Estás seguro de eliminar al estudiante?
                </p>
                <p className="text-lg font-black text-slate-900">
                  {studentToDelete.name}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="text-amber-600 flex-shrink-0">⚠️</div>
                  <p className="text-sm text-amber-800 font-medium">
                    Se eliminará todo el progreso, puntos y datos asociados al estudiante.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStudentToDelete(null);
                  }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => studentToDelete && handleDeleteStudent(studentToDelete.id)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all active:scale-95"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, gradient, bgGradient }: { 
  title: string, 
  value: number | string, 
  icon: React.ReactNode, 
  gradient: string,
  bgGradient: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
      <div className={`bg-gradient-to-r ${bgGradient} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-r ${gradient} text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function CustomInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  placeholder = "",
  icon
}: { 
  label: string, 
  type?: string, 
  value: string, 
  onChange: (v: string) => void, 
  required?: boolean,
  placeholder?: string,
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input 
          type={type} 
          required={required} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400`}
        />
      </div>
    </div>
  );
}