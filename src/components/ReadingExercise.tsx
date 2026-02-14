"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Award,
  Bookmark,
  ChevronDown,
  ArrowDown,
} from "lucide-react";

interface ReadingExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function ReadingExercise({
  exercise,
  onCorrect,
}: ReadingExerciseProps) {
  const [hasRead, setHasRead] = useState(false);
  const [isContentShort, setIsContentShort] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  /* ------------------ TIMERS ------------------ */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const hasScroll =
      contentRef.current.scrollHeight >
      contentRef.current.clientHeight + 10;

    setIsContentShort(!hasScroll);

    if (!hasScroll) {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (countdownRef.current)
              clearInterval(countdownRef.current);
            setHasRead(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeout(() => setShowScrollHint(false), 5000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  /* ------------------ HANDLERS ------------------ */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const percent = ((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100;
    setScrollProgress(Math.min(percent, 100));

    if (percent > 95) {
      setHasRead(true);
      setIsScrolledToBottom(true);
      setShowScrollHint(false);
    }
  };

  const handleComplete = async () => {
    if (!hasRead) {
      return;
    }

    await onCorrect("reading_completed", {
      completed: true,
      readingTime,
      scrollProgress: 100,
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl text-white">
        <h1 className="text-3xl font-black">{exercise.title}</h1>
        <p className="text-orange-100 mt-2">{exercise.description}</p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat icon={<Award />} label="Puntos" value={exercise.points} />
          <Stat icon={<Clock />} label="Tiempo" value={formatTime(readingTime)} />
          <Stat
            icon={<Eye />}
            label="Progreso"
            value={`${Math.round(scrollProgress)}%`}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white border-2 border-orange-200 rounded-3xl shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-bold text-orange-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5" /> Lectura
          </span>

          {!isContentShort && !hasRead && showScrollHint && (
            <button
              onClick={scrollToBottom}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold animate-pulse"
            >
              <ArrowDown className="inline w-4 h-4 mr-1" />
              Ir al final
            </button>
          )}
        </div>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar"
        >
          <div
            className={`
              prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-black
              prose-p:text-gray-800 prose-p:leading-relaxed
              prose-li:text-gray-800
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-a:text-orange-600 prose-a:font-semibold
              prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:rounded-lg prose-blockquote:p-4
              prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-img:rounded-xl prose-img:shadow-lg
            `}
            dangerouslySetInnerHTML={{
              __html: exercise.content || "",
            }}
          />

          {!isContentShort && !isScrolledToBottom && (
            <div className="text-center mt-8 text-orange-600">
              <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
              <p className="font-medium mt-2">
                Sigue bajando para completar la lectura
              </p>
            </div>
          )}
        </div>
      </div>

      {/* COMPLETE BUTTON */}
      <button
        onClick={handleComplete}
        disabled={!hasRead}
        className={`w-full mt-6 py-5 rounded-2xl font-black text-xl transition-all ${
          hasRead
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {hasRead ? "COMPLETAR LECTURA" : "LEE EL CONTENIDO"}
      </button>

      {/* SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ea580c);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

/* ------------------ MINI COMPONENT ------------------ */
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white/10 rounded-xl p-3">
      <div className="flex items-center gap-2 text-xs uppercase font-bold text-orange-100">
        {icon} {label}
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}