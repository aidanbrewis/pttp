import pttp
import json

username = input('please type your username : ')

proposedLawTitle = input('please type a title for your proposed law below:\n')

proposedLawCategory = input('please type a category for your proposed law below:\n')

proposedLaw = input('please type the law you wish to propose below :\n')

payload = {'username':username, 'proposedLaw':proposedLaw, 'proposedLawTitle':proposedLawTitle, 'proposedLawCategory':proposedLawCategory}

# payload = json.dumps(arguments)

pttp.proposeLaw(payload)

print('Your law has been proposed.')