import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

export async function getLeadCredit(customerId, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        // Scan campaigns table
        const campaignsCommand = new ScanCommand({
            TableName: `lifejacketleads-campaigns-${tableEnv}`
        });

        // Query customer table
        const customerCommand = new QueryCommand({
            TableName: `lifejacketleads-customers-${tableEnv}`,
            KeyConditionExpression: 'CustomerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        });

        const [campaignsResponse, customerResponse] = await Promise.all([
            docClient.send(campaignsCommand),
            docClient.send(customerCommand)
        ]);

        const campaigns = campaignsResponse.Items || [];
        const customer = customerResponse.Items[0];

        if (!customer) {
            throw new Error('Customer not found');
        }

        const lead_credit = {
            StateLicenses: customer.StateLicenses || [],
            Status: customer.Status || 'Unknown',
            LeadType: customer.LeadType || {}
        };

        // Build lead credit object for each campaign
        for (const campaign of campaigns) {
            const leadType = campaign.LeadType;
            if (leadType && customer.LeadType && customer.LeadType[leadType]) {
                lead_credit[`${leadType}Fresh`] = customer.LeadType[leadType]?.Fresh?.Credit || 0;
                lead_credit[`${leadType}Aged`] = customer.LeadType[leadType]?.Aged?.Credit || 0;
            }
        }

        return lead_credit;
    } catch (error) {
        console.error('Error retrieving lead credits from DynamoDB:', error);
        throw error;
    }
}

