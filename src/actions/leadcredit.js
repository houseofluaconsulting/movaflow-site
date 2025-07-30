import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const LEADS_ENDPOINT = endpoints.leads;

export async function getLeadCredit(id) {
    const data = { id };
    const response = await axios.post(LEADS_ENDPOINT, data, { params: { endpoint: 'get-lead-credit' } })
    const leads_credit = await response.data

    console.log(leads_credit)

    return leads_credit
}