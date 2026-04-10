async function deleteWorkout(workoutID){
    console.log(workoutID)
    await deleteString('/api/sharedworkouts/' + workoutID);
}

async function deleteSchedule(scheduleID){
    console.log(scheduleID)
    await deleteString('/api/sharedschedules/' + scheduleID);
}

async function deleteUser(userID){
    console.log(userID)
    await deleteString('/api/users/userID/' + userID);
}