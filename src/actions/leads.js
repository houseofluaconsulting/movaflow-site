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

// export const getLeads = async (id) => {
//     const data = { id };
//     const response = await axios.post(LEADS_ENDPOINT, data, { params: { endpoint: 'get-leads' } })
//     const leads = await response.data
//     return [leads];
// };
