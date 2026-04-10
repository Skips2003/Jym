# StrengthTrackerWeb
A website for creating, sharing and tracking a strength training schedule!

pip install -r requirements.txt

if changes made to to diagram.ts use this command to compile it into JS:

    npx esbuild app/static/js/musclesWorked/diagram.ts --bundle --outfile=app/static/js/musclesWorked/diagram.bundle.js

the free version of the exercisesDB we are using is currently down but should be fixed soon, if not we can just use a different one

NEED DONE TODAY!!!:

1. Admin panel for reviewing schedules, profiles etc
2. add completing a workout (with check to ensure it was completed on the right day)
3. view recently completed workouts
4. Add tags to schedules/workouts for searching
5. Search Page

Current Bugs:
    Search in Nav not working after used once?
    Save Workout on profile current Schedule not working
    Make account private broken