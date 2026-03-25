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