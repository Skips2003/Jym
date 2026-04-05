async function getSavedSchedules(userID){
    let schedules = await getString(apiString='/api/savedschedules/userID/',infoString=userID);

    document.getElementById("savedTitle").value = "Saved Schedules";

    let table = document.getElementById("savedItemsTable");

    table.innerHTML = ``;

    schedules.forEach(schedule => {

        info = getString('/api/sharedschedules/',schedule.scheduleID["$oid"]).name

        table.insertRow(-1).innerHTML = `
        <td>
            <a onclick="loadSchedule(${schedule.scheduleID})">${info}</a>
        </td>
    `;
    });
}

async function saveSchedule(){
    
}

async function getSavedWorkouts(userID){
    let workouts = await getString(apiString='/api/savedworkouts/userID/',infoString=userID);

    document.getElementById("savedTitle").value = "Saved Workouts";

    let table = document.getElementById("savedItemsTable");

    table.innerHTML = ``;

    workouts.forEach(workout => {

        info = getString('/api/sharedworkouts/',workout.workoutID["$oid"])

        table.insertRow(-1).innerHTML = `
        <td>
            <a onclick="loadSchedule(${workout.workoutID})">${info.name}</a>
        </td>
    `;
    });
}

async function saveWorkout(){
    
}

async function getString(apiString, infoString){
    const response = await fetch(apiString + infoString, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const data = await response.json();
    console.log("Data Found:", data);
    return data
}

async function postString(apiString, infoString, bodyInfo){
    const response = await fetch(apiString + infoString, {
        method: 'POST',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(bodyInfo)
    });

    const data = await response.json();
    console.log("Insert Completed:", data);
    return data
}

async function putString(apiString, searchString, bodyInfo){
    const response = await fetch(apiString + searchString, {
        method: 'PUT',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(bodyInfo)
    });
    
    const data = await response.json();
    console.log("update complete:", data);
}