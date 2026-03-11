from flask import render_template, flash, redirect, url_for
from app.main.forms import LoginForm, SignUpForm
from app.main import bp

user = {'username': 'Jonny'}

@bp.route('/')
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
        flash('Login requested for user {}, rememberMe={}'.format(
            form.username.data, form.rememberMe.data))
        return redirect(url_for('home'))
    return render_template('signIn.html', title='Sign In', form=form)

@bp.route('/signUp', methods=['GET', 'POST'])
def signUp():
    form = SignUpForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.rememberMe.data))
        return redirect(url_for('home'))
    return render_template('signUp.html', title='Sign Up', form=form)

@bp.route('/admin')
def admin():
    return render_template('admin.html')

@bp.route('/manage')
def manage():
    return render_template('manage.html')