import createBodyHighlighter, {IExerciseData, MuscleType} from 'body-highlighter';

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
                if (muscle.toLocaleLowerCase().includes("pectoralis")){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.CHEST],
                        frequency: 2
                    });
                }
                else if(muscle.toLocaleLowerCase().includes("deltoid") && muscle.toLocaleLowerCase().includes("posterior") != true){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.FRONT_DELTOIDS],
                        frequency: 2
                    });
                }
                else if(muscle.toLocaleLowerCase().includes("deltoid") && muscle.toLocaleLowerCase().includes("posterior")){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.BACK_DELTOIDS],
                        frequency: 2
                    });
                }
                else{
                    muscleList = [muscle.toLowerCase()];
                    currentData.push({
                        name: exercise.name,
                        muscles: muscleList,
                        frequency: 2
                    });
                }
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
                if (muscle.toLocaleLowerCase().includes("pectoralis")){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.CHEST],
                    });
                }
                else if(muscle.toLocaleLowerCase().includes("deltoid") && muscle.toLocaleLowerCase().includes("posterior") != true){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.FRONT_DELTOIDS],
                    });
                }
                else if(muscle.toLocaleLowerCase().includes("deltoid") && muscle.toLocaleLowerCase().includes("posterior")){
                    currentData.push({
                        name: exercise.name,
                        muscles: [MuscleType.BACK_DELTOIDS],
                    });
                }
                else{
                    muscleList = [muscle.toLowerCase()];
                    currentData.push({
                        name: exercise.name,
                        muscles: muscleList,
                    });
                }
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


const prepareExercises = (): void => {

    let newScheduleExercises = [];

    Object.keys(currentSchedule.days).forEach(day => {
        currentSchedule.days[day].exercises.forEach(exercise =>{
            newScheduleExercises.push(exercise)
        })
    });

    return newScheduleExercises;
};

// Initialise Models
document.addEventListener('DOMContentLoaded', () => {
    initDiagram();
    changeDiagram(scheduleExercises);
});

(window as any).changeDiagram = changeDiagram;
(window as any).prepareExercises = prepareExercises;