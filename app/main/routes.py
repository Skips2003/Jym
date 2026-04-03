import json
from flask import render_template, flash, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from app.models import Users, Follows
from app.main.forms import LoginForm, SignUpForm
from app.main import bp
from app import db, bcrypt, loginManager, mongo, api
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
    return render_template('admin.html')

@bp.route('/manage', methods=['GET', 'POST'])
def manage():
    print("manage")
    return render_template('manage.html')