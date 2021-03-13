import json
import random
import uuid

import names
import numpy as np
import pymongo
from colorama import init, Fore

init()
from random import choice, choices

bdd = pymongo.MongoClient("mongodb://localhost:27017/")
db = bdd['McDonalds']
ClientTest = []
GroupsTest = []
MoyenneAge = []
MoyenneSexe: list[int] = [0, 0]
MoyenneGroupSize = []
GroupType: list[int] = [0, 0, 0, 0]  # ["Work", "Family", "Friend", "Love Friend"]
GroupTypeExemple: list[str] = ["Work", "Family", "Friend", "Love Friend"]

DataFileJson = open("data.json", 'r', encoding="utf8")
DataJson = json.load(DataFileJson)
DataFileJson.close()


def RandomName(Gender: str) -> str:
    if Gender == '\x1b[35mfemale\x1b[39m':
        return names.get_full_name(gender='female')
    else:
        return names.get_full_name(gender='male')


def ChoiceFavoriteProduct() -> list:
    frites = DataJson['Product']['Frites']
    boissons = DataJson['Product']['Boissons']
    mainResult = ""
    NewStandard = ""
    Size = ""
    Bacon = False
    price = 0

    # Frites
    friteSize = choice(list(frites['Size']))
    fritesResult = str(friteSize) + " " + choice(list(frites['Name']))

    price += frites['Price'][frites['Size'].index(friteSize)]

    # Boissons

    OtherAks = choice(["Other", "NoOther"])
    if OtherAks == "Other":
        boissonsName = choice(list(boissons['Other']['Name']))
        boissonsType = boissons['Other']['Type']['TypeBoissons'][boissons['Other']['Name'].index(boissonsName)]
        boissonsSize = choice(list(boissons['Other']['Type'][boissonsType]['Size']))
        boissonsResult = boissonsName + " " + str(boissonsSize) + " cl"
        price += boissons['Other']['Type'][boissonsType]['Price'][
            boissons['Other']['Type'][boissonsType]['Size'].index(boissonsSize)]
    else:
        boissonsSize = choice(list(boissons['Size']))
        boissonsName = choice(list(boissons['Name']))
        boissonsResult = str(boissonsSize) + " " + boissonsName
        price += boissons['Price'][boissons['Size'].index(boissonsSize)]

    # Burger & Nugget & Salade & Wrap
    BurgerWrapSaladeNugget = choice(["Burger", "Nugget", "Wrap", "Salade"])
    mainProduct = DataJson['Product'][BurgerWrapSaladeNugget]

    if BurgerWrapSaladeNugget != "Burger" and BurgerWrapSaladeNugget != "Nugget":
        mainResult = choice(mainProduct['Name'])
        price += mainProduct['Price'][mainProduct['Name'].index(mainResult)]
    elif BurgerWrapSaladeNugget == "Nugget":
        Size = choice(mainProduct['Size'])
        mainResult = f"{Size} {choice(list(mainProduct['Name']))}"
        price += mainProduct['Price'][
            mainProduct['Size'].index(Size)]
    else:
        NewStandard = choice(["New", "Standard"])

        if NewStandard != "New":
            Size = choice(["SingleSize", "MultiSize"])

            if Size == "MultiSize":
                sizeBurger = choice(mainProduct[NewStandard][Size]['Size'])
                burger = f"{sizeBurger} {choice(mainProduct[NewStandard][Size]['Name'])}"
                price += mainProduct[NewStandard][Size]['Price'][
                    mainProduct[NewStandard][Size]['Size'].index(sizeBurger)]
            else:
                burger = choice(mainProduct[NewStandard][Size]['Name'])
                price += mainProduct[NewStandard][Size]['Price'][mainProduct[NewStandard][Size]['Name'].index(burger)]

            try:
                if random.randint(0, 1) and mainProduct[NewStandard]['Supplement']['Product'].index(
                        burger) and NewStandard != "New":
                    supplementBurger = choice(mainProduct[NewStandard]['Supplement']['Name'])
                    mainResult = burger + " " + supplementBurger
                    Bacon = True
                    price += mainProduct[NewStandard]['Supplement']['Price'][
                        mainProduct[NewStandard]['Supplement']['Name'].index(supplementBurger)]
                else:
                    Bacon = None
                    mainResult = burger
            except ValueError:
                # print(f"{Fore.RED}ValueError{Fore.RESET} Supplement n'est pas possible !")
                mainResult = burger
                Bacon = None
        else:
            sizeBurger = choice(list(mainProduct[NewStandard]['Size']))
            if sizeBurger != "Single":
                mainResult = sizeBurger + " " + choice(list(mainProduct[NewStandard]['Name']))
            else:
                mainResult = choice(list(mainProduct[NewStandard]['Name']))
            price += mainProduct[NewStandard]['Price'][mainProduct[NewStandard]['Size'].index(sizeBurger)]

    return [fritesResult, boissonsResult, mainResult, round(price, 2)]


