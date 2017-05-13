import argparse
import configparser
import measurement


from flask import Flask, jsonify, url_for, send_from_directory, render_template, request
from flask_mysqldb import MySQL
from MySQLdb.cursors import DictCursor

mysql = MySQL()
app = Flask(__name__)

config = configparser.ConfigParser()
config.read('databaseconfig.ini')
section = 'DEFAULT'
app.config['MYSQL_USER'] = config.get(section, 'user')
app.config['MYSQL_PASSWORD'] = config.get(section, 'passwd')
app.config['MYSQL_DB'] = config.get(section, 'db')
app.config['MYSQL_HOST'] = config.get(section, 'host')

mysql.init_app(app)



def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/api')
def api():
    cur = mysql.connection.cursor(cursorclass=DictCursor)
    date_begin = request.args.get('user')
    date_end = request.args.get('user')
    cur.execute('SELECT * FROM measurements WHERE date > NOW() - INTERVAL 1 DAY ORDER BY date')
    rv = cur.fetchall()
    return jsonify(rv)

@app.route('/measurement')
def make_measurement():
    measurement.make_measurement()
    return ('', 200) 

if __name__ == '__main__':
        app.run(debug=True)
