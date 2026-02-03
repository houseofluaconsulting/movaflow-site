import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CUSTOMER_ENDPOINT = endpoints.customer;

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

export async function getCustomer(customerId, idToken) {
    try {

        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;
        const command = new GetCommand({
            TableName: `lifejacketleads-customers-${tableEnv}`,
            Key: {
                CustomerId: customerId
            }
        });

        const response = await docClient.send(command);
        const customer = response.Item;

        if (!customer) {
            throw new Error('Customer not found');
        }

        const user_data = {
            ID: customer.ID,
            Phone: customer.Phone,
            Email: customer.Email,
            Name: customer.Name,
            StripeId: customer.StripeId,
            StateLicenses: customer.StateLicenses,
            RingySIDVeteranWebsite: customer.LeadType?.VeteranWebsite?.Fresh?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenVeteranWebsite: customer.LeadType?.VeteranWebsite?.Fresh?.CRMIntegration?.Ringy?.AuthToken,
            RingySIDVeteranWebsiteAged: customer.LeadType?.VeteranWebsite?.Aged?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenVeteranWebsiteAged: customer.LeadType?.VeteranWebsite?.Aged?.CRMIntegration?.Ringy?.AuthToken,
            RingySIDLegacyWebsite: customer.LeadType?.LegacyWebsite?.Fresh?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenLegacyWebsite: customer.LeadType?.LegacyWebsite?.Fresh?.CRMIntegration?.Ringy?.AuthToken,
            RingySIDLegacyWebsiteAged: customer.LeadType?.LegacyWebsite?.Aged?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenLegacyWebsiteAged: customer.LeadType?.LegacyWebsite?.Aged?.CRMIntegration?.Ringy?.AuthToken,
            GHLAccessToken: customer.CRMIntegration?.GoHighLevel?.AccessToken,
            GHLocationID: customer.CRMIntegration?.GoHighLevel?.LocationID,
            CloseCRMAPIKey: customer.CRMIntegration?.CloseCRM?.APIKey,
            CloseCRMLeadSourceCustomField: customer.CRMIntegration?.CloseCRM?.LeadSourceCustomField,
            EmailNotifications: customer.CRMIntegration?.EmailNotifications
        }

        return user_data;
    } catch (error) {
        console.error('Error fetching customer from DynamoDB:', error);
        throw error;
    }
}

export async function updateCustomer(id, stateLicenses, ringyAuthTokenVeteranWebsite, ringySIDVeteranWebsite, ringyAuthTokenVeteranWebsiteAged, ringySIDVeteranWebsiteAged, ringyAuthTokenLegacyWebsite, ringySIDLegacyWebsite, ringyAuthTokenLegacyWebsiteAged, ringySIDLegacyWebsiteAged, ghlAccessToken, ghlLocationID, closeCRMAPIKey, closeCRMLeadSourceCustomField, emailNotifications) {
    const data = { id , stateLicenses, ringyAuthTokenVeteranWebsite, ringySIDVeteranWebsite, ringyAuthTokenVeteranWebsiteAged, ringySIDVeteranWebsiteAged, ringyAuthTokenLegacyWebsite, ringySIDLegacyWebsiteAged, ringyAuthTokenLegacyWebsiteAged, ringySIDLegacyWebsite, ghlAccessToken, ghlLocationID, closeCRMAPIKey, closeCRMLeadSourceCustomField, emailNotifications};

    const response = await axios.post(CUSTOMER_ENDPOINT, data, { params: { endpoint: 'update-customer' } })
    const response_data = await response.data
    
    console.log(response_data)

    return response_data
}

export async function getCustomerOrders(customerId, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const items = [];
        let lastEvaluatedKey = null;

        // Paginate through all results
        while (true) {
            const command = new QueryCommand({
                TableName: `lifejacketleads-orders-${tableEnv}`,
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

        // Format data
        const formattedItems = items.map(item => {
            const formattedItem = { ...item };

            // Handle Credit field
            if (formattedItem.Credit) {
                formattedItem.CreditFresh = formattedItem.Credit.Fresh || 0;
                formattedItem.CreditAged = formattedItem.Credit.Aged || 0;
                delete formattedItem.Credit;
            }

            // Format Amount
            if (formattedItem.Amount) {
                formattedItem.Amount = `$${formattedItem.Amount}`;
            }

            return formattedItem;
        });

        // Sort by Created timestamp descending (newest first)
        const sortedItems = formattedItems.sort((a, b) => {
            const createdA = a.Created || '';
            const createdB = b.Created || '';
            return createdB.localeCompare(createdA);
        });

        return sortedItems;
    } catch (error) {
        console.error('Error fetching orders from DynamoDB:', error);
        throw error;
    }
}