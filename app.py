from flask import Flask, render_template, flash, redirect
from config import Config
from forms import LoginForm

app = Flask(__name__)
app.config.from_object(Config)

user = {'username': 'Jonny'}

@app.route('/')
def home():
    return render_template('home.html', user=user)

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/editSchedule')
def editSchedule():
    return render_template('edit-schedule.html')

@app.route('/signIn', methods=['GET', 'POST'])
def signIn():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.rememberMe.data))
        return redirect('/index')
    return render_template('signIn.html', title='Sign In', form=form)

@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/manage')
def manage():
    return render_template('manage.html')

if __name__ == '__main__':
    app.run(host='localhost', port = 5000, debug=True)
    print('flask app is running')