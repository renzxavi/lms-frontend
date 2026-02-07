"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import { 
  Video, CheckCircle, Play, Pause, RotateCcw, 
  Volume2, VolumeX, Award, Clock, Eye, Sparkles, 
  BookOpen, Lightbulb, Flame 
} from "lucide-react";
import ResultModal from "./ResultModal";

// --- Extensión de tipos para evitar errores de compilación ---
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function VideoExercise({ exercise, onCorrect }: VideoExerciseProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [watchProgress, setWatchProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoUrl = exercise.video_url || exercise.help_video_url;

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|v=)([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;

  const initPlayer = () => {
    const YT = (window as any).YT;
    if (!videoId || playerRef.current || !YT) return;

    playerRef.current = new YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        modestbranding: 1,
        rel: 0,
        controls: 0,
        disablekb: 1,
        showinfo: 0,
      },
      events: {
        onReady: (e: any) => setDuration(e.target.getDuration()),
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
    } else {
      setIsPlaying(false);
      stopProgressTracking();
    }
    if (event.data === YT.PlayerState.ENDED) setHasWatched(true);
  };

  const startProgressTracking = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      const current = playerRef.current.getCurrentTime();
      const total = playerRef.current.getDuration();
      if (total > 0) {
        setCurrentTime(current);
        const progress = (current / total) * 100;
        setWatchProgress(progress);
        if (progress >= 85 && !hasWatched) setHasWatched(true);
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!videoId) return;
    const win = window as any;
    if (win.YT && win.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById('youtube-sdk')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-sdk';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
      win.onYouTubeIframeAPIReady = initPlayer;
    }
    return () => stopProgressTracking();
  }, [videoId]);

  const handleComplete = async () => {
    if (!hasWatched) {
      setModalMessage("¡No te detengas! 🔥 Mira un poco más del video para completar el desafío.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }
    setIsSuccess(true);
    setModalMessage(`¡Espectacular! 🏆 Has dominado este contenido y ganado ${exercise.points} puntos.`);
    setShowModal(true);
    await onCorrect("video_watched", { completed: true, watchTime: currentTime });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-in fade-in duration-700 select-none">
      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3" /> Desafío de Video
              </span>
              {hasWatched && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completado
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {exercise.title}
            </h1>
          </div>

          {/* REPRODUCTOR CON ACENTOS ROJOS */}
          <div 
            className="group relative aspect-video bg-gray-950 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.15)] border-4 border-white ring-1 ring-red-100"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            <div id="youtube-player" className="w-full h-full pointer-events-none scale-[1.01]"></div>

            <div className={`absolute inset-0 bg-gradient-to-t from-red-950/90 via-transparent to-transparent transition-opacity duration-500 flex flex-col justify-end p-6 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              
              <div className="relative h-1.5 w-full bg-white/20 rounded-full mb-6 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${hasWatched ? 'bg-emerald-400' : 'bg-red-500'}`}
                  style={{ width: `${watchProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()}
                    className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all shadow-xl shadow-red-900/20"
                  >
                    {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={() => playerRef.current.seekTo(0)} className="text-white/70 hover:text-white transition-colors">
                    <RotateCcw className="w-6 h-6" />
                  </button>
                  <div className="text-white font-medium tabular-nums text-sm">
                    {formatTime(currentTime)} <span className="text-white/40">/ {formatTime(duration)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (isMuted) playerRef.current.unMute(); else playerRef.current.mute();
                    setIsMuted(!isMuted);
                  }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-red-50 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold uppercase text-[10px] tracking-widest">Lección</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{exercise.description}</p>
            </div>
            <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-700">
                <Lightbulb className="w-5 h-5" />
                <h3 className="font-bold uppercase text-[10px] tracking-widest">Sabiduría</h3>
              </div>
              <p className="text-red-900/80 leading-relaxed italic text-sm">
                {exercise.story || "El conocimiento es el fuego que ilumina tu camino. ¡Sigue adelante!"}
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-4 ring-1 ring-white/30 shadow-2xl">
                <Award className="w-10 h-10 text-red-200" />
              </div>
              <div className="text-5xl font-black mb-1 tracking-tighter">{exercise.points}</div>
              <div className="text-red-200 font-bold uppercase tracking-widest text-[10px]">Puntos en juego</div>
              
              <div className="w-full h-px bg-white/10 my-6"></div>

              <div className="flex justify-around w-full">
                <div className="text-center">
                  <div className="text-lg font-bold flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatTime(duration)}
                  </div>
                  <div className="text-[10px] text-red-300 uppercase font-bold">Tiempo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {Math.round(watchProgress)}%
                  </div>
                  <div className="text-[10px] text-red-300 uppercase font-bold">Visto</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-red-50 shadow-sm flex flex-col items-center">
            <h3 className="text-gray-900 font-black mb-6 uppercase text-[10px] tracking-widest">Tu Progreso</h3>
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-red-50" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * watchProgress) / 100}
                  strokeLinecap="round"
                  className={`${hasWatched ? 'text-emerald-500' : 'text-red-600'} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black tracking-tighter ${hasWatched ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {Math.round(watchProgress)}%
                </span>
                {hasWatched && <CheckCircle className="w-6 h-6 text-emerald-500 animate-bounce mt-1" />}
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl text-center text-[10px] font-black transition-colors ${hasWatched ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {hasWatched 
                ? "¡LISTO PARA RECLAMAR!" 
                : `MIRA UN ${Math.max(0, 85 - Math.round(watchProgress))}% MÁS`}
            </div>
          </div>

          <button
            onClick={handleComplete}
            disabled={!hasWatched}
            className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all duration-300 transform active:scale-95 shadow-2xl ${
              hasWatched
                ? "bg-red-600 text-white shadow-red-200 hover:bg-red-700 hover:-translate-y-1"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {hasWatched ? (
              <span className="flex items-center justify-center gap-3">
                ¡OBTENER PREMIO! <Sparkles className="w-6 h-6 text-yellow-300" />
              </span>
            ) : (
              "DESBLOQUEAR PUNTOS"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}