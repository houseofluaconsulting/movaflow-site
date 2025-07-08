import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CUSTOMER_ENDPOINT = endpoints.customer;

export async function getCustomer(id) {
    const data = { id };
    const response = await axios.post(CUSTOMER_ENDPOINT, data, { params: { endpoint: 'get-customer' } })
    const customer_id = response.data.customer
    return customer_id
}