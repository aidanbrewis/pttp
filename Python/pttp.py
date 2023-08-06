import json
import time
import os

MINIMUM_LAW_DURATION = 2419200 #28 days in seconds

def createUser(payload):
    arguments = json.loads(payload)
    username = arguments['username']
    
    if not os.path.exists('data'):
        os.makedirs('data')

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
            'votedLaws' : {}
        }
    with open('data/users.json', 'w') as usersFile:
        json.dump(users, usersFile)
    
    return(json.dumps({}))

def proposeLaw(payload):
    arguments = json.loads(payload)
    username = arguments['username']
    proposedLaw = arguments['proposedLaw']
    proposedLawTitle = arguments['proposedLawTitle']
    
    newLawId = generateNewId()
    
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
    
    proposedLaws[newLawId] = {'title':proposedLawTitle, 'versions':{1:{'content':proposedLaw, 'yes':1, 'no':0}}}
    with open('data/users.json', 'w') as usersFile:
        json.dump(users, usersFile)
        
    with open('data/proposedLaws.json', 'w') as proposedLawsFile:
        json.dump(proposedLaws, proposedLawsFile)
    
    return(json.dumps({}))
    
def proposeAbrogationLaw(payload):
    arguments = json.loads(payload)
    username = arguments['username']
    lawId = arguments['lawId']
    try:
        replace = arguments['replace']
        replacementLaw = arguments['replacementLaw']
    except:
        replace = False
        replacementLaw = None
    
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
    
    if proposedLaws.get(lawId) != None:
        raise Exception('law with id '+lawId+' is already being voted on')
    
    for versionNumber in acceptedLaws[lawId]['versions'].keys():
        if acceptedLaws[lawId]['versions'][versionNumber]['acceptedTime']+MINIMUM_LAW_DURATION>int(time.time()):
            raise Exception('cannot abrogate a law that was accepted less than 28 days ago.')
        proposedLaws[lawId] = {'title':acceptedLaws[lawId]['title'],'versions':{versionNumber:{'content':acceptedLaws[lawId]['versions'][versionNumber]['content'], 'yes':0, 'no':1}}}
        
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
    
    
    with open('data/users.json', 'w') as usersFile:
        json.dump(users, usersFile)
    
    with open('data/proposedLaws.json', 'w') as proposedLawsFile:
        json.dump(proposedLaws, proposedLawsFile)
    
    return(json.dumps({}))
    
    
        
def getLawsToVote(payload):
    arguments = json.loads(payload)
    username = arguments['username']
    
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
    
    lawsToVote = {}
    
    for lawId in proposedLaws.keys():
        for versionNumber in proposedLaws[lawId]['versions'].keys():
            if (lawId+':'+versionNumber not in users[username]['proposedLaws']) and (lawId+':'+versionNumber not in users[username]['votedLaws']):
                if lawsToVote.get(lawId) == None:
                    lawsToVote[lawId] = {'title':proposedLaws[lawId]['title'],'versions':{}}
                lawsToVote[lawId]['versions'][versionNumber] = proposedLaws[lawId]['versions'][versionNumber]
    
    if lawsToVote:
        response = json.dumps(lawsToVote)
    else:
        response = json.dumps(None)
    return response
    
def getAcceptedLaws(payload):
    acceptedLaws = {}
    try:
        with open('data/acceptedLaws.json') as acceptedLawsFile:
            acceptedLaws = json.load(acceptedLawsFile)
    except:
        pass
    
    return json.dumps(acceptedLaws)
    
def vote(payload):
    arguments = json.loads(payload)
    username = arguments['username']
    lawId = arguments['lawId']
    votes = arguments['votes']
    try:
        amend = arguments['amend']
        amendedLaw = arguments['amendedLaw']
    except:
        amend = False
        amendedLaw = None
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
    
    majority = int(len(users.keys())/2 + 1)
    half = len(users.keys())/2
    versionsToRemove = []
    removeLaw = False
    for versionNumber in proposedLaws[lawId]['versions'].keys():
        if proposedLaws[lawId]['versions'][versionNumber]['yes'] >= majority:
            if acceptedLaws.get(lawId) != None:
                acceptedLaws.pop(lawId)
            proposedLaws[lawId]['versions'][versionNumber]['acceptedTime'] = int(time.time())
            acceptedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
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
                rejectedLaws[lawId] = {'title':proposedLaws[lawId]['title'],'versions':{versionNumber:proposedLaws[lawId]['versions'][versionNumber]}}
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
        
    
    with open('data/users.json', 'w') as usersFile:
        json.dump(users, usersFile)
    
    with open('data/proposedLaws.json', 'w') as proposedLawsFile:
        json.dump(proposedLaws, proposedLawsFile)
        
    with open('data/acceptedLaws.json', 'w') as acceptedLawsFile:
        json.dump(acceptedLaws, acceptedLawsFile)
        
    with open('data/rejectedLaws.json', 'w') as rejectedLawsFile:
        json.dump(rejectedLaws, rejectedLawsFile)
        
    return(json.dumps({}))

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
    

