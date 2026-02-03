'use client';

import { useEffect, useState } from 'react';

interface AnimalCharacterProps {
  character: string;
  animate?: boolean;
}

const animalEmojis: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  lion: '🦁',
  elephant: '🐘',
  rabbit: '🐰',
};

export default function AnimalCharacter({ character, animate = true }: AnimalCharacterProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() / 1000) * 20,
        y: Math.cos(Date.now() / 1500) * 15,
      });
      setRotation(Math.sin(Date.now() / 2000) * 15);
    }, 50);

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div
      className="text-8xl transition-transform duration-100"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      }}
    >
      {animalEmojis[character] || '🐾'}
    </div>
  );
}