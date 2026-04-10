# StrengthTrackerWeb
A website for creating, sharing and tracking a strength training schedule!

pip install -r requirements.txt

if changes made to to diagram.ts use this command to compile it into JS:

    npx esbuild app/static/js/musclesWorked/diagram.ts --bundle --outfile=app/static/js/musclesWorked/diagram.bundle.js

the free version of the exercisesDB we are using is currently down but should be fixed soon, if not we can just use a different one

NEED DONE TODAY!!!:

1. Change all instances of strengthTracker to Jym
2. Admin panel for reviewing schedules, profiles etc
3. add completing a workout (with check to ensure it was completed on the right day)
4. view recently completed workouts
5. page for managing your own shared schedules/workouts also give option to reset to default schedule or set day to rest day, also don't allow users to share schedules/workouts that do not contain exercises!
6. Unit Testing
7. Video Demonstration
8. Documentation

Optional Tasks:

1. Change PBs/Ask user to add if none have been entered
2. search page
3. clean up backend APIs
4. clean up JS
5. Profile Pictures
6. sanitise user inputs - shoudl mostly be ok since the databases are hosted on MongoAtlas and Supabase
7. Host Website?

Current Bugs:
    Search in Nav not working after used once?
    Save Workout on profile current Schedule not working
    Make account private broken