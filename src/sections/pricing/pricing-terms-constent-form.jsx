import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { updateLead } from 'src/actions/leads'
import { CUSTOMER_STATUS_OPTIONS } from 'src/_mock';
import { issueLeadCredit } from 'src/actions/customer'

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const OPTIONS = ['Option 1', 'Option 2'];

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  CustomerId: zod.string().min(1, { message: 'CustomerId is required!' }),
  LeadType: zod.string().min(1, { message: 'LeadType is required!' }),
  Opportunity: zod.string().min(1, { message: 'Opportunity is required!' }),
  Credit: zod.string()
    .min(1, { message: 'Credit is required!' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Credit must be a positive number',
    }),
});

// ----------------------------------------------------------------------

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US number with country code
    const areaCode = cleaned.slice(1, 4);
    const firstPart = cleaned.slice(4, 7);
    const secondPart = cleaned.slice(7, 11);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  } else if (cleaned.length === 10) {
    // US number without country code
    const areaCode = cleaned.slice(0, 3);
    const firstPart = cleaned.slice(3, 6);
    const secondPart = cleaned.slice(6, 10);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }

  // Return original if not a standard US format
  return phoneNumber;
};

export function PricingTermsConsentForm({ currentUser, open, onClose, created }) {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(OPTIONS[0]);

  const { user } = useAuthContext();

  const defaultValues = {
    CustomerId: '',
    Name: '',
    Email: '',
    Phone: '',
    LeadType: '',
    Opportunity: '',
    Credit: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
    values: {
      ...currentUser,
      LeadType: currentUser?.LeadType || '',
      Opportunity: currentUser?.Opportunity || '',
      Credit: currentUser?.Credit || '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    try {
      console

      const status = await issueLeadCredit(data, user);

      if (status === 200) {
        toast.success('Update success!');
        reset();
        onClose();
        const reloadAfterDelay = () => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        };
        reloadAfterDelay();
      } else {
        toast.error('Update failed. Please try again.');
      }

      // toast.promise(promise, {
      //   loading: 'Loading...',
      //   success: 'Update success!',
      //   error: 'Update error!',
      // });

      // await promise;

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 800 },
        },
      }}
    >
      <DialogTitle>Add Lead Credit</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              mt: 0,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Box
              sx={{
                p: 3,
                gap: 2,
                display: 'flex',
                typography: 'body2',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" component="h2">
                {currentUser.Name}
              </Typography>


              <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
                <Typography variant="caption" component="span" color='text.secondary'>
                  {currentUser.CustomerId}
                </Typography>
              </Box>

              <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
                <Iconify width={24} icon="solar:letter-bold" />
                {currentUser.Email}
              </Box>

              <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
                <Iconify width={24} icon="solar:phone-bold" />
                <span>
                  {formatPhoneNumber(currentUser.Phone)}
                </span>
              </Box>

            </Box>
            <Box
              sx={{
                p: 3,
                gap: 2,
                display: 'flex',
                typography: 'body2',
                flexDirection: 'column',
              }}
            >

              <Field.Select name="LeadType" label="Lead Type">
                {LEAD_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="Opportunity" label="Opportunity">
                {OPPORTUNITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="Credit" label="Credit" />

            </Box>


          </Box>


        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting} color='primary'>
            Issue Credit
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

// ----------------------------------------------------------------------


export const OPPORTUNITY_OPTIONS = [
  { label: 'Fresh', value: 'Fresh' },
  { label: 'Aged', value: 'Aged' },
];

export const LEAD_TYPE_OPTIONS = [
  { label: 'Veteran', value: 'VeteranWebsite' },
  { label: 'Legacy', value: 'LegacyWebsite' },
];
