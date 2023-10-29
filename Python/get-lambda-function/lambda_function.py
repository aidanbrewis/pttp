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
        'getLawsToVote': pttp.getLawsToVote,
        'getVotedLaws': pttp.getVotedLaws,
        'getVotedProposedLaws': pttp.getVotedProposedLaws,
        'getAcceptedLaws': pttp.getAcceptedLaws,
        'getRejectedLaws': pttp.getRejectedLaws,
        'getNonExpediteAcceptedLaws': pttp.getNonExpediteAcceptedLaws
    }

    if operation in operations:
        return operations[operation](event.get('payload'))
    else:
        raise ValueError('Unrecognized operation "{}"'.format(operation))
