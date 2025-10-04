import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { fData } from 'src/utils/format-number';

import { getCustomer } from 'src/actions/customer'
import { updateCustomer } from 'src/actions/customer'

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';
import { useAuthContext } from 'src/auth/hooks';


// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  displayName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  stateLicenses: zod.string().array().min(5, { message: 'Choose at 5 states!' }),
  ringySIDVeteranWebsite: zod.string(),
  ringyAuthTokenVeteranWebsite: zod.string(),
  ringySIDLegacyWebsite: zod.string(),
  ringyAuthTokenLegacyWebsite: zod.string(),
  ghlAccessToken: zod.string(),
  ghlLocationID: zod.string(),
  closeCRMAPIKey: zod.string(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user } = useAuthContext();

  const [userData, setData] = useState([]);
  

  useEffect(() => {
    async function fetchData() {
      const promise = getCustomer(user?.id); // returns a Promise that resolves to an array
      const result = await promise; // result is the array
      setData(result);
      
    }
    fetchData();
  }, []);


  const currentUser = {
    id: user?.id,
    displayName: user?.displayName,
    email: user?.email,
    phoneNumber: userData['Phone'],
    stateLicenses: userData['StateLicenses'],
    ringySIDVeteranWebsite: userData['RingySIDVeteranWebsite'] ?? "",
    ringyAuthTokenVeteranWebsite: userData['RingyAuthTokenVeteranWebsite'] ?? "",
    ringySIDLegacyWebsite: userData['RingySIDLegacyWebsite'] ?? "",
    ringyAuthTokenLegacyWebsite: userData['RingyAuthTokenLegacyWebsite'] ?? "",
    ghlAccessToken: userData['GHLAccessToken'] ?? "",
    ghlLocationID: userData['GHLocationID'] ?? "",
    closeCRMAPIKey: userData['CloseCRMAPIKey'] ?? "",
  };

  const defaultValues = {
    displayName: '',
    email: '',
    phoneNumber: '',
    stateLicenses: [],
    ringySIDVeteranWebsite: '',
    ringyAuthTokenVeteranWebsite: '',
    ringySIDLegacyWebsite: '',
    ringyAuthTokenLegacyWebsite: '',
    ghlAccessToken: '',
    ghlLocationID: '',
    closeCRMAPIKey: '',
  };

  console.log("State Licenses:" + currentUser.stateLicenses)

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    const promise = updateCustomer(user?.id, data.stateLicenses, data.ringyAuthTokenVeteranWebsite, data.ringySIDVeteranWebsite, data.ringyAuthTokenLegacyWebsite, data.ringySIDLegacyWebsite, data.ghlAccessToken, data.ghlLocationID, data.closeCRMAPIKey);
  
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      data.id = currentUser.id
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          {/* <Alert variant="outlined" severity="info" sx={{ mb: 1 }}>
                    Only <b>State Licenses</b> can be edited.
                  </Alert> */}
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Name" disabled />
              <Field.Text name="email" label="Email address" disabled />
              <Field.Phone name="phoneNumber" label="Phone Number" disabled />

            </Box>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Typography variant="subtitle2">State Licenses</Typography>
              <Field.Autocomplete
                name="stateLicenses"
                multiple
                disableCloseOnSelect
                options={US_STATE_OPTIONS.map((option) => option)}
                getOptionLabel={(option) => option}
                slotProps={{
                  chip: { color: 'info' },
                }}
              
                
              />
            </Stack>
            <Stack spacing={3} sx={{ mt: 6 }}>
              
              <Typography variant="subtitle6">Ringy Integration</Typography>
              <Typography variant="subtitle2">Veteran Website Lead Vendor</Typography>
              <Field.Text name="ringySIDVeteranWebsite" label="sid"/>
              <Field.Text name="ringyAuthTokenVeteranWebsite" label="authToken"/>

              <Typography variant="subtitle2">Legacy Website Lead Vendor</Typography>
              <Field.Text name="ringySIDLegacyWebsite" label="sid"/>
              <Field.Text name="ringyAuthTokenLegacyWebsite" label="authToken"/>
            </Stack>

            <Stack spacing={3} sx={{ mt: 6 }}>
              
              <Typography variant="subtitle6">GoHighLevel Integration</Typography>
              <Field.Text name="ghlAccessToken" label="Access Token"/>
              <Field.Text name="ghlLocationID" label="Location ID"/>
            </Stack>

            <Stack spacing={3} sx={{ mt: 6 }}>
              
              <Typography variant="subtitle6">Close CRM Integration</Typography>
              <Typography variant="caption">Settings → Developer → API Keys, then click + New API Key</Typography>
              <Field.Text name="closeCRMAPIKey" label="API Key"/>
              {/* Settings → Developer → API Keys, then click + New API Key */}
              
            </Stack>


            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              {/* <Autocomplete

                fullWidth
                multiple
                limitTags={20}
                options={usStates}
                getOptionLabel={(option) => option.state}
                renderInput={(params) => (
                  <TextField {...params} name="stateList" label="State Licenses" />
                )}
                slotProps={{
                  chip: { size: 'small', variant: 'soft' },
                }}
              /> */}

              <Button type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}

