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

    var workoutSearchTable = document.getElementById("workoutSearchTable");

    let workoutSearch = document.getElementById("searchWorkout").value;

    workoutSearchTable.innerHTML = `
    <tr>
        <th>Workouts!</th>
    </tr>
`;

    const responseUser = await fetch('/api/sharedworkouts/workoutName/' + workoutSearch, {
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
            <a>${workout.name}</a>
        </td>
    `;
    });
}

// search shared schedules using name
async function searchSchedules(){

    var scheduleSearchTable = document.getElementById("scheduleSearchTable");

    let scheduleSearch = document.getElementById("searchSchedule").value;

    scheduleSearchTable.innerHTML = `
    <tr>
        <th>Schedules!</th>
    </tr>
`;

    const response = await fetch('/api/sharedschedules/scheduleName/' + scheduleSearch, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const dataSchedule = await response.json();
    console.log("schedulesFound", dataSchedule);

    dataSchedule.forEach(schedule => {
        scheduleSearchTable.insertRow(-1).innerHTML = `
        <td>
            <a>${schedule.name}</a>
        </td>
    `;
    });
}

// Create a debounced version of the search function
const debouncedSearchSchedule = debounce(searchSchedules, 350);
const debouncedSearchWorkout = debounce(searchWorkouts, 350);
const debouncedSearchByUsername = debounce(searchByUsername, 350);