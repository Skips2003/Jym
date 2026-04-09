// Debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// search users database for users with mathcing usernames with tolerence of 0.3
async function searchByUsername(){

    var userSearchTable = document.getElementById("userSearchTable");

    let usernameSearch = document.getElementById("searchUsername").value;

    userSearchTable.innerHTML = `
    <tr>
        <th>Users!</th>
    </tr>
`;

    const responseUser = await fetch('api/users/username/' + usernameSearch, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const dataUser = await responseUser.json();
    console.log("usersFound", dataUser);

    dataUser.forEach(user => {
        userSearchTable.insertRow(-1).innerHTML = `
        <td>
            <a href="${profileUrlBase}/${user.username}">${user.username}</a>
        </td>
    `;
    });
}

// search shared workouts using name
async function searchWorkouts(){

    var workoutSearchTable = document.getElementById("sharedSearchTable");

    let workoutSearch = document.getElementById("searchWorkout").value;

    workoutSearchTable.innerHTML = `
    <tr>
        <th>Workouts!</th>
    </tr>
`;

    const responseUser = await fetch('/api/sharedworkouts/workoutName/' + workoutSearch , {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const dataWorkout = await responseUser.json();
    console.log("workoutsFound", dataWorkout);

    dataWorkout.forEach(workout => {
        workoutSearchTable.insertRow(-1).innerHTML = `
        <td>
            <button class="baseBtn w-full" onclick="loadWorkout('${workout._id["$oid"]}')">
                <h1>${workout.name}</h1>
                <h3>${workout.description}</h3>
                <p>${workout.authorUsername}</p>
            </button>
        </td>
    `;
    });
}

// search shared schedules using name
async function searchSchedules(){

    var scheduleSearchTable = document.getElementById("sharedSearchTable");

    let scheduleSearch = document.getElementById("searchSchedule").value;

    scheduleSearchTable.innerHTML = `
    <tr>
        <th>Schedules!</th>
    </tr>
`;

    const response = await fetch('/api/sharedschedules/scheduleName/' + scheduleSearch , {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const dataSchedule = await response.json();
    console.log("schedulesFound", dataSchedule);

    if(dataSchedule[0] === undefined){
        scheduleSearchTable.insertRow(-1).innerHTML = `
        <td>
            <h1>No Schedules Found...</h1>
        </td>
    `;
    }
    else{
        dataSchedule.forEach(schedule => {
            scheduleSearchTable.insertRow(-1).innerHTML = `
            <td>
                <button class="baseBtn w-full" onclick="loadSchedule('${schedule._id["$oid"]}')">
                    <h1>${schedule.name}</h1>
                    <h3>${schedule.description}</h3>
                    <p>${schedule.authorUsername}</p>
                </button>
            </td>
        `;
        });
    }
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
                <button class="baseBtn" onclick="loadWorkout('${info._id["$oid"]}')">
                    <h1>${info.name}</h1>
                    <h3>${info.description}</h3>
                    <p>${info.authorUsername}</p>
                </button>
            </td>
        `;
        });
        
    }

}

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
                <button class="baseBtn" onclick="loadSchedule('${info._id["$oid"]}')">
                    <h1>${info.name}</h1>
                    <h3>${info.description}</h3>
                    <p>${info.authorUsername}</p>
                </button>
            </td>
        `;
        });

    }

}


// Create a debounced version of the search function
const debouncedSearchSchedule = debounce(searchSchedules, 350);
const debouncedSearchWorkout = debounce(searchWorkouts, 350);
const debouncedSearchByUsername = debounce(searchByUsername, 350);