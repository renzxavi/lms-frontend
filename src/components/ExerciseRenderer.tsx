"use client";

import { Exercise } from "@/types";
import BlocklyExercise from "./BlocklyExercise";
import ReadingExercise from "./ReadingExercise";
import VideoExercise from "./VideoExercise";

interface ExerciseRendererProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function ExerciseRenderer({
  exercise,
  onCorrect,
}: ExerciseRendererProps) {
  // DETECCIÓN AUTOMÁTICA: No necesitas campo exercise_type
  const getExerciseType = () => {
    if (exercise.content) return 'reading';
    if (exercise.video_url) return 'video';
    if (exercise.toolbox === null && exercise.help_video_url) return 'video';
    return 'blockly';
  };

  const type = getExerciseType();

  if (type === 'reading') {
    return <ReadingExercise exercise={exercise} onCorrect={onCorrect} />;
  }
  
  if (type === 'video') {
    return <VideoExercise exercise={exercise} onCorrect={onCorrect} />;
  }
  
  return <BlocklyExercise exercise={exercise} onCorrect={onCorrect} />;
}