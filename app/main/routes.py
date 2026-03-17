from flask import render_template, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user, current_user
from app.models import Users
from app.main.forms import LoginForm, SignUpForm, SearchExercise
from app.main import bp
from app import db, bcrypt, loginManager
import requests

@loginManager.user_loader
def loaduser(userID):
    print('loading user')
    return Users.query.get(int(userID))

@bp.route('/', methods=['GET', 'POST'])
@login_required
def home():
    print('home')
    return render_template('home.html')

@bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    print('profile')
    return render_template('profile.html')

@bp.route('/editSchedule', methods=['GET', 'POST'])
@login_required
def editSchedule():
    form = SearchExercise()
    print('edit-schedule')
    if form.is_submitted():
        print('form validated')
        print('searching for exercises')

        url = "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search"

        querystring = {"search": form.search.data}

        print(querystring)

        headers = {
                    "x-rapidapi-key": "4b0ef871b2msh66491918fb044ddp1ea25ejsn79c935d7b3b6",
                    "x-rapidapi-host": "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
                    "Content-Type": "application/json"
                }
        
        response = requests.get(url, headers=headers, params=querystring)

        print(response.json())

    return render_template('edit-schedule.html', title='Edit-Schedule', form=form)

@bp.route('/signIn', methods=['GET', 'POST'])
def signIn():
    form = LoginForm()
    if form.validate_on_submit():
        print('form validated')
        print('searching for user')
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            print('user found')
            if bcrypt.check_password_hash(user.password, form.password.data):
                print('password correct, logging in')
                login_user(user)
                return redirect(url_for('main.home'))
            else:
                print('password incorrect')
                flash('Invalid username or password')
    return render_template('signIn.html', title='Sign In', form=form)

@bp.route('/signUp', methods=['GET', 'POST'])
def signUp():
    form = SignUpForm()
    if form.validate_on_submit():
        print('form validated')
        print('creating user')
        hashedPassword = bcrypt.generate_password_hash(form.password.data).decode('utf8')
        newUser = Users(username=form.username.data, password=hashedPassword, email=form.email.data, firstName=form.firstName.data, lastName=form.lastName.data)
        db.session.add(newUser)
        db.session.commit()
        return redirect(url_for('main.signIn'))
    
    return render_template('signUp.html', title='Sign Up', form=form)

@bp.route('/signOut', methods=('GET', 'POST'))
@login_required
def signOut():
    print('logging out')
    logout_user()
    return redirect(url_for('main.signIn'))

@bp.route('/admin', methods=['GET', 'POST'])
def admin():
    print('admin')
    return render_template('admin.html')

@bp.route('/manage', methods=['GET', 'POST'])
def manage():
    print('manage')
    return render_template('manage.html')