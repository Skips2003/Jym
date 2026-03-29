const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysOfTheWeekID = ["mondayID", "tuesdayID", "wednesdayID", "thursdayID", "fridayID", "saturdayID", "sundayID"];

function selectDay(day) {

    console.log(workouts[day].description, daysOfTheWeek[day]);

    document.getElementById('workoutName').textContent = `${workouts[day].name}`;

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
        exerciseTable.insertRow(1).innerHTML = `
            <td colspan="4">No exercises for this day.</td>
        `;
    }
    else{
        for (let i = 0; i < workouts[day].exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${workouts[day].exercises[i].name}</td>
                <td>${workouts[day].exercises[i].sets}</td>
                <td>${workouts[day].exercises[i].reps}</td>
                <td>${workouts[day].exercises[i].weight}</td>
            `;
        }
    }

    currentDay = day;

}

function loadPage(){
    workouts.forEach(day => {;
        container.appendChild(createDayCard(day, daysOfTheWeek[dayCount], dayCount));
        console.log(day);
        dayCount++;
    });
}

function createDayCard(day, dayOfWeek, dayIndex) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" onclick="selectDay(${dayIndex})">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

async function searchExercises() {
    const searchInput = document.getElementById("exerciseSearchInput").value;

    console.log("Searching for exercises with query: " + searchInput);

    const exercises = await getExercisesBySearchString(searchInput);

    console.log("Exercises found: ", exercises.data);

    const exerciseSearchTable = document.getElementById("exerciseSearchTable");

    exerciseSearchTable.innerHTML = ``;

    exerciseSearchTable.innerHTML = `
        <tr>
            <th>Exercise</th>
            <th>Target Muscles</th>
            <th>Secondary Muscles</th>
            <th>Equipments</th>
            <th>Details</th>
            <th>Add to Day</th>
        </tr>
    `;
    
    if (exercises.length == 0){
        exerciseSearchTable.insertRow(1).innerHTML = `
            <td colspan="6">No exercises found.</td>
        `;
    }
    else{
        exercises.data.forEach(exercise => {
            addExerciseToSearchTable(exercise);
        });
    }
}

async function getExercisesBySearchString(search){
    try {
        const response = await fetch('https://exercisedb.dev/api/v1/exercises/search?offset=0&limit=5&q=' + search + '&threshold=0.3', {
            headers: { Accept: 'application/json' }
        });
        const data = await response.json();
        console.log("Exercises fetched:", data);
        return data; // This now returns to the searchExercises function
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }

}

async function getExercisesBySearchID(searchID){
    try {
        const response = await fetch('https://exercisedb.dev/api/v1/exercises/' + searchID, {
            headers: { Accept: 'application/json' }
        });
        const data = await response.json();
        console.log("Exercise fetched:", data);
        return data; // This now returns to the searchExercises function
    } catch (error) {
        console.error('Error fetching exercise:', error);
        return null;
    }
}

function addExerciseToSearchTable(exercise){

    var exerciseSearchTable = document.getElementById("exerciseSearchTable");

    // Use -1 to append the row to the end of the table
    let row = exerciseSearchTable.insertRow(-1); 
    
    row.innerHTML = `
        <td>${exercise.name}</td>
        <td>${exercise.targetMuscles}</td>
        <td>${exercise.secondaryMuscles}</td>
        <td>${exercise.equipments}</td>
        <td><button class="baseBtn" onclick="viewExerciseDetails('${exercise.exerciseId}')">Details</button></td>
        <td><button class="baseBtn" onclick="addExerciseToDay('${exercise.exerciseId}')">Add</button></td>
    `;
}

async function viewExerciseDetails(exerciseId){
    console.log("Viewing details for exercise ID: " + exerciseId);
    
    searchResults = await getExercisesBySearchID(exerciseId);
    console.log("Exercise details fetched: ", searchResults.data);

}

async function addExerciseToDay(exerciseId){
    console.log("Adding exercise ID: " + exerciseId + " to the current day.");

    searchResults = await getExercisesBySearchID(exerciseId);
    console.log("Exercise details fetched: ", searchResults.data);

    workouts[currentDay].exercises.push(formatExercise(searchResults.data));

    selectDay(currentDay);
}

function formatExercise(exercise){
    return {
        name: exercise.name,
        searchID: exercise.exerciseId,
        sets: 3,
        reps: 10,
        weight: 0
    }
}

async function saveChanges(workouts, schedule, oldWorkouts, UID){

    // add check that a workout has been updated without the id changing so we know to update schedule

    console.log("Workouts: " + workouts[0].exercises);

    console.log("Schedule: " + schedule);

    console.log("oldWorkouts: " + oldWorkouts[0].exercises);

    console.log("UID: " + UID);

    var temp = await updateWorkouts(workouts, oldWorkouts);

    var newWorkoutIDs = temp[0]

    var workoutChanges = temp[1]

    let newSchedule = structuredClone(schedule);

    if (workoutChanges == true){ // true means atleast one workoutID has been changed
        newSchedule = updateScheduleDays(newWorkoutIDs, schedule)
    }

    console.log(JSON.stringify(newSchedule.days));

    await updateSchedule(newSchedule, schedule, UID);

    //window.location.reload();
}

async function updateWorkouts(workouts, oldWorkouts){

    console.log("Workouts: " + workouts[0]._id['$oid'])

    var workoutIDs = [];

    var check = [];

    check = [workoutIDs, false];

    let newExercises = undefined;
    let oldExercises = undefined;

    for (let i = 0; i < workouts.length; i++){
        // array comparisons
        newExercises = JSON.stringify(workouts[i].exercises);
        oldExercises = JSON.stringify(oldWorkouts[i].exercises);
        // check if any changes have been made
        console.log("ID " + workouts[i]._id['$oid'] + " " + oldWorkouts[i]._id['$oid'] + " name " + workouts[i].name + " " + oldWorkouts[i].name + " desc " + workouts[i].description + " " + oldWorkouts[i].description + " exercises " + newExercises + " " + oldExercises)
        if (workouts[i]._id['$oid'] === oldWorkouts[i]._id['$oid'] && workouts[i].name === oldWorkouts[i].name && workouts[i].description === oldWorkouts[i].description && newExercises === oldExercises){
            console.log("No changes made to " + daysOfTheWeek[i] + ": " + workouts[i]._id['$oid'] );
            workoutIDs.push(workouts[i]._id['$oid']);
        }
        else if (workouts[i]._id['$oid'] === "69c44e2b735131196e472458"){ // check if it is using default workout ID
                if (workouts[i].name != "Rest Day" || workouts[i].description != "Day of Rest!"){ // check if any changes have been made
                    console.log("changes made to default workout " + daysOfTheWeek[i] + ": Creating new workout" );
                    // if changes have been made create insert new workout object with updated fields and return new object _id
                    const response = await fetch('api/workouts', {
                        method: 'POST',
                        headers:{ 
                            'Content-Type': 'application/json',
                            'X-CSRFToken': document.getElementById("csrf-token").content
                        },
                        body: JSON.stringify(workouts[i])
                    });

                    const data = await response.json();
                    console.log(data);
                    console.log("New workout created it has oid: " + data._id);
                    workoutIDs.push(data._id);

                    // mark a workout ID has been changed and needs updated
                    check[1] = true;
                }
        }
        else{// if changes have been made but has non default id just update workout object
            console.log("No changes made to " + daysOfTheWeek[i] + ": " + workouts[i]._id['$oid'] );
            const response = await fetch('api/workouts/' + workouts[i]._id['$oid'], {
                method: 'PUT',
                headers:{ 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.getElementById("csrf-token").content
                },
                body: JSON.stringify(workouts[i])
            });

            const data = await response.json();
            console.log("Workout updated:", data);
            workoutIDs.push(workouts[i]._id['$oid']);

            // no need to update check[1] as no IDs have changed
        }
    }

    return check;
}

// updates any changed workout IDs to their new value, requires list of IDs and a schedule
function updateScheduleDays(workoutIDs, schedule){

    let counter = 0;
    let newSchedule = structuredClone(schedule)

    workoutIDs.forEach(newID => {;
        // Access the $oid of the existing schedule day to compare strings to strings
        let currentDayID = schedule.days[daysOfTheWeekID[counter]];

        if (currentDayID !== newID) { 
            console.log("changing: " + daysOfTheWeekID[counter] + " To: " + newID);
            // Store it back as the format MongoDB expects if you're sending the whole object back
            newSchedule.days[daysOfTheWeekID[counter]] = newID ;
        } else {
            console.log(daysOfTheWeekID[counter] + " Already equals: " + newID);
        }
        counter++;
    });

    return newSchedule
}

async function updateSchedule(schedule, ogSchedule, UID){
    // day check

    newDays = JSON.stringify(schedule.days);
    oldDays = JSON.stringify(ogSchedule.days);

    if (schedule._id['$oid'] === ogSchedule._id['$oid'] && schedule.name === ogSchedule.name && schedule.description === ogSchedule.description && newDays === oldDays){ // check if changes have been made
        console.log("No Changes made to schedule")
    }
    else if (schedule._id['$oid'] === "69c44bc4735131196e47244d"){ // check if it is using default schedule ID
        if (schedule.name !== ogSchedule.name || schedule.description !== ogSchedule.description || newDays !== oldDays){ // check if changes have been made
            // Create new schedule with changes and update users current schedule to new id
            // update schedule
            const response = await fetch('api/schedules', {
                method: 'POST',
                headers:{ 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.getElementById("csrf-token").content
                },
                body: JSON.stringify({schedule})
            });

            const data = await response.json();
            console.log("Schedule updated:", data);

            // Update users current Schedule to new schedule!
            console.log(data._id)

            const responseUser = await fetch('api/users/' + UID, {
                method: 'PUT',
                headers:{ 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.getElementById("csrf-token").content
                },
                body: JSON.stringify({"currentScheduleID": data._id})
            });

            const dataUser = await responseUser.json();
            console.log("Schedule updated:", dataUser);
            
        }
    }
    else{ 
        // update schedule
        const response = await fetch('api/schedules/' + schedule._id['$oid'], {
            method: 'PUT',
            headers:{ 
                'Content-Type': 'application/json',
                'X-CSRFToken': document.getElementById("csrf-token").content
            },
            body: JSON.stringify({schedule})
        });

        const data = await response.json();
        console.log("Schedule updated:", data);
    }
}