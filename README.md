# Jym
A website for creating, sharing and tracking a strength training schedule!

pip install -r requirements.txt

if changes made to to diagram.ts use this command to compile it into JS:

    npx esbuild app/static/js/musclesWorked/diagram.ts --bundle --outfile=app/static/js/musclesWorked/diagram.bundle.js

Test user:

Username - TestUser
Password - 123456789
Admin - true!

Databases are hosted externally on supabase and mongodb atlas!

Information on the databases is inside of Models.py

API endpoints are inside of __init__.py inside app folder.

They require an API key here is one for you to use! 

0f898a929f98d6920c5bf7377d1adf48494ce6b932415371191097276c2e2b9c

They are accessable through curl and have csrf protection for web!

I know i shouldn't be sharing API keys inside config publicly but they are using free accounts so it should hopefully be ok if anyone finds them!

The entire site follows a basic structure of flask using flask-restful APIs to communicate with the databases, JS for a dynamic front end and sending information back through the API to the databases.

A person from outside the group was used to create an account and test the experience of the frontend.

https://github.com/lahaxearnaud/body-highlighter is used for the muscles worked diagrams does not need installed or compiled but if it is'nt working try the command above!
