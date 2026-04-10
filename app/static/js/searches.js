let selectedWorkoutID = null;
let selectedScheduleID = null;

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
async function searchWorkouts(userID){

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

    if(dataWorkout[0] === undefined){
        workoutSearchTable.insertRow(-1).innerHTML = `
        <td>
            <h1>No Workouts Found...</h1>
        </td>
    `;
    }
    else{
        dataWorkout.forEach(workout => {
    
            console.log("Workout found! name: " + workout.name)
    
            antID = 'musclesWorkedAnterior' + workout._id["$oid"];
            postID = 'musclesWorkedPosterior' + workout._id["$oid"];
        
            workoutSearchTable.insertRow(-1).innerHTML = `
            <td>
                <div class="dayCard grid grid-cols-2 gap-4 p-4">
                    <div class="col-span-1">
                        <h3>${workout.name}</h3>
                        <p>${workout.description}</p>
                        <p>By ${workout.authorUsername}</p>
                    </div>
    
                    <div class="col-span-1">
                        <div class="grid grid-cols-2">
                            <div id="${antID}"></div>
                            <div id="${postID}"></div>
                        </div>
                    </div>
    
                    <div class="col-span-2 flex gap-2 pt-2">
                        <button class="darkBtn flex-1" onclick="saveWorkout('${workout._id["$oid"]}', '${userID}')">Save</button>
                        <button class="darkBtn flex-1" onclick="loadWorkout('${workout._id["$oid"]}')">Load</button>
                        <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportWorkout" data-modal-toggle="default-reportWorkout" onclick="window.selectedWorkoutID = '${workout._id['$oid']}'">Report</button>
                    </div>
                </div>
            </td>`;
            createWorkoutDiagram(antID, postID, workout.exercises);
        });
        initFlowbite();
    }
}

// search shared schedules using name
async function searchSchedules(userID){

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
    
        console.log("Schedulefound! name: " + schedule.name)

        antID = 'musclesWorkedAnterior' + schedule._id["$oid"];
        postID = 'musclesWorkedPosterior' + schedule._id["$oid"];
    
        scheduleSearchTable.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${schedule.name}</h3>
                    <p>${schedule.description}</p>
                    <p>By ${schedule.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="loadSchedule('${schedule._id["$oid"]}')">Load</button>
                    <button class="darkBtn flex-1" onclick="saveSchedule('${schedule._id["$oid"]}', '${userID}')">Save</button>
                    <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportSchedule" data-modal-toggle="default-reportSchedule" onclick="window.selectedScheduleID = '${schedule._id['$oid']}'">Report</button>
                </div>
            </div>
        </td>`;

        let newScheduleExercises = [];

        Object.keys(schedule.days).forEach(day => {
            schedule.days[day].exercises.forEach(exercise =>{
                newScheduleExercises.push(exercise)
            })
        });

        createWorkoutDiagram(antID, postID, newScheduleExercises);
        });
    }

    initFlowbite();
}

async function getSavedWorkouts(userID){
    document.getElementById("savedTitle").innerHTML = "Saved Workouts";
    let workouts = await getString(apiString='/api/savedworkouts/userID/',infoString=userID);

    document.getElementById("noneFound").innerHTML = "No Workouts Saved...";

    let table = document.getElementById("savedItemsTable");
    
    table.innerHTML = ``;
    
    workouts.forEach(async workoutSearch => {

        document.getElementById("noneFound").innerHTML = "";
    
        let workout = await getString('/api/sharedworkouts/',workoutSearch.workoutID["$oid"])
    
        console.log("Workout found! name: " + workout.name)
    
        antID = 'musclesWorkedAnterior' + workout._id["$oid"];
        postID = 'musclesWorkedPosterior' + workout._id["$oid"];
    
        table.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${workout.name}</h3>
                    <p>${workout.description}</p>
                    <p>By ${workout.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="loadWorkout('${workout._id["$oid"]}')">Load</button>
                    <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportWorkout" data-modal-toggle="default-reportWorkout" onclick="window.selectedWorkoutID = '${workout._id['$oid']}'">Report</button>
                </div>
            </div>
        </td>`;

        createWorkoutDiagram(antID, postID, workout.exercises);
    });

    initFlowbite();

}

