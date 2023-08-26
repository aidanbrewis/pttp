import pttp
import json

print('Loading function')

def lambda_handler(event, context):
    '''Provide an event that contains the following keys:

      - operation: one of the operations in the operations dict below
      - payload: a JSON object containing parameters to pass to the 
                 operation being performed
    '''

    operation = event['operation']

    operations = {
        'createUser': pttp.createUser,
        'proposeLaw': pttp.proposeLaw,
        'proposeAbrogationLaw': pttp.proposeAbrogationLaw,
        'getLawsToVote': pttp.getLawsToVote,
        'getVotedLaws' : pttp.getVotedLaws,
        'getAcceptedLaws': pttp.getAcceptedLaws,
        'getNonExpediteAcceptedLaws' : pttp.getNonExpediteAcceptedLaws,
        'checkExpedites' : pttp.checkExpedites,
        'vote' : pttp.vote
    }

    if operation in operations:
        return operations[operation](event.get('payload'))
    else:
        raise ValueError('Unrecognized operation "{}"'.format(operation))