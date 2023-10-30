import pttp
import json

print('Loading function')


def lambda_handler(event, context):
    '''Provide an event that contains the following keys:

      - operation: one of the operations in the operations dict below
      - payload: a JSON object containing parameters to pass to the 
                 operation being performed
    '''
    cognitoRequest = event.get('request')

    if cognitoRequest:
        if cognitoRequest['triggerSource'] == 'PreSignUp_SignUp':
            username = cognitoRequest['userAttributes']['email']
            event['response'] = pttp.createUser({'username': username})
            return event
        elif cognitoRequest['triggerSource'] == 'PostConfirmation_ConfirmSignUp':
            username = cognitoRequest['userAttributes']['email']
            event['response'] = pttp.updateActivity({'username': username})

    operation = event['operation']

    operations = {
        'proposeLaw': pttp.proposeLaw,
        'proposeAbrogationLaw': pttp.proposeAbrogationLaw,
        'checkExpedites': pttp.checkExpedites,
        'vote': pttp.vote
    }

    if operation in operations:
        return operations[operation](event.get('payload'))
    else:
        raise ValueError('Unrecognized operation "{}"'.format(operation))
