import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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
            RingySIDLegacyMortgage: customer.LeadType?.LegacyMortgage?.Fresh?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenLegacyMortgage: customer.LeadType?.LegacyMortgage?.Fresh?.CRMIntegration?.Ringy?.AuthToken,
            RingySIDLegacyMortgageAged: customer.LeadType?.LegacyMortgage?.Aged?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenLegacyMortgageAged: customer.LeadType?.LegacyMortgage?.Aged?.CRMIntegration?.Ringy?.AuthToken,
            RingySIDFinalExpense: customer.LeadType?.FinalExpense?.Fresh?.CRMIntegration?.Ringy?.SID,
            RingyAuthTokenFinalExpense: customer.LeadType?.FinalExpense?.Fresh?.CRMIntegration?.Ringy?.AuthToken,
            GHLAccessToken: customer.CRMIntegration?.GoHighLevel?.AccessToken,
            GHLocationID: customer.CRMIntegration?.GoHighLevel?.LocationID,
            CloseCRMAPIKey: customer.CRMIntegration?.CloseCRM?.APIKey,
            CloseCRMLeadSourceCustomField: customer.CRMIntegration?.CloseCRM?.LeadSourceCustomField,
            EmailNotifications: customer.CRMIntegration?.EmailNotifications,
            Status: customer.Status,
            Campaigns: customer.Campaigns,
            LeadType: customer.LeadType,
            RewardsTotal: customer.RewardsTotal ?? 0
        }

        return user_data;
    } catch (error) {
        console.error('Error fetching customer from DynamoDB:', error);
        throw error;
    }
}

