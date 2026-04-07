export const MuscleType = {
  TRAPEZIUS: 'trapezius',
  UPPER_BACK: 'upper-back',
  LOWER_BACK: 'lower-back',
  CHEST: 'chest',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  FOREARM: 'forearm',
  BACK_DELTOIDS: 'back-deltoids',
  FRONT_DELTOIDS: 'front-deltoids',
  ABS: 'abs',
  OBLIQUES: 'obliques',
  ABDUCTOR: 'adductor',
  ABDUCTORS: 'abductors',
  HAMSTRING: 'hamstring',
  QUADRICEPS: 'quadriceps',
  CALVES: 'calves',
  GLUTEAL: 'gluteal',
  HEAD: 'head',
  NECK: 'neck',
  KNEES: 'knees',
  LEFT_SOLEUS: 'left-soleus',
  RIGHT_SOLEUS: 'right-soleus',
} as const;

export type Muscle = typeof MuscleType[keyof typeof MuscleType];

export const ModelType = {
  POSTERIOR: 'posterior',
  ANTERIOR: 'anterior',
} as const;

export type ModelType = typeof ModelType[keyof typeof ModelType];

export interface IExerciseData {
  name: string;
  muscles: Array<Muscle | string>;
  frequency?: number;
}

export interface IMuscleData {
  exercises: string[];
  frequency: number;
}

export interface IMuscleStats {
  muscle: Muscle;
  data: IMuscleData;
}

export type StyleObject = Partial<Record<string, string | number | undefined>>;

export interface BodyHighlighterOptions {
  bodyColor?: string;
  data?: IExerciseData[];
  highlightedColors?: string[];
  onClick?: (exercise: IMuscleStats) => void;
  container?: HTMLElement | null;
  wrapperClassName?: string;
  style?: StyleObject;
  svgStyle?: StyleObject;
  type?: ModelType;
}

export interface BodyHighlighterInstance {
  element: HTMLElement;
  /**
   * Updates the highlighter with new options.
   */
  update: (options: Partial<BodyHighlighterOptions>) => void;
  /**
   * Removes DOM nodes and listeners created by the highlighter.
   */
  destroy: () => void;
}
