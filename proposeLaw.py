import pttp

username = input('please type your username : ')

proposedLaw = input('please type the law you wish to propose below :\n')

pttp.proposeLaw(username, proposedLaw)

print('Your law has been proposed.')