import pttp
import json

username = input('please type your username : ')

proposedLawTitle = input('please type a title for your proposed law below:\n')

proposedLaw = input('please type the law you wish to propose below :\n')

arguments = {'username':username, 'proposedLaw':proposedLaw, 'proposedLawTitle':proposedLawTitle}

payload = json.dumps(arguments)

pttp.proposeLaw(payload)

print('Your law has been proposed.')