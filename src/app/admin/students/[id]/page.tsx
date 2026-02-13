'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { studentsAPI } from "@/lib/api";
import { Student } from "@/types";
import { 
  ArrowLeft, Loader2, Award, Mail, X, BarChart2, 
  TrendingUp, Users, Trophy, Target, Folder
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const performanceData = [
    { name: 'Semana 1', pts: 0 },
    { name: 'Semana 2', pts: student?.total_points ? Math.floor(student.total_points * 0.2) : 0 },
    { name: 'Semana 3', pts: student?.total_points ? Math.floor(student.total_points * 0.45) : 0 },
    { name: 'Semana 4', pts: student?.total_points ? Math.floor(student.total_points * 0.7) : 0 },
    { name: 'Actual', pts: student?.total_points || 0 },
  ];

  useEffect(() => {
    if (params.id) loadStudent();
  }, [params.id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const data = await studentsAPI.getById(Number(params.id));
      setStudent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-slate-600 font-semibold">Cargando información del estudiante...</p>
      </div>
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="text-center p-12 bg-white rounded-3xl max-w-md border border-red-100 shadow-xl">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Estudiante no encontrado</h2>
        <p className="text-slate-500 mb-8">El estudiante que buscas no existe o ha sido eliminado.</p>
        <button 
          onClick={() => router.push("/admin/students")} 
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
        >
          Volver al Panel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header con breadcrumb */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button 
            onClick={() => router.push("/admin/students")} 
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-all group mb-4"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al panel
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-200">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{student.name}</h1>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {student.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar - Información del estudiante */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card de perfil */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-12 text-center">
                <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center text-5xl font-black text-indigo-600 mx-auto shadow-2xl shadow-indigo-900/20">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-slate-900 text-center mb-2">{student.name}</h2>
                
                {/* ✅ ACTUALIZADO - Mostrar grupo si existe */}
                <p className="text-indigo-600 font-bold text-xs uppercase text-center tracking-widest mb-8">
                  {student.group?.name || student.institution || 'Sin grupo'}
                </p>
                
                <div className="space-y-4">
                  <InfoRow 
                    icon={<Mail className="w-5 h-5 text-indigo-600" />} 
                    label="Email" 
                    value={student.email} 
                  />
                  
                  {/* ✅ ACTUALIZADO - Mostrar grupo formal */}
                  {student.group ? (
                    <InfoRow 
                      icon={<Folder className="w-5 h-5 text-purple-600" />} 
                      label="Grupo" 
                      value={student.group.name} 
                    />
                  ) : (
                    <InfoRow 
                      icon={<Users className="w-5 h-5 text-blue-600" />} 
                      label="Institución" 
                      value={student.institution || 'Sin asignar'} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Card de puntos destacados */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-100">Puntuación Total</p>
                  <p className="text-4xl font-black">{student.total_points || 0}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-sm text-orange-100 font-medium">
                  Continúa motivando al estudiante para alcanzar nuevas metas.
                </p>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <MiniStatCard 
                title="Progreso"
                value={`${student.total_points || 0} pts`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="from-blue-500 to-indigo-600"
              />
              <MiniStatCard 
                title="Nivel"
                value={student.total_points ? Math.floor(student.total_points / 100) + 1 : 1}
                icon={<Target className="w-5 h-5" />}
                color="from-purple-500 to-pink-600"
              />
            </div>

            {/* Gráfico de progreso */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Evolución de Puntos</h3>
                    <p className="text-sm text-slate-500 font-medium">Progreso semanal del estudiante</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          padding: '12px 16px',
                          backgroundColor: 'white',
                          fontWeight: 600
                        }} 
                        labelStyle={{color: '#1e293b', fontWeight: 700, marginBottom: '4px'}}
                        itemStyle={{color: '#4f46e5'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pts" 
                        stroke="#4f46e5" 
                        strokeWidth={3} 
                        fill="url(#colorPts)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Insights y recomendaciones */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Recomendaciones</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="font-medium">
                        Asigna ejercicios progresivos según el nivel de cada estudiante.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="font-medium">
                        Mantén comunicación regular para resolver dudas y mantener la motivación.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="font-medium">
                        Revisa el progreso semanal para identificar áreas de mejora.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({ title, value, icon, color }: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode,
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all">
      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}