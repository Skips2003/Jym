from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/editSchedule')
def editSchedule():
    return render_template('edit-schedule.html')

@app.route('/signIn')
def signIn():
    return render_template('signIn.hmtl')

@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    app.run(host='localhost', port = 5000, debug=True)
    print('flask app is running')