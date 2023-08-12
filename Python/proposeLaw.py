import pttp

username = input('please type your username : ')

proposedLawTitle = input('please type a title for your proposed law below:\n')

proposedLawCategory = input('please type a category for your proposed law below:\n')

proposedLaw = input('please type the law you wish to propose below :\n')

expedite = input('If you want to expedite this law to finish voting at a specified date type expedite below otherwise just press enter :\n') == 'expedite'

if expedite:
    expediteDate = input('please enter the unix epoch time when voting should end:\n')
    payload = {'username':username, 'proposedLaw':proposedLaw, 'proposedLawTitle':proposedLawTitle, 'proposedLawCategory':proposedLawCategory, 'expedite':expedite, 'expediteDate':expediteDate}
else:
    payload = {'username':username, 'proposedLaw':proposedLaw, 'proposedLawTitle':proposedLawTitle, 'proposedLawCategory':proposedLawCategory, 'expedite':expedite}

pttp.proposeLaw(payload)

print('Your law has been proposed.')