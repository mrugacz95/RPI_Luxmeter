import configparser
import smbus

DEVICE = 0x23
ONE_TIME_HIGH_RES_MODE_1 = 0x20
bus = smbus.SMBus(1)


def convert_to_number(data):
    return (data[1] + (256 * data[0])) / 1.2


def get_light(addr=DEVICE):
    data = bus.read_i2c_block_data(addr, ONE_TIME_HIGH_RES_MODE_1)
    return convert_to_number(data)


def make_measurement():
    import MySQLdb
    config = configparser.ConfigParser()
    config.read('databaseconfig.ini')
    section = 'DEFAULT'
    connection = MySQLdb.connect(host=config.get(section, 'MYSQL_HOST'),
                                 user=config.get(section, 'MYSQL_USER'),
                                 passwd=config.get(section, 'MYSQL_PASSWORD'),
                                 db=config.get(section, 'MYSQL_DB'))
    config.c
    cur = connection.cursor()
    value = 25.4
    cur.execute(
        """INSERT INTO 
            measurements (value)
        VALUES (%s)""", (value,))
    connection.commit()
    connection.close()


if __name__ == '__main__':
    make_measurement()
