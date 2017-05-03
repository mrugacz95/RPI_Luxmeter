import argparse
import configparser


from flask import Flask, jsonify, url_for, send_from_directory, render_template
from flask_mysqldb import MySQL
from MySQLdb.cursors import DictCursor

mysql = MySQL()
app = Flask(__name__)

config = configparser.ConfigParser()
config.read('databaseconfig.ini')
section = 'DEFAULT'
app.config['MYSQL_USER'] = config.get(section, 'MYSQL_USER')
app.config['MYSQL_PASSWORD'] = config.get(section, 'MYSQL_PASSWORD')
app.config['MYSQL_DB'] = config.get(section, 'MYSQL_DB')
app.config['MYSQL_HOST'] = config.get(section, 'MYSQL_HOST')

mysql.init_app(app)



def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/api')
def hello_world():
    cur = mysql.connection.cursor(cursorclass=DictCursor)
    cur.execute('SELECT * FROM measurements')
    rv = cur.fetchall()
    return jsonify(rv)


if __name__ == '__main__':
        app.run(debug=True)
