import pttp

username = input('please type your username : ')

lawsToVote = pttp.getLawsToVote(username)
if lawsToVote:
    lawId = list(lawsToVote.keys())[0]
    print('the law to vote on has the following versions :')
    for amendmentNumber in lawsToVote[lawId].keys():
        print(amendmentNumber+'. '+lawsToVote[lawId][amendmentNumber]['content'])
            
    print('to vote on the existing law and its amendments just press enter')
    
    amendString = input('if you wish to vote no to all existing amendments\nand want to write a new amendment type amend : ')
    votes = {}
    
    if amendString.lower() == 'amend':
        print('you have chosen to write a new amendment')
        amendedLaw = input('please type the full amended law you wish to propose below :\n')
        for versionNumber in lawsToVote[lawId].keys():
            votes[versionNumber] = 'no'
        pttp.vote(username=username, lawId=lawId, votes=votes, amend=True, amendedLaw=amendedLaw)
        print('your amendmend has been submitted for voting.')
    else:
        print('please type yes or no after each version of the law.')
        for versionNumber in lawsToVote[lawId].keys():
            print(versionNumber+'. '+lawsToVote[lawId][versionNumber]['content'])
            vote = input('please vote by typing yes or no : ')
            while vote.lower() not in ['yes', 'no']:
                print('invalid vote.')
                vote = input('please vote by typing yes or no : ')
            votes[versionNumber] = vote

        pttp.vote(username, lawId, votes)

        print('your votes have been counted.')
else:
    print('no laws to vote on.')