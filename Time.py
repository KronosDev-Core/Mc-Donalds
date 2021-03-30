import json
import datetime
from operator import __mod__
from typing import Any

DataFileJson = open("data.json", 'r', encoding="utf8")
DataJson = json.load(DataFileJson)
DataFileJson.close()

Time = DataJson['Time']


def Est_Bissextile(year):
    """ Return Calendar Bissextile or not """
    if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
        return Time['BMonthDay']
    else:
        return Time['MonthDay']


def Get_NowDate():
    """ Return Date Today / Now """
    return datetime.date.today()


def Get_OpenHour():
    """ Return Open Hour """
    return Time['Hour']


def Get_Hour(hour):
    """ Return Reel Hour With index (0, 12) """
    return Time['Hour'][hour]


def Get_ReelClientHour(hour, day, month):
    """ Return Reel Client with Indic and Type """
    return int(round(Time['HourType'][hour] * Time['IndicDays'][day] * Time['IndicMonth'][month]))


def Get_Month(month: int):
    """ Return Name Month with index """
    return Time['Mois'][month]


def JourSemaine(d: int, m: int, y: int):
    """ Return Name Day and Day  """
    if m >= 3:
        y1 = y
        dec = -2
    else:
        y1 = y - 1
        dec = 0

    day = (23 * m // 9 + d + 4 + y + y1 // 4 - y1 // 100 + y1 // 400 + dec) % 7

    dayF = Time['dayT'][day]
    return [dayF, day]
