import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { redeemRewards } from 'src/actions/rewards';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function RewardsConfirmDialog({ open, onClose, credit, opportunity, type, leadType, amount, onRedeemed }) {
  const { user } = useAuthContext();
  const termsAccepted = useBoolean();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Confirm Reward Redemption
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent >
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
            {credit} {opportunity} {type}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Iconify icon="solar:star-bold-duotone" width={20} sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ color: 'text.disabled' }}>
              {amount} Points
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 4, display: 'block' }}>
          Please review and accept our{' '}
          <Link href="https://lifejacketleads.com/terms-of-service/" target="_blank" rel="noopener">
            Terms of Service
          </Link>
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted.value}
              onChange={termsAccepted.onToggle}
            />
          }
          label={<Typography variant="caption">I have read and agree to the terms and conditions and confirm the points redemption.</Typography>}
          sx={{display: 'flex' }}
        />
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={async () => {
              await redeemRewards(user?.id, opportunity, credit, leadType, amount, user.idToken.toString());
              onClose();
              if (onRedeemed) await onRedeemed();
            }}
            autoFocus
            color="primary"
            disabled={!termsAccepted.value}
          >
            Redeem Points
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
