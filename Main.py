from Class import *
from Time import *
from Function import *

DYear = int(input("Année de début : "))
year = int(input("Nombre D'année (0 pour null) : "))
PNewClient = int(input("Nombre de probabilité de nouveau client (1 à 10) : "))

ListClient = []


def Debut(year: int):
    for ia in range(DYear, (DYear + year)):
        for im in range(1, 13):
            day = Est_Bissextile(ia)
            for imd in range(0, len(day)):
                md = day[imd]
                for id in range(1, md + 1):
                    printB(f"***** {JourSemaine(id, im, ia)[0]} {id} {Get_Month(im - 1)} {ia} *****")
                    NewClientPM = []
                    ClientHourPM = []
                    for ih in range(0, len(Get_OpenHour())):
                        print(Get_ReelClientHour(ih, JourSemaine(id, im, ia)[1], (im - 1)), "Client à", Get_Hour(ih), "h")
                        # Launch program
                        NewClient = GenerateClient(Get_ReelClientHour(ih, JourSemaine(id, im, ia)[1], (im - 1)), PNewClient, f"{JourSemaine(id, im, ia)[0]} {id} {Get_Month(im - 1)} {ia}", Get_Hour(ih))
                        ClientHour = Get_ReelClientHour(ih, JourSemaine(id, im, ia)[1], (im - 1))
                        NewClientPM.append(NewClient)
                        ClientHourPM.append(ClientHour)
                        printJ(f"{NewClient}/{ClientHour}({round((NewClient/ClientHour)*100, 2)}%) Nouveaux Client")
                    printR(f"{sum(NewClientPM)}/{sum(ClientHourPM)}({round((sum(NewClientPM) / sum(ClientHourPM))*100, 2)}%) de nouveaux clients")
                imd += 1
                break
            continue


Debut(year)
