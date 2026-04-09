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

    // Changed: Removed 'col-span-1' to let the parent grid control layout
    button.setAttribute("class", "dayBtn w-full"); 
    button.setAttribute("data-modal-target", "viewDays-modal");
    button.setAttribute("data-modal-toggle", "viewDays-modal");
    button.onclick = function() {selectDayView(dayOfWeek)};

    button.innerHTML = `
        <h3>${dayOfWeek}</h3>
        <p>${day.name}</p>
    `;

    return button;
}

// select the day and display the information
function selectDayView(day) {

    currentDay = day;
    let exercises = currentSchedule.days[day].exercises;

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

    if (exercises[0] == undefined){
        exerciseTable.innerHTML = `<td>Rest Day!</td>`;
        changeDiagram(exercises)
    }
    else{
        for (let i = 0; i < exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${exercises[i].name}</td>
                <td id="sets-${i}">${exercises[i].sets}</td>
                <td id="reps-${i}">${exercises[i].reps}</td>
                <td id="weight-${i}">${exercises[i].weight}</td>
            `;
        }

        changeDiagram(exercises)

    }

}

loadHomePage();