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
        username = event['userName']
        if event['triggerSource'] == 'PreSignUp_SignUp':
            email = cognitoRequest['userAttributes']['email']
            event['response'] = pttp.createUser(
                {'username': username, 'email': email})
            return event
        elif event['triggerSource'] == 'PostConfirmation_ConfirmSignUp':
            event['response'] = pttp.updateActivity({'username': username})
            return event

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
