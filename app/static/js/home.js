const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysOfTheWeekID = ["mondayID", "tuesdayID", "wednesdayID", "thursdayID", "fridayID", "saturdayID", "sundayID"];

function loadHomePage(){
    workouts.forEach(day => {;
        container.appendChild(createDayCardView(day, daysOfTheWeek[dayCount], dayCount));
        console.log(day);
        dayCount++;
    });
    
}

function createDayCardView(day, dayOfWeek, dayIndex) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" data-modal-target="viewDays-modal" data-modal-toggle="viewDays-modal" onclick="selectDayView(${dayIndex})">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

function selectDayView(day) {

    currentDay = day;

    document.getElementById("workoutName").innerHTML = workouts[day].name;
    document.getElementById("workoutDescription").innerHTML = workouts[day].description;

    console.log(workouts[day].description, daysOfTheWeek[day]);

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
        exerciseTable.insertRow(-1).innerHTML = `
            <td colspan="4">Rest Day!</td>
        `;
    }
    else{
        for (let i = 0; i < workouts[day].exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${workouts[day].exercises[i].name}</td>
                <td id="sets-${i}">${workouts[day].exercises[i].sets}</td>
                <td id="reps-${i}">${workouts[day].exercises[i].reps}</td>
                <td id="weight-${i}">${workouts[day].exercises[i].weight}</td>
            `;
        }
    }

}