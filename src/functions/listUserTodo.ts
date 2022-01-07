
import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';
import { validate } from 'uuid';

export const handle: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters

    if (!validate(user_id)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Invalid user',
            }),
            headers: {
                'Content-type': 'application/json'
            }
        }
    }

    const response = await document.scan({
        TableName: 'serverless_todo',
        FilterExpression: ':user_id = user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id,
        },
    }).promise();

    const userTodos = response.Items

    return {
        statusCode: 200,
        body: userTodos.length == 0 ? 
            JSON.stringify({
                message: 'There is no todos for this user'
            }) :
            JSON.stringify({
                todos: userTodos
            }),
        headers: {
            "Content-type": "application/json"
        }
    }
}