async function getSavedSchedules(userID){
    document.getElementById("savedTitle").innerHTML = "Saved Schedules";

    let schedules = await getString(apiString='/api/savedschedules/userID/',infoString=userID);

    if (schedules == undefined){
        // if none found
        document.getElementById("noneFound").innerHTML = "No Schedules Saved...";
    }
    else{

        document.getElementById("noneFound").innerHTML = "";

        let table = document.getElementById("savedItemsTable");
    
        table.innerHTML = ``;
    
        schedules.forEach(async schedule => {
    
            let info = await getString('/api/sharedschedules/',schedule.scheduleID["$oid"])
    
            console.log("Schedule found! name: " + info.name)
    
            table.insertRow(-1).innerHTML = `
            <td>
                <a onclick="loadSchedule(${schedule.scheduleID})">${info.name}</a>
            </td>
        `;
        });

    }

}

async function saveSchedule(){
    
}

async function loadSchedule(){
    
}

async function shareSchedule(schedule, username, private){
    let sharingSchedule = {
        "name": schedule.name,
        "description": schedule.description,
        "days": schedule.days,
        "authorUsername": username,
        "private": private
    };

    console.log("Sharing Schedule: " + sharingSchedule)

    postString(apiString='/api/sharedschedules', infoString=undefined, bodyInfo=sharingSchedule)

}

async function getSavedWorkouts(userID){
    document.getElementById("savedTitle").innerHTML = "Saved Workouts";
    let workouts = await getString(apiString='/api/savedworkouts/userID/',infoString=userID);

    if (workouts == undefined){
        document.getElementById("noneFound").innerHTML = "No Workouts Saved...";
    }
    else{
        
        document.getElementById("noneFound").innerHTML = "";

        let table = document.getElementById("savedItemsTable");
    
        table.innerHTML = ``;
    
        workouts.forEach(async workout => {
    
            let info = await getString('/api/sharedworkouts/',workout.workoutID["$oid"])
    
            console.log("Workout found! name: " + info.name)
    
            table.insertRow(-1).innerHTML = `
            <td>
                <a onclick="loadWorkout(${workout.workoutID})">${info.name}</a>
            </td>
        `;
        });
        
    }

}

async function saveWorkout(){
    
}

async function loadWorkout(){
    
}

async function shareWorkout(workout, username, private){
    let sharingWorkout = {
        "name": workout.name,
        "description": workout.description,
        "days": workout.days,
        "authorUsername": username,
        "private": private
    };

    console.log("Sharing workout: " + sharingWorkout)

    postString(apiString='/api/sharedworkouts', infoString=undefined, bodyInfo=sharingWorkout)

}

async function getString(apiString, infoString){

        if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
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

    if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
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

async function putString(apiString, infoString, bodyInfo){

    if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
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