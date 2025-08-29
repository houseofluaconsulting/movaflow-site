import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CUSTOMER_ENDPOINT = endpoints.customer;

export async function getCustomer(id) {
    const data = { id };
    const response = await axios.post(CUSTOMER_ENDPOINT, data, { params: { endpoint: 'get-customer' } })
    const customer = await response.data

    console.log(customer)
    
    const user_data = {
        ID: customer.ID,
        Phone: customer.Phone,
        Email: customer.Email,
        Name: customer.Name,
        StripeId: customer.StripeId,
        StateLicenses: customer.StateLicenses,
        RingySIDVeteranWebsite: customer.LeadType.VeteranWebsite.Fresh.CRMIntegration.Ringy.SID,
        RingyAuthTokenVeteranWebsite: customer.LeadType.VeteranWebsite.Fresh.CRMIntegration.Ringy.AuthToken,
    }
    
    console.log(user_data)

    return user_data
}

export async function updateCustomer(id, stateLicenses) {
    const data = { id , stateLicenses};

    console.log('id: ' + id)
    console.log('stateLicenses: ' + stateLicenses)
    // console.log('ringyAuthTokenVeteranWebsite: ' + ringyAuthTokenVeteranWebsite)
    // console.log('ringySIDVeteranWebsite: ' + ringySIDVeteranWebsite)

    const response = await axios.post(CUSTOMER_ENDPOINT, data, { params: { endpoint: 'update-customer' } })
    const response_data = await response.data
    
    console.log(response_data)

    return response_data
}