# StrengthTrackerWeb
A website for creating, sharing and tracking a strength training schedule!

uses:
pip install flask
pip install flask-wtf
pip install flask-sqlalchemy
pip install flask-migrate
pip install flask-login
pip install flask_bcrypt
pip install flask-pymongo
pip install flask-restful
pip install psycopg2

the free version of the exercisesDB we are using is currently down but should be fixed soon, if not we can just use a different one

TODO:

100% Need completed:

1. add ability for users to update account info (bio, username, firstName, lastName, email, password, public/private, pbs)
2. change shared schedules/workouts search to only display schedules and workouts of users who are public or if private followed by current user
3. create db for users to save own unshared templates of workouts/schedules
4. Unit Testing (Better Documentation in general)
5. add visualisation of muscles worked
6. add functionality to view details button when searching for exercises (display gif, muscles worked and instructions for exercise)
7. actually make the HTML and CSS for the site (shouldn't take long)
8. report system (Users, Shared Schedules/Workouts)
9. Admin panel for reviewing schedules, profiles etc
10. add completing a workout (with check to ensure it was completed on the right day)
11. view recently completed workouts

Optional for after above is finished:
1. trainer accounts (allow trainers to provide schedules to users and track their progress!)
2. University Researcher accounts with larger access to user data (requires users to permit their data is used)
3. Form checker - Machine Learning check users form for core lifts (Squats, Deadlift, Bench Press, Overhead Press, Rows, Snatch, Clean and Jerk etc.)