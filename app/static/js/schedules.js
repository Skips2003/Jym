const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function selectDay(day) {

    console.log(workouts[day].description, daysOfTheWeek[day]);

    document.getElementById('workoutName').textContent = `${workouts[day].name}`;

    var exerciseTable = document.getElementById("exerciseTable");

    exerciseTable.innerHTML = `
        <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
        </tr>
    `;

    if (workouts[day].exercises == undefined){
        exerciseTable.insertRow(1).innerHTML = `
            <td colspan="4">No exercises for this day.</td>
        `;
    }
    else{
        for (let i = 1; i < workouts[day].exercises.length; i++) {
            exerciseTable.insertRow(i).innerHTML = `
                <td>${workouts[day].exercises[i].name}</td>
                <td>${workouts[day].exercises[i].sets}</td>
                <td>${workouts[day].exercises[i].reps}</td>
                <td>${workouts[day].exercises[i].weight}</td>
            `;
        }
    }

}

function createDayCard(day, dayOfWeek, dayIndex) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" onclick="selectDay(${dayIndex})">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

async function searchExercises() {
    const searchInput = document.getElementById("exerciseSearchInput").value;

    console.log("Searching for exercises with query: " + searchInput);

    const exercises = await getExercisesBySearchString(searchInput);

    console.log("Exercises found: ", exercises.data);

    const exerciseSearchTable = document.getElementById("exerciseSearchTable");

    exerciseSearchTable.innerHTML = ``;

    exerciseSearchTable.innerHTML = `
        <tr>
            <th>Exercise</th>
            <th>Target Muscles</th>
            <th>Secondary Muscles</th>
            <th>Equipments</th>
            <th>Details</th>
            <th>Add to Day</th>
        </tr>
    `;
    
    if (exercises.length == 0){
        exerciseSearchTable.insertRow(1).innerHTML = `
            <td colspan="6">No exercises found.</td>
        `;
    }
    else{
        exercises.data.forEach(exercise => {
            addExerciseToSearchTable(exercise);
        });
    }
}

async function getExercisesBySearchString(search){
    try {
        const response = await fetch('https://exercisedb.dev/api/v1/exercises/search?offset=0&limit=10&q=' + search + '&threshold=0.3', {
            headers: { Accept: 'application/json' }
        });
        const data = await response.json();
        console.log("Exercises fetched:", data);
        return data; // This now returns to the searchExercises function
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }

}

function addExerciseToSearchTable(exercise){

    var exerciseSearchTable = document.getElementById("exerciseSearchTable");

    // Use -1 to append the row to the end of the table
    let row = exerciseSearchTable.insertRow(-1); 
    
    row.innerHTML = `
        <td>${exercise.name}</td>
        <td>${exercise.targetMuscles}</td>
        <td>${exercise.secondaryMuscles}</td>
        <td>${exercise.equipments}</td>
        <td><button class="baseBtn" onclick="viewExerciseDetails('${exercise.exerciseId}')">Details</button></td>
        <td><button class="baseBtn" onclick="addExerciseToDay('${exercise.exerciseId}')">Add</button></td>
    `;
}

function viewExerciseDetails(exerciseId){
    console.log("Viewing details for exercise ID: " + exerciseId);
    // Implement the logic to fetch and display exercise details
}

function addExerciseToDay(exerciseId){
    console.log("Adding exercise ID: " + exerciseId + " to the current day.");
    // Implement the logic to add the exercise to the current day's workout
}
