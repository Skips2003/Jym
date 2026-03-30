const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysOfTheWeekID = ["mondayID", "tuesdayID", "wednesdayID", "thursdayID", "fridayID", "saturdayID", "sundayID"];

function loadSchedulePage(){
    workouts.forEach(day => {;
        container.appendChild(createDayCardEdit(day, daysOfTheWeek[dayCount], dayCount));
        console.log(day);
        dayCount++;
    });
    
}

function createDayCardEdit(day, dayOfWeek, dayIndex) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" onclick="selectDayEdit(${dayIndex})">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

function selectDayEdit(day) {

    currentDay = day;

    document.getElementById("workoutName").innerHTML = workouts[day].name;
    document.getElementById("workoutDescription").innerHTML = workouts[day].description;
    document.getElementById("editWorkoutStringsBtn").innerText = "Edit Workout Name/Description";

    console.log(workouts[day].description, daysOfTheWeek[day]);

    var exerciseTable = document.getElementById("exerciseTable");

    exerciseTable.innerHTML = `
        <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Edit</th>
            <th>Remove</th>
        </tr>
    `;

    if (workouts[day].exercises == undefined){
        exerciseTable.insertRow(-1).innerHTML = `
            <td colspan="6">Rest Day!</td>
        `;
    }
    else{
        for (let i = 0; i < workouts[day].exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${workouts[day].exercises[i].name}</td>
                <td id="sets-${i}">${workouts[day].exercises[i].sets}</td>
                <td id="reps-${i}">${workouts[day].exercises[i].reps}</td>
                <td id="weight-${i}">${workouts[day].exercises[i].weight}</td>
                <td><button class="baseBtn bg-yellow-200" id="editBtn-${i}" onclick="editExerciseDetails('${workouts[day].exercises[i].searchID}', ${i})">Edit</button></td>
                <td><button class="baseBtn bg-red-300" onclick="removeExerciseFromDay('${workouts[day].exercises[i].searchID}'); selectDayEdit(currentDay)">Remove</button></td>
            `;
        }
    }

}

function editWorkoutDetails() {
    const editBtn = document.getElementById("editWorkoutStringsBtn");
    const nameEl = document.getElementById("workoutName");
    const descEl = document.getElementById("workoutDescription");

    if (editBtn.innerText === "Save") {
        workouts[currentDay].name = document.getElementById("nameInput").value || workouts[currentDay].name;
        workouts[currentDay].description = document.getElementById("descInput").value || workouts[currentDay].description;

        nameEl.innerHTML = workouts[currentDay].name;
        descEl.innerHTML = workouts[currentDay].description;

        editBtn.innerText = "Edit Workout Name/Description";
    } else {
        nameEl.innerHTML = `<input type="text" id="nameInput" value="${workouts[currentDay].name}" style="width:200px">`;
        descEl.innerHTML = `<input type="text" id="descInput" value="${workouts[currentDay].description}" style="width:200px">`;

        editBtn.innerText = "Save";
    }
}

function editScheduleDetails() {
    const editBtn = document.getElementById("editScheduleStringsBtn");
    const nameEl = document.getElementById("scheduleName");
    const descEl = document.getElementById("scheduleDescription");

    if (editBtn.innerText === "Save") {
        currentSchedule.name = document.getElementById("nameInput").value || currentSchedule.name;
        currentSchedule.description = document.getElementById("descInput").value || currentSchedule.description;

        nameEl.innerHTML = currentSchedule.name;
        descEl.innerHTML = currentSchedule.description;

        editBtn.innerText = "Edit Workout Name/Description";
    } else {
        nameEl.innerHTML = `<input type="text" id="nameInput" value="${currentSchedule.name}" style="width:200px">`;
        descEl.innerHTML = `<input type="text" id="descInput" value="${currentSchedule.description}" style="width:200px">`;

        editBtn.innerText = "Save";
    }
}


function editExerciseDetails(searchID, rowIndex) {
    const exercise = workouts[currentDay].exercises.find(ex => ex.searchID === searchID);
    if (!exercise) return;

    const editBtn = document.getElementById(`editBtn-${rowIndex}`);

    // Check if already in edit mode
    if (editBtn.innerText === "Save") {
        // Save the new values back into workouts
        exercise.sets = parseInt(document.getElementById(`sets-${rowIndex}`).querySelector("input").value);
        exercise.reps = parseInt(document.getElementById(`reps-${rowIndex}`).querySelector("input").value);
        exercise.weight = parseFloat(document.getElementById(`weight-${rowIndex}`).querySelector("input").value);

        // Switch back to plain text
        document.getElementById(`sets-${rowIndex}`).innerHTML = exercise.sets;
        document.getElementById(`reps-${rowIndex}`).innerHTML = exercise.reps;
        document.getElementById(`weight-${rowIndex}`).innerHTML = exercise.weight;

        editBtn.innerText = "Edit";
    } else {
        // Switch to edit mode — replace cells with inputs
        document.getElementById(`sets-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.sets}"   min="0" style="width:60px">`;
        document.getElementById(`reps-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.reps}"   min="0" style="width:60px">`;
        document.getElementById(`weight-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.weight}" min="0" style="width:60px">`;

        editBtn.innerText = "Save";
    }
}

function removeExerciseFromDay(searchID){

    console.log(currentDay);
    console.log(searchID);

    const index = workouts[currentDay].exercises.findIndex(ex => ex.searchID === searchID);

    if (index > -1) {
        workouts[currentDay].exercises.splice(index, 1);
    }

    console.log(workouts[currentDay].exercises);

    selectDayEdit(currentDay)
}

async function searchExercises() {
    const searchInput = document.getElementById("exerciseSearchInput").value;

    console.log("Searching for exercises with query: " + searchInput);

    const exercises = await getExercisesBySearchString(searchInput);

    console.log(exercises)

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
    
    if (exercises.data == undefined){
        exerciseSearchTable.insertRow(-1).innerHTML = `
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

    selectDayEdit(currentDay);
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

async function saveChanges(workouts, schedule, oldWorkouts, oldSchedule, UID){

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
        newSchedule = updateScheduleDays(newWorkoutIDs, newSchedule)
    }

    console.log(JSON.stringify(newSchedule.days));

    await updateSchedule(newSchedule, oldSchedule, UID);

    window.location.reload();
}

async function updateWorkouts(workouts, oldWorkouts){

    console.log("New Workouts: " + workouts);
    console.log("Old Workouts: " + oldWorkouts);

    var workoutIDs = [];

    var check = [];

    check = [workoutIDs, false];

    let newExercises = undefined;
    let oldExercises = undefined;

    for (let i = 0; i < workouts.length; i++){

        // Stringify arrays as arrays cannot be compared in JS

        newExercises = JSON.stringify(workouts[i].exercises);
        oldExercises = JSON.stringify(oldWorkouts[i].exercises);

        // check if any changes have been made

        if (workouts[i]._id === oldWorkouts[i]._id && workouts[i].name === oldWorkouts[i].name && workouts[i].description === oldWorkouts[i].description && newExercises === oldExercises){
            console.log("No changes made to " + daysOfTheWeek[i] + ": " + workouts[i]._id );
            workoutIDs.push(workouts[i]._id);
        }
        else if (workouts[i]._id === "69c44e2b735131196e472458"){ // check if it is using default workout ID

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
            
            console.log("No changes made to " + daysOfTheWeek[i] + ": " + workouts[i]._id );
            const response = await fetch('api/workouts/' + workouts[i]._id, {
                method: 'PUT',
                headers:{ 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.getElementById("csrf-token").content
                },
                body: JSON.stringify(workouts[i])
            });

            const data = await response.json();
            console.log("Workout updated:", data);
            workoutIDs.push(workouts[i]._id);

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

    if (schedule._id === ogSchedule._id && schedule.name === ogSchedule.name && schedule.description === ogSchedule.description && newDays === oldDays){ // check if changes have been made
        console.log("No Changes made to schedule")
    }
    else if (schedule._id === "69c44bc4735131196e47244d"){ // check if it is using default schedule ID
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
        const response = await fetch('api/schedules/' + schedule._id, {
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