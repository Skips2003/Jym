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

async function AdminSearchUsers(){

    var userSearchTable = document.getElementById("userSearchTableAdmin");

    userSearchTable.innerHTML = `
        <thead>
            <tr>
                <th>Username</th>
                <th>Reports</th>
                <th>Details</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody id="userTableBody"></tbody>
    `;

    let usernameSearch = document.getElementById("searchUsernameAdmin").value;

    if(usernameSearch){
        apiString = 'api/users/username/' + usernameSearch
    }
    else{
        apiString = 'api/users'
    }

    const responseUser = await fetch(apiString, {
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
        <td> <a href="${profileUrlBase}/${user.username}">${user.username}</a> </td>
        <td> <p>${user.reports}</p> </td>
        <td> <button class="baseBtn" onclick="displayReports(${null}, ${null},'${user.id}')">Details</button> </td>
        <td> <button class="darkBtn" onclick="deleteUser('${user.id}')">Delete</button> </td>
    `;
    });
}

async function AdminSearchWorkout(userID){

    let workoutSearch = document.getElementById("searchWorkout").value;

    if (workoutSearch){
        infoString = userID + '/workoutName/' + workoutSearch;
    }
    else{
        infoString = userID;
    }
    
    let workouts = await getString(apiString='/api/sharedworkouts/userID/',infoString=infoString);

    document.getElementById("noneFoundWorkouts").innerText = "No Workouts Posted...";

    let table = document.getElementById("workoutSearchTable");
    
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
                    <button class="darkBtn flex-1" onclick="displayReports(${null},'${workout._id["$oid"]}, ${null}')">View Reports</button>
                    <button class="baseBtn flex-1 bg-redTwo" onclick="deleteWorkout('${workout._id["$oid"]}')">Delete</button>
                </div>
            </div>
        </td>`;
        createWorkoutDiagram(antID, postID, workout.exercises);

    });

    initFlowbite();
}

async function AdminSearchSchedule(userID){

    let scheduleSearch = document.getElementById("searchSchedule").value;

    if (scheduleSearch){
        infoString = userID + '/scheduleName/' + scheduleSearch;
    }
    else{
        infoString = userID;
    }
    
    let schedules = await getString(apiString='/api/sharedschedules/userID/',infoString=infoString);

    document.getElementById("noneFoundSchedules").innerText = "No Schedules Posted...";

    let table = document.getElementById("scheduleSearchTable");
    
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
                    <button class="darkBtn flex-1" onclick="displayReports(scheduleID='${schedule._id["$oid"]}', ${null}, ${null})">View Reports</button>
                    <button class="baseBtn flex-1 bg-redTwo" onclick="deleteSchedule('${schedule._id["$oid"]}')">Delete</button>
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

async function displayReports(scheduleID, workoutID, userID) {

    let reports;

    if (scheduleID){
        reports = await getString(apiString='/api/reports/schedule/', infoString=scheduleID);
    }
     
    if(workoutID){
        reports = await getString(apiString='/api/reports/workout/', infoString=workoutID);
    }

    if(userID){

    reports = await getString(apiString='/api/reports/user/', infoString=userID);
    }

    
    let reportTable= document.getElementById("reportListTable");

    reportTable.innerHTML = `
        <thead>
            <tr>
                <th>Reporter Username</th>
                <th>Reason</th>
            </tr>
        </thead>
        <tbody id="userTableBody"></tbody>
    `;; // Clear old reports

    if (reports.length === 0) {
        reportTable.insertRow(-1).innerHTML = `
            <td> <h1>No Reports Found</1> </td>
        `;
        return;
    }

    // 3. Populate reports into a simple list or table
    reports.forEach(report => {
        reportTable.insertRow(-1).innerHTML = `
        <td> <h3>${report.reporterUsername}</h3> </td>
        <td> <p>${report.reason}</p> </td>
    `;
    });
}

// Create a debounced version of the search function
const debouncedAdminSearchSchedule = debounce(AdminSearchSchedule, 350);
const debouncedAdminSearchWorkout = debounce(AdminSearchWorkout, 350);
const debouncedAdminSearchUsers = debounce(AdminSearchUsers, 350);