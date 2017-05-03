import argparse
import smbus

from flask import Flask, jsonify, url_for, send_from_directory, render_template
from flask_mysqldb import MySQL
from MySQLdb.cursors import DictCursor

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'marcin'
app.config['MYSQL_DB'] = 'rpi_luxmeter'
app.config['MYSQL_HOST'] = 'localhost'

mysql.init_app(app)

DEVICE = 0x23
ONE_TIME_HIGH_RES_MODE_1 = 0x20


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


def convertToNumber(data):

    return (data[1] + (256 * data[0])) / 1.2


def make_measurement(addr=DEVICE):
    data = bus.read_i2c_block_data(addr, ONE_TIME_HIGH_RES_MODE_1)
    value = convertToNumber(data)
    print(value)
    cur = mysql.connection.cursor()
    cur.execute(
        """INSERT INTO 
            measurements (value)
        VALUES (%.f)""", (value))
    mysql.connection.commit()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-m',
                        '--measurement',
                        type=bool,
                        help="Set True to make single measurement")
    args = parser.parse_args()
    if args.measurement:
        make_measurement()
    else:
        app.run(debug=True)
