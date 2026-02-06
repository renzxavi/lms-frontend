"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import { Video, CheckCircle, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Award, Clock, Eye } from "lucide-react";
import ResultModal from "./ResultModal";

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
  const intervalRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const videoUrl = exercise.video_url || exercise.help_video_url;

  // Extraer video ID de YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;

  // Cargar YouTube IFrame API
  useEffect(() => {
    if (!videoId) return;

    // Verificar si ya está cargado
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Cargar script de YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Callback cuando el API esté listo
    (window as any).onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [videoId]);

  const initPlayer = () => {
    if (!videoId || playerRef.current) return;

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event: any) => {
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
  };

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    
    // 1 = playing
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
    }
    
    // 2 = paused
    if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTracking();
    }
    
    // 0 = ended
    if (event.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
      stopProgressTracking();
      if (!hasWatched) {
        setHasWatched(true);
      }
    }
  };

  const startProgressTracking = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (duration > 0) {
        setCurrentTime(currentTime);
        const progress = (currentTime / duration) * 100;
        setWatchProgress(progress);
        
        // Marcar como visto al 80% del video
        if (progress >= 80 && !hasWatched) {
          setHasWatched(true);
        }
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const restartVideo = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    setWatchProgress(0);
    setCurrentTime(0);
  };

  const handleComplete = async () => {
    if (!hasWatched) {
      setModalMessage("¡Aún no has terminado de ver el video! 🎬\nMira al menos el 80% para continuar.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSuccess(true);
    setModalMessage(`¡Excelente trabajo! 🎉\n\nHas completado el video y ganado ${exercise.points} puntos.`);
    setShowModal(true);
    
    await onCorrect("video_watched", { completed: true, watchTime: currentTime });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Video className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-purple-100 uppercase tracking-wider">Video Educativo</div>
                <h1 className="text-2xl md:text-3xl font-black">{exercise.title}</h1>
              </div>
            </div>
            <p className="text-lg text-purple-50 leading-relaxed">{exercise.description}</p>
          </div>
          {exercise.character && (
            <div className="text-5xl ml-4 hidden md:block">
              {{
                'cat': '🐱', 'dog': '🐶', 'lion': '🦁', 'elephant': '🐘', 
                'rabbit': '🐰', 'fox': '🦊', 'bear': '🐻', 'panda': '🐼',
                'owl': '🦉', 'turtle': '🐢', 'robot': '🤖'
              }[exercise.character] || '🎬'}
            </div>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Puntos</span>
            </div>
            <p className="text-2xl font-black">{exercise.points}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Duración</span>
            </div>
            <p className="text-2xl font-black">{duration > 0 ? formatTime(duration) : '--:--'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Progreso</span>
            </div>
            <p className="text-2xl font-black">{Math.round(watchProgress)}%</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Video Area - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-blue-900 mb-2 text-lg">📋 Instrucciones</h3>
                  <p className="text-blue-800 leading-relaxed">{exercise.instructions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div 
            className="relative bg-black rounded-3xl overflow-hidden shadow-2xl group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => !isPlaying && setShowControls(false)}
          >
            {videoId ? (
              <>
                <div id="youtube-player" className="w-full aspect-video"></div>
                
                {/* Custom Controls Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-white text-sm mb-2">
                        <span className="font-bold">{formatTime(currentTime)}</span>
                        <span className="font-bold">{formatTime(duration)}</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className={`h-full transition-all duration-300 ${hasWatched ? 'bg-green-400' : 'bg-purple-400'}`}
                          style={{ width: `${Math.min(watchProgress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all transform hover:scale-110"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-white" fill="white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" fill="white" />
                          )}
                        </button>
                        <button
                          onClick={restartVideo}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all transform hover:scale-110"
                        >
                          <RotateCcw className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all transform hover:scale-110"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                      
                      {hasWatched && (
                        <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                          <span className="text-white font-bold text-sm">¡Completado!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-white bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg font-bold">No se pudo cargar el video</p>
                </div>
              </div>
            )}
          </div>

          {/* Story */}
          {exercise.story && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <h3 className="font-black text-purple-900 mb-2 text-lg">Historia</h3>
                  <p className="text-purple-800 leading-relaxed italic">{exercise.story}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Tu Progreso
            </h3>
            
            <div className="space-y-4">
              {/* Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - watchProgress / 100)}`}
                      className={`${hasWatched ? 'text-green-500' : 'text-purple-500'} transition-all duration-500`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-3xl font-black ${hasWatched ? 'text-green-600' : 'text-purple-600'}`}>
                      {Math.round(watchProgress)}%
                    </span>
                    {hasWatched && (
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1" strokeWidth={2.5} />
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`p-4 rounded-xl text-center ${hasWatched ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                <p className={`font-bold ${hasWatched ? 'text-green-700' : 'text-yellow-700'}`}>
                  {hasWatched ? '✅ Video Completado' : '⏳ Continúa viendo...'}
                </p>
                {!hasWatched && watchProgress > 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    Necesitas ver el {80 - Math.round(watchProgress)}% más
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Help Card */}
          {exercise.help_text && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-black text-green-900 mb-2 text-lg">Consejo</h3>
                  <p className="text-green-800 leading-relaxed text-sm">{exercise.help_text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={!hasWatched}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-lg ${
              hasWatched
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-500/50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {hasWatched ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                COMPLETAR EJERCICIO
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-6 h-6" />
                MIRA EL VIDEO
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Extender window para TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}