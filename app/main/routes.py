from flask import render_template, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user, current_user
from app.models import Users
from app.main.forms import LoginForm, SignUpForm
from app.main import bp
from app import db, bcrypt, loginManager

user = {'username': 'Jonny'}

@loginManager.user_loader
def loaduser(userID):
    return Users.query.get(int(userID))

@bp.route('/', methods=['GET', 'POST'])
@login_required
def home():
    return render_template('home.html', user=user)

@bp.route('/profile')
def profile():
    return render_template('profile.html')

@bp.route('/editSchedule')
def editSchedule():
    return render_template('edit-schedule.html')

@bp.route('/signIn', methods=['GET', 'POST'])
def signIn():
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        print(user)
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('main.home'))
    return render_template('signIn.html', title='Sign In', form=form)

@bp.route('/signUp', methods=['GET', 'POST'])
def signUp():

    form = SignUpForm()
    if form.validate_on_submit():
        hashedPassword = bcrypt.generate_password_hash(form.password.data).decode('utf8')
        newUser = Users(username=form.username.data, password=hashedPassword, email=form.email.data, firstName=form.firstName.data, lastName=form.lastName.data)
        db.session.add(newUser)
        db.session.commit()
        return redirect(url_for('main.signIn'))
    
    return render_template('signUp.html', title='Sign Up', form=form)

@bp.route('/signOut', methods=('GET', 'POST'))
@login_required
def signOut():
    logout_user()
    return redirect(url_for('main.signIn'))

@bp.route('/admin')
def admin():
    return render_template('admin.html')

@bp.route('/manage')
def manage():
    return render_template('manage.html')