async function shareSchedule(schedule, username, private, UID){
    let sharingSchedule = {
        "name": schedule.name,
        "description": schedule.description,
        "days": schedule.days,
        "authorUsername": username,
        "private": private
    };

    console.log("Sharing Schedule: " + sharingSchedule)

    data =  await postString(apiString='/api/sharedschedules', infoString=undefined, bodyInfo=sharingSchedule)

    if(private == true){
        await postString(apiString='/api/savedschedules/', infoString=data._id, bodyInfo={"userID": UID})
    }

}

async function shareWorkout(workout, username, private, UID){
    let sharingWorkout = {
        "name": workout.name,
        "description": workout.description,
        "exercises": workout.exercises,
        "authorUsername": username,
        "private": private
    };

    console.log("Sharing workout: " + sharingWorkout)

    data = await postString(apiString='/api/sharedworkouts', infoString=undefined, bodyInfo=sharingWorkout)

    if(private == true){
        await postString(apiString='/api/savedworkouts/', infoString=data._id, bodyInfo={"userID": UID})
    }

}