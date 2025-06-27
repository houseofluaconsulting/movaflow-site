import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const CHECKOUT_ENDPOINT = endpoints.checkout;

export async function createCheckoutSession(priceId, customerId, quantity) {
    if (enableServer) {
        const data = { priceId, customerId, quantity };
        const response = await axios.post(CHECKOUT_ENDPOINT, data, { params: { endpoint: 'create-checkout-session' } });
        window.location.replace(response.data.url);
    }
}