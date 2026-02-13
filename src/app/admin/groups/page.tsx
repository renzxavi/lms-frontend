'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { groupsAPI, studentsAPI } from '@/lib/api';
import { Group, Student } from '@/types';
import { 
  Folder, Plus, Trash2, Edit2, Loader2, X, Search, 
  Users, TrendingUp, Target, ChevronDown, ChevronRight,
  UserPlus, UserMinus, Type, GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4f46e5',
    icon: 'Users',
  });

  const availableColors = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchGroups();
      fetchStudents();
    }
  }, [user, authLoading]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupsAPI.getAll();
      setGroups(data.groups || []);
    } catch (error) {
      console.error('Error cargando grupos:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentsAPI.getAll();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
      setStudents([]);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await groupsAPI.create(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', color: '#4f46e5', icon: 'Users' });
      fetchGroups();
    } catch (error: any) {
      alert(error.message || 'Error al crear grupo');
    }
  };

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    
    try {
      await groupsAPI.update(selectedGroup.id, formData);
      setShowEditModal(false);
      setSelectedGroup(null);
      setFormData({ name: '', description: '', color: '#4f46e5', icon: 'Users' });
      fetchGroups();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar grupo');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await groupsAPI.delete(selectedGroup.id);
      setShowDeleteModal(false);
      setSelectedGroup(null);
      fetchGroups();
      fetchStudents();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar grupo');
    }
  };

  const handleAssignStudent = async (studentId: number) => {
    if (!selectedGroup) return;
    
    try {
      await groupsAPI.assignStudent(selectedGroup.id, studentId);
      fetchGroups();
      fetchStudents();
    } catch (error: any) {
      alert(error.message || 'Error al asignar estudiante');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedGroup) return;
    
    try {
      await groupsAPI.removeStudent(selectedGroup.id, studentId);
      fetchGroups();
      fetchStudents();
    } catch (error: any) {
      alert(error.message || 'Error al remover estudiante');
    }
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      color: group.color,
      icon: group.icon,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (group: Group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const openAssignModal = (group: Group) => {
    setSelectedGroup(group);
    setShowAssignModal(true);
  };

  const getUnassignedStudents = () => {
    return students.filter(s => !s.group_id);
  };

  const getGroupStudents = (groupId: number) => {
    return students.filter(s => s.group_id === groupId);
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalGroups: groups.length,
    totalStudents: students.filter(s => s.group_id !== null).length,
    unassigned: students.filter(s => !s.group_id).length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Gestión de <span className="text-purple-600">Grupos</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium">Organiza a tus estudiantes en carpetas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* ✅ Botón para volver a estudiantes */}
              <Link
                href="/admin/students"
                className="flex items-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-2xl font-bold transition-all border border-indigo-200"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Estudiantes</span>
              </Link>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar grupos..."
                  className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full md:w-80 text-slate-700 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:block">Nuevo Grupo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Grupos" 
            value={stats.totalGroups} 
            icon={<Folder className="w-5 h-5" />} 
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
          />
          <StatCard 
            title="Estudiantes Asignados" 
            value={stats.totalStudents} 
            icon={<Users className="w-5 h-5" />} 
            gradient="from-blue-500 to-indigo-600"
            bgGradient="from-blue-50 to-indigo-50"
          />
          <StatCard 
            title="Sin Asignar" 
            value={stats.unassigned} 
            icon={<Target className="w-5 h-5" />} 
            gradient="from-amber-500 to-orange-600"
            bgGradient="from-amber-50 to-orange-50"
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay grupos</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'No se encontraron grupos con ese término' : 'Crea tu primer grupo para organizar estudiantes'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all"
              >
                Crear Grupo
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map((group) => {
              const groupStudents = getGroupStudents(group.id);
              const isExpanded = expandedGroup === group.id;
              
              return (
                <div 
                  key={group.id} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                        
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: `${group.color}20` }}
                        >
                          <Folder className="w-6 h-6" style={{ color: group.color }} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-slate-900">{group.name}</h3>
                          <p className="text-sm text-slate-500">{group.description || 'Sin descripción'}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center px-4 py-2 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiantes</p>
                            <p className="text-2xl font-black text-slate-900">{groupStudents.length}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => openAssignModal(group)}
                          className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                          title="Asignar estudiantes"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(group)}
                          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                          title="Editar grupo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(group)}
                          className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50 p-6">
                      {groupStudents.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 font-medium">No hay estudiantes en este grupo</p>
                          <button
                            onClick={() => openAssignModal(group)}
                            className="mt-4 text-purple-600 hover:text-purple-700 font-bold text-sm"
                          >
                            + Asignar estudiantes
                          </button>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupStudents.map((student) => (
                            <div 
                              key={student.id}
                              className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between group hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-sm font-black text-indigo-700">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                                  <p className="text-xs text-slate-500">{student.total_points} pts</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedGroup(group);
                                  handleRemoveStudent(student.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                title="Remover del grupo"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODALES */}
      {showCreateModal && (
        <GroupModal
          title="Nuevo Grupo"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateGroup}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({ name: '', description: '', color: '#4f46e5', icon: 'Users' });
          }}
          availableColors={availableColors}
        />
      )}

      {showEditModal && selectedGroup && (
        <GroupModal
          title="Editar Grupo"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditGroup}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGroup(null);
            setFormData({ name: '', description: '', color: '#4f46e5', icon: 'Users' });
          }}
          availableColors={availableColors}
        />
      )}

      {showDeleteModal && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedGroup(null);
            }} 
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Eliminar Grupo</h3>
                  <p className="text-red-100 text-sm font-medium">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
                <p className="text-slate-700 font-medium mb-2">
                  ¿Estás seguro de eliminar el grupo?
                </p>
                <p className="text-lg font-black text-slate-900">
                  {selectedGroup.name}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="text-amber-600 flex-shrink-0">⚠️</div>
                  <p className="text-sm text-amber-800 font-medium">
                    Los estudiantes del grupo NO serán eliminados, solo quedarán sin grupo asignado.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedGroup(null);
                  }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteGroup}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all active:scale-95"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => {
              setShowAssignModal(false);
              setSelectedGroup(null);
            }} 
          />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Asignar Estudiantes</h3>
                    <p className="text-green-100 text-sm font-medium">Grupo: {selectedGroup.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedGroup(null);
                  }}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              {getUnassignedStudents().length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No hay estudiantes sin asignar</p>
                  <p className="text-sm text-slate-500 mt-2">Todos los estudiantes ya están en grupos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUnassignedStudents().map((student) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-lg font-black text-indigo-700">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignStudent(student.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                        Asignar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupModal({ 
  title, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose,
  availableColors
}: {
  title: string;
  formData: any;
  setFormData: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  availableColors: any[];
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{title}</h2>
                <p className="text-purple-100 text-sm font-medium">Organiza a tus estudiantes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-5">
          <CustomInput 
            label="Nombre del Grupo" 
            icon={<Type className="w-4 h-4" />}
            value={formData.name} 
            onChange={(v: string) => setFormData({...formData, name: v})} 
            required 
            placeholder="Ej: 5to A, Matemáticas Avanzadas"
          />
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
              Descripción (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descripción breve del grupo..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* ✅ CORREGIDO - Selector de color sin ringColor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
              Color del Grupo
            </label>
            <div className="grid grid-cols-5 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({...formData, color: color.value})}
                  className={`h-12 rounded-xl transition-all border-4 ${
                    formData.color === color.value 
                      ? 'border-slate-900 scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: color.value,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-95"
            >
              {title === 'Nuevo Grupo' ? 'Crear Grupo' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
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
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400`}
        />
      </div>
    </div>
  );
}