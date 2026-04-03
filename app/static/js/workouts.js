//IDK if these will be used again for savedWorkouts DB but just gonna save them here for now!

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