def FavoriteSupplement(TypeSupplement: str) -> list[str]:
    if TypeSupplement != "Nugget":
        TypeSupplement = choice(list(DataJson['Product']['Supplement']))
    InTypeSuppplement = DataJson['Product']['Supplement'][TypeSupplement]
    NameSupplement = ""
    PriceSupplement = 0

    if TypeSupplement == "Boissons":
        OtherAks = choice(["Other", "NoOther"])
        if OtherAks != "NoOther":
            PreNameSupplement = choice(list(InTypeSuppplement[OtherAks]['Name']))
            InTypeOtherBoissons = InTypeSuppplement[OtherAks]['Type'][
                InTypeSuppplement[OtherAks]['Type']['TypeBoissons'][
                    InTypeSuppplement[OtherAks]['Name'].index(PreNameSupplement)]]
            SizeSupplement = choice(list(InTypeOtherBoissons['Size']))
            NameSupplement = f"{PreNameSupplement} {SizeSupplement}cl"
            PriceSupplement = InTypeOtherBoissons['Price'][InTypeOtherBoissons['Size'].index(SizeSupplement)]
        else:
            SizeSupplement = choice(list(InTypeSuppplement['Size']))
            NameSupplement = f"{SizeSupplement} {choice(list(InTypeSuppplement['Name']))}"
            PriceSupplement = InTypeSuppplement['Price'][
                InTypeSuppplement["Size"].index(SizeSupplement)]
    elif TypeSupplement != "Nugget" and TypeSupplement != "Frites" and TypeSupplement != "Boissons":
        NameSupplement = choice(list(InTypeSuppplement["Name"]))
        PriceSupplement = InTypeSuppplement['Price'][
            InTypeSuppplement["Name"].index(NameSupplement)]

        try:
            if TypeSupplement == "Burger" and random.randint(0, 1) and InTypeSuppplement['Supplement']['Product'].index(
                    NameSupplement):
                NameSupplement = f"{NameSupplement} {InTypeSuppplement['Supplement']['Name'][0]}"
                PriceSupplement += InTypeSuppplement['Supplement']['Price'][0]
        except ValueError:
            value = "test"
            # print(f"{Fore.RED}ValueError{Fore.RESET} Supplement n'est pas possible !")
    else:
        SizeSupplement = choice(list(InTypeSuppplement["Size"]))
        NameSupplement = f"{SizeSupplement} {choice(list(InTypeSuppplement['Name']))}"
        PriceSupplement = InTypeSuppplement['Price'][InTypeSuppplement['Size'].index(SizeSupplement)]

    return [NameSupplement, PriceSupplement]


