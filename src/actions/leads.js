import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const LEADS_ENDPOINT = endpoints.leads;

// Initialize DynamoDB client with Cognito credentials
const getDynamoDBClient = (idToken) => {
  const region = import.meta.env.VITE_AWS_AMPLIFY_REGION;
  const identityPoolId = import.meta.env.VITE_AWS_IDENTITY_POOL_ID;
  const userPoolId = import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID;

  const client = new DynamoDBClient({
    region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId,
      logins: {
        [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: idToken
      }
    })
  });

  return DynamoDBDocumentClient.from(client);
};

export async function getLeads(customerId, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const items = [];
        let lastEvaluatedKey = null;

        // Paginate through all results
        while (true) {
            const command = new QueryCommand({
                TableName: `lifejacketleads-leads-${tableEnv}`,
                IndexName: "CustomerId-index",
                KeyConditionExpression: 'CustomerId = :customerId',
                ExpressionAttributeValues: {
                    ':customerId': customerId
                },
                ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
            });

            const response = await docClient.send(command);
            items.push(...response.Items);

            lastEvaluatedKey = response.LastEvaluatedKey;
            if (!lastEvaluatedKey) {
                break;
            }
        }

        // Sort by Delivered date (newest first)
        const sortedItems = items.sort((a, b) => {
            try {
                const dateA = new Date(a.Delivered.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})/, '$3-$1-$2T$4:$5:$6'));
                const dateB = new Date(b.Delivered.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})/, '$3-$1-$2T$4:$5:$6'));
                return dateB - dateA; // newest first
            } catch {
                return 0;
            }
        });

        return [sortedItems, sortedItems];
    } catch (error) {
        console.error('Error fetching leads from DynamoDB:', error);
        throw error;
    }
}

export async function updateLead(contact_id, status, email, note, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const command = new UpdateCommand({
            TableName: `lifejacketleads-leads-${tableEnv}`,
            Key: {
                contact_id: contact_id
            },
            UpdateExpression: "SET #s = :status, #n = :note",
            ExpressionAttributeNames: {
                "#s": "Status",
                "#n": "Note"
            },
            ExpressionAttributeValues: {
                ":status": status,
                ":note": note
            },
            ReturnValues: "UPDATED_NEW"
        });

        const response = await docClient.send(command);

        return response.Attributes;
    } catch (error) {
        console.error('Error updating lead in DynamoDB:', error);
        throw error;
    }
}

export async function exportLeads(exportRows) {
    const data = exportRows;
    const response = await axios.post(LEADS_ENDPOINT, data, { params: { endpoint: 'export-leads' } })
    const response_data = await response.data
    
    return response_data
}
