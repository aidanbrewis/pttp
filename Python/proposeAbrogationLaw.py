import pttp
import json

username = input('please type your username : ')

acceptedLaws = json.loads(pttp.getAcceptedLaws(json.dumps({})))
lawIds = list(acceptedLaws.keys())
print('the list of accepted laws is the following :')
for i in range(len(lawIds)):
    for versionNumber in acceptedLaws[lawIds[i]]['versions']:
        print(str(i)+'. '+acceptedLaws[lawIds[i]]['versions'][versionNumber]['content'])

lawToAbrogateIndex = input('please type in the number of of the law you wish to abrogate below\n(e.g. 0) : ')

lawToAbrogateId = lawIds[int(lawToAbrogateIndex)]

replaceString = input('If you do not wish to replace the abrogated law just press enter\nIf you wish to replace the abrogated law type replace : ')

replace = replaceString == 'replace'

if replace:
    replacementLaw = input('Please type in the full replacement law below :\n')
    arguments = {'username':username, 'lawId':lawToAbrogateId, 'replace':replace, 'replacementLaw':replacementLaw}
else:
    arguments = {'username':username, 'lawId':lawToAbrogateId}

payload = json.dumps(arguments)
    
pttp.proposeAbrogationLaw(payload)

print('The abrogation has been submitted for voting')
if replace:
    print('Along with the replacement vote you suggested')