// ----------------------------------------------------------------------

const usStates = [
  { state: 'Alabama', stateCode: 'AL' },
  { state: 'Alaska', stateCode: 'AK' },
  { state: 'Arizona', stateCode: 'AZ' },
  { state: 'Arkansas', stateCode: 'AR' },
  { state: 'California', stateCode: 'CA' },
  { state: 'Colorado', stateCode: 'CO' },
  { state: 'Connecticut', stateCode: 'CT' },
  { state: 'Delaware', stateCode: 'DE' },
  { state: 'Florida', stateCode: 'FL' },
  { state: 'Georgia', stateCode: 'GA' },
  { state: 'Hawaii', stateCode: 'HI' },
  { state: 'Idaho', stateCode: 'ID' },
  { state: 'Illinois', stateCode: 'IL' },
  { state: 'Indiana', stateCode: 'IN' },
  { state: 'Iowa', stateCode: 'IA' },
  { state: 'Kansas', stateCode: 'KS' },
  { state: 'Kentucky', stateCode: 'KY' },
  { state: 'Louisiana', stateCode: 'LA' },
  { state: 'Maine', stateCode: 'ME' },
  { state: 'Maryland', stateCode: 'MD' },
  { state: 'Massachusetts', stateCode: 'MA' },
  { state: 'Michigan', stateCode: 'MI' },
  { state: 'Minnesota', stateCode: 'MN' },
  { state: 'Mississippi', stateCode: 'MS' },
  { state: 'Missouri', stateCode: 'MO' },
  { state: 'Montana', stateCode: 'MT' },
  { state: 'Nebraska', stateCode: 'NE' },
  { state: 'Nevada', stateCode: 'NV' },
  { state: 'New Hampshire', stateCode: 'NH' },
  { state: 'New Jersey', stateCode: 'NJ' },
  { state: 'New Mexico', stateCode: 'NM' },
  { state: 'New York', stateCode: 'NY' },
  { state: 'North Carolina', stateCode: 'NC' },
  { state: 'North Dakota', stateCode: 'ND' },
  { state: 'Ohio', stateCode: 'OH' },
  { state: 'Oklahoma', stateCode: 'OK' },
  { state: 'Oregon', stateCode: 'OR' },
  { state: 'Pennsylvania', stateCode: 'PA' },
  { state: 'Rhode Island', stateCode: 'RI' },
  { state: 'South Carolina', stateCode: 'SC' },
  { state: 'South Dakota', stateCode: 'SD' },
  { state: 'Tennessee', stateCode: 'TN' },
  { state: 'Texas', stateCode: 'TX' },
  { state: 'Utah', stateCode: 'UT' },
  { state: 'Vermont', stateCode: 'VT' },
  { state: 'Virginia', stateCode: 'VA' },
  { state: 'Washington', stateCode: 'WA' },
  { state: 'West Virginia', stateCode: 'WV' },
  { state: 'Wisconsin', stateCode: 'WI' },
  { state: 'Wyoming', stateCode: 'WY' }
];

export const US_STATE_OPTIONS = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];