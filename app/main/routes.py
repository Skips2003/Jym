import json
from flask import render_template, flash, redirect, url_for , request
from flask_login import login_user, login_required, logout_user, current_user
from app.models import Users, Follows
from app.main.forms import LoginForm, SignUpForm
from app.main import bp
from app import db, bcrypt, loginManager, mongo
from bson import json_util
from bson.objectid import ObjectId

# Remove after home page has been updated to JS
daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def cleanMongoData(data):

    data['_id'] = data['_id']['$oid']

    return data

@loginManager.user_loader
def loaduser(userID):
    print("loading user")
    return Users.query.get(int(userID))

@bp.route('/', methods=['GET', 'POST'])
@login_required
def home():
    print('home')

    print(current_user.currentScheduleID)

    temp = json.loads(json_util.dumps(mongo.db.Schedules.find_one({ "_id" : ObjectId(current_user.currentScheduleID) })))
    schedule = cleanMongoData(temp)

    if not schedule:
        print("no schedule found for user, setting to default schedule")
        Users.query.filter_by(id=current_user.id).first().currentScheduleID = '69c44bc4735131196e47244d'
        db.session.commit()
    else:
        print("schedule found for user")

    return render_template('home.html', title='Home Page', schedule=schedule)

@bp.route('/profile', methods=['GET', 'POST'])
@bp.route('/profile/<username>', methods=['GET', 'POST'])
@login_required
def profile(username=None):
    if username is None:
        user = current_user
    else:
        user = Users.query.filter_by(username=username).first()
        
    temp = json.loads(json_util.dumps(mongo.db.Schedules.find_one({ "_id" : ObjectId(user.currentScheduleID) })))
    schedule = cleanMongoData(temp)

    if not schedule:
        print("no schedule found for user, setting to default schedule")
        Users.query.filter_by(id=user.id).first().currentScheduleID = '69c44bc4735131196e47244d'
        db.session.commit()
    else:
        print("schedule found for user" + str(schedule))

    print(f"Viewing profile for: {username}")

    follows = Follows.is_following(current_user.id, user.id)
    print(follows)

    return render_template('profile.html', user=user, schedule=schedule, follows=follows)

@bp.route('/editSchedule', methods=['GET', 'POST'])
@login_required
def editSchedule():

    print("Loading edit-schedule ...")

    temp = json.loads(json_util.dumps(mongo.db.Schedules.find_one({ "_id" : ObjectId(current_user.currentScheduleID) })))
    schedule = cleanMongoData(temp)

    if not schedule:
        print("no schedule found for user, setting to default schedule")
        Users.query.filter_by(id=current_user.id).first().currentScheduleID = '69c44bc4735131196e47244d'
        db.session.commit()
    else:
        print("schedule found for user " + str(schedule))

    return render_template('edit-schedule.html', title='Edit-Schedule', schedule=schedule) 

@bp.route('/signIn', methods=['GET', 'POST'])
def signIn():
    form = LoginForm()
    if form.validate_on_submit():
        print("form validated")
        print("searching for user")
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            print("user found")
            if bcrypt.check_password_hash(user.password, form.password.data):
                print("password correct, logging in")
                login_user(user)
                return redirect(url_for('main.home'))
            else:
                print("password incorrect")
                flash('Invalid username or password')
    return render_template('signIn.html', title='Sign In', form=form)

@bp.route('/signUp', methods=['GET', 'POST'])
def signUp():
    form = SignUpForm()
    if form.validate_on_submit():
        print("form validated")
        print("creating user")
        hashedPassword = bcrypt.generate_password_hash(form.password.data).decode('utf8')
        newUser = Users(username=form.username.data, password=hashedPassword, email=form.email.data, firstName=form.firstName.data, lastName=form.lastName.data, currentScheduleID='69c44bc4735131196e47244d')
        db.session.add(newUser)
        db.session.commit()
        return redirect(url_for('main.signIn'))
    
    return render_template('signUp.html', title='Sign Up', form=form)

@bp.route('/signOut', methods=('GET', 'POST'))
@login_required
def signOut():
    print("logging out")
    logout_user()
    return redirect(url_for('main.signIn'))

