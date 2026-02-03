import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { CONFIG } from 'src/global-config';
// import { getCustomer } from 'src/actions/customer'
import { createCheckoutSession } from 'src/actions/checkout';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function PricingCard({ card, sx, ...other }) {
  const { user } = useAuthContext();
  const { credit, opportunity, type, price, amount, lists, labelAction, priceId } = card;
  const termsConstentConfirmDialog = useBoolean();
  const termsAccepted = useBoolean();
  const isProcessing = useBoolean();
  const CONSENT_ID = Math.floor(100000000000 + Math.random() * 900000000000);

  const arrowIcon = () => (
    <SvgIcon
      viewBox="0 0 48 48"
      sx={{
        width: 48,
        height: 48,
        color: 'grey.500',
      }}
    >
      <path
        fill="currentColor"
        d="M10.2147 30.6123C6.71243 22.9891 10.1906 14.9695 17.1738 11.0284C24.2834 7.01748 33.9187 7.08209 41.1519 10.6817C42.6578 11.4331 41.4507 13.5427 39.9511 12.945C33.399 10.3368 25.7611 10.0919 19.3278 13.1729C16.5269 14.4946 14.2131 16.6643 12.7143 19.3746C10.7314 22.9202 11.202 26.5193 11.6878 30.3396C11.8055 31.2586 10.5388 31.3074 10.2147 30.6123Z"
        fillOpacity="0.24"
      />
      <path
        fill="currentColor"
        d="M11.8126 39.0341C9.56032 35.9944 6.83856 32.7706 6.01828 28.9795C5.98242 28.8458 5.99937 28.7036 6.0656 28.5821C6.13183 28.4607 6.24226 28.3694 6.374 28.3271C6.50573 28.2849 6.64867 28.295 6.77316 28.3553C6.89765 28.4157 6.99414 28.5216 7.04263 28.6511C8.43444 31.8092 10.4092 34.463 12.553 37.1099C13.8625 35.3195 14.915 33.2716 16.4773 31.7142C16.6164 31.5741 16.8007 31.4879 16.9974 31.471C17.1941 31.4541 17.3905 31.5075 17.5515 31.6218C17.7125 31.736 17.8277 31.9037 17.8767 32.095C17.9257 32.2863 17.9052 32.4887 17.8189 32.6663C16.5996 35.0298 15.0564 37.2116 13.2339 39.1484C13.1391 39.2464 13.0238 39.3222 12.8963 39.3703C12.7688 39.4185 12.6321 39.4378 12.4963 39.4268C12.3604 39.4159 12.2286 39.375 12.1104 39.3071C11.9922 39.2392 11.8905 39.1459 11.8126 39.0341Z"
        fillOpacity="0.24"
      />
    </SvgIcon>
  );

  const isBasic = type === '20 Final Expense Leads test';
  const isDiscount10 = type === '30 Veteran Website Leads test';
  const isDiscount15 = type === '40 Final Expense leads test';

  const renderIcon = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* {isBasic && <PlanFreeIcon sx={{ width: 64 }} />} */}

      {isDiscount10 &&
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              left: 80,
              bottom: -40,
              display: 'flex',
              position: 'absolute',
            }}
          >
            {arrowIcon()}
            <Box
              component="span"
              sx={{ whiteSpace: 'nowrap', color: 'success.main', typography: 'overline' }}
            >
              save 10%
            </Box>
          </Box>
        </Box>}

      {isDiscount10 &&
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              left: 160,
              bottom: -40,
              display: 'flex',
              position: 'absolute',
            }}
          >
            {arrowIcon()}
            <Box
              component="span"
              sx={{ whiteSpace: 'nowrap', color: 'success.main', typography: 'overline' }}
            >
              save 15%
            </Box>
          </Box>
        </Box>}
    </Box>
  );

  const renderTermsConstentConfirmDialog = () => (
    <Dialog open={termsConstentConfirmDialog.value} onClose={termsConstentConfirmDialog.onFalse}>
        <DialogTitle>Accept Terms & Conditions</DialogTitle>

        <DialogContent sx={{ color: 'text.secondary' }}>
          Please review and accept our{' '}
          <Link href="https://lifejacketleads.com/terms-of-service/" target="_blank" rel="noopener">
            Terms of Service
          </Link>

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted.value}
                onChange={termsAccepted.onToggle}
              />
            }
            label="I have read and agree to the terms and conditions."
            sx={{ mt: 2, display: 'flex' }}
          />
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={termsConstentConfirmDialog.onFalse}>
              Disagree
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                isProcessing.onTrue();
                await createCheckoutSession(priceId, user?.id, 1, CONSENT_ID, user.idToken.toString());
              }}
              autoFocus
              color="primary"
              disabled={!termsAccepted.value}
            >
              Agree
            </Button>
          </Box>
          {isProcessing.value && (
            <Typography variant="caption" sx={{ color: 'primary.main', textAlign: 'center', width: '100%', mt: 2, fontWeight: 'bold' }}>
              Hang tight! We{`'`}re securely redirecting you to Stripe…
            </Typography>
          )}
        </DialogActions>
      </Dialog>
  );

  const renderSubscription = () => (
    <Stack spacing={0} sx={{ mt: -6 }}>
      <Box sx={{ display: 'flex', }}>
        <Typography variant="h3" sx={{ textTransform: 'capitalize', }}>
          {credit}
        </Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'h3',
            fontWeight: 400
          }}
        >
          {opportunity}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', }}>
        <Typography variant="7" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
          {type}
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'text.disabled', mt: 1 }}>{amount}</Typography>
    </Stack>
  );

  const renderPrice = () =>
  (
    <Box sx={{ display: 'flex', }}>
      <Typography variant="h4">$</Typography>

      <Typography variant="h2">{price}</Typography>

      <Typography
        component="span"
        sx={{
          ml: 1,
          alignSelf: 'center',
          typography: 'body2',
          color: 'text.disabled',
        }}
      >
        / lead
      </Typography>
    </Box>
  );

  const renderList = () => (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ typography: 'overline' }}>
          Features
        </Box>
      </Box>

      {lists.map((item, index) => (
        <Box key={index} sx={{ gap: 1, display: 'flex', typography: 'body2', alignItems: 'center' }}>
          <Iconify icon="eva:checkmark-fill" width={16} />
          {item}
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          p: 5,
          gap: 5,
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.default',
          boxShadow: theme.vars.customShadows.card,
          [theme.breakpoints.up('md')]: {
            boxShadow: 'none',
          },
          ...((isBasic || isDiscount10) && {
            borderTopRightRadius: { md: 0 },
            borderBottomRightRadius: { md: 0 },
          }),
          ...((isDiscount10 || isDiscount15) && {
            [theme.breakpoints.up('md')]: {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              ...theme.applyStyles('dark', {
                boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
              }),
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderIcon()}
      {renderSubscription()}
      {renderPrice()}
      {renderTermsConstentConfirmDialog()}

      {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

      {/* {renderList()} */}

      {/* Purchase button */}
      <Button
        onClick={termsConstentConfirmDialog.onTrue}
        // type="submit"
        fullWidth
        size="medium"
        variant="contained"
        color="primary"
      >
        {labelAction}
      </Button>
    </Box>

    
  );
}

export function MixedPricingCard({ card, sx, ...other }) {
  const { user } = useAuthContext();
  const { credit, opportunity, type, description, freshPrice, agedPrice, amount, lists, labelAction, priceId } = card;
  const termsConstentConfirmDialog = useBoolean();
  const termsAccepted = useBoolean();
  const isProcessing = useBoolean();
  const CONSENT_ID = Math.floor(100000000000 + Math.random() * 900000000000);

  const arrowIcon = () => (
    <SvgIcon
      viewBox="0 0 48 48"
      sx={{
        width: 48,
        height: 42,
        color: 'grey.500',
      }}
    >
      <path
        fill="currentColor"
        d="M10.2147 30.6123C6.71243 22.9891 10.1906 14.9695 17.1738 11.0284C24.2834 7.01748 33.9187 7.08209 41.1519 10.6817C42.6578 11.4331 41.4507 13.5427 39.9511 12.945C33.399 10.3368 25.7611 10.0919 19.3278 13.1729C16.5269 14.4946 14.2131 16.6643 12.7143 19.3746C10.7314 22.9202 11.202 26.5193 11.6878 30.3396C11.8055 31.2586 10.5388 31.3074 10.2147 30.6123Z"
        fillOpacity="0.24"
      />
      <path
        fill="currentColor"
        d="M11.8126 39.0341C9.56032 35.9944 6.83856 32.7706 6.01828 28.9795C5.98242 28.8458 5.99937 28.7036 6.0656 28.5821C6.13183 28.4607 6.24226 28.3694 6.374 28.3271C6.50573 28.2849 6.64867 28.295 6.77316 28.3553C6.89765 28.4157 6.99414 28.5216 7.04263 28.6511C8.43444 31.8092 10.4092 34.463 12.553 37.1099C13.8625 35.3195 14.915 33.2716 16.4773 31.7142C16.6164 31.5741 16.8007 31.4879 16.9974 31.471C17.1941 31.4541 17.3905 31.5075 17.5515 31.6218C17.7125 31.736 17.8277 31.9037 17.8767 32.095C17.9257 32.2863 17.9052 32.4887 17.8189 32.6663C16.5996 35.0298 15.0564 37.2116 13.2339 39.1484C13.1391 39.2464 13.0238 39.3222 12.8963 39.3703C12.7688 39.4185 12.6321 39.4378 12.4963 39.4268C12.3604 39.4159 12.2286 39.375 12.1104 39.3071C11.9922 39.2392 11.8905 39.1459 11.8126 39.0341Z"
        fillOpacity="0.24"
      />
    </SvgIcon>
  );

  const isBasic = description === '20 Final Expense Leads test';
  const isDiscount10 = description === '30 Veteran Website Leads test';
  const isDiscount15 = description === '40 Final Expense leads test';

  const renderIcon = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* {isBasic && <PlanFreeIcon sx={{ width: 64 }} />} */}

      {isDiscount10 &&
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              left: 80,
              bottom: -40,
              display: 'flex',
              position: 'absolute',
            }}
          >
            {arrowIcon()}
            <Box
              component="span"
              sx={{ whiteSpace: 'nowrap', color: 'success.main', typography: 'overline' }}
            >
              save 10%
            </Box>
          </Box>
        </Box>}

      {isDiscount10 &&
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              left: 160,
              bottom: -40,
              display: 'flex',
              position: 'absolute',
            }}
          >
            {arrowIcon()}
            <Box
              component="span"
              sx={{ whiteSpace: 'nowrap', color: 'success.main', typography: 'overline' }}
            >
              save 15%
            </Box>
          </Box>
        </Box>}
    </Box>
  );

  const renderTermsConstentConfirmDialog = () => (
    <Dialog open={termsConstentConfirmDialog.value} onClose={termsConstentConfirmDialog.onFalse}>
        <DialogTitle>Accept Terms & Conditions</DialogTitle>

        <DialogContent sx={{ color: 'text.secondary' }}>
          Please review and accept our{' '}
          <Link href="https://lifejacketleads.com/terms-of-service/" target="_blank" rel="noopener">
            Terms of Service
          </Link>

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted.value}
                onChange={termsAccepted.onToggle}
              />
            }
            label="I have read and agree to the terms and conditions."
            sx={{ mt: 2, display: 'flex' }}
          />
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={termsConstentConfirmDialog.onFalse}>
              Disagree
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                isProcessing.onTrue();
                await createCheckoutSession(priceId, user?.id, 1, CONSENT_ID, user.idToken.toString());
              }}
              autoFocus
              color="primary"
              disabled={!termsAccepted.value}
            >
              Agree
            </Button>
          </Box>
          {isProcessing.value && (
            <Typography variant="caption" sx={{ color: 'primary.main', textAlign: 'center', width: '100%', mt: 2, fontWeight: 'bold' }}>
              Hang tight! We{`'`}re securely redirecting you to Stripe…
            </Typography>
          )}
        </DialogActions>
      </Dialog>
  );

  const renderSubscription = () => (
    <Stack spacing={0} sx={{ mt: -6 }}>
      <Box sx={{ display: 'flex', }}>
        <Typography variant="h3" sx={{ textTransform: 'capitalize', }}>
          {credit}
        </Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'h3',
            fontWeight: 400
          }}
        >
          {opportunity}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', }}>
        <Typography variant="h7" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
          {type}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex'}}>
        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 400 }}>
          {description}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'text.disabled', mt: 1 }}>{amount}</Typography>
    </Stack>
  );

  const renderPrice = () =>
  (
    <Stack sx={{ mt: -2 }}>
      <Box sx={{ display: 'flex', mb: -1}}>
        <Typography variant="h6">$</Typography>

        <Typography variant="h3">{freshPrice}</Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'body2',
            color: 'text.disabled',
          }}
        >
          / Fresh lead
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', }}>
        <Typography variant="h6">$</Typography>

        <Typography variant="h3">{agedPrice}</Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'body2',
            color: 'text.disabled',
          }}
        >
          / Aged lead
        </Typography>
      </Box>
    </Stack>

  );

  const renderList = () => (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ typography: 'overline' }}>
          Features
        </Box>
      </Box>

      {lists.map((item, index) => (
        <Box key={index} sx={{ gap: 1, display: 'flex', typography: 'body2', alignItems: 'center' }}>
          <Iconify icon="eva:checkmark-fill" width={16} />
          {item}
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          p: 5,
          gap: 5,
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.default',
          boxShadow: theme.vars.customShadows.card,
          [theme.breakpoints.up('md')]: {
            boxShadow: 'none',
          },
          ...((isBasic || isDiscount10) && {
            borderTopRightRadius: { md: 0 },
            borderBottomRightRadius: { md: 0 },
          }),
          ...((isDiscount10 || isDiscount15) && {
            [theme.breakpoints.up('md')]: {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              ...theme.applyStyles('dark', {
                boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
              }),
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderIcon()}
      {renderSubscription()}
      {renderPrice()}
      {renderTermsConstentConfirmDialog()}

      {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

      {/* {renderList()} */}

      <Button
        onClick={termsConstentConfirmDialog.onTrue}
        // type="submit"
        fullWidth
        size="medium"
        variant="contained"
        color="primary"
      >
        {labelAction}
      </Button>
    </Box>
  );
}
