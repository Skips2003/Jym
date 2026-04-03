const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function loadHomePage(){
    Object.keys(currentSchedule.days).forEach((key, index) => {
        const day = currentSchedule.days[key];
        container.appendChild(createDayCardView(day, daysOfTheWeek[index]));
        console.log(day);
    });
}

function createDayCardView(day, dayOfWeek) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" data-modal-target="viewDays-modal" data-modal-toggle="viewDays-modal" onclick="selectDayView('${dayOfWeek}')">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

function selectDayView(day) {

    currentDay = day;

    if(document.getElementById("workoutName") != undefined && document.getElementById("workoutDescription") != undefined){
        document.getElementById("workoutName").innerHTML = currentSchedule.days[day].name;
        document.getElementById("workoutDescription").innerHTML = currentSchedule.days[day].description;
    }

    console.log(currentSchedule.days[day].description, daysOfTheWeek[day]);

    var exerciseTable = document.getElementById("exerciseTable");

    exerciseTable.innerHTML = `
        <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
        </tr>
    `;

    if (currentSchedule.days[day].exercises[0] == undefined){
        exerciseTable.innerHTML = ``;
    }
    else{
        for (let i = 0; i < currentSchedule.days[day].exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${currentSchedule.days[day].exercises[i].name}</td>
                <td id="sets-${i}">${currentSchedule.days[day].exercises[i].sets}</td>
                <td id="reps-${i}">${currentSchedule.days[day].exercises[i].reps}</td>
                <td id="weight-${i}">${currentSchedule.days[day].exercises[i].weight}</td>
            `;
        }
    }

}