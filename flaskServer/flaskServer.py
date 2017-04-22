import calendar
from datetime import datetime
from json import JSONEncoder

from flask import Flask, jsonify, url_for, send_from_directory
from flask_mysqldb import MySQL
from MySQLdb.cursors import DictCursor

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'marcin'
app.config['MYSQL_DB'] = 'rpi_luxmeter'
app.config['MYSQL_HOST'] = 'localhost'

mysql.init_app(app)


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def send_js(path):
    return app.send_static_file(path)


@app.route('/api')
def hello_world():
    cur = mysql.connection.cursor(cursorclass=DictCursor)
    cur.execute('SELECT * FROM measurements')
    rv = cur.fetchall()
    return jsonify(rv)


if __name__ == '__main__':
    app.run(debug=True)
