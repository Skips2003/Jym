# StrengthTrackerWeb
A website for creating, sharing and tracking a strength training schedule!

pip install -r requirements.txt

if changes made to to diagram.ts use this command to compile it into JS:

    npx esbuild app/static/js/musclesWorked/diagram.ts --bundle --outfile=app/static/js/musclesWorked/diagram.bundle.js

the free version of the exercisesDB we are using is currently down but should be fixed soon, if not we can just use a different one

NEED DONE TODAY!!!:

1. report system (Users, Shared Schedules/Workouts)
2. Admin panel for reviewing schedules, profiles etc
3. add completing a workout (with check to ensure it was completed on the right day)
4. view recently completed workouts
5. Add tags to schedules/workouts for searching
6. Search Page

Current Bugs:
    Search in Nav not working after used once?

Optional for after above is finished:
1. trainer accounts (allow trainers to provide schedules to users and track their progress!)
2. University Researcher accounts with larger access to user data (requires users to permit their data is used)
3. Form checker - Machine Learning check users form for core lifts (Squats, Deadlift, Bench Press, Overhead Press, Rows, Snatch, Clean and Jerk etc.)
