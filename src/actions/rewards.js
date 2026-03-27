import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// ----------------------------------------------------------------------

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

export async function getRewards(customerId, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const items = [];
        let lastEvaluatedKey = null;

        while (true) {
            const command = new QueryCommand({
                TableName: `lifejacketleads-rewards-${tableEnv}`,
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

        // Enrich rewards with order/campaign names
        const enriched = await Promise.all(items.map(async (reward) => {
            if (!reward.OrderId) return reward;

            try {
                // Look up order to get ProductId and LeadType
                const orderResponse = await docClient.send(new GetCommand({
                    TableName: `lifejacketleads-orders-${tableEnv}`,
                    Key: { OrderId: reward.OrderId },
                }));
                const order = orderResponse.Item;
                if (!order?.ProductId || !order?.LeadType) return reward;

                // Look up campaign by LeadType to get product Name
                const campaignResponse = await docClient.send(new GetCommand({
                    TableName: `lifejacketleads-campaigns-${tableEnv}`,
                    Key: { LeadType: order.LeadType },
                }));
                const campaign = campaignResponse.Item;
                const productName = campaign?.StripeProducts?.[order.ProductId]?.Name;

                return productName ? { ...reward, RewardOrderName: productName } : reward;
            } catch (err) {
                console.error('Error enriching reward:', err);
                return reward;
            }
        }));

        return enriched;
    } catch (error) {
        console.error('Error fetching rewards from DynamoDB:', error);
        throw error;
    }
}
