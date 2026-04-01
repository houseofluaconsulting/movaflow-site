import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { RewardsConfirmDialog } from './rewards-confirm-dialog';

// ----------------------------------------------------------------------

export function RewardsPricingCard({ card, rewardsTotal = 0, onRedeemed, sx, ...other }) {
  const { credit, opportunity, type, leadType, amount, labelAction } = card;
  const canRedeem = rewardsTotal >= Number(amount);
  const confirmDialog = useBoolean();

  const renderSubscription = () => (
    <Stack spacing={0}>
      <Box sx={{ display: 'flex', mt: -3 }}>
        <Typography variant="h3" sx={{ textTransform: 'capitalize' }}>
          {credit}
        </Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'h3',
            fontWeight: 400,
          }}
        >
          {opportunity}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
          {type}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
        <Iconify icon="solar:star-bold-duotone" width={20} sx={{ color: 'warning.main' }} />
        <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'text.disabled' }}>
          {amount} Points
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          p: 3,
          gap: 2,
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.default',
          border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          minHeight: 150,
          boxShadow: theme.vars.customShadows.card,
          position: 'relative',
          ...(!canRedeem && {
            opacity: 0.5,
            filter: 'grayscale(0.5)',
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {!canRedeem && (
        <Iconify
          icon="solar:lock-bold"
          width={24}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.disabled' }}
        />
      )}

      {renderSubscription()}

      <RewardsConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        credit={credit}
        opportunity={opportunity}
        type={type}
        leadType={leadType}
        amount={amount}
        onRedeemed={onRedeemed}
      />

      <Button
        onClick={confirmDialog.onTrue}
        fullWidth
        size="medium"
        variant="contained"
        color="primary"
        disabled={!canRedeem}
      >
        {labelAction}
      </Button>
    </Box>
  );
}
