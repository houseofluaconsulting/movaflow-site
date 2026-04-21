import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { updateLead } from 'src/actions/leads'
import { LEAD_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

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
  Note: zod.string().optional().default(''),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, campaigns, open, onClose, created, delivered, onUpdateSuccess }) {
  const { user } = useAuthContext();

  const campaignData = campaigns?.find((c) => c.LeadType === currentUser?.LeadType)?.Data || {};
  const alwaysShownKeys = ['full_name', 'phone_number', 'state', 'email'];
  const campaignFields = Object.entries(campaignData).filter(([key]) => !alwaysShownKeys.includes(key));

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
    desired_coverage_type: '',
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
    const promise = updateLead(data.contact_id, data.Status, data.email, data.Note, user.idToken.toString());

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      if (onUpdateSuccess) {
        onUpdateSuccess(data);
      }
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

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Box
              sx={{
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                borderRadius: 1.5,
                p: 2.5,
              }}
            >
              <Stack sx={{ typography: 'body2', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {currentUser?.full_name}
                </Typography>
                <Box component="span" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {currentUser?.email}
                </Box>
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {currentUser?.phone_number}
                </Box>
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {currentUser?.state}
                </Box>
              </Stack>

              <Stack sx={{ typography: 'body2', alignItems: 'flex-end' }}>
                <Label
                  variant="soft"
                  color={currentUser?.Opportunity === 'Fresh' ? 'primary' : 'secondary'}
                >
                  {(currentUser?.LeadType === 'VeteranWebsite'
                    ? 'Veteran'
                    : currentUser?.LeadType === 'LegacyWebsite'
                      ? 'Legacy'
                      : currentUser?.LeadType === 'FinalExpense'
                        ? 'Final Expense'
                        : currentUser?.LeadType === 'OctavianMortgage'
                          ? 'Octavian Mortgage'
                          : currentUser?.LeadType === '`LegacyMortgage`'
                            ? 'Legacy Mortgage'
                            : currentUser?.LeadType)}{' '}{currentUser?.Opportunity}
                </Label>
                <Box component="span" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  <b>Created:</b> {created}
                </Box>
                <Box component="span" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  <b>Delivered:</b> {delivered}
                </Box>
              </Stack>
            </Box>

            {campaignFields.map(([fieldKey, fieldLabel]) =>
              currentUser?.[fieldKey] ? (
                <Field.Text key={fieldKey} name={fieldKey} label={fieldLabel} disabled />
              ) : null
            )}
            <Alert variant="outlined" severity="info" sx={{ gridColumn: '1 / -1' }}>
              Leads may be updated either through adding a <b>Note</b> or by marking them as <b>Sold/Unsold</b>.
            </Alert>
            <Field.Text name="Note" label="Note" multiline rows={4} sx={{ gridColumn: '1 / 2' }} />

            <Field.Select name="Status" label="Status" sx={{ gridColumn: '2 / 3' }}>
              {LEAD_STATUS_OPTIONS.map((Status) => (
                <MenuItem key={Status.value} value={Status.value}>
                  {Status.label}
                </MenuItem >
              ))}
            </Field.Select>

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
