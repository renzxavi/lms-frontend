"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlocklyTutorialProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function BlocklyTutorial({ onClose, isOpen }: BlocklyTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡BIENVENIDO A BLOCKLY! 🎉",
      description: "BLOCKLY ES UNA FORMA VISUAL DE PROGRAMAR. ¡CONECTAS BLOQUES COMO SI FUERAN PIEZAS DE UN ROMPECABEZAS!",
      image: "🧩",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "ARRASTRA LOS BLOQUES 👆",
      description: "EN EL PANEL LATERAL VERÁS LOS BLOQUES DISPONIBLES. HAZ CLIC Y ARRÁSTRALOS AL ÁREA DE TRABAJO.",
      image: "👉",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "CONECTA LA LÓGICA 🔗",
      description: "LOS BLOQUES SE UNEN POR SUS MUESCAS. SI ENCAJAN, SE PEGARÁN AUTOMÁTICAMENTE. ¡ES PURA LÓGICA!",
      image: "🔌",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "MIRA CÓMO SE HACE 📺",
      description: "MIRA ESTE PEQUEÑO VIDEO PARA CONVERTIRTE EN UN EXPERTO DE LOS BLOQUES.",
      videoUrl: "https://www.youtube.com/embed/eT7i6JSIPmI",
      color: "from-red-500 to-rose-600"
    },
    {
      title: "EJECUTA TU MISIÓN ▶️",
      description: "CUANDO TERMINES, PRESIONA 'ENVIAR SOLUCIÓN'. TU PROGRAMA SE EJECUTARÁ DE ARRIBA HACIA ABAJO.",
      image: "🚀",
      color: "from-orange-500 to-red-500"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {/* Header con Gradiente Dinámico */}
          <div className={`bg-gradient-to-r ${steps[currentStep].color} p-8 text-white text-center transition-colors duration-500`}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex justify-center"
              >
                {steps[currentStep].videoUrl ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black">
                    <iframe
                      className="w-full h-full"
                      src={steps[currentStep].videoUrl}
                      title="Tutorial Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <span className="text-8xl mb-4 drop-shadow-lg">{steps[currentStep].image}</span>
                )}
              </motion.div>
            </AnimatePresence>
            <h2 className="text-3xl font-black tracking-tight italic mt-4 uppercase">
              {steps[currentStep].title}
            </h2>
          </div>

          <div className="p-8">
            <motion.p 
              key={`text-${currentStep}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-700 text-xl leading-relaxed text-center mb-8 font-black uppercase"
            >
              {steps[currentStep].description}
            </motion.p>

            {/* Indicadores */}
            <div className="flex justify-center gap-3 mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-12 bg-gray-800' : 'w-3 bg-gray-200'
                  }`} 
                />
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="flex-1 px-6 py-4 border-4 border-gray-100 text-gray-400 rounded-2xl font-black hover:bg-gray-50 transition-all disabled:opacity-0 uppercase text-sm"
              >
                ANTERIOR
              </button>
              <button 
                onClick={nextStep} 
                className={`flex-[2] px-6 py-4 bg-gradient-to-r ${steps[currentStep].color} text-white rounded-2xl font-black text-xl shadow-lg hover:shadow-xl active:scale-95 transition-all uppercase`}
              >
                {currentStep === steps.length - 1 ? '¡EMPEZAR! 🚀' : 'SIGUIENTE'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}