@bp.route('/admin', methods=['GET', 'POST'])
def admin():
    print("admin")
    form = SignUpForm()
    users=Users.query.all()
    exercises=list(mongo.db.Exercise.find())
    workouts=list(mongo.db.Workouts.find())
    return render_template('admin.html', users=users, form=form,exercises=exercises,workouts=workouts)

@bp.route('/manage/<int:user_id>', methods=['GET', 'POST'])
def manage(user_id):
    print("manage")
    form = SignUpForm()
    user=Users.query.get(user_id)
    all_workouts=list(mongo.db.Workouts.find())
    saved_workouts = list(mongo.db.SavedWorkouts.find({"userID":str(user_id)}))
    if (saved_workouts):
        # 1. Extract all workoutIDs from the list of dictionaries
        # This creates: [ObjectId('...'), ObjectId('...')]
        id_list = [ObjectId(item['workoutID']) for item in saved_workouts]
        # 2. Now use that list with the $in operator
        # Note: $in expects a LIST, so we pass id_list directly
        workouts = list(mongo.db.Workouts.find({"_id": {"$in": id_list}}))
    else:
        workouts=[]
    current_schedule =[]
    current_schedule = mongo.db.Schedules.find_one({"_id":ObjectId(user.currentScheduleID)})
    return render_template('manage.html',user=user , form = form,workouts=workouts,all_workouts=all_workouts,schedule=current_schedule)


@bp.route('/edit/<int:user_id>', methods=['POST'])
def edit_user(user_id):
    user = Users.query.get(user_id)
    if (request.form['username']):
        user.username = request.form['username']
    if (request.form['firstName']):
        user.firstName = request.form['firstName']
    if (request.form['lastName']):
        user.lastName=request.form['lastName']
    if (request.form['email']):
        user.email=request.form['email']
    db.session.commit()
    return redirect(f"/manage/{user_id}")

@bp.route('/add_exercise', methods=['POST'])
def add_exercise():
    exercise = {
        "name": request.form["name"],
        "reps": int(request.form["reps"]),
        "sets": int(request.form["sets"]),
        "weight": int(request.form["weight"]),
        "searchID": request.form["searchID"],
        "targetMuscles" : request.form.getlist("targetMuscles"),
        "secondaryMuscles": request.form.getlist("secondaryMuscles")
    }
    mongo.db.Exercise.insert_one(exercise)
    return redirect('/admin')

@bp.route('/add_workout', methods=['POST'])
def add_workout():
    exercise_ids=request.form.getlist('exercise_ids')
    workout = {        
        "name": request.form["name"],
        "description": request.form["description"],
        "exercises": list(mongo.db.Exercise.find({"searchID":{"$in":exercise_ids}}))
    }
    mongo.db.Workouts.insert_one(workout)
    return redirect('/admin')


@bp.route('/add_user_workout/<int:user_id>', methods=['POST'])
def add_user_workout(user_id):
    workout_ids=request.form.getlist('workout_name')
    for w_id in workout_ids :
        saving_workout = {        
            "userID": str(user_id),
            "workoutID": ObjectId(w_id)
            }
        mongo.db.SavedWorkouts.insert_one(saving_workout)
    return redirect(f"/manage/{user_id}")


@bp.route('/add_user_schedule/<int:user_id>', methods=['POST'])
def add_user_schedule(user_id):
    monday = mongo.db.Workouts.find_one({"_id":ObjectId(request.form.get('workout_id_1'))})
    tuesday = mongo.db.Workouts.find_one({"_id":ObjectId(request.form.get('workout_id_2'))})
    days = {
        "Monday" : monday , 
        "Tuesday" : tuesday ,
        "Wednesday" : monday,
        "Thursday": monday,
        "Friday": tuesday,
        "Saturday" : monday,
        "Sunday": tuesday
    }
    new_schedule = {
        "name":"myname",
        "description":"assignment",
        "days" : days
    }
    insert_result = mongo.db.Schedules.insert_one(new_schedule)
    user = Users.query.get(user_id)
    user.currentScheduleID = str(insert_result.inserted_id)
    db.session.commit()
    return redirect(f"/manage/{user_id}")
