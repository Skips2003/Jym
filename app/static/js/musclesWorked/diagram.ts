import createBodyHighlighter, { IExerciseData} from 'body-highlighter';

interface IExerciseInput {
    name: string;
    targetMuscles: string | string[]; // Can handle single string or array
    secondaryMuscles: string | string[]; // Can handle single string or array
}

let highlighterAnterior: any;
let highlighterPosterior: any;
let currentData: IExerciseData[] = [];

// Change look of models here!
const initDiagram = (): void => {
    const containerAnterior = document.getElementById('musclesWorkedAnterior');
    const containerPosterior = document.getElementById('musclesWorkedPosterior');

    const commonConfig = {
        data: [],
        highlightedColors: ['#d9c380', '#CC6C27', '#963c31'],
        style: { width: '240px', padding: '24px' },
        svgStyle: { borderRadius: '16px' }
    };

    if (containerAnterior) {
        highlighterAnterior = createBodyHighlighter({
            ...commonConfig,
            container: containerAnterior,
            type: 'anterior',
            bodyColor: '#56787a'
        });
    }

    if (containerPosterior) {
        highlighterPosterior = createBodyHighlighter({
            ...commonConfig,
            container: containerPosterior,
            type: 'posterior',
            bodyColor: '#56787a'
        });
    }
};

// updates models
const syncHighlighters = (): void => {
    if (highlighterAnterior) highlighterAnterior.update({ data: currentData });
    if (highlighterPosterior) highlighterPosterior.update({ data: currentData });
};

// Update Diagram to new List of Exercises
const changeDiagram = (exercises: IExerciseInput[]): void => {
    // Clear the previous data so we don't stack muscles from old views
    currentData = [];

    exercises.forEach(exercise => {
        let muscleList: string[] = [];
        
        if (Array.isArray(exercise.targetMuscles)) {
            exercise.targetMuscles.forEach(muscle => {
                muscleList = [muscle.toLowerCase()];
                currentData.push({
                    name: exercise.name,
                    muscles: muscleList,
                });
            });
        } else {
            muscleList = [exercise.targetMuscles.toLowerCase()];
            currentData.push({
                name: exercise.name,
                muscles: muscleList,
            });
        }

        if (Array.isArray(exercise.secondaryMuscles)) {
            exercise.secondaryMuscles.forEach(muscle => {
                muscleList = [muscle.toLowerCase()];
                currentData.push({
                    name: exercise.name,
                    muscles: muscleList,
                });
            });
        } else {
            muscleList = [exercise.secondaryMuscles.toLowerCase()];
            currentData.push({
                name: exercise.name,
                muscles: muscleList,
            });
        }

    });
    
    syncHighlighters();
};

// Initialise Models
document.addEventListener('DOMContentLoaded', () => {initDiagram();});

(window as any).changeDiagram = changeDiagram;