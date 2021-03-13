from colorama import init, Fore
init()


def printB(text):
    print(f"{Fore.BLUE}{text}{Fore.RESET}")


def printJ(text):
    print(f"{Fore.YELLOW}{text}{Fore.RESET}")


def printR(text):
    print(f"{Fore.RED}{text}{Fore.RESET}")