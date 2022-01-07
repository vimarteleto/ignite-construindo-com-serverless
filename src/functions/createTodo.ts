
import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';
import { v4 as uuidv4 } from 'uuid';

interface ICreateTodo {
    title: string;
    deadline: string;
}

interface ITemplate {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo

    const todo: ITemplate = {
        id: uuidv4(),
        user_id: user_id,
        title,
        done: false,
        deadline: new Date(deadline).toISOString(),
    }

    await document.put({
        TableName: 'serverless_todo',
        Item: todo
    }).promise()


    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo created',
        }),
        headers: {
            'Content-type': 'application/json'
        }
    }

}