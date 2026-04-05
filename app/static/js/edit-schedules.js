const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// load day cards for schedule onto page
function loadSchedulePage(){
    Object.keys(currentSchedule.days).forEach((key, index) => {
        const day = currentSchedule.days[key];
        container.appendChild(createDayCardEdit(day, daysOfTheWeek[index]));
        console.log(day);
    });
}

// create day card for schedule
function createDayCardEdit(day, dayOfWeek) {
    const button = document.createElement("div");

    button.innerHTML = `
        <button class="baseBtn col-span-1" onclick="selectDayEdit('${dayOfWeek}')">
            <img src="./images/logoSmall">
            <h3>${dayOfWeek}</h3>
            <p>${day.name}</p>
        </button>
    `;

    return button;
}

// select a day and display information to page for editing
function selectDayEdit(day) {

    currentDay = day;

    document.getElementById("workoutName").innerHTML = currentSchedule.days[day].name;
    document.getElementById("workoutDescription").innerHTML = currentSchedule.days[day].description;

    console.log(currentSchedule.days[day].description, day);

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

    if (currentSchedule.days[day].exercises[0] == undefined){
        exerciseTable.insertRow(-1).innerHTML = `
            <td colspan="6">Rest Day!</td>
        `;
    }
    else{
        for (let i = 0; i < currentSchedule.days[day].exercises.length; i++) {
            exerciseTable.insertRow(-1).innerHTML = `
                <td>${currentSchedule.days[day].exercises[i].name}</td>
                <td id="sets-${i}">${currentSchedule.days[day].exercises[i].sets}</td>
                <td id="reps-${i}">${currentSchedule.days[day].exercises[i].reps}</td>
                <td id="weight-${i}">${currentSchedule.days[day].exercises[i].weight}</td>
                <td><button class="baseBtn bg-yellow-200" id="editBtn-${i}" onclick="editExerciseDetails('${currentSchedule.days[day].exercises[i].searchID}', ${i})">Edit</button></td>
                <td><button class="baseBtn bg-red-300" onclick="removeExerciseFromDay('${currentSchedule.days[day].exercises[i].searchID}'); selectDayEdit(currentDay)">Remove</button></td>
            `;
        }
    }

}

// edit and save workout name/description
function editWorkoutDetails() {
    const editBtn = document.getElementById("editWorkoutStringsBtn");
    const nameEl = document.getElementById("workoutName");
    const descEl = document.getElementById("workoutDescription");

    if (editBtn.innerText === "Save") {
        currentSchedule.days[currentDay].name = document.getElementById("nameInput").value || currentSchedule.days[currentDay].name;
        currentSchedule.days[currentDay].description = document.getElementById("descInput").value || currentSchedule.days[currentDay].description;

        nameEl.innerHTML = currentSchedule.days[currentDay].name;
        descEl.innerHTML = currentSchedule.days[currentDay].description;

        editBtn.innerText = "Edit Workout Name/Description";
    } else {
        nameEl.innerHTML = `<input type="text" id="nameInput" value="${currentSchedule.days[currentDay].name}" style="width:200px">`;
        descEl.innerHTML = `<input type="text" id="descInput" value="${currentSchedule.days[currentDay].description}" style="width:200px">`;

        editBtn.innerText = "Save";
    }
}

// edit and save schedule name/description
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