export async function updateCustomer(id, stateLicenses, ringyAuthTokenVeteranWebsite, ringySIDVeteranWebsite, ringyAuthTokenVeteranWebsiteAged, ringySIDVeteranWebsiteAged, ringyAuthTokenLegacyWebsite, ringySIDLegacyWebsite, ringyAuthTokenLegacyWebsiteAged, ringySIDLegacyWebsiteAged, ringyAuthTokenLegacyMortgage, ringySIDLegacyMortgage, ringyAuthTokenLegacyMortgageAged, ringySIDLegacyMortgageAged, ringyAuthTokenFinalExpense, ringySIDFinalExpense, ghlAccessToken, ghlLocationID, closeCRMAPIKey, closeCRMLeadSourceCustomField, emailNotifications, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const command = new UpdateCommand({
            TableName: `lifejacketleads-customers-${tableEnv}`,
            Key: {
                CustomerId: id
            },
            UpdateExpression:
                "SET #StateLicenses = :stateLicenses, " +
                "#CRM.#EmailNotifications = :emailNotifications, " +
                "#CRM.#GoHighLevel.#AccessToken = :ghlAccessToken, " +
                "#CRM.#GoHighLevel.#LocationID = :ghlLocationId, " +
                "#CRM.#CloseCRM.#APIKey = :closeCRMAPIKey, " +
                "#CRM.#CloseCRM.#LeadSourceCustomField = :closeCRMLeadSourceCF, " +
                "#LeadType.#VeteranWebsite.#Fresh.#CRM.#Ringy.#AuthToken = :vetAuthToken, " +
                "#LeadType.#VeteranWebsite.#Fresh.#CRM.#Ringy.#SID = :vetSid, " +
                "#LeadType.#VeteranWebsite.#Aged.#CRM.#Ringy.#AuthToken = :vetAuthTokenAged, " +
                "#LeadType.#VeteranWebsite.#Aged.#CRM.#Ringy.#SID = :vetSidAged, " +
                "#LeadType.#LegacyWebsite.#Fresh.#CRM.#Ringy.#AuthToken = :legacyAuthToken, " +
                "#LeadType.#LegacyWebsite.#Fresh.#CRM.#Ringy.#SID = :legacySid, " +
                "#LeadType.#LegacyWebsite.#Aged.#CRM.#Ringy.#AuthToken = :legacyAuthTokenAged, " +
                "#LeadType.#LegacyWebsite.#Aged.#CRM.#Ringy.#SID = :legacySidAged, " +
                "#LeadType.#LegacyMortgage.#Fresh.#CRM.#Ringy.#AuthToken = :octAuthToken, " +
                "#LeadType.#LegacyMortgage.#Fresh.#CRM.#Ringy.#SID = :octSid, " +
                "#LeadType.#LegacyMortgage.#Aged.#CRM.#Ringy.#AuthToken = :octAuthTokenAged, " +
                "#LeadType.#LegacyMortgage.#Aged.#CRM.#Ringy.#SID = :octSidAged, " +
                "#LeadType.#FinalExpense.#Fresh.#CRM.#Ringy.#AuthToken = :feAuthToken, " +
                "#LeadType.#FinalExpense.#Fresh.#CRM.#Ringy.#SID = :feSid",
            ExpressionAttributeNames: {
                "#StateLicenses": "StateLicenses",
                "#EmailNotifications": "EmailNotifications",
                "#CRM": "CRMIntegration",
                "#GoHighLevel": "GoHighLevel",
                "#AccessToken": "AccessToken",
                "#LocationID": "LocationID",
                "#CloseCRM": "CloseCRM",
                "#APIKey": "APIKey",
                "#LeadSourceCustomField": "LeadSourceCustomField",
                "#LeadType": "LeadType",
                "#VeteranWebsite": "VeteranWebsite",
                "#LegacyWebsite": "LegacyWebsite",
                "#LegacyMortgage": "LegacyMortgage",
                "#FinalExpense": "FinalExpense",
                "#Fresh": "Fresh",
                "#Aged": "Aged",
                "#Ringy": "Ringy",
                "#SID": "SID",
                "#AuthToken": "AuthToken"
            },
            ExpressionAttributeValues: {
                ":stateLicenses": stateLicenses,
                ":emailNotifications": emailNotifications,
                ":ghlAccessToken": ghlAccessToken.replace(/\s+/g, ""),
                ":ghlLocationId": ghlLocationID.replace(/\s+/g, ""),
                ":closeCRMAPIKey": closeCRMAPIKey.replace(/\s+/g, ""),
                ":closeCRMLeadSourceCF": closeCRMLeadSourceCustomField.replace(/\s+/g, ""),
                ":vetAuthToken": ringyAuthTokenVeteranWebsite.replace(/\s+/g, ""),
                ":vetSid": ringySIDVeteranWebsite.replace(/\s+/g, ""),
                ":vetAuthTokenAged": ringyAuthTokenVeteranWebsiteAged.replace(/\s+/g, ""),
                ":vetSidAged": ringySIDVeteranWebsiteAged.replace(/\s+/g, ""),
                ":legacyAuthToken": ringyAuthTokenLegacyWebsite.replace(/\s+/g, ""),
                ":legacySid": ringySIDLegacyWebsite.replace(/\s+/g, ""),
                ":legacyAuthTokenAged": ringyAuthTokenLegacyWebsiteAged.replace(/\s+/g, ""),
                ":legacySidAged": ringySIDLegacyWebsiteAged.replace(/\s+/g, ""),
                ":octAuthToken": ringyAuthTokenLegacyMortgage.replace(/\s+/g, ""),
                ":octSid": ringySIDLegacyMortgage.replace(/\s+/g, ""),
                ":octAuthTokenAged": ringyAuthTokenLegacyMortgageAged.replace(/\s+/g, ""),
                ":octSidAged": ringySIDLegacyMortgageAged.replace(/\s+/g, ""),
                ":feAuthToken": ringyAuthTokenFinalExpense.replace(/\s+/g, ""),
                ":feSid": ringySIDFinalExpense.replace(/\s+/g, "")
            },
            ReturnValues: "UPDATED_NEW"
        });

        const response = await docClient.send(command);
        return response.Attributes;
    } catch (error) {
        console.error('Error updating customer in DynamoDB:', error);
        throw error;
    }
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