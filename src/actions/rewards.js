import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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

export async function redeemRewards(customerId, opportunity, credit, leadType, amount, idToken) {
    try {
        const docClient = getDynamoDBClient(idToken);
        const tableEnv = import.meta.env.VITE_DYNAMODB_TABLE_ENV;

        const orderId = crypto.randomUUID().replace(/-/g, '').slice(0, 22);
        const now = new Date();
        const created = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')}/${now.getUTCFullYear()}, ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;

        const creditMap = {
            Fresh: 0,
            Aged: 0,
        };
        creditMap[opportunity] = Number(credit);

        const command = new PutCommand({
            TableName: `lifejacketleads-orders-${tableEnv}`,
            Item: {
                OrderId: orderId,
                Created: created,
                Credit: creditMap,
                CustomerId: customerId,
                LeadType: leadType,
                Status: 'Redeemed',
                Type: 'Rewards',
            },
        });

        await docClient.send(command);

        const rewardCommand = new PutCommand({
            TableName: `lifejacketleads-rewards-${tableEnv}`,
            Item: {
                RewardId: crypto.randomUUID(),
                Created: created,
                CustomerId: customerId,
                OrderId: orderId,
                Points: Number(amount),
                RewardType: 'Redeemed',
            },
        });

        await docClient.send(rewardCommand);

        const updateCustomerCommand = new UpdateCommand({
            TableName: `lifejacketleads-customers-${tableEnv}`,
            Key: { CustomerId: customerId },
            UpdateExpression: 'SET RewardsTotal = RewardsTotal - :points',
            ExpressionAttributeValues: {
                ':points': Number(amount),
            },
        });

        await docClient.send(updateCustomerCommand);

        await issueRewardsCredit(docClient, tableEnv, customerId, leadType, opportunity, Number(credit));

        console.log('Reward redeemed successfully:', { orderId, customerId, leadType });
        return orderId;
    } catch (error) {
        console.error('Error redeeming rewards:', error);
        throw error;
    }
}

async function issueRewardsCredit(docClient, tableEnv, customerId, leadType, opportunity, creditAmount) {
    // Get priority from campaigns table
    const campaignResponse = await docClient.send(new GetCommand({
        TableName: `lifejacketleads-campaigns-${tableEnv}`,
        Key: { LeadType: leadType },
    }));
    const maxPriority = campaignResponse.Item?.Priority?.[opportunity] ?? 0;

    // Get current customer credit/priority
    const customerResponse = await docClient.send(new GetCommand({
        TableName: `lifejacketleads-customers-${tableEnv}`,
        Key: { CustomerId: customerId },
    }));
    const currentCredit = customerResponse.Item?.LeadType?.[leadType]?.[opportunity]?.Credit ?? 0;
    let currentPriority = customerResponse.Item?.LeadType?.[leadType]?.[opportunity]?.Priority ?? 0;

    console.log('issueRewardsCredit values:', { customerId, leadType, opportunity, creditAmount, currentCredit, currentPriority, maxPriority });

    // If priority is 0, set to max + 1 and update campaigns table
    if (currentPriority === 0) {
        currentPriority = maxPriority + 1;
        await docClient.send(new UpdateCommand({
            TableName: `lifejacketleads-campaigns-${tableEnv}`,
            Key: { LeadType: leadType },
            UpdateExpression: 'SET #priority.#opp = :priority',
            ExpressionAttributeNames: {
                '#priority': 'Priority',
                '#opp': opportunity,
            },
            ExpressionAttributeValues: {
                ':priority': currentPriority,
            },
        }));
    }

    // Update customer lead credit and priority
    const newCredit = currentCredit + creditAmount;
    await docClient.send(new UpdateCommand({
        TableName: `lifejacketleads-customers-${tableEnv}`,
        Key: { CustomerId: customerId },
        UpdateExpression: 'SET #lt.#leadType.#opp.#credit = :credit, #lt.#leadType.#opp.#pri = :priority',
        ExpressionAttributeNames: {
            '#lt': 'LeadType',
            '#leadType': leadType,
            '#opp': opportunity,
            '#credit': 'Credit',
            '#pri': 'Priority',
        },
        ExpressionAttributeValues: {
            ':credit': newCredit,
            ':priority': currentPriority,
        },
    }));

    console.log('Rewards credit issued:', { customerId, leadType, opportunity, newCredit });
}