// edit and save exercise information (sets,reps,weight)
function editExerciseDetails(searchID, rowIndex) {
    const exercise = currentSchedule.days[currentDay].exercises.find(ex => ex.searchID === searchID);
    if (!exercise) return;

    const editBtn = document.getElementById(`editBtn-${rowIndex}`);

    if (editBtn.innerText === "Save") {
        exercise.sets = parseInt(document.getElementById(`sets-${rowIndex}`).querySelector("input").value);
        exercise.reps = parseInt(document.getElementById(`reps-${rowIndex}`).querySelector("input").value);
        exercise.weight = parseFloat(document.getElementById(`weight-${rowIndex}`).querySelector("input").value);

        document.getElementById(`sets-${rowIndex}`).innerHTML = exercise.sets;
        document.getElementById(`reps-${rowIndex}`).innerHTML = exercise.reps;
        document.getElementById(`weight-${rowIndex}`).innerHTML = exercise.weight;

        editBtn.innerText = "Edit";
    } else {
        document.getElementById(`sets-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.sets}"   min="0" style="width:60px">`;
        document.getElementById(`reps-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.reps}"   min="0" style="width:60px">`;
        document.getElementById(`weight-${rowIndex}`).innerHTML = `<input type="number" value="${exercise.weight}" min="0" style="width:60px">`;

        editBtn.innerText = "Save";
    }
}

// remove exercise from a day
function removeExerciseFromDay(searchID){

    console.log(currentDay);
    console.log(searchID);

    const index = currentSchedule.days[currentDay].exercises.findIndex(ex => ex.searchID === searchID);

    if (index > -1) {
        currentSchedule.days[currentDay].exercises.splice(index, 1);
    }

    console.log(currentSchedule.days[currentDay].exercises);

    selectDayEdit(currentDay)
}

// search for exercises inside external API and add to table of results
// needs updated to display by page!
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

// get exercises from external API using a string
// return as array of json
async function getExercisesBySearchString(search){
    try {
        const response = await fetch('https://oss.exercisedb.dev/api/v1/exercises/search?offset=0&limit=5&q=' + search + '&threshold=0.3', {
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

// get exercises from external API using an ID
// return as array of json
async function getExercisesBySearchID(searchID){
    try {
        const response = await fetch('https://oss.exercisedb.dev/api/v1/exercises/' + searchID, {
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

// Add exercise to table with add and details button
// Add button adds to the selected day
// details button shows gif and images of workout with instructions
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

// shows gif and images of workout with instructions
async function viewExerciseDetails(exerciseId){
    console.log("Viewing details for exercise ID: " + exerciseId);
    
    searchResults = await getExercisesBySearchID(exerciseId);
    console.log("Exercise details fetched: ", searchResults.data);

}

// add exercise to day
async function addExerciseToDay(exerciseId){
    console.log("Adding exercise ID: " + exerciseId + " to the current day.");

    searchResults = await getExercisesBySearchID(exerciseId);
    console.log("Exercise details fetched: ", searchResults.data);

    currentSchedule.days[currentDay].exercises.push(formatExercise(searchResults.data));

    selectDayEdit(currentDay);
}

// turns result data into correct format
function formatExercise(exercise){
    return {
        name: exercise.name,
        searchID: exercise.exerciseId,
        sets: 3,
        reps: 10,
        weight: 0
    }
}

// save all changes made to schedule and days by updating Databases
// if using a default schedule new schedule is created
// if not using default schedule current schedule updated
// uses custom backend API
async function saveChanges(schedule, oldSchedule, UID){

    // add check that a workout has been updated without the id changing so we know to update schedule

    console.log("Schedule: " + schedule);

    console.log("oldSchedule: " + oldSchedule);

    console.log("UID: " + UID);

    await updateSchedule(schedule, oldSchedule, UID);

    window.location.reload();
}

async function updateSchedule(schedule, ogSchedule, UID){
    // day check

    newDays = JSON.stringify(schedule.days);
    oldDays = JSON.stringify(ogSchedule.days);

    console.log(newDays);
    console.log(oldDays);

    console.log(JSON.stringify(schedule))
    console.log(JSON.stringify(ogSchedule))

    if (schedule._id === ogSchedule._id && schedule.name === ogSchedule.name && schedule.description === ogSchedule.description && newDays === oldDays){ // check if changes have been made
        console.log("No Changes made to schedule")
    }
    else if (schedule._id === "69c44bc4735131196e47244d"){ // check if it is using default schedule ID
        if (schedule.name !== ogSchedule.name || schedule.description !== ogSchedule.description || newDays !== oldDays){ // check if changes have been made
            // Create new schedule with changes and update users current schedule to new id
            console.log("Inserting Schedule: " + schedule)
            data = postString(apiString='api/schedules', infoString=undefined, bodyInfo=schedule)

            // Update users current Schedule to new schedule!
            console.log("Attempting ot update users schedule UserID: " + UID + " ScheduleID: " + data._id)
            await putString(apiString='api/users/', searchString=UID, body={"currentScheduleID": data._id});
            
        }
    }
    else{ 
        // update schedule
        console.log("Updating Schedule! " + schedule._id)
        await putString(apiString='api/schedules/', searchString=schedule._id, body={schedule});
    }
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