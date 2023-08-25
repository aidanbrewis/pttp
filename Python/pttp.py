import json
import time
import os

MINIMUM_LAW_DURATION = 2419200 #28 days in seconds
ACTIVE_USER_TIMEOUT = 604800   #7  days in seconds

def createUser(payload):
    username = payload['username']
    
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    
    if useS3Bucket:
        inputFileNames = ['users.json']
        try:
            users = readFromS3(inputFileNames)['users.json']
        except:
            users = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            pass
    if users.get(username) is not None:
        raise Exception('username '+username+' is already taken')
    users[username] = {
            'proposedLaws' : [],
            'votedLaws' : {},
            'latestActivity' : int(time.time())
        }
    if useS3Bucket:
        jsonDataByFileName = {'users.json': json.dumps(users)}
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
    
    return({})

def proposeLaw(payload):
    username = payload['username']
    proposedLaw = payload['proposedLaw']
    proposedLawTitle = payload['proposedLawTitle']
    proposedLawCategory = payload['proposedLawCategory']
    expedite = payload['expedite']
    if expedite:
        expediteDate = int(payload['expediteDate'])
    else:
        expediteDate = None
    
    hours24inSeconds = 86400

    if expedite:
        if expediteDate < int(time.time()) + hours24inSeconds:
            raise Exception('The expedite date must be at least 24 hours later than now.')
    
    newLawId = generateNewId()
    
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    
    users = {}
    
    if useS3Bucket:
        inputFileNames = ['users.json', 'proposedLaws.json', 'acceptedLaws.json', 'rejectedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            users = dataByFileName['users.json']
        except:
            users = {}
        try:
            proposedLaws = dataByFileName['proposedLaws.json']
        except:
            proposedLaws = {}
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
        try:
            rejectedLaws = dataByFileName['rejectedLaws.json']
        except:
            rejectedLaws = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            raise Exception('no users found, use createUser.py')
        
        if users.get(username) == None:
            raise Exception('no user with username : '+username+'\nplease use createUser.py')
        
        proposedLaws = {}
        try:
            with open('data/proposedLaws.json') as proposedLawsFile:
                proposedLaws = json.load(proposedLawsFile)
        except:
            pass
        
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
        
        rejectedLaws = {}
        try:
            with open('data/rejectedLaws.json') as rejectedLawsFile:
                rejectedLaws = json.load(rejectedLawsFile)
        except:
            pass
    
    for existingLawId in acceptedLaws.keys():
        for versionId in acceptedLaws[existingLawId]['versions'].keys():
            if acceptedLaws[existingLawId]['versions'][versionId]['content'] == proposedLaw:
                raise Exception('the proposed law already exists as an accepted law')
    
    for existingLawId in proposedLaws.keys():
        for versionId in proposedLaws[existingLawId]['versions'].keys():
            if proposedLaws[existingLawId]['versions'][versionId]['content'] == proposedLaw:
                raise Exception('the proposed law already exists as a proposed law')
            
    for existingLawId in rejectedLaws.keys():
        for versionId in rejectedLaws[existingLawId]['versions'].keys():
            if rejectedLaws[existingLawId]['versions'][versionId]['content'] == proposedLaw:
                if rejectedLaws[existingLawId]['versions'][versionId]['rejectedTime']+MINIMUM_LAW_DURATION>int(time.time()):
                    raise Exception('the proposed law was rejected less than 28 days ago')
    
    users[username]['proposedLaws'].append(newLawId+':1')
    
    proposedLaws[newLawId] = {'title':proposedLawTitle, 'category':proposedLawCategory, 'expedite':expedite, 'expediteDate':expediteDate, 'versions':{1:{'content':proposedLaw, 'yes':1, 'no':0}}}
    if useS3Bucket:
        jsonDataByFileName = {'users.json': json.dumps(users),'proposedLaws.json': json.dumps(proposedLaws)}
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
            
        with open('data/proposedLaws.json', 'w') as proposedLawsFile:
            json.dump(proposedLaws, proposedLawsFile)
    
    return({})
    
def proposeAbrogationLaw(payload):
    username = payload['username']
    lawId = payload['lawId']
    try:
        replace = payload['replace']
        replacementLaw = payload['replacementLaw']
    except:
        replace = False
        replacementLaw = None
    
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['users.json', 'proposedLaws.json', 'acceptedLaws.json', 'rejectedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            users = dataByFileName['users.json']
        except:
            users = {}
        try:
            proposedLaws = dataByFileName['proposedLaws.json']
        except:
            proposedLaws = {}
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
        try:
            rejectedLaws = dataByFileName['rejectedLaws.json']
        except:
            rejectedLaws = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            raise Exception('no users found, use createUser.py')
        
        if users.get(username) == None:
            raise Exception('no user with username : '+username+'\nplease use createUser.py')
        
        proposedLaws = {}
        try:
            with open('data/proposedLaws.json') as proposedLawsFile:
                proposedLaws = json.load(proposedLawsFile)
        except:
            pass
        
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
        
        rejectedLaws = {}
        try:
            with open('data/rejectedLaws.json') as rejectedLawsFile:
                rejectedLaws = json.load(rejectedLawsFile)
        except:
            pass
    
    if acceptedLaws.get(lawId) == None:
        raise Exception('no accepted law with id : '+lawId)
    
    if acceptedLaws[lawId]['expedite']:
        raise Exception('expedite laws can not be abrogated')
    
    if proposedLaws.get(lawId) != None:
        raise Exception('law with id '+lawId+' is already being voted on')
    
    for versionNumber in acceptedLaws[lawId]['versions'].keys():
        if acceptedLaws[lawId]['versions'][versionNumber]['acceptedTime']+MINIMUM_LAW_DURATION>int(time.time()):
            raise Exception('cannot abrogate a law that was accepted less than 28 days ago.')
        proposedLaws[lawId] = {'title':acceptedLaws[lawId]['title'],'category':acceptedLaws[lawId]['category'],'expedite':acceptedLaws[lawId]['expedite'],'expediteDate':acceptedLaws[lawId]['expediteDate'],'versions':{versionNumber:{'content':acceptedLaws[lawId]['versions'][versionNumber]['content'], 'yes':0, 'no':1}}}
        
        for userkey in users.keys():
            if users[userkey]['votedLaws'].get(lawId+':'+versionNumber) != None:
                users[userkey]['votedLaws'].pop(lawId+':'+versionNumber)
            if lawId+':'+versionNumber in users[userkey]['proposedLaws']:
                users[userkey]['proposedLaws'].remove(lawId+':'+versionNumber)
        
        users[username]['proposedLaws'].append(lawId+':'+str(versionNumber))
    
    if replace:
        for existingLawId in acceptedLaws.keys():
            for versionId in acceptedLaws[existingLawId]['versions'].keys():
                if acceptedLaws[existingLawId]['versions'][versionId]['content'] == replacementLaw:
                    raise Exception('the proposed law already exists as an accepted law')
        
        for existingLawId in proposedLaws.keys():
            for versionId in proposedLaws[existingLawId]['versions'].keys():
                if proposedLaws[existingLawId]['versions'][versionId]['content'] == replacementLaw:
                    raise Exception('the proposed law already exists as a proposed law')
                
        for existingLawId in rejectedLaws.keys():
            for versionId in rejectedLaws[existingLawId]['versions'].keys():
                if rejectedLaws[existingLawId]['versions'][versionId]['content'] == replacementLaw:
                    if rejectedLaws[existingLawId]['versions'][versionId]['rejectedTime']+MINIMUM_LAW_DURATION>int(time.time()):
                        raise Exception('the proposed law was rejected less than 28 days ago')
                    
        versionNumbers = list(proposedLaws[lawId]['versions'].keys())
        if rejectedLaws.get(lawId) != None:
            versionNumbers += list(rejectedLaws[lawId]['versions'].keys())
        if acceptedLaws.get(lawId) != None:
            versionNumbers += list(acceptedLaws[lawId]['versions'].keys())
        versionNumber = max(int(l) for l in versionNumbers) + 1
        proposedLaws[lawId]['versions'][versionNumber] = {
            'content':replacementLaw,
            'yes':1,
            'no' :0
            }
        users[username]['proposedLaws'].append(lawId+':'+str(versionNumber))
    
    if useS3Bucket:
        jsonDataByFileName = {'users.json': json.dumps(users),'proposedLaws.json': json.dumps(proposedLaws)}
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
        
        with open('data/proposedLaws.json', 'w') as proposedLawsFile:
            json.dump(proposedLaws, proposedLawsFile)
    
    return({})
    
    
        
def getLawsToVote(payload):
    checkExpedites({})
    username = payload['username']
    
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['users.json', 'proposedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            users = dataByFileName['users.json']
        except:
            users = {}
        try:
            proposedLaws = dataByFileName['proposedLaws.json']
        except:
            proposedLaws = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            raise Exception('no users found, use createUser.py')
        
        if users.get(username) == None:
            raise Exception('no user with username : '+username+'\nplease use createUser.py')
        
        proposedLaws = {}
        try:
            with open('data/proposedLaws.json') as proposedLawsFile:
                proposedLaws = json.load(proposedLawsFile)
        except:
            pass
    
    users[username]['latestActivity'] = int(time.time())
    
    lawsToVote = {}
    
    for lawId in proposedLaws.keys():
        for versionNumber in proposedLaws[lawId]['versions'].keys():
            if (lawId+':'+versionNumber not in users[username]['proposedLaws']) and (lawId+':'+versionNumber not in users[username]['votedLaws']):
                if lawsToVote.get(lawId) == None:
                    lawsToVote[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{}}
                lawsToVote[lawId]['versions'][versionNumber] = proposedLaws[lawId]['versions'][versionNumber]
    
    if useS3Bucket:
        jsonDataByFileName = {'users.json': json.dumps(users)}
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
    
    return lawsToVote
    
def getAcceptedLaws(payload):
    checkExpedites({})
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['acceptedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
    else:
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
    
    return acceptedLaws

def getNonExpediteAcceptedLaws(payload):
    checkExpedites({})
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['acceptedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
    else:
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
    
    nonExpediteAcceptedLaws = {}
    for lawId in acceptedLaws.keys():
        if not acceptedLaws[lawId]['expedite']:
            nonExpediteAcceptedLaws[lawId] = acceptedLaws[lawId]
    

    return nonExpediteAcceptedLaws

def checkExpedites(payload):
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['users.json', 'proposedLaws.json', 'acceptedLaws.json', 'rejectedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            users = dataByFileName['users.json']
        except:
            users = {}
        try:
            proposedLaws = dataByFileName['proposedLaws.json']
        except:
            proposedLaws = {}
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
        try:
            rejectedLaws = dataByFileName['rejectedLaws.json']
        except:
            rejectedLaws = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            raise Exception('no users found, use createUser.py')
        
        proposedLaws = {}
        try:
            with open('data/proposedLaws.json') as proposedLawsFile:
                proposedLaws = json.load(proposedLawsFile)
        except:
            pass
        
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
        
        rejectedLaws = {}
        try:
            with open('data/rejectedLaws.json') as rejectedLawsFile:
                rejectedLaws = json.load(rejectedLawsFile)
        except:
            pass
    lawIds = [lawId for lawId in proposedLaws.keys()]
    for lawId in lawIds:
        if proposedLaws[lawId]['expedite'] and (int(time.time()) > proposedLaws[lawId]['expediteDate']):
            karmaByVersion = {}
            yesByVersion = {}
            for versionNumber in proposedLaws[lawId]['versions'].keys():
                karmaByVersion[versionNumber] = proposedLaws[lawId]['versions'][versionNumber]['yes'] - proposedLaws[lawId]['versions'][versionNumber]['no']
            maxKarma = max(karmaByVersion.values())
            maxKarmaVersions = [versionNumber for versionNumber in karmaByVersion if karmaByVersion[versionNumber] == maxKarma]
            karmaByVersion = {versionNumber:karmaByVersion[versionNumber] for versionNumber in maxKarmaVersions if versionNumber in karmaByVersion}
            if len(maxKarmaVersions) == 1:
                acceptedLawVersionNumber = maxKarmaVersions[0]
            else:
                for versionNumber in maxKarmaVersions:
                    yesByVersion[versionNumber] = proposedLaws[lawId]['versions'][versionNumber]['yes']
                maxYes = max(yesByVersion.values())
                maxYesVersions = [versionNumber for versionNumber in yesByVersion if yesByVersion[versionNumber] == maxYes]
                acceptedLawVersionNumber = maxYesVersions[0] # This is arbitrary but it would be very rare that maxYesVersions has more than 1 version in it.
            versionsToRemove = []
            removeLaw = False
            for versionNumber in proposedLaws[lawId]['versions'].keys():
                if versionNumber == acceptedLawVersionNumber:
                    if acceptedLaws.get(lawId) != None:
                        acceptedLaws.pop(lawId)
                    proposedLaws[lawId]['versions'][versionNumber]['acceptedTime'] = proposedLaws[lawId]['expediteDate']
                    acceptedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                    if rejectedLaws.get(lawId) == None:
                        rejectedLaws[lawId] = proposedLaws[lawId]
                        rejectedLaws[lawId]['versions'].pop(versionNumber)
                    else:
                        rejectedLaws[lawId].update(proposedLaws[lawId])
                        rejectedLaws[lawId]['versions'].pop(versionNumber)
                    removeLaw = True
                    break
                else:
                    proposedLaws[lawId]['versions'][versionNumber]['rejectedTime'] = int(time.time())
                    if rejectedLaws.get(lawId) == None:
                        rejectedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                    else:
                        rejectedLaws[lawId]['versions'].update({versionNumber:proposedLaws[lawId]['versions'][versionNumber]})
                    versionsToRemove.append(versionNumber)
                    if acceptedLaws.get(lawId) != None:
                        if acceptedLaws[lawId]['versions'].get(versionNumber) != None:
                            acceptedLaws.pop(lawId)
            if proposedLaws.get(lawId) != None:
                for versionNumber in versionsToRemove:
                    proposedLaws[lawId]['versions'].pop(versionNumber)
                if (not proposedLaws[lawId]) or removeLaw:
                    proposedLaws.pop(lawId)
                if (rejectedLaws.get(lawId) != None and not rejectedLaws[lawId]):
                    rejectedLaws.pop(lawId)
        
    if useS3Bucket:
        jsonDataByFileName = {
            'users.json': json.dumps(users),
            'proposedLaws.json': json.dumps(proposedLaws),
            'acceptedLaws.json': json.dumps(acceptedLaws),
            'rejectedLaws.json': json.dumps(rejectedLaws)
            }
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
        
        with open('data/proposedLaws.json', 'w') as proposedLawsFile:
            json.dump(proposedLaws, proposedLawsFile)
            
        with open('data/acceptedLaws.json', 'w') as acceptedLawsFile:
            json.dump(acceptedLaws, acceptedLawsFile)
            
        with open('data/rejectedLaws.json', 'w') as rejectedLawsFile:
            json.dump(rejectedLaws, rejectedLawsFile)
        
    return({})
    
def vote(payload):
    username = payload['username']
    lawId = payload['lawId']
    votes = payload['votes']
    try:
        amend = payload['amend']
        amendedLaw = payload['amendedLaw']
    except:
        amend = False
        amendedLaw = None
    try:
        with open('settings.json', 'r') as settingsFile:
            settings = json.load(settingsFile)
            useS3Bucket = settings['useS3Bucket']
    except:
        useS3Bucket = False

    if not useS3Bucket:
        if not os.path.exists('data'):
            os.makedirs('data')
    if useS3Bucket:
        inputFileNames = ['users.json', 'proposedLaws.json', 'acceptedLaws.json', 'rejectedLaws.json']
        dataByFileName = readFromS3(inputFileNames)
        try:
            users = dataByFileName['users.json']
        except:
            users = {}
        try:
            proposedLaws = dataByFileName['proposedLaws.json']
        except:
            proposedLaws = {}
        try:
            acceptedLaws = dataByFileName['acceptedLaws.json']
        except:
            acceptedLaws = {}
        try:
            rejectedLaws = dataByFileName['rejectedLaws.json']
        except:
            rejectedLaws = {}
    else:
        users = {}
        try:
            with open('data/users.json') as usersFile:
                users = json.load(usersFile)
        except:
            raise Exception('no users found, use createUser.py')
        
        if users.get(username) == None:
            raise Exception('no user with username : '+username+'\nplease use createUser.py')
        
        proposedLaws = {}
        try:
            with open('data/proposedLaws.json') as proposedLawsFile:
                proposedLaws = json.load(proposedLawsFile)
        except:
            pass
        
        acceptedLaws = {}
        try:
            with open('data/acceptedLaws.json') as acceptedLawsFile:
                acceptedLaws = json.load(acceptedLawsFile)
        except:
            pass
        
        rejectedLaws = {}
        try:
            with open('data/rejectedLaws.json') as rejectedLawsFile:
                rejectedLaws = json.load(rejectedLawsFile)
        except:
            pass
    
    if proposedLaws.get(lawId) == None:
        raise Exception('no law with id : '+lawId)
    
    if proposedLaws[lawId]['expedite'] and (int(time.time()) > proposedLaws[lawId]['expediteDate']):
        karmaByVersion = {}
        yesByVersion = {}
        for versionNumber in proposedLaws[lawId]['versions'].keys():
            karmaByVersion[versionNumber] = proposedLaws[lawId]['versions'][versionNumber]['yes'] - proposedLaws[lawId]['versions'][versionNumber]['no']
        maxKarma = max(karmaByVersion.values())
        maxKarmaVersions = [versionNumber for versionNumber in karmaByVersion if karmaByVersion[versionNumber] == maxKarma]
        karmaByVersion = {versionNumber:karmaByVersion[versionNumber] for versionNumber in maxKarmaVersions if versionNumber in karmaByVersion}
        if len(maxKarmaVersions) == 1:
            acceptedLawVersionNumber = maxKarmaVersions[0]
        else:
            for versionNumber in maxKarmaVersions:
                yesByVersion[versionNumber] = proposedLaws[lawId]['versions'][versionNumber]['yes']
            maxYes = max(yesByVersion.values())
            maxYesVersions = [versionNumber for versionNumber in yesByVersion if yesByVersion[versionNumber] == maxYes]
            acceptedLawVersionNumber = maxYesVersions[0] # This is arbitrary but it would be very rare that maxYesVersions has more than 1 version in it.
        versionsToRemove = []
        removeLaw = False
        for versionNumber in proposedLaws[lawId]['versions'].keys():
            if versionNumber == acceptedLawVersionNumber:
                if acceptedLaws.get(lawId) != None:
                    acceptedLaws.pop(lawId)
                proposedLaws[lawId]['versions'][versionNumber]['acceptedTime'] = proposedLaws[lawId]['expediteDate']
                acceptedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                if rejectedLaws.get(lawId) == None:
                    rejectedLaws[lawId] = proposedLaws[lawId]
                    rejectedLaws[lawId]['versions'].pop(versionNumber)
                else:
                    rejectedLaws[lawId].update(proposedLaws[lawId])
                    rejectedLaws[lawId]['versions'].pop(versionNumber)
                removeLaw = True
                break
            else:
                proposedLaws[lawId]['versions'][versionNumber]['rejectedTime'] = int(time.time())
                if rejectedLaws.get(lawId) == None:
                    rejectedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                else:
                    rejectedLaws[lawId]['versions'].update({versionNumber:proposedLaws[lawId]['versions'][versionNumber]})
                versionsToRemove.append(versionNumber)
                if acceptedLaws.get(lawId) != None:
                    if acceptedLaws[lawId]['versions'].get(versionNumber) != None:
                        acceptedLaws.pop(lawId)
    else:
        if amend:
            for existingLawId in acceptedLaws.keys():
                for versionId in acceptedLaws[existingLawId]['versions'].keys():
                    if acceptedLaws[existingLawId]['versions'][versionId]['content'] == amendedLaw:
                        raise Exception('the proposed law already exists as an accepted law')
            
            for existingLawId in proposedLaws.keys():
                for versionId in proposedLaws[existingLawId]['versions'].keys():
                    if proposedLaws[existingLawId]['versions'][versionId]['content'] == amendedLaw:
                        raise Exception('the proposed law already exists as a proposed law')
                    
            for existingLawId in rejectedLaws.keys():
                for versionId in rejectedLaws[existingLawId]['versions'].keys():
                    if rejectedLaws[existingLawId]['versions'][versionId]['content'] == amendedLaw:
                        if rejectedLaws[existingLawId]['versions'][versionId]['rejectedTime']+MINIMUM_LAW_DURATION>int(time.time()):
                            raise Exception('the proposed law was rejected less than 28 days ago')
            versionNumbers = list(proposedLaws[lawId]['versions'].keys())
            if rejectedLaws.get(lawId) != None:
                versionNumbers += list(rejectedLaws[lawId]['versions'].keys())
            if acceptedLaws.get(lawId) != None:
                versionNumbers += list(acceptedLaws[lawId]['versions'].keys())
            versionNumber = max(int(l) for l in versionNumbers) + 1
        
            proposedLaws[lawId]['versions'][versionNumber] = {
                'content':amendedLaw,
                'yes':1,
                'no' :0
                }
            users[username]['proposedLaws'].append(lawId+':'+str(versionNumber))
            
        for versionNumber in votes.keys():
            if votes[versionNumber] == 'yes':
                proposedLaws[lawId]['versions'][versionNumber]['yes'] += 1
                users[username]['votedLaws'][lawId+':'+str(versionNumber)] = True
            elif votes[versionNumber] == 'no':
                proposedLaws[lawId]['versions'][versionNumber]['no'] += 1
                users[username]['votedLaws'][lawId+':'+str(versionNumber)] = False
        numberOfActiveUsers = countActiveUsers(users)
        majority = int(numberOfActiveUsers/2 + 1)
        half = numberOfActiveUsers/2
        versionsToRemove = []
        removeLaw = False
        for versionNumber in proposedLaws[lawId]['versions'].keys():
            if proposedLaws[lawId]['versions'][versionNumber]['yes'] >= majority:
                if acceptedLaws.get(lawId) != None:
                    acceptedLaws.pop(lawId)
                proposedLaws[lawId]['versions'][versionNumber]['acceptedTime'] = int(time.time())
                acceptedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                if rejectedLaws.get(lawId) == None:
                    rejectedLaws[lawId] = proposedLaws[lawId]
                    rejectedLaws[lawId]['versions'].pop(versionNumber)
                else:
                    rejectedLaws[lawId].update(proposedLaws[lawId])
                    rejectedLaws[lawId]['versions'].pop(versionNumber)
                removeLaw = True
                break
            elif proposedLaws[lawId]['versions'][versionNumber]['no'] >= half:
                proposedLaws[lawId]['versions'][versionNumber]['rejectedTime'] = int(time.time())
                if rejectedLaws.get(lawId) == None:
                    rejectedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'category':proposedLaws[lawId]['category'],'expedite':proposedLaws[lawId]['expedite'],'expediteDate':proposedLaws[lawId]['expediteDate'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
                else:
                    rejectedLaws[lawId]['versions'].update({versionNumber:proposedLaws[lawId]['versions'][versionNumber]})
                versionsToRemove.append(versionNumber)
                if acceptedLaws.get(lawId) != None:
                    if acceptedLaws[lawId]['versions'].get(versionNumber) != None:
                        acceptedLaws.pop(lawId)
    if proposedLaws.get(lawId) != None:
        for versionNumber in versionsToRemove:
            proposedLaws[lawId]['versions'].pop(versionNumber)
        if (not proposedLaws[lawId]['versions']) or removeLaw:
            proposedLaws.pop(lawId)
        if (rejectedLaws.get(lawId) != None and not rejectedLaws[lawId]['versions']):
            rejectedLaws.pop(lawId)
        
    if useS3Bucket:
        jsonDataByFileName = {
            'users.json': json.dumps(users),
            'proposedLaws.json': json.dumps(proposedLaws),
            'acceptedLaws.json': json.dumps(acceptedLaws),
            'rejectedLaws.json': json.dumps(rejectedLaws)
            }
        writeToS3(jsonDataByFileName)
    else:
        with open('data/users.json', 'w') as usersFile:
            json.dump(users, usersFile)
        
        with open('data/proposedLaws.json', 'w') as proposedLawsFile:
            json.dump(proposedLaws, proposedLawsFile)
            
        with open('data/acceptedLaws.json', 'w') as acceptedLawsFile:
            json.dump(acceptedLaws, acceptedLawsFile)
            
        with open('data/rejectedLaws.json', 'w') as rejectedLawsFile:
            json.dump(rejectedLaws, rejectedLawsFile)
        
    return({})

def countActiveUsers(users):
    minimumLatestActivity = int(time.time()) - ACTIVE_USER_TIMEOUT
    numberOfActiveUsers = 0
    for username in users.keys():
        if (users[username]['latestActivity'] >= minimumLatestActivity):
            numberOfActiveUsers += 1
    return numberOfActiveUsers

def generateNewId():
    import uuid
    proposedLaws = {}
    try:
        with open('data/proposedLaws.json') as proposedLawsFile:
            proposedLaws = json.load(proposedLawsFile)
    except :
        pass
    acceptedLaws = {}  
    try:
        with open('data/acceptedLaws.json') as acceptedLawsFile:
            acceptedLaws = json.load(acceptedLawsFile)
    except :
        pass
    rejectedLaws = {}
    try:
        with open('data/rejectedLaws.json') as rejectedLawsFile:
            rejectedLaws = json.load(rejectedLawsFile)
    except :
        pass
    usedIds = list(proposedLaws.keys()) + list(acceptedLaws.keys()) + list(rejectedLaws.keys())
    
    newId = str(uuid.uuid4())
    while newId in usedIds:
        newId = str(uuid.uuid4())
    
    return newId

def readFromS3(filenames):
    import boto3
    
    with open('credentials.pem', 'r') as credentialsFile:
        creds = credentialsFile.read().split('\n')
    
    s3 = boto3.client('s3',
        aws_access_key_id=creds[0],
        aws_secret_access_key=creds[1]
    )
    
    dataByFileName = {}
    
    for filename in filenames:
        try:
            dataByFileName[filename] = json.loads(s3.get_object(Bucket=creds[2], Key=filename)['Body'].read().decode('utf-8'))
        except:
            dataByFileName[filename] = {}
    
    return dataByFileName
    
def writeToS3(jsonDataByFileName):
    import boto3
    
    with open('credentials.pem', 'r') as credentialsFile:
        creds = credentialsFile.read().split('\n')
    
    s3 = boto3.client('s3',
        aws_access_key_id=creds[0],
        aws_secret_access_key=creds[1]
    )
    
    
    for filename in jsonDataByFileName.keys():
        s3.put_object(
            Body=jsonDataByFileName[filename],
            Bucket=creds[2],
            Key=filename
        )

