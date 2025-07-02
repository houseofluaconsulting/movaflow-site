import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { createCheckoutSession } from 'src/actions/checkout';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function PricingCard({ card, sx, ...other }) {
  const { user } = useAuthContext();
  const { subscription, price, caption, lists, labelAction, priceId } = card;

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

  const isBasic = subscription === '20 Mortgage Leads';
  const isDiscount10 = subscription === '30 Mortgage Leads';
  const isDiscount15 = subscription === '40 Mortgage leads';

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

  const renderSubscription = () => (
    <Stack spacing={0}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {subscription}
      </Typography>
      <Typography variant="subtitle2">{caption}</Typography>
    </Stack>
  );

  const renderPrice = () =>
  (
    <Box sx={{ display: 'flex' }}>
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
        / mo
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
      {user?.id}

      {lists.map((item) => (
        <Box key={item} sx={{ gap: 1, display: 'flex', typography: 'body2', alignItems: 'center' }}>
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

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderList()}

      <Button
        onClick={() => createCheckoutSession(priceId, 'cus_SbgW0RM19rPIsg', 1)}
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
