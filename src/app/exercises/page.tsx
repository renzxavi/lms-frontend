'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentsAPI } from '@/lib/api';
import { Student, StudentFormData } from '@/types';
import { 
  Users, Plus, Trash2, Mail, Trophy, Loader2, Key, 
  GraduationCap, X, Search, Activity, Eye, Shield, Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
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
      setStudents(data);
    } catch (error) {
      console.error('Error:', error);
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
    if (!selectedStudent || !newPassword) return;
    try {
      await studentsAPI.resetPassword(selectedStudent, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      alert('Contraseña actualizada exitosamente');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este estudiante? Esta acción no se puede deshacer.')) return;
    try {
      await studentsAPI.delete(id);
      fetchStudents();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    points: students.reduce((acc, s) => acc + (s.total_points || 0), 0),
    avg: students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.total_points || 0), 0) / students.length) : 0,
  };

  if (authLoading || (loading && students.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-red-900 font-bold text-lg">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 pb-20">
      {/* HEADER MEJORADO */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <GraduationCap size={24}/>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    Gestión de <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Estudiantes</span>
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Administra y monitorea el progreso de tus alumnos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:flex-initial">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar estudiante..."
                  className="pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full md:w-80 text-gray-700 font-medium transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 active:scale-95"
              >
                <Plus className="w-5 h-5" /> 
                <span className="hidden md:block">Nuevo Estudiante</span>
                <span className="md:hidden">Nuevo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* STATS MEJORADAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Estudiantes" 
            value={stats.total} 
            icon={<Users size={24}/>} 
            color="blue"
            subtitle="registrados en el sistema"
          />
          <StatCard 
            title="Puntos Totales" 
            value={stats.points.toLocaleString()} 
            icon={<Trophy size={24}/>} 
            color="red"
            subtitle="acumulados por todos"
          />
          <StatCard 
            title="Promedio de Puntos" 
            value={stats.avg.toLocaleString()} 
            icon={<Activity size={24}/>} 
            color="emerald"
            subtitle="por estudiante"
          />
        </div>

        {/* GRID DE ESTUDIANTES MEJORADO */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Comienza agregando tu primer estudiante'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                Agregar Estudiante
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:border-red-200 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Gradiente decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-rose-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>
                
                <div className="relative">
                  {/* Header de la Card */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl flex items-center justify-center text-2xl font-black text-red-600 group-hover:from-red-600 group-hover:to-rose-600 group-hover:text-white transition-all duration-500 border-2 border-red-100 shadow-sm group-hover:shadow-lg group-hover:shadow-red-200 group-hover:scale-110">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        ID #{student.id}
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Info del estudiante */}
                  <h3 className="text-xl font-black text-gray-900 truncate mb-1 group-hover:text-red-600 transition-colors">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Mail className="w-3 h-3" />
                    <p className="text-xs font-medium truncate">{student.email}</p>
                  </div>
                  {student.institution && (
                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <Shield className="w-3 h-3" />
                      <p className="text-xs font-medium truncate">{student.institution}</p>
                    </div>
                  )}
                  
                  {/* Puntos destacados */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl border-2 border-red-100 text-center mb-6 group-hover:from-red-600 group-hover:to-rose-600 transition-all duration-500">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest group-hover:text-white transition-colors">
                        Puntos Totales
                      </p>
                    </div>
                    <p className="text-4xl font-black text-red-900 group-hover:text-white transition-colors">
                      {student.total_points || 0}
                    </p>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/students/${student.id}`} 
                      className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-center text-xs font-black uppercase hover:from-red-700 hover:to-rose-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Perfil
                    </Link>
                    <button 
                      onClick={() => { setSelectedStudent(student.id); setShowPasswordModal(true); }} 
                      className="p-3 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                      title="Cambiar contraseña"
                    >
                      <Key size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student.id)} 
                      className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                      title="Eliminar estudiante"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL CREACIÓN MEJORADO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" 
            onClick={() => setShowModal(false)} 
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] border-2 border-gray-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-200">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Registrar <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Nuevo Estudiante</span>
              </h2>
              <p className="text-gray-500 font-medium">Completa los datos del estudiante</p>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput 
                  label="Nombre Completo" 
                  icon={<Users className="w-4 h-4" />}
                  value={formData.name} 
                  onChange={(v: string) => setFormData({...formData, name: v})} 
                  placeholder="Ej: Juan Pérez"
                  required 
                />
                <CustomInput 
                  label="Correo Electrónico" 
                  type="email" 
                  icon={<Mail className="w-4 h-4" />}
                  value={formData.email} 
                  onChange={(v: string) => setFormData({...formData, email: v})} 
                  placeholder="ejemplo@estudiante.com"
                  required 
                />
              </div>
              
              <CustomInput 
                label="Institución (Opcional)" 
                icon={<Shield className="w-4 h-4" />}
                value={formData.institution || ''} 
                onChange={(v: string) => setFormData({...formData, institution: v})} 
                placeholder="Ej: Escuela Primaria N°5"
              />
              
              <CustomInput 
                label="Contraseña" 
                type="password" 
                icon={<Key className="w-4 h-4" />}
                value={formData.password} 
                onChange={(v: string) => setFormData({...formData, password: v})} 
                placeholder="Mínimo 6 caracteres"
                required 
              />

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-2xl font-bold uppercase tracking-wider hover:from-red-700 hover:to-rose-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" 
            onClick={() => setShowPasswordModal(false)} 
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border-2 border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Resetear Contraseña</h3>
              <p className="text-gray-500 text-sm font-medium">Ingresa la nueva contraseña del estudiante</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Nueva Contraseña
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-700 font-medium transition-all" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPasswordModal(false)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleResetPassword} 
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-200"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES MEJORADOS
function StatCard({ title, value, icon, color, subtitle }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color: string;
  subtitle?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = { 
    red: { bg: "from-red-600 to-rose-600", text: "text-red-600", border: "border-red-100" },
    emerald: { bg: "from-emerald-600 to-teal-600", text: "text-emerald-600", border: "border-emerald-100" },
    blue: { bg: "from-blue-600 to-indigo-600", text: "text-blue-600", border: "border-blue-100" }
  };

  const colors = colorMap[color] || colorMap.red;

  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
        {icon}
      </div>
      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{title}</p>
      <p className="text-4xl font-black text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );
}

function CustomInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  placeholder,
  icon 
}: { 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (v: string) => void; 
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input 
        type={type} 
        required={required} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" 
      />
    </div>
  );
}