class Client:
    def __init__(self):
        self.id = uuid.uuid4()
        self.Gender = choice([f"{Fore.BLUE}male{Fore.RESET}", f"{Fore.MAGENTA}female{Fore.RESET}"])
        self.name = RandomName(self.Gender)
        self.year = random.randint(0, 80)
        self.WorkTicket = choice([True, False])
        self.Group = ""
        self.TotalPrice = 0
        self.Favorite()
        self.JoinsGroups()

    def Favorite(self):
        self.Hour = []

        # Favorite Menu
        Size = choice(list(DataJson['Menu']))
        self.Menu = str(choices(list(DataJson['Menu'][Size]['Name']))[0])
        self.Price = DataJson['Menu'][Size]['Price'][DataJson['Menu'][Size]['Name'].index(self.Menu)]

        # Favorite Product
        self.Product = ChoiceFavoriteProduct()

        # Favorite Supplement (Nugget || Salade || Frites || Boissons || Wrap(Wrap) || Burger(Chess, Hamb, EggMuffin, Croque, Filet, McFish))
        self.Supplement = FavoriteSupplement("")

        # Favorite Hour
        if self.WorkTicket and self.year >= 18:
            self.Hour.append(choice([15, 16, 17, 18]))
            self.Hour.append(choice(np.array(list(DataJson['Time']['Hour']))[:3]))
            self.Hour.append(choice(np.array(list(DataJson['Time']['Hour']))[8:]))
            self.Hour = sorted(self.Hour)
        else:
            self.Hour = [choice(DataJson['Time']['Hour']) for i in range(0, 3)]
            for i in range(0, len(self.Hour)):
                if self.Hour.count(self.Hour[i]) > 1:
                    newVal = choice(DataJson['Time']['Hour'])
                    if self.Hour.count(newVal) == 0:
                        self.Hour[i] = newVal
            self.Hour = sorted(self.Hour)

    def SumTotalPrice(self, Price):
        self.TotalPrice += Price

    def JoinsGroups(self):
        if random.randint(0, 1):
            if (not len(GroupsTest)) or random.randint(0, 1):
                GroupsTest.append(Group())
                Group.CheckAddMembers(GroupsTest[-1], self)
            else:
                group = GroupsTest[GroupsTest.index(choice(list(GroupsTest)))]
                if not Group.CheckAddMembers(group, self):
                    GroupsTest.append(Group())
                    Group.CheckAddMembers(GroupsTest[-1], self)


def CheckGroup() -> None:
    lasti = 0
    lastDelItem = 0
    delItem = 0
    i = 0
    while i < len(GroupsTest):
        lasti = i
        if GroupsTest[i].Size == 1:
            ClientTest[ClientTest.index(GroupsTest[i].Members[0])].Group = ""
            GroupsTest.pop(i)
            delItem += 1

        if delItem == lastDelItem:
            i += 1
        else:
            lastDelItem = delItem


class Group:
    def __init__(self):
        self.id = uuid.uuid4()
        self.Members = []
        self.Size = len(self.Members)
        if random.randint(0, 1):
            self.Favorite = FavoriteSupplement("Nugget")
        else:
            self.Favorite = ["Nothing"]
        self.Type = choice(["Work", "Family", "Friend", "Love Friend"])
        self.Hour = []

        # Hour
        if self.Type == "Work":
            self.Hour.append(choice([15, 16, 17, 18]))
            self.Hour.append(choice(np.array(list(DataJson['Time']['Hour']))[:3]))
            self.Hour.append(choice(np.array(list(DataJson['Time']['Hour']))[8:]))
            self.Hour = sorted(self.Hour)
        else:
            self.Hour = [choice(DataJson['Time']['Hour']) for i in range(0, 3)]
            for i in range(0, len(self.Hour)):
                if self.Hour.count(self.Hour[i]) > 1:
                    newVal = choice(DataJson['Time']['Hour'])
                    if self.Hour.count(newVal) == 0:
                        self.Hour[i] = newVal
            self.Hour = sorted(self.Hour)

    def CheckAddMembers(self, Members):
        if not self.Members.count(Members):
            if self.Type != "Love Friend":
                if Members.WorkTicket and self.Type == "Work":
                    self.Members.append(Members)
                    Members.Group = self
                    self.Size = len(self.Members)
                else:
                    self.Members.append(Members)
                    Members.Group = self
                    self.Size = len(self.Members)
            elif self.Size < 2:
                self.Members.append(Members)
                Members.Group = self
                self.Size = len(self.Members)
            else:
                return False


