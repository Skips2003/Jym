import sqlalchemy as sa
import sqlalchemy.orm as so
from app import createApp, db
from app.models import Users

app = createApp()

if __name__ == '__main__':
    app.run(host='localhost', port = 5000, debug=True)
    print('flask app is running')