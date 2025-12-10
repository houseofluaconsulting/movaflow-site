import { getCustomer } from 'src/actions/customer'
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CHECKOUT_ENDPOINT = endpoints.checkout;

export async function createCheckoutSession(priceId, userId, quantity, consentId) {
    const customer = await getCustomer(userId)
    const stripeId = customer.StripeId;
    const data = { priceId, stripeId, quantity, consentId };
    const response = await axios.post(CHECKOUT_ENDPOINT, data, { params: { endpoint: 'create-checkout-session' } });
    window.location.replace(response.data.url);
}