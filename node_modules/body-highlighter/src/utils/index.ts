import { IExerciseData, IMuscleData, Muscle, MuscleType } from '../component/metadata';
import { DEFAULT_MUSCLE_DATA, MUSCLE_ALIAS_MAP } from '../constants';

/*
 * Utility function for choosing backup value if first value is undefined
 */
export const ensure = <T>(value: T | undefined, backupValue: T): T => {
  return value == null ? backupValue : value;
};

const KNOWN_MUSCLES = new Set<Muscle>(Object.values(MuscleType) as Muscle[]);

const normalizeMuscleEntry = (value: Muscle | string): Muscle | undefined => {
  if (KNOWN_MUSCLES.has(value as Muscle)) {
    return value as Muscle;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedKey = value.trim().toLowerCase();

  if (!normalizedKey) {
    return undefined;
  }

  const aliasTarget = MUSCLE_ALIAS_MAP[normalizedKey];
  if (aliasTarget) {
    return aliasTarget;
  }

  if (KNOWN_MUSCLES.has(normalizedKey as Muscle)) {
    return normalizedKey as Muscle;
  }

  return undefined;
};

export const normalizeMuscle = (value: Muscle | string): Muscle | undefined => {
  return normalizeMuscleEntry(value);
};

/**
 * Function which determines color of muscle based on how often it has been exercised
 */
export const fillIntensityColor = (
  activityMap: Record<Muscle, IMuscleData>,
  highlightedColors: string[],
  muscle: Muscle
): string | undefined => {
  const frequency = activityMap[muscle]?.frequency;

  if (frequency == null || frequency === 0) {
    return undefined;
  }

  return highlightedColors[Math.min(highlightedColors.length - 1, frequency - 1)];
};

/**
 * Function which generates object with muscle data
 */
export const fillMuscleData = (data: IExerciseData[]): Record<Muscle, IMuscleData> => {
  return data.reduce((acc, exercise: IExerciseData) => {
    for (const muscle of exercise.muscles) {
      const normalizedMuscle = normalizeMuscleEntry(muscle);

      if (!normalizedMuscle) {
        continue;
      }

      acc[normalizedMuscle].exercises = [...acc[normalizedMuscle].exercises, exercise.name];
      acc[normalizedMuscle].frequency += exercise.frequency || 1;
    }

    return acc;
  }, JSON.parse(JSON.stringify(DEFAULT_MUSCLE_DATA)));
};
