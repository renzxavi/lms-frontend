'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { studentsAPI } from "@/lib/api";
import { Student } from "@/types";
import { ArrowLeft, Loader2, Award, Mail, School, X, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const performanceData = [
    { name: 'Inicio', pts: 0 },
    { name: 'Hito 1', pts: student?.total_points ? Math.floor(student.total_points * 0.3) : 0 },
    { name: 'Hito 2', pts: student?.total_points ? Math.floor(student.total_points * 0.7) : 0 },
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-red-600" />
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-12 bg-red-50 rounded-[3rem] max-w-sm border border-red-100">
        <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-black mb-6">No encontrado</h2>
        <button onClick={() => router.push("/admin/students")} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Volver</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.push("/admin/students")} className="mb-10 flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver
        </button>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-6 shadow-xl">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-black text-slate-900 truncate">{student.name}</h2>
              <p className="text-red-600 font-bold text-xs uppercase mt-2 tracking-widest">{student.institution || 'Particular'}</p>
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-500 text-xs font-medium truncate"><Mail size={14}/> {student.email}</div>
                <div className="flex items-center gap-3 text-slate-500 text-xs font-medium"><School size={14}/> Estado: Activo</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-red-50 text-red-600 rounded-3xl">
                  <Award size={32}/>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Puntuación Total</p>
                  <p className="text-4xl font-black text-slate-900">{student.total_points || 0} pts</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-10">
                <BarChart2 className="text-red-600" /> Progreso de Puntos
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs><linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/><stop offset="95%" stopColor="#dc2626" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)'}} />
                    <Area type="monotone" dataKey="pts" stroke="#dc2626" strokeWidth={4} fill="url(#colorPts)" />
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