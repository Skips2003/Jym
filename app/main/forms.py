from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Users

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    rememberMe = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class SignUpForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=3, max=20)])
    confirmPassword = PasswordField('Confirm Password', validators=[DataRequired(), Length(min=3, max=20)])
    firstName = StringField('First Name', validators=[DataRequired()])
    lastName = StringField('Last Name', validators=[DataRequired()])
    rememberMe = BooleanField('Remember Me')
    submit = SubmitField('Sign Up')

    def validateUsername(self, username):
        existingUsername = Users.query.filter_by(username=username.data).first()

        if existingUsername:
            raise ValidationError("That username is already in use, Please select a different one.")
        
    def validateEmail(self, email):
        existingEmail = Users.query.filter_by(email=email.data).first()

        if existingEmail:
            raise ValidationError("That email is already in use, Please select a different one.")
        
class SearchExercise(FlaskForm):
    search = StringField(validators=[DataRequired()], render_kw={"placeholder": "Search By Exercise Name"})
    submit = SubmitField('Search')