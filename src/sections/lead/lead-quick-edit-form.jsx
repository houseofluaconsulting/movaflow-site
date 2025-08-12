import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { LEAD_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone_number: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  state: zod.string().min(1, { message: 'State is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const defaultValues = {
    full_name: '',
    email: '',
    phone_number: '',
    state: '',
    status: '',
    LeadType: '',
    beneficiary: '',
    created: '',
    birthday: '',
    desired_coverage_amount: '',
    gender: '',
    health_status: '',
    tobacco_use: '',
    current_coverage: '',
    military_status: '',
    health: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Hello')
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      console.log('Hello')
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
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
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Lead Details</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Lead currently cannot be edited.
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {LEAD_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem >
              ))}
            </Field.Select>
            {/* <Field.Text name="LeadType" label="Lead Type"/> */}

            <Field.Text name="full_name" label="Full name" disabled/>
            <Field.Text name="email" label="Email address" disabled/>
            <Field.Phone name="phone_number" label="Phone number"disabled/>

            <Field.Text name="state" label="State" disabled/>
            <Field.Text name="beneficiary" label="Beneficiary" disabled/>
            <Field.Text name="gender" label="Gender" disabled/>
            <Field.Text name="birthday" label="Birthday" disabled/>
            <Field.Text name="created" label="Recieved" disabled/>
            <Field.Text name="desired_coverage_amount" label="Desired Coverage Amount" disabled/>
            <Field.Text name="current_coverage" label="Current Coverage" disabled/>
            <Field.Text name="military_status" label="Military Status" disabled/>
            <Field.Text name="tobacco_use" label="Tobacco Use" disabled/>
            <Field.Text name="health" label="Health Status" disabled/>
            
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting} disabled>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
