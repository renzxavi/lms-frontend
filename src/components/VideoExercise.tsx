"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import { Video, CheckCircle } from "lucide-react";
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
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

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
    };
  }, [videoId]);

  const initPlayer = () => {
    if (!videoId || playerRef.current) return;

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      videoId: videoId,
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    
    // 1 = playing
    if (event.data === YT.PlayerState.PLAYING) {
      startProgressTracking();
    }
    
    // 0 = ended, 2 = paused
    if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
      stopProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (duration > 0) {
        const progress = (currentTime / duration) * 100;
        setWatchProgress(progress);
        
        // Marcar como visto al 80% del video
        if (progress >= 80 && !hasWatched) {
          setHasWatched(true);
          stopProgressTracking();
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleComplete = async () => {
    if (!hasWatched) {
      setModalMessage("Mira el video completo antes de continuar.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSuccess(true);
    setModalMessage(`¡Excelente! Ganaste ${exercise.points} puntos.`);
    setShowModal(true);
    
    await onCorrect("video_watched", { completed: true });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl">
      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-black text-black">{exercise.title}</h1>
        <p className="text-gray-800 mt-2 font-medium">{exercise.description}</p>
      </header>

      {exercise.instructions && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <Video className="inline w-5 h-5 text-blue-600 mr-2" />
          <span className="font-bold text-black">Instrucciones:</span> 
          <span className="text-black"> {exercise.instructions}</span>
        </div>
      )}

      {exercise.story && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
          <span className="text-2xl mr-2">🎬</span>
          <span className="font-bold text-black">Historia:</span> 
          <span className="text-black"> {exercise.story}</span>
        </div>
      )}

      <div className="border-4 border-blue-100 rounded-3xl overflow-hidden mb-6 bg-black">
        {videoId ? (
          <div id="youtube-player" className="w-full aspect-video"></div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-white">
            <p>No se pudo cargar el video</p>
          </div>
        )}
      </div>

      {exercise.help_text && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <span className="font-bold text-black">💡 Ayuda:</span> 
          <span className="text-black"> {exercise.help_text}</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${hasWatched ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${Math.min(watchProgress, 100)}%` }}
          />
        </div>
        {hasWatched && <CheckCircle className="w-6 h-6 text-green-500" />}
        {!hasWatched && watchProgress > 0 && (
          <span className="text-sm text-gray-600 font-medium">
            {Math.round(watchProgress)}%
          </span>
        )}
      </div>

      <button
        onClick={handleComplete}
        disabled={!hasWatched}
        className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
          hasWatched
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-black cursor-not-allowed"
        }`}
      >
        {hasWatched ? "COMPLETAR VIDEO 🎉" : "MIRA EL VIDEO COMPLETO 🎬"}
      </button>
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