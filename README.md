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

They are accessable through curl and have csrf protection for web!

I know i shouldn't be sharing API keys inside config publicly but they are using free accounts so it should hopefully be ok if anyone finds them!
