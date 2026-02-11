'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { studentsAPI } from "@/lib/api";
import { Student } from "@/types";
import { 
  ArrowLeft, Loader2, Award, Mail, School, X, BarChart2, 
  TrendingUp, Calendar, BookOpen, Target, Zap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const performanceData = [
    { name: 'Inicio', pts: 0 },
    { name: 'Semana 1', pts: student?.total_points ? Math.floor(student.total_points * 0.2) : 0 },
    { name: 'Semana 2', pts: student?.total_points ? Math.floor(student.total_points * 0.5) : 0 },
    { name: 'Semana 3', pts: student?.total_points ? Math.floor(student.total_points * 0.8) : 0 },
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto mb-4" />
        <p className="text-red-900 font-bold text-lg">Cargando información...</p>
      </div>
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 flex items-center justify-center p-6">
      <div className="text-center p-16 bg-white rounded-[3rem] max-w-md border-2 border-red-100 shadow-xl">
        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">Estudiante no encontrado</h2>
        <p className="text-gray-500 mb-8 font-medium">El estudiante que buscas no existe o fue eliminado</p>
        <button 
          onClick={() => router.push("/admin/students")} 
          className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          Volver a la Lista
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* BOTÓN VOLVER MEJORADO */}
        <button 
          onClick={() => router.push("/admin/students")} 
          className="mb-10 flex items-center gap-2 text-gray-500 font-bold hover:text-red-600 transition-all group bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-lg"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a Estudiantes
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SIDEBAR - PERFIL DEL ESTUDIANTE */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de perfil principal */}
            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-lg text-center relative overflow-hidden">
              {/* Gradiente decorativo */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100 to-rose-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
              
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-rose-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white mx-auto mb-6 shadow-2xl shadow-red-200">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{student.name}</h2>
                <div className="inline-flex items-center gap-2 bg-red-50 border-2 border-red-100 px-4 py-2 rounded-full mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-bold text-xs uppercase tracking-wider">
                    {student.institution || 'Estudiante Activo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de información de contacto */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
                    <p className="text-sm text-gray-900 font-medium truncate">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <School className="w-5 h-5 text-purple-600"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Institución</p>
                    <p className="text-sm text-gray-900 font-medium">{student.institution || 'No especificada'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Registro</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(student.created_at).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-2 space-y-8">
            {/* Card de puntos destacados */}
            <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-red-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-6 bg-white/20 backdrop-blur-sm rounded-3xl">
                    <Award size={48}/>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">Puntuación Total</p>
                    <p className="text-6xl font-black">{student.total_points || 0}</p>
                    <p className="text-white/80 font-medium mt-2">puntos acumulados</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-black text-lg">+15%</span>
                  </div>
                  <p className="text-xs text-white/70 font-medium">esta semana</p>
                </div>
              </div>
            </div>

            {/* Grid de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MiniStatCard 
                icon={<BookOpen className="w-6 h-6" />}
                title="Ejercicios"
                value="0"
                subtitle="completados"
                color="blue"
              />
              <MiniStatCard 
                icon={<Target className="w-6 h-6" />}
                title="Precisión"
                value="0%"
                subtitle="de aciertos"
                color="emerald"
              />
              <MiniStatCard 
                icon={<Zap className="w-6 h-6" />}
                title="Racha"
                value="0"
                subtitle="días seguidos"
                color="orange"
              />
            </div>

            {/* Gráfico de progreso */}
            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-2">
                    <BarChart2 className="text-red-600" size={28}/> 
                    Progreso de Puntos
                  </h3>
                  <p className="text-gray-500 font-medium">Evolución del rendimiento en el tiempo</p>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 600}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 600}}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pts" 
                      stroke="#dc2626" 
                      strokeWidth={4} 
                      fill="url(#colorPts)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE AUXILIAR: Mini Stat Card
function MiniStatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: 'blue' | 'emerald' | 'orange'; 
}) {
  const colorMap = {
    blue: { bg: 'from-blue-600 to-indigo-600', icon: 'bg-blue-100 text-blue-600' },
    emerald: { bg: 'from-emerald-600 to-teal-600', icon: 'bg-emerald-100 text-emerald-600' },
    orange: { bg: 'from-orange-600 to-red-600', icon: 'bg-orange-100 text-orange-600' }
  };

  const colors = colorMap[color];

  return (
    <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
    </div>
  );
}