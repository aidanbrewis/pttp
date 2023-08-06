import pttp
import json

username = input('please type a new username : ')

arguments = {'username':username}

payload = json.dumps(arguments)

pttp.createUser(payload)

print('added user '+username)