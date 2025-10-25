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
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { fData } from 'src/utils/format-number';

import { getCustomer } from 'src/actions/customer'
import { updateCustomer } from 'src/actions/customer'

import { Label } from 'src/components/label';
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
  ringySIDVeteranWebsiteAged: zod.string(),
  ringyAuthTokenVeteranWebsiteAged: zod.string(),
  ringySIDLegacyWebsite: zod.string(),
  ringyAuthTokenLegacyWebsite: zod.string(),
  ghlAccessToken: zod.string(),
  ghlLocationID: zod.string(),
  closeCRMAPIKey: zod.string(),
  closeCRMLeadSourceCustomField: zod.string(),
  emailNotifications: zod.boolean(),

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
    ringySIDVeteranWebsiteAged: userData['RingySIDVeteranWebsiteAged'] ?? "",
    ringyAuthTokenVeteranWebsiteAged: userData['RingyAuthTokenVeteranWebsiteAged'] ?? "",
    ringySIDLegacyWebsite: userData['RingySIDLegacyWebsite'] ?? "",
    ringyAuthTokenLegacyWebsite: userData['RingyAuthTokenLegacyWebsite'] ?? "",
    ghlAccessToken: userData['GHLAccessToken'] ?? "",
    ghlLocationID: userData['GHLocationID'] ?? "",
    closeCRMAPIKey: userData['CloseCRMAPIKey'] ?? "",
    closeCRMLeadSourceCustomField: userData['CloseCRMLeadSourceCustomField'] ?? "",
    emailNotifications: userData['EmailNotifications'] ?? "",
  };

  const defaultValues = {
    displayName: '',
    email: '',
    phoneNumber: '',
    stateLicenses: [],
    ringySIDVeteranWebsite: '',
    ringyAuthTokenVeteranWebsite: '',
    ringySIDVeteranWebsiteAged: '',
    ringyAuthTokenVeteranWebsiteAged: '',
    ringySIDLegacyWebsite: '',
    ringyAuthTokenLegacyWebsite: '',
    ghlAccessToken: '',
    ghlLocationID: '',
    closeCRMAPIKey: '',
    closeCRMLeadSourceCustomField: '',
    emailNotifications: false
  };

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
    // console.log(data)

    const promise = updateCustomer(user?.id, data.stateLicenses, data.ringyAuthTokenVeteranWebsite, data.ringySIDVeteranWebsite, data.ringyAuthTokenVeteranWebsiteAged, data.ringySIDVeteranWebsiteAged, data.ringyAuthTokenLegacyWebsite, data.ringySIDLegacyWebsite, data.ghlAccessToken, data.ghlLocationID, data.closeCRMAPIKey, data.closeCRMLeadSourceCustomField, data.emailNotifications);

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
              <Typography
                component="span"
                sx={{
                  mb: -1,
                  fontWeight: 700
                }}
              >
                State Licenses
              </Typography>
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
              <Field.Switch
                name="emailNotifications"
                labelPlacement="start"
                label={
                  <>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      Email Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Send Email Notification when new leads are recieved.
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Stack>

            <Stack spacing={3} sx={{ mt: 6, mb: 2 }}>
              <Typography
                component="span"
                sx={{
                  typography: 'h6',
                  fontWeight: 700
                }}
              >
                CRM Integration
              </Typography>

            </Stack>


            <Stack spacing={3} sx={{ mt: 3 }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: 600
                }}
              >
                Ringy Integration
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 20,
                  display: 'grid',
                  mt: -1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Stack spacing={2} sx={{ mt: 0 }}>
                  <Box sx={{
                    display: 'flex',
                    columnGap: 1,
                  }}>

                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 400 }}>
                      Veteran Website Lead Vendor
                    </Typography>

                    <Label
                      variant="soft"
                      color='primary'
                      sx={{
                        // ml: 10,
                        alignSelf: 'center',
                        typography: 'text',
                        fontWeight: 700
                      }}
                    >
                      Fresh
                    </Label>
                  </Box>

                  <Field.Text name="ringySIDVeteranWebsite" label="sid" />
                  <Field.Text name="ringyAuthTokenVeteranWebsite" label="authToken" />

                </Stack>

                <Stack spacing={2} sx={{ mt: 0 }}>
                  <Box sx={{
                    display: 'flex',
                    columnGap: 1,
                  }}>

                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 400 }}>
                      Veteran Website Lead Vendor
                    </Typography>

                    <Label
                      variant="soft"
                      color='secondary'
                      sx={{
                        // ml: 10,
                        alignSelf: 'center',
                        typography: 'text',
                        fontWeight: 700
                      }}
                    >
                      Aged
                    </Label>
                  </Box>

                  <Field.Text name="ringySIDVeteranWebsiteAged" label="sid" />
                  <Field.Text name="ringyAuthTokenVeteranWebsiteAged" label="authToken" />
                </Stack>


              </Box>

              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 20,
                  display: 'grid',
                  mt: -1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Stack spacing={2} sx={{ mt: 0 }}>
                  <Box sx={{
                    display: 'flex',
                    columnGap: 1,
                  }}>

                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 400 }}>
                      Legacy Website Lead Vendor
                    </Typography>

                    <Label
                      variant="soft"
                      color='primary'
                      sx={{
                        // ml: 10,
                        alignSelf: 'center',
                        typography: 'text',
                        fontWeight: 700
                      }}
                    >
                      Fresh
                    </Label>
                  </Box>

                  <Field.Text name="ringySIDLegacyWebsite" label="sid" />
                  <Field.Text name="ringyAuthTokenLegacyWebsite" label="authToken" />

                </Stack>
              </Box>
            </Stack>

            <Stack spacing={3} sx={{ mt: 6 }}>

              <Typography
                component="span"
                sx={{
                  fontWeight: 600
                }}
              >
                GoHighLevel Integration
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Stack spacing={1} sx={{ mt: -1 }}>
                  <Typography variant="caption">You can get your API Key by going to Settings (bottom left menu) ➡️ Business Profile. Under your basic info you’ll see an API Key and a clipboard 📋 icon to copy & paste.</Typography>
                  <Field.Text name="ghlAccessToken" label="API Key" />
                </Stack>
                <Stack spacing={1} sx={{ mt: -1 }}>
                  <Typography variant="caption">Your URL should look like: app.gohighlevel.com/v2/location/abc123XYZ/dashboard - abc123XYZ would be the Location ID.</Typography>
                  <Field.Text name="ghlLocationID" label="Location ID" />
                </Stack>

              </Box>


            </Stack>

            <Stack spacing={2} sx={{ mt: 6 }}>

              <Typography
                component="span"
                sx={{
                  fontWeight: 600
                }}
              >
                Close CRM Integration
              </Typography>
              <Typography variant="caption">Settings ➡️ Developer ➡️ API Keys, then click + New API Key. Enter a name (something like ‘LifeJacket Leads’) & click Create API Key. Copy 📋 API Key & paste below.</Typography>
              <Field.Text name="closeCRMAPIKey" label="API Key" />
              {/* Settings → Developer → API Keys, then click + New API Key */}
              <Typography variant="caption">Settings ➡️ Custom Fields, Create Select or Lead Custom Field ➡️ press ⋯ button to the left of Custom Field ➡️ 📋 Copy ID (API) & paste below.</Typography>
              <Field.Text name="closeCRMLeadSourceCustomField" label="Lead Source Custom Field ID" />
            </Stack>


            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>

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