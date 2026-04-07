import { createBodyHighlighter, MuscleType } from 'body-highlighter';

const initDiagram = (): void => {
    const container = document.getElementById('musclesWorked');
    if (!container) return;

    const data = [
        { name: 'Bench Press', muscles: [MuscleType.CHEST, MuscleType.TRICEPS] },
        { name: 'Squats', muscles: [MuscleType.QUADRICEPS, MuscleType.GLUTEUS_MAXIMUS] }
    ];

    createBodyHighlighter({
        container,
        data,
        style: { width: '300px' }
    });
};

document.addEventListener('DOMContentLoaded', initDiagram);