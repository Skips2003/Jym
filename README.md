# StrengthTrackerWeb
A website for creating, sharing and tracking a strength training schedule!

uses:
pip install flask
pip install flask-wtf
pip install flask-sqlalchemy
pip install flask-login
pip install flask_bcrypt
pip install flask-pymongo
pip install flask-restful
pip install psycopg2

the free version of the exercisesDB we are using is currently down but should be fixed soon, if not we can just use a different one

TODO:

100% Need completed:
1. Unit Testing (Better Documentation in general)
2. actually make the HTML and CSS for the site (shouldn't take long)
3. add functionality to view details button when searching for exercises (display gif, muscles worked and instructions for exercise)
4. Add pbs graphs and ability to update them
5. add visualisation of muscles worked
6. report system (Users, Shared Schedules/Workouts)
7. Admin panel for reviewing schedules, profiles etc
8. add completing a workout (with check to ensure it was completed on the right day)
9. view recently completed workouts
10. Add tags to schedules/workouts for searching
11. Search Page

Optional for after above is finished:
1. trainer accounts (allow trainers to provide schedules to users and track their progress!)
2. University Researcher accounts with larger access to user data (requires users to permit their data is used)
3. Form checker - Machine Learning check users form for core lifts (Squats, Deadlift, Bench Press, Overhead Press, Rows, Snatch, Clean and Jerk etc.)