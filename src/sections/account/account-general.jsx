import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { fData } from 'src/utils/format-number';

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
  stateList: zod
    .object({})
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user } = useAuthContext();

  const currentUser = {
    displayName: user?.displayName,
    email: user?.email,
    phoneNumber: '+12152050650',
    stateList: {}
  };

  const defaultValues = {
    displayName: '',
    email: '',
    phoneNumber: '',
    stateList: {}
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
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
              <Field.Phone name="phoneNumber" label="Phone number" disabled />
              
            </Box>
                

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Autocomplete
                  
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
                />

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