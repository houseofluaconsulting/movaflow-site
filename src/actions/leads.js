import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const LEADS_ENDPOINT = endpoints.leads;

export async function getLeads(id) {
    const data = { id };
    const response = await axios.post(LEADS_ENDPOINT, data, { params: { endpoint: 'get-leads' } })
    const leads = await response.data

    // console.log(typeof leads);
    // console.log(Array.isArray(leads));

    console.log(leads)

    return [leads, leads]
}

export async function updateLead(contact_id, status, email) {
    const data = { contact_id, status, email};
    const response = await axios.post(LEADS_ENDPOINT, data, { params: { endpoint: 'update-lead' } })
    const response_data = await response.data
    
    console.log(response_data)

    return response_data
}
