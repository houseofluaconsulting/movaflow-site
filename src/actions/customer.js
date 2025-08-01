import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CUSTOMER_ENDPOINT = endpoints.customer;

export async function getCustomer(id) {
    const data = { id };
    const response = await axios.post(CUSTOMER_ENDPOINT, data, { params: { endpoint: 'get-customer' } })
    const customer = await response.data
    
    const user_data = {
        ID: customer.ID,
        Phone: customer.Phone,
        Email: customer.Email,
        Name: customer.Name,
        StripeID: customer.StripeID,
        StateLicenses: customer.StateLicenses,
        RingySIDFEXNumVerified: customer.LeadType.FEXNumVerified.Fresh.CRMIntegration.Ringy.SID,
        RingyAuthTokenFEXNumVerified: customer.LeadType.FEXNumVerified.Fresh.CRMIntegration.Ringy.AuthToken,
        RingySIDFinalExpense: customer.LeadType.FinalExpense.Fresh.CRMIntegration.Ringy.SID,
        RingyAuthTokenFinalExpense: customer.LeadType.FinalExpense.Fresh.CRMIntegration.Ringy.AuthToken
    }
    
    console.log(user_data)

    return user_data
}