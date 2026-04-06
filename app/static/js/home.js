const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// load day cards inside schedule
function loadHomePage(){
    Object.keys(currentSchedule.days).forEach((key, index) => {
        const day = currentSchedule.days[key];
        container.appendChild(createDayCardView(day, daysOfTheWeek[index]));
        console.log(day);
    });
}

// create cards for inside of schedule
function createDayCardView(day, dayOfWeek) {
    const button = document.createElement("button");

    button.setAttribute("class", "baseBtn col-span-1");
    button.setAttribute("data-modal-target", "viewDays-modal");
    button.setAttribute("data-modal-toggle", "viewDays-modal");
    button.onclick = function() {selectDayView(dayOfWeek)};

    button.innerHTML = `
        <img src="./images/logoSmall">
        <h3>${dayOfWeek}</h3>
        <p>${day.name}</p>
    `;

    return button;
}

// select the day and display the information
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