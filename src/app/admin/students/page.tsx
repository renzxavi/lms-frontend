'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentsAPI } from '@/lib/api';
import { Student, StudentFormData } from '@/types';
import { 
  Users, Plus, Trash2, Mail, Trophy, Loader2, Key, 
  GraduationCap, X, Search, Activity
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
    name: '', email: '', phone: '', password: '', institution: '',
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
      setFormData({ name: '', email: '', phone: '', password: '', institution: '' });
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
      alert('Contraseña actualizada');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('¿Eliminar este estudiante?')) return;
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
    avg: students.length > 0 ? (students.reduce((acc, s) => acc + (s.total_points || 0), 0) / students.length).toFixed(0) : 0,
  };

  if (authLoading || (loading && students.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white"><GraduationCap size={18}/></div>
            Gestión de <span className="text-red-600">Alumnos</span>
          </h1>
          
          <div className="flex items-center gap-3">
             <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  className="pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none w-full md:w-64 text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button
              onClick={() => setShowModal(true)}
              className="bg-slate-900 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" /> <span className="hidden md:block">Nuevo</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Alumnos" value={stats.total} icon={<Users size={20}/>} color="slate" />
          <StatCard title="Puntos Acumulados" value={stats.points} icon={<Trophy size={20}/>} color="red" />
          <StatCard title="Promedio Puntos" value={stats.avg} icon={<Activity size={20}/>} color="emerald" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-xl font-black group-hover:bg-red-600 group-hover:text-white transition-colors duration-500 border border-slate-100 shadow-inner">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">ID {student.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">{student.name}</h3>
              <p className="text-xs text-slate-400 mb-6 truncate font-medium">{student.email}</p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Puntos Totales</p>
                <p className="text-3xl font-black text-slate-900">{student.total_points || 0}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/students/${student.id}`} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-center text-xs font-bold uppercase hover:bg-red-600 transition-colors">Ver Perfil</Link>
                <button onClick={() => { setSelectedStudent(student.id); setShowPasswordModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-orange-500 rounded-xl transition-colors"><Key size={18}/></button>
                <button onClick={() => handleDeleteStudent(student.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL CREACIÓN */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black mb-6">Registrar <span className="text-red-600">Nuevo Estudiante</span></h2>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <CustomInput label="Nombre" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
              <CustomInput label="Email" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} required />
              <div className="grid grid-cols-2 gap-4">
                <CustomInput label="Teléfono" value={formData.phone || ''} onChange={(v: string) => setFormData({...formData, phone: v})} />
                <CustomInput label="Institución" value={formData.institution || ''} onChange={(v: string) => setFormData({...formData, institution: v})} />
              </div>
              <CustomInput label="Contraseña" type="password" value={formData.password} onChange={(v: string) => setFormData({...formData, password: v})} required />
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-200 mt-4">Crear Cuenta</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-4">Resetear Password</h3>
            <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl mb-4 focus:ring-2 focus:ring-red-500 outline-none text-slate-700" />
            <div className="flex gap-2">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 font-bold text-slate-400">Cancelar</button>
              <button onClick={handleResetPassword} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold">Actualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = { 
    red: "bg-red-50 text-red-600", 
    emerald: "bg-emerald-50 text-emerald-600", 
    slate: "bg-slate-900 text-white" 
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]}`}>{icon}</div>
      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function CustomInput({ label, type = "text", value, onChange, required = false }: { label: string, type?: string, value: string, onChange: (v: string) => void, required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        required={required} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium text-slate-700" 
      />
    </div>
  );
}