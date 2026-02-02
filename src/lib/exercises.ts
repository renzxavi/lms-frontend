import { Exercise } from '@/types';

export const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Suma Básica',
    description: 'Aprende a sumar dos números',
    difficulty: 'beginner',
    instructions: 'Crea un bloque que sume 2 + 3 y obtenga como resultado 5',
    expectedResult: 5,
    hints: [
      'Usa el bloque de número para crear el 2',
      'Usa otro bloque de número para crear el 3',
      'Usa el bloque de operación matemática (+) para sumarlos',
    ],
    toolbox: {
      kind: 'flyoutToolbox',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
  },
  {
    id: 2,
    title: 'Multiplicación',
    description: 'Aprende a multiplicar números',
    difficulty: 'beginner',
    instructions: 'Multiplica 4 × 5 para obtener 20',
    expectedResult: 20,
    hints: [
      'Necesitas dos bloques de números: 4 y 5',
      'Usa el bloque de operación matemática',
      'Cambia la operación a multiplicación (×)',
    ],
    toolbox: {
      kind: 'flyoutToolbox',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
  },
  {
    id: 3,
    title: 'Operaciones Combinadas',
    description: 'Combina suma y multiplicación',
    difficulty: 'intermediate',
    instructions: 'Calcula (2 + 3) × 4 para obtener 20',
    expectedResult: 20,
    hints: [
      'Primero suma 2 + 3',
      'Luego multiplica el resultado por 4',
      'Puedes anidar bloques de operaciones',
    ],
    toolbox: {
      kind: 'flyoutToolbox',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
  },
  {
    id: 4,
    title: 'Variables y Lógica',
    description: 'Trabaja con variables',
    difficulty: 'intermediate',
    instructions: 'Crea una variable "resultado" y guarda el valor de 10 + 5',
    expectedResult: 15,
    hints: [
      'Usa el bloque de "crear variable"',
      'Asigna el nombre "resultado"',
      'Guarda la suma de 10 + 5 en la variable',
    ],
    toolbox: {
      kind: 'flyoutToolbox',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'variables_set' },
        { kind: 'block', type: 'variables_get' },
      ],
    },
  },
];