async function getSavedSchedules(userID){
    document.getElementById("savedTitle").innerHTML = "Saved Schedules";

    let schedules = await getString(apiString='/api/savedschedules/userID/',infoString=userID);

    document.getElementById("noneFound").innerHTML = "No Schedules Saved...";

    let table = document.getElementById("savedItemsTable");
    
    table.innerHTML = ``;
    
    schedules.forEach(async scheduleSearch => {

        document.getElementById("noneFound").innerText = "";
    
        let schedule = await getString('/api/sharedschedules/',scheduleSearch.scheduleID["$oid"])
    
        console.log("Schedule found! name: " + schedule.name)


        antID = 'musclesWorkedAnterior' + schedule._id["$oid"];
        postID = 'musclesWorkedPosterior' + schedule._id["$oid"];
    
    
        table.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${schedule.name}</h3>
                    <p>${schedule.description}</p>
                    <p>By ${schedule.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="loadSchedule('${schedule._id["$oid"]}')">Load</button>
                    <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportSchedule" data-modal-toggle="default-reportSchedule" onclick="window.selectedScheduleID = '${schedule._id['$oid']}'">Report</button>
                </div>
            </div>
        </td>`;

        let newScheduleExercises = [];

        Object.keys(schedule.days).forEach(day => {
            schedule.days[day].exercises.forEach(exercise =>{
                newScheduleExercises.push(exercise)
            })
        });

        createWorkoutDiagram(antID, postID, newScheduleExercises);

    });

    initFlowbite();

}

async function getSharedSchedules(username, userID){

    let schedules = await getString(apiString='/api/sharedschedules/authorUsername/',infoString=username);

    document.getElementById("noneFoundSchedules").innerText = "No Schedules Posted...";

    let table = document.getElementById("sharedSchedulesTable");
    
    table.innerHTML = ``;
    
    schedules.forEach(async schedule => {

        document.getElementById("noneFoundSchedules").innerText = "";
    
        console.log("Schedulefound! name: " + schedule.name)

        antID = 'musclesWorkedAnterior' + schedule._id["$oid"];
        postID = 'musclesWorkedPosterior' + schedule._id["$oid"];
    
        table.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${schedule.name}</h3>
                    <p>${schedule.description}</p>
                    <p>By ${schedule.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="saveSchedule('${schedule._id["$oid"]}', '${userID}')">Save</button>
                    <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportSchedule" data-modal-toggle="default-reportSchedule" onclick="window.selectedScheduleID = '${schedule._id['$oid']}'">Report</button>
                </div>
            </div>
        </td>`;

        let newScheduleExercises = [];

        Object.keys(schedule.days).forEach(day => {
            schedule.days[day].exercises.forEach(exercise =>{
                newScheduleExercises.push(exercise)
            })
        });

        createWorkoutDiagram(antID, postID, newScheduleExercises);

    });

    initFlowbite();
}


async function getSharedWorkouts(username, userID){

    let workouts = await getString(apiString='/api/sharedworkouts/authorUsername/',infoString=username);

    document.getElementById("noneFoundWorkouts").innerText = "No Workouts Posted...";

    let table = document.getElementById("sharedWorkoutsTable");
    
    table.innerHTML = ``;
    
    workouts.forEach(async workout => {

        document.getElementById("noneFoundWorkouts").innerText = "";
    
        console.log("Workout found! name: " + workout.name)

        antID = 'musclesWorkedAnterior' + workout._id["$oid"];
        postID = 'musclesWorkedPosterior' + workout._id["$oid"];
    
        table.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${workout.name}</h3>
                    <p>${workout.description}</p>
                    <p>By ${workout.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="saveWorkout('${workout._id["$oid"]}', '${userID}')">Save</button>
                    <button class="baseBtn flex-1 bg-redTwo" data-modal-target="default-reportWorkout" data-modal-toggle="default-reportWorkout" onclick="window.selectedWorkoutID = '${workout._id['$oid']}'">Report</button>
                </div>
            </div>
        </td>`;
        createWorkoutDiagram(antID, postID, workout.exercises);

    });

    initFlowbite();
}


async function getCompletedWorkouts(userID){

    let workouts = await getString(apiString='/api/completedWorkouts/userID/',infoString=userID);

    document.getElementById("noneFoundWorkouts").innerText = "No Workouts Posted...";

    let table = document.getElementById("completedWorkoutsTable");
    
    table.innerHTML = ``;
    
    workouts.forEach(async workout => {

        document.getElementById("noneFoundWorkouts").innerText = "";
    
        console.log("Workout found! name: " + workout.name)

        antID = 'musclesWorkedAnterior' + workout._id["$oid"];
        postID = 'musclesWorkedPosterior' + workout._id["$oid"];
    
        table.insertRow(-1).innerHTML = `
        <td>
            <div class="dayCard grid grid-cols-2 gap-4 p-4">
                <div class="col-span-1">
                    <h3>${workout.name}</h3>
                    <p>${workout.description}</p>
                    <p>By ${workout.authorUsername}</p>
                </div>

                <div class="col-span-1">
                    <div class="grid grid-cols-2">
                        <div id="${antID}"></div>
                        <div id="${postID}"></div>
                    </div>
                </div>

                <div class="col-span-2 flex gap-2 pt-2">
                    <button class="darkBtn flex-1" onclick="showCompletedDetails('${workout._id["$oid"]}')">Save</button>
                </div>
            </div>
        </td>`;
        createWorkoutDiagram(antID, postID, workout.exercises);

    });

    initFlowbite();
}

async function saveWorkout(workoutID, UID){
    await postString(apiString='/api/savedworkouts/', infoString=workoutID, bodyInfo={"userID": UID})
}

async function saveSchedule(scheduleID, UID){
    await postString(apiString='/api/savedschedules/', infoString=scheduleID, bodyInfo={"userID": UID})
}

// Create a debounced version of the search function
const debouncedSearchSchedule = debounce(searchSchedules, 350);
const debouncedSearchWorkout = debounce(searchWorkouts, 350);
const debouncedSearchByUsername = debounce(searchByUsername, 350);