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

import { updateLead } from 'src/actions/leads'
import { LEAD_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  full_name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone_number: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  state: zod.string().min(1, { message: 'State is required!' }),
  // Not required
  Status: zod.string(),
  contact_id: zod.string(),
  Note: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const defaultValues = {
    contact_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    state: '',
    Status: '',
    LeadType: '',
    beneficiary: '',
    Created: '',
    birthday: '',
    age: '',
    desired_coverage_amount: '',
    gender: '',
    health_status: '',
    tobacco_use: '',
    current_coverage: '',
    military_status: '',
    health: '',
    Note: ''
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
    const promise = updateLead(data.contact_id, data.Status, data.email, data.Note);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
      const reloadAfterDelay = () => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
      reloadAfterDelay();
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
            Leads may be updated either through adding a <b>Note</b> or by marking them as <b>Sold/Unsold</b>.
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="Status" label="Status">
              {LEAD_STATUS_OPTIONS.map((Status) => (
                <MenuItem key={Status.value} value={Status.value}>
                  {Status.label}
                </MenuItem >
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="LeadType" label="Lead Type" disabled />
            <Field.Text name="Created" label="Recieved" disabled />

            <Field.Text name="full_name" label="Full Name" disabled />
            <Field.Text name="email" label="Email Address" disabled />
            <Field.Phone name="phone_number" label="Phone Number" disabled />
            <Field.Text name="state" label="State" disabled />
            <Field.Text name="beneficiary" label="Beneficiary" disabled />
            <Field.Text name="gender" label="Gender" disabled />
            <Field.Text name="birthday" label="Birthday" disabled />
            <Field.Text name="age" label="Age" disabled />
            <Field.Text name="desired_coverage_amount" label="Desired Coverage Amount" disabled />
            <Field.Text name="current_coverage" label="Current Coverage" disabled />
            <Field.Text name="military_status" label="Military Status" disabled />
            <Field.Text name="tobacco_use" label="Tobacco Use" disabled />
            <Field.Text name="health" label="Health Status" disabled />

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="Note" label="Note" multiline rows={4} />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
