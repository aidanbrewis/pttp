import pttp
import json

username = input('please type a new username : ')

payload = {'username':username}

pttp.createUser(payload)

print('added user '+username)