def InsertBDD(date, hour, ClientID: Client, menu, product, price, supplement):
    try:
        db.validate_collection(date)
    except:
        db.create_collection(date)

    collection = db.get_collection(date)
    if product != []:
        collection.insert_one({"Hour": hour,"ClientID": ClientID.id,"NameClient": ClientID.name,"Menu": menu, "Frites": product[0], "Boissons": product[1], "Main": product[2], "Price": price, "Supplement": supplement})
    else:
        collection.insert_one( 
            {"Hour": hour,"ClientID": ClientID.id,"NameClient": ClientID.name,"Menu": menu, "Frites": "", "Boissons": "", "Main": "", "Price": price, "Supplement": supplement})


def ChoiceProduct(ClientID: Client, date, hour):
    menu = ""
    product = []
    price = 0

    if random.randint(0, 1):  # Menu
        menu = ClientID.Menu
        price = ClientID.Price
    else:
        menu = "Custom"
        choiceP = ChoiceFavoriteProduct()
        product.append(choiceP[0])
        product.append(choiceP[1])
        product.append(choiceP[2])
        price = choiceP[3]

    if random.randint(0, 1): # Supplement
        supplement, priceS = FavoriteSupplement("")
        price += priceS
        InsertBDD(date, hour, ClientID, menu, product, price, supplement)
    else:
        InsertBDD(date, hour, ClientID, menu, product, price, "")


def GenerateClient(nbrClient: int, PNewClient: int, date: str, hour: int) -> int:
    NewClient = 0
    for i in range(1, nbrClient + 1):
        index = -1
        if random.randint(0, PNewClient) and len(ClientTest) > 2:
            index = random.randint(0, len(ClientTest)) - 1
        else:
            ClientTest.append(Client())
            NewClient += 1

        if ClientTest[index].Gender == '\x1b[35mfemale\x1b[39m':
            MoyenneSexe[0] += 1
        else:
            MoyenneSexe[1] += 1

        ChoiceProduct(ClientTest[index], date, hour)

        MoyenneAge.append(ClientTest[index].year)
        # print(ClientTest[index].id, ClientTest[index].Gender, ClientTest[index].name, f"{ClientTest[index].year} ans",
        #      ClientTest[index].Group, ClientTest[index].WorkTicket, ClientTest[index].Menu,
        #      ClientTest[index].Hour, ClientTest[index].Product, str(ClientTest[index].Price) + " €",
        #      ClientTest[index].Supplement,
        #      str(ClientTest[index].TotalPrice) + " €")

    CheckGroup()
    for i in GroupsTest:
        MoyenneGroupSize.append(i.Size)
        GroupType[GroupTypeExemple.index(i.Type)] += 1

    # print("Client :\n Age :\n  Min :", min(MoyenneAge), 'ans', "\n  Moyenne :",
    #       round(sum(MoyenneAge) / len(MoyenneAge)), 'ans', "\n  Mediane :", round(statistics.median(MoyenneAge)), 'ans',
    #       "\n  Max :", max(MoyenneAge), 'ans', "\n Sexe :\n  Homme :",
    #       round((MoyenneSexe[1] / len(ClientTest)) * 100, 2), "%\n  Femme :",
    #       round((MoyenneSexe[0] / len(ClientTest)) * 100, 2), "%")
    # print("Group :\n  Min :", min(MoyenneGroupSize), 'membre(s)', "\n  Moyenne :",
    #       round(sum(MoyenneGroupSize) / len(MoyenneGroupSize)), 'membre(s)', "\n  Mediane :",
    #       round(statistics.median(MoyenneGroupSize)), 'membre(s)', "\n  Max :", max(MoyenneGroupSize), 'membre(s)',
    #       "\n  Sum :", sum(MoyenneGroupSize), 'membre(s)',
    #       "\n Type: \n  Work :", GroupType[0], "\n  Family :", GroupType[1], "\n  Friend :", GroupType[2],
    #       "\n  Love Friend :", GroupType[3], "\n  Pourcent :",
    #       round((sum(MoyenneGroupSize) / len(ClientTest)) * 100, 2), "%")
    # print("Size :\n  CleintTest :", getsizeof(ClientTest), "bytes\n  GroupTest :", getsizeof(GroupsTest), "bytes")
    return NewClient
