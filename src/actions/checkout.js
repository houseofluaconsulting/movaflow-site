import { getCustomer } from 'src/actions/customer'
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CHECKOUT_ENDPOINT = endpoints.checkout;

export async function createCheckoutSession(priceId, userId, quantity) {
    const customer = await getCustomer(userId)
    const customerId = customer.StripeID;
    console.log(customerId)
    const data = { priceId, customerId, quantity };
    const response = await axios.post(CHECKOUT_ENDPOINT, data, { params: { endpoint: 'create-checkout-session' } });
    window.location.replace(response.